import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { HfInference } from '@huggingface/inference';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the same directory as server.js
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Hugging Face client with server-side API key
const hf = new HfInference(process.env.HUGGING_FACE_API_KEY);

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page
`;

// Recipe generation endpoint
app.post('/api/generate-recipe', async (req, res) => {
    try {
        const { ingredients } = req.body;
        
        if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({ 
                error: 'Please provide a valid array of ingredients' 
            });
        }

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
        
        res.json({ 
            recipe: response.choices[0].message.content 
        });
        
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ 
            error: error.message || 'Failed to generate recipe' 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'AI Chef Backend is running' });
});

// Debug endpoint (remove this in production)
app.get('/api/debug', (req, res) => {
    res.json({ 
        status: 'Debug Info',
        apiKeyExists: !!process.env.HUGGING_FACE_API_KEY,
        apiKeyLength: process.env.HUGGING_FACE_API_KEY ? process.env.HUGGING_FACE_API_KEY.length : 0,
        apiKeyPrefix: process.env.HUGGING_FACE_API_KEY ? process.env.HUGGING_FACE_API_KEY.substring(0, 10) + '...' : 'Not found',
        workingDirectory: process.cwd(),
        nodeEnv: process.env.NODE_ENV
    });
});

app.listen(PORT, () => {
    console.log(`🚀 AI Chef Backend server running on port ${PORT}`);
    console.log(`📝 API Key loaded: ${process.env.HUGGING_FACE_API_KEY ? 'Yes' : 'No'}`);
    console.log(`🔑 API Key starts with: ${process.env.HUGGING_FACE_API_KEY ? process.env.HUGGING_FACE_API_KEY.substring(0, 10) + '...' : 'Not found'}`);
    console.log(`📁 Current working directory: ${process.cwd()}`);
}); 