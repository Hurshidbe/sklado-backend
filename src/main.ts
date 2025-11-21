import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,      
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.use(cookieParser());
   app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Toycha.uz APIs')
    .setDescription('Toycha.uz loyihasining barcha endpointlari')
    .setVersion('1.0')
    .build();

  const documentation = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apis', app, documentation, { jsonDocumentUrl: 'apis-json' });

  await app.listen(process.env.PORT ?? 3000);
  console.warn(`Server is running on port ${process.env.PORT ?? 3000}`);
  console.warn(`for swagger : http://127.0.0.1:${process.env.PORT ?? 3000}/apis`)
}
bootstrap();
