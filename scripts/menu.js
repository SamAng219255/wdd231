const navButton = document.querySelector('#nav-btn');
const navLinks = document.querySelector('#nav-bar');

navButton.addEventListener('click', () => {
	navButton.classList.toggle('show');
	navLinks.classList.toggle('show');
});