import { UserEntity } from '../entities/user.entity';
import {BaseInterfaceRepository} from "@app/shared/repositories/base/base.interface.repository";

export interface UserRepositoryInterface extends BaseInterfaceRepository<UserEntity> {}