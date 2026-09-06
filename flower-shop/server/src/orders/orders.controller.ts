import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { CreateOrderDto, PayOrderDto } from '../common/dto';
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

  @Post(':id/pay')
  pay(
    @Param('id') id: string,
    @Headers('x-client-id') clientId = 'guest',
    @Body() body: PayOrderDto,
  ) {
    return this.ordersService.pay(id, body, clientId);
  }

  @Post(':id/status/:status')
  status(@Param('id') id: string, @Param('status') status: string) {
    return this.ordersService.advance(id, status as never);
  }
}
