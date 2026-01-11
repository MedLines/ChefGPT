'use server'

import { headers } from 'next/headers'
import OpenAI from 'openai'

import { checkRateLimit } from '@/lib/rate-limit'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateRecipeAction(
  ingredients: string | string[],
  strictMode: boolean,
): Promise<{ success: boolean; error?: string; recipe?: any }> {
  // Rate Limiting Check
  const ip = (await headers()).get('x-forwarded-for') || 'unknown'
  const isAllowed = checkRateLimit(ip)

  if (!isAllowed) {
    return {
      success: false,
      error: 'Rate limit exceeded: You can only generate 5 recipes per hour.',
    }
  }

  const ingredientString = Array.isArray(ingredients)
    ? ingredients.join(', ')
    : ingredients

  const systemPrompt = `Act as a Michelin-star chef who specializes in home cooking. 
    Return a recipe in JSON format.
    The "description" should be a short, mouth-watering summary of the dish (max 30 words) to get the user excited.
    
    JSON Schema:
    {
      "name": "Recipe Name",
      "description": "A rich and creamy pasta dish...",
      "ingredients": ["List of ingredients"],
      "steps": ["Step 1", "Step 2..."],
      "macros": {"calories": 500, "protein": "20g"},
      "visual_summary": "A golden roasted chicken on a blue plate, studio lighting."
    }
    visual_summary must be max 15 words.`

  const userPrompt = `Ingredients: ${ingredientString}. 
${
  strictMode
    ? 'Strict Mode: Use ONLY provided ingredients + pantry staples (salt, oil, pepper).'
    : 'You can include other common ingredients.'
}`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-5-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
    })

    const content = response.choices[0].message.content
    if (!content) throw new Error('No content returned')
    const recipe = JSON.parse(content)
    return { success: true, recipe }
  } catch (error) {
    console.error('Error generating recipe:', error)
    return {
      success: false,
      error: 'Failed to generate recipe. Please try again.',
    }
  }
}

export async function generateImageAction(visualSummary: string) {
  try {
    const response = await openai.images.generate({
      model: 'gpt-image-1-mini',
      prompt: visualSummary || 'A delicious dish',
      n: 1,
      size: '1024x1024', // Optimized setup
    })
    if (!response.data || !response.data[0]) {
      throw new Error('No image generated')
    }
    return response.data[0].url
  } catch (error) {
    console.error('Error generating image:', error)
    throw error
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function chatAction(message: string, recipeContext: any) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-nano',
      messages: [
        {
          role: 'system',
          content: `You are a helpful culinary assistant.
          Current Recipe Context: "${recipeContext.name}".
          Ingredients: ${recipeContext.ingredients.join(', ')}.
          
          Your Instructions:
          1. Answer questions related to this recipe, cooking techniques, ingredients, or ANY general culinary advice. You are a knowledgeable chef.
          2. Only if the user asks about a topic completely unrelated to food or cooking (e.g., politics, coding, weather), politely refuse by saying: "I am a chef, not a general assistant. I can only help you with your cooking today."
          3. Format your response using clean Markdown. Use **bold** for emphasis, bullet points for lists, and keep paragraphs short.`,
        },
        { role: 'user', content: message },
      ],
    })
    return response.choices[0].message.content
  } catch (error) {
    console.error('Chat error:', error)
    throw error
  }
}
