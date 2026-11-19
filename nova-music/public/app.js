
const TUNNEL_API = "https://igcmeihdkxkczzgneioa.supabase.co/rest/v1/tunnel_status?select=url&id=eq.1";
const TUNNEL_KEY = "sb_publishable_XPy0o9PDLBgukREOKQpG4A_AY3gJNs7";

async function getCurrentTunnel() {
  const r = await fetch(TUNNEL_API, {
    headers: { apikey: TUNNEL_KEY },
    cache: "no-store"
  });
  if (!r.ok) throw new Error("Tünel adresi alınamadı");
  const data = await r.json();
  const url = data?.[0]?.url;
  if (!url || !/^https:\/\/[a-z0-9-]+\.trycloudflare\.com$/.test(url))
    throw new Error("Geçersiz tünel adresi");
  return url;
}

const $ = id => document.getElementById(id);
const audio = $("audio");
let tracks = [];
let current = -1;
let favorites = JSON.parse(localStorage.getItem("nova-favorites") || "[]");

function artwork(t) {
  return t.artwork?.["480x480"] || t.artwork?.["150x150"] || "";
}
function time(n) {
  if (!Number.isFinite(n)) return "0:00";
  return Math.floor(n/60) + ":" + String(Math.floor(n%60)).padStart(2,"0");
}
function saveFavorites() {
  localStorage.setItem("nova-favorites", JSON.stringify(favorites));
  renderFavorites();
}
function isFavorite(t) {
  return favorites.some(x => x.id === t.id);
}
function toggleFavorite(t) {
  favorites = isFavorite(t) ? favorites.filter(x => x.id !== t.id) : [...favorites, t];
  saveFavorites();
  renderTracks();
  updateLike();
}

function renderTracks() {
  const box = $("tracks");
  box.innerHTML = "";
  tracks.forEach((t, i) => {
    const row = document.createElement("div");
    row.className = "track" + (i === current ? " active-track" : "");

    const img = document.createElement("img");
    img.src = artwork(t);
    img.alt = "";

    const data = document.createElement("div");
    data.className = "track-data";
    
    const title = document.createElement("b");
    title.textContent = t.title || "İsimsiz";

    const artist = document.createElement("span");
    if (i === current && !audio.paused) {
      artist.innerHTML = '<span class="playing-text">Şu anda çalıyor...</span>';
    } else {
      artist.textContent = t.user?.name || "Bilinmeyen sanatçı";
    }

    data.append(title, artist);

    const like = document.createElement("button");
    like.textContent = isFavorite(t) ? "♥" : "♡";
    like.onclick = () => toggleFavorite(t);

    const playBtn = document.createElement("button");
    playBtn.className = "choose";
    playBtn.textContent = (i === current && !audio.paused) ? "Ⅱ" : "▶";
    playBtn.onclick = () => {
      if (current === i) {
        // Aynı şarkıysa oynat/durdur yap
        if (audio.paused) {
          audio.play();
          playBtn.textContent = "Ⅱ";
          $("play").textContent = "Ⅱ";
        } else {
          audio.pause();
          playBtn.textContent = "▶";
          $("play").textContent = "▶";
        }
        renderTracks();
      } else {
        playTrack(i);
      }
    };

    row.append(img, data, like, playBtn);
    box.append(row);
  });
}

function renderFavorites() {
  const box = $("favorites");
  box.innerHTML = "";
  if (!favorites.length) {
    box.innerHTML = '<div class="empty">Henüz favori şarkın yok.</div>';
    return;
  }
  favorites.forEach((t) => {
    const row = document.createElement("div");
    row.className = "track";
    const img = document.createElement("img");
    img.src = artwork(t);
    const data = document.createElement("div");
    data.className = "track-data";
    const title = document.createElement("b");
    title.textContent = t.title || "İsimsiz";
    const artist = document.createElement("span");
    artist.textContent = t.user?.name || "Bilinmeyen sanatçı";
    data.append(title, artist);

    const play = document.createElement("button");
    play.className = "choose";
    play.textContent = "▶";
    play.onclick = () => {
      tracks = [t];
      playTrack(0);
    };
    row.append(img, data, play);
    box.append(row);
  });
}

function updateLike() {
  if (current >= 0 && tracks[current]) {
    $("likeNow").textContent = isFavorite(tracks[current]) ? "♥" : "♡";
  } else $("likeNow").textContent = "♡";
}

async function load(endpoint, title) {
  $("status").textContent = "Müzikler yükleniyor...";
  $("tracks").innerHTML = "";
  $("listTitle").textContent = title;
  try {
    const response = await fetch(endpoint);
    const json = await response.json();
    if (!response.ok) throw new Error(json.error || "İstek başarısız");
    tracks = json.data || [];
    renderTracks();
    $("status").textContent = tracks.length ? tracks.length + " şarkı bulundu" : "Şarkı bulunamadı.";
  } catch(e) {
    $("status").textContent = "Bağlantı hatası: " + e.message;
  }
}

const playerEl = $("player");

function showPlayer() {
  playerEl.classList.add("visible");
}

function hidePlayer() {
  playerEl.classList.remove("visible");
  audio.pause();
  $("play").textContent = "▶";
  current = -1;
  renderTracks();
}

function playTrack(i) {
  if (!tracks[i]) return;

  current = i;
  const t = tracks[i];
  $("nowTitle").textContent = t.title || "İsimsiz";
  $("nowArtist").textContent = t.user?.name || "Bilinmeyen sanatçı";
  $("cover").src = artwork(t);

  const streamPath = "/api/stream/" + encodeURIComponent(t.id);

  async function start(src, position = 0) {
    audio.src = src;
    audio.load();

    if (position > 0) {
      audio.addEventListener("loadedmetadata", function restore() {
        audio.removeEventListener("loadedmetadata", restore);
        if (Number.isFinite(audio.duration) && position < audio.duration) {
          audio.currentTime = position;
        }
      });
    }

    await audio.play();
    $("play").textContent = "Ⅱ";
    showPlayer();
    renderTracks();
  }

  start(streamPath).catch(async () => {
    $("play").textContent = "▶";
    $("status").textContent = "Yeni sunucu aranıyor...";

    try {
      const position = audio.currentTime || 0;
      const tunnel = await getCurrentTunnel();
      await start(tunnel + streamPath, position);
      $("status").textContent = "Bağlantı yeniden kuruldu.";
    } catch (e) {
      $("status").textContent = "Bağlantı kurulamadı. Tekrar deneyebilirsin.";
    }
  });

  updateLike();
}
$("searchBtn").onclick = () => {
  const q = $("search").value.trim();
  if (q) load("/api/search?q=" + encodeURIComponent(q), "Arama sonuçları");
};
$("search").addEventListener("keydown", e => {
  if (e.key === "Enter") $("searchBtn").click();
});
$("refresh").onclick = () => load("/api/trending", "Trend şarkılar");

$("play").onclick = () => {
  if (!audio.src) return;
  if (audio.paused) {
    audio.play().then(() => {
      $("play").textContent = "Ⅱ";
      renderTracks();
    });
  } else {
    audio.pause();
    $("play").textContent = "▶";
    renderTracks();
  }
};

$("next").onclick = () => { if(current < tracks.length-1) playTrack(current+1); };
$("prev").onclick = () => { if(current > 0) playTrack(current-1); };
$("likeNow").onclick = () => { if(current >= 0) toggleFavorite(tracks[current]); };

let reconnecting = false;

audio.addEventListener("error", async () => {
  if (reconnecting || current < 0 || !tracks[current]) return;

  reconnecting = true;
  const trackIndex = current;
  const position = audio.currentTime || 0;

  $("status").textContent = "Bağlantı koptu. Yeniden bağlanılıyor...";

  try {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const tunnel = await getCurrentTunnel();

    if (current !== trackIndex) return;

    const id = encodeURIComponent(tracks[trackIndex].id);
    audio.src = tunnel + "/api/stream/" + id;
    audio.load();

    await new Promise((resolve, reject) => {
      audio.addEventListener("loadedmetadata", resolve, { once: true });
      audio.addEventListener("error", reject, { once: true });
    });

    if (position > 0 && position < audio.duration) {
      audio.currentTime = position;
    }

    await audio.play();
    $("play").textContent = "Ⅱ";
    $("status").textContent = "Bağlantı yeniden kuruldu.";
  } catch (e) {
    $("status").textContent = "Yeniden bağlanılamadı. Sayfayı yenilemeyi dene.";
  } finally {
    reconnecting = false;
  }
});

audio.addEventListener("timeupdate", () => {
  if(audio.duration) {
    $("seek").value = audio.currentTime / audio.duration * 100;
    $("currentTime").textContent = time(audio.currentTime);
    $("duration").textContent = time(audio.duration);
  }
});
$("seek").oninput = () => {
  if(audio.duration) audio.currentTime = audio.duration * Number($("seek").value) / 100;
};
audio.onended = () => {
  if(current < tracks.length-1) playTrack(current+1);
  else {
    $("play").textContent = "▶";
    renderTracks();
  }
};

renderFavorites();
load("/api/trending", "Trend şarkılar");

// Arama arayüzü
const searchToggle = document.getElementById("searchToggle");
const searchPanel = document.getElementById("searchPanel");
const searchInput = document.getElementById("search");  
if (searchToggle && searchPanel) {
  searchToggle.addEventListener("click", () => {
    searchPanel.classList.toggle("open");
    if (searchPanel.classList.contains("open")) searchInput?.focus();
  });
}

const welcome = document.querySelector(".welcome");
window.addEventListener("scroll", () => {
  welcome?.classList.toggle("welcome-hidden", window.scrollY > 45);
}, { passive: true });

// Swipe (Sağa/Sola kaydırma ile player kapatma)
let touchStartX = 0;
playerEl.addEventListener("touchstart", e => {
  touchStartX = e.changedTouches[0].screenX;
}, {passive: true});

playerEl.addEventListener("touchend", e => {
  let touchEndX = e.changedTouches[0].screenX;
  if (Math.abs(touchEndX - touchStartX) > 50) {
    hidePlayer();
  }
}, {passive: true});
