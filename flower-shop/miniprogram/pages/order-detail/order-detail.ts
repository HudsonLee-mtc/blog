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
    walletBalance: 0,
    paying: false,
    fulfillmentText: '',
  },
  onLoad(query: Record<string, string | undefined>) {
    if (query.id) this.load(query.id);
  },
  async load(id: string) {
    try {
      const [order, wallet] = await Promise.all([
        api.order(id),
        api.wallet(),
      ]);
      this.setData({
        order,
        walletBalance: wallet.balance,
        fulfillmentText:
          order.fulfillmentType === 'pickup' ? '到店自取' : '外卖配送',
      });
    } catch (e) {
      wx.showToast({ title: (e as Error).message, icon: 'none' });
    }
  },
  async pay(e: WechatMiniprogram.TouchEvent) {
    const order = this.data.order;
    if (!order) return;
    const method = (e.currentTarget.dataset.method as 'wallet' | 'mock') || 'mock';
    if (method === 'wallet' && this.data.walletBalance < order.totalAmount) {
      wx.showModal({
        title: '余额不足',
        content: '是否前往充值？',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/wallet/wallet' });
          }
        },
      });
      return;
    }
    this.setData({ paying: true });
    try {
      const result = await api.payOrder(order.id, method);
      this.setData({
        order: result.order,
        walletBalance: result.wallet.balance,
      });
      wx.showToast({ title: '支付成功', icon: 'success' });
    } catch (err) {
      wx.showToast({ title: (err as Error).message, icon: 'none' });
    } finally {
      this.setData({ paying: false });
    }
  },
  goWallet() {
    wx.navigateTo({ url: '/pages/wallet/wallet' });
  },
});
