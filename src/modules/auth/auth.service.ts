import { Injectable, NotFoundException } from '@nestjs/common';
import { LoginDeliverDto } from './dto/create-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Deliver } from '../deliver/entities/deliver.entity';
import { Model } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Deliver.name) private readonly deliverRepo : Model<Deliver>,
    private jwt : JwtService,
  ){}

 async login(Body : LoginDeliverDto){
    const user = await this.deliverRepo.findOne({phone :Body.phone , password : Body.password})
    if(!user) throw new NotFoundException('login or password incorrect')
    const token = await this.jwt.signAsync({id : user._id , phone : user.phone})
    return {token , message :"success"}
 }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: any) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
