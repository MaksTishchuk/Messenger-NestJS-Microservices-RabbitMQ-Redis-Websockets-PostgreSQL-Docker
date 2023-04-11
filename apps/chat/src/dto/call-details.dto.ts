import {IsNumber, IsString} from "class-validator";

export class CallDetailsDto {
  @IsString()
  meetingId: string

  @IsNumber()
  friendId: number
}