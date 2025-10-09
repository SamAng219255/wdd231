class DieResult {
	constructor(die, results) {
		this.die = die;
		this.results = results || [];
		this.calculateTotal();
	}

	calculateTotal() {
		this.total = 0;
		for(let i=0; i<this.results.length; i++) {
			this.total += this.results[i];
		}
	}

	toString(noHtml) {
		let resultString = "";
		if(noHtml) {
			resultString = this.results.join(" + ");
		}
		else {
			let sides = this.die.sides;
			resultString = this.results.map((result) => {
				if(sides > 1 && result == sides)
					return `<span class="roll-max">${result}</span>`;
				else if(sides > 1 && result == 1)
					return `<span class="roll-min">${result}</span>`;
				else
					return `${result}`;
			}).join(" + ");
		}
		if(this.results.length == 1)
			return `${this.die.toString(noHtml)} (${resultString})`;
		else
			return `${this.die.toString(noHtml)} (${this.total} = ${resultString})`;
	}

	toJson() {
		return JSON.stringify(this);
	}

	static from(obj) {
		obj.die = Die.from(obj.die);
		const ret = Object.assign(new DieResult(), obj);
		ret.calculateTotal();
		return ret;
	}

	static fromJson(jsonStr) {
		const obj = JSON.parse(jsonStr);
		return DieResult.from(obj);
	}
}

class Die {
	constructor(count, sides, properties) {
		this.count = count;
		this.sides = sides;
		this.properties = properties || {};
	}

	rollOne() {
		return parseInt(Math.random() * this.sides) + 1;
	}

	roll() {
		let rolls = [];
		for(let i=0; i<this.count; i++) {
			let value = this.rollOne();
			if("exploding" in this.properties && this.properties.exploding && value==this.sides) {
				let lastRoll;
				do {
					lastRoll = this.rollOne();
					value += lastRoll;
				} while(lastRoll == this.sides);
			}
			rolls.push(value);
		}
		if("highest" in this.properties) {
			rolls.sort((a,b) => {return a-b});
			if(this.properties.drop)
				rolls = rolls.slice(0, -this.properties.highest);
			else
				rolls = rolls.slice(-this.properties.highest);
		}
		else if("lowest" in this.properties) {
			rolls.sort((a,b) => {return a-b});
			if(this.properties.drop)
				rolls = rolls.slice(this.properties.lowest);
			else
				rolls = rolls.slice(0, this.properties.lowest);
		}
		return new DieResult(this.copy(), rolls);
	}

	max() {
		const count = this.properties.drop ? this.count - (this.properties.highest || this.properties.lowest || 0) : (this.properties.highest || this.properties.lowest || this.count);
		return new DieResult(this.copy(), Array(count).fill(this.sides));
	}
	min() {
		const count = this.properties.drop ? this.count - (this.properties.highest || this.properties.lowest || 0) : (this.properties.highest || this.properties.lowest || this.count);
		return new DieResult(this.copy(), Array(count).fill(1));
	}

	copy() {
		return new Die(this.count, this.sides, this.properties);
	}

	toString(noHtml) {
		const exploding = "exploding" in this.properties && this.properties.exploding ? "!" : "";
		const keep = (this.properties.highest || this.properties.lowest) ? ` ${this.properties.drop ? "drop" : "keep"} the${(this.properties.highest>1 || this.properties.lowest>1) ? ` ${this.properties.highest || this.properties.lowest}` : ""} ${this.properties.highest ? "highest" : "lowest"}` : "";
		return `${this.count}d${this.sides}${exploding}${keep}`;
	}

	toJson() {
		return JSON.stringify(this);
	}

	static from(obj) {
		return Object.assign(new Die(), obj);
	}

	static fromJson(jsonStr) {
		const obj = JSON.parse(jsonStr);
		return Die.from(obj);
	}
}

class DiceResult {
	constructor(dice, results) {
		this.dice = dice;
		this.results = results || [];
		this.calculateTotal();
	}

	calculateTotal() {
		this.total = 0;
		for(let i=0; i<this.results.length; i++) {
			this.total += this.results[i].total;
		}
		this.total += (this.dice || {modifier:0}).modifier;
	}

	toString(noHtml) {
		const resultString = this.results.map((result) => {return result.toString(noHtml)}).join(" + ");
		if(noHtml)
			return `${this.total} = ${resultString} + ${this.dice.modifier}`;
		else
			return `<b>${this.total}</b> = ${resultString} + ${this.dice.modifier}`;
	}

	toJson() {
		return JSON.stringify(this);
	}

	static from(obj) {
		obj.dice = Dice.from(obj.dice);
		for(let i=0; i<obj.results.length; i++) {
			obj.results[i] = DieResult.from(obj.results[i]);
		}
		const ret = Object.assign(new DiceResult(), obj);
		ret.calculateTotal();
		return ret;
	}

	static fromJson(jsonStr) {
		const obj = JSON.parse(jsonStr);
		return DiceResult.from(obj);
	}
}

class Dice {
	constructor(dice, modifier) {
		dice = dice || [];
		this.dice = [];
		if(Array.isArray(dice)) {
			for(let i=0; i<dice.length; i++) {
				this.dice.push(dice[i].copy());
			}
		}
		else if(dice instanceof Dice || dice instanceof Die) {
			this.dice.push(dice.copy());
		}

		this.modifier = modifier || 0;
	}

	roll() {
		let rolls = [];
		for(let i=0; i<this.dice.length; i++) {
			rolls.push(this.dice[i].roll());
		}
		return new DiceResult(this.copy(), rolls);
	}

	max() {
		let rolls = [];
		for(let i=0; i<this.dice.length; i++) {
			rolls.push(this.dice[i].max());
		}
		return new DiceResult(this.copy(), rolls);
	}
	min() {
		let rolls = [];
		for(let i=0; i<this.dice.length; i++) {
			rolls.push(this.dice[i].min());
		}
		return new DiceResult(this.copy(), rolls);
	}

	toString(noHtml) {
		let diceString = this.dice.join(", ");
		return `${diceString}${diceString.length > 0 ? ", " : ""}${this.modifier >= 0 ? "+" : ""}${this.modifier}`;
	}

	copy() {
		return new Dice(this.dice, this.modifier);
	}

	toJson() {
		return JSON.stringify(this);
	}

	static from(obj) {
		for(let i=0; i<obj.dice.length; i++) {
			obj.dice[i] = Die.from(obj.dice[i]);
		}
		return Object.assign(new Dice(), obj);
	}

	static fromJson(jsonStr) {
		const obj = JSON.parse(jsonStr);
		return Dice.from(obj);
	}
}

let diceData;

function setLocalStorage() {
	localStorage.setItem("dice-info", JSON.stringify(diceData));
}
function getLocalStorage() {
	diceData = {
		currentDice: new Dice([new Die(1,20)]),
		history: [],
		favorites: [],
		toggles: {}
	};
	const storedStr = localStorage.getItem("dice-info");
	if(!storedStr)
		return;
	const obj = JSON.parse(storedStr);
	diceData.currentDice = Dice.from(obj.currentDice);
	obj.history.forEach((result) => {
		diceData.history.push(DiceResult.from(result));
	});
	obj.favorites.forEach((dice) => {
		diceData.favorites.push(Dice.from(dice));
	});
	//if(!obj.toggles)
	obj.toggles = {};
	if(obj.toggles.diceSettings) {
		diceData.toggles.diceSettings = true;
		toggleDiceSettings();
	}
	else
		diceData.toggles.diceSettings = false;
	if(obj.toggles.favorites) {
		diceData.toggles.favorites = true;
		toggleFavorites();
	}
	else
		diceData.toggles.favorites = false;
	if(obj.toggles.history) {
		diceData.toggles.history = true;
		toggleHistory();
	}
	else
		diceData.toggles.history = false;
}

function updateDiceSummary() {
	document.getElementById("current-dice-display").innerHTML = `<b>Dice</b>: ${diceData.currentDice}`;
	activateFavoriteBtn();
}

const diceGroups = document.getElementById("dice-groups");
function updateDiceGroups() {
	diceGroups.innerHTML = "";
	diceData.currentDice.dice.forEach((die) => {
		const id = diceGroups.childElementCount;

		const wrapper = document.createElement("div");
		wrapper.classList.add("dice-group");

		const display = document.createElement("p");
		display.innerHTML = `<b>Dice</b>: ${die}`;
		wrapper.appendChild(display);

		const countLabel = document.createElement("label");
		countLabel.innerText = "Dice Count: ";
		const count = document.createElement("input");
		count.type = "number";
		count.id = `dice-group-${id}-count`;
		count.value = `${die.count}`;
		count.addEventListener("change", (e) => {
			diceData.currentDice.dice[id].count = parseInt(e.target.value || 0);
			updateDiceGroups();
			setLocalStorage();
		});
		countLabel.appendChild(count);
		wrapper.appendChild(countLabel);

		const sidesLabel = document.createElement("label");
		sidesLabel.innerText = "Sides: ";
		const sides = document.createElement("input");
		sides.type = "number";
		sides.id = `dice-group-${id}-sides`;
		sides.value = `${die.sides}`;
		sides.addEventListener("change", (e) => {
			diceData.currentDice.dice[id].sides = parseInt(e.target.value || 0);
			updateDiceGroups();
			setLocalStorage();
		});
		sidesLabel.appendChild(sides);
		wrapper.appendChild(sidesLabel);

		((die.properties.highest || die.properties.lowest) ? replaceRuleButton : setRuleBtn)(wrapper, id);

		const deleteBtn = document.createElement("button");
		const deleteIcon = document.createElement("img");
		deleteIcon.loading = "lazy";
		deleteIcon.width = deleteIcon.height = "18";
		deleteIcon.src = "images/x-ink.svg";
		deleteIcon.alt = "delete icon";
		deleteBtn.appendChild(deleteIcon);
		deleteBtn.appendChild(document.createTextNode(" Delete Dice Group"));
		deleteBtn.addEventListener("click", (e) => {
			if(confirm("Are you sure you want to delete this dice group?\nYou can't undo this.")) {
				diceData.currentDice.dice.splice(id, 1);
				updateDiceGroups();
				setLocalStorage();
			}
		});
		wrapper.appendChild(deleteBtn);

		diceGroups.appendChild(wrapper);
	});

	document.getElementById("dice-modifier").value = diceData.currentDice.modifier;

	updateDiceSummary();
}
function setRuleBtn(wrapper, id) {
	const addRuleBtn = document.createElement("button");
	const addRuleIcon = document.createElement("img");
	addRuleIcon.loading = "lazy";
	addRuleIcon.width = addRuleIcon.height = "18";
	addRuleIcon.src = "images/plus-ink.svg";
	addRuleIcon.alt = "plus icon";
	addRuleBtn.appendChild(addRuleIcon);
	addRuleBtn.appendChild(document.createTextNode(" Add Rule"));
	addRuleBtn.addEventListener("click", (e) => {
		diceData.currentDice.dice[id].properties = {
			drop: false,
			highest: 1
		};
		updateDiceGroups();
	});
	wrapper.appendChild(addRuleBtn);
}
function replaceRuleButton(wrapper, id) {
	const die = diceData.currentDice.dice[id];

	const rulesWrapper = document.createElement("div");
	rulesWrapper.classList.add("rules-wrapper");

	const keepDropDiv = document.createElement("div");
	keepDropDiv.appendChild(document.createTextNode("Rule Type:"));

	const keepLabel = document.createElement("label");
	const keepInput = document.createElement("input");
	keepInput.type = "radio";
	keepInput.checked = !die.properties.drop;
	keepInput.name = `dice-group-${id}-rule-type`;
	keepInput.value = "keep";
	keepInput.addEventListener("change", (e) => {
		const keepDropValue = document.querySelector(`input[name="dice-group-${id}-rule-type"]:checked`).value;
		die.properties.drop = keepDropValue == "drop";
		updateDiceGroups();
		setLocalStorage();
	});
	keepLabel.appendChild(keepInput);
	keepLabel.appendChild(document.createTextNode("Keep"));
	keepDropDiv.appendChild(keepLabel);

	const dropLabel = document.createElement("label");
	const dropInput = document.createElement("input");
	dropInput.type = "radio";
	dropInput.checked = die.properties.drop;
	dropInput.name = `dice-group-${id}-rule-type`;
	dropInput.value = "drop";
	dropInput.addEventListener("change", (e) => {
		const keepDropValue = document.querySelector(`input[name="dice-group-${id}-rule-type"]:checked`).value;
		die.properties.drop = keepDropValue == "drop";
		updateDiceGroups();
		setLocalStorage();
	});
	dropLabel.appendChild(dropInput);
	dropLabel.appendChild(document.createTextNode("Drop"));
	keepDropDiv.appendChild(dropLabel);

	rulesWrapper.appendChild(keepDropDiv);

	const countLabel = document.createElement("label");
	countLabel.appendChild(document.createTextNode("Affected Dice Count:"));
	const countInput = document.createElement("input");
	countInput.type = "number";
	countInput.id = `dice-group-${id}-rule-count`;
	countInput.value = die.properties.highest || die.properties.lowest || 1;
	countInput.addEventListener("change", (e) => {
		const highLowValue = document.querySelector(`input[name="dice-group-${id}-rule-high-low"]:checked`).value;
		die.properties[highLowValue] = parseInt(countInput.value);
		updateDiceGroups();
		setLocalStorage();
	});
	countLabel.appendChild(countInput);
	rulesWrapper.appendChild(countLabel);

	const highLowDiv = document.createElement("div");
	highLowDiv.appendChild(document.createTextNode("Affected Type:"));

	const highestLabel = document.createElement("label");
	const highestInput = document.createElement("input");
	highestInput.type = "radio";
	highestInput.checked = "highest" in die.properties;
	highestInput.name = `dice-group-${id}-rule-high-low`;
	highestInput.value = "highest";
	highestInput.addEventListener("change", (e) => {
		const highLowValue = document.querySelector(`input[name="dice-group-${id}-rule-high-low"]:checked`).value;
		const highLowNotValue = document.querySelector(`input[name="dice-group-${id}-rule-high-low"]:not(checked)`).value;
		die.properties[highLowValue] = countInput.value;
		delete die.properties[highLowNotValue];
		updateDiceGroups();
		setLocalStorage();
	});
	highestLabel.appendChild(highestInput);
	highestLabel.appendChild(document.createTextNode("Highest"));
	highLowDiv.appendChild(highestLabel);

	const lowestLabel = document.createElement("label");
	const lowestInput = document.createElement("input");
	lowestInput.type = "radio";
	lowestInput.checked = "lowest" in die.properties;
	lowestInput.name = `dice-group-${id}-rule-high-low`;
	lowestInput.value = "lowest";
	lowestInput.addEventListener("change", (e) => {
		const highLowValue = document.querySelector(`input[name="dice-group-${id}-rule-high-low"]:checked`).value;
		const highLowNotValue = document.querySelector(`input[name="dice-group-${id}-rule-high-low"]:not(checked)`).value;
		die.properties[highLowValue] = countInput.value;
		delete die.properties[highLowNotValue];
		updateDiceGroups();
		setLocalStorage();
	});
	lowestLabel.appendChild(lowestInput);
	lowestLabel.appendChild(document.createTextNode("Lowest"));
	highLowDiv.appendChild(lowestLabel);

	rulesWrapper.appendChild(highLowDiv);

	const removeRuleBtn = document.createElement("button");
	const removeRuleIcon = document.createElement("img");
	removeRuleIcon.loading = "lazy";
	removeRuleIcon.width = removeRuleIcon.height = "18";
	removeRuleIcon.src = "images/minus-ink.svg";
	removeRuleIcon.alt = "minus icon";
	removeRuleBtn.appendChild(removeRuleIcon);
	removeRuleBtn.appendChild(document.createTextNode(" Remove Rule"));
	removeRuleBtn.addEventListener("click", (e) => {
		diceData.currentDice.dice[id].properties = {};
		updateDiceGroups();
	});
	rulesWrapper.appendChild(removeRuleBtn);

	wrapper.appendChild(rulesWrapper);
}

const historySection = document.getElementById("history");
function updateHistory() {
	diceData.history = diceData.history.slice(0,100);
	historySection.innerHTML = "";
	diceData.history.forEach((result) => {
		const id = historySection.childElementCount;

		const wrapper = document.createElement("div");
		wrapper.classList.add("history-entry");

		const display = document.createElement("p");
		display.innerHTML = `${result}`;
		wrapper.appendChild(display);

		const rerollBtn = document.createElement("button");
		const rerollIcon = document.createElement("img");
		rerollIcon.loading = "lazy";
		rerollIcon.width = rerollIcon.height = "18";
		rerollIcon.src = "images/dice-ink.svg";
		rerollIcon.alt = "delete icon";
		rerollBtn.appendChild(rerollIcon);
		rerollBtn.appendChild(document.createTextNode(" Use these dice again"));
		rerollBtn.addEventListener("click", (e) => {
			diceData.currentDice = diceData.history[id].dice;
			updateDiceGroups();
			setLocalStorage();
			document.getElementById("dice-builder").scrollIntoView({behavior: "smooth"});
		});
		wrapper.appendChild(rerollBtn);

		historySection.appendChild(wrapper);
	});
	if(diceData.history.length == 0) {
		const noHistory = document.createElement("p");
		noHistory.innerText = "You have no history yet! The results of the last 100 rolls you make will appear here.";
		historySection.appendChild(noHistory);
	}
}

const favoritesSection = document.getElementById("favorites");
function updateFavorites() {
	favoritesSection.innerHTML = "";
	diceData.favorites.forEach((dice) => {
		const id = favoritesSection.childElementCount;

		const wrapper = document.createElement("div");
		wrapper.classList.add("favorites-entry");

		const display = document.createElement("p");
		display.innerHTML = `<b>Dice</b>: ${dice}`;
		wrapper.appendChild(display);

		const rerollBtn = document.createElement("button");
		const rerollIcon = document.createElement("img");
		rerollIcon.loading = "lazy";
		rerollIcon.width = rerollIcon.height = "18";
		rerollIcon.src = "images/dice-ink.svg";
		rerollIcon.alt = "delete icon";
		rerollBtn.appendChild(rerollIcon);
		rerollBtn.appendChild(document.createTextNode(" Use these dice"));
		rerollBtn.addEventListener("click", (e) => {
			diceData.currentDice = diceData.favorites[id];
			updateDiceGroups();
			setLocalStorage();
			document.getElementById("dice-builder").scrollIntoView({behavior: "smooth"});
		});
		wrapper.appendChild(rerollBtn);

		const unfavorBtn = document.createElement("button");
		const unfavorIcon = document.createElement("img");
		unfavorIcon.loading = "lazy";
		unfavorIcon.width = unfavorIcon.height = "18";
		unfavorIcon.src = "images/star-filled-ink.svg";
		unfavorIcon.alt = "delete icon";
		unfavorBtn.appendChild(unfavorIcon);
		unfavorBtn.appendChild(document.createTextNode(" Remove from Favorites"));
		unfavorBtn.addEventListener("click", (e) => {
			diceData.favorites.splice(id, 1);
			if(diceData.favorites.length == id)
				activateFavoriteBtn();
			updateFavorites();
			setLocalStorage();
		});
		wrapper.appendChild(unfavorBtn);

		favoritesSection.appendChild(wrapper);
	});
	if(diceData.favorites.length == 0) {
		const noFavorites = document.createElement("p");
		noFavorites.innerText = "You have no favorites yet! Click \"Add to Favorites\" to save dice here to use later.";
		favoritesSection.appendChild(noFavorites);
	}
}

getLocalStorage();
setLocalStorage();

let favoriteBtnState = false;
const favoriteBtn = document.getElementById("favorite");

updateDiceSummary();
updateDiceGroups();
updateHistory();
updateFavorites();

function toggleDiceSettings(e) {
	const diceInfoSection = document.getElementById("dice-info");
	const showBtn = document.getElementById("show-dice-info");
	diceInfoSection.classList.toggle("hide");
	if(diceInfoSection.classList.contains("hide")) {
		showBtn.innerHTML = "";
		const icon = document.createElement("img");
		icon.loading = "lazy";
		icon.height = icon.width = "18";
		icon.alt = "plus icon";
		icon.src = "images/plus-charcoal.svg";
		showBtn.appendChild(icon);
		showBtn.appendChild(document.createTextNode(" Show Dice Settings"));
		diceData.toggles.diceSettings = true;
	}
	else {
		showBtn.innerHTML = "";
		const icon = document.createElement("img");
		icon.loading = "lazy";
		icon.height = icon.width = "18";
		icon.alt = "minus icon";
		icon.src = "images/minus-charcoal.svg";
		showBtn.appendChild(icon);
		showBtn.appendChild(document.createTextNode(" Hide Dice Settings"));
		diceData.toggles.diceSettings = false;
	}
}
document.getElementById("show-dice-info").addEventListener("click", (e) => {toggleDiceSettings(e); setLocalStorage();});

function toggleFavorites(e) {
	const favoritesSection = document.getElementById("favorites");
	const showBtn = document.getElementById("show-favorites");
	favoritesSection.classList.toggle("hide");
	if(favoritesSection.classList.contains("hide")) {
		showBtn.innerHTML = "";
		const icon = document.createElement("img");
		icon.loading = "lazy";
		icon.height = icon.width = "18";
		icon.alt = "plus icon";
		icon.src = "images/plus-charcoal.svg";
		showBtn.appendChild(icon);
		showBtn.appendChild(document.createTextNode(" Show Favorites"));
		diceData.toggles.favorites = false;
	}
	else {
		showBtn.innerHTML = "";
		const icon = document.createElement("img");
		icon.loading = "lazy";
		icon.height = icon.width = "18";
		icon.alt = "minus icon";
		icon.src = "images/minus-charcoal.svg";
		showBtn.appendChild(icon);
		showBtn.appendChild(document.createTextNode(" Hide Favorites"));
		diceData.toggles.favorites = true;
	}
}
document.getElementById("show-favorites").addEventListener("click", (e) => {toggleFavorites(e); setLocalStorage();});

function toggleHistory(e) {
	const historySection = document.getElementById("history");
	const showBtn = document.getElementById("show-history");
	historySection.classList.toggle("hide");
	if(historySection.classList.contains("hide")) {
		showBtn.innerHTML = "";
		const icon = document.createElement("img");
		icon.loading = "lazy";
		icon.height = icon.width = "18";
		icon.alt = "plus icon";
		icon.src = "images/plus-charcoal.svg";
		showBtn.appendChild(icon);
		showBtn.appendChild(document.createTextNode(" Show History"));
		diceData.toggles.history = false;
	}
	else {
		showBtn.innerHTML = "";
		const icon = document.createElement("img");
		icon.loading = "lazy";
		icon.height = icon.width = "18";
		icon.alt = "minus icon";
		icon.src = "images/minus-charcoal.svg";
		showBtn.appendChild(icon);
		showBtn.appendChild(document.createTextNode(" Hide History"));
		diceData.toggles.history = true;
	}
}
document.getElementById("show-history").addEventListener("click", (e) => {toggleHistory(e); setLocalStorage();});

function activateFavoriteBtn() {
	if(favoriteBtnState)
		return;
	else
		favoriteBtnState = true;
	favoriteBtn.innerHTML = "";
	const icon = document.createElement("img");
	icon.loading = "lazy";
	icon.height = icon.width = "18";
	icon.alt = "not currently favorited icon";
	icon.src = "images/star-empty-charcoal.svg";
	favoriteBtn.appendChild(icon);
	favoriteBtn.appendChild(document.createTextNode(" Add to Favorites"));
	favoriteBtn.removeEventListener("click", triggerFavoriteBtn, {once: true});
	favoriteBtn.removeEventListener("click", triggerUnfavoriteBtn, {once: true});
	favoriteBtn.addEventListener("click", triggerFavoriteBtn, {once: true});
}
function triggerFavoriteBtn(e) {
	diceData.favorites.push(diceData.currentDice.copy());
	updateFavorites();
	setLocalStorage();
	activateUnfavoriteBtn();
}
function activateUnfavoriteBtn() {
	if(favoriteBtnState)
		favoriteBtnState = false;
	else
		return;
	favoriteBtn.innerHTML = "";
	const icon = document.createElement("img");
	icon.loading = "lazy";
	icon.height = icon.width = "18";
	icon.alt = "currently favorited icon";
	icon.src = "images/star-filled-charcoal.svg";
	favoriteBtn.appendChild(icon);
	favoriteBtn.appendChild(document.createTextNode(" Remove from Favorites"));
	favoriteBtn.removeEventListener("click", triggerFavoriteBtn, {once: true});
	favoriteBtn.removeEventListener("click", triggerUnfavoriteBtn, {once: true});
	favoriteBtn.addEventListener("click", triggerUnfavoriteBtn, {once: true});
}
function triggerUnfavoriteBtn(e) {
	diceData.favorites.pop();
	updateFavorites();
	setLocalStorage();
	activateFavoriteBtn();
}

document.getElementById("dice-modifier").addEventListener("change", (e) => {
	diceData.currentDice.modifier = parseInt(e.target.value || 0);
	updateDiceSummary();
	setLocalStorage();
});

document.getElementById("add-dice-group").addEventListener("click", (e) => {
	diceData.currentDice.dice.push(new Die(1,6));
	updateDiceGroups();
	setLocalStorage();
});

const latestDiceResult = document.getElementById("latest-dice-result");
document.getElementById("roll-current").addEventListener("click", (e) => {
	const roll = diceData.currentDice.roll();
	diceData.history.splice(0,0,roll);
	latestDiceResult.innerHTML = `<b>Result</b>: ${roll}`;
	updateHistory();
	setLocalStorage();
});
document.getElementById("max-current").addEventListener("click", (e) => {
	const roll = diceData.currentDice.max();
	diceData.history.splice(0,0,roll);
	latestDiceResult.innerHTML = `<b>Result</b>: ${roll}`;
	updateHistory();
	setLocalStorage();
});
document.getElementById("min-current").addEventListener("click", (e) => {
	const roll = diceData.currentDice.min();
	diceData.history.splice(0,0,roll);
	latestDiceResult.innerHTML = `<b>Result</b>: ${roll}`;
	updateHistory();
	setLocalStorage();
});