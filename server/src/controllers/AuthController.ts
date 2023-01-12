import db from "../config/db";
import jwt from 'jsonwebtoken'

import { Collections } from "../enums/Collections";
import { RefreshTokenDocument } from "../types/auth";

const DEFAULT_OPTIONS_ACCESS_TOKEN: jwt.SignOptions = {
  expiresIn: '1h'
}

const DEFAULT_OPTIONS_REFRESH_TOKEN: jwt.SignOptions = {
  expiresIn: '15d'
}

export class AuthController {
  private _refreshTokensCollection = db.getDb().collection<RefreshTokenDocument>(Collections.REFRESH_TOKENS)

  async storeRefreshToken(refreshToken: string) {
    return await this._refreshTokensCollection.insertOne({ token: refreshToken })
  }

  async getRefreshToken(refreshToken: string) {
    return await this._refreshTokensCollection.findOne({ token: refreshToken })
  }

  async deleteRefreshToken(refreshToken: string) {
    return await this._refreshTokensCollection.deleteOne({ token: refreshToken })
  }

  generateAccessToken(payload: string | object | Buffer, options?: jwt.SignOptions | undefined) {
    return jwt.sign(payload, process.env.JWT_SECRET!, { ...DEFAULT_OPTIONS_ACCESS_TOKEN, ...options })
  }

  verifyAccessToken (token: string) {
    return jwt.verify(token, process.env.JWT_SECRET!)
  }

  generateRefreshToken (payload: string | object | Buffer, options?: jwt.SignOptions | undefined) {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, { ...DEFAULT_OPTIONS_REFRESH_TOKEN, ...options })
  }
  
  verifyRefreshToken (refreshToken: string) {
    return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!)
  }
}