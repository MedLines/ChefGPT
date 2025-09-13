import config from "./config.js"

let client = null
try {
    // Only attempt to import and initialize the official SDK if an API key is present.
    if (config.openaiApiKey) {
        const OpenAI = (await import('openai')).default
        client = new OpenAI({ apiKey: config.openaiApiKey, dangerouslyAllowBrowser: true })
    }
} catch (e) {
    // If dynamic import fails, we'll fall back to a local stub below.
    // This keeps the dev server working in environments where the SDK
    // cannot be bundled for the browser.
    // console.warn('OpenAI SDK unavailable, falling back to stub:', e)
}




// const anthropic = new Anthropic({
    //     // Make sure you set an environment variable in Scrimba 
    //     // for ANTHROPIC_API_KEY
    //     apiKey: process.env.ANTHROPIC_API_KEY,
    //     dangerouslyAllowBrowser: true,
    // })
    
    // export async function getRecipeFromChefClaude(ingredientsArr) {
        //     const ingredientsString = ingredientsArr.join(", ")
        
        //     const msg = await anthropic.messages.create({
            //         model: "claude-3-haiku-20240307",
            //         max_tokens: 1024,
            //         system: SYSTEM_PROMPT,
            //         messages: [
                //             { role: "user", content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!` },
                //         ],
                //     });
                //     return msg.content[0].text
                // }
                
                
                // export async function getRecipeFromChefGPT(ingredientsArr) {
                    //   // Temporary stub: returns a static recipe so the UI can be verified.
                    //   const ingredients = ingredientsArr.join(", ");
                    //   return `# Sample Recipe\n\nYou have: ${ingredients}\n\n- Step 1: Combine ingredients.\n- Step 2: Cook until done.\n\nEnjoy!`;
                    // }
                    
                    
                    


const SYSTEM_PROMPT = `
You are ChefGPT, a friendly cooking assistant.
Your job is to suggest a recipe based on a list of ingredients the user provides.

Guidelines:
- Always reply in the same language as the ingredients list the user provides.
- You may use some or all of the user’s ingredients.
- You may add a few common extras (like salt, pepper, oil, herbs), but keep them minimal.
- Always give clear measurements when possible.
- Format the recipe in markdown with these sections:
  ## Recipe Title
  ### Ingredients
  - list each ingredient
  ### Instructions
  - step-by-step numbered instructions
  ### Optional Tips
  - (optional) substitutions or serving ideas
Keep the tone warm, helpful, and simple.
`



export async function getRecipeFromChefGPT(ingredientsArr) {
    const ingredientsString = ingredientsArr.join(", ")
    // If the OpenAI client isn't available (no key or SDK failed to import),
    // return a static/stubbed markdown recipe so the UI can be tested.
    if (!client) {
        return `## Sample Recipe\n\nYou have: ${ingredientsString || 'nothing yet'}\n\n### Ingredients\n- ${ingredientsArr.join('\n- ') || '- (none)'}\n\n### Instructions\n1. Combine the ingredients.\n2. Cook to taste.\n\nEnjoy your meal!`
    }

    // Use the OpenAI client to create a chat completion. Note: the exact
    // method shape depends on the installed `openai` package version.
    // For broad compatibility, attempt the v4/v5 style responses API first,
    // and fall back to chat completions if necessary.
    try {
        // v5-style Responses API if available
        if (client.responses && typeof client.responses.create === 'function') {
            const resp = await client.responses.create({
                model: 'gpt-5-mini',
                input: `${SYSTEM_PROMPT}\nUser: Here are the ingredients I have: ${ingredientsString}\nPlease suggest one recipe formatted in markdown.`,
                })
            // Try to pull text from common response shapes
            if (resp.output && Array.isArray(resp.output) && resp.output[0].content) {
                const content = resp.output.map(o => (o.content[0] && o.content[0].text) || '').join('\n')
                return content || JSON.stringify(resp)
            }
            if (resp.output_text) return resp.output_text
            return JSON.stringify(resp)
        }

        // Fallback: chat completions
        if (client.chat && typeof client.chat.completions.create === 'function') {
            const completion = await client.chat.completions.create({
                model: 'gpt-5-mini',
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: `Here are the ingredients I currently have: ${ingredientsString}. Please suggest one recipe formatted in markdown.` }
                ],
            })
            // Depending on the SDK, the returned shape may be choices[0].message.content
            if (completion.choices && completion.choices[0] && completion.choices[0].message) {
                return completion.choices[0].message.content
            }
            if (completion.choices && completion.choices[0] && completion.choices[0].text) {
                return completion.choices[0].text
            }
            return JSON.stringify(completion)
        }
    } catch (err) {
        // If any runtime error occurs, return a simple fallback so UI still works.
        return `## Sample Recipe (fallback)\n\nYou have: ${ingredientsString || 'nothing yet'}\n\n- Step 1: Combine ingredients.\n- Step 2: Cook until done.\n\n(An error occurred while calling the API: ${err.message})`
    }
    // If no recognized API surface, return stub.
    return `## Sample Recipe\n\nYou have: ${ingredientsString || 'nothing yet'}\n\n- Step 1: Combine ingredients.\n- Step 2: Cook until done.`
}