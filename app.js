function showToast(message) {
  const toast = document.querySelector("#toast") || document.createElement("div");
  toast.id = "toast";
  toast.setAttribute("role", "status");
  toast.style.cssText = "position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#222;color:#fff;padding:12px 20px;border-radius:8px;opacity:0;transition:opacity .25s;z-index:9999";
  if (!toast.isConnected) document.body.append(toast);
  toast.textContent = message;
  toast.style.opacity = "1";
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => { toast.style.opacity = "0"; }, 2500);
}

const menuToggle = document.querySelector("#menu-toggle");
const mainNav = document.querySelector("#main-nav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });
  mainNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    mainNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }));
}

const matchCards = [...document.querySelectorAll(".match-card[data-match]")];
const teamFilter = document.querySelector("#team-filter");
const matchGrid = document.querySelector("#match-cards");
const gridButton = document.querySelector("#grid-view");
const listButton = document.querySelector("#list-view");

if (teamFilter) {
  teamFilter.addEventListener("change", () => {
    const team = teamFilter.value;
    matchCards.forEach((card) => {
      const teams = card.dataset.teams.split(",").map((name) => name.trim());
      card.hidden = team !== "all" && !teams.includes(team);
    });
  });
}

function setMatchView(view) {
  if (!matchGrid || !gridButton || !listButton) return;
  const showList = view === "list";
  matchGrid.classList.toggle("is-list", showList);
  gridButton.classList.toggle("is-active", !showList);
  listButton.classList.toggle("is-active", showList);
  gridButton.setAttribute("aria-pressed", String(!showList));
  listButton.setAttribute("aria-pressed", String(showList));
}

gridButton?.addEventListener("click", () => setMatchView("grid"));
listButton?.addEventListener("click", () => setMatchView("list"));

const matchSelect = document.querySelector("#match");
const standSelect = document.querySelector("#stand");
const quantityInput = document.querySelector("#quantity");
const summaryCard = document.querySelector(".summary-card");

if (matchSelect && standSelect && quantityInput && summaryCard) {
  const matches = matchCards.map((card) => card.dataset);

  matches.forEach((match) => {
    const option = document.createElement("option");
    option.value = match.match;
    option.textContent = match.match;
    matchSelect.append(option);
  });

  function updateBookingSummary(showConfirmation = true) {
    const match = matches.find((item) => item.match === matchSelect.value);
    const stand = standSelect.value;
    const quantity = Math.max(1, Number(quantityInput.value) || 1);
    const unitPrice = match ? Number(match[stand.toLowerCase()]) : 0;

    document.querySelector("#summary-match").textContent = match?.match || "Select a match";
    document.querySelector("#summary-date").textContent = match?.date || "—";
    document.querySelector("#summary-venue").textContent = match?.venue || "—";
    document.querySelector("#summary-stand").textContent = stand;
    document.querySelector("#summary-price").textContent = match ? `₹${unitPrice.toLocaleString("en-IN")}` : "—";
    document.querySelector("#summary-quantity").textContent = String(quantity);
    document.querySelector("#summary-total").textContent = match ? `₹${(unitPrice * quantity).toLocaleString("en-IN")}` : "—";

    if (showConfirmation) showToast("Booking summary updated.");
  }

  matchSelect.addEventListener("change", () => updateBookingSummary());
  standSelect.addEventListener("change", () => updateBookingSummary());
  quantityInput.addEventListener("input", () => updateBookingSummary());
  quantityInput.addEventListener("change", () => updateBookingSummary());

  document.querySelectorAll(".match-card .book-button").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".match-card");
      if (!card) return;
      matchSelect.value = card.dataset.match;
      updateBookingSummary();
      document.querySelector("#booking").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  updateBookingSummary(false);
}