export type SceneTag =
  | 'romance'
  | 'birthday'
  | 'sympathy'
  | 'business'
  | 'daily'
  | 'festival';

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
  optionIds: string[];
}

export type OrderStatus =
  | 'pending_pay'
  | 'paid'
  | 'preparing'
  | 'delivering'
  | 'completed'
  | 'cancelled';

export type FulfillmentType = 'delivery' | 'pickup';

export interface OrderItem {
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
}

export interface AddressSnapshot {
  name: string;
  phone: string;
  detail: string;
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
  status: OrderStatus;
  fulfillmentType: FulfillmentType;
  items: OrderItem[];
  address: AddressSnapshot;
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

export interface ShopInfo {
  name: string;
  slogan: string;
  notice: string;
  address: string;
  phone: string;
  businessHours: string;
}

export interface WalletAccount {
  balance: number;
}

export interface RechargePackage {
  id: string;
  amount: number;
  bonus: number;
  label: string;
}
