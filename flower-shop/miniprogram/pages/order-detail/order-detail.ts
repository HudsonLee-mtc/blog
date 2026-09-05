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
    order: null as Order | null,
    statusText,
    paying: false,
  },
  onLoad(query: Record<string, string | undefined>) {
    if (query.id) this.load(query.id);
  },
  async load(id: string) {
    try {
      const order = await api.order(id);
      this.setData({ order });
    } catch (e) {
      wx.showToast({ title: (e as Error).message, icon: 'none' });
    }
  },
  async pay() {
    const order = this.data.order;
    if (!order) return;
    this.setData({ paying: true });
    try {
      const next = await api.payOrder(order.id);
      this.setData({ order: next });
      wx.showToast({ title: '支付成功', icon: 'success' });
    } catch (e) {
      wx.showToast({ title: (e as Error).message, icon: 'none' });
    } finally {
      this.setData({ paying: false });
    }
  },
});
