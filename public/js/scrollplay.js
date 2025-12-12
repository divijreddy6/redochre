function isMostlyVisible(entry) {
  return entry.isIntersecting && entry.intersectionRatio >= 0.6;
}

export function setupScrollPlay({ soundEnabledGetter }) {
  const videos = Array.from(document.querySelectorAll("video.video"));

  // Lazy-load src near viewport
  const lazy = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const v = e.target;
      if (e.isIntersecting && !v.src && v.dataset.src) {
        v.src = v.dataset.src;
        v.load();
      }
    }
  }, { threshold: 0.01, rootMargin: "900px 0px" });

  videos.forEach(v => lazy.observe(v));

  // One-at-a-time play based on visibility
  const io = new IntersectionObserver(async (entries) => {
    const visible = entries.filter(isMostlyVisible).sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    for (const e of entries) {
      const v = e.target;
      if (!isMostlyVisible(e) && !v.paused) v.pause();
    }
    if (!visible.length) return;

    const target = visible[0].target;

    for (const v of videos) {
      if (v !== target && !v.paused) v.pause();
    }

    if (!target.src && target.dataset.src) {
      target.src = target.dataset.src;
      target.load();
    }

    const soundEnabled = !!soundEnabledGetter?.();
    target.muted = !soundEnabled;

    try { await target.play(); } catch {}
  }, { threshold: [0, 0.25, 0.6, 0.85] });

  videos.forEach(v => io.observe(v));
}
