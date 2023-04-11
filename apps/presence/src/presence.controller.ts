import {CacheInterceptor, Controller, UseInterceptors} from '@nestjs/common';
import { PresenceService } from './presence.service';
import {Ctx, MessagePattern, Payload, RmqContext} from "@nestjs/microservices";
import {RedisCacheService, SharedService} from "@app/shared";

@Controller()
export class PresenceController {
  constructor(
    private readonly presenceService: PresenceService,
    private readonly redisService: RedisCacheService,
    private readonly sharedService: SharedService
  ) {}

  @MessagePattern({ cmd: 'get-presence' })
  @UseInterceptors(CacheInterceptor)
  async getPresence(@Ctx() context: RmqContext) {
    this.sharedService.acknowledgeMessage(context)
    const onlineIs = await this.redisService.get('online')
    if (onlineIs) {
      console.log('CACHED')
      return onlineIs
    }
    const online = await this.presenceService.getOnline()
    await this.redisService.set('online', online)
    return online
  }

  @MessagePattern({ cmd: 'get-active-user' })
  async getActiveUser(
    @Ctx() context: RmqContext,
    @Payload() payload: { id: number },
  ) {
    this.sharedService.acknowledgeMessage(context)
    return await this.presenceService.getActiveUser(payload.id)
  }
}
