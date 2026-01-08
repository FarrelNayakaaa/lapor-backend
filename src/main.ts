import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS (so the 3001 port for frontend port can acces)
  app.enableCors({
    origin: '*', //when the production time comes change this into the domain name 'http://namadomain.com'
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  // global pipe validation
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
