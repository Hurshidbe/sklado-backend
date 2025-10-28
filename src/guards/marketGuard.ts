import { BadRequestException, CanActivate, ExecutionContext, HttpException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { decode } from "punycode";
import { Observable } from "rxjs";

@Injectable()
class MarketGuard implements CanActivate{
    constructor(private jwt : JwtService){}
    async canActivate(context: ExecutionContext): Promise<boolean>  {
        const req = context.switchToHttp().getRequest()
        const token = req.cookies.AuthToken;
        if(!token) throw new HttpException('token not fond please relogin' , 402 )
            try {
        const decoded = await this.jwt.verifyAsync(token)
        if(decoded.role !== 'market') throw new BadRequestException('this route is not for you')
        req.user = decoded
                return true
            } catch (error) {
                throw new HttpException('token expired please relogin', 403)
            }
    }
}

export default MarketGuard