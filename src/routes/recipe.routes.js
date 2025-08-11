import { Router } from 'express'
import { recipeController } from '../controllers/recipe.controller.js'

const router = Router()
router.get('/', recipeController.getAllRecipes)
router.post('/', recipeController.addRecipe)
router.get('/:slug', recipeController.getRecipeBySlug)

export default router
