import { api, CustomOption, Product } from '../../services/api';

Page({
  data: {
    options: [] as CustomOption[],
    products: [] as Product[],
  },
  onShow() {
    this.load();
  },
  async load() {
    try {
      const [meta, products] = await Promise.all([
        api.meta(),
        api.products(),
      ]);
      this.setData({
        options: meta.customOptions || [],
        products,
      });
    } catch (e) {
      wx.showToast({ title: (e as Error).message, icon: 'none' });
    }
  },
  goProduct(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id as string;
    wx.navigateTo({ url: `/pages/product/product?id=${id}&custom=1` });
  },
});
