import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve /public as the website root
const PUBLIC_DIR = path.join(__dirname, "..", "public");
const VIDEOS_DIR = path.join(PUBLIC_DIR, "videos");

app.use(express.static(PUBLIC_DIR));

function isVideo(name) {
  return /\.(mp4|mov|webm|m4v)$/i.test(name);
}

app.get("/api/videos", (req, res) => {
  const page = Math.max(1, parseInt(req.query.page || "1", 10));
  const limit = Math.min(30, Math.max(1, parseInt(req.query.limit || "12", 10)));

  if (!fs.existsSync(VIDEOS_DIR)) {
    return res.json({ page, limit, total: 0, items: [] });
  }

  const files = fs
    .readdirSync(VIDEOS_DIR)
    .filter(isVideo)
    .map((name) => {
      const full = path.join(VIDEOS_DIR, name);
      const stat = fs.statSync(full);
      return {
        name,
        url: `/videos/${encodeURIComponent(name)}`,
        mtimeMs: stat.mtimeMs
      };
    })
    .sort((a, b) => b.mtimeMs - a.mtimeMs); // newest first

  const total = files.length;
  const start = (page - 1) * limit;
  const items = files.slice(start, start + limit).map((f) => ({
    name: f.name,
    url: f.url,
    updatedAt: new Date(f.mtimeMs).toISOString()
  }));

  res.json({ page, limit, total, items });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`REDOCHRE running on http://localhost:${PORT}`);
  console.log(`Put videos in: ${VIDEOS_DIR}`);
});
