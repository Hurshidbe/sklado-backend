import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException,  UseGuards, Req, Res } from '@nestjs/common';
import type { Response} from 'express'
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
async loginDdeliver(
  @Body() dto: LoginDeliverDto,
  @Res({ passthrough: true }) res: Response,
) {
  try {
    const { token, message } = await this.authService.DElogin(dto);

    res.cookie('AuthToken', token, {
      httpOnly: true,
      secure: false,             
      maxAge: 4 * 60 * 60 * 1000,
    });

    return { message };
  } catch (error) {
    throw new HttpException(error.message, error.status || 500);
  }
}

  @Post('market-login')
  async loginMarket( @Body() dto: LoginMarketDto,
  @Res({ passthrough: true }) res: Response,
) {
  try {
    const { token, message } = await this.authService.MAlogin(dto);

    res.cookie('AuthToken', token, {
      httpOnly: true,
      secure: false,             
      maxAge: 4 * 60 * 60 * 1000,
    });

    return { message };
  } catch (error) {
    throw new HttpException(error.message, error.status || 500);
  }
}
  @Delete('deliver-logout')
  @UseGuards(DeliverGuard)
     async logoutDeliver(@Res() res: any) {
     res.clearCookie('AuthToken')
     return res.send('deliver logout success')
}

  @Delete('market-logout')
  @UseGuards(MarketGuard)
     async logoutMarket(@Res() res: any) {
     res.clearCookie('AuthToken',)
     return res.send('market logout success')
}

}
