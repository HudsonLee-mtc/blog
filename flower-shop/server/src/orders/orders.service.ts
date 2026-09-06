import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CartService } from '../cart/cart.service';
import { DataStore } from '../common/data.store';
import { CreateOrderDto, PayOrderDto } from '../common/dto';
import { deliveryFee, shopInfo } from '../common/seed';
import { Order, OrderItem, OrderStatus } from '../common/types';

@Injectable()
export class OrdersService {
  constructor(
    private readonly store: DataStore,
    private readonly cartService: CartService,
  ) {}

  create(dto: CreateOrderDto) {
    const fulfillmentType = dto.fulfillmentType;
    const cart = this.cartService.getCart(dto.clientId, fulfillmentType);
    if (!cart.items.length) {
      throw new BadRequestException('购物车为空');
    }

    let receiverName = dto.receiverName.trim();
    let receiverPhone = dto.receiverPhone.trim();
    let addressDetail = dto.addressDetail?.trim() || '';

    if (fulfillmentType === 'delivery') {
      if (dto.addressId) {
        const list = this.store.addresses.get(dto.clientId) ?? [];
        const found = list.find((a) => a.id === dto.addressId);
        if (!found) throw new BadRequestException('收货地址不存在');
        addressDetail = found.detail;
        receiverName = receiverName || found.name;
        receiverPhone = receiverPhone || found.phone;
      }
      if (!addressDetail) {
        throw new BadRequestException('外送请填写收货地址');
      }
    } else {
      addressDetail = `到店自取 · ${shopInfo.address}`;
    }

    const items: OrderItem[] = cart.items.map((line) => ({
      productId: line!.productId,
      productName: line!.productName,
      cover: line!.cover,
      specId: line!.specId,
      specName: line!.specName,
      price: line!.price,
      quantity: line!.quantity,
      optionIds: line!.optionIds,
      optionNames: line!.optionNames,
      optionsAmount: line!.optionsAmount,
    }));

    const optionsAmount = items.reduce(
      (sum, i) => sum + i.optionsAmount * i.quantity,
      0,
    );
    const fee = fulfillmentType === 'delivery' ? deliveryFee : 0;
    const now = new Date().toISOString();
    const order: Order = {
      id: randomUUID(),
      orderNo: `FS${Date.now()}`,
      status: 'pending_pay',
      fulfillmentType,
      items,
      address: {
        name: receiverName,
        phone: receiverPhone,
        detail: addressDetail,
      },
      deliveryDate: dto.deliveryDate,
      deliverySlot: dto.deliverySlot,
      cardMessage: dto.cardMessage?.trim() ?? '',
      remark: dto.remark?.trim() ?? '',
      goodsAmount: cart.goodsAmount,
      optionsAmount,
      deliveryFee: fee,
      totalAmount: cart.goodsAmount + fee,
      createdAt: now,
      updatedAt: now,
    };

    this.store.orders.unshift(order);
    this.cartService.clear(dto.clientId);
    return order;
  }

  list(clientId?: string) {
    void clientId;
    return this.store.orders;
  }

  get(id: string) {
    const order = this.store.orders.find((o) => o.id === id);
    if (!order) throw new NotFoundException('订单不存在');
    return order;
  }

  pay(id: string, dto: PayOrderDto = {}, clientId = 'guest') {
    const order = this.get(id);
    if (order.status !== 'pending_pay') {
      throw new BadRequestException('当前状态不可支付');
    }
    const method = dto.method ?? 'mock';
    const wallet = this.store.getWallet(clientId);
    if (method === 'wallet') {
      if (wallet.balance < order.totalAmount) {
        throw new BadRequestException('余额不足，请先充值');
      }
      wallet.balance = Number((wallet.balance - order.totalAmount).toFixed(2));
    }
    order.status = 'paid';
    order.updatedAt = new Date().toISOString();
    return { order, wallet };
  }

  advance(id: string, status: OrderStatus) {
    const order = this.get(id);
    order.status = status;
    order.updatedAt = new Date().toISOString();
    return order;
  }
}
