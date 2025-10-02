const cardsWrapper = document.getElementById("poi-cards");
const learnMoreModal = document.getElementById("learn-more");

async function getPOIs() {
	const response = await fetch("data/poi.json");
	const data = await response.json();

	cardsWrapper.innerHTML = "";

	let first = true;
	let ind = 0;
	data.points_of_interest.forEach((poi) => {
		const card = document.createElement("section");
		card.setAttribute("id", `poi-${ind++}`)
		card.classList.add("card");

		const name = document.createElement("h2");
		name.innerText = poi.name;
		card.append(name);

		const figure = document.createElement("figure");
		const photo = document.createElement("img");
		photo.setAttribute("alt", poi.name);
		photo.setAttribute("loading", first ? "eager" : "lazy");
		if(first)
			first = false;
		photo.setAttribute("width", "300");
		photo.setAttribute("height", "200");
		photo.setAttribute("src", `images/${poi.image}`);
		figure.append(photo);
		card.append(figure);

		const address = document.createElement("address");
		address.innerText = poi.address;
		card.append(address);

		const description = document.createElement("p");
		description.innerText = poi.description;
		card.append(description);

		const learnMoreBtn = document.createElement("button");
		learnMoreBtn.innerText = "Learn More";
		learnMoreBtn.addEventListener("click", (e) => {
			learnMoreModal.innerHTML = "";

			const name = document.createElement("h2");
			name.innerText = poi.name;
			learnMoreModal.append(name);

			const closeModal = document.createElement("button");
			closeModal.innerText = "\u00D7"
			closeModal.classList.add("close-modal");
			closeModal.addEventListener("click", (e) => {
				learnMoreModal.close();
			});
			name.append(closeModal);

			const figure = document.createElement("figure");
			const photo = document.createElement("img");
			photo.setAttribute("alt", poi.name);
			photo.setAttribute("loading", first ? "eager" : "lazy");
			if(first)
				first = false;
			photo.setAttribute("width", "300");
			photo.setAttribute("height", "200");
			photo.setAttribute("src", `images/${poi.image}`);
			figure.append(photo);
			learnMoreModal.append(figure);

			const address = document.createElement("address");
			address.innerText = poi.address;
			learnMoreModal.append(address);

			const description = document.createElement("p");
			description.innerText = poi.description;
			learnMoreModal.append(description);

			learnMoreModal.setAttribute("closedby", "any");
			learnMoreModal.showModal();
		});
		card.append(learnMoreBtn);

		cardsWrapper.append(card);
	});
}

getPOIs();