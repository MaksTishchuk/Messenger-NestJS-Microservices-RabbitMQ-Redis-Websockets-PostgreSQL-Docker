import {BaseInterfaceRepository, ConversationEntity} from '@app/shared';

export interface ConversationsRepositoryInterface extends BaseInterfaceRepository<ConversationEntity> {
  findConversation(userId: number, friendId: number): Promise<ConversationEntity | undefined>
}