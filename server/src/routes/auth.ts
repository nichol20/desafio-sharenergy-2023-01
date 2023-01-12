import express from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { AuthController } from '../controllers/AuthController'

export const authRoutes = express.Router()

authRoutes.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body
  if(!refreshToken) return res.status(400).json({ message: 'Missing information '})

  const authController = new AuthController
  const refreshTokenExist = !!await authController.getRefreshToken(refreshToken)

  if(!refreshTokenExist) return res.status(498).json({ message: "Invalid token" })

  try {
    const { sub } = authController.verifyRefreshToken(refreshToken) as JwtPayload

    await authController.deleteRefreshToken(refreshToken)

    const newAccessToken = authController.generateAccessToken({}, { subject: sub })
    const newRefreshToken = authController.generateRefreshToken({}, { subject: sub })
    
    await authController.storeRefreshToken(newRefreshToken)

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    })

  } catch (error) {
    console.log(error)
    return res.status(498).json({ message: "Invalid token" })
  }
})