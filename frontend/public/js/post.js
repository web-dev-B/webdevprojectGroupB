document.addEventListener('DOMContentLoaded', async () => {
    const postContainer = document.getElementById('postContainer');
  
    try {
      const userRes = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const user = await userRes.json();

      const response = await fetch(`/api/posts/user/${user.account_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      const posts = await response.json();
  
      posts.forEach(recipe => {
        const postCard = document.createElement('div');
        postCard.className = 'post-card';
  
        postCard.innerHTML = `
          <div class="top-right-box">${recipe.type}</div>
          <img src="${recipe.image_path}" alt="${recipe.name}" />
          <div class="recipe-info">
              <h3>${recipe.name}</h3>
              <p>By ${user.username}</p>
          </div>
        `;
  
        postContainer.appendChild(postCard);
      });
  
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
    }
 
  });

  
  

