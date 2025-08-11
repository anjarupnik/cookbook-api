import recipeService from '../services/recipe.service.js'
import Recipe from '../models/recipe.model.js'

async function addRecipe(req, res) {
  try {
    const { url } = req.body || {}
    if (!url) return res.status(400).json({ error: 'Missing "url" in body' })

    const data = await recipeService.scrapeAndParse(url)
    const recipe = await Recipe.create(data)

    res.status(201).json(recipe)
  } catch (err) {
    if (err.code === 11000 && err.keyPattern?.slug) {
      return res.status(409).json({ message: 'Slug already exists' })
    }

    res
      .status(500)
      .json({ error: 'Scraping failed', details: String(err.message || err) })
  }
}

async function getAllRecipes(_, res) {
  try {
    const recipes = await Recipe.find()
    res.json(recipes)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

async function getRecipeBySlug(req, res) {
  try {
    const recipe = await Recipe.findOne({ slug: req.params.slug })

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' })
    }

    res.json(recipe)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const recipeController = {
  addRecipe,
  getAllRecipes,
  getRecipeBySlug,
}
