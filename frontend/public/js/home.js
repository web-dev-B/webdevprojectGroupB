const token = localStorage.getItem('token');

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
      window.location.href = '/auth/login.html';
    }
  } catch (err) {
    alert('Failed to fetch user profile');
  }
}

  