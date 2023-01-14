import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import db from './config/db'
import { clientRoutes } from './routes/client'
import { userRoutes } from './routes/user'
import { authRoutes } from './routes/auth'
import { imageRoutes } from './routes/image'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors({
  origin: process.env.FRONTEND_URL
}))

app.use('/images', express.static('src/images'))

app.use(clientRoutes)
app.use(userRoutes)
app.use(authRoutes)
app.use(imageRoutes)

// Global error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err.stack)
  res.status(500).send('Something broke!')
})

async function main() {
  try {
    await db.connectToServer()
    app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))
  } catch (error) {
    console.log(error)
    db.close()
    process.exit()
  }
}

main()