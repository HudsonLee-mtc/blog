import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpsertCartItemDto {
  @IsString()
  productId!: string;

  @IsString()
  specId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class UpdateCartItemDto {
  @IsString()
  productId!: string;

  @IsString()
  specId!: string;

  @IsInt()
  @Min(0)
  quantity!: number;
}

export class CreateOrderDto {
  @IsString()
  clientId!: string;

  @IsString()
  receiverName!: string;

  @IsString()
  receiverPhone!: string;

  @IsString()
  addressDetail!: string;

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
