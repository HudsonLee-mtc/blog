import { api, CartData } from '../../services/api';

function today() {
  const d = new Date();
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

Page({
  data: {
    cart: {
      items: [],
      goodsAmount: 0,
      deliveryFee: 0,
      totalAmount: 0,
      count: 0,
    } as CartData,
    receiverName: '',
    receiverPhone: '',
    addressDetail: '',
    deliveryDate: today(),
    minDate: today(),
    deliverySlots: [] as string[],
    deliverySlot: '',
    cardMessage: '',
    remark: '',
    submitting: false,
  },
  onShow() {
    this.bootstrap();
  },
  async bootstrap() {
    try {
      const [cart, meta] = await Promise.all([api.cart(), api.meta()]);
      if (!cart.items.length) {
        wx.showToast({ title: '购物车为空', icon: 'none' });
        setTimeout(() => wx.navigateBack(), 500);
        return;
      }
      this.setData({
        cart,
        deliverySlots: meta.deliverySlots,
        deliverySlot: meta.deliverySlots[0] || '',
      });
    } catch (e) {
      wx.showToast({ title: (e as Error).message, icon: 'none' });
    }
  },
  onName(e: WechatMiniprogram.Input) {
    this.setData({ receiverName: e.detail.value });
  },
  onPhone(e: WechatMiniprogram.Input) {
    this.setData({ receiverPhone: e.detail.value });
  },
  onAddress(e: WechatMiniprogram.Input) {
    this.setData({ addressDetail: e.detail.value });
  },
  onDate(e: WechatMiniprogram.PickerChange) {
    this.setData({ deliveryDate: e.detail.value as string });
  },
  pickSlot(e: WechatMiniprogram.TouchEvent) {
    this.setData({ deliverySlot: e.currentTarget.dataset.slot as string });
  },
  onCard(e: WechatMiniprogram.Input) {
    this.setData({ cardMessage: e.detail.value });
  },
  onRemark(e: WechatMiniprogram.Input) {
    this.setData({ remark: e.detail.value });
  },
  async submit() {
    const {
      receiverName,
      receiverPhone,
      addressDetail,
      deliveryDate,
      deliverySlot,
      cardMessage,
      remark,
    } = this.data;
    if (!receiverName || !receiverPhone || !addressDetail) {
      wx.showToast({ title: '请填写完整收花信息', icon: 'none' });
      return;
    }
    if (!/^1\d{10}$/.test(receiverPhone)) {
      wx.showToast({ title: '手机号格式不正确', icon: 'none' });
      return;
    }
    this.setData({ submitting: true });
    try {
      const order = await api.createOrder({
        receiverName,
        receiverPhone,
        addressDetail,
        deliveryDate,
        deliverySlot,
        cardMessage,
        remark,
      });
      wx.redirectTo({
        url: `/pages/order-detail/order-detail?id=${order.id}`,
      });
    } catch (e) {
      wx.showToast({ title: (e as Error).message, icon: 'none' });
    } finally {
      this.setData({ submitting: false });
    }
  },
});
