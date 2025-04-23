document.addEventListener('DOMContentLoaded', function() {
    const ingredientInput = document.getElementById('ingredientInput');
    const autocompleteResults = document.getElementById('autocompleteResults');
    const ingredientTags = document.getElementById('ingredientTags');
    const addIngredientBtn = document.getElementById('addIngredient');
    const ingredientsList = document.getElementById('ingredientsList');
    const recipeForm = document.getElementById('recipeForm');
    
    // Array to store ingredients
    let ingredients = [];
    // Array to store all available ingredients from database
    let availableIngredients = [];
    
    // Fetch all ingredients from database
    fetchIngredients();
    
    async function fetchIngredients() {
      try {
        const response = await fetch('/api/ingredients');
        if (response.ok) {
          const data = await response.json();
          availableIngredients = data.map(item => item.name);
        } else {
          console.error('Failed to fetch ingredients');
        }
      } catch(error) {
        console.error('Error fetching ingredients:', error);
      }
    }
    
    // Autocomplete functionality
    ingredientInput.addEventListener('input', function() {
      const value = this.value.trim().toLowerCase();
      
      // Clear previous results
      autocompleteResults.innerHTML = '';
      
      if (value.length < 1) {
        autocompleteResults.classList.remove('show');
        return;
      }
      
      // Filter ingredients based on input
      const matches = availableIngredients.filter(ingredient => 
        ingredient.toLowerCase().includes(value)
      );
      
      if (matches.length > 0) {
        autocompleteResults.classList.add('show');
        
        matches.forEach(match => {
          const item = document.createElement('div');
          item.className = 'autocomplete-item';
          item.textContent = match;
          item.addEventListener('click', function() {
            addIngredientTag(match);
            ingredientInput.value = '';
            autocompleteResults.classList.remove('show');
          });
          autocompleteResults.appendChild(item);
        });
      } else {
        autocompleteResults.classList.remove('show');
      }
    });
    
    // Close autocomplete when clicking outside
    document.addEventListener('click', function(e) {
      if (!ingredientInput.contains(e.target) && !autocompleteResults.contains(e.target)) {
        autocompleteResults.classList.remove('show');
      }
    });
    
    // Add ingredient from input
    addIngredientBtn.addEventListener('click', function() {
      const value = ingredientInput.value.trim();
      if (value) {
        addIngredientTag(value);
        ingredientInput.value = '';
        ingredientInput.focus();
      }
    });
    
    // Add ingredient as tag
    function addIngredientTag(ingredient) {
      if (!ingredients.includes(ingredient)) {
        ingredients.push(ingredient);
        updateIngredientTags();
        updateIngredientsList();
      }
    }
    
    // Update ingredient tags display
    function updateIngredientTags() {
      ingredientTags.innerHTML = '';
      ingredients.forEach((ingredient, index) => {
        const tag = document.createElement('div');
        tag.className = 'tag';
        tag.innerHTML = `
          ${ingredient}
          <button type="button" class="tag-remove" data-index="${index}">×</button>
        `;
        ingredientTags.appendChild(tag);
      });
      
      // Add event listeners to remove buttons
      document.querySelectorAll('.tag-remove').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          const index = parseInt(this.getAttribute('data-index'));
          ingredients.splice(index, 1);
          updateIngredientTags();
          updateIngredientsList();
        });
      });
    }
    
    // Update ingredients list display (kept for compatibility)
    function updateIngredientsList() {
      ingredientsList.innerHTML = '';
      ingredients.forEach((ingredient, index) => {
        const item = document.createElement('div');
        item.className = 'ingredient-item';
        item.innerHTML = `
          <span>${ingredient}</span>
          <button type="button" data-index="${index}" class="remove-btn">Remove</button>
        `;
        ingredientsList.appendChild(item);
      });
      
      // Add event listeners to remove buttons
      document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const index = parseInt(this.getAttribute('data-index'));
          ingredients.splice(index, 1);
          updateIngredientTags();
          updateIngredientsList();
        });
      });
    }
    
    // Handle form submission
    recipeForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Create FormData object for file upload
      const formData = new FormData();
      formData.append('name', document.getElementById('recipeName').value);
      formData.append('serves', document.getElementById('serves').value);
      formData.append('prep_time', document.getElementById('prepTime').value);
      formData.append('cook_time', document.getElementById('cookTime').value);
      formData.append('instructions', document.getElementById('instructions').value);
      
      // Add ingredients as JSON string
      formData.append('ingredients', JSON.stringify(ingredients));
      
      // Add image if selected
      const imageFile = document.getElementById('recipeImage').files[0];
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      console.log('Post data to be sent to server');
      
      try {
        const response = await fetch('/api/posts', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          const result = await response.json();
          alert('Recipe created successfully!');
          // Reset form
          recipeForm.reset();
          ingredients = [];
          updateIngredientTags();
          updateIngredientsList();
        } else {
          alert('Failed to create recipe');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error creating recipe');
      }
    });
  });