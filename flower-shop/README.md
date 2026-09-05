# 花屿叶 · 花店微信小程序

自建后端（NestJS + TypeScript）+ 微信小程序前端，适合测试号本地联调。

## 目录

- `miniprogram/` 微信小程序（TypeScript）
- `server/` NestJS API（内存数据，后续可换 MySQL）

## 1. 启动后端

```bash
cd flower-shop/server
npm install
npm run start:dev
```

默认地址：`http://127.0.0.1:3000/api`

健康检查：`GET /api/health`  
首页数据：`GET /api/home`

## 2. 打开小程序

1. 打开微信开发者工具
2. 导入项目，目录选 `flower-shop/miniprogram`
3. AppID 填你的**测试号**
4. 详情 → 本地设置 → 勾选 **不校验合法域名**（本地 HTTP 调试必须）
5. 若用真机预览：把 `miniprogram/utils/config.ts` 里的 `API_BASE` 改成电脑局域网 IP，例如：
   `http://192.168.1.8:3000/api`

## 3. 已实现功能

- 首页：店铺信息、轮播、场景入口、推荐/热销
- 选花：分类 + 场景筛选
- 商品详情：规格、数量、花材/花语/养护
- 购物车
- 下单：收花人、配送日期/时段、贺卡留言
- 订单列表 / 详情
- 模拟支付（测试号阶段）

## 4. 下一步（上线前）

- 接入 MySQL / Redis
- 微信支付正式下单与回调
- 配置 HTTPS 域名与小程序合法域名
- 商家后台（上架、接单、改配送状态）
