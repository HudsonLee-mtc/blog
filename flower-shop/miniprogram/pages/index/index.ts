import { api } from '../../services/api';

const FULFILLMENT_KEY = 'fulfillment_pref';

type Hotspot = { top: number; height: number };

Page({
  data: {
    promoProductId: 'p-blindbox',
    clipHeight: 0,
    hotspots: {
      pickup: { top: 0, height: 0 } as Hotspot,
      custom: { top: 0, height: 0 } as Hotspot,
      delivery: { top: 0, height: 0 } as Hotspot,
      promo: { top: 0, height: 0 } as Hotspot,
    },
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
      // 整图首页可离线展示
    }
  },
  onPosterLoad(e: WechatMiniprogram.ImageLoad) {
    const { width, height } = e.detail;
    if (!width || !height) return;
    const sys = wx.getSystemInfoSync();
    const viewWidth = sys.windowWidth;
    const viewHeight = (height / width) * viewWidth;
    // 新图本身无底部假 tab，完整展示
    const clipHeight = Math.round(viewHeight);
    const zone = (topRatio: number, heightRatio: number): Hotspot => ({
      top: Math.round(viewHeight * topRatio),
      height: Math.round(viewHeight * heightRatio),
    });
    this.setData({
      clipHeight,
      hotspots: {
        // 三张服务卡大致在中下部
        pickup: zone(0.545, 0.155),
        custom: zone(0.545, 0.155),
        delivery: zone(0.545, 0.155),
        // 鲜花盲盒横幅
        promo: zone(0.72, 0.2),
      },
    });
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
