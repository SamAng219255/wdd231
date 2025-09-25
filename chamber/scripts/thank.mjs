const params = new URLSearchParams(window.location.search);

const first = params.get("fname") || "";
const last = params.get("lname") || "";
const email = params.get("email") || "";
const phone = params.get("phone") || "";
const business = params.get("org-name") || "";
const date = new Date(parseInt(params.get("timestamp")) || 0);

document.getElementById("full-name").textContent = `${first} ${last}`;
document.getElementById("email").textContent = email;
document.getElementById("phone").textContent = phone;
document.getElementById("business").textContent = business;
document.getElementById("date").textContent = `${date}`;