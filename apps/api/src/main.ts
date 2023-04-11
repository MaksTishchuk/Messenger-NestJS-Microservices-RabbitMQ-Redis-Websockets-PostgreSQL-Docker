import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe())
  const configService = app.get(ConfigService)
  const PORT = configService.get('PORT') || 5000
  await app.listen(PORT, () => console.log(`Server has been started on PORT: ${PORT}!`))
}
bootstrap()
