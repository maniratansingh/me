#!/usr/bin/env bash
# =============================================================================
# build.sh — mrps.in static site builder
# =============================================================================
# Converts all content/*.md files into site/*.html using pandoc.
# Run locally:   ./build.sh
# Cloudflare Pages build command:  bash build.sh
# Cloudflare Pages output dir:     site
#
# Dependencies: pandoc (https://pandoc.org/installing.html)
# =============================================================================

set -euo pipefail

CONTENT_DIR="content"
TEMPLATE_DIR="templates"
STATIC_DIR="static"
OUTPUT_DIR="site"

# ── Colours for terminal output ──────────────────────────────────────────────
GREEN='\033[0;32m'
DIM='\033[2m'
RESET='\033[0m'

log()  { echo -e "${GREEN}▸${RESET} $*"; }
dim()  { echo -e "${DIM}  $*${RESET}"; }

# ── Check dependencies ────────────────────────────────────────────────────────
if ! command -v pandoc &> /dev/null; then
  echo "Error: pandoc is not installed."
  echo "Install it: https://pandoc.org/installing.html"
  exit 1
fi

# ── Clean + recreate output directory ────────────────────────────────────────
log "Cleaning output directory..."
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"

# ── Copy static assets ───────────────────────────────────────────────────────
log "Copying static assets..."
cp -r "$STATIC_DIR"/. "$OUTPUT_DIR/"

# ── Copy Cloudflare config files ─────────────────────────────────────────────
[ -f "_headers" ]   && cp "_headers"   "$OUTPUT_DIR/_headers"
[ -f "_redirects" ] && cp "_redirects" "$OUTPUT_DIR/_redirects"

# ── Build all Markdown files ─────────────────────────────────────────────────
log "Building pages..."
COUNT=0

while IFS= read -r -d '' md_file; do
  # Derive output path:
  # content/blog/my-post.md → site/blog/my-post/index.html
  # content/index.md        → site/index.html  (special case)

  rel_path="${md_file#$CONTENT_DIR/}"      # blog/my-post.md
  base="${rel_path%.md}"                   # blog/my-post
  filename="$(basename "$base")"           # my-post

  if [ "$filename" = "index" ]; then
    # content/blog/index.md → site/blog/index.html
    out_dir="$OUTPUT_DIR/$(dirname "$rel_path")"
    out_file="$out_dir/index.html"
  else
    # content/blog/my-post.md → site/blog/my-post/index.html  (clean URLs)
    out_dir="$OUTPUT_DIR/$base"
    out_file="$out_dir/index.html"
  fi

  mkdir -p "$out_dir"

  # Choose template: homepage uses index.html template, everything else base.html
  if [ "$rel_path" = "index.md" ]; then
    template="$TEMPLATE_DIR/index.html"
  else
    template="$TEMPLATE_DIR/base.html"
  fi

  pandoc \
    --from markdown+yaml_metadata_block+smart \
    --to html5 \
    --template="$template" \
    --syntax-highlighting=espresso \
    --output="$out_file" \
    "$md_file"

  dim "$rel_path → ${out_file#$OUTPUT_DIR/}"
  COUNT=$((COUNT + 1))

done < <(find "$CONTENT_DIR" -name "*.md" -print0 | sort -z)

# ── Done ─────────────────────────────────────────────────────────────────────
log "Done. Built $COUNT pages → $OUTPUT_DIR/"
