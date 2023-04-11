import { NestFactory } from '@nestjs/core';
import { ChatModule } from './chat.module';
import {SharedService} from "@app/shared";
import {ConfigService} from "@nestjs/config";
import {MicroserviceOptions} from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.create(ChatModule)
  app.enableCors()
  const sharedService = app.get(SharedService)
  const configService = app.get(ConfigService)
  const QUEUE = configService.get('RABBITMQ_CHAT_QUEUE')
  app.connectMicroservice<MicroserviceOptions>(sharedService.getRmqOptions(QUEUE))
  await app.startAllMicroservices();

  await app.listen(7000, () => console.log(`Chat has been started on PORT: 7000!`))
}
bootstrap();
