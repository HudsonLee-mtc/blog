import { api, WalletData } from '../../services/api';

Page({
  data: {
    balance: 0,
    packages: [] as WalletData['packages'],
    selectedId: '',
    loading: false,
  },
  onShow() {
    this.load();
  },
  async load() {
    try {
      const wallet = await api.wallet();
      this.setData({
        balance: wallet.balance,
        packages: wallet.packages,
        selectedId: this.data.selectedId || wallet.packages[0]?.id || '',
      });
    } catch (e) {
      wx.showToast({ title: (e as Error).message, icon: 'none' });
    }
  },
  pick(e: WechatMiniprogram.TouchEvent) {
    this.setData({ selectedId: e.currentTarget.dataset.id as string });
  },
  async recharge() {
    if (!this.data.selectedId) {
      wx.showToast({ title: '请选择充值套餐', icon: 'none' });
      return;
    }
    this.setData({ loading: true });
    try {
      const result = await api.recharge(this.data.selectedId);
      this.setData({ balance: result.balance });
      wx.showToast({
        title: `到账 ¥${result.recharged}`,
        icon: 'success',
      });
    } catch (e) {
      wx.showToast({ title: (e as Error).message, icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },
});
