document.addEventListener('DOMContentLoaded', async () => {
    const postContainer = document.getElementById('postContainer');
  
    try {
      const response = await fetch('/api/posts', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      const posts = await response.json();
  
      posts.forEach(recipe => {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
  
        postCard.innerHTML = `
          <div class="top-right-box">${posts.type}</div>
          <img src="${posts.image}" alt="${posts.name}" />
          <div class="recipe-info">
              <h3>${posts.name}</h3>
              <p>By ${posts.username}</p>
          </div>
        `;
  
        postContainer.appendChild(postCard);
      });
  
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
    }
  });
  

