window.addEventListener('load', () => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/frontend/views/auth/login.html';
    } else {
      fetchUserProfile(token);
    }
  });
  
  async function fetchUserProfile(token) {
    try {
      const response = await fetch('http://localhost:5000/api/auth/', {
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
      console.error(err);
      alert('Failed to fetch user profile');
    }
  }
  
  document.querySelector('.logout-button').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/frontend/views/auth/login.html';
  });