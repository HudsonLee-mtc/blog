import { api, CartData, ShopInfo, UserAddress } from '../../services/api';

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
      fulfillmentType: 'delivery',
    } as CartData,
    fulfillmentType: 'delivery' as 'delivery' | 'pickup',
    shop: {
      name: '花屿叶',
      slogan: '',
      notice: '',
      address: '',
      phone: '',
      businessHours: '',
      latitude: 0,
      longitude: 0,
      mapName: '',
    } as ShopInfo,
    addresses: [] as UserAddress[],
    selectedAddress: null as UserAddress | null,
    receiverName: '',
    receiverPhone: '',
    addressDetail: '',
    deliveryDate: today(),
    minDate: today(),
    deliverySlots: [] as string[],
    deliverySlot: '',
    cardMessage: '',
    remark: '',
    walletBalance: 0,
    submitting: false,
  },
  onShow() {
    this.bootstrap();
  },
  async bootstrap() {
    try {
      const [meta, addresses, wallet, cart] = await Promise.all([
        api.meta(),
        api.addresses(),
        api.wallet(),
        api.cart(this.data.fulfillmentType),
      ]);
      if (!cart.items.length) {
        wx.showToast({ title: '购物车为空', icon: 'none' });
        setTimeout(() => wx.navigateBack(), 500);
        return;
      }
      const selectedAddress =
        addresses.find((a) => a.isDefault) || addresses[0] || null;
      this.setData({
        cart,
        shop: meta.shop,
        addresses,
        selectedAddress,
        deliverySlots: meta.deliverySlots,
        deliverySlot: this.data.deliverySlot || meta.deliverySlots[0] || '',
        walletBalance: wallet.balance,
        receiverName: selectedAddress?.name || this.data.receiverName,
        receiverPhone: selectedAddress?.phone || this.data.receiverPhone,
        addressDetail: selectedAddress?.detail || this.data.addressDetail,
      });
    } catch (e) {
      wx.showToast({ title: (e as Error).message, icon: 'none' });
    }
  },
  async pickMode(e: WechatMiniprogram.TouchEvent) {
    const fulfillmentType = e.currentTarget.dataset.type as
      | 'delivery'
      | 'pickup';
    const cart = await api.cart(fulfillmentType);
    this.setData({ fulfillmentType, cart });
  },
  goAddresses() {
    wx.navigateTo({ url: '/pages/address-list/address-list?from=confirm' });
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
  onName(e: WechatMiniprogram.Input) {
    this.setData({ receiverName: e.detail.value });
  },
  onPhone(e: WechatMiniprogram.Input) {
    this.setData({ receiverPhone: e.detail.value });
  },
  onAddress(e: WechatMiniprogram.Input) {
    this.setData({ addressDetail: e.detail.value, selectedAddress: null });
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
      fulfillmentType,
      receiverName,
      receiverPhone,
      addressDetail,
      selectedAddress,
      deliveryDate,
      deliverySlot,
      cardMessage,
      remark,
    } = this.data;
    if (!receiverName || !receiverPhone) {
      wx.showToast({ title: '请填写联系人信息', icon: 'none' });
      return;
    }
    if (!/^1\d{10}$/.test(receiverPhone)) {
      wx.showToast({ title: '手机号格式不正确', icon: 'none' });
      return;
    }
    if (fulfillmentType === 'delivery' && !selectedAddress && !addressDetail) {
      wx.showToast({ title: '请填写收货地址', icon: 'none' });
      return;
    }
    this.setData({ submitting: true });
    try {
      const order = await api.createOrder({
        fulfillmentType,
        receiverName,
        receiverPhone,
        addressDetail:
          fulfillmentType === 'delivery'
            ? selectedAddress?.detail || addressDetail
            : undefined,
        addressId:
          fulfillmentType === 'delivery' ? selectedAddress?.id : undefined,
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
