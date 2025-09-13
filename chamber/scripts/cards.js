const gridBtn = document.getElementById("display-grid");
const listBtn = document.getElementById("display-list");
const cardWrapper = document.getElementById("cards");

function clearCardDisplayClasses() {
	cardWrapper.classList.remove("grid");
	cardWrapper.classList.remove("list");
}

function setGridMode() {
	pauseTransition();

	document.querySelectorAll("#display-options button.active").forEach((elem) => {elem.classList.remove("active")});
	gridBtn.classList.add("active");
	
	clearCardDisplayClasses();
	cardWrapper.classList.add("grid");

	localStorage.setItem("directory_card_mode", "grid")
}
gridBtn.addEventListener("click", setGridMode);

function setListMode() {
	pauseTransition();

	document.querySelectorAll("#display-options button.active").forEach((elem) => {elem.classList.remove("active")});
	listBtn.classList.add("active");
	
	clearCardDisplayClasses();
	cardWrapper.classList.add("list");

	localStorage.setItem("directory_card_mode", "list")
}
listBtn.addEventListener("click", setListMode);

async function getMembers() {
	const response = await fetch("data/members.json");
	const data = await response.json();

	cardWrapper.innerHTML = "";

	// This is supposed to remember whether you had the page in grid or list view and change it back to that.
	// Unfortunately, while the system works with no human noticeable errors, it always caused a layout shift
	//     which reduced the lighthouse score by too much.
	/*
	switch(localStorage.getItem("directory_card_mode") || "grid") {
		case "grid":
			setGridMode();
			break;
		case "list":
			setListMode();
			break;
	}
	*/

	let first = true;
	data.members.forEach((member) => {
		const card = document.createElement("div");
		card.classList.add("card");

		const logo = document.createElement("img");
		logo.setAttribute("alt", `logo for ${member.name}`);
		if(first)
			first = false;
		else
			logo.setAttribute("loading", "lazy");
		logo.setAttribute("width", "512");
		logo.setAttribute("height", "341");
		logo.setAttribute("src", `images/${member.image}`);
		card.append(logo);

		const description = document.createElement("div");
		description.innerText = member.description;
		description.classList.add("description");
		card.append(description);

		const name = document.createElement("div");
		name.innerText = member.name;
		name.classList.add("name");
		card.append(name);

		const address = document.createElement("div");
		address.innerText = member.address;
		card.append(address);

		const phone = document.createElement("div");
		phone.innerText = member.phone;
		card.append(phone);

		const website = document.createElement("div");
		const link = document.createElement("a");
		link.innerText = member.website;
		link.setAttribute("target", "_blank");
		link.setAttribute("href", `https://example.com?url=${member.website}`);
		website.append(link);
		card.append(website);

		cardWrapper.append(card);
	});
}

getMembers();