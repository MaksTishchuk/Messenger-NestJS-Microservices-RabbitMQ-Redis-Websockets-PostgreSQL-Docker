import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {BaseAbstractRepository, ConversationEntity} from "@app/shared";
import {ConversationsRepositoryInterface} from "@app/shared/interfaces/conversations.repository.interface";

@Injectable()
export class ConversationsRepository extends BaseAbstractRepository<ConversationEntity> implements ConversationsRepositoryInterface {
  constructor(
    @InjectRepository(ConversationEntity)
    private readonly conversationEntity: Repository<ConversationEntity>,
  ) {
    super(conversationEntity)
  }

  public async findConversation(userId: number, friendId: number): Promise<ConversationEntity | undefined> {
    return await this.conversationEntity
      .createQueryBuilder('conversation')
      .leftJoin('conversation.users', 'user')
      .where('user.id = :userId', { userId })
      .orWhere('user.id = :friendId', { friendId })
      .groupBy('conversation.id')
      .having('COUNT(*) > 1')
      .getOne()
  }
}