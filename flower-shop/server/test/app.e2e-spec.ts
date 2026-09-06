import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Flower shop API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
  });

  it('/api/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect((res) => {
        expect(res.body.ok).toBe(true);
      });
  });

  it('/api/home (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/home')
      .expect(200)
      .expect((res) => {
        expect(res.body.shop.name).toBe('花屿叶');
        expect(Array.isArray(res.body.featured)).toBe(true);
        expect(res.body.sizeSpecs.length).toBe(4);
      });
  });

  it('supports specs, options, address, delivery and wallet', async () => {
    const server = app.getHttpServer();
    const client = 'e2e-client-1';

    const productRes = await request(server)
      .get('/api/products/p-aurora')
      .expect(200);
    expect(productRes.body.specs[0].name).toBe('掌中惊喜');
    expect(productRes.body.customOptions.length).toBeGreaterThan(0);

    await request(server)
      .put('/api/cart/item')
      .set('x-client-id', client)
      .send({
        productId: 'p-aurora',
        specId: 'size-s',
        quantity: 1,
        optionIds: ['opt-bear'],
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.items[0].specCode).toBe('S');
        expect(res.body.items[0].optionNames).toContain('加小熊');
        expect(res.body.totalAmount).toBe(98 + 39 + 10);
      });

    await request(server)
      .post('/api/addresses')
      .set('x-client-id', client)
      .send({
        name: '小花',
        phone: '13800138000',
        detail: '上海市徐汇区测试路 1 号',
        isDefault: true,
      })
      .expect(201);

    const addrList = await request(server)
      .get('/api/addresses')
      .set('x-client-id', client)
      .expect(200);
    expect(addrList.body.length).toBe(1);

    await request(server)
      .post('/api/wallet/recharge')
      .set('x-client-id', client)
      .send({ packageId: 'r-200' })
      .expect(201)
      .expect((res) => {
        expect(res.body.balance).toBe(220);
      });

    const orderRes = await request(server)
      .post('/api/orders')
      .send({
        clientId: client,
        fulfillmentType: 'delivery',
        receiverName: '小花',
        receiverPhone: '13800138000',
        addressId: addrList.body[0].id,
        deliveryDate: '2026-09-10',
        deliverySlot: '10:00-12:00',
        cardMessage: '想你',
      })
      .expect(201);

    expect(orderRes.body.fulfillmentType).toBe('delivery');
    expect(orderRes.body.totalAmount).toBe(147);

    await request(server)
      .post(`/api/orders/${orderRes.body.id}/pay`)
      .set('x-client-id', client)
      .send({ method: 'wallet' })
      .expect(201)
      .expect((res) => {
        expect(res.body.order.status).toBe('paid');
        expect(res.body.wallet.balance).toBe(220 - 147);
      });
  });

  it('supports pickup without delivery fee', async () => {
    const server = app.getHttpServer();
    const client = 'e2e-client-2';

    await request(server)
      .put('/api/cart/item')
      .set('x-client-id', client)
      .send({
        productId: 'p-morning',
        specId: 'size-xs',
        quantity: 1,
        optionIds: [],
      })
      .expect(200);

    const orderRes = await request(server)
      .post('/api/orders')
      .send({
        clientId: client,
        fulfillmentType: 'pickup',
        receiverName: '自取客',
        receiverPhone: '13900139000',
        deliveryDate: '2026-09-10',
        deliverySlot: '14:00-16:00',
      })
      .expect(201);

    expect(orderRes.body.deliveryFee).toBe(0);
    expect(orderRes.body.address.detail).toContain('到店自取');
  });

  afterEach(async () => {
    await app.close();
  });
});
