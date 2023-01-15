import { Client } from "./client"

export interface UserDocument {
  username: string
  password: string
  refreshToken?: string
  clientList: Client[]
}