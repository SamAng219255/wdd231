const orgDescBox = document.querySelector("textarea");
orgDescBox.addEventListener("input",(e) => {
	orgDescBox.rows = Math.max(orgDescBox.value.split("\n").length, 4);
});

const timestampInput = document.getElementById("timestamp");
timestampInput.value = new Date().getTime();

const memberships = {
	np: {
		name: "NP Membership",
		fee: "Free",
		description: "Our NP Membership is designed exclusively for local non-profit organizations that want to stay connected with the Timbuktu business community without added costs.",
		benefits: [
			"No annual fee",
			"Access to Chamber newsletters and community updates",
			"Invitation to general networking events",
			"Listing in the Chamber’s online directory (non-profit section)"
		]
	},
	bronze: {
		name: "Bronze Membership",
		fee: "$100 / year",
		description: "Perfect for small businesses starting out, Bronze Membership provides affordable access to Chamber resources and networking opportunities.",
		benefits: [
			"All NP Membership benefits",
			"Discounted rates for Chamber-hosted events",
			"Ability to post job openings on the Chamber website",
			"Basic advertising opportunities in monthly newsletters",
			"Ribbon-cutting ceremony for new business openings"
		]
	},
	silver: {
		name: "Silver Membership",
		fee: "$250 / year",
		description: "Silver Membership is a step up for businesses ready to expand their presence in the community with more promotional opportunities.",
		benefits: [
			"All Bronze Membership benefits",
			"Featured business spotlight on the Chamber homepage (rotating)",
			"Half-price booth space at Chamber expos and trade shows",
			"Access to Chamber training workshops and seminars",
			"Priority invitations to special networking events"
		]
	},
	gold: {
		name: "Gold Membership",
		fee: "$500 / year",
		description: "The Gold Membership is the premier level, designed for established businesses seeking maximum visibility and influence in the community.",
		benefits: [
			"All Silver Membership benefits",
			"Premium advertising placement on the Chamber website and newsletters",
			"Free booth space at Chamber expos and trade shows",
			"Exclusive invitations to leadership roundtables and VIP events",
			"First priority for sponsorship opportunities at Chamber events",
			"Recognition as a top-tier supporter of the Timbuktu Chamber of Commerce"
		]
	}
};

const npInfoBtn = document.getElementById("np-info-btn");
const bronzeInfoBtn = document.getElementById("bronze-info-btn");
const silverInfoBtn = document.getElementById("silver-info-btn");
const goldInfoBtn = document.getElementById("gold-info-btn");

npInfoBtn.addEventListener("click", (e) => {triggerModal("np");});
bronzeInfoBtn.addEventListener("click", (e) => {triggerModal("bronze");});
silverInfoBtn.addEventListener("click", (e) => {triggerModal("silver");});
goldInfoBtn.addEventListener("click", (e) => {triggerModal("gold");});

const infoModal = document.getElementById("membership-info");
function triggerModal(membershipLevel) {
	const membership = memberships[membershipLevel];

	infoModal.innerHTML = "";

	const membershipTitle = document.createElement("p");
	membershipTitle.classList.add("membership-modal-title");
	membershipTitle.innerHTML = membership.name;

	const closeModal = document.createElement("button");
	closeModal.innerHTML = `<svg class="svg-x" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
		<line x1="18" y1="6" x2="6" y2="18"></line>
		<line x1="6" y1="6" x2="18" y2="18"></line>
	</svg>`;
	closeModal.classList.add("close-modal");
	closeModal.addEventListener("click", (e) => {
		infoModal.close();
	});
	membershipTitle.append(closeModal);

	infoModal.append(membershipTitle);

	const membershipCost = document.createElement("p");
	membershipCost.innerHTML = `<b>Fee:</b><br>${membership.fee}`;
	infoModal.append(membershipCost);

	const membershipDesc = document.createElement("p");
	membershipDesc.innerHTML = `<b>Descritpion:</b><br>${membership.description}`;
	infoModal.append(membershipDesc);

	const membershipBenefitLabel = document.createElement("p");
	membershipBenefitLabel.innerHTML = "<b>Benefits:</b>";
	infoModal.append(membershipBenefitLabel);

	const membershipBenefits = document.createElement("ul");
	membership.benefits.forEach((benefit) => {
		const benefitItem = document.createElement("li");
		benefitItem.innerText = benefit;
		membershipBenefits.append(benefitItem);
	});
	infoModal.append(membershipBenefits);

	infoModal.setAttribute("closedby", "any");
	infoModal.showModal();
}

