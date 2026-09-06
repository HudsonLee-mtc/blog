import { api, ShopInfo } from '../../services/api';

Page({
  data: {
    balance: 0,
    shop: {
      name: '花屿叶',
      slogan: '一屿花开，一叶知心',
      notice: '',
      address: '',
      phone: '',
      businessHours: '',
      latitude: 0,
      longitude: 0,
      mapName: '',
    } as ShopInfo,
  },
  onShow() {
    this.load();
  },
  async load() {
    try {
      const [wallet, meta] = await Promise.all([api.wallet(), api.meta()]);
      this.setData({
        balance: wallet.balance,
        shop: meta.shop,
      });
    } catch (e) {
      // keep defaults when offline
    }
  },
  goOrders() {
    wx.navigateTo({ url: '/pages/orders/orders' });
  },
  goCart() {
    wx.switchTab({ url: '/pages/cart/cart' });
  },
  goCategory() {
    wx.switchTab({ url: '/pages/category/category' });
  },
  goAddresses() {
    wx.navigateTo({ url: '/pages/address-list/address-list' });
  },
  goWallet() {
    wx.navigateTo({ url: '/pages/wallet/wallet' });
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
  copyAddress() {
    const address = this.data.shop.address;
    if (!address) return;
    wx.setClipboardData({
      data: address,
      success: () => wx.showToast({ title: '地址已复制', icon: 'success' }),
    });
  },
  callShop() {
    const phone = this.data.shop.phone;
    if (!phone) return;
    wx.makePhoneCall({ phoneNumber: phone.replace(/-/g, '') });
  },
});
