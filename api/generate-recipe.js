import { HfInference } from '@huggingface/inference';

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page
`;

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { ingredients } = req.body;
        
        if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({ 
                error: 'Please provide a valid array of ingredients' 
            });
        }

        // Initialize Hugging Face client with server-side API key
        const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);

        const ingredientsString = ingredients.join(", ");
        
        console.log('Making API call with ingredients:', ingredientsString);
        
        const response = await hf.chatCompletion({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!` },
            ],
            max_tokens: 1024,
        });
        
        if (!response?.choices?.[0]?.message?.content) {
            throw new Error('Invalid response from API');
        }
        
        res.status(200).json({ 
            recipe: response.choices[0].message.content 
        });
        
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ 
            error: error.message || 'Failed to generate recipe' 
        });
    }
} 