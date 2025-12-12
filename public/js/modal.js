export function setupModal({ soundEnabledGetter }) {
  const modal = document.getElementById("showreelModal");
  const open1 = document.getElementById("openShowreel");
  const open2 = document.getElementById("openShowreel2");
  const video = document.getElementById("showreelVideo");

  function open() {
    modal.setAttribute("aria-hidden", "false");
    modal.classList.add("is-open");

    // expects /public/videos/showreel.mp4 (optional)
    if (!video.src) video.src = "/videos/showreel.mp4";

    const soundEnabled = !!soundEnabledGetter?.();
    video.muted = !soundEnabled;

    // try autoplay (may fail)
    video.play().catch(() => {});
    document.body.style.overflow = "hidden";
  }

  function close() {
    modal.setAttribute("aria-hidden", "true");
    modal.classList.remove("is-open");
    video.pause();
    document.body.style.overflow = "";
  }

  open1?.addEventListener("click", open);
  open2?.addEventListener("click", open);

  modal.addEventListener("click", (e) => {
    const t = e.target;
    if (t?.dataset?.close === "1") close();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) close();
  });
}
