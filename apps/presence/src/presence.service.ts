import { Injectable } from '@nestjs/common';
import {RedisCacheService} from "@app/shared";
import {ActiveUser} from "./interfaces/ActiveUser.interface";

@Injectable()
export class PresenceService {

  constructor(private readonly cache: RedisCacheService) {}

  getOnline() {
    console.log('NOT CACHED')
    return {online: 'online'}
  }

  async getActiveUser(id: number) {
    const user = await this.cache.get(`user ${id}`)
    return user as ActiveUser | undefined
  }
}
