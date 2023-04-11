import {UserRequest} from "@app/shared/interfaces/user-request.interface";

export interface UserJwt extends UserRequest {
  iat: number
  exp: number
}