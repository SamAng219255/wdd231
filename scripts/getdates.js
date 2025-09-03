const copyYearElem = document.getElementById("currentyear");
const lastModifiedElem = document.getElementById("lastModified");

const now = new Date();

copyYearElem.innerHTML = now.getFullYear();
lastModifiedElem.innerHTML = "Last Modified: " + document.lastModified;