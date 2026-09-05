import { Controller, Get, Param, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('home')
  home() {
    return this.catalogService.getHome();
  }

  @Get('meta')
  meta() {
    return this.catalogService.getMeta();
  }

  @Get('products')
  products(
    @Query('categoryId') categoryId?: string,
    @Query('scene') scene?: string,
    @Query('keyword') keyword?: string,
  ) {
    return this.catalogService.listProducts({ categoryId, scene, keyword });
  }

  @Get('products/:id')
  product(@Param('id') id: string) {
    return this.catalogService.getProduct(id);
  }
}
