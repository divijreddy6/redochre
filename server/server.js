import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, "public");
const VIDEOS_DIR = path.join(PUBLIC_DIR, "videos");
const POSTERS_DIR = path.join(PUBLIC_DIR, "posters");
const PROJECTS_JSON = path.join(PUBLIC_DIR, "data", "projects.json");

app.use(express.static(PUBLIC_DIR, { extensions: ["html"] }));

const allowedExt = new Set([".mp4", ".webm", ".mov"]);

function safeTitleFromFilename(filename) {
  const base = filename.replace(/\.[^/.]+$/, "");
  return base
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function slugify(str) {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function loadProjectsMeta() {
  try {
    if (!fs.existsSync(PROJECTS_JSON)) return {};
    const raw = fs.readFileSync(PROJECTS_JSON, "utf8");
    const parsed = JSON.parse(raw);
    // Expecting: { "slug-or-filename": {...meta} }
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function listVideoItems() {
  if (!fs.existsSync(VIDEOS_DIR)) return [];

  const files = fs
    .readdirSync(VIDEOS_DIR)
    .filter((f) => allowedExt.has(path.extname(f).toLowerCase()))
    .map((f) => {
      const base = f.replace(/\.[^/.]+$/, "");
      const slug = slugify(base);

      const posterJpg = path.join(POSTERS_DIR, `${base}.jpg`);
      const posterPng = path.join(POSTERS_DIR, `${base}.png`);
      const poster =
        fs.existsSync(posterJpg) ? `/posters/${base}.jpg` :
        fs.existsSync(posterPng) ? `/posters/${base}.png` :
        null;

      const stat = fs.statSync(path.join(VIDEOS_DIR, f));
      return {
        file: f,
        slug,
        src: `/videos/${f}`,
        title: safeTitleFromFilename(f),
        poster,
        mtime: stat.mtimeMs
      };
    })
    .sort((a, b) => b.mtime - a.mtime);

  return files;
}

app.get("/api/videos", (req, res) => {
  const metaMap = loadProjectsMeta();
  const items = listVideoItems().map((v) => {
    // allow meta key by slug OR by filename base
    const base = v.file.replace(/\.[^/.]+$/, "");
    const meta = metaMap[v.slug] || metaMap[base] || null;
    return {
      ...v,
      meta: meta ? {
        title: meta.title || v.title,
        year: meta.year || "",
        client: meta.client || "",
        category: meta.category || ""
      } : null
    };
  });

  res.json({ items });
});

app.get("/api/project/:slug", (req, res) => {
  const slug = req.params.slug;
  const metaMap = loadProjectsMeta();
  const videos = listVideoItems();
  const vid = videos.find(v => v.slug === slug);

  if (!vid) return res.status(404).json({ error: "Not found" });

  const base = vid.file.replace(/\.[^/.]+$/, "");
  const meta = metaMap[slug] || metaMap[base] || {};

  res.json({
    slug: vid.slug,
    src: vid.src,
    poster: vid.poster,
    title: meta.title || vid.title,
    year: meta.year || "",
    client: meta.client || "",
    category: meta.category || "",
    description: meta.description || "",
    credits: meta.credits || [],
    stills: meta.stills || []
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running: http://localhost:${PORT}`));
