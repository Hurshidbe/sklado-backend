import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe({
    transform : true,
    whitelist : true,
    forbidNonWhitelisted : true
  }))
  const config = new DocumentBuilder()
  .setTitle('Toycha.uz APIs')
  .setDescription('Toycha.uz loyihasining barcha endpointlari')
  .setVersion('1.0')
  .build()
  const documentation = () => SwaggerModule.createDocument(app , config)
  SwaggerModule.setup('apis' ,app , documentation, {jsonDocumentUrl : 'apis-json'})
  await app.listen(process.env.PORT ?? 3000);
  console.warn(`server is running port on ${process.env.PORT}`)
}
bootstrap();
