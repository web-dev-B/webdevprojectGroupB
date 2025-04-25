const addedIngredients = new Set();
const create = document.getElementById('create');

create.addEventListener('submit', async (e) => {
    e.preventDefault();
    const recipeName = document.getElementById('recipeName').value;
    const type = document.getElementById('type').value;
    const serves = document.getElementById('serves').value;
    const prep = document.getElementById('prep').value;
    const cook = document.getElementById('cook').value;
    const image = document.getElementById('imageUpload').value;
    const ingredients = Array.from(addedIngredients);
    const instruction = document.getElementById('instructions').value;
    
    try {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL + '/api/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage.getItem('token'),
            },
            body: JSON.stringify({recipeName, type, serves, prep, cook, image, ingredients, instruction}),
        })

        const data = await response.json();

        if (response.ok) {
            const inputs = document.querySelectorAll('#create input');
            inputs.forEach(input => {
                input.value = '';
            })
            const username = data.username;
            const newPost = {recipeName, type, image, username}
            localStorage.setItem('newPost', JSON.stringify(newPost))
            window.location.href = 'posts.html';
        } else {
            alert(data.msg);
        }
    } catch (err) {
        console.error('Create post failed:', err.message);
        alert('Cannot create post');
    }
})

ingredientInput.addEventListener("input", () => {
    const query = ingredientInput.value.toLowerCase();
    suggestions.innerHTML = "";
    if (query && addedIngredients.size > 0) {
        const matches = availableIngredients.filter(ingredient => 
            ingredient.toLowerCase().includes(query) && !addedIngredients.has(ingredient)
        );

        matches.forEach(match => {
            const suggestionItem = document.createElement("button");
            suggestionItem.className = "list-group-item list-group-item-action";
            suggestionItem.textContent = match;
            suggestionItem.addEventListener("click", () => {
                addIngredientTag(match);
                ingredientInput.value = "";
                suggestions.innerHTML = "";
            });
            suggestions.appendChild(suggestionItem);
        });
    }
});


function addIngredientTag(ingredient) {
    if (!addedIngredients.has(ingredient)) {
        addedIngredients.add(ingredient);
        const tag = document.createElement("span");
        tag.className = "badge bg-secondary me-2";
        tag.textContent = ingredient;
        const removeBtn = document.createElement("button");
        removeBtn.className = "btn-close btn-close-white ms-2";
        removeBtn.style.fontSize = "0.6rem";
        removeBtn.addEventListener("click", () => {
            tag.remove();
            addedIngredients.delete(ingredient);
        });
        tag.appendChild(removeBtn);
        selectedIngredients.appendChild(tag);
    }
}