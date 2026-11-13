// Supabase Edge Function: resolve SoundCloud short links for tracks and playlists.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const input = new URL(String(body?.url || ""));
    if (input.protocol !== "https:" || input.hostname !== "on.soundcloud.com") {
      return Response.json({ error: "Geçersiz SoundCloud kısa bağlantısı." }, { status: 400, headers: corsHeaders });
    }

    const response = await fetch(input.href, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(12000),
      headers: { "User-Agent": "Mozilla/5.0 NOVA-Music-Link/1.0" },
    });

    const resolved = new URL(response.url);
    const host = resolved.hostname.toLowerCase();
    const pathParts = resolved.pathname.split("/").filter(Boolean);
    const isSoundCloudHost = host === "soundcloud.com" || host === "www.soundcloud.com";
    const isPlaylistPath =
      pathParts.length >= 3 &&
      pathParts[1] === "sets" &&
      pathParts[2].length > 0;
    const reservedRoutes = new Set([
      "discover", "search", "you", "stream", "charts", "stations",
      "tags", "pages", "settings", "upload", "pro", "jobs",
    ]);
    const isTrackPath =
      pathParts.length >= 2 &&
      pathParts[0].length > 0 &&
      pathParts[1].length > 0 &&
      pathParts[1] !== "sets" &&
      !reservedRoutes.has(pathParts[0].toLowerCase());

    if (!response.ok || !isSoundCloudHost || (!isPlaylistPath && !isTrackPath)) {
      return Response.json(
        { error: "Bağlantı bir SoundCloud parçasına veya playlistine yönlenmedi." },
        { status: 422, headers: corsHeaders },
      );
    }

    resolved.search = "";
    resolved.hash = "";
    return Response.json({
      url: resolved.href,
      type: isPlaylistPath ? "playlist" : "track",
    }, { headers: corsHeaders });
  } catch (_error) {
    return Response.json({ error: "SoundCloud kısa bağlantısı çözümlenemedi." }, { status: 400, headers: corsHeaders });
  }
});
