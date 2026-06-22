# iMessage Agents

A minimal, Apple-style overview of the AI agents you can text, and the
infrastructure behind them. Two tabs: **Agents** (grouped by vertical) and
**Infrastructure**. White background, black text, real logos, responsive,
read-only, no tracking, no backend.

Live: https://stanleywalker1.github.io/imessage-agents/

## Structure

- `index.html` — the generated, self-contained site (open it directly or serve the folder).
- `assets/logos/` — locally hosted app-icon logos, one per company.
- `generate.js` — the source of truth. Holds the company list (slug, name, tagline,
  url, vertical) and renders `index.html`. Run `node generate.js` to rebuild.
- `download-logos.sh` — fetches/refreshes the logos into `assets/logos/`.

## Update the content

1. Edit the `AGENTS` / `INFRA` arrays in `generate.js`.
2. If you added a company, add its logo: append it to `download-logos.sh` and run
   `bash download-logos.sh` (or drop a square PNG at `assets/logos/<slug>.png`).
3. `node generate.js` to rebuild `index.html`.

## Run locally

```sh
open index.html          # or:
python3 -m http.server 8000   # then visit http://localhost:8000
```

Snapshot of public information as of June 2026.
