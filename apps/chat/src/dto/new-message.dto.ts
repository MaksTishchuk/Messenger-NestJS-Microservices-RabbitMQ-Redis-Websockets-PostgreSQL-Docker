import {IsNumber, IsString} from "class-validator";

export class NewMessageDto {
  @IsString()
  message: string

  @IsNumber()
  conversationId: number

  @IsNumber()
  friendId: number
}