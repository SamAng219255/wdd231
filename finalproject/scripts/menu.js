const navButton = document.getElementById("nav-button");
const navMenu = document.querySelector("header>nav");

navButton.addEventListener("click", function(e){
	navButton.classList.toggle("open");
	navMenu.classList.toggle("open");

	if(navButton.classList.contains("open"))
		navButton.ariaLabel = "Navigation Menu, Open";
	else
		navButton.ariaLabel = "Navigation Menu, Closed";
});