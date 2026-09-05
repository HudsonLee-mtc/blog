import { Injectable } from '@nestjs/common';
import { CartItem, Order, Product } from './types';
import { categories, products } from './seed';

@Injectable()
export class DataStore {
  readonly categories = categories;
  readonly products: Product[] = products.map((p) => ({
    ...p,
    images: [...p.images],
    materials: [...p.materials],
    scenes: [...p.scenes],
    tags: [...p.tags],
    specs: p.specs.map((s) => ({ ...s })),
  }));

  /** demo cart keyed by client session id */
  carts = new Map<string, CartItem[]>();
  orders: Order[] = [];
}
