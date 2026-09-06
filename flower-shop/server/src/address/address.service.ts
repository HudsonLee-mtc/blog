import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DataStore } from '../common/data.store';
import { UpsertAddressDto } from '../common/dto';
import { UserAddress } from '../common/types';

@Injectable()
export class AddressService {
  constructor(private readonly store: DataStore) {}

  private key(clientId: string) {
    return clientId || 'guest';
  }

  list(clientId: string) {
    return this.store.addresses.get(this.key(clientId)) ?? [];
  }

  upsert(clientId: string, dto: UpsertAddressDto) {
    if (!/^1\d{10}$/.test(dto.phone)) {
      throw new BadRequestException('手机号格式不正确');
    }
    const key = this.key(clientId);
    const list = [...(this.store.addresses.get(key) ?? [])];
    if (dto.id) {
      const idx = list.findIndex((a) => a.id === dto.id);
      if (idx < 0) throw new NotFoundException('地址不存在');
      list[idx] = {
        ...list[idx],
        name: dto.name.trim(),
        phone: dto.phone.trim(),
        detail: dto.detail.trim(),
        isDefault: dto.isDefault ?? list[idx].isDefault,
      };
    } else {
      const address: UserAddress = {
        id: randomUUID(),
        name: dto.name.trim(),
        phone: dto.phone.trim(),
        detail: dto.detail.trim(),
        isDefault: dto.isDefault ?? list.length === 0,
      };
      list.push(address);
    }
    if (dto.isDefault) {
      for (const item of list) {
        item.isDefault = item.id === (dto.id || list[list.length - 1].id);
      }
    }
    this.store.addresses.set(key, list);
    return list;
  }

  remove(clientId: string, id: string) {
    const key = this.key(clientId);
    let list = [...(this.store.addresses.get(key) ?? [])];
    const target = list.find((a) => a.id === id);
    if (!target) throw new NotFoundException('地址不存在');
    list = list.filter((a) => a.id !== id);
    if (target.isDefault && list.length) {
      list[0].isDefault = true;
    }
    this.store.addresses.set(key, list);
    return list;
  }

  setDefault(clientId: string, id: string) {
    const key = this.key(clientId);
    const list = [...(this.store.addresses.get(key) ?? [])];
    if (!list.some((a) => a.id === id)) {
      throw new NotFoundException('地址不存在');
    }
    for (const item of list) {
      item.isDefault = item.id === id;
    }
    this.store.addresses.set(key, list);
    return list;
  }
}
