import Cookies from "js-cookie";
import { Cookies as CookiesEnum } from "../enums/Cookies";

export const UserCookieController = {
  set: (username: string, password: string) => {
    Cookies.set(CookiesEnum.USERNAME, username)
    Cookies.set(CookiesEnum.PASSWORD, password)
  },

  get: () => {
    const username = Cookies.get(CookiesEnum.USERNAME)
    const password = Cookies.get(CookiesEnum.PASSWORD)
  
    if(username && password) return { username, password }
  },

  remove: () => {
    Cookies.remove(CookiesEnum.USERNAME)
    Cookies.remove(CookiesEnum.PASSWORD)
  }
}

export const AccessTokenCookieController = {
  set: (token: string) => {
    Cookies.set(CookiesEnum.ACCESS_TOKEN, token)
  },

  get: () => {
    return Cookies.get(CookiesEnum.ACCESS_TOKEN)
  },

  remove: () => {
    Cookies.remove(CookiesEnum.ACCESS_TOKEN)
  }
}

export const RefreshTokenCookieController = {
  set: (token: string) => {
    Cookies.set(CookiesEnum.REFRESH_TOKEN, token)
  },

  get: () => {
    return Cookies.get(CookiesEnum.REFRESH_TOKEN)
  },

  remove: () => {
    Cookies.remove(CookiesEnum.REFRESH_TOKEN)
  }
}