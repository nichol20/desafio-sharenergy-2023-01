export interface User {
  username:   string
  accessToken?: string | undefined
  clientList: Client[]
}

export interface Client {
  id:         string
  name:       string
  email:      string
  phone:      string
  address:    string
  cpf:        string
  created_at: string
  icon:       string
}