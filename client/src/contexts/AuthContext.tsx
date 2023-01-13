import { AxiosResponse } from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Login, LoginResponse, SignOut, SignUp, CreateUserResponse, GetNewAccessTokenResponse, GetProfileResponse } from "../types/auth";
import { User } from "../types/user";
import { AccessTokenCookieController, UserCookieController, RefreshTokenCookieController } from "../utils/cookies";
import { http } from "../utils/http";

interface AuthContext {
  user: User | null
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
  const navigate = useNavigate()

  const login: Login = async (username, password) => {
    const { data }: AxiosResponse<LoginResponse> = await http.post('/login', {
      username,
      password
    })

    AccessTokenCookieController.set(data.accessToken)
    RefreshTokenCookieController.set(data.refreshToken)
    setUser(data.user)
  }

  const signUp: SignUp = async (username, password) => {
    const { data }: AxiosResponse<CreateUserResponse> = await http.post('/users', {
      username,
      password
    })

    AccessTokenCookieController.set(data.accessToken)
    RefreshTokenCookieController.set(data.refreshToken)
    setUser(data.user)
  }

  const signOut: SignOut = async () => {
    RefreshTokenCookieController.remove()
    AccessTokenCookieController.remove()
    UserCookieController.remove()
  }

  useEffect(() => {
    const autoLogin = async () => {
      // try to log in first with the username and password saved in cookies (if any)
      const user = UserCookieController.get()
      if(user) {
        try {
          await login(user.username, user.password)
          return
        } catch (error) {
          UserCookieController.remove()
        }
      }

      // second try to get an access token with the refresh token
      const refreshToken = RefreshTokenCookieController.get()
      if(refreshToken) {
        try {
          const { data }: AxiosResponse<GetNewAccessTokenResponse> = await http.post('/refresh-token', { refreshToken })
          // if successful fetch the user using the access token and replace tokens in cookies
          RefreshTokenCookieController.set(data.refreshToken)
          AccessTokenCookieController.set(data.accessToken)
          const user = await fetchUser(data.accessToken)
          setUser(user)
        } catch (error) {
          RefreshTokenCookieController.remove()
          throw error
        }
      }

      navigate('/login')
    }

    // Get user information with access token
    const fetchUser = async (token: string) => {
      const { data }: AxiosResponse<GetProfileResponse> = await http.get('/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      return data
    }
    
    const handleAuth = async () => {
      const accessToken = AccessTokenCookieController.get()
      const refreshToken = RefreshTokenCookieController.get()

      // if it has a refresh token, reset the access token
      // if doesn't have an access token saved in cookies then try automatic login
      if(refreshToken || !accessToken) {
        try {
          await autoLogin()
        } catch (error) {
          navigate('/login')
        }
        return
      }
        
      try {
        const user = await fetchUser(accessToken)
        setUser(user)
      } catch (error) {
        AccessTokenCookieController.remove()
        // if access token is changed or expired, try automatic login
        try {
          await autoLogin()
        } catch (error) {
          navigate('/login')
        }
      }
    }

    handleAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, signUp, signOut }}>
      { children }
    </AuthContext.Provider>
  )
}