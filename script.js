// Show current year in footer
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Showreel modal
const modal = document.querySelector("[data-showreel-modal]");
const openButtons = document.querySelectorAll("[data-showreel-open]");
const closeElements = document.querySelectorAll("[data-showreel-close]");

function openModal() {
  if (!modal) return;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

openButtons.forEach((btn) => btn.addEventListener("click", openModal));
closeElements.forEach((el) => el.addEventListener("click", closeModal));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

// Mobile sidebar toggle
const sidebar = document.querySelector(".site-sidebar");
const mobileToggle = document.querySelector(".mobile-menu-toggle");

if (mobileToggle && sidebar) {
  mobileToggle.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("is-open");
    mobileToggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close sidebar when clicking nav links (mobile)
  sidebar.querySelectorAll(".nav-main a").forEach((link) => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("is-open");
      mobileToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Simple newsletter fake handler
const newsletterForm = document.getElementById("newsletter-form");
const newsletterMessage = document.getElementById("newsletter-message");

if (newsletterForm && newsletterMessage) {
  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const emailInput = newsletterForm.elements["email"];

    if (!emailInput.value.trim()) {
      newsletterMessage.textContent = "Please enter an email address.";
      return;
    }

    newsletterMessage.textContent =
      "Thanks for subscribing — this is a demo message you can replace with real behaviour.";
    newsletterForm.reset();

    setTimeout(() => {
      newsletterMessage.textContent = "";
    }, 4000);
  });
}
