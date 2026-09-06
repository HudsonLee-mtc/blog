import { api } from '../../services/api';

const FULFILLMENT_KEY = 'fulfillment_pref';

Page({
  data: {
    promoProductId: 'p-blindbox',
  },
  onShow() {
    this.loadHome();
  },
  async loadHome() {
    try {
      const data = await api.home();
      if (data.promo?.productId) {
        this.setData({ promoProductId: data.promo.productId });
      }
    } catch (e) {
      // 首页以整图展示为主，接口失败不阻断点击热区
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
    const id = this.data.promoProductId || 'p-blindbox';
    wx.navigateTo({ url: `/pages/product/product?id=${id}` });
  },
});
