import { getClientId, request } from '../utils/request';

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
  specs: Array<{ id: string; name: string; price: number; stock: number }>;
  tags: string[];
  sales: number;
  featured: boolean;
  sceneLabels?: string[];
  deliverySlots?: string[];
  deliveryFee?: number;
}

export interface HomeData {
  shop: { name: string; slogan: string; notice: string };
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
}

export interface CartData {
  items: Array<{
    productId: string;
    productName: string;
    cover: string;
    specId: string;
    specName: string;
    price: number;
    quantity: number;
    amount: number;
    stock: number;
  }>;
  goodsAmount: number;
  deliveryFee: number;
  totalAmount: number;
  count: number;
}

export interface Order {
  id: string;
  orderNo: string;
  status: string;
  items: Array<{
    productId: string;
    productName: string;
    cover: string;
    specId: string;
    specName: string;
    price: number;
    quantity: number;
  }>;
  address: { name: string; phone: string; detail: string };
  deliveryDate: string;
  deliverySlot: string;
  cardMessage: string;
  remark: string;
  goodsAmount: number;
  deliveryFee: number;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

export const api = {
  home: () => request<HomeData>('/home'),
  meta: () =>
    request<{
      categories: HomeData['categories'];
      scenes: HomeData['scenes'];
      deliverySlots: string[];
      deliveryFee: number;
    }>('/meta'),
  products: (query: Record<string, string> = {}) => {
    const qs = Object.entries(query)
      .filter(([, v]) => !!v)
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join('&');
    return request<Product[]>(`/products${qs ? `?${qs}` : ''}`);
  },
  product: (id: string) => request<Product>(`/products/${id}`),
  cart: () => request<CartData>('/cart'),
  upsertCart: (data: {
    productId: string;
    specId: string;
    quantity: number;
  }) => request<CartData>('/cart/item', { method: 'PUT', data }),
  updateCartQty: (data: {
    productId: string;
    specId: string;
    quantity: number;
  }) => request<CartData>('/cart/quantity', { method: 'PUT', data }),
  createOrder: (data: {
    receiverName: string;
    receiverPhone: string;
    addressDetail: string;
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
  payOrder: (id: string) =>
    request<Order>(`/orders/${id}/pay`, { method: 'POST' }),
};
