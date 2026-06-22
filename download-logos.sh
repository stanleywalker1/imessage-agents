#!/bin/bash
set -u
cd "$(dirname "$0")"
mkdir -p assets/logos
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'

# slug|ext|url  (verified URLs from the logo-fetch agent team)
entries=(
"poke|ico|https://poke.com/favicon.ico"
"lindy|png|https://cdn.prod.website-files.com/63e15df811f9df22b231e58f/69f7b166e16ce668638e689d_lindy-avatar-favicon.png"
"caddy|png|https://caddy.app/caddy-avatar.png"
"orchid|png|https://orchid.ai/branded/orchid-icon-3d.png"
"tomo|ico|https://tomo.ai/icon.ico"
"martin|png|https://framerusercontent.com/images/CZTxbId2DTeb79XBU7xTouzDO9w.png"
"sidekicks|ico|https://sidekicks.chat/favicon.ico"
"ichatwithgpt|ico|https://ichatwithgpt.com/favicon.ico"
"soar|png|https://joinsoar.co/apple-touch-icon.png"
"miso|png|https://framerusercontent.com/images/bXsCeGNRH894xL3YTwDJu6eZWg.png"
"ditto|ico|https://ditto.ai/favicon.ico?favicon.00pmr11ot84-s.ico"
"series|ico|https://series.so/favicon.ico"
"alfi|png|https://framerusercontent.com/images/k7n0BuFXIftA6wcsFRaPFgAenQ.png"
"flip|ico|https://fliptexts.com/favicon.ico?840d3df35a16ed59"
"bodybuddy|png|https://bodybuddy.app/icon-512.png"
"nudge|png|https://www.nudge.gs/favicon.png"
"clera|png|https://www.getclera.com/images/apple-touch-icon.png"
"linq|png|https://skywalker-next.linqapp.com/apple-touch-icon.png?v=3"
"photon|png|https://framerusercontent.com/images/USAoq7kC2cVRVRlromUpxkzPw.png"
"sendblue|png|https://cdn.prod.website-files.com/66030329237827b3a2dcee75/660554034c74774c9551a038_favicon-256px.png"
"loopmessage|png|https://loopmessage.com/favicon.png"
"blooio|png|https://blooio.com/web-app-manifest-512x512.png"
"chert|png|https://trychert.com/chert.png"
"tuco|png|https://tuco.ai/icon-512x512.png"
"agentmessage|png|https://agentmessage.io/favicon/android-chrome-512x512.png"
"bluebubbles|png|https://bluebubbles.app/assets/icons/apple-touch-icon.png"
"apple|png|https://www.apple.com/apple-touch-icon.png"
)

for e in "${entries[@]}"; do
  IFS='|' read -r slug ext url <<< "$e"
  out="assets/logos/$slug.$ext"
  curl -sL --max-time 30 -A "$UA" "$url" -o "$out"
  [ -s "$out" ] || echo "FAIL download: $slug"
done

# Convert any .ico to .png so the grid renders crisply
for f in assets/logos/*.ico; do
  [ -e "$f" ] || continue
  base="${f%.ico}"
  if sips -s format png "$f" --out "$base.png" >/dev/null 2>&1; then rm -f "$f"; fi
done

# Try to upgrade low-res favicons to clean brand logos via Clearbit (keep only if clearly better)
upgrades=(
"poke|poke.com"
"tomo|tomo.ai"
"sidekicks|sidekicks.chat"
"ichatwithgpt|ichatwithgpt.com"
"ditto|ditto.ai"
"series|series.so"
"flip|fliptexts.com"
)
for u in "${upgrades[@]}"; do
  IFS='|' read -r slug d <<< "$u"
  tmp="/tmp/cb_$slug.png"
  curl -sL --max-time 20 -A "$UA" "https://logo.clearbit.com/$d?size=256&format=png" -o "$tmp" 2>/dev/null
  if [ -s "$tmp" ]; then
    w=$(sips -g pixelWidth "$tmp" 2>/dev/null | awk '/pixelWidth/{print $2}')
    sz=$(stat -f%z "$tmp" 2>/dev/null)
    if [ "${w:-0}" -ge 128 ] 2>/dev/null && [ "${sz:-0}" -ge 2000 ] 2>/dev/null; then
      rm -f assets/logos/$slug.*
      cp "$tmp" "assets/logos/$slug.png"
      echo "clearbit upgrade: $slug (${w}px)"
    fi
  fi
  rm -f "$tmp"
done

echo "--- final logo widths ---"
for f in assets/logos/*; do
  w=$(sips -g pixelWidth "$f" 2>/dev/null | awk '/pixelWidth/{print $2}')
  printf '%-16s %spx\n' "$(basename "$f")" "${w:-?}"
done
