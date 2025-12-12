function qs(key) {
  return new URLSearchParams(location.search).get(key);
}

function el(tag, cls) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  return n;
}

document.getElementById("year").textContent = new Date().getFullYear();

(async () => {
  const slug = qs("slug");
  if (!slug) {
    document.getElementById("pTitle").textContent = "Missing project slug.";
    return;
  }

  const res = await fetch(`/api/project/${encodeURIComponent(slug)}`);
  if (!res.ok) {
    document.getElementById("pTitle").textContent = "Project not found.";
    return;
  }

  const p = await res.json();

  document.title = `${p.title} — RedOchre Post Works`;
  document.getElementById("pTitle").textContent = p.title;

  const metaBits = [p.category, p.client, p.year].filter(Boolean).join(" • ");
  document.getElementById("pMeta").textContent = metaBits;

  document.getElementById("pDesc").textContent = p.description || "";

  const v = document.getElementById("pVideo");
  v.src = p.src;
  v.muted = true;
  v.loop = true;
  v.controls = false;
  v.setAttribute("controlslist", "nodownload noplaybackrate noremoteplayback");
  v.addEventListener("contextmenu", (e) => e.preventDefault());
  v.play().catch(() => {});

  const creditsWrap = document.getElementById("pCredits");
  creditsWrap.innerHTML = "";
  if (Array.isArray(p.credits) && p.credits.length) {
    p.credits.forEach(c => {
      const row = el("div", "creditRow");
      const k = el("div", "creditK");
      const val = el("div", "creditV");
      k.textContent = c.k || "";
      val.textContent = c.v || "";
      row.append(k, val);
      creditsWrap.append(row);
    });
  } else {
    creditsWrap.textContent = "Add credits in /public/data/projects.json";
  }

  const stillsWrap = document.getElementById("pStills");
  stillsWrap.innerHTML = "";
  if (Array.isArray(p.stills) && p.stills.length) {
    p.stills.forEach(src => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = "Project still";
      img.loading = "lazy";
      stillsWrap.append(img);
    });
  } else {
    stillsWrap.textContent = "Add stills in /public/data/projects.json";
  }
})();
