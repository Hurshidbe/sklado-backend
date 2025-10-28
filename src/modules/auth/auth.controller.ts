import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, Res, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDeliverDto, LoginMarketDto } from './dto/create-auth.dto';
import DeliverGuard from 'src/guards/deliverGuard';
import { Deliver } from '../deliver/entities/deliver.entity';
import { Market } from '../markets/entities/market.entity';
import MarketGuard from 'src/guards/marketGuard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('deliver-login')
  async loginDdeliver(@Body() LoginDeliverDto: LoginDeliverDto, @Res() res : any) {
    try {
      const {token , message} = await this.authService.DElogin(LoginDeliverDto)
      res.cookie('AuthToken', token ,{httponly : true})
      return res.send(message)
    } catch (error) {
      throw new HttpException(error.message ,error.status)
    }
  }

  @Post('market-login')
  async loginMarket(@Body() LoginMarketDto : LoginMarketDto, @Res() res : any){
     try {
      const {token, message} = await this.authService.MAlogin(LoginMarketDto)
      res.cookie('AuthToken', token , {httponly : true})
      return res.send(message)
     } catch (error) {
      throw new HttpException(error.message , error.status)
     }
  }



  @UseGuards(MarketGuard)
  @Get()
  async get(){return 'hello'}
}
