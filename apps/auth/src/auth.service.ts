import {
  BadRequestException, Inject,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import {RegisterUserDto} from "./dto/register-user.dto";
import * as bcrypt from 'bcrypt'
import {RpcException} from "@nestjs/microservices";
import {LoginUserDto} from "./dto/login-user.dto";
import {JwtService} from "@nestjs/jwt";
import {
  FriendRequestEntity,
  FriendRequestsRepository,
  UserEntity,
  UserJwt,
  UserRepositoryInterface
} from "@app/shared";
import {AuthServiceInterface} from "./interfaces/auth.service.interface";

@Injectable()
export class AuthService implements AuthServiceInterface{

  constructor(
    @Inject('UsersRepositoryInterface')
    private readonly usersRepository: UserRepositoryInterface,
    @Inject('FriendRequestsRepositoryInterface')
    private readonly friendRequestsRepository: FriendRequestsRepository,
    private readonly jwtService: JwtService
  ) {}

  async getUsers() {
    return this.usersRepository.findAll()
  }

  async getUserById(id: number): Promise<UserEntity> {
    return await this.usersRepository.findOneById(id)
  }

  async findById(id: number): Promise<UserEntity> {
    return this.usersRepository.findOneById(id);
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.usersRepository.findByCondition({
      where: {email},
      select: ['id', "email", "password", "firstName", "lastName"]
    })
  }

  async register(dto: Readonly<RegisterUserDto>): Promise<UserEntity> {
    const {email, password, firstName, lastName} = dto
    const isExists = await this.findByEmail(email)
    if (isExists) { throw new RpcException('User with this email already exists!')}
    const hashedPassword = await this.hashPassword(password)
    const savedUser = await this.usersRepository.save({
      email,
      password: hashedPassword,
      firstName,
      lastName
    })
    delete savedUser.password
    return savedUser
  }

  async login(dto: Readonly<LoginUserDto>) {
    const {email, password} = dto
    const user = await this.validateUser(email, password)
    if (!user) { throw new UnauthorizedException() }
    delete user.password
    const jwtToken = await this.jwtService.signAsync({ user })
    return { token: jwtToken, user }
  }

  async verifyJwt(jwt: string): Promise<{ user: UserEntity; exp: number }> {
    if (!jwt) { throw new UnauthorizedException() }
    try {
      const { user, exp } = await this.jwtService.verifyAsync(jwt)
      return { user, exp }
    } catch (error) {
      throw new UnauthorizedException()
    }
  }

  async getUserFromHeader(jwt: string): Promise<UserJwt> {
    if (!jwt) return
    try {
      return this.jwtService.decode(jwt) as UserJwt
    } catch (error) {
      throw new BadRequestException()
    }
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
  }

  async validateUser(email: string, password: string): Promise<UserEntity> {
    const user = await this.findByEmail(email)
    const isUserExist = !!user
    if (!isUserExist) return null
    const isPasswordMatch = await this.isPasswordMatch(password, user.password)
    if (!isPasswordMatch) return null
    return user
  }

  async isPasswordMatch(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  }

  async addFriend(userId: number, friendId: number): Promise<FriendRequestEntity> {
    const creator = await this.findById(userId)
    const receiver = await this.findById(friendId)
    return await this.friendRequestsRepository.save({ creator, receiver })
  }

  async getFriends(userId: number): Promise<FriendRequestEntity[]> {
    const creator = await this.findById(userId)
    return await this.friendRequestsRepository.findWithRelations({
      where: [{ creator }, { receiver: creator }],
      relations: ['creator', 'receiver']
    })
  }

  async getFriendsList(userId: number) {
    const friendRequests = await this.getFriends(userId)
    if (!friendRequests) return []
    const friends = friendRequests.map((friendRequest) => {
      const isUserCreator = userId === friendRequest.creator.id
      const friendDetails = isUserCreator ? friendRequest.receiver : friendRequest.creator
      const { id, firstName, lastName, email } = friendDetails
      return {id, email, firstName, lastName}
    })
    return friends
  }
}
