import { api, CustomOption, Product } from '../../services/api';

Page({
  data: {
    product: null as Product | null,
    selectedSpecId: '',
    selectedSpec: null as Product['specs'][number] | null,
    customOptions: [] as Array<CustomOption & { checked: boolean }>,
    quantity: 1,
    materialsText: '',
    displayPrice: 0,
    showChart: false,
  },
  onLoad(query: Record<string, string | undefined>) {
    if (query.id) this.loadProduct(query.id);
  },
  async loadProduct(id: string) {
    try {
      wx.showLoading({ title: '加载中' });
      const product = await api.product(id);
      const selectedSpec = product.specs[0];
      const customOptions = (product.customOptions || []).map((o) => ({
        ...o,
        checked: false,
      }));
      this.setData({
        product,
        selectedSpecId: selectedSpec.id,
        selectedSpec,
        customOptions,
        materialsText: product.materials.join(' · '),
        quantity: 1,
        displayPrice: selectedSpec.price,
        showChart: false,
      });
      wx.setNavigationBarTitle({ title: product.name });
    } catch (e) {
      wx.showToast({ title: (e as Error).message, icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  },
  refreshPrice() {
    const base = this.data.selectedSpec?.price ?? 0;
    const extra = this.data.customOptions
      .filter((o) => o.checked)
      .reduce((sum, o) => sum + o.price, 0);
    this.setData({ displayPrice: base + extra });
  },
  pickSpec(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id as string;
    const product = this.data.product;
    if (!product) return;
    const selectedSpec =
      product.specs.find((s) => s.id === id) || product.specs[0];
    this.setData({ selectedSpecId: id, selectedSpec, quantity: 1 }, () =>
      this.refreshPrice(),
    );
  },
  toggleOption(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id as string;
    const customOptions = this.data.customOptions.map((o) =>
      o.id === id ? { ...o, checked: !o.checked } : o,
    );
    this.setData({ customOptions }, () => this.refreshPrice());
  },
  toggleChart() {
    this.setData({ showChart: !this.data.showChart });
  },
  previewChart() {
    wx.previewImage({
      urls: ['/assets/size-chart.png'],
      current: '/assets/size-chart.png',
    });
  },
  inc() {
    const stock = this.data.selectedSpec?.stock ?? 1;
    if (this.data.quantity >= stock) {
      wx.showToast({ title: '库存不足', icon: 'none' });
      return;
    }
    this.setData({ quantity: this.data.quantity + 1 });
  },
  dec() {
    if (this.data.quantity <= 1) return;
    this.setData({ quantity: this.data.quantity - 1 });
  },
  selectedOptionIds() {
    return this.data.customOptions.filter((o) => o.checked).map((o) => o.id);
  },
  async addCart() {
    const { product, selectedSpec, quantity } = this.data;
    if (!product || !selectedSpec) return;
    try {
      await api.upsertCart({
        productId: product.id,
        specId: selectedSpec.id,
        quantity,
        optionIds: this.selectedOptionIds(),
      });
      wx.showToast({ title: '已加入购物车', icon: 'success' });
    } catch (e) {
      wx.showToast({ title: (e as Error).message, icon: 'none' });
    }
  },
  async buyNow() {
    await this.addCart();
    wx.navigateTo({ url: '/pages/order-confirm/order-confirm' });
  },
});
