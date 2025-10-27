import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv'
import cookieParser from 'cookie-parser';

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  await app.listen(process.env.PORT ?? 3000);
  console.warn(`server is running port on ${process.env.PORT}`)
}
bootstrap();
