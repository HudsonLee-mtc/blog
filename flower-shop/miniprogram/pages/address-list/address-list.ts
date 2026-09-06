import { api, UserAddress } from '../../services/api';

Page({
  data: {
    addresses: [] as UserAddress[],
    fromConfirm: false,
  },
  onLoad(query: Record<string, string | undefined>) {
    this.setData({ fromConfirm: query.from === 'confirm' });
  },
  onShow() {
    this.load();
  },
  async load() {
    try {
      const addresses = await api.addresses();
      this.setData({ addresses });
    } catch (e) {
      wx.showToast({ title: (e as Error).message, icon: 'none' });
    }
  },
  async pick(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id as string;
    if (!this.data.fromConfirm) return;
    try {
      await api.setDefaultAddress(id);
      wx.navigateBack();
    } catch (err) {
      wx.showToast({ title: (err as Error).message, icon: 'none' });
    }
  },
  goEdit(e: WechatMiniprogram.TouchEvent) {
    const id = (e.currentTarget.dataset.id as string) || '';
    wx.navigateTo({
      url: `/pages/address-edit/address-edit${id ? `?id=${id}` : ''}`,
    });
  },
  stop() {},
  async setDefault(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id as string;
    try {
      const addresses = await api.setDefaultAddress(id);
      this.setData({ addresses });
      wx.showToast({ title: '已设为默认', icon: 'success' });
    } catch (err) {
      wx.showToast({ title: (err as Error).message, icon: 'none' });
    }
  },
  async remove(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id as string;
    const ok = await new Promise<boolean>((resolve) => {
      wx.showModal({
        title: '删除地址',
        content: '确定删除该地址吗？',
        success: (res) => resolve(!!res.confirm),
      });
    });
    if (!ok) return;
    try {
      const addresses = await api.removeAddress(id);
      this.setData({ addresses });
    } catch (err) {
      wx.showToast({ title: (err as Error).message, icon: 'none' });
    }
  },
});
