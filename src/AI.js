const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '/api';

export async function generateRecipe(ingredientsArr) {
    if (!ingredientsArr || ingredientsArr.length === 0) {
        throw new Error('Please add at least one ingredient')
    }

    try {
        console.log('Making request to backend with ingredients:', ingredientsArr);
        
        const response = await fetch(`${BACKEND_URL}/generate-recipe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ingredients: ingredientsArr }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.recipe) {
            throw new Error('Invalid response from backend')
        }
        
        return data.recipe;
    } catch (err) {
        console.error('API Error:', err)
        throw new Error(err.message || 'Failed to generate recipe')
    }
}