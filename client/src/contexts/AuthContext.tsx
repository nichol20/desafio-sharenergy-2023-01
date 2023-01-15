import { AxiosResponse } from "axios";
import { createContext, useEffect, useState } from "react";

import { Login, LoginResponse, SignOut, SignUp, CreateUserResponse, GetNewAccessTokenResponse, GetProfileResponse, Refresh } from "../types/auth";
import { User } from "../types/user";
import { http } from "../utils/http";

interface AuthContext {
  user: User | null
  refresh: Refresh
  login: Login,
  signUp: SignUp,
  signOut: SignOut
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthContext = createContext({} as AuthContext)

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [ user, setUser ] = useState<User | null>(null)
  const [ isLoading, setIsLoading ] = useState(true)

  const refresh = async () => {
    const refreshTokenResponse: AxiosResponse<GetNewAccessTokenResponse> = await http.get('/refresh-token', {
        withCredentials: true
    })
    const profileResponse: AxiosResponse<GetProfileResponse> = await http.get('/users/profile', {
      headers: {
        Authorization: `Bearer ${refreshTokenResponse.data.accessToken}`
      }
    })

    setUser({...profileResponse.data, accessToken: refreshTokenResponse.data.accessToken })
    return refreshTokenResponse.data.accessToken
}

  const login: Login = async (username, password, remember) => {
    const { data }: AxiosResponse<LoginResponse> = await http.post('/login', 
    { username, password }, {
      withCredentials: true
    })

    if(remember) {
      // the backend will send a cookie with a duration of 30d
      await http.get('/remember', {
        headers: { Authorization: `Bearer ${data.accessToken}` },
        withCredentials: true
      })
    }

    setUser(data.user)
  }

  const signUp: SignUp = async (username, password) => {
    const { data }: AxiosResponse<CreateUserResponse> = await http.post('/users', {
      username,
      password
    },{ withCredentials: true })

    setUser(data.user)
  }

  const signOut: SignOut = async () => {
    setUser(null)
    try {
        await http.get('/logout', { withCredentials: true })
    } catch (err) {
        console.error(err)
    }
  }

  // Persist login
  useEffect(() => {
    const verifyRefreshToken = async () => {
        try {
            await refresh()
        }
        catch (err) {
            console.error(err)
        }
        finally {
            setIsLoading(false);
        }
    }

    // Avoids unwanted call to verifyRefreshToken
    !user?.accessToken ? verifyRefreshToken() : setIsLoading(false);
  }, [])

  // wait until refresh token check 
  if(isLoading) return <>Loading...</>

  return (
    <AuthContext.Provider value={{ user, login, signUp, signOut, refresh }}>
      { children }
    </AuthContext.Provider>
  )
}