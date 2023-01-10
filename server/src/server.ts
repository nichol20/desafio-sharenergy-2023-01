import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { clientRoutes } from './routes/client'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors({
  origin: process.env.FRONTEND_URL
}))

app.use(clientRoutes)

// Global error handling
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))