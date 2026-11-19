# Shopify Demo Portal (NovaStep workshop)

A public, no-login web guide for running the **Shopify demo / workshop session** — build the NovaStep demo store step by step.
Static frontend only: **React 18 + Vite + TypeScript + Tailwind CSS v4**, no database and no backend. It deploys to **Cloudflare Pages**.

Brand-neutral UI with a purple accent (one token block in `src/index.css` re-brands it), a collapsible sidebar, dark mode, and a **Thai / English** switch (Thai by default).

## Features

- Sidebar modules: Create Store → Store Setup → Metafields → Products → Theme (Home / About Us / Contact & Location) → Apps → Inventory → Payments & Test Order → Order Fulfillment → Delete Store
- 34 steps, each with numbered instructions (click to tick while presenting), screenshots with a lightbox, copy buttons, and an **Open Shopify** link with a fallback menu path
- Copy-ready snippets: the Sidekick prompt, metafield names, rich-text content, Contact Us HTML, Store-locator Liquid, and custom CSS
- Theme text specs that show each heading's style, colour swatch and size
- Interactive product cards: clicking a colour swaps the photo; metafield values are in tabs, each with a copy button
- **Mark as complete**, Prev/Next, Continue workshop, and per-module progress, saved in this browser's `localStorage`
- **Resources** page with logo, product and page images to download · **Help & FAQ** page
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
| `src/i18n/th.ts` | Thai translations, keyed by the English source text (dev: `window.__missingTh` lists gaps) |
| `src/data/snippets/*` | Long code snippets, imported with `?raw` |
| `public/guide/*.webp` | Screenshots taken from `Instructions.pdf` (`pPPP_N` = page, image index) |
| `public/resources/**` | Workshop images, web-optimised from the original PNGs |

Block types: `steps`, `images`, `specs`, `code`, `copylist`, `kv`, `richtext`, `note`, `link`, `product` (see `src/data/types.ts`).
A topic can also have `group` (a sidebar sub-heading such as "Home"), `tag` (`workshop` | `production`), and `outcome` (a "You should now see…" checklist).

## Deploy to Cloudflare Pages

**Option A: Git integration (recommended)**

1. Push this folder to a GitHub or GitLab repository.
2. In Cloudflare, go to Workers & Pages → Create → Pages → Connect to Git, then pick the repository.
3. Use these build settings:
   - Framework preset: **Vite** (or None)
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Environment variable: `NODE_VERSION = 20` or newer
4. Every push to the main branch deploys. Other branches get preview URLs.

**Option B: Direct upload with Wrangler**

```bash
npx wrangler login
npm run deploy     # builds, then: wrangler pages deploy dist --project-name shopify-demo-portal
```

`public/_redirects` (`/* /index.html 200`) makes deep links such as `/theme/hero` work when the page is refreshed.

## Notes

- Progress is self-reported and stored per browser. It is not a check of the Shopify store.
- Everything in the bundle is public. Don't put private instructor notes or credentials in `src/data`.
