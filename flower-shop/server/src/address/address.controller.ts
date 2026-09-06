import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UpsertAddressDto } from '../common/dto';
import { AddressService } from './address.service';

@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  list(@Headers('x-client-id') clientId = 'guest') {
    return this.addressService.list(clientId);
  }

  @Post()
  create(
    @Headers('x-client-id') clientId = 'guest',
    @Body() body: UpsertAddressDto,
  ) {
    return this.addressService.upsert(clientId, body);
  }

  @Put()
  update(
    @Headers('x-client-id') clientId = 'guest',
    @Body() body: UpsertAddressDto,
  ) {
    return this.addressService.upsert(clientId, body);
  }

  @Delete(':id')
  remove(
    @Headers('x-client-id') clientId = 'guest',
    @Param('id') id: string,
  ) {
    return this.addressService.remove(clientId, id);
  }

  @Post(':id/default')
  setDefault(
    @Headers('x-client-id') clientId = 'guest',
    @Param('id') id: string,
  ) {
    return this.addressService.setDefault(clientId, id);
  }
}
