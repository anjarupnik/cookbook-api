import recipeService from '../services/recipe.service.js'

async function addRecipe(req, res) {
  try {
    const { url } = req.body || {}
    if (!url) return res.status(400).json({ error: 'Missing "url" in body' })

    const data = await recipeService.scrapeAndParse(url)
    res.json(data)
  } catch (err) {
    console.error(err)
    res
      .status(500)
      .json({ error: 'Scraping failed', details: String(err.message || err) })
  }
}

export const recipeController = {
  addRecipe,
}
