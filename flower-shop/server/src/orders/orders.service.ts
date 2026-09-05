import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CartService } from '../cart/cart.service';
import { DataStore } from '../common/data.store';
import { CreateOrderDto } from '../common/dto';
import { Order, OrderItem, OrderStatus } from '../common/types';

@Injectable()
export class OrdersService {
  constructor(
    private readonly store: DataStore,
    private readonly cartService: CartService,
  ) {}

  create(dto: CreateOrderDto) {
    const cart = this.cartService.getCart(dto.clientId);
    if (!cart.items.length) {
      throw new BadRequestException('购物车为空');
    }

    const items: OrderItem[] = cart.items.map((line) => ({
      productId: line!.productId,
      productName: line!.productName,
      cover: line!.cover,
      specId: line!.specId,
      specName: line!.specName,
      price: line!.price,
      quantity: line!.quantity,
    }));

    const now = new Date().toISOString();
    const order: Order = {
      id: randomUUID(),
      orderNo: `FS${Date.now()}`,
      status: 'pending_pay',
      items,
      address: {
        name: dto.receiverName,
        phone: dto.receiverPhone,
        detail: dto.addressDetail,
      },
      deliveryDate: dto.deliveryDate,
      deliverySlot: dto.deliverySlot,
      cardMessage: dto.cardMessage?.trim() ?? '',
      remark: dto.remark?.trim() ?? '',
      goodsAmount: cart.goodsAmount,
      deliveryFee: cart.deliveryFee,
      totalAmount: cart.totalAmount,
      createdAt: now,
      updatedAt: now,
    };

    this.store.orders.unshift(order);
    this.cartService.clear(dto.clientId);
    return order;
  }

  list(clientId?: string) {
    // demo: return all orders; later filter by user
    void clientId;
    return this.store.orders;
  }

  get(id: string) {
    const order = this.store.orders.find((o) => o.id === id);
    if (!order) throw new NotFoundException('订单不存在');
    return order;
  }

  pay(id: string) {
    const order = this.get(id);
    if (order.status !== 'pending_pay') {
      throw new BadRequestException('当前状态不可支付');
    }
    order.status = 'paid';
    order.updatedAt = new Date().toISOString();
    return order;
  }

  advance(id: string, status: OrderStatus) {
    const order = this.get(id);
    order.status = status;
    order.updatedAt = new Date().toISOString();
    return order;
  }
}
