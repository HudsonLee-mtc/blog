export type SceneTag =
  | 'romance'
  | 'birthday'
  | 'sympathy'
  | 'business'
  | 'daily'
  | 'festival';

export interface ProductSpec {
  id: string;
  name: string;
  price: number;
  stock: number;
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
  scenes: SceneTag[];
  materials: string[];
  meaning: string;
  careTips: string;
  specs: ProductSpec[];
  tags: string[];
  sales: number;
  featured: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  sort: number;
}

export interface CartItem {
  productId: string;
  specId: string;
  quantity: number;
}

export type OrderStatus =
  | 'pending_pay'
  | 'paid'
  | 'preparing'
  | 'delivering'
  | 'completed'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  cover: string;
  specId: string;
  specName: string;
  price: number;
  quantity: number;
}

export interface AddressSnapshot {
  name: string;
  phone: string;
  detail: string;
}

export interface Order {
  id: string;
  orderNo: string;
  status: OrderStatus;
  items: OrderItem[];
  address: AddressSnapshot;
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
