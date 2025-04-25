document.addEventListener("DOMContentLoaded", () => {
    fetchUserProfile();
});

  
function fetchUserProfile() {
    const token = localStorage.getItem('token');
    const base_url = fodweb.postgres.database.azure.com
    fetch(base_url + '/api/auth/auth', {
        method: 'GET',
         headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        return response.json();
    })
    .then(data => {
        document.getElementById('name').textContent = `Name: ${data.name}`;
        document.querySelector('.card-text').textContent = `Name: ${data.email}`;
        document.getElementById('following-count').textContent = data.followingCount;
  
        const profileImg = document.querySelector('.card-img-top');
        if (data.profilePictureUrl) {
            profileImg.src = data.profilePictureUrl;
        } else {
            profileImg.src = '/assets/images/default-avatar.png'; 
        }
    })

    .catch(error => {
        console.error('Error loading profile:', error);
    });
}
  //push