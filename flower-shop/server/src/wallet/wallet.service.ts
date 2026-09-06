import { BadRequestException, Injectable } from '@nestjs/common';
import { DataStore } from '../common/data.store';
import { rechargePackages } from '../common/seed';

@Injectable()
export class WalletService {
  constructor(private readonly store: DataStore) {}

  get(clientId: string) {
    return {
      ...this.store.getWallet(clientId),
      packages: rechargePackages,
    };
  }

  recharge(clientId: string, packageId: string) {
    const pack = rechargePackages.find((p) => p.id === packageId);
    if (!pack) throw new BadRequestException('充值套餐不存在');
    const wallet = this.store.getWallet(clientId);
    wallet.balance = Number(
      (wallet.balance + pack.amount + pack.bonus).toFixed(2),
    );
    return {
      ...wallet,
      recharged: pack.amount + pack.bonus,
      package: pack,
    };
  }
}
