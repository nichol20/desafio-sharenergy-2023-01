import jwt from 'jsonwebtoken'

const DEFAULT_OPTIONS_ACCESS_TOKEN: jwt.SignOptions = {
  expiresIn: '30min'
}

const DEFAULT_OPTIONS_REFRESH_TOKEN: jwt.SignOptions = {
  expiresIn: '1d'
}

export class AuthController {
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