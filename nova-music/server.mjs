import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const API = "https://api.audius.co/v1";
const ROOT = path.join(process.cwd(), "public");
const PORT = 4173;

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

async function audius(endpoint) {
  const response = await fetch(API + endpoint, {
    headers: { "Accept": "application/json" },
    signal: AbortSignal.timeout(15000)
  });
  if (!response.ok) throw new Error("Audius API: " + response.status);
  return response.json();
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");

  try {
    if (url.pathname === "/api/search") {
      const q = url.searchParams.get("q")?.trim();
      if (!q) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: "Arama metni gerekli." }));
      }
      const data = await audius(
        "/tracks/search?query=" + encodeURIComponent(q) + "&limit=25"
      );
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(data));
    }

    if (url.pathname === "/api/sc-resolve") {
      const u = url.searchParams.get("u") || "";
      let h = "";
      try { h = new URL(u).hostname; } catch {}
      if (h !== "on.soundcloud.com") { res.writeHead(400); return res.end("Geçersiz link"); }
      const r = await fetch(u, { redirect: "follow", signal: AbortSignal.timeout(15000) });
      const f = new URL(r.url);
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ url: f.origin + f.pathname }));
    }
    if (url.pathname === "/api/trending-tr") {
      const c = globalThis.__trTR || (globalThis.__trTR = { t: 0, d: [] });
      if (Date.now() - c.t > 3600000 || !c.d.length) {
        try {
          const r = await fetch("https://rss.applemarketingtools.com/api/v2/tr/music/most-played/25/songs.json", { signal: AbortSignal.timeout(10000) });
          const j = await r.json();
          c.d = j.feed.results.map(x => x.artistName + " " + x.name);
          c.t = Date.now();
        } catch (e) { console.log("trending-tr hata:", e.message); }
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(c.d));
    }
    if (url.pathname === "/api/trending-tr") {
      const c = globalThis.__trTR || (globalThis.__trTR = { t: 0, d: [] });
      if (Date.now() - c.t > 3600000 || !c.d.length) {
        try {
          const r = await fetch("https://rss.applemarketingtools.com/api/v2/tr/music/most-played/25/songs.json", { signal: AbortSignal.timeout(10000) });
          const j = await r.json();
          c.d = j.feed.results.map(x => x.artistName + " " + x.name);
          c.t = Date.now();
        } catch (e) { console.log("trending-tr hata:", e.message); }
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(c.d));
    }
    if (url.pathname === "/api/trending") {
      const data = await audius("/tracks/trending?limit=25");
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(data));
    }

    if (url.pathname === "/api/tr-list") {
      const c = globalThis.__trL || (globalThis.__trL = { t: 0, d: [] });
      if (Date.now() - c.t > 3600000 || !c.d.length) {
        try {
          const r = await fetch("https://rss.applemarketingtools.com/api/v2/tr/music/most-played/25/songs.json", { signal: AbortSignal.timeout(10000) });
          const j = await r.json();
          c.d = j.feed.results.map(x => ({ id: "yt-" + x.id, name: x.name, artist: x.artistName, art: (x.artworkUrl100 || "").replace("100x100", "300x300"), yt: x.artistName + " " + x.name }));
          c.t = Date.now();
        } catch (e) { console.log("tr-list hata:", e.message); }
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(c.d));
    }
    if (url.pathname === "/api/yt") {
      const q = (url.searchParams.get("q") || "").slice(0, 120);
      if (!q) { res.writeHead(400); return res.end("q yok"); }
      const C = globalThis.__ytC || (globalThis.__ytC = {});
      let hit = C[q];
      if (!hit || Date.now() - hit.t > 18000000) {
        const { execFile } = await import("node:child_process");
        const link = await new Promise((ok) => execFile("yt-dlp", ["--js-runtimes","node","--remote-components","ejs:github","-f","bestaudio[ext=m4a]/bestaudio","-g","ytsearch1:" + q], { timeout: 40000 }, (e, out) => ok(e ? "" : out.trim().split("\n")[0])));
        if (!link) { res.writeHead(502); return res.end("YouTube linki alinamadi"); }
        hit = C[q] = { t: Date.now(), u: link };
      }
      res.writeHead(302, { Location: hit.u });
      return res.end();
    }
    if (url.pathname.startsWith("/api/stream/")) {
      const id = url.pathname.split("/").pop();
      if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
        res.writeHead(400);
        return res.end("Geçersiz parça kimliği");
      }

      const response = await fetch(
        `${API}/tracks/${encodeURIComponent(id)}/stream`,
        { redirect: "manual", signal: AbortSignal.timeout(20000) }
      );

      const location = response.headers.get("location");
      if (location && response.status >= 300 && response.status < 400) {
        res.writeHead(302, { Location: location });
        return res.end();
      }

      if (!response.ok) {
        res.writeHead(response.status);
        return res.end("Müzik akışı alınamadı.");
      }

      res.writeHead(200, {
        "Content-Type": response.headers.get("content-type") || "audio/mpeg",
        "Cache-Control": "no-store"
      });
      return res.end(Buffer.from(await response.arrayBuffer()));
    }

    const requested = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
    const file = path.resolve(ROOT, requested);

    if (!file.startsWith(ROOT + path.sep)) {
      res.writeHead(403);
      return res.end("Forbidden");
    }

    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
      res.writeHead(404);
      return res.end("Not found");
    }

    res.writeHead(200, {
      "Content-Type": types[path.extname(file)] || "application/octet-stream"
    });
    fs.createReadStream(file).pipe(res);

  } catch (error) {
    console.error(error.message);
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: error.message }));
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("🎵 NOVA Music çalışıyor!");
  console.log(`http://127.0.0.1:${PORT}`);
});
