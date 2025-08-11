import express from 'express'
import recipeRoutes from './routes/recipe.routes.js'

const app = express()
app.use(express.json())
app.use('/recipes', recipeRoutes)

const port = 8080
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
