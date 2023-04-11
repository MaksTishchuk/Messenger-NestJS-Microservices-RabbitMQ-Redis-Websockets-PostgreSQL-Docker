import {NestFactory} from '@nestjs/core';
import {AuthModule} from './auth.module';
import {ConfigService} from "@nestjs/config";
import {MicroserviceOptions} from "@nestjs/microservices";
import {SharedService} from "@app/shared";

async function bootstrap() {
  const app = await NestFactory.create(AuthModule)

  const sharedService = app.get(SharedService)
  const configService = app.get(ConfigService)
  const QUEUE = configService.get('RABBITMQ_AUTH_QUEUE')
  app.connectMicroservice<MicroserviceOptions>(sharedService.getRmqOptions(QUEUE))

  await app.startAllMicroservices()
}
bootstrap();
