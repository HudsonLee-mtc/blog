import { api, HomeData, Product } from '../../services/api';

Page({
  data: {
    categories: [] as HomeData['categories'],
    scenes: [] as HomeData['scenes'],
    products: [] as Product[],
    categoryId: '',
    scene: '',
    fulfillmentTip: '',
  },
  onShow() {
    const scene = (wx.getStorageSync('flower_scene_filter') as string) || '';
    if (scene) {
      wx.removeStorageSync('flower_scene_filter');
      this.setData({ scene });
    }
    const pref = wx.getStorageSync('fulfillment_pref') as string;
    if (pref === 'pickup' || pref === 'delivery') {
      this.setData({
        fulfillmentTip:
          pref === 'pickup' ? '当前：到店自取' : '当前：外送到家',
      });
    }
    this.bootstrap();
  },
  async bootstrap() {
    try {
      const meta = await api.meta();
      this.setData({
        categories: meta.categories,
        scenes: meta.scenes,
      });
      await this.loadProducts();
    } catch (e) {
      wx.showToast({ title: (e as Error).message, icon: 'none' });
    }
  },
  async loadProducts() {
    const { categoryId, scene } = this.data;
    const products = await api.products({ categoryId, scene });
    this.setData({ products });
  },
  clearFilter() {
    this.setData({ categoryId: '', scene: '' }, () => this.loadProducts());
  },
  pickCategory(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id as string;
    this.setData({ categoryId: id }, () => this.loadProducts());
  },
  pickScene(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id as string;
    this.setData({ scene: id }, () => this.loadProducts());
  },
  goProduct(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id as string;
    wx.navigateTo({ url: `/pages/product/product?id=${id}` });
  },
});
