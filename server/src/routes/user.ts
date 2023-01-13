import express from 'express'
import { UserController } from '../controllers/UserController'
import { mustBeAuthenticated } from '../middlewares/auth'

export const userRoutes = express.Router()

userRoutes.post('/users', async (req, res) => {
  const { username, password } = req.body

  if(!username || !password ) return res.status(400).json({ message: 'Missing information' })

  const userController = new UserController

  try {
    const usernameExist = await userController.isUsernameInUse(username)
  
    if(usernameExist) return res.status(409).json({ message: 'User already exists' })
  
    const response = await userController.create({ username, password })
  
    return res.status(201).json(response)
    
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
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Something broke!' })
  }
})


userRoutes.post('/login', async (req, res) => {
  const { username, password } = req.body

  if(!username || !password ) return res.status(400).json({ message: 'Missing information' })

  const userController = new UserController

  try {
    const response = await userController.login(username, password)
  
    if(!response) return res.status(401).json({ message: 'Wrong crendentials' })
  
    return res.status(201).json(response)
    
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Something broke!' })
  }
})