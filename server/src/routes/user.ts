import express from 'express'
import { UserController } from '../controllers/UserController'
import { mustBeAuthenticated } from '../middlewares/auth'

export const userRoutes = express.Router()

userRoutes.post('/users', async (req, res) => {
  const { username, password } = req.body

  // check req.body
  if(!username || !password ) return res.status(400).json({ message: 'Missing information' })

  const userController = new UserController

  try {
    // check if username is in use
    const usernameExist = await userController.isUsernameInUse(username)
    if(usernameExist) return res.status(409).json({ message: 'User already exists' })
  
    // create user
    const response = await userController.create({ username, password })
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


userRoutes.get('/users/profile', mustBeAuthenticated, async (req, res) => {
  const userController = new UserController

  try {
    const user = await userController.findOne(req.authorId!)
    
    if(!user) return res.status(404).json({ message: 'User not found' })

    return res.status(200).json(user)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Something broke!' })
  }
})


userRoutes.get('/users', mustBeAuthenticated, async (req, res) => {
  const userController = new UserController
  const limitQuery = parseInt(String(req.query.limit))
  const limit = isNaN(limitQuery) ? undefined : limitQuery

  try {
    const users = await userController.find(limit)
    return res.status(200).json(users)
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Something broke!' })
  }
})


userRoutes.get('/users/:userId', mustBeAuthenticated, async (req, res) => {
  const { userId } = req.params
  const userController = new UserController

  try {
    const user = await userController.findOne(userId)
    
    if(!user) return res.status(404).json({ message: 'User not found' })

    return res.status(200).json(user)
  } catch (error: any) {
    console.log(error.message)
    return res.status(404).json({ message: 'User not found' })
  }
})

userRoutes.post('/users/check-username-status', async (req, res) => {
  const { username } = req.body
  const userController = new UserController

  if(!username) return res.status(400).json({ message: 'Missing information' })

  try {
    let status: string
    const isUsernameInUse = await userController.isUsernameInUse(username)

    if(isUsernameInUse) status = 'registered'
    else status = 'not registered'

    return res.status(200).json({ status })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Something broke!' })
  }
})