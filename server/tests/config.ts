import { Client } from "../src/types/client"
import { UserDocument } from "../src/types/user"

export const authorizationHeader = (token: string) => { 
  return { 'Authorization': `Bearer ${token}` } 
}

export const fakeUser: Omit<UserDocument, "clientList" | "refreshToken"> = {
  username: 'usertest',
  password: 'test123'
}

export const fakeClient: Omit<Client, "created_at" | "id"> = {
  address: 'fakeAddress',
  cpf: 'fakeCpf',
  email: 'fakeEmail@fake.com',
  icon: 'http://fakeIcon.com/1.png',
  name: 'fakeClient',
  phone: '(99) 99999-9999'
}

export const fakeClient2: Omit<Client, "created_at" | "id"> = {
  address: 'fakeAddress2',
  cpf: 'fakeCpf2',
  email: 'fakeEmail@fake.com2',
  icon: 'http://fakeIcon.com/1.png2',
  name: 'fakeClient',
  phone: '(99) 99999-99992'
}