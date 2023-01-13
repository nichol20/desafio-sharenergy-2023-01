export interface User {
  username:   string
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
}