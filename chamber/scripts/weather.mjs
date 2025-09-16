// 16.766193917651755, -3.0052027664958847

const dayStrs = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

async function apiFetch(url) {
	try {
		const response = await fetch(url);
		if(response.ok) {
			const data = await response.json();

			return data;
		}
		else {
			throw Error(await response.text());
		}
	}
	catch(error) {
		console.error(error);
	}
}

function displayResultsWeather(data, tempElement, weatherIcon, descElement, forecastElement) {
	descElement.querySelectorAll(".placeholder-data").forEach((p) => {p.remove()});

	tempElement.innerHTML = `${data.list[0].main.temp}°`;
	const iconsrc = `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`;
	weatherIcon.setAttribute('src', iconsrc);
	weatherIcon.setAttribute('alt', data.list[0].weather[0].description);

	function addData(content) {
		const newElement = document.createElement("p");
		newElement.textContent = content;
		descElement.append(newElement);
	}
	function addDay(day, temp) {
		const newElement = document.createElement("p");
		newElement.textContent = `${day}: `;

		const boldElement = document.createElement("b");
		boldElement.textContent = `${temp}° F`;

		newElement.append(boldElement);
		forecastElement.append(newElement);
	}

	let todayMin;
	let todayMax;
	let min = Infinity;
	let max = -Infinity;
	let today = true;
	let lastTemp;
	let decreasing = false;
	let dayStr = "Today";
	let lastDay = "None";

	for(let i=0; i<data.list.length; i++) {
		const temp = data.list[i].main.temp;

		if(lastTemp !== undefined) {
			if(decreasing && temp > lastTemp && dayStr !== lastDay) {
				if(today) {
					today = false;
					todayMax = max;
					todayMin = min;
				}

				addDay(dayStr, max);

				decreasing = false;
				min = Infinity;
				max = -Infinity;
				lastDay = dayStr;
			}
			else if(!decreasing && temp < lastTemp) {
				decreasing = true;

				const day = data.list[i];
				if(today) {
					dayStr = "Today";
				}
				else {
					const date = new Date((day.dt + data.city.timezone) * 1000);
					dayStr = dayStrs[date.getDay()];
				}
			}
		}

		if(temp > max)
			max = temp
		if(temp < min)
			min = temp

		lastTemp = temp;
	};

	addData(`${data.list[0].weather[0].description.replace(/\b\w/g, (c) => {return c.toUpperCase()})}`);
	addData(`High: ${todayMax}°`);
	addData(`Low: ${todayMin}°`);
	addData(`Humidity: ${data.list[0].main.humidity}%`);

	const sunrise = new Date((data.city.sunrise + data.city.timezone) * 1000);
	const sunriseStr = `${sunrise.getUTCHours().toString().padStart(2,"0")}:${sunrise.getUTCMinutes().toString().padStart(2,"0")}`;
	const sunset = new Date((data.city.sunset + data.city.timezone) * 1000);
	const sunsetStr = `${sunset.getUTCHours().toString().padStart(2,"0")}:${sunset.getUTCMinutes().toString().padStart(2,"0")}`;

	addData(`Sunrise: ${sunriseStr}`);
	addData(`Sunset: ${sunsetStr}`);
}

async function displayWeather(tempElement, weatherIcon, descElement, forecastElement) {
	const data = await apiFetch('https://api.openweathermap.org/data/2.5/forecast?lat=16.77&lon=-3.01&units=imperial&appid=3783fadabe88d8f972c2238de5860967');

	displayResultsWeather(data, tempElement, weatherIcon, descElement, forecastElement);
}

export default displayWeather;