function showToast(message) {
  let toast = document.querySelector("#toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.setAttribute("role", "status");
    toast.style.cssText =
      "position:fixed;bottom:24px;left:50%;transform:translateX(-50%);" +
      "background:#222;color:white;padding:12px 20px;border-radius:8px;" +
      "opacity:0;transition:opacity .25s;z-index:9999";
    document.body.append(toast);
  }

  toast.textContent = message;
  toast.style.opacity = "1";
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.style.opacity = "0";
  }, 2500);
}

document.querySelectorAll("a, button").forEach((button) => {
  if (!button.textContent.toLowerCase().includes("book")) return;

  button.addEventListener("click", (event) => {
    const form =
      document.querySelector("#booking-form") ||
      document.querySelector("#booking") ||
      document.querySelector("form");

    if (!form) return;

    event.preventDefault();
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    showToast("Ready to book your match!");
  });
});