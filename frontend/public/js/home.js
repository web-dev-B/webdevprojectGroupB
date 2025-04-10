const token = localStorage.getItem('token');
const currentPage = window.location.pathname;
const logoutButton = document.querySelector('.logout-button');
const user_emoji = document.querySelector('i');

async function fetchUserProfile(token) {
  try {
    const response = await fetch('http://localhost:3001/api/auth/', {
      headers: {
        'x-auth-token': token,
      },
    });

    if (response.ok) {
      const userData = await response.json();
      document.querySelector('.user-name').textContent = userData.name;
      document.querySelector('.user-email').textContent = userData.email;
    } else {
      localStorage.removeItem('token');
      alert('Session expired. Please login again.');
      window.location.href = '/frontend/views/auth/login.html';
    }
  } catch (err) {
    alert('Failed to fetch user profile');
  }
}

// Navigation

if (token) {
  if (currentPage.endsWith('login.html') || currentPage.endsWith('signup.html')){
    window.location.href = '/frontend/views/user/login_home.html';
  }
  
  user_emoji.addEventListener('click', (event) => {
    window.location.href = '/frontend/views/user/profile.html'
  })

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/frontend/views/home/index.html';
  })
}
} else {
  user_emoji.addEventListener('click', (event) => {
    window.location.href = '/frontend/views/auth/login.html'
  })
}
