const dropdown_nav = document.querySelector('.dropdown-nav-links');
const nav_links =  document.querySelector('.nav-links');
const dropdown_auth = document.querySelector('.dropdown-auth-links');
const auth_links = document.querySelector('.auth-links');

dropdown_nav.addEventListener('click', (event) => {
    nav_links.classList.toggle('show');
});

dropdown_auth.addEventListener('click', (event) => {
    auth_links.classList.toggle('show');
});

document.addEventListener('click', (event) => {
    if(!dropdown_nav.contains(event.target) && !dropdown_auth.contains(event.target)) {
        nav_links.classList.remove('show');
        auth_links.classList.remove('show');
    }
});



