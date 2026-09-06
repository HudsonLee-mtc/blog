import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

export class UpsertCartItemDto {
  @IsString()
  productId!: string;

  @IsString()
  specId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  optionIds?: string[];
}

export class UpdateCartItemDto {
  @IsString()
  productId!: string;

  @IsString()
  specId!: string;

  @IsInt()
  @Min(0)
  quantity!: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  optionIds?: string[];
}

export class CreateOrderDto {
  @IsString()
  clientId!: string;

  @IsIn(['delivery', 'pickup'])
  fulfillmentType!: 'delivery' | 'pickup';

  @IsString()
  receiverName!: string;

  @IsString()
  receiverPhone!: string;

  @ValidateIf(
    (o: CreateOrderDto) => o.fulfillmentType === 'delivery' && !o.addressId,
  )
  @IsString()
  addressDetail?: string;

  @IsOptional()
  @IsString()
  addressId?: string;

  @IsString()
  deliveryDate!: string;

  @IsString()
  deliverySlot!: string;

  @IsOptional()
  @IsString()
  cardMessage?: string;

  @IsOptional()
  @IsString()
  remark?: string;
}

export class UpsertAddressDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  name!: string;

  @IsString()
  phone!: string;

  @IsString()
  detail!: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class RechargeDto {
  @IsString()
  packageId!: string;
}

export class PayOrderDto {
  @IsOptional()
  @IsIn(['wallet', 'mock'])
  method?: 'wallet' | 'mock';
}
