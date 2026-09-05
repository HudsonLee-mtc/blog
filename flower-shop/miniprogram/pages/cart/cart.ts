import { api, CartData } from '../../services/api';

Page({
  data: {
    cart: {
      items: [],
      goodsAmount: 0,
      deliveryFee: 0,
      totalAmount: 0,
      count: 0,
    } as CartData,
  },
  onShow() {
    this.loadCart();
  },
  async loadCart() {
    try {
      const cart = await api.cart();
      this.setData({ cart });
    } catch (e) {
      wx.showToast({ title: (e as Error).message, icon: 'none' });
    }
  },
  async changeQty(e: WechatMiniprogram.TouchEvent) {
    const { productId, specId, quantity } = e.currentTarget.dataset as {
      productId: string;
      specId: string;
      quantity: number;
    };
    try {
      const cart = await api.updateCartQty({
        productId,
        specId,
        quantity: Number(quantity),
      });
      this.setData({ cart });
    } catch (err) {
      wx.showToast({ title: (err as Error).message, icon: 'none' });
    }
  },
  checkout() {
    if (!this.data.cart.items.length) return;
    wx.navigateTo({ url: '/pages/order-confirm/order-confirm' });
  },
  goShop() {
    wx.switchTab({ url: '/pages/category/category' });
  },
});
