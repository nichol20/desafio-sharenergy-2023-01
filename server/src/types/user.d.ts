import { Client } from "./client"

export interface UserDocument {
  username: string
  password: string
  clientList: Client[]
}