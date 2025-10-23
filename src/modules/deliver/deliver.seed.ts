import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Deliver } from 'src/modules/deliver/entities/deliver.entity';

@Injectable()
export class DeliverSeed implements OnModuleInit {
  constructor(@InjectModel(Deliver.name) private deliverModel: Model<Deliver>) {}

  async onModuleInit() {
    const count = await this.deliverModel.countDocuments();
    if (count === 0) {
      await this.deliverModel.create({
        name: 'Komiljon Tojakbarov',
        phone: '+998934928892',
        password : 'admin77',
        role : 'deliver'
      });
      console.log('✅ Deliver seed yaratildi');
    } else {
      console.log('ℹ️ Deliver oldindan mavjud, seed o‘tkazildi');
    }
  }
}
