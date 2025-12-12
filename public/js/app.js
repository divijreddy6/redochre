const gallery = document.getElementById("gallery");
const loader = document.getElementById("loader");
const statItems = document.getElementById("statItems");
const statStatus = document.getElementById("statStatus");
document.getElementById("year").textContent = new Date().getFullYear();

const modal = document.getElementById("modal");
const modalVideo = document.getElementById("modalVideo");
const modalTitle = document.getElementById("modalTitle");
const modalMeta = document.getElementById("modalMeta");

let page = 1;
const limit = 12;
let total = null;
let loading = false;

function fmt(iso){
  try {
    return new Date(iso).toLocaleString(undefined, { year:"numeric", month:"short", day:"2-digit" });
  } catch {
    return "";
  }
}

function setStatus(t){ statStatus.textContent = t; }
function updateCount(){ statItems.textContent = String(gallery.querySelectorAll(".tile").length); }

function openModal({ src, title, meta }){
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  modalTitle.textContent = title || "Untitled";
  modalMeta.textContent = meta || "";
  modalVideo.src = src || "";
  modalVideo.currentTime = 0;
  modalVideo.play().catch(()=>{});
}
function closeModal(){
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  modalVideo.pause();
  modalVideo.removeAttribute("src");
  modalVideo.load();
}
modal.addEventListener("click", (e) => {
  if (e.target?.dataset?.close === "true") closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
});

function createTile({ url, name, updatedAt }){
  const title = name.replace(/\.[^/.]+$/, "");
  const time = fmt(updatedAt);

  // editorial rhythm: wide every 6th, tall every 9th
  const idx = gallery.querySelectorAll(".tile").length + 1;
  const size = (idx % 9 === 0) ? "tall" : (idx % 6 === 0 ? "wide" : "normal");

  const tile = document.createElement("article");
  tile.className = "tile";
  if(size === "wide") tile.classList.add("is-wide");
  if(size === "tall") tile.classList.add("is-tall");

  const media = document.createElement("div");
  media.className = "tile__media";

  const v = document.createElement("video");
  v.src = url;
  v.muted = true;
  v.loop = true;
  v.playsInline = true;
  v.preload = "metadata";

  const overlay = document.createElement("div");
  overlay.className = "tile__overlay";

  const badge = document.createElement("div");
  badge.className = "badge";
  badge.innerHTML = `<span class="badge__dot"></span><span>Play</span>`;

  media.appendChild(v);
  media.appendChild(overlay);
  media.appendChild(badge);

  const meta = document.createElement("div");
  meta.className = "tile__meta";

  const left = document.createElement("div");
  const t = document.createElement("div");
  t.className = "tile__title";
  t.textContent = title;

  const sub = document.createElement("div");
  sub.className = "tile__sub";
  sub.textContent = "From /videos • Click to play";

  left.appendChild(t);
  left.appendChild(sub);

  const right = document.createElement("div");
  right.className = "tile__time";
  right.textContent = time;

  meta.appendChild(left);
  meta.appendChild(right);

  tile.appendChild(media);
  tile.appendChild(meta);

  // autoplay/pause on scroll (smooth)
  const io = new IntersectionObserver((entries) => {
    for(const entry of entries){
      if(entry.isIntersecting) v.play().catch(()=>{});
      else v.pause();
    }
  }, { threshold: 0.35 });
  io.observe(tile);

  tile.addEventListener("click", () => {
    openModal({ src: url, title, meta: `Video • ${time}` });
  });

  return tile;
}

async function loadNext(){
  if(loading) return;
  if(total !== null && gallery.querySelectorAll(".tile").length >= total) {
    setStatus("Up to date");
    loader.style.display = "none";
    return;
  }

  loading = true;
  setStatus("Loading");

  try {
    const res = await fetch(`/api/videos?page=${page}&limit=${limit}`, { cache: "no-store" });
    const data = await res.json();

    total = data.total;

    if(data.items.length === 0 && page === 1){
      setStatus("No videos found");
      loader.style.display = "none";
      return;
    }

    for(const item of data.items){
      gallery.appendChild(createTile(item));
    }

    updateCount();
    page += 1;

    if(gallery.querySelectorAll(".tile").length >= total){
      setStatus("Up to date");
      loader.style.display = "none";
    } else {
      setStatus("Ready");
    }
  } catch (e) {
    setStatus("Error");
    console.error(e);
  } finally {
    loading = false;
  }
}

// Infinite scroll trigger
const ioLoader = new IntersectionObserver((entries) => {
  if(entries[0].isIntersecting) loadNext();
}, { threshold: 0.25 });

ioLoader.observe(loader);

// initial load
loadNext();
