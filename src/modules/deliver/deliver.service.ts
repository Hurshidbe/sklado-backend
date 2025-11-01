import { Injectable } from '@nestjs/common';
import { CreateDeliverDto } from './dto/create-deliver.dto';
import { UpdateDeliverDto } from './dto/update-deliver.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from '../orders/entities/order.entity';
import { Model } from 'mongoose';
import * as ExcelJS from 'exceljs';
import { OrderFilterDto } from '../orders/dto/create-order.dto';


@Injectable()
export class DeliverService {
  constructor(@InjectModel(Order.name) private readonly orderRepo : Model<Order>){}

  async getOrderById(id : string){
    return await this.orderRepo.findById(id)
  }

// Service faylidagi to'g'rilangan funksiya

async exportOrdersToExcel(filter: OrderFilterDto) {
  // ✅ query uchun type qo‘shildi (xatolik yo‘qoladi)
  const query: Record<string, any> = {};

  if (filter.status) query.status = filter.status;

  if (filter.from && filter.to) {
    query.createdAt = {
      $gte: new Date(filter.from),
      $lte: new Date(filter.to),
    };
  }

  const orders = await this.orderRepo
    .find(query)
    .populate('products.productId')
    .populate('marketId')
    .lean();

  const uniqueProducts = new Set<string>();
  const orderProductMap = new Map<string, Map<string, number>>();

  // ✅ Market + Sana asosida ustun nomlari
  orders.forEach(order => {
    const marketName = order.marketId?.name || 'Noma\'lum';
   const date = (order as any).createdAt
  ? new Date((order as any).createdAt).toLocaleDateString('en-GB', {
      timeZone: 'Asia/Tashkent',
    }).replace(/\//g, '-')
  : 'Noma\'lum sana';

    const orderKey = `${marketName} (${date})`;
    const productQuantities = new Map<string, number>();

    (order.products || []).forEach((p: any) => {
      const productName = p.productId?.name || 'Noma\'lum';
      uniqueProducts.add(productName);
      productQuantities.set(productName, p.quantity || 0);
    });

    orderProductMap.set(orderKey, productQuantities);
  });

  const ExcelJS = require('exceljs');
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Orders');

  // ✅ Ustunlarni yaratish
  const orderKeys = Array.from(orderProductMap.keys());
  worksheet.columns = [
    { header: 'Mahsulot NOMi / Bo‘g‘chalar', key: 'productName', width: 28 },
    ...orderKeys.map(key => ({
      header: key,
      key: key,
      width: 22,
      style: { alignment: { wrapText: true, vertical: 'middle', horizontal: 'center' } }
    })),
    { header: 'Jami', key: 'total', width: 12 }
  ];

  // ✅ Header qatorini sozlash
  const headerRow = worksheet.getRow(1);
  headerRow.height = 45;
  headerRow.alignment = { wrapText: true, vertical: 'middle', horizontal: 'center' };

  // ✅ Har bir mahsulot uchun satr + jami
  uniqueProducts.forEach(productName => {
    const rowData: any = { productName };
    let total = 0;

    orderKeys.forEach(orderKey => {
      const qty = orderProductMap.get(orderKey)?.get(productName) || 0;
      rowData[orderKey] = qty;
      total += qty;
    });

    rowData.total = total;
    worksheet.addRow(rowData);
  });

  // ✅ Yakuniy "JAMI" qatori
  const totalRow: any = { productName: 'JAMI' };
  let allTotal = 0;

  orderKeys.forEach(key => {
    const sum = Array.from(uniqueProducts).reduce((acc, product) => {
      return acc + (orderProductMap.get(key)?.get(product) || 0);
    }, 0);
    totalRow[key] = sum;
    allTotal += sum;
  });

  totalRow.total = allTotal;
  const footer = worksheet.addRow(totalRow);
  footer.font = { bold: true };
  footer.height = 25;

  return await workbook.xlsx.writeBuffer();
}





}
