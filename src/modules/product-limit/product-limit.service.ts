import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductLimitDto } from './dto/create-product-limit.dto';
import { UpdateProductLimitDto } from './dto/update-product-limit.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ProductLimit } from './entities/product-limit.entity';
import { Model } from 'mongoose';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class ProductLimitService {
  constructor(
    @InjectModel(ProductLimit.name) private readonly LimitsRepo : Model<ProductLimit>,
    @InjectModel(Order.name) private readonly OrderRepo : Model<Order>
  ){}

  async create(createProductLimitDto: CreateProductLimitDto) {
    return await this.LimitsRepo.create(createProductLimitDto);
  }

  async findAll() {
    return await this.LimitsRepo.find();
  }

  async findOne(id: string) {
    return await  this.LimitsRepo.findById(id);
  }

  async update(id: string, updateProductLimitDto: UpdateProductLimitDto) {
    return await this.LimitsRepo.findByIdAndUpdate(id , {...updateProductLimitDto}, {new : true});
  }

  async remove(id: string) {
    return await this.LimitsRepo.findByIdAndDelete(id);
  }

  async checkProductLimit(productId: string, marketId: string, amount: number) {
  // 1️⃣ Limitni bazadan topamiz
  const limit = await this.LimitsRepo.findOne({ productId });
  if (!limit) return; // agar limit mavjud bo'lmasa — cheklov yo'q

  // 2️⃣ Limitning tugash vaqtini hisoblaymiz
  const endDate = new Date(limit.startDate);
  endDate.setDate(endDate.getDate() + limit.days);

  // 3️⃣ Agar limit muddati tugagan bo‘lsa — cheklov bekor
  if (new Date() > endDate) return;

  // 4️⃣ Shu oraliqda berilgan orderlarni topamiz
  const orders = await this.OrderRepo.find({
    marketId,
    'products.productId': productId, // agar orderda bir nechta product bo‘lsa
    createdAt: { $gte: limit.startDate, $lte: endDate },
  });

  // 5️⃣ Shu mahsulotdan jami qancha buyurtma berilganini hisoblaymiz
  let totalOrdered = 0;
  for (const order of orders) {
    const productItem = order.products.find(
      (p) => p.productId.toString() === productId.toString(),
    );
    if (productItem) totalOrdered += productItem.quantity;
  }

  // 6️⃣ Qancha miqdor qoldi — shuni aniqlaymiz
  const remaining = limit.amount - totalOrdered;

  // 7️⃣ Tekshiruvlar
  if (remaining <= 0)
    throw new BadRequestException('Bu mahsulot uchun limit tugagan!');
  if (amount > remaining)
    throw new BadRequestException(
      `Siz faqat ${remaining} birlik zakaz bera olasiz.`,
    );
}

}
