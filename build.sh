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

# ── Check & Install dependencies ─────────────────────────────────────────────
if ! command -v pandoc &> /dev/null; then
  # If running in Cloudflare Pages (CF_PAGES=1) or if Pandoc is missing, auto-download the static binary
  if [ "${CF_PAGES:-}" = "1" ] || [ "${CI:-}" = "true" ]; then
    log "Pandoc not found. Running in CI/Cloudflare environment. Downloading static binary..."
    mkdir -p bin
    curl -sSL "https://github.com/jgm/pandoc/releases/download/3.10/pandoc-3.10-linux-amd64.tar.gz" | tar -xzf - --strip-components=2 -C bin pandoc-3.10/bin/pandoc
    export PATH="$PWD/bin:$PATH"
  else
    # Fallback to local check in case it's in a local bin/ folder
    if [ -f "bin/pandoc" ]; then
      export PATH="$PWD/bin:$PATH"
    else
      echo "Error: pandoc is not installed."
      echo "Install it: https://pandoc.org/installing.html"
      exit 1
    fi
  fi
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

# ── Generate sitemap.xml and llms.txt metadata ──────────────────────────────
log "Generating sitemap.xml and llms.txt..."
python3 generate_meta.py

# ── Build agent-toolkit ──────────────────────────────────────────────────────
log "Building agent-toolkit..."
export MRPS_BUILD_SH_RUNNING=1
node data/build.mjs

# ── Optional base path (GitHub Pages project sites serve under /<repo>/) ────
if [ -n "${BASE_PATH:-}" ]; then
  log "Applying base path: $BASE_PATH"
  BASE_PATH="$BASE_PATH" python3 - "$OUTPUT_DIR" <<'PY'
import os, re, sys, pathlib
base = os.environ['BASE_PATH'].rstrip('/')
root = pathlib.Path(sys.argv[1])
html_re = re.compile(r'((?:href|src)=")/(?!/)')
css_re = re.compile(r"url\('/")
changed = 0
for p in root.rglob('*'):
    if not p.is_file():
        continue
    if p.suffix == '.html':
        s = p.read_text(encoding='utf-8')
        t = html_re.sub(lambda m: m.group(1) + base + '/', s)
    elif p.suffix == '.css':
        s = p.read_text(encoding='utf-8')
        t = css_re.sub("url('" + base + "/", s)
    else:
        continue
    if t != s:
        p.write_text(t, encoding='utf-8')
        changed += 1
print(f"  rewrote {changed} files with base '{base}'")
PY
fi

# ── Done ─────────────────────────────────────────────────────────────────────
log "Done. Built $COUNT pages → $OUTPUT_DIR/"
