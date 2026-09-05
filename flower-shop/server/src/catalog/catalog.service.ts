import { Injectable, NotFoundException } from '@nestjs/common';
import { DataStore } from '../common/data.store';
import { deliverySlots, sceneLabels } from '../common/seed';
import { Product, SceneTag } from '../common/types';

@Injectable()
export class CatalogService {
  constructor(private readonly store: DataStore) {}

  getHome() {
    const banners = this.store.products
      .filter((p) => p.featured)
      .slice(0, 3)
      .map((p) => ({
        id: p.id,
        title: p.name,
        subtitle: p.subtitle,
        image: p.cover,
        productId: p.id,
      }));

    return {
      shop: {
        name: '花屿叶',
        slogan: '一屿花开，一叶知心',
        notice: '同城当日达 · 支持贺卡留言 · 指定时段配送',
      },
      banners,
      scenes: Object.entries(sceneLabels).map(([id, name]) => ({ id, name })),
      categories: [...this.store.categories].sort((a, b) => a.sort - b.sort),
      featured: this.store.products.filter((p) => p.featured),
      hot: [...this.store.products].sort((a, b) => b.sales - a.sales).slice(0, 6),
    };
  }

  listProducts(query: {
    categoryId?: string;
    scene?: string;
    keyword?: string;
  }) {
    let list: Product[] = [...this.store.products];
    if (query.categoryId) {
      list = list.filter((p) => p.categoryId === query.categoryId);
    }
    if (query.scene) {
      list = list.filter((p) => p.scenes.includes(query.scene as SceneTag));
    }
    if (query.keyword) {
      const kw = query.keyword.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(kw) ||
          p.subtitle.toLowerCase().includes(kw) ||
          p.tags.some((t) => t.toLowerCase().includes(kw)),
      );
    }
    return list;
  }

  getProduct(id: string) {
    const product = this.store.products.find((p) => p.id === id);
    if (!product) throw new NotFoundException('商品不存在');
    return {
      ...product,
      sceneLabels: product.scenes.map((s) => sceneLabels[s] ?? s),
      deliverySlots,
      deliveryFee: 10,
    };
  }

  getMeta() {
    return {
      categories: this.store.categories,
      scenes: Object.entries(sceneLabels).map(([id, name]) => ({ id, name })),
      deliverySlots,
      deliveryFee: 10,
    };
  }
}
