import { Body, Controller, Delete, Get, Headers, Put } from '@nestjs/common';
import { UpdateCartItemDto, UpsertCartItemDto } from '../common/dto';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  get(@Headers('x-client-id') clientId = 'guest') {
    return this.cartService.getCart(clientId);
  }

  @Put('item')
  upsert(
    @Headers('x-client-id') clientId = 'guest',
    @Body() body: UpsertCartItemDto,
  ) {
    return this.cartService.upsert(
      clientId,
      body.productId,
      body.specId,
      body.quantity,
    );
  }

  @Put('quantity')
  update(
    @Headers('x-client-id') clientId = 'guest',
    @Body() body: UpdateCartItemDto,
  ) {
    return this.cartService.update(
      clientId,
      body.productId,
      body.specId,
      body.quantity,
    );
  }

  @Delete()
  clear(@Headers('x-client-id') clientId = 'guest') {
    return this.cartService.clear(clientId);
  }
}
