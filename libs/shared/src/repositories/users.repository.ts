import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {BaseAbstractRepository, UserEntity, UserRepositoryInterface} from "@app/shared";


@Injectable()
export class UsersRepository extends BaseAbstractRepository<UserEntity> implements UserRepositoryInterface {
  constructor(
    @InjectRepository(UserEntity) private readonly UserRepository: Repository<UserEntity>,
  ) {
    super(UserRepository)
  }
}