import {IsEmail, IsString, MinLength} from "class-validator";

export class RegisterUserDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(6, {message: 'Minimal password length - 6 symbols!'})
  password: string

  @IsString()
  firstName: string

  @IsString()
  lastName: string
}