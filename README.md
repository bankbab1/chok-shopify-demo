# Shopify Demo Portal (NovaStep workshop)

A public, no-login web guide for running the **Shopify demo / workshop session** — build the NovaStep demo store step by step.
Static frontend only: **React 18 + Vite + TypeScript + Tailwind CSS v4**, no database and no backend. It deploys to **Cloudflare Pages**.

Brand-neutral UI with a purple accent (one token block in `src/index.css` re-brands it), a collapsible sidebar, dark mode, and a **Thai / English** switch (Thai by default).

## Features

- Sidebar modules: Create Store → Store Setup → Metafields → Products → Theme (Home / About Us / Contact & Location) → Apps → Inventory → Payments & Test Order → Order Fulfillment → Delete Store
- 35 steps, each with numbered instructions (click to tick while presenting), screenshots with a lightbox, copy buttons, and an **Open Shopify** link with a fallback menu path
- Copy-ready snippets: the Sidekick prompt, metafield names, rich-text content, Contact Us HTML, Store-locator Liquid, and custom CSS
- Theme text specs that show each heading's style, colour swatch and size
- Interactive product cards: clicking a colour swaps the photo; metafield values are in tabs, each with a copy button
- **Mark as complete**, Prev/Next, Continue workshop, and per-module progress, saved in this browser's `localStorage`
- **Presentation**: 19 speaker slides with notes (TH/EN), a timer, a next-slide preview, fullscreen (F), blank screen (B), clicker/keyboard control, and links from each module slide to its hands-on section
- **Example Stores**: Cher Skincare (Headless / Hydrogen) and Tada Parfumeur (pre-launch, with a copy-password button), plus a Theme vs Headless comparison
- **Share this site**: header button → QR code (home or current page), native Share, Copy link, and a full-screen QR for the projector
- **Custom CSS helper**: paste your store's element class (or the whole `class="…"` / HTML tag) and the CSS is rewritten for it before copying
- **Resources** page: per-file download, or ZIP downloads (all, per section, per product) organised in folders · **Help & FAQ** page
- Workshop/Test labels on test-only steps (test payments, test orders)
- Responsive layout with a mobile drawer, dark mode, keyboard focus rings and reduced-motion support

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve dist/ locally
```

## Edit content

All content is data. You don't need to change any components.

| File | What |
|---|---|
| `src/data/guide.ts` | Modules (`SECTIONS`) → steps (`topics`) → content `blocks` |
| `src/data/products.ts` | The four NovaStep products and their metafield values |
| `src/data/resources.ts` | Downloadable assets on the Resources page |
| `src/data/help.ts` | FAQ entries |
| `src/data/slides.ts` | Presentation slide titles, speaker notes and hands-on links (`public/slides/*.webp`) |
| `src/data/examples.ts` | Example stores shown on the Example Stores page |
| `src/i18n/th.ts` | Thai translations, keyed by the English source text (dev: `window.__missingTh` lists gaps) |
| `src/data/snippets/*` | Long code snippets, imported with `?raw` |
| `public/guide/*.webp` | Screenshots taken from `Instructions.pdf` (`pPPP_N` = page, image index) |
| `public/resources/**` | Workshop images, web-optimised from the original PNGs |

Block types: `steps`, `images`, `specs`, `code`, `copylist`, `kv`, `richtext`, `note`, `link`, `product` (see `src/data/types.ts`).
A topic can also have `group` (a sidebar sub-heading such as "Home"), `tag` (`workshop` | `production`), and `outcome` (a "You should now see…" checklist).

## Deploy to Cloudflare (Workers static assets)

The site is deployed as a **Cloudflare Worker with static assets** (`wrangler.toml` → `[assets]`). No Worker code is needed.

**Option A: Git integration (Workers Builds, recommended)**

1. Workers & Pages → Create → Import a repository → pick `bankbab1/chok-shopify-demo`.
2. Build settings (Worker → Settings → Build):
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy`
   - Root directory: `/`
   - Node.js 22 is pinned via `.node-version` (wrangler 4 needs Node >= 22.12)
3. Worker → Settings → Domains & Routes → enable the **workers.dev** URL (or add a custom domain).
4. Every push to `main` builds and deploys.

The Worker name in the dashboard must match `name` in `wrangler.toml` (`chok-shopify-demo`).

**Option B: Deploy from your machine**

```bash
npx wrangler login
npm run deploy     # build, then wrangler deploy
```

`not_found_handling = "single-page-application"` serves `index.html` for unknown paths, so deep links such as `/theme/hero` work when the page is refreshed.

## Notes

- Progress is self-reported and stored per browser. It is not a check of the Shopify store.
- Everything in the bundle is public. Don't put private instructor notes or credentials in `src/data`.
