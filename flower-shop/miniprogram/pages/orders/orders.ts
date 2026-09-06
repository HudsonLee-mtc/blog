import { api, Order } from '../../services/api';

const statusText: Record<string, string> = {
  pending_pay: '待支付',
  paid: '已支付',
  preparing: '备花中',
  delivering: '配送中',
  completed: '已完成',
  cancelled: '已取消',
};

Page({
  data: {
    orders: [] as Order[],
    statusText,
  },
  onShow() {
    this.load();
  },
  async load() {
    try {
      const orders = await api.orders();
      this.setData({ orders });
    } catch (e) {
      wx.showToast({ title: (e as Error).message, icon: 'none' });
    }
  },
  goDetail(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id as string;
    wx.navigateTo({ url: `/pages/order-detail/order-detail?id=${id}` });
  },
});
