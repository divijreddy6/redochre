import { loadFeed } from "./feed.js";
import { setupScrollPlay } from "./scrollplay.js";
import { setupModal } from "./modal.js";
import { setupReveal } from "./reveal.js";

document.getElementById("year").textContent = new Date().getFullYear();

const soundBtn = document.getElementById("soundToggle");
let soundEnabled = false;

soundBtn.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundBtn.setAttribute("aria-pressed", String(soundEnabled));
  soundBtn.textContent = soundEnabled ? "Sound On" : "Enable Sound";

  document.querySelectorAll("video.video").forEach(v => {
    v.muted = !soundEnabled;
    if (soundEnabled) v.volume = 1;
  });

  // showreel video too
  const showreel = document.getElementById("showreelVideo");
  if (showreel) showreel.muted = !soundEnabled;
});

(async () => {
  await loadFeed();
  setupScrollPlay({ soundEnabledGetter: () => soundEnabled });
  setupModal({ soundEnabledGetter: () => soundEnabled });
  setupReveal();
})();
