import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {
  ConversationEntity,
  FriendRequestEntity,
  FriendRequestsRepository, MessageEntity,
  PostgresDBModule,
  SharedModule,
  SharedService,
  UserEntity,
  UsersRepository
} from "@app/shared";
import {JwtModule} from "@nestjs/jwt";
import {JwtGuard} from "./jwt/jwt.guard";
import {JwtStrategy} from "./jwt/jwt.strategy";

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '3600s' },
      }),
      inject: [ConfigService],
    }),
    SharedModule,
    PostgresDBModule,
    TypeOrmModule.forFeature([
      UserEntity,
      FriendRequestEntity,
      ConversationEntity,
      MessageEntity
    ])
  ],
  controllers: [AuthController],
  providers: [
    JwtGuard,
    JwtStrategy,
    {
      provide: 'AuthServiceInterface',
      useClass: AuthService
    },
    {
      provide: 'UsersRepositoryInterface',
      useClass: UsersRepository
    },
    {
      provide: 'SharedServiceInterface',
      useClass: SharedService
    },
    {
      provide: 'FriendRequestsRepositoryInterface',
      useClass: FriendRequestsRepository
    }
  ],
})
export class AuthModule {}