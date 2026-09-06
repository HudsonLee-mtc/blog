import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { RechargeDto } from '../common/dto';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  get(@Headers('x-client-id') clientId = 'guest') {
    return this.walletService.get(clientId);
  }

  @Post('recharge')
  recharge(
    @Headers('x-client-id') clientId = 'guest',
    @Body() body: RechargeDto,
  ) {
    return this.walletService.recharge(clientId, body.packageId);
  }
}
