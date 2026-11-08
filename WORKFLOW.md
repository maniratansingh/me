# Branch workflow

Four branches, one direction. Changes move **up**, never sideways.

```
local ──► experimental ──► testing ──► main
          (preview)        (staging)    (production)
```

| Branch | Role | Deploys to | May be broken? |
|---|---|---|---|
| `local-*` | Where work happens | nothing | yes |
| `experimental` | Visual / functional preview | **GitHub Pages** | yes |
| `testing` | Semi-final. Must build and pass the Cloudflare gate | Cloudflare preview (when enabled) | **no** |
| `main` | Release. The only branch Cloudflare builds for production | **`mrps.in`** | **no** |

## The rule

1. `git switch -c local/<topic> origin/testing`
2. Make the change. Build locally: `bash build.sh`
3. Push the branch, open a PR to **`experimental`**, merge.
   → GitHub Pages deploys it to `https://maniratansingh.github.io/me/`
4. Look at it. If it is wrong, fix on the local branch and repeat. Never fix on `testing`.
5. Merge `experimental` → **`testing`**.
   → `Validate build` runs: `build.sh` + `wrangler deploy --dry-run` + output assertions.
   → If it fails, `testing` is not ready. Do not continue.
6. Merge `testing` → **`main`**.
   → Cloudflare builds and publishes production.

## Non-negotiables

- **Never commit directly to `testing` or `main`.** They only receive merges.
- **Never merge to `testing` before `experimental` has been looked at.**
- **Never merge to `main` while `Validate build` is red.**
- **Never force-push `testing` or `main`.** History there is release history.
- `main` must always be a state you are willing to publish.

## Cloudflare

Cloudflare's production branch must be **`main`**.

Verify in: Cloudflare dashboard → Workers & Pages → project **`me`** → Settings →
Build → *Production branch*.

If it says `testing`, every push to `testing` publishes to production. That is a
misconfiguration, not a workflow.

## GitHub Pages

`Pages (experimental)` deploys **only** `experimental`. It is a preview surface.

```bash
gh workflow disable "Pages (experimental)"   # turn preview off
gh workflow enable  "Pages (experimental)"   # turn preview on
```

It rewrites root-absolute paths to `/me/` at build time (`BASE_PATH=/me`) because
project Pages are served from a subpath. Production (`mrps.in`) builds with no
`BASE_PATH`, so its paths stay at `/`.

## Commands

```bash
# start work
git fetch origin
git switch -c local/my-change origin/testing

# build locally
bash build.sh && python3 -m http.server 8081 --directory site

# promote
git switch experimental && git merge --ff-only local/my-change && git push
git switch testing      && git merge --ff-only experimental     && git push
git switch main         && git merge --ff-only testing          && git push
```

Prefer `--ff-only`. If it refuses, history diverged — stop and inspect, do not force.
