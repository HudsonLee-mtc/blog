import {
  Category,
  CustomOption,
  Product,
  ProductSpec,
  RechargePackage,
  ShopInfo,
} from './types';

/** 全局选花规格（每款花都可选择） */
export const sizeSpecs: ProductSpec[] = [
  {
    id: 'size-xs',
    code: 'XS',
    name: '掌中惊喜',
    stemHint: '6支左右',
    price: 58,
    stock: 99,
  },
  {
    id: 'size-s',
    code: 'S',
    name: '一捧情意',
    stemHint: '12支左右',
    price: 98,
    stock: 99,
  },
  {
    id: 'size-m',
    code: 'M',
    name: '浪漫满怀',
    stemHint: '22支左右',
    price: 188,
    stock: 99,
  },
  {
    id: 'size-l',
    code: 'L',
    name: '情感暴击',
    stemHint: '32支左右',
    price: 288,
    stock: 99,
  },
];

export const customOptions: CustomOption[] = [
  {
    id: 'opt-wrap',
    name: '升级包装',
    desc: '高档包装纸与丝带',
    price: 20,
  },
  {
    id: 'opt-bear',
    name: '加小熊',
    desc: '可爱毛绒小熊一只',
    price: 39,
  },
  {
    id: 'opt-choco',
    name: '加巧克力',
    desc: '精选巧克力小礼盒',
    price: 29,
  },
  {
    id: 'opt-vase',
    name: '花瓶套装',
    desc: '简约玻璃花瓶',
    price: 49,
  },
];

export const shopInfo: ShopInfo = {
  name: '花屿叶',
  slogan: '把浪漫送进日常',
  notice: '同城当日达 · 支持贺卡留言 · 外送/到店取',
  address:
    '内蒙古自治区阿拉善盟阿拉善左旗巴彦浩特镇民主路东城国际17-1芳颜美阁',
  phone: '021-88886666',
  businessHours: '每天 09:30 - 21:00',
  // 巴彦浩特东城国际附近坐标（可后续用微信选点微调）
  latitude: 38.8486,
  longitude: 105.7185,
  mapName: '花屿叶 · 芳颜美阁',
};

export const rechargePackages: RechargePackage[] = [
  { id: 'r-100', amount: 100, bonus: 0, label: '充 100' },
  { id: 'r-200', amount: 200, bonus: 20, label: '充 200 送 20' },
  { id: 'r-500', amount: 500, bonus: 80, label: '充 500 送 80' },
  { id: 'r-1000', amount: 1000, bonus: 200, label: '充 1000 送 200' },
];

export const categories: Category[] = [
  { id: 'cat-bouquet', name: '精选花束', icon: 'bouquet', sort: 1 },
  { id: 'cat-box', name: '鲜花礼盒', icon: 'box', sort: 2 },
  { id: 'cat-plant', name: '绿植盆栽', icon: 'plant', sort: 3 },
  { id: 'cat-gift', name: '礼品搭配', icon: 'gift', sort: 4 },
];

function withGlobalSpecs(
  product: Omit<Product, 'specs' | 'price'> & { price?: number },
): Product {
  return {
    ...product,
    price: sizeSpecs[0].price,
    specs: sizeSpecs.map((s) => ({ ...s })),
  };
}

export const products: Product[] = [
  withGlobalSpecs({
    id: 'p-aurora',
    name: '极光玫瑰',
    subtitle: '香槟玫瑰与尤加利的温柔对话',
    cover:
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80',
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1200&q=80',
    ],
    originalPrice: 328,
    categoryId: 'cat-bouquet',
    scenes: ['romance', 'birthday', 'festival'],
    materials: ['香槟玫瑰', '尤加利叶', '白色满天星'],
    meaning: '把温柔说给你听，适合纪念日与告白。',
    careTips: '斜剪花茎，换清水，避开直射阳光。',
    tags: ['热销', '告白'],
    sales: 1260,
    featured: true,
  }),
  withGlobalSpecs({
    id: 'p-morning',
    name: '清晨市集',
    subtitle: '向日葵与洋甘菊的明亮日常',
    cover:
      'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=1200&q=80',
    ],
    categoryId: 'cat-bouquet',
    scenes: ['daily', 'birthday'],
    materials: ['向日葵', '洋甘菊', '尤加利'],
    meaning: '把好心情装进花束，送给正在努力的人。',
    careTips: '向日葵喜水，每天检查水位。',
    tags: ['日常'],
    sales: 860,
    featured: true,
  }),
  withGlobalSpecs({
    id: 'p-velvet',
    name: '绒夜礼盒',
    subtitle: '红玫瑰礼盒，适合郑重表达',
    cover:
      'https://images.unsplash.com/photo-1561181286-d3fee7f4410a?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1561181286-d3fee7f4410a?w=1200&q=80',
    ],
    originalPrice: 328,
    categoryId: 'cat-box',
    scenes: ['romance', 'festival', 'business'],
    materials: ['红玫瑰', '礼盒包装', '丝带'],
    meaning: '郑重、热烈，适合纪念日与重要场合。',
    careTips: '礼盒花建议当日拆开养护。',
    tags: ['礼盒', '高端'],
    sales: 420,
    featured: true,
  }),
  withGlobalSpecs({
    id: 'p-softwind',
    name: '软风',
    subtitle: '粉色系花束，探病与安慰也合适',
    cover:
      'https://images.unsplash.com/photo-1487530811176-3780da1762ab?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1487530811176-3780da1762ab?w=1200&q=80',
    ],
    categoryId: 'cat-bouquet',
    scenes: ['sympathy', 'daily', 'birthday'],
    materials: ['粉玫瑰', '粉色康乃馨', '尤加利'],
    meaning: '柔软陪伴，不打扰，刚刚好。',
    careTips: '康乃馨较耐放，可搭配玫瑰一起养护。',
    tags: ['温柔'],
    sales: 640,
    featured: false,
  }),
  withGlobalSpecs({
    id: 'p-olive',
    name: '桌前绿意',
    subtitle: '易养活绿植，办公室与家居都适合',
    cover:
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1200&q=80',
    ],
    categoryId: 'cat-plant',
    scenes: ['daily', 'business'],
    materials: ['观叶绿植', '陶瓷盆'],
    meaning: '给空间一点呼吸感。',
    careTips: '散射光，见干见湿浇水。',
    tags: ['绿植'],
    sales: 390,
    featured: false,
  }),
  withGlobalSpecs({
    id: 'p-duo',
    name: '花与甜',
    subtitle: '花束 + 小甜点礼袋组合',
    cover:
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=1200&q=80',
    ],
    categoryId: 'cat-gift',
    scenes: ['birthday', 'romance', 'festival'],
    materials: ['混搭花束', '手工饼干礼袋'],
    meaning: '仪式感拉满的小惊喜。',
    careTips: '甜点请冷藏，花束单独养护。',
    tags: ['组合'],
    sales: 510,
    featured: true,
  }),
  withGlobalSpecs({
    id: 'p-blindbox',
    name: '鲜花盲盒',
    subtitle: '店长当日精选，拆开才知道的小确幸',
    cover:
      'https://images.unsplash.com/photo-1487530811176-3780da1762ab?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1487530811176-3780da1762ab?w=1200&q=80',
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80',
    ],
    originalPrice: 128,
    categoryId: 'cat-gift',
    scenes: ['daily', 'birthday', 'romance'],
    materials: ['当日精选花材', '惊喜小卡'],
    meaning: '把选择交给花艺师，把惊喜留给你。',
    careTips: '收到后尽快拆开换水养护。',
    tags: ['店长推荐', '盲盒'],
    sales: 980,
    featured: true,
  }),
];

export const sceneLabels: Record<string, string> = {
  romance: '告白浪漫',
  birthday: '生日祝福',
  sympathy: '探病安慰',
  business: '商务礼仪',
  daily: '日常疗愈',
  festival: '节日送礼',
};

export const deliverySlots = [
  '10:00-12:00',
  '12:00-14:00',
  '14:00-16:00',
  '16:00-18:00',
  '18:00-20:00',
];

export const deliveryFee = 10;
