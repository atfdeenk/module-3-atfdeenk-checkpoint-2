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

// Set the margin-top of the h1 element to 50px
document.querySelector('h1').style.marginTop = '50px';

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
  createReloadButton(container);
  createScrollToTopButton(container);
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

function createReloadButton(container) {
  const reloadBtn = document.createElement('button');
  reloadBtn.innerHTML = '&#x21bb;';
  reloadBtn.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    margin: 0;
    z-index: 1;
    background: none;
    color: black;
    cursor: pointer;
  `;

  reloadBtn.addEventListener('click', () => {
    window.location.reload();
  });

  container.appendChild(reloadBtn);
  addResponsiveFontSize(reloadBtn);
}

// Function to scroll to the top of the page
function createScrollToTopButton(container) {
  console.log('Creating Scroll to Top button...');
  const button = document.createElement('button');
  button.textContent = '▲'; // Up arrow letter
  button.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 30px;
    cursor: pointer;
    display: none;
    width: 20px;
    padding: 0px;
    background: none;
    color: black;
  `;

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  container.appendChild(button);
  addResponsiveFontSize(button);
  console.log('Button appended to container:', button);

  // Show the button when there is less than a fourth of the page left
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const threshold = windowHeight / 4;

    if (scrollY >= threshold) {
      button.style.display = 'block';
    } else {
      button.style.display = 'none';
    }
    console.log(windowHeight);
    console.log(threshold);
  });
}

// Function to add responsive font size
function addResponsiveFontSize(element) {
  function updateFontSize() {
    if (window.innerWidth <= 768) {
      element.style.fontSize = '7vw';
    } else {
      element.style.fontSize = '2vw';
    }
  }

  // Call the updateFontSize function initially
  updateFontSize();

  // Add the event listener to update the font size on window resize
  window.addEventListener('resize', updateFontSize);
}