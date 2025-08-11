import { Router } from 'express'
import { recipeController } from '../controllers/recipe.controller.js'

const router = Router()
router.post('/', recipeController.addRecipe)

export default router
