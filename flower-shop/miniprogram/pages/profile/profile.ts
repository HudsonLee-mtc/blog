Page({
  goOrders() {
    wx.navigateTo({ url: '/pages/orders/orders' });
  },
  goCart() {
    wx.switchTab({ url: '/pages/cart/cart' });
  },
  goCategory() {
    wx.switchTab({ url: '/pages/category/category' });
  },
});
