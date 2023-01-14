import { User } from "./user"

export interface LoginResponse {
  user:         User
  accessToken:  string
  refreshToken: string
}

export interface CreateUserResponse extends LoginResponse {}

export type GetProfileResponse = User

export interface GetNewAccessTokenResponse {
  accessToken:  string
  refreshToken: string
}

export type Login = (uersename: string, password: string) => Promise<void>
export type SignUp = (uersename: string, password: string) => Promise<void>
export type SignOut = () => Promise<void>