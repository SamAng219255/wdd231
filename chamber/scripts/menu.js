const navButton = document.getElementById("nav-btn");
const navLinks = document.getElementById("nav-bar");

navButton.addEventListener("click", () => {
	navButton.classList.toggle("show");
	navLinks.classList.toggle("show");
});

const lightDarkBtn = document.getElementById("light-dark-btn");

let currentTheme = (() => {
	const storedTheme = localStorage.getItem("theme");
	if (storedTheme) {
		document.documentElement.setAttribute("data-theme", storedTheme);
		return storedTheme;
	}
})();

lightDarkBtn.addEventListener("click", () => {
	currentTheme = (currentTheme ? currentTheme == "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches) ? "light" : "dark";
	document.documentElement.setAttribute("data-theme", currentTheme);

	localStorage.setItem("theme", currentTheme);
});

lightDarkBtn.addEventListener("contextmenu", (e) => {
	e.preventDefault();

	const contextMenu = document.createElement("dialog");
	contextMenu.classList.add("context-menu");
	contextMenu.style.top = `${e.pageY - 2}px`;
	contextMenu.style.right = `${document.body.offsetWidth - e.pageX - 2}px`;
	contextMenu.setAttribute("closedby", "any");
	contextMenu.addEventListener("close", (e) => {
		contextMenu.remove();
	});

	const option1 = document.createElement("button");
	const option2 = document.createElement("button");

	const clearTheme = () => {
		currentTheme = undefined;
		document.documentElement.removeAttribute("data-theme");
		localStorage.removeItem("theme");

		contextMenu.close();
	};
	const lightTheme = () => {
		currentTheme = "light";
		document.documentElement.setAttribute("data-theme", currentTheme);
		localStorage.setItem("theme", currentTheme);

		contextMenu.close();
	};
	const darkTheme = () => {
		currentTheme = "dark";
		document.documentElement.setAttribute("data-theme", currentTheme);
		localStorage.setItem("theme", currentTheme);

		contextMenu.close();
	};

	if(currentTheme == "light") {
		option1.innerText = "Set theme to dark mode.";
		option1.addEventListener("click", darkTheme);

		option2.innerText = "Reset theme to system default."
		option2.addEventListener("click", clearTheme);
	}
	else if(currentTheme == "dark") {
		option1.innerText = "Set theme to light mode.";
		option1.addEventListener("click", lightTheme);

		option2.innerText = "Reset theme to system default."
		option2.addEventListener("click", clearTheme);
	}
	else {
		option1.innerText = "Set theme to light mode.";
		option1.addEventListener("click", lightTheme);

		option2.innerText = "Set theme to dark mode.";
		option2.addEventListener("click", darkTheme);
	}

	contextMenu.append(option1);
	contextMenu.append(option2);

	document.body.append(contextMenu);
	contextMenu.showModal();
});

let lastTransitionPause;
function pauseTransition() {
	document.documentElement.classList.add("no-transition");
	if(lastTransitionPause)
		clearTimeout(lastTransitionPause);
	lastTransitionPause = setTimeout(() => {
		document.documentElement.classList.remove("no-transition");
	}, 500);
}