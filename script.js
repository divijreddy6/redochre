const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const menuToggle = document.getElementById("menuToggle");
const sideNav = document.querySelector(".side-nav");

if (menuToggle && sideNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = sideNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  sideNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      sideNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}
