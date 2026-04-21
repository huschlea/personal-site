#!/usr/bin/env bash
# Converts a dream PNG to AVIF + WebP at 800/1600/2400 widths.
# Requires: sips (built-in on macOS), cwebp, avifenc (brew install webp libavif)
# Usage: scripts/optimize-dream.sh path/to/new-dream.png
#
# Output goes to optimized/{basename}-{800,1600,2400}.{avif,webp}.
# After running, add a <picture> block to index.html:
#   <picture>
#     <source type="image/avif" srcset="optimized/{name}-800.avif 800w, optimized/{name}-1600.avif 1600w, optimized/{name}-2400.avif 2400w" sizes="(max-width: 768px) 100vw, 700px">
#     <source type="image/webp" srcset="optimized/{name}-800.webp 800w, optimized/{name}-1600.webp 1600w, optimized/{name}-2400.webp 2400w" sizes="(max-width: 768px) 100vw, 700px">
#     <img src="{name}.png" alt="dream sketch" width="{W}" height="{H}" loading="lazy" decoding="async" style="width:100%;height:auto;display:block;"/>
#   </picture>

set -euo pipefail

if [ $# -ne 1 ]; then
  echo "usage: $0 path/to/dream.png" >&2
  exit 1
fi

src="$1"
if [ ! -f "$src" ]; then
  echo "not found: $src" >&2
  exit 1
fi

name="$(basename "$src" .png)"
root="$(cd "$(dirname "$0")/.." && pwd)"
out="$root/optimized"
mkdir -p "$out"

# Skip the 2400w variant if the source is narrower than that.
src_w=$(sips -g pixelWidth "$src" | awk '/pixelWidth/ {print $2}')
widths=(800 1600 2400)
final_widths=()
for w in "${widths[@]}"; do
  if [ "$w" -lt "$src_w" ]; then
    final_widths+=("$w")
  fi
done
final_widths+=("$src_w")  # always include original resolution

echo "source: $src (${src_w}w) → ${final_widths[*]}"

for w in "${final_widths[@]}"; do
  if [ "$w" -eq "$src_w" ]; then
    input="$src"
  else
    input="/tmp/${name}-${w}.png"
    sips --resampleWidth "$w" "$src" --out "$input" >/dev/null
  fi
  cwebp -quiet -q 85 "$input" -o "$out/${name}-${w}.webp"
  avifenc -q 75 --min 20 --max 35 -s 6 "$input" "$out/${name}-${w}.avif" >/dev/null 2>&1
  echo "  wrote ${name}-${w}.{avif,webp}"
done

echo "done."
