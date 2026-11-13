// Supabase Edge Function: resolve SoundCloud playlist short links.
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
    const isSoundCloudHost = host === "soundcloud.com" || host.endsWith(".soundcloud.com");
    const isPlaylistPath = pathParts.length >= 3 && pathParts[1] === "sets" && pathParts[2].length > 0;

    if (!response.ok || !isSoundCloudHost || !isPlaylistPath) {
      return Response.json({ error: "Bağlantı bir SoundCloud playlist adresine yönlenmedi." }, { status: 422, headers: corsHeaders });
    }

    resolved.search = "";
    resolved.hash = "";
    return Response.json({ url: resolved.href }, { headers: corsHeaders });
  } catch (_error) {
    return Response.json({ error: "SoundCloud kısa bağlantısı çözümlenemedi." }, { status: 400, headers: corsHeaders });
  }
});
