const welcomeElem = document.getElementById("welcome");

const lastVisit = localStorage.getItem("last_discover_visit");
const now = Date.now();
const daysSince = Math.floor((now - (lastVisit ?? now)) / (1000 * 60 * 60 * 24));
welcomeElem.innerText = lastVisit ? (daysSince > 0 ? `You last visited ${daysSince.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} day${daysSince > 1 ? 's' : ''} ago.` : "Back so soon! Awesome!") : "Welcome! Let us know if you have any questions.";
welcomeElem.classList.remove("hide");
localStorage.setItem("last_discover_visit", now);