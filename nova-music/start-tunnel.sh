#!/data/data/com.termux/files/usr/bin/bash

set -a
. "$HOME/.config/nova/tunnel.env"
set +a

LOG="$HOME/nova-tunnel.log"

while true; do
    echo "Cloudflare başlatılıyor..."

    cloudflared tunnel --url http://localhost:4173 --no-autoupdate > "$LOG" 2>&1 &
    PID=$!

    URL=""
    for i in $(seq 1 60); do
        URL=$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' "$LOG" | head -1)
        [ -n "$URL" ] && break
        kill -0 "$PID" 2>/dev/null || break
        sleep 2
    done

    if [ -n "$URL" ]; then
        echo "Yeni adres: $URL"

        curl -fsS -X POST "$SUPABASE_URL/rest/v1/tunnel_status?on_conflict=id" \
          -H "apikey: $SUPABASE_SECRET" \
          -H "Content-Type: application/json" \
          -H "Prefer: resolution=merge-duplicates,return=minimal" \
          --data "{\"id\":1,\"url\":\"$URL\"}" \
          && echo "Adres Supabase'e kaydedildi."
    else
        echo "Tünel adresi alınamadı."
    fi

    wait "$PID"
    echo "Tünel kapandı. 5 saniye sonra yeniden denenecek."
    sleep 5
done
