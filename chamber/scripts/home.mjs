import displayWeather from './weather.mjs';
import displaySpotlights from './spotlights.mjs';

const tempElement = document.querySelector("#display-temp b");
const weatherIcon = document.getElementById("weather-icon");
const descElement = document.getElementById("display-temp").parentElement;
const forecastElement = document.getElementById("forecast");
const spotlights = document.getElementById("spotlights");

pauseTransition();

displayWeather(tempElement, weatherIcon, descElement, forecastElement);
displaySpotlights(spotlights);