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

const matchSelect = document.querySelector("#match");
const standSelect = document.querySelector("#stand");
const quantityInput = document.querySelector("#quantity");
const summaryCard = document.querySelector(".summary-card");
const matchRows = [...document.querySelectorAll(".schedule-table tbody tr[data-match]")];

if (matchSelect && standSelect && quantityInput && summaryCard) {
  const matches = matchRows.map((row) => row.dataset);

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

  document.querySelectorAll(".schedule-table .book-button").forEach((button) => {
    button.addEventListener("click", () => {
      const row = button.closest("tr");
      if (!row) return;
      matchSelect.value = row.dataset.match;
      updateBookingSummary();
      document.querySelector("#booking").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  updateBookingSummary(false);
}
