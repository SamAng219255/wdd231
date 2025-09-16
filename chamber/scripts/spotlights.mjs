async function displaySpotlights(cardWrapper) {
	const response = await fetch("data/members.json");
	const data = await response.json();

	cardWrapper.innerHTML = "";

	const selection = data.members.filter((member) => {return member.membership_level > 1;}).sort((a,b) => {return Math.random()-0.5;}).slice(0, 3);

	for(let i=0; i<selection.length; i++) {
		const member = selection[i];

		const card = document.createElement("div");
		card.classList.add("spotlight");

		const name = document.createElement("h2");
		name.innerText = member.name;
		name.classList.add("name");
		card.append(name);

		const level = document.createElement("span");
		level.innerText = `${["Copper", "Silver", "Gold"][member.membership_level - 1]} Member`;
		level.classList.add("member-level");
		card.append(level);

		const logo = document.createElement("img");
		logo.setAttribute("alt", `logo for ${member.name}`);
		logo.setAttribute("loading", "lazy");
		logo.setAttribute("width", "40");
		logo.setAttribute("height", "27");
		logo.setAttribute("src", `images/${member.image}`);
		card.append(logo);

		const infoWrapper = document.createElement("div");
		infoWrapper.classList.add("member-info");

		const address = document.createElement("p");
		address.innerHTML = `<b>Address:</b> ${member.address}`;
		infoWrapper.append(address);

		const phone = document.createElement("p");
		phone.innerHTML = `<b>Phone:</b> ${member.phone}`;
		infoWrapper.append(phone);

		const website = document.createElement("p");
		website.innerHTML = '<b>Website:</b> ';
		const link = document.createElement("a");
		link.innerText = `${member.website}`;
		link.setAttribute("target", "_blank");
		link.setAttribute("href", `https://example.com?url=${member.website}`);
		website.append(link);
		infoWrapper.append(website);

		card.append(infoWrapper);

		cardWrapper.append(card);
	}
}

export default displaySpotlights;