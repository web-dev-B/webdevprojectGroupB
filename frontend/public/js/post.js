window.addEventListener('DOMContentLoaded', () => {
    const postContainer = document.getElementById('postContainer');
    const newPost = JSON.parse(localStorage.getItem('newPost'));

    if (newPost) {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';

        postCard.innerHTML = `
            <div class="top-right-box">${newPost.type}</div>
            <img src="${newPost.image}" alt="${newPost.image}" />
            <div class="recipe-info">
                <h3>${newPost.recipeName}</h3>
                <p>By ${newPost.username}</p>
            </div>
        `;

        postContainer.appendChild(postCard);

        localStorage.removeItem('newPost');
    }
});
