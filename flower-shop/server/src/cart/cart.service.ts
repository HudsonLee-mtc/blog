import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataStore } from '../common/data.store';
import { CartItem } from '../common/types';

@Injectable()
export class CartService {
  constructor(private readonly store: DataStore) {}

  private key(clientId: string) {
    return clientId || 'guest';
  }

  getCart(clientId: string) {
    const items = this.store.carts.get(this.key(clientId)) ?? [];
    return this.hydrate(items);
  }

  upsert(clientId: string, productId: string, specId: string, quantity: number) {
    const product = this.store.products.find((p) => p.id === productId);
    if (!product) throw new NotFoundException('商品不存在');
    const spec = product.specs.find((s) => s.id === specId);
    if (!spec) throw new BadRequestException('规格不存在');
    if (quantity < 1) throw new BadRequestException('数量至少为 1');
    if (quantity > spec.stock) throw new BadRequestException('库存不足');

    const key = this.key(clientId);
    const list = [...(this.store.carts.get(key) ?? [])];
    const idx = list.findIndex(
      (i) => i.productId === productId && i.specId === specId,
    );
    if (idx >= 0) {
      list[idx] = { ...list[idx], quantity };
    } else {
      list.push({ productId, specId, quantity });
    }
    this.store.carts.set(key, list);
    return this.hydrate(list);
  }

  update(clientId: string, productId: string, specId: string, quantity: number) {
    const key = this.key(clientId);
    let list = [...(this.store.carts.get(key) ?? [])];
    if (quantity <= 0) {
      list = list.filter(
        (i) => !(i.productId === productId && i.specId === specId),
      );
    } else {
      const product = this.store.products.find((p) => p.id === productId);
      const spec = product?.specs.find((s) => s.id === specId);
      if (!product || !spec) throw new NotFoundException('商品不存在');
      if (quantity > spec.stock) throw new BadRequestException('库存不足');
      const idx = list.findIndex(
        (i) => i.productId === productId && i.specId === specId,
      );
      if (idx < 0) throw new NotFoundException('购物车中无此商品');
      list[idx] = { ...list[idx], quantity };
    }
    this.store.carts.set(key, list);
    return this.hydrate(list);
  }

  clear(clientId: string) {
    this.store.carts.set(this.key(clientId), []);
    return this.hydrate([]);
  }

  rawItems(clientId: string): CartItem[] {
    return this.store.carts.get(this.key(clientId)) ?? [];
  }

  private hydrate(items: CartItem[]) {
    const lines = items.map((item) => {
      const product = this.store.products.find((p) => p.id === item.productId);
      const spec = product?.specs.find((s) => s.id === item.specId);
      if (!product || !spec) {
        return null;
      }
      return {
        productId: product.id,
        productName: product.name,
        cover: product.cover,
        specId: spec.id,
        specName: spec.name,
        price: spec.price,
        quantity: item.quantity,
        amount: spec.price * item.quantity,
        stock: spec.stock,
      };
    }).filter(Boolean);

    const goodsAmount = lines.reduce((sum, l) => sum + (l?.amount ?? 0), 0);
    return {
      items: lines,
      goodsAmount,
      deliveryFee: goodsAmount > 0 ? 10 : 0,
      totalAmount: goodsAmount + (goodsAmount > 0 ? 10 : 0),
      count: lines.reduce((sum, l) => sum + (l?.quantity ?? 0), 0),
    };
  }
}
