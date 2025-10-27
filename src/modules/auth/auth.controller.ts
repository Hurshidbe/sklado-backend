import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDeliverDto } from './dto/create-auth.dto';
import { Http2ServerRequest } from 'http2';
import AuthGuard from 'src/guards/authguard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('deliver-login')
  async login(@Body() LoginDeliverDto: LoginDeliverDto, @Res() res : any) {
    try {
      const {token , message} = await this.authService.login(LoginDeliverDto)
      res.cookie('AuthToken', token ,{httponly : true})
      return res.send(message)
    } catch (error) {
      throw new HttpException(error.message ,error.status)
    }
  }
}
