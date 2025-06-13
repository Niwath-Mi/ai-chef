export default function IngredientList(props) {
    const ingredietListItems = props.ingredients.map((ingredient) => {
    return <li key={ingredient}>{ingredient}</li>;
  });
    return (
        <section>
            <h2>Ingredients on hand: </h2>
            <ul className="ingredients-list">{ingredietListItems}</ul>
            {props.ingredients.length > 3 ? (
              <div className="get-recipe-container">
                <div>
                  <h3>Ready for a recipe?</h3>
                  <p>Generate recipe from your list of ingredients</p>
                </div>
                <button onClick={props.getRecipe}>Get a recipe</button>
              </div>
            ) : null}
          </section>
    )
}