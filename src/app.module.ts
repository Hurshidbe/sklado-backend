import { Module } from '@nestjs/common';
import { CustomersModule } from './modules/customers/customers.module';
import { DeliverModule } from './modules/deliver/deliver.module';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [CustomersModule, DeliverModule, ProductModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
