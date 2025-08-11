import mongoose from 'mongoose'

const RecipeSchema = new mongoose.Schema(
  {
    name: String,
    photo: String,
    link: String,
    timeToPrepare: String,
    servings: Number,
    slug: { type: String, unique: true },
    shortDescription: String,
    tags: [String],
    ingredients: [String],
    instructions: [String],
  },
  { timestamps: true }
)

export default mongoose.model('Recipe', RecipeSchema)
