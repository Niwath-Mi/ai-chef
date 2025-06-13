import { HfInference } from '@huggingface/inference'

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page
`

const hf = new HfInference(import.meta.env.VITE_AI_CHEF_API)

export async function generateRecipe(ingredientsArr) {
    if (!ingredientsArr || ingredientsArr.length === 0) {
        throw new Error('Please add at least one ingredient')
    }

    const ingredientsString = ingredientsArr.join(", ")
    try {
        console.log('Making API call with token:', import.meta.env.VITE_AI_CHEF_API?.slice(0, 5) + '...')
        const response = await hf.chatCompletion({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!` },
            ],
            max_tokens: 1024,
        })
        
        if (!response?.choices?.[0]?.message?.content) {
            throw new Error('Invalid response from API')
        }
        
        return response.choices[0].message.content
    } catch (err) {
        console.error('API Error:', err)
        throw new Error(err.message || 'Failed to generate recipe')
    }
}