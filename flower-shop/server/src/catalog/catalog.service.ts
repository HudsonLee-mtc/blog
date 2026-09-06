import { Injectable, NotFoundException } from '@nestjs/common';
import { DataStore } from '../common/data.store';
import {
  customOptions,
  deliveryFee,
  deliverySlots,
  rechargePackages,
  sceneLabels,
  shopInfo,
  sizeSpecs,
} from '../common/seed';
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

    const blindBox =
      this.store.products.find((p) => p.id === 'p-blindbox') ?? null;

    return {
      shop: shopInfo,
      banners,
      scenes: Object.entries(sceneLabels).map(([id, name]) => ({ id, name })),
      categories: [...this.store.categories].sort((a, b) => a.sort - b.sort),
      featured: this.store.products.filter((p) => p.featured),
      hot: [...this.store.products].sort((a, b) => b.sales - a.sales).slice(0, 6),
      sizeSpecs,
      actions: [
        {
          id: 'pickup',
          title: '到店自取',
          subtitle: 'PICKUP',
          mode: 'pickup',
          path: '/pages/service/service?mode=pickup',
        },
        {
          id: 'custom',
          title: '鲜花定制',
          subtitle: 'FLOWER DESIGN',
          mode: 'custom',
          path: '/pages/custom/custom',
        },
        {
          id: 'delivery',
          title: '外送到家',
          subtitle: 'TAKEOUT',
          mode: 'delivery',
          path: '/pages/service/service?mode=delivery',
        },
      ],
      promo: {
        title: '店长推荐：鲜花盲盒',
        subtitle: 'SHARED PICK · 拆开才知道的小确幸',
        cta: '立即选购',
        productId: blindBox?.id ?? 'p-blindbox',
        cover: blindBox?.cover ?? '',
      },
      customOptions,
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
      customOptions,
      sizeChart: '/assets/size-chart.png',
      deliverySlots,
      deliveryFee,
    };
  }

  getMeta() {
    return {
      shop: shopInfo,
      categories: this.store.categories,
      scenes: Object.entries(sceneLabels).map(([id, name]) => ({ id, name })),
      deliverySlots,
      deliveryFee,
      sizeSpecs,
      customOptions,
      rechargePackages,
    };
  }
}
