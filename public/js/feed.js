// public/js/feed.js

function el(tag, className) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  return n;
}

export async function loadFeed() {
  const status = document.getElementById("feedStatus");
  const cards = document.getElementById("cards");

  if (!status || !cards) return [];

  status.textContent = "Loading…";
  cards.innerHTML = "";

  let json;
  try {
    const res = await fetch("/api/videos", { cache: "no-store" });
    json = await res.json();
  } catch (e) {
    status.textContent = "Failed to load videos.";
    return [];
  }

  const items = (json.items || []).filter(x => !String(x.src || "").endsWith("/showreel.mp4"));

  if (!items.length) {
    status.textContent = "No videos found. Drop .mp4 into /public/videos and refresh.";
    return [];
  }

  status.textContent = `${items.length} project${items.length === 1 ? "" : "s"}`;

  items.forEach((item, i) => {
    const titleText = String(item?.meta?.title || item?.title || `Project ${i + 1}`).toUpperCase();

    const card = el("article", "card");
    const wrap = el("div", "videoWrap");

    // Video element (no controls; scroll-play will handle play/pause)
    const video = document.createElement("video");
    video.className = "video";
    video.setAttribute("playsinline", "");
    video.setAttribute("preload", "metadata");
    video.muted = true;
    video.loop = true;

    // Lazy src (scrollplay.js will attach when near viewport)
    video.dataset.src = item.src;

    // Remove visible video UI
    video.controls = false;
    video.setAttribute("controlslist", "nodownload noplaybackrate noremoteplayback");
    video.setAttribute("disablepictureinpicture", "");
    video.setAttribute("disableremoteplayback", "");

    if (item.poster) video.poster = item.poster;

    // Block right click on the video (best-effort)
    video.addEventListener("contextmenu", (e) => e.preventDefault());

    // Full clickable overlay link → opens project page
    const link = document.createElement("a");
    link.className = "projectLink";
    link.href = `/project.html?slug=${encodeURIComponent(item.slug)}`;
    link.setAttribute("aria-label", `Open project: ${titleText}`);

    // Title (top-right)
    const overlayTitle = el("div", "overlayTitle");
    overlayTitle.textContent = titleText;

    // VIEW (bottom-left)
    const overlayView = el("div", "overlayView");
    overlayView.textContent = "VIEW";

    // Optional: makes click feel snappy (prevents drag/select)
    link.addEventListener("dragstart", (e) => e.preventDefault());

    wrap.append(video, link, overlayTitle, overlayView);
    card.append(wrap);
    cards.append(card);
  });

  return items;
}
