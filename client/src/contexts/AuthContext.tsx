import Cookies from "js-cookie";
import { createContext, useEffect, useState } from "react";
import { http } from "../utils/http";

interface AuthContext {
  user: Object | null
  setUserInCookies: Function
  login: Function
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthContext = createContext({} as AuthContext)

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [ user, setUser ] = useState({ username: 'test'})

  const setUserInCookies = (username: string, password: string) => {
    Cookies.set('username', username)
    Cookies.set('password', password)
  }

  const login = async (username: string, password: string) => {
    const { data } = await http.post('/login', {
      username,
      password
    })
  }

  useEffect(() => {
    const checkUserInCookies = () => {
      const username = Cookies.get('username')
      const password = Cookies.get('password')
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUserInCookies, login }}>
      { children }
    </AuthContext.Provider>
  )
}