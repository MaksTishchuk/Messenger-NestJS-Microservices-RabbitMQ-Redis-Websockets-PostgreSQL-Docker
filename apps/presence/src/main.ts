import { NestFactory } from '@nestjs/core';
import { PresenceModule } from './presence.module';
import {SharedService} from "@app/shared";
import {ConfigService} from "@nestjs/config";
import {MicroserviceOptions} from "@nestjs/microservices";

async function bootstrap() {
  const app = await NestFactory.create(PresenceModule);
  app.enableCors()
  const sharedService = app.get(SharedService)
  const configService = app.get(ConfigService)
  const QUEUE = configService.get('RABBITMQ_PRESENCE_QUEUE')
  app.connectMicroservice<MicroserviceOptions>(sharedService.getRmqOptions(QUEUE))
  await app.startAllMicroservices()

  await app.listen(6000, () => console.log(`Presence has been started on PORT: 6000!`))

}
bootstrap();
