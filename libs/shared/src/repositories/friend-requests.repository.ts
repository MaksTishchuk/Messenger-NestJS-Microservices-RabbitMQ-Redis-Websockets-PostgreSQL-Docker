import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {BaseAbstractRepository, FriendRequestEntity} from "@app/shared";
import {FriendRequestsRepositoryInterface} from "@app/shared/interfaces/friend-requests.repository.interface";

@Injectable()
export class FriendRequestsRepository extends BaseAbstractRepository<FriendRequestEntity> implements FriendRequestsRepositoryInterface
{
  constructor(
    @InjectRepository(FriendRequestEntity)
    private readonly friendRequestEntity: Repository<FriendRequestEntity>,
  ) {
    super(friendRequestEntity)
  }
}