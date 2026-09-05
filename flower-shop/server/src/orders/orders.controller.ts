import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { CreateOrderDto } from '../common/dto';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  list(@Headers('x-client-id') clientId = 'guest') {
    return this.ordersService.list(clientId);
  }

  @Get(':id')
  detail(@Param('id') id: string) {
    return this.ordersService.get(id);
  }

  @Post()
  create(@Body() body: CreateOrderDto) {
    return this.ordersService.create(body);
  }

  /** 测试号阶段模拟支付成功 */
  @Post(':id/pay')
  pay(@Param('id') id: string) {
    return this.ordersService.pay(id);
  }

  @Post(':id/status/:status')
  status(@Param('id') id: string, @Param('status') status: string) {
    return this.ordersService.advance(id, status as never);
  }
}
