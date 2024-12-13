// DOM elements
const container = document.querySelector('.container');
const recipeContainer = document.getElementById('recipeContainer');
const recipeImage = document.querySelector('.recipe-image');
const recipeTitle = document.querySelector('.recipe-title');
const recipeInstruction = document.querySelector('.recipe-instruction');

// Set the minimum height of the body to the full height of the viewport
document.body.style.minHeight = '100vh';

// Set the height of the body to auto, allowing it to adjust based on its content
document.body.style.height = 'auto';

// Set the margin of the recipe container to 5%
container.style.margin = '5%';
container.style.position = 'relative'; // Set position to relative to allow for absolute positioning of the reload button

// Function to update the recipe image
function updateRecipeImage(recipe) {
  recipeImage.src = recipe.strMealThumb;
  recipeImage.style.width = '200px';
}

// Function to update the recipe title
function updateRecipeTitle(recipe) {
  recipeTitle.textContent = recipe.strMeal;
}

// Function to update the recipe instructions
function updateRecipeInstructions(recipe) {
  // Remove existing ol element
  if (recipeInstruction.firstChild) {
    recipeInstruction.replaceChildren();
  }

  // Create new ol element
  const instructionsList = document.createElement('ol');
  instructionsList.style.cssText = `
    margin: 10px 20px;
    padding: 0 20px;
    font-family: helvetica, sans-serif;
    font-size: 16px;
    background-color: #f7f7f7;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  `;
  const instructions = recipe.strInstructions
    .split(/[.\r\n]+/)
    .filter((instruction) => {
      const trimmedInstruction = instruction.trim();
      return (
        trimmedInstruction.length > 1 && !trimmedInstruction.match(/^STEP \d+/i)
      );
    });
  instructions.forEach((instruction) => {
    const listItem = document.createElement('li');
    listItem.style.cssText = `
      max-width: 800px;
      text-align: justify;
      padding: 5px;
    `;
    listItem.textContent = instruction.trim();
    instructionsList.appendChild(listItem);
  });
  recipeInstruction.appendChild(instructionsList);
}

// Function to update the DOM
function updateDOM(recipe) {
  updateRecipeImage(recipe);
  updateRecipeTitle(recipe);
  updateRecipeInstructions(recipe);
  getRecipeBtn.style.display = 'none';

  // Create a reload button
  const reloadBtn = document.createElement('button');
  reloadBtn.textContent = 'Reload';
  reloadBtn.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    margin: 0;
  `;
  container.appendChild(reloadBtn);

  // Add event listener to reload button
  reloadBtn.addEventListener('click', () => {
    window.location.reload();
  });
}

// Event listener for button click and API call
document.addEventListener('click', async (event) => {
  if (event.target.matches('#getRecipeBtn')) {
    try {
      const response = await fetch(
        'https://www.themealdb.com/api/json/v1/1/random.php'
      );
      const data = await response.json();
      const recipe = data.meals[0];
      updateDOM(recipe);
    } catch (error) {
      console.log(error);
    }
  }
});