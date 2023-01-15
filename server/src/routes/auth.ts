import express from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { AuthController } from '../controllers/AuthController'
import { UserController } from '../controllers/UserController'
import { mustBeAuthenticated } from '../middlewares/auth'

export const authRoutes = express.Router()

authRoutes.get('/refresh-token', async (req, res) => {
  const cookies = req.cookies;
  if(!cookies?.jwt) return res.sendStatus(401)
  const refreshToken = cookies.jwt

  const authController = new AuthController

  try {
    const { sub } = authController.verifyRefreshToken(refreshToken) as JwtPayload

    const userController = new UserController
    const user = await userController.findOne(sub!)

    if(!user) return res.sendStatus(403);

    const newAccessToken = authController.generateAccessToken({}, { subject: sub })

    return res.status(200).json({ accessToken: newAccessToken })

  } catch (error) {
    console.log(error)
    return res.sendStatus(403)
  }
})

authRoutes.get('/remember', mustBeAuthenticated, async (req, res) => {
  const authorId = req.authorId

  const authController = new AuthController
  const refreshToken = authController.generateRefreshToken({}, { subject: authorId, expiresIn: '30d' })

  res.cookie('jwt', refreshToken, { 
    httpOnly: true, 
    sameSite: 'none', 
    secure: true, 
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30d
  })

  res.sendStatus(200)
})

authRoutes.post('/login', async (req, res) => {
  const { username, password } = req.body

  if(!username || !password ) return res.status(400).json({ message: 'Missing information' })

  const userController = new UserController

  try {
    const response = await userController.login(username, password)
  
    if(!response) return res.status(401).json({ message: 'Wrong crendentials' })

    // session cookie
    res.cookie('jwt', response.refreshToken, { 
      httpOnly: true, 
      sameSite: 'none', 
      secure: true
    })
    return res.status(201).json({ accessToken: response.accessToken, user: response.user })
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Something broke!' })
  }
})

authRoutes.get('/logout', async (req, res) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return res.sendStatus(200)
  const refreshToken = cookies.jwt

  try {
    const userController = new UserController
    const authController = new AuthController

    // Is refresh token in db
    const { sub } = authController.verifyRefreshToken(refreshToken) as JwtPayload
    const user = await userController.findOne(sub!)

    if (!user) {
      res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
      return res.sendStatus(200)
    }

    // Clear refresh token in db
    await userController.updateOne({ refreshToken: '' }, sub!)

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
    return res.sendStatus(200)
  } catch (error) {
    return res.status(500).json({ message: 'Something broke' })
  }
})