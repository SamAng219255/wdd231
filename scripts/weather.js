const currentTemp = document.querySelector('#current-temp');
const weatherIcon = document.querySelector('#weather-icon');
const captionDesc = document.querySelector('figcaption');

// 49.749686487649, 6.636547456836986
const url = 'https://api.openweathermap.org/data/2.5/weather?lat=49.75&lon=6.64&units=imperial&appid=3783fadabe88d8f972c2238de5860967';

async function apiFetch() {
	try {
		const response = await fetch(url);
		if(response.ok) {
			const data = await response.json();

			console.log(data);

			displayResults(data);
		}
		else {
			throw Error(await response.text());
		}
	}
	catch(error) {
		console.log(error);
	}
}

function displayResults(data) {
	currentTemp.innerHTML = `${data.main.temp}&deg;F`;
	const iconsrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
	let desc = data.weather[0].description;
	weatherIcon.setAttribute('src', iconsrc);
	weatherIcon.setAttribute('alt', desc);
	captionDesc.textContent = `${desc}`;
}

apiFetch();