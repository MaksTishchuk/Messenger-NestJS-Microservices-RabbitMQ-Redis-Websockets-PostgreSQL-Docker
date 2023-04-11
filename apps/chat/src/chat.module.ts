import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import {
  ConversationEntity, ConversationsRepository,
  FriendRequestEntity, MessageEntity, MessagesRepository,
  PostgresDBModule,
  RedisModule,
  SharedModule,
  UserEntity
} from "@app/shared";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ChatGateway} from "./chat.gateway";

@Module({
  imports: [
    PostgresDBModule,
    RedisModule,
    SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
    SharedModule.registerRmq('PRESENCE_SERVICE', process.env.RABBITMQ_PRESENCE_QUEUE),
    TypeOrmModule.forFeature([
      UserEntity,
      FriendRequestEntity,
      ConversationEntity,
      MessageEntity
    ])
  ],
  controllers: [ChatController],
  providers: [
    ChatService,
    ChatGateway,
    {
      provide: 'ConversationsRepositoryInterface',
      useClass: ConversationsRepository
    },
    {
      provide: 'MessagesRepositoryInterface',
      useClass: MessagesRepository
    }
  ]
})
export class ChatModule {}
