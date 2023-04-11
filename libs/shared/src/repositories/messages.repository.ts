import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {BaseAbstractRepository, MessageEntity} from "@app/shared";
import {MessagesRepositoryInterface} from "@app/shared/interfaces/messages.repository.interface";

@Injectable()
export class MessagesRepository extends BaseAbstractRepository<MessageEntity> implements MessagesRepositoryInterface {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly MessageEntity: Repository<MessageEntity>,
  ) {
    super(MessageEntity)
  }
}