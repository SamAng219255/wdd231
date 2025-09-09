const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';
const cards = document.querySelector('#cards');

async function getProphetData() {
	const response = await fetch(url);
	const data = await response.json();

	//console.table(data.prophets)

	displayProphets(data.prophets);
}

const displayProphets = (prophets) => {
	prophets.forEach((prophet) => {
		const card = document.createElement('section');
	
		const fullName = document.createElement('h2');
		fullName.textContent = `${prophet.name} ${prophet.lastname}`;
		card.appendChild(fullName);
	
		const dob = document.createElement('p');
		dob.textContent = `Date of Birth: ${prophet.birthdate}`;
		card.appendChild(dob);
	
		const birthplace = document.createElement('p');
		birthplace.textContent = `Birthplace: ${prophet.birthplace}`;
		card.appendChild(birthplace);
	
		const portrait = document.createElement('img');
		portrait.setAttribute('src', prophet.imageurl);
		portrait.setAttribute('alt', `Portrait of ${prophet.name} ${prophet.lastname}`);
		portrait.setAttribute('loading', 'lazy');
		portrait.setAttribute('width', '200');
		portrait.setAttribute('height', '250');
		card.appendChild(portrait);
	
		cards.appendChild(card);
	});
}

getProphetData();