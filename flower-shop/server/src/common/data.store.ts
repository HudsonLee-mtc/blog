import { Injectable } from '@nestjs/common';
import {
  CartItem,
  Order,
  Product,
  UserAddress,
  WalletAccount,
} from './types';
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

  carts = new Map<string, CartItem[]>();
  orders: Order[] = [];
  addresses = new Map<string, UserAddress[]>();
  wallets = new Map<string, WalletAccount>();

  getWallet(clientId: string): WalletAccount {
    const key = clientId || 'guest';
    if (!this.wallets.has(key)) {
      this.wallets.set(key, { balance: 0 });
    }
    return this.wallets.get(key)!;
  }
}
