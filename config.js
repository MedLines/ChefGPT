// config.js - Read the OpenAI API key from Vite environment variables.
// Create a `.env` file at the project root with:
// VITE_OPENAI_API_KEY=your_real_api_key_here
// Note: Exposing an API key in a client app is insecure. For production,
// call the OpenAI API from your server and keep the key secret.

const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY || '';

export default {
    openaiApiKey,
};
