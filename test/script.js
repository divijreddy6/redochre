// Mobile nav toggle
const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });
}

// Showreel modal
const playShowreelBtn = document.getElementById("playShowreel");
const showreelModal = document.getElementById("showreelModal");
const modalClose = document.querySelector(".modal-close");
const modalBackdrop = document.querySelector(".modal-backdrop");

function openModal() {
  if (showreelModal) {
    showreelModal.classList.add("active");
    showreelModal.setAttribute("aria-hidden", "false");
  }
}

function closeModal() {
  if (showreelModal) {
    showreelModal.classList.remove("active");
    showreelModal.setAttribute("aria-hidden", "true");
  }
}

if (playShowreelBtn) playShowreelBtn.addEventListener("click", openModal);
if (modalClose) modalClose.addEventListener("click", closeModal);
if (modalBackdrop) modalBackdrop.addEventListener("click", closeModal);

// Prevent default form submissions for now
document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Form submission logic goes here.");
  });
});
