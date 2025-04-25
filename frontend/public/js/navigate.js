const currentPage = window.location.pathname;
const logoutButton = document.querySelector('.logout-button');
const user_emoji = document.querySelector('i');
if (token) {
    user_emoji.addEventListener('click', (event) => {
        window.location.href = '/user/profile.html'
    })

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
          localStorage.removeItem('token');
          window.location.href = '/home/index.html';
        })
    }

    if (currentPage.endsWith('profile.html')) {
        document.querySelector('i').style.display = 'none'
      }
    
    if (currentPage.endsWith('login.html') || currentPage.endsWith('signup.html')){
        window.location.href = '/user/login_home.html';
    } else if (currentPage.endsWith('signup.html')){
        window.location.href = '/user/login_home.html';
    }

} else {
    user_emoji.addEventListener('click', (e) => {
      window.location.href = '/auth/login.html';
    })
}