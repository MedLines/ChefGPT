'use client'
import {
  Check,
  ChefHat,
  ClipboardList,
  Loader2,
  ShoppingCart,
  Sparkles,
} from 'lucide-react'
import { useState } from 'react'

import { generateImageAction } from '@/app/actions'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export interface Recipe {
  name: string
  description?: string
  ingredients: string[]
  steps: string[]
  macros: {
    calories: number
    protein: string
  }
  visual_summary: string
}

interface RecipeDisplayProps {
  recipe: Recipe
  userIngredients: string[]
}

// ... imports

// ... interfaces

export default function RecipeDisplay({
  recipe,
  userIngredients,
}: RecipeDisplayProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  // Helper to check if we sort-of have the ingredient
  const hasIngredient = (recipeIng: string) => {
    const lowerRecipeIng = recipeIng.toLowerCase()
    return userIngredients.some((userIng) =>
      lowerRecipeIng.includes(userIng.toLowerCase()),
    )
  }

  const missingIngredients = recipe.ingredients.filter(
    (ing) => !hasIngredient(ing),
  )

  async function handleVisualize() {
    if (!recipe.visual_summary) return
    setLoading(true)
    try {
      const url = await generateImageAction(recipe.visual_summary)
      if (url) setImageUrl(url)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  function copyShoppingList() {
    const text = missingIngredients.join('\n')
    navigator.clipboard.writeText(text)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="relative mt-12 mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {/* Decorative Blur behind the card */}
      <div className="absolute inset-0 bg-primary/5 blur-[100px] -z-10 rounded-full" />

      <div className="bg-[#0F0F12]/80 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header Section */}
        <div className="relative p-8 sm:p-12 text-center border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
          <div className="inline-block p-2 rounded-2xl bg-white/5 border border-white/10 mb-6 shadow-xl">
            <ChefHat className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            {recipe.name}
          </h2>
          {recipe.description && (
            <p className="text-lg text-muted-foreground/80 font-light italic max-w-2xl mx-auto leading-relaxed">
              "{recipe.description}"
            </p>
          )}

          {/* Stats Bar */}
          {recipe.macros && (
            <div className="flex justify-center gap-8 mt-8">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-white tabular-nums">
                  {recipe.macros.calories}
                </span>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  Calories
                </span>
              </div>
              <div className="w-[1px] h-10 bg-white/10" />
              <div className="flex flex-col items-center">
                <span className="text-2xl font-bold text-white tabular-nums">
                  {recipe.macros.protein}
                </span>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  Protein
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="p-8 sm:p-12 space-y-12">
          {/* Dashboard Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Inventory Card */}
            <div className="bg-secondary/20 rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Kitchen Inventory
                </h4>
                <div className="text-xs  text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
                  READY
                </div>
              </div>
              <div className="space-y-3">
                {recipe.ingredients
                  .filter((ing) => hasIngredient(ing))
                  .map((ing, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 text-sm group"
                    >
                      <div className="w-5 h-5 flex-shrink-0 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500/20 transition-colors">
                        <Check className="w-3 h-3" />
                      </div>
                      <span className="text-foreground/80 group-hover:text-foreground transition-colors">
                        {ing}
                      </span>
                    </div>
                  ))}
                {recipe.ingredients.filter((ing) => hasIngredient(ing))
                  .length === 0 && (
                  <p className="text-sm text-muted-foreground italic">
                    No ingredients found.
                  </p>
                )}
              </div>
            </div>

            {/* Shopping List Card */}
            <div className="bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-2xl p-6 border border-white/5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[60px] rounded-full pointer-events-none transition-opacity duration-500 opacity-50 group-hover:opacity-100" />

              <div className="flex items-center justify-between mb-6 relative z-10">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  To Acquire
                </h4>
                <ShoppingCart className="w-4 h-4 text-orange-400" />
              </div>

              <div className="space-y-3 relative z-10">
                {missingIngredients.map((ing, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <div className="w-1.5 h-1.5 mt-1.5 flex-shrink-0 rounded-full bg-orange-500/80 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                    <span className="text-foreground/90">{ing}</span>
                  </div>
                ))}
                {missingIngredients.length === 0 && (
                  <p className="text-sm text-muted-foreground italic">
                    Full inventory available.
                  </p>
                )}
              </div>

              {missingIngredients.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyShoppingList}
                  className="mt-6 w-full border border-white/5 hover:bg-orange-500/10 hover:text-orange-400 text-muted-foreground transition-all rounded-lg relative z-10"
                >
                  {isCopied ? (
                    <span className="flex items-center gap-2">
                      <Check className="w-3 h-3" /> Copied
                    </span>
                  ) : (
                    `Copy List`
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Visualization Section */}
          {imageUrl ? (
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative aspect-video group">
              <img
                src={imageUrl}
                alt={recipe.name}
                className="w-full h-full object-cover animate-in fade-in duration-1000 transform transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ) : (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-full group">
                    <button
                      onClick={handleVisualize}
                      disabled={true}
                      className="w-full h-48 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center gap-4 group-hover:bg-white/5 transition-all cursor-not-allowed relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />

                      <div className="p-4 rounded-full bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300">
                        {loading ? (
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        ) : (
                          <Sparkles className="h-6 w-6 text-primary" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        {loading ? 'Rendering...' : 'Visualize Dish'}
                      </span>
                    </button>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-black/90 text-white border border-white/10 backdrop-blur-md">
                  <p>Coming soon</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Instructions Timeline */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
              <ClipboardList className="w-6 h-6 text-primary" />
              <span>Preparation</span>
            </h3>

            <div className="space-y-0 relative">
              {/* Connecting Line */}
              <div className="absolute left-[1.15rem] top-4 bottom-4 w-[1px] bg-gradient-to-b from-primary/50 via-white/10 to-transparent" />

              {recipe.steps.map((step, i) => (
                <div key={i} className="relative pl-12 pb-8 last:pb-0 group">
                  {/* Node */}
                  <div className="absolute left-0 top-0.5 w-10 h-10 rounded-xl bg-[#0F0F12] border border-white/10 flex items-center justify-center z-10 shadow-xl group-hover:border-primary/50 transition-colors duration-300">
                    <span className="font-mono text-sm text-muted-foreground group-hover:text-primary transition-colors font-bold">
                      {i + 1}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="prose prose-invert prose-p:text-muted-foreground/90 prose-p:leading-relaxed max-w-none group-hover:text-white transition-colors duration-300">
                    <p className="text-base sm:text-lg">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
