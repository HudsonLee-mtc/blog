import { Module } from '@nestjs/common';
import { AddressModule } from './address/address.module';
import { CartModule } from './cart/cart.module';
import { CatalogModule } from './catalog/catalog.module';
import { CommonModule } from './common/common.module';
import { HealthController } from './health.controller';
import { OrdersModule } from './orders/orders.module';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    CommonModule,
    CatalogModule,
    CartModule,
    OrdersModule,
    AddressModule,
    WalletModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
