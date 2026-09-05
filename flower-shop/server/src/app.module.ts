import { Module } from '@nestjs/common';
import { CartModule } from './cart/cart.module';
import { CatalogModule } from './catalog/catalog.module';
import { CommonModule } from './common/common.module';
import { OrdersModule } from './orders/orders.module';
import { HealthController } from './health.controller';

@Module({
  imports: [CommonModule, CatalogModule, CartModule, OrdersModule],
  controllers: [HealthController],
})
export class AppModule {}
