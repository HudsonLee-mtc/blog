import { api, UserAddress } from '../../services/api';

Page({
  data: {
    id: '',
    name: '',
    phone: '',
    detail: '',
    isDefault: false,
    saving: false,
  },
  async onLoad(query: Record<string, string | undefined>) {
    if (!query.id) {
      wx.setNavigationBarTitle({ title: '新增地址' });
      return;
    }
    try {
      const list = await api.addresses();
      const found = list.find((a: UserAddress) => a.id === query.id);
      if (!found) {
        wx.showToast({ title: '地址不存在', icon: 'none' });
        return;
      }
      this.setData({
        id: found.id,
        name: found.name,
        phone: found.phone,
        detail: found.detail,
        isDefault: found.isDefault,
      });
    } catch (e) {
      wx.showToast({ title: (e as Error).message, icon: 'none' });
    }
  },
  onName(e: WechatMiniprogram.Input) {
    this.setData({ name: e.detail.value });
  },
  onPhone(e: WechatMiniprogram.Input) {
    this.setData({ phone: e.detail.value });
  },
  onDetail(e: WechatMiniprogram.Input) {
    this.setData({ detail: e.detail.value });
  },
  onDefault(e: WechatMiniprogram.SwitchChange) {
    this.setData({ isDefault: e.detail.value });
  },
  async save() {
    const { id, name, phone, detail, isDefault } = this.data;
    if (!name.trim() || !phone.trim() || !detail.trim()) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }
    if (!/^1\d{10}$/.test(phone)) {
      wx.showToast({ title: '手机号格式不正确', icon: 'none' });
      return;
    }
    this.setData({ saving: true });
    try {
      await api.saveAddress({
        id: id || undefined,
        name: name.trim(),
        phone: phone.trim(),
        detail: detail.trim(),
        isDefault,
      });
      wx.showToast({ title: '已保存', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 400);
    } catch (e) {
      wx.showToast({ title: (e as Error).message, icon: 'none' });
    } finally {
      this.setData({ saving: false });
    }
  },
});
