import { NextFunction, Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { AuthController } from '../controllers/AuthController'

export const mustBeAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader = req.headers.authorization

  if(!authorizationHeader) return res.status(401).json({ message: "a token is required to access this route" })

  const [, token] = authorizationHeader.split(' ')

  try {
    const authController = new AuthController
    const { sub } = authController.verifyAccessToken(token) as JwtPayload

    req.authorId = sub!

    return next()
  } catch (error: any) {
    return res.status(401).json({ message: "Invalid token" })
  }
}