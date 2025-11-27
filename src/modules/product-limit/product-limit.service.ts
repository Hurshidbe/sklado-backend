import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductLimitDto } from './dto/create-product-limit.dto';
import { UpdateProductLimitDto } from './dto/update-product-limit.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ProductLimit } from './entities/product-limit.entity';
import mongoose, { Model } from 'mongoose';
import { Order } from '../orders/entities/order.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class ProductLimitService {
  constructor(
    @InjectModel(ProductLimit.name) private readonly LimitsRepo : Model<ProductLimit>,
    @InjectModel(Order.name) private readonly OrderRepo : Model<Order>,
    @InjectModel(Product.name) private readonly ProductRepo : Model<Product>
  ){}

  async create(createProductLimitDto: CreateProductLimitDto) {
    if(!createProductLimitDto.marketId||!createProductLimitDto.productId) throw new BadRequestException('market or product not defined')
    const limit = await this.LimitsRepo.find({productId: createProductLimitDto.productId, marketId : createProductLimitDto.marketId})
    if(limit.length) throw new BadRequestException('limit already exist for this product on this market, you can edit it')
    return await this.LimitsRepo.create({...createProductLimitDto, createdAt : this.getUzbTime(), updatedAt: this.getUzbTime()});
  }

  async findAll(filter : {marketId? : string, productId? : string}) {
    const query : any ={}
    if(filter.productId?.length) query.productId = new mongoose.Types.ObjectId(filter.productId)
    if(filter.marketId?.length) query.marketId = new mongoose.Types.ObjectId(filter.marketId)
    return await this.LimitsRepo.find(query).sort({createdAt: -1}).lean();
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
  if (!limit) return; // agar limit mavjud bo‘lmasa — cheklov yo‘q

  // 2️⃣ Limitning tugash vaqtini hisoblaymiz
  const endDate = new Date(limit.startDate);
  endDate.setDate(endDate.getDate() + limit.days);

  // 3️⃣ Agar limit muddati tugagan bo‘lsa — avtomatik yangi davr boshlaymiz
  if (new Date() > endDate) {
    limit.startDate = new Date(); // hozirgi sanadan yangilaymiz
    await limit.save();
    return; // yangi limit davri boshlandi
  }

  // 4️⃣ Shu oraliqda berilgan orderlarni topamiz
  const orders = await this.OrderRepo.find({
    marketId,
    'products.productId': productId,
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

  // 🔍 Mahsulot nomini olish (xabar uchun)
  const product = await this.ProductRepo.findById(productId);

  // 7️⃣ Tekshiruvlar
  if (remaining <= 0)
    throw new BadRequestException(
      `${product?.name || 'Nomaʼlum mahsulot'} uchun limit tugagan!`,
    );

  if (amount > remaining)
    throw new BadRequestException(
      `${product?.name || 'Nomaʼlum mahsulot'} uchun faqat ${remaining} birlik zakaz bera olasiz.`,
    );
}

getUzbTime() {
  const nowUTC = new Date();
  return new Date(nowUTC.getTime() + 5 * 60 * 60 * 1000);
}

}
