import { Category, Product } from './types';

export const categories: Category[] = [
  { id: 'cat-bouquet', name: '精选花束', icon: 'bouquet', sort: 1 },
  { id: 'cat-box', name: '鲜花礼盒', icon: 'box', sort: 2 },
  { id: 'cat-plant', name: '绿植盆栽', icon: 'plant', sort: 3 },
  { id: 'cat-gift', name: '礼品搭配', icon: 'gift', sort: 4 },
];

export const products: Product[] = [
  {
    id: 'p-aurora',
    name: '极光玫瑰',
    subtitle: '香槟玫瑰与尤加利的温柔对话',
    cover:
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80',
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1200&q=80',
    ],
    price: 268,
    originalPrice: 328,
    categoryId: 'cat-bouquet',
    scenes: ['romance', 'birthday', 'festival'],
    materials: ['香槟玫瑰 11 枝', '尤加利叶', '白色满天星'],
    meaning: '把温柔说给你听，适合纪念日与告白。',
    careTips: '斜剪花茎，换清水，避开直射阳光。',
    specs: [
      { id: 's-aurora-s', name: '经典款 11 枝', price: 268, stock: 30 },
      { id: 's-aurora-l', name: '奢享款 19 枝', price: 398, stock: 18 },
    ],
    tags: ['热销', '告白'],
    sales: 1260,
    featured: true,
  },
  {
    id: 'p-morning',
    name: '清晨市集',
    subtitle: '向日葵与洋甘菊的明亮日常',
    cover:
      'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=1200&q=80',
    ],
    price: 168,
    categoryId: 'cat-bouquet',
    scenes: ['daily', 'birthday'],
    materials: ['向日葵 3 枝', '洋甘菊', '尤加利'],
    meaning: '把好心情装进花束，送给正在努力的人。',
    careTips: '向日葵喜水，每天检查水位。',
    specs: [
      { id: 's-morning-std', name: '标准束', price: 168, stock: 40 },
    ],
    tags: ['日常'],
    sales: 860,
    featured: true,
  },
  {
    id: 'p-velvet',
    name: '绒夜礼盒',
    subtitle: '红玫瑰礼盒，适合郑重表达',
    cover:
      'https://images.unsplash.com/photo-1561181286-d3fee7f4410a?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1561181286-d3fee7f4410a?w=1200&q=80',
    ],
    price: 458,
    originalPrice: 528,
    categoryId: 'cat-box',
    scenes: ['romance', 'festival', 'business'],
    materials: ['红玫瑰 16 枝', '黑色礼盒', '丝带'],
    meaning: '郑重、热烈，适合纪念日与重要场合。',
    careTips: '礼盒花建议当日拆开养护。',
    specs: [
      { id: 's-velvet-16', name: '16 枝礼盒', price: 458, stock: 12 },
      { id: 's-velvet-24', name: '24 枝礼盒', price: 688, stock: 8 },
    ],
    tags: ['礼盒', '高端'],
    sales: 420,
    featured: true,
  },
  {
    id: 'p-softwind',
    name: '软风',
    subtitle: '粉色系花束，探病与安慰也合适',
    cover:
      'https://images.unsplash.com/photo-1487530811176-3780da1762ab?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1487530811176-3780da1762ab?w=1200&q=80',
    ],
    price: 198,
    categoryId: 'cat-bouquet',
    scenes: ['sympathy', 'daily', 'birthday'],
    materials: ['粉玫瑰', '粉色康乃馨', '尤加利'],
    meaning: '柔软陪伴，不打扰，刚刚好。',
    careTips: '康乃馨较耐放，可搭配玫瑰一起养护。',
    specs: [{ id: 's-softwind-std', name: '标准束', price: 198, stock: 25 }],
    tags: ['温柔'],
    sales: 640,
    featured: false,
  },
  {
    id: 'p-olive',
    name: '桌前绿意',
    subtitle: '易养活绿植，办公室与家居都适合',
    cover:
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=1200&q=80',
    ],
    price: 128,
    categoryId: 'cat-plant',
    scenes: ['daily', 'business'],
    materials: ['观叶绿植', '陶瓷盆'],
    meaning: '给空间一点呼吸感。',
    careTips: '散射光，见干见湿浇水。',
    specs: [{ id: 's-olive-std', name: '单盆', price: 128, stock: 50 }],
    tags: ['绿植'],
    sales: 390,
    featured: false,
  },
  {
    id: 'p-duo',
    name: '花与甜',
    subtitle: '花束 + 小甜点礼袋组合',
    cover:
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=1200&q=80',
    ],
    price: 238,
    categoryId: 'cat-gift',
    scenes: ['birthday', 'romance', 'festival'],
    materials: ['混搭花束', '手工饼干礼袋'],
    meaning: '仪式感拉满的小惊喜。',
    careTips: '甜点请冷藏，花束单独养护。',
    specs: [{ id: 's-duo-std', name: '组合装', price: 238, stock: 20 }],
    tags: ['组合'],
    sales: 510,
    featured: true,
  },
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
