import { api, ShopInfo } from '../../services/api';

const FULFILLMENT_KEY = 'fulfillment_pref';

Page({
  data: {
    mode: 'pickup' as 'pickup' | 'delivery',
    modeLabel: '到店自取',
    title: '到店自取',
    desc: '选好花后到店领取，免配送费',
    shop: {
      name: '花屿叶',
      slogan: '',
      notice: '',
      address: '',
      phone: '',
      businessHours: '',
      latitude: 0,
      longitude: 0,
      mapName: '',
    } as ShopInfo,
  },
  onLoad(query: Record<string, string | undefined>) {
    const mode = query.mode === 'delivery' ? 'delivery' : 'pickup';
    wx.setStorageSync(FULFILLMENT_KEY, mode);
    this.setData({
      mode,
      modeLabel: mode === 'pickup' ? 'PICKUP' : 'TAKEOUT',
      title: mode === 'pickup' ? '到店自取' : '外送到家',
      desc:
        mode === 'pickup'
          ? '选好花束后到店领取，可一键打开地图导航'
          : '填写收货地址，花艺师做好后尽快送到你手上',
    });
    wx.setNavigationBarTitle({
      title: mode === 'pickup' ? '到店自取' : '外送到家',
    });
    this.loadShop();
  },
  async loadShop() {
    try {
      const meta = await api.meta();
      this.setData({ shop: meta.shop });
    } catch (e) {
      wx.showToast({ title: (e as Error).message, icon: 'none' });
    }
  },
  openMap() {
    const { shop } = this.data;
    if (!shop.latitude || !shop.longitude) {
      wx.showToast({ title: '暂无坐标信息', icon: 'none' });
      return;
    }
    wx.openLocation({
      latitude: shop.latitude,
      longitude: shop.longitude,
      name: shop.mapName || shop.name,
      address: shop.address,
      scale: 16,
    });
  },
  callShop() {
    const phone = this.data.shop.phone;
    if (!phone) return;
    wx.makePhoneCall({ phoneNumber: phone.replace(/-/g, '') });
  },
  goAddresses() {
    wx.navigateTo({ url: '/pages/address-list/address-list' });
  },
  goOrder() {
    wx.setStorageSync(FULFILLMENT_KEY, this.data.mode);
    wx.switchTab({ url: '/pages/category/category' });
  },
});
