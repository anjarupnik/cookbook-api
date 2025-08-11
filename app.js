import express from 'express'
import * as cheerio from 'cheerio'
import { Ollama } from 'ollama'
import TurndownService from 'turndown'

const app = express()
app.use(express.json())
const port = 8080

const ollama = new Ollama()

async function fetchHtml(url) {
  const res = await fetch(url)

  if (!res.ok) {
    throw new Error(`Fetch failed ${res.status} ${res.statusText}`)
  }

  return await res.text()
}

function htmlToMarkdown(html) {
  const $ = cheerio.load(html)
  $('script, style, noscript, svg').remove()
  $('[style]').removeAttr('style')
  const recipe = $('.wprm-recipe-container').html() || $('body').html()

  const turndownService = new TurndownService()
  const markdown = turndownService.turndown(recipe)

  return markdown
}

async function getJSONData(markdown) {
  const prompt = `You are an expert recipe data extractor. Your task is to extract recipe data from the provided content.
  Return ONLY valid JSON with EXACTLY the following fields and formats: name: string, photo: string, link: string,
  timeToPrepare: string, servings: number, slug: string, shortDescription: string, tags: array of strings (1 word per tag describing type of the dish), ingredients: array of strings,
  instructions: array of strings. Return ONLY the JSON without any additional text. Text: ${markdown}`

  const res = await ollama.generate({
    model: 'llama3.1:8b',
    prompt,
    format: 'json',
    stream: false,
    keep_alive: '30m',
    options: { temperature: 0.1, num_ctx: 8000, num_thread: 8 },
  })

  return JSON.parse(res.response)
}

app.post('/scrape', async (req, res) => {
  try {
    const { url } = req.body || {}
    if (!url) return res.status(400).json({ error: 'Missing "url" in body' })

    const html = await fetchHtml(url)
    const recipeMarkdown = htmlToMarkdown(html)
    const data = await getJSONData(recipeMarkdown)

    res.json(data)
  } catch (err) {
    console.error(err)
    res
      .status(500)
      .json({ error: 'Scraping failed', details: String(err.message || err) })
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
