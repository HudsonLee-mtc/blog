import { api, HomeData, Product } from '../../services/api';

Page({
  data: {
    shop: { name: '花屿叶', slogan: '', notice: '' },
    banners: [] as HomeData['banners'],
    scenes: [] as HomeData['scenes'],
    featured: [] as Product[],
    hot: [] as Product[],
  },
  onShow() {
    this.loadHome();
  },
  async loadHome() {
    try {
      wx.showNavigationBarLoading();
      const data = await api.home();
      this.setData({
        shop: data.shop,
        banners: data.banners,
        scenes: data.scenes,
        featured: data.featured,
        hot: data.hot,
      });
    } catch (e) {
      wx.showToast({
        title: (e as Error).message || '加载失败',
        icon: 'none',
      });
    } finally {
      wx.hideNavigationBarLoading();
    }
  },
  goProduct(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id as string;
    wx.navigateTo({ url: `/pages/product/product?id=${id}` });
  },
  goScene(e: WechatMiniprogram.TouchEvent) {
    const scene = e.currentTarget.dataset.scene as string;
    wx.setStorageSync('flower_scene_filter', scene);
    wx.switchTab({ url: '/pages/category/category' });
  },
});
