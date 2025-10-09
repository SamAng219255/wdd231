const params = new URLSearchParams(window.location.search);

document.getElementById("group-name").innerText = params.get("group-name");
document.getElementById("user-name").innerText = params.get("username");