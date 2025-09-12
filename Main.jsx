import React from "react"
import IngredientsList from "./components/IngredientsList"
import ClaudeRecipe from "./components/ClaudeRecipe"
import { getRecipeFromChefGPT } from "./ai"

export default function Main() {
    const [ingredients, setIngredients] = React.useState(
        ["Fettuccine pasta",
  "Butter",
  "Heavy cream",
  "Garlic",
  "Parmesan cheese",
  "Salt",
  "Black pepper",
  "Parsley"
       ]
            )
    const [recipe, setRecipe] = React.useState("")
    const [loading, setLoading] = React.useState(false)

    async function getRecipe() {
        try {
            setLoading(true)
            const recipeMarkdown = await getRecipeFromChefGPT(ingredients)
            setRecipe(recipeMarkdown)
        } finally {
            setLoading(false)
        }
    }

    function addIngredient(event) {
        event.preventDefault()
        const formData = new FormData(event.target)
        const newIngredient = formData.get("ingredient")
        if (newIngredient && String(newIngredient).trim() !== "") {
            setIngredients(prev => [...prev, String(newIngredient).trim()])
        }
        event.target.reset()
    }

    return (
        <main>
            <form onSubmit={addIngredient} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <button type="submit">Add ingredient</button>
            </form>

            {ingredients.length > 0 &&
                <IngredientsList
                    ingredients={ingredients}
                    getRecipe={getRecipe}
                    loading={loading}
                />
            }

            {recipe && <ClaudeRecipe recipe={recipe} />}
        </main>
    )
}