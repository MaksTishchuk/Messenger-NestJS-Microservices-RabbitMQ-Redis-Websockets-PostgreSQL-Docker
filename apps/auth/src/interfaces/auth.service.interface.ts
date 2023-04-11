import { FriendRequestEntity, UserEntity, UserJwt } from '@app/shared';
import {RegisterUserDto} from "../dto/register-user.dto";
import {LoginUserDto} from "../dto/login-user.dto";


export interface AuthServiceInterface {
  getUsers(): Promise<UserEntity[]>
  getUserById(id: number): Promise<UserEntity>
  findByEmail(email: string): Promise<UserEntity>
  findById(id: number): Promise<UserEntity>
  hashPassword(password: string): Promise<string>
  register(dto: Readonly<RegisterUserDto>): Promise<UserEntity>
  isPasswordMatch(password: string, hashedPassword: string): Promise<boolean>
  validateUser(email: string, password: string): Promise<UserEntity>
  login(dto: Readonly<LoginUserDto>): Promise<{ token: string; user: UserEntity }>
  verifyJwt(jwt: string): Promise<{ user: UserEntity; exp: number }>
  getUserFromHeader(jwt: string): Promise<UserJwt>
  addFriend(userId: number, friendId: number): Promise<FriendRequestEntity>
  getFriends(userId: number): Promise<FriendRequestEntity[]>
}