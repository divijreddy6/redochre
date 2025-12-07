// Mobile sidebar toggle
const sidebar = document.getElementById("sidebar");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");

if (mobileMenuBtn && sidebar) {
  mobileMenuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    document.body.classList.toggle("menu-open");
  });

  // Close menu on link click (for small screens)
  const navLinks = sidebar.querySelectorAll(".side-nav a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("open");
      document.body.classList.remove("menu-open");
    });
  });
}

// Footer year
const footerYear = document.getElementById("footerYear");
if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

// Showreel modal
const reelModal = document.getElementById("reelModal");
const showreelBtn = document.getElementById("showreelBtn");
const reelBackdrop = document.getElementById("reelBackdrop");
const reelClose = document.getElementById("reelClose");

function openReel() {
  if (!reelModal) return;
  reelModal.classList.add("open");
}

function closeReel() {
  if (!reelModal) return;
  reelModal.classList.remove("open");
}

if (showreelBtn) showreelBtn.addEventListener("click", openReel);
if (reelBackdrop) reelBackdrop.addEventListener("click", closeReel);
if (reelClose) reelClose.addEventListener("click", closeReel);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeReel();
});

// NEWS SLIDER DATA
const newsData = [
  {
    date: "Jan 31, 2025",
    title: "Second Light wins top prize at Mountain View Film Festival",
    summary:
      "The feature documentary 'Second Light', graded and finished at YourStudio, took home the Grand Jury Prize last weekend.",
    url: "#"
  },
  {
    date: "Jan 17, 2025",
    title: "Neon City Nights Season 2 hits streaming platforms",
    summary:
      "Our team handled HDR grading and IMF mastering for the second season of the acclaimed neo-noir series.",
    url: "#"
  },
  {
    date: "Oct 4, 2024",
    title: "Homebound premieres to a full house at the Aurora Festival",
    summary:
      "Shot over three winters, 'Homebound' showcases a muted, wintery palette developed closely with the director and DP.",
    url: "#"
  },
  {
    date: "Jul 6, 2024",
    title: "Studio expands remote review capabilities for global clients",
    summary:
      "A new calibration and review pipeline allows filmmakers to collaborate from anywhere with confidence in picture accuracy.",
    url: "#"
  }
];

let newsIndex = 0;

const newsItem = document.getElementById("newsItem");
const newsPrev = document.getElementById("newsPrev");
const newsNext = document.getElementById("newsNext");

function renderNews() {
  if (!newsItem) return;
  const dateEl = newsItem.querySelector(".news-date");
  const titleEl = newsItem.querySelector(".news-title");
  const summaryEl = newsItem.querySelector(".news-summary");
  const linkEl = newsItem.querySelector(".news-link");

  const item = newsData[newsIndex];
  dateEl.textContent = item.date;
  titleEl.textContent = item.title;
  summaryEl.textContent = item.summary;
  linkEl.href = item.url;
}

if (newsPrev && newsNext) {
  newsPrev.addEventListener("click", () => {
    newsIndex = (newsIndex - 1 + newsData.length) % newsData.length;
    renderNews();
  });

  newsNext.addEventListener("click", () => {
    newsIndex = (newsIndex + 1) % newsData.length;
    renderNews();
  });
}

// Initial news render
renderNews();

// Newsletter fake submit
const newsletterForm = document.getElementById("newsletterForm");
const newsletterStatus = document.getElementById("newsletterStatus");

if (newsletterForm && newsletterStatus) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    newsletterStatus.textContent =
      "Thanks for subscribing. We’ll only email when there’s real news.";
    newsletterForm.reset();
    setTimeout(() => {
      newsletterStatus.textContent = "";
    }, 4000);
  });
}
