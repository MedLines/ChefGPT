'use client'
import { ChefHat, Loader2, Send, Sparkles, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'

import RecipeDisplay, { Recipe } from '@/components/RecipeDisplay'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'

import { chatAction, generateRecipeAction } from './actions'

const commonIngredients = [
  'Chicken',
  'Beef',
  'Eggs',
  'Milk',
  'Butter',
  'Cheese',
  'Onion',
  'Garlic',
  'Tomato',
  'Potato',
  'Carrot',
  'Spinach',
  'Rice',
  'Pasta',
  'Flour',
  'Sugar',
  'Salt',
  'Pepper',
  'Oil',
  'Lamb',
  'Chickpeas',
  'Lentils',
  'Tahini',
  'Yogurt',
  'Labneh',
  'Pomegranate Molasses',
  'Zaatar',
  'Sumac',
  'Cumin',
  'Coriander',
  'Cardamom',
  'Parsley',
  'Mint',
  'Eggplant',
  'Bulgur',
  'Dates',
  'Pine Nuts',
  'Lemon',
]
export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>([])
  const [strictMode, setStrictMode] = useState(false)
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatHistory, setChatHistory] = useState<
    { role: 'user' | 'assistant'; content: string }[]
  >([])
  const [chatLoading, setChatLoading] = useState(false)

  // Custom Dropdown State
  const [ingredientInput, setIngredientInput] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [filteredIngredients, setFilteredIngredients] = useState<string[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatHistory, chatLoading])

  // Initialize filtered ingredients
  useEffect(() => {
    setFilteredIngredients(commonIngredients)
  }, [])

  // Debounce logic for filtering
  useEffect(() => {
    const timer = setTimeout(() => {
      if (ingredientInput) {
        const filtered = commonIngredients.filter((item) =>
          item.toLowerCase().includes(ingredientInput.toLowerCase()),
        )
        setFilteredIngredients(filtered)
      } else {
        setFilteredIngredients(commonIngredients)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [ingredientInput])

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as unknown as Node)
      ) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function addIngredient(e?: React.FormEvent) {
    if (e) e.preventDefault()
    const rawInput = ingredientInput.trim()
    if (rawInput) {
      // Capitalize first letter
      const newIngredient = rawInput.charAt(0).toUpperCase() + rawInput.slice(1)
      if (!ingredients.includes(newIngredient)) {
        setIngredients((prev) => [...prev, newIngredient])
      }
      setIngredientInput('')
      setShowDropdown(false)
    }
  }

  function handleSelectIngredient(item: string) {
    setIngredientInput(item)
    // We can auto-add or just set value.
    // Let's just set value so user can click Add or verify.
    // Or better, let's auto-add if they click a suggestion?
    // User expectation for "dropdown" in this context might be "fill".
    // I'll stick to set value + focus ref if I had one, but keeping it simple:
    setShowDropdown(false)
  }

  function removeIngredient(index: number) {
    setIngredients((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleGenerate() {
    if (ingredients.length === 0) return
    setLoading(true)
    setRecipe(null)
    setChatHistory([]) // Reset chat on new recipe
    try {
      const data = await generateRecipeAction(ingredients, strictMode)
      setRecipe(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function handleChat(e: React.FormEvent) {
    e.preventDefault()
    if (!chatInput.trim() || !recipe) return

    const userMsg = chatInput
    setChatInput('')
    setChatHistory((prev) => [...prev, { role: 'user', content: userMsg }])
    setChatLoading(true)

    try {
      const response = await chatAction(userMsg, recipe)
      if (response) {
        setChatHistory((prev) => [
          ...prev,
          { role: 'assistant', content: response },
        ])
      }
    } catch (error) {
      console.error(error)
    } finally {
      setChatLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background relative overflow-x-hidden selection:bg-primary/20">
      {/* Background Ambience - Linear Style */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] opacity-50 mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] opacity-50 mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto py-20 px-6 sm:px-8 space-y-16">
        {/* Header - Awwwards Style Typography */}
        <div className="text-center space-y-6 animate-in fade-in slide-in-from-top-8 duration-700 ease-out">
          <div className="inline-flex items-center justify-center p-1 rounded-full bg-secondary/50 border border-border/50 backdrop-blur-sm mb-4">
            <div className="bg-background/80 p-2 rounded-full border border-border/50 shadow-sm">
              <ChefHat className="w-6 h-6 text-primary" />
            </div>
            <span className="px-3 text-xs font-mono font-medium tracking-wider text-muted-foreground uppercase">
              AI Culinary Architect
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-foreground via-foreground/90 to-foreground/50 pb-2">
            ChefGPT
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground/80 max-w-lg mx-auto leading-relaxed font-light">
            Your Michelin-star assistant. <br className="hidden sm:block" />
            Designed for the modern kitchen.
          </p>
        </div>

        {/* Command Bar Input Section */}
        <div className="max-w-2xl mx-auto">
          <div className="relative group" ref={dropdownRef}>
            {/* Glow Effect behind input */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-blue-500/50 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-focus-within:opacity-100 group-focus-within:duration-200" />

            <div className="relative bg-[#0F0F12] rounded-xl border border-white/10 shadow-2xl overflow-hidden">
              <form
                onSubmit={addIngredient}
                className="flex items-center p-2 gap-2"
              >
                <div className="pl-4 text-muted-foreground">
                  <span className="text-lg">+</span>
                </div>
                <Input
                  name="ingredient"
                  value={ingredientInput}
                  onChange={(e) => {
                    setIngredientInput(e.target.value)
                    setShowDropdown(true)
                  }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Type an ingredient..."
                  className="h-12 border-none bg-transparent text-lg focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/50 text-foreground caret-primary"
                  autoComplete="off"
                />

                <Button
                  type="submit"
                  size="sm"
                  className="h-9 px-4 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 hover:border-primary/50 transition-all rounded-lg"
                >
                  <span className="text-xs font-semibold mr-2">↵</span>
                  Add
                </Button>
              </form>

              {/* Progress Bar / Decor */}
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
            </div>

            {showDropdown && filteredIngredients.length > 0 && (
              <div className="absolute top-[calc(100%+0.5rem)] left-0 right-0 bg-[#0F0F12]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-200">
                <div className="p-2 space-y-1">
                  {filteredIngredients.map((item) => (
                    <div
                      key={item}
                      className="px-4 py-2.5 hover:bg-white/5 cursor-pointer rounded-lg transition-colors text-sm text-foreground/80 flex items-center justify-between group/item"
                      onClick={() => handleSelectIngredient(item)}
                    >
                      <span className="font-medium">{item}</span>
                      <span className="text-xs text-muted-foreground opacity-0 group-hover/item:opacity-100 transition-opacity">
                        Select
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Active Ingredients Chips */}
          <div className="mt-8 min-h-[4rem]">
            {ingredients.length > 0 ? (
              <div className="flex flex-wrap gap-2 justify-center">
                {ingredients.map((ing, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="pl-3 pr-1 py-1 text-sm font-medium bg-secondary/30 border border-white/5 text-foreground hover:bg-secondary/50 transition-all rounded-full group"
                  >
                    {ing}
                    <button
                      onClick={() => removeIngredient(i)}
                      className="ml-2 p-0.5 rounded-full hover:bg-destructive/10 hover:text-destructive text-muted-foreground/50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="text-center text-sm text-muted-foreground/40 font-mono">
                // No ingredients selected
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 pt-8 border-t border-white/5">
            <div
              className="flex items-center space-x-3 group cursor-pointer"
              onClick={() => setStrictMode(!strictMode)}
            >
              <Switch
                id="strict-mode"
                checked={strictMode}
                onCheckedChange={setStrictMode}
                className="data-[state=checked]:bg-primary"
              />
              <label
                htmlFor="strict-mode"
                className="text-sm font-medium leading-none cursor-pointer select-none text-muted-foreground group-hover:text-foreground transition-colors"
              >
                Strict Mode
              </label>
            </div>

            <Button
              onClick={handleGenerate}
              size="lg"
              className="relative overflow-hidden bg-white text-black hover:bg-white/90 font-semibold px-8 h-12 rounded-full shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.5)] transition-all transform hover:scale-105 active:scale-95"
              disabled={ingredients.length === 0 || loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4 text-primary" />
              )}
              Generate Recipe
            </Button>
          </div>
        </div>

        {/* Recipe Display */}
        {recipe && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            <RecipeDisplay recipe={recipe} userIngredients={ingredients} />
          </div>
        )}

        {/* Chat Section */}
        {recipe && (
          <div className="relative group bg-[#0F0F12]/60 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <ChefHat className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Chef's Table
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Ask for tips, pairings, or adjustments
                  </p>
                </div>
              </div>

              <div
                ref={chatContainerRef}
                className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar scroll-smooth"
              >
                {chatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`rounded-2xl px-5 py-3 max-w-[85%] text-sm leading-relaxed shadow-sm ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-sm'
                          : 'bg-secondary/50 text-foreground border border-white/5 rounded-bl-sm prose prose-sm dark:prose-invert max-w-none'
                      }`}
                    >
                      {msg.role === 'assistant' ? (
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-secondary/30 px-4 py-2 rounded-2xl rounded-tl-none border border-white/5">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleChat} className="relative">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask the Chef..."
                  disabled={chatLoading}
                  className="w-full bg-secondary/30 border-white/5 focus-visible:ring-primary/50 h-12 pr-12 rounded-xl"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={chatLoading}
                  className="absolute right-1 top-1 h-10 w-10 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground transition-all rounded-lg"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
