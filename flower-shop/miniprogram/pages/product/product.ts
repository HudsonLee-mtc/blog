import { api, Product } from '../../services/api';

Page({
  data: {
    product: null as Product | null,
    selectedSpecId: '',
    selectedSpec: null as Product['specs'][number] | null,
    quantity: 1,
    materialsText: '',
  },
  onLoad(query: Record<string, string | undefined>) {
    if (query.id) this.loadProduct(query.id);
  },
  async loadProduct(id: string) {
    try {
      wx.showLoading({ title: '加载中' });
      const product = await api.product(id);
      const selectedSpec = product.specs[0];
      this.setData({
        product,
        selectedSpecId: selectedSpec.id,
        selectedSpec,
        materialsText: product.materials.join(' · '),
        quantity: 1,
      });
      wx.setNavigationBarTitle({ title: product.name });
    } catch (e) {
      wx.showToast({ title: (e as Error).message, icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  },
  pickSpec(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id as string;
    const product = this.data.product;
    if (!product) return;
    const selectedSpec =
      product.specs.find((s) => s.id === id) || product.specs[0];
    this.setData({ selectedSpecId: id, selectedSpec, quantity: 1 });
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
  async addCart() {
    const { product, selectedSpec, quantity } = this.data;
    if (!product || !selectedSpec) return;
    try {
      await api.upsertCart({
        productId: product.id,
        specId: selectedSpec.id,
        quantity,
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
