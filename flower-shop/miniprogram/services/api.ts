import { getClientId, request } from '../utils/request';

export interface ProductSpec {
  id: string;
  code: string;
  name: string;
  stemHint: string;
  price: number;
  stock: number;
}

export interface CustomOption {
  id: string;
  name: string;
  desc: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  cover: string;
  images: string[];
  price: number;
  originalPrice?: number;
  categoryId: string;
  scenes: string[];
  materials: string[];
  meaning: string;
  careTips: string;
  specs: ProductSpec[];
  tags: string[];
  sales: number;
  featured: boolean;
  sceneLabels?: string[];
  customOptions?: CustomOption[];
  deliverySlots?: string[];
  deliveryFee?: number;
}

export interface ShopInfo {
  name: string;
  slogan: string;
  notice: string;
  address: string;
  phone: string;
  businessHours: string;
  latitude: number;
  longitude: number;
  mapName: string;
}

export interface HomeData {
  shop: ShopInfo;
  banners: Array<{
    id: string;
    title: string;
    subtitle: string;
    image: string;
    productId: string;
  }>;
  scenes: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string; icon: string; sort: number }>;
  featured: Product[];
  hot: Product[];
  sizeSpecs: ProductSpec[];
  actions?: Array<{
    id: string;
    title: string;
    subtitle: string;
    mode: 'pickup' | 'delivery' | 'custom';
    path: string;
  }>;
  promo?: {
    title: string;
    subtitle: string;
    cta: string;
    productId: string;
    cover: string;
  };
  customOptions?: CustomOption[];
}

export interface CartData {
  items: Array<{
    productId: string;
    productName: string;
    cover: string;
    specId: string;
    specCode: string;
    specName: string;
    stemHint: string;
    price: number;
    basePrice: number;
    optionsAmount: number;
    optionIds: string[];
    optionNames: string[];
    quantity: number;
    amount: number;
    stock: number;
    lineKey: string;
  }>;
  goodsAmount: number;
  deliveryFee: number;
  totalAmount: number;
  count: number;
  fulfillmentType: 'delivery' | 'pickup';
}

export interface UserAddress {
  id: string;
  name: string;
  phone: string;
  detail: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  orderNo: string;
  status: string;
  fulfillmentType: 'delivery' | 'pickup';
  items: Array<{
    productId: string;
    productName: string;
    cover: string;
    specId: string;
    specName: string;
    price: number;
    quantity: number;
    optionIds: string[];
    optionNames: string[];
    optionsAmount: number;
  }>;
  address: { name: string; phone: string; detail: string };
  deliveryDate: string;
  deliverySlot: string;
  cardMessage: string;
  remark: string;
  goodsAmount: number;
  optionsAmount: number;
  deliveryFee: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface WalletData {
  balance: number;
  packages: Array<{
    id: string;
    amount: number;
    bonus: number;
    label: string;
  }>;
}

export const api = {
  home: () => request<HomeData>('/home'),
  meta: () =>
    request<{
      shop: ShopInfo;
      categories: HomeData['categories'];
      scenes: HomeData['scenes'];
      deliverySlots: string[];
      deliveryFee: number;
      sizeSpecs: ProductSpec[];
      customOptions: CustomOption[];
      rechargePackages: WalletData['packages'];
    }>('/meta'),
  products: (query: Record<string, string> = {}) => {
    const qs = Object.entries(query)
      .filter(([, v]) => !!v)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&');
    return request<Product[]>(`/products${qs ? `?${qs}` : ''}`);
  },
  product: (id: string) => request<Product>(`/products/${id}`),
  cart: (fulfillmentType: 'delivery' | 'pickup' = 'delivery') =>
    request<CartData>(`/cart?fulfillmentType=${fulfillmentType}`),
  upsertCart: (data: {
    productId: string;
    specId: string;
    quantity: number;
    optionIds?: string[];
  }) => request<CartData>('/cart/item', { method: 'PUT', data }),
  updateCartQty: (data: {
    productId: string;
    specId: string;
    quantity: number;
    optionIds?: string[];
  }) => request<CartData>('/cart/quantity', { method: 'PUT', data }),
  createOrder: (data: {
    fulfillmentType: 'delivery' | 'pickup';
    receiverName: string;
    receiverPhone: string;
    addressDetail?: string;
    addressId?: string;
    deliveryDate: string;
    deliverySlot: string;
    cardMessage?: string;
    remark?: string;
  }) =>
    request<Order>('/orders', {
      method: 'POST',
      data: { ...data, clientId: getClientId() },
    }),
  orders: () => request<Order[]>('/orders'),
  order: (id: string) => request<Order>(`/orders/${id}`),
  payOrder: (id: string, method: 'wallet' | 'mock' = 'mock') =>
    request<{ order: Order; wallet: { balance: number } }>(
      `/orders/${id}/pay`,
      { method: 'POST', data: { method } },
    ),
  addresses: () => request<UserAddress[]>('/addresses'),
  saveAddress: (data: {
    id?: string;
    name: string;
    phone: string;
    detail: string;
    isDefault?: boolean;
  }) =>
    request<UserAddress[]>('/addresses', {
      method: data.id ? 'PUT' : 'POST',
      data,
    }),
  removeAddress: (id: string) =>
    request<UserAddress[]>(`/addresses/${id}`, { method: 'DELETE' }),
  setDefaultAddress: (id: string) =>
    request<UserAddress[]>(`/addresses/${id}/default`, { method: 'POST' }),
  wallet: () => request<WalletData>('/wallet'),
  recharge: (packageId: string) =>
    request<{ balance: number; recharged: number }>('/wallet/recharge', {
      method: 'POST',
      data: { packageId },
    }),
};
