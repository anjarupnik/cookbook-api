import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import recipeRoutes from './routes/recipe.routes.js'
import { connectDB } from './config/db.js'

const app = express()
app.use(express.json())
app.use(cors())

connectDB()

app.use('/recipes', recipeRoutes)

const port = 8080
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
