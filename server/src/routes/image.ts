import express from 'express'
import fs from 'fs'
import path from 'path'
import { mustBeAuthenticated } from '../middlewares/auth'

export const imageRoutes = express.Router()
 
imageRoutes.get('/images/client-icons', mustBeAuthenticated, async (req, res) => {
  const clientIcons = fs.readdirSync(path.resolve('src/images/client-icons'))
  const urls = clientIcons.map(icon => `${process.env.BASE_URL}${req.path}${icon}`)
  res.send(urls)
})