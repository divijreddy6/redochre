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

app.use(express.static(PUBLIC_DIR, { extensions: ["html"] }));

function safeTitleFromFilename(filename) {
  const base = filename.replace(/\.[^/.]+$/, "");
  return base
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

app.get("/api/videos", (req, res) => {
  if (!fs.existsSync(VIDEOS_DIR)) return res.json({ items: [] });

  const allowed = new Set([".mp4", ".webm", ".mov"]);
  const files = fs
    .readdirSync(VIDEOS_DIR)
    .filter((f) => allowed.has(path.extname(f).toLowerCase()))
    .map((f) => {
      const base = f.replace(/\.[^/.]+$/, "");
      const posterJpg = path.join(POSTERS_DIR, `${base}.jpg`);
      const posterPng = path.join(POSTERS_DIR, `${base}.png`);

      const poster =
        fs.existsSync(posterJpg) ? `/posters/${base}.jpg` :
        fs.existsSync(posterPng) ? `/posters/${base}.png` :
        null;

      const stat = fs.statSync(path.join(VIDEOS_DIR, f));
      return { src: `/videos/${f}`, title: safeTitleFromFilename(f), poster, mtime: stat.mtimeMs };
    })
    .sort((a, b) => b.mtime - a.mtime);

  res.json({ items: files });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Running: http://localhost:${PORT}`));
