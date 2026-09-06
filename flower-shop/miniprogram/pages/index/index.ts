import { api, HomeData, Product, ShopInfo } from '../../services/api';

const FULFILLMENT_KEY = 'fulfillment_pref';

Page({
  data: {
    shop: {
      name: '花屿叶',
      slogan: '把浪漫送进日常',
      notice: '',
      address: '',
      phone: '',
      businessHours: '',
      latitude: 0,
      longitude: 0,
      mapName: '',
    } as ShopInfo,
    actions: [] as NonNullable<HomeData['actions']>,
    promo: {
      title: '店长推荐：鲜花盲盒',
      subtitle: '拆开才知道的小确幸',
      cta: '立即选购',
      productId: 'p-blindbox',
      cover: '',
    } as NonNullable<HomeData['promo']>,
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
        actions: data.actions?.length
          ? data.actions
          : [
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
        promo: data.promo || this.data.promo,
        hot: data.hot || [],
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
  onAction(e: WechatMiniprogram.TouchEvent) {
    const mode = e.currentTarget.dataset.mode as string;
    const path = e.currentTarget.dataset.path as string;
    if (mode === 'pickup' || mode === 'delivery') {
      wx.setStorageSync(FULFILLMENT_KEY, mode);
    }
    if (path) {
      wx.navigateTo({ url: path });
    }
  },
  goPromo() {
    const id = this.data.promo.productId || 'p-blindbox';
    wx.navigateTo({ url: `/pages/product/product?id=${id}` });
  },
  goProduct(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id as string;
    wx.navigateTo({ url: `/pages/product/product?id=${id}` });
  },
});
