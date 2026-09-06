import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataStore } from '../common/data.store';
import { customOptions, deliveryFee } from '../common/seed';
import { CartItem } from '../common/types';

function optionKey(ids: string[]) {
  return [...ids].sort().join(',');
}

@Injectable()
export class CartService {
  constructor(private readonly store: DataStore) {}

  private key(clientId: string) {
    return clientId || 'guest';
  }

  getCart(clientId: string, fulfillmentType: 'delivery' | 'pickup' = 'delivery') {
    const items = this.store.carts.get(this.key(clientId)) ?? [];
    return this.hydrate(items, fulfillmentType);
  }

  upsert(
    clientId: string,
    productId: string,
    specId: string,
    quantity: number,
    optionIds: string[] = [],
  ) {
    const product = this.store.products.find((p) => p.id === productId);
    if (!product) throw new NotFoundException('商品不存在');
    const spec = product.specs.find((s) => s.id === specId);
    if (!spec) throw new BadRequestException('规格不存在');
    if (quantity < 1) throw new BadRequestException('数量至少为 1');
    if (quantity > spec.stock) throw new BadRequestException('库存不足');
    const normalizedOptions = this.normalizeOptions(optionIds);

    const key = this.key(clientId);
    const list = [...(this.store.carts.get(key) ?? [])];
    const idx = list.findIndex(
      (i) =>
        i.productId === productId &&
        i.specId === specId &&
        optionKey(i.optionIds) === optionKey(normalizedOptions),
    );
    if (idx >= 0) {
      list[idx] = { ...list[idx], quantity, optionIds: normalizedOptions };
    } else {
      list.push({
        productId,
        specId,
        quantity,
        optionIds: normalizedOptions,
      });
    }
    this.store.carts.set(key, list);
    return this.hydrate(list);
  }

  update(
    clientId: string,
    productId: string,
    specId: string,
    quantity: number,
    optionIds: string[] = [],
  ) {
    const key = this.key(clientId);
    const normalizedOptions = this.normalizeOptions(optionIds);
    let list = [...(this.store.carts.get(key) ?? [])];
    const match = (i: CartItem) =>
      i.productId === productId &&
      i.specId === specId &&
      optionKey(i.optionIds) === optionKey(normalizedOptions);

    if (quantity <= 0) {
      list = list.filter((i) => !match(i));
    } else {
      const product = this.store.products.find((p) => p.id === productId);
      const spec = product?.specs.find((s) => s.id === specId);
      if (!product || !spec) throw new NotFoundException('商品不存在');
      if (quantity > spec.stock) throw new BadRequestException('库存不足');
      const idx = list.findIndex(match);
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

  private normalizeOptions(optionIds: string[]) {
    const valid = new Set(customOptions.map((o) => o.id));
    const unique = [...new Set(optionIds.filter((id) => valid.has(id)))];
    return unique;
  }

  private hydrate(
    items: CartItem[],
    fulfillmentType: 'delivery' | 'pickup' = 'delivery',
  ) {
    const lines = items
      .map((item) => {
        const product = this.store.products.find((p) => p.id === item.productId);
        const spec = product?.specs.find((s) => s.id === item.specId);
        if (!product || !spec) return null;
        const options = customOptions.filter((o) =>
          item.optionIds.includes(o.id),
        );
        const optionsAmount = options.reduce((sum, o) => sum + o.price, 0);
        const unitPrice = spec.price + optionsAmount;
        return {
          productId: product.id,
          productName: product.name,
          cover: product.cover,
          specId: spec.id,
          specCode: spec.code,
          specName: `${spec.code} ${spec.name}`,
          stemHint: spec.stemHint,
          price: unitPrice,
          basePrice: spec.price,
          optionsAmount,
          optionIds: options.map((o) => o.id),
          optionNames: options.map((o) => o.name),
          quantity: item.quantity,
          amount: unitPrice * item.quantity,
          stock: spec.stock,
          lineKey: `${product.id}-${spec.id}-${optionKey(item.optionIds)}`,
        };
      })
      .filter(Boolean);

    const goodsAmount = lines.reduce((sum, l) => sum + (l?.amount ?? 0), 0);
    const fee =
      goodsAmount > 0 && fulfillmentType === 'delivery' ? deliveryFee : 0;
    return {
      items: lines,
      goodsAmount,
      deliveryFee: fee,
      totalAmount: goodsAmount + fee,
      count: lines.reduce((sum, l) => sum + (l?.quantity ?? 0), 0),
      fulfillmentType,
    };
  }
}
