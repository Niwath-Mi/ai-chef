import React from "react";
import { generateRecipe } from "../AI";
import IngredientList from "./IngredientList";
import ClaudRecipe from "./ClaudRecipe";

export default function Main() {
  const [ingredients, setIngredients] = React.useState([]);
  const [recipe, setRecipe] = React.useState("");


  async function getRecipe() {
    const generatedRecipe = await generateRecipe(ingredients);
    setRecipe(generatedRecipe);
  }

  function addingredient(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newIngredient = formData.get("ingredient");
    if (newIngredient.trim()) {
      setIngredients((prevIngredient) => [...prevIngredient, newIngredient]);
      event.target.reset();
    }
  }

  return (
    <>
      <main className="main">
        {/* form to add ingredients  */}
        <form onSubmit={addingredient} className="form">
          <input
            aria-label="Add an ingredient"
            className="input_form"
            type="text"
            placeholder="e.g. oregano"
            name="ingredient"
          />
          <button type="submit" className="btn">+ Ingredient</button>
        </form>

        {ingredients.length > 0 && (
          <IngredientList 
            ingredients={ingredients} 
            getRecipe={getRecipe} 
          />
        )}

        {recipe && <ClaudRecipe recipe={recipe} />}
      </main>
    </>
  );
}
