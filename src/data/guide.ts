import {
  UserPlus,
  Store,
  Settings2,
  Database,
  Package,
  Palette,
  Blocks,
  Boxes,
  CreditCard,
  Truck,
  Trash2,
} from 'lucide-react';
import type { GuideImage, Section, Topic } from './types';
import { PRODUCTS } from './products';
import contactHtml from './snippets/contact-us.html?raw';
import storeLocatorLiquid from './snippets/store-locator.liquid?raw';

const img = (id: string, caption?: string): GuideImage => ({ id, caption });

// Types taken from the definition screenshots in the workshop PDF (pages 14–20).
const PRODUCT_METAFIELDS: { key: string; page: string; type: string }[] = [
  { key: 'story', page: 'p014_1', type: 'Rich text' },
  { key: 'gender', page: 'p015_0', type: 'List · Single line text (Male / Female / Unisex)' },
  { key: 'care_instructions', page: 'p016_0', type: 'Rich text' },
  { key: 'weight', page: 'p017_0', type: 'Single line text' },
  { key: 'materials', page: 'p018_0', type: 'Rich text' },
  { key: 'features', page: 'p019_0', type: 'Rich text' },
  { key: 'full_product_description', page: 'p020_0', type: 'Multi-line text' },
];

const PAGE_TEXT_METAFIELDS = [
  'about_us_Brand History',
  'about_us_The Founder',
  'about_us_Our Innovation',
  'about_us_Our Mission',
  'about_us_Our Vision',
  'about_us_Our Core Values',
  'about_us_What We Make',
  'about_us_Why Choose NovaStep',
];

const PAGE_IMAGE_METAFIELDS = [
  'about_us_hero_img',
  'about_us_our_story_img',
  'about_us_brand_history_img',
  'about_us_the_founder_img',
  'about_us_innovation_img',
  'about_us_our_vision_img',
  'about_us_our_mission_img',
  'about_us_our_core_values_img',
];

const SIDEKICK_PRODUCT_MF_PROMPT = `Please create the following 7 **Product Metafield Definitions** in Shopify.

**Resource:** Products
**Namespace:** custom

Create each definition with the exact name, key and type below:

1. \`story\` — key \`custom.story\` — **Rich text** (one value)
2. \`gender\` — key \`custom.gender\` — **Single line text, list of values**, restricted to a choice list of exactly: Male, Female, Unisex
3. \`care_instructions\` — key \`custom.care_instructions\` — **Rich text** (one value)
4. \`weight\` — key \`custom.weight\` — **Single line text** (one value)
5. \`materials\` — key \`custom.materials\` — **Rich text** (one value)
6. \`features\` — key \`custom.features\` — **Rich text** (one value)
7. \`full_product_description\` — key \`custom.full_product_description\` — **Multi-line text** (one value)

**Requirements:**
- Create all 7 definitions under Settings → Metafields and metaobjects → Products.
- Use the names and keys exactly as provided (lowercase, namespace \`custom\`).
- Turn on **Storefront API access** for every definition.
- Pin each definition so it appears on the product page in Admin.
- Do not create Page metafields, Variant metafields or Metaobjects.
- Do not fill in any values yet.
- If you cannot create these definitions directly, explain which steps require manual action.

After completion, confirm which definitions were created and list each final namespace, key and type.`;

const SIDEKICK_PROMPT = `Please create the following 8 **Page Metafield Definitions** in Shopify.

**Resource:** Pages
**Content type:** Rich text
**Namespace:** custom

Create each metafield with the exact name specified below:

${PAGE_TEXT_METAFIELDS.map((n, i) => `${i + 1}. \`${n}\``).join('\n')}

**Requirements:**
- Create all 8 definitions under Settings → Custom data → Pages.
- Set the type of every metafield to **Rich text**.
- Use the names exactly as provided.
- Generate a unique namespace and key for each definition under \`custom\`.
- Do not create Product Metafields or Metaobjects.
- Do not populate any content yet.
- If you cannot create these definitions directly, explain which steps require manual action.

After completion, confirm which definitions were successfully created.`;

const SIDEKICK_IMAGE_PROMPT = `Please create the following 8 **Page Metafield Definitions** in Shopify for About Us images.

**Resource:** Pages
**Content type:** File (Images only)
**Namespace:** custom

Create each metafield with the exact name specified below:

${PAGE_IMAGE_METAFIELDS.map((n, i) => `${i + 1}. \`${n}\``).join('\n')}

**Requirements:**
- Create all 8 definitions under Settings → Custom data → Pages.
- Set the type of every metafield to **File** and restrict accepted file types to **Images** only.
- Use **one value** (a single image), not a list of files.
- Use the names exactly as provided; use the same lowercase name as the key under \`custom\` (e.g. \`custom.about_us_hero_img\`).
- Do not create Product Metafields or Metaobjects.
- Do not upload or attach any images yet.
- If you cannot create these definitions directly, explain which steps require manual action.

After completion, confirm which definitions were successfully created and list each final namespace and key.`;

// `{{selector}}` is replaced with the participant's own button class (see SelectorSpec).
// `{{origin}}` becomes the live site's address, so Sidekick can fetch the logo files by link.
const SIDEKICK_LOGO_PROMPT = `Please update the logo in my published theme (Horizon) from the public image links below.

**Where:** Online Store → Themes → Customize → Theme settings → Logo and favicon

1. **Default logo** — fetch this image and use it:
   {{origin}}/resources/brand-logo/mockup-logo-ns.png
2. **Inverse logo** (used when the header is transparent) — fetch this image and use it:
   {{origin}}/resources/brand-logo/mockup-logo-ns-i.png
3. **Desktop logo height:** 36 px
4. **Mobile logo height:** 28 px

**Note:** the inverse logo only appears where the header is transparent. That is switched on in the Header section (Home page → Transparent background + Inverse logo), which I will set separately — do not change the Header here.

**Requirements:**
- Fetch each link and upload the image to Files first if needed, then select it in the theme setting.
- Change only these logo settings. Do not change colors, fonts, sections or any other theme setting, and do not publish a different theme.
- If you cannot edit theme settings directly, still upload both images to Files and tell me exactly which steps I need to do in the theme editor.

Then show me a summary of what you changed or prepared so I can review it.`;

// Values from the Header settings screenshots in the workshop PDF (pages 50–51): transparent header with the
// inverse logo and white header text on the Home page only; Product and Collection pages stay solid.
const SIDEKICK_HEADER_PROMPT = `Please update the **Header** section of my published theme (Horizon).

**Where:** Online Store → Themes → Customize → Header

**Logo**
- Position: Center

**Menu**
- Position: Left
- Row: Top

**Search**
- Search icon: On
- Position: Right
- Row: Top

**Localization**
- Country/Region: On
- Flag: Off
- Language selector: On

**Home page**
- Transparent background: On
- Inverse logo: On
- Transparent header text: Palette color #FFFFFF (white)

**Product page**
- Transparent background: Off

**Collection page**
- Transparent background: Off

Only the Home page gets the transparent header: on the Home page, Transparent background and Inverse logo must both be On and "Transparent header text" must be the palette color #FFFFFF (pick white from the color palette, or enter FFFFFF). On the Product and Collection pages, Transparent background must be Off.

**Requirements:**
- Change only the Header settings listed above. Do not change the logo images, the theme's color schemes, fonts or any other section, and do not publish a different theme.
- If a setting has a different name in this theme version, use the closest match and tell me which one you used.
- If you cannot edit theme settings directly, tell me exactly which steps I need to do in the theme editor.

Then show me a summary of what you changed so I can review and click Save.`;

// Values from the Typography screenshots in the workshop PDF (pages 52–53).
const SIDEKICK_TYPOGRAPHY_PROMPT = `Please update the **Typography** theme settings of my published theme (Horizon).

**Where:** Online Store → Themes → Customize → Theme settings → Typography

**Colors**
- Text: Palette color (black)

**Fonts**
- Body: Inter
- Subheading: Inter
- Heading: Inter
- Accent: Inter

**Paragraph**
- Size: 14px
- Line height: Loose

**Headings** (Font · Size · Line height · Letter spacing · Case)
- Heading 1: Heading · 56px · Tight · Normal · Default
- Heading 2: Heading · 40px · Normal · Normal · Default
- Heading 3: Heading · 32px · Normal · Normal · Default
- Heading 4: Heading · 24px · Tight · Normal · Default
- Heading 5: Subheading · 14px · Loose · Normal · Default
- Heading 6: Subheading · 12px · Loose · Normal · Default

**Requirements:**
- Change only the Typography settings listed above. Do not change the logo, header, color schemes, sections or any other setting, and do not publish a different theme.
- If a setting is already at the value listed, leave it as is.
- If a setting has a different name in this theme version, use the closest match and tell me which one you used.
- If you cannot edit theme settings directly, tell me exactly which steps I need to do in the theme editor.

Then show me a summary of what you changed so I can review and click Save.`;

// Hero and Featured Collection, from the workshop PDF (pages 54–56). `{{origin}}` = this site, so the image is fetched by link.
const SIDEKICK_HERO_PROMPT = `Please set up the **Hero** section on the Home page of my published theme (Horizon).

**Where:** Online Store → Themes → Customize → Home page → Hero

**Background image** — fetch this image and use it:
{{origin}}/resources/home/home-hero-img.jpg

**Layout:** content aligned to the bottom left ("Bottom align").

**Text, in this order:**
1. Heading — "EVERY STEP" — style Heading 1 — color #EEEEEE
2. Heading — "FORWARD" — style Heading 1 — color #BEA77E
3. Text — "Footwear designed for every parts of your life." — custom size 20px — color #EEEEEE

**Requirements:**
- Fetch the image link and upload it to Files first if needed, then select it as the Hero background.
- Use the text exactly as written, including capital letters.
- Remove any other default text or button blocks inside this Hero section.
- Change only this Hero section. Do not change the header, other sections or theme settings, and do not publish a different theme.
- If you cannot edit the section directly, upload the image to Files and tell me exactly which steps I need to do in the theme editor.

Then show me a summary of what you changed so I can review and click Save.`;

const SIDEKICK_FEATURED_COLLECTION_PROMPT = `Please set up the **Featured collection** section on the Home page of my published theme (Horizon), right below the Hero.

**Where:** Online Store → Themes → Customize → Home page → Featured collection

**Heading:** "ALL PRODUCTS" — style Heading 2 — color #545454

**Collection:** "First Launch Collection" (it contains all four NovaStep products: AeroRun, Elite Classic, Cloud Slide and Titan Pro)

**Layout:** 3 products per row on desktop, showing all 4 products.

**Requirements:**
- If "First Launch Collection" doesn't exist yet, tell me — it's created in the Products → Create Collection step. Do not create a different collection.
- Use the heading text exactly as written.
- Change only this Featured collection section. Do not change the header, the Hero, other sections or theme settings, and do not publish a different theme.
- If you cannot edit the section directly, tell me exactly which steps I need to do in the theme editor.

Then show me a summary of what you changed so I can review and click Save.`;

// Image with Text, from the workshop PDF (pages 57–58).
const SIDEKICK_IMAGE_WITH_TEXT_PROMPT = `Please set up the **Image with text** section on the Home page of my published theme (Horizon), below the Featured collection.

**Where:** Online Store → Themes → Customize → Home page → Image with text

**Image block (left side)** — in this section's **Image** block:
- **Image:** select this image for me (fetch it from the link and use it): {{origin}}/resources/home/home-alt-img.jpg
- **Aspect ratio:** Square

**Layout:** image on the left, text on the right.

**Text on the right, in this order:**
1. Heading — "BUILDING A BETTER TOMORROW" — style Heading 2 — color #545454
2. Heading — "ONE STEP AT A TIME" — style Heading 3 — color #BEA77E
3. Text — "At NovaStep, our goal is simple: create footwear that empowers people to move forward with confidence." — custom size 16px — color #545454
4. Button — "DISCOVER NOVA GOAL" — background #BEA77E, border #BEA77E, text color #FFFFFF

**Requirements:**
- The Image block must show this photo, not the placeholder. Upload the image to Files first if needed, then select it in the Image block's Image setting.
- Use the text exactly as written, including capital letters. Each of the two headings is its own Heading block.
- If the button needs a link, use the About us page if it exists; otherwise leave the link empty.
- Remove any other default text or button blocks inside this section.
- Change only this Image with text section. Do not change the header, the Hero, other sections or theme settings, and do not publish a different theme.
- If you cannot edit the section directly, upload the image to Files and tell me exactly which steps I need to do in the theme editor.

Then show me a summary of what you changed so I can review and click Save.`;

const IMAGE_WITH_TEXT_CSS = `{{selector}} {
  border-radius: 0;
}
{{selector}}:hover {
  color: #ffffff !important;
}`;

const STORE_LOCATION_PAGE_CSS = `.store-locator-map-section {
  width: 100vw;
  max-width: 100vw;
  margin-left: calc(50% - 50vw);
}`;

const ABOUT_US_PAGE_CONTENT = `NovaStep was founded in 2018 with a simple belief:

Everyone deserves footwear that combines comfort, quality, and modern design without paying luxury prices.

From daily commuting and weekend adventures to demanding work environments, people spend thousands of hours on their feet every year. We believe every step should feel comfortable, protected, and confident.

Today, NovaStep develops footwear across multiple categories—from everyday sneakers and casual slip-ons to professional safety shoes—designed for people who never stop moving.`;

const ABOUT_US_RICHTEXT: { title: string; body: string }[] = [
  {
    title: 'about_us_Brand History',
    body: `The NovaStep journey began with a small team of footwear designers and product engineers who shared a common frustration.

Many shoes looked great but lacked comfort. Others were comfortable but lacked style. Industrial safety footwear often prioritized protection while sacrificing all-day wearability.

The team spent nearly two years researching materials, testing cushioning technologies, and refining ergonomic designs before releasing the first NovaStep collection.

Since then, the brand has continued expanding into lifestyle, sports, and industrial footwear while staying true to one mission:

Better steps. Better every day.`,
  },
  {
    title: 'about_us_The Founder',
    body: `Ethan Novak
Founder & Product Designer

Growing up in a family involved in footwear manufacturing, Ethan developed a fascination with how small design changes could dramatically improve comfort.

After working with several global footwear suppliers across Asia and Europe, he recognized a gap in the market: consumers wanted premium-quality shoes with practical performance at an affordable price.

In 2018, he established NovaStep to bridge that gap, bringing together experienced footwear engineers, industrial designers, and material specialists to create products built for real life.

Today, Ethan continues leading product innovation with one guiding principle:

Comfort should never be a luxury.`,
  },
  {
    title: 'about_us_Our Innovation',
    body: `At NovaStep, innovation isn't about adding unnecessary features—it's about improving every step.

Our development process focuses on four core pillars:

Comfort Engineering
Lightweight cushioning and ergonomic foot support.

Material Innovation
Breathable fabrics, durable synthetic leather, premium foam, and sustainable materials.

Everyday Performance
Footwear designed to adapt to work, travel, fitness, and daily life.

Reliable Protection
For industrial footwear, safety standards are combined with athletic comfort to reduce fatigue during long working hours.`,
  },
  {
    title: 'about_us_Our Mission',
    body: 'To create reliable footwear that helps people move comfortably, confidently, and safely through every part of life.',
  },
  {
    title: 'about_us_Our Vision',
    body: "To become one of the world's most trusted footwear brands by delivering innovative products that combine comfort, quality, durability, and accessible pricing.",
  },
  {
    title: 'about_us_Our Core Values',
    body: `Comfort First
Every design begins with the wearer's experience.

Quality Without Compromise
We believe great craftsmanship should be available to everyone.

Innovation With Purpose
Every feature should solve a real problem.

Built to Last
Durability is essential in every product we create.

Customer Driven
We continuously improve based on feedback from real users.`,
  },
  {
    title: 'about_us_What We Make',
    body: `NovaStep offers footwear across multiple categories:

● Running Shoes
● Lifestyle Sneakers
● Casual Slip-ons
● Sandals & Slides
● Walking Shoes
● Outdoor Footwear
● Safety Shoes
● Work Boots`,
  },
  {
    title: 'about_us_Why Choose NovaStep',
    body: `● Modern minimalist design
● Lightweight construction
● Premium comfort
● Durable materials
● Excellent value
● Reliable everyday performance
● Wide range of styles and colors
● Suitable for work, travel, and daily wear`,
  },
];

/**
 * Converts card copy to a Shopify rich text metafield value (JSON), with the same formatting the cards show
 * (FormattedBody): "● " lines become a bulleted list, and a short title line with one line under it becomes a
 * bold paragraph followed by its description paragraph.
 */
type RtNode = { type: string; [k: string]: unknown };
const rtText = (value: string, bold?: boolean): RtNode => (bold ? { type: 'text', value, bold: true } : { type: 'text', value });
const rtPara = (...children: RtNode[]): RtNode => ({ type: 'paragraph', children });
function richTextJson(body: string): string {
  const children: RtNode[] = [];
  for (const p of body.split(/\n\n+/)) {
    const lines = p.split('\n');
    if (lines.every((l) => /^[●•] /.test(l))) {
      children.push({
        type: 'list',
        listType: 'unordered',
        children: lines.map((l) => ({ type: 'list-item', children: [rtText(l.slice(2))] })),
      });
    } else if (lines.length === 2 && lines[0].length < 40) {
      children.push(rtPara(rtText(lines[0], true)), rtPara(rtText(lines[1])));
    } else {
      for (const l of lines) children.push(rtPara(rtText(l)));
    }
  }
  return JSON.stringify({ type: 'root', children });
}

/** Fills the 8 About us page text metafields in one go (like the product prompts), as exact rich text JSON. */
const SIDEKICK_ABOUT_CONTENT_PROMPT = `Please fill the **page metafields** of my **About us** page in Shopify.

**Where:** Online Store → Pages → About us → Metafields

**Metafield definitions:** Pages · namespace \`custom\` · type **Rich text**. They already exist with exactly these names — match each one by its name.

Each value below is the exact **rich text metafield value (JSON)** to save. It already contains the formatting: \`"bold": true\` = bold text, \`"list"\` = bulleted list (one list item per row), each \`"paragraph"\` = its own line.

${ABOUT_US_RICHTEXT.map(
  (r, i) => `**${i + 1}. ${r.title}**
\`\`\`json
${richTextJson(r.body)}
\`\`\``,
).join('\n\n')}

**Requirements:**
- Save each JSON value exactly as given into the metafield with the same name — same words, capital letters and punctuation. Do not rewrite, shorten or merge them.
- Keep the formatting: bold stays bold, list items stay separate bulleted rows. Do not type "**", "•" or "●" characters into the text.
- Fill only the page called "About us" (the one using the about-us-mod template).
- Fill the metafields only if their definitions already exist under Settings → Metafields and metaobjects → Pages. Do not create new metafield definitions or metaobjects.
- Do not change the page title, the page content, the template, the image metafields or any other page.
- If you cannot complete any part, tell me which metafields need manual action.

After completion, list the 8 metafields with ✅ filled / ❌ not filled so I can check the About us page in Admin.`;

/** Creates the two remaining pages before the Main menu links to them. */
const SIDEKICK_CREATE_PAGES_PROMPT = `Please create these 2 **pages** in my Shopify store.

**Where:** Online Store → Pages → Add page

**1. Store Location**
- Title: Store Location
- Content: leave empty (the store locator is added later with theme sections)
- Visibility: Visible

**2. Contact**
- Title: Contact
- Content: paste this HTML exactly into the page content (HTML / code view, not as plain text):

\`\`\`html
${contactHtml.trim()}
\`\`\`

- Visibility: Visible

**Requirements:**
- Use the titles exactly as written (the handles become \`store-location\` and \`contact\`).
- If a page with the same title already exists, update it instead of creating a duplicate.
- Keep the default page template for now — I'll assign the theme templates later.
- Do not change the About us page or any other page, and do not change the theme or the navigation menus.
- If you cannot complete any part, tell me which steps need manual action.

After completion, list the pages with their title, handle and visibility.`;

/** Hero at the top of the contact page template, same style as the Home page Hero. */
const SIDEKICK_CONTACT_HERO_PROMPT = `Please set up the **Hero** section on the **contact** page template of my published theme (Horizon).

**Where:** Online Store → Themes → Customize → Pages → contact → **Hero: Bottom aligned** (I already added this section at the top of the template, above the Custom section, and saved it — edit that existing Hero, do not add a new one)

**Background image** — fetch this image and use it (Media 1 → Image):
{{origin}}/resources/contactus/contact-us-hero-img.jpg

**Layout:** content aligned to the bottom left ("Bottom align").

**Text, in this order:**
1. Text block — "CONTACT US" — preset Heading 1 — width Fill — alignment Left — text color #EEEEEE

**Requirements:**
- Fetch the image link and upload it to Files first if needed, then select it as the Hero background (Media 1). Leave Media 2 empty.
- Replace the default preset text: delete the "Introducing", "New arrivals" and paragraph blocks (and any button), so the Hero has only the one "CONTACT US" Text block.
- Use the text exactly as written, including capital letters.
- Change only this Hero section. Do not change the Custom section with the page content, the header, other templates or theme settings, and do not publish a different theme.
- If you cannot edit the section directly, upload the image to Files and tell me exactly which steps I need to do in the theme editor.

Then show me a summary of what you changed so I can review and click Save.`;

/** Hero at the top of the Store Location page template — same flow as the Contact Us Hero. */
const SIDEKICK_STORE_LOCATION_HERO_PROMPT = `Please set up the **Hero** section on the **Store Location** page template of my published theme (Horizon).

**Where:** Online Store → Themes → Customize → Pages → the template used by the Store Location page → **Hero: Bottom aligned** (I already added this section at the top of the template and saved it — edit that existing Hero, do not add a new one)

**Background image** — fetch this image and use it (Media 1 → Image):
{{origin}}/resources/storelocation/store-location-hero-img.jpg

**Layout:** content aligned to the bottom left ("Bottom align").

**Text, in this order:**
1. Text block — "STORE LOCATION" — preset Heading 1 — width Fill — alignment Left — text color #EEEEEE

**Requirements:**
- Fetch the image link and upload it to Files first if needed, then select it as the Hero background (Media 1). Leave Media 2 empty.
- Replace the default preset text: delete the "Introducing", "New arrivals" and paragraph blocks (and any button), so the Hero has only the one "STORE LOCATION" Text block.
- Use the text exactly as written, including capital letters.
- Change only this Hero section. Do not change the Custom Liquid store locator, the page Custom CSS, the header, other templates or theme settings, and do not publish a different theme.
- If you cannot edit the section directly, upload the image to Files and tell me exactly which steps I need to do in the theme editor.

Then show me a summary of what you changed so I can review and click Save.`;

/** Option 2: Sidekick creates only the Store Location page; the Contact page is made by hand. */
const SIDEKICK_STORE_LOCATION_PAGE_PROMPT = `Please create one **page** in my Shopify store.

**Where:** Online Store → Pages → Add page

**Store Location**
- Title: Store Location
- Content: leave empty (the store locator is added later with theme sections)
- Visibility: Visible

**Requirements:**
- Use the title exactly as written (the handle becomes \`store-location\`).
- If a page called "Store Location" already exists, keep it and tell me instead of creating a duplicate.
- Keep the default page template for now — I'll assign the theme template later.
- Do not create or change any other page (I'll create the Contact page myself), and do not change the theme or the navigation menus.
- If you cannot create it, tell me which steps need manual action.

After completion, show me the page title, handle and visibility.`;

// Manual collection with all four demo products; Featured Collection on the Home page uses it.
const SIDEKICK_COLLECTION_PROMPT = `Please create a new collection in Shopify.

**Title:** First Launch Collection
**Collection type:** Manual (I choose the products)
**Description:** Our first NovaStep collection — everyday runners, golf classics, comfy slides and safety shoes, all in one place.

**Products to add (all four):**
1. NovaStep AeroRun
2. NovaStep Elite Classic
3. NovaStep Cloud Slide
4. NovaStep Titan Pro

**Collection image** — fetch this image and use it:
{{origin}}/resources/products/products-hero-img.jpg

**Sales channel:** available on the Online Store.

**Requirements:**
- Create it as a manual collection — no automated conditions.
- Use the title exactly as written. If a collection with this title already exists, add the products to it instead of creating a duplicate.
- Do not change the products themselves (titles, prices, variants, images or inventory).
- If you cannot fetch the image or set it, create the collection anyway and tell me which steps need manual action.

Then confirm the collection title, the number of products in it, and whether it's available on the Online Store.`;

const CREATE_COLLECTION_TOPIC: Topic = {
  id: 'create-collection',
  title: 'Create Collection',
  summary: 'Group all four products into “First Launch Collection”.',
  outcome: [
    '“First Launch Collection” shows 4 products',
    'The collection is available on the Online Store',
  ],
  blocks: [
    { type: 'link', label: 'Open Shopify Admin', url: 'https://admin.shopify.com/', fallbackPath: 'Products → Collections' },
    {
      type: 'steps',
      items: [
        'Go to “Products” → “Collections” and click “Create collection”',
        'Enter the title “First Launch Collection”',
        'Choose “Manual” as the collection type',
        'Click “Save”, then under “Products” click “Browse” and add all four NovaStep products',
        'Upload the collection image (optional) and check “Online Store” is ticked under Sales channels',
        'Click “Save”',
      ],
    },
    {
      type: 'kv',
      title: 'Collection details',
      prompt: {
        title: 'Sidekick prompt – Create collection',
        text: SIDEKICK_COLLECTION_PROMPT,
        tip: 'Paste this into Shopify Sidekick. It creates the manual collection, adds all four products and fetches the collection image by link. Check the collection in Products → Collections afterwards.',
      },
      rows: [
        { label: 'Title', value: 'First Launch Collection' },
        { label: 'Collection type', value: 'Manual' },
        { label: 'Products', value: 'AeroRun · Elite Classic · Cloud Slide · Titan Pro' },
        { label: 'Collection image', value: 'products-hero-img.jpg (Resources → Page hero images)' },
        { label: 'Sales channel', value: 'Online Store' },
      ],
    },
    {
      type: 'note',
      text: 'The Featured Collection section on the Home page (Theme step) shows this collection.',
    },
  ],
};

// Sidekick can fetch public image links and add them to a product (confirmed in a live Sidekick chat);
// the manual steps stay as the fallback.
const UPLOAD_IMAGES_TOPIC: Topic = {
  id: 'upload-images',
  title: 'Upload Images',
  summary: 'Add each product’s photos and link the color photos to their variants.',
  outcome: ['Each product shows its main image first', 'Choosing a color on the product page switches to that color’s photo'],
  blocks: [
    {
      type: 'steps',
      items: [
        'Download the product’s photos with the ZIP button below and unzip them',
        'Go to “Products” and open the product',
        'In “Media”, click “Upload new” (or drag the files in) — put the “Main image” first',
        'Check the ★ (featured image) is on the “Main image” — if not, drag the Main image to the first position',
        'Under “Variants”, click the image icon next to a color variant and pick the matching color photo',
        'Repeat for every color, then click “Save”',
      ],
    },
    {
      type: 'note',
      text: 'Do the first product by hand with the steps above, then use “Bulk upload with Sidekick” below for the rest — Sidekick fetches the photos from their links and prepares them for you to review and save. Variant images must already be in the product’s Media.',
    },
    { type: 'upload-images' },
    {
      type: 'link',
      label: 'Shopify Help: Add images to variants',
      url: 'https://help.shopify.com/en/manual/products/product-media/add-images-variants',
      purpose: 'Official guide for assigning images to variants.',
    },
  ],
};

const productTopics: Topic[] = PRODUCTS.map((p) => ({
  id: p.title.toLowerCase().replace(/^novastep\s+/, '').replace(/\s+/g, '-'),
  title: p.title.replace(/^NovaStep\s+/, ''),
  summary: p.description,
  blocks: [{ type: 'product', product: p }],
}));

export const SECTIONS: Section[] = [
  {
    id: 'register',
    title: 'Register Shopify',
    icon: UserPlus,
    summary: 'Create your Shopify account so you can open the Dev Dashboard.',
    topics: [
      {
        id: 'create-account',
        title: 'Create Shopify Account',
        summary: 'Sign up for a free Shopify account — one per participant.',
        outcome: ['You can sign in to the Shopify Dev Dashboard with your new account'],
        blocks: [
          {
            type: 'link',
            label: 'Open Shopify Sign up',
            url: 'https://accounts.shopify.com/signup',
            purpose: 'Create your Shopify account (free).',
          },
          {
            type: 'steps',
            items: [
              'Open the Shopify “Sign up” page',
              'Enter your email address and create a password — or use a sign-in option shown on the page',
              'Confirm your email from the message Shopify sends you',
              'Sign in to the “Shopify Dev Dashboard” — you’ll create the workshop store in the next module',
            ],
          },
          {
            type: 'note',
            text: 'Use an email you can open during the session — you may need to confirm it. Already have a Shopify account? Just sign in and skip to the next module.',
          },
          {
            type: 'link',
            label: 'Open Shopify Dev Dashboard',
            url: 'https://dev.shopify.com/dashboard/',
            purpose: 'Where development stores are created and managed.',
          },
        ],
      },
    ],
  },
  {
    id: 'create-store',
    title: 'Create Store',
    icon: Store,
    summary: 'Spin up a new development store from the Shopify Dev Dashboard.',
    topics: [
      {
        id: 'store-types',
        title: 'Store Types',
        summary: 'Store vs Dev store vs Client transfer store — which one to use.',
        blocks: [
          { type: 'store-types' },
          {
            type: 'link',
            label: 'Shopify Dev Docs: About stores',
            url: 'https://shopify.dev/docs/apps/build/stores',
            purpose: 'Official comparison of dev stores, client transfer stores and collaborations.',
          },
          {
            type: 'link',
            label: 'Shopify Dev Docs: Client transfer stores',
            url: 'https://shopify.dev/docs/apps/build/stores/client-transfer-stores',
            purpose: 'How to build a store for a client and transfer it.',
          },
        ],
      },
      {
        id: 'explore-plans',
        title: 'Explore Plans',
        summary: 'Compare Shopify plans before choosing one for a real store.',
        tag: 'production',
        blocks: [
          {
            type: 'link',
            label: 'Open Shopify Pricing',
            url: 'https://www.shopify.com/pricing',
            purpose: 'Official plans and prices (English).',
          },
          {
            type: 'link',
            label: 'Open Shopify Pricing (Thai)',
            url: 'https://www.shopify.com/th/pricing',
            purpose: 'The same page in Thai.',
          },
          {
            type: 'steps',
            items: [
              'Compare the plans: “Basic”, “Grow”, “Advanced” and “Plus”',
              'Switch between monthly and yearly billing to see the difference',
              'Check staff accounts, third-party payment fees and reporting for each plan',
              'Start with “Basic” and upgrade as the business grows',
            ],
          },
          {
            type: 'note',
            text: 'This workshop uses a free development store, so no plan purchase is needed today. Prices and terms change — always check the pricing page for the latest.',
          },
          { type: 'images', images: [{ id: 'slide-11', src: '/slides/slide-11.webp', caption: 'Shopify Plans (presentation slide)' }] },
        ],
      },
      {
        id: 'new-dev-store',
        title: 'New Dev Store',
        summary: 'Create a development store on the Basic plan.',
        tag: 'workshop',
        outcome: ['The new store is listed under Stores in the Dev Dashboard', 'You can open the store’s Shopify Admin'],
        blocks: [
          {
            type: 'link',
            label: 'Open Shopify Dev Dashboard',
            url: 'https://dev.shopify.com/dashboard/',
            purpose: 'Where development stores are created and managed.',
            fallbackPath: 'Dev Dashboard → Stores → Create Store',
          },
          {
            type: 'steps',
            items: [
              'Go to “Shopify Dev Dashboard” — https://dev.shopify.com/dashboard/',
              'Choose “Stores”',
              'Click “Create Store”',
              'Select “Dev” & enter the “Store Name”',
              'Choose the “Basic” plan',
            ],
          },
          {
            type: 'images',
            images: [
              img('p001_0', 'Dev Dashboard → Stores'),
              img('p001_1', 'Create Store'),
              img('p002_0', 'Select Dev & enter store name'),
              img('p002_1', 'Choose Basic plan'),
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'store-setup',
    title: 'Store Setup',
    icon: Settings2,
    summary: 'Business entity, store details, markets and shipping.',
    topics: [
      {
        id: 'business-entities',
        title: 'Business Entities',
        summary: 'Register the legal entity that owns the store.',
        blocks: [
          { type: 'link', label: 'Open Shopify Admin', url: 'https://admin.shopify.com/', fallbackPath: 'Settings → search “Organization”' },
          {
            type: 'steps',
            items: [
              'Search for “Organization”, then add a new Entity',
              'Specify “Business Type” / Name / Address / City / Province / Postal Code',
            ],
          },
          { type: 'images', images: [img('p004_0', 'Organization → Add entity'), img('p004_1', 'Entity details')] },
        ],
      },
      {
        id: 'store-details',
        title: 'Store Details',
        summary: 'Map business details, store address and defaults.',
        outcome: ['Store address and defaults (currency, units, time zone) are saved'],
        blocks: [
          { type: 'link', label: 'Open Shopify Admin', url: 'https://admin.shopify.com/', fallbackPath: 'Settings → General' },
          {
            type: 'steps',
            items: [
              'Search for “General”',
              'Map “Business Details” to the “Entity”',
              'Specify “Store Address”',
              'Specify “Store Defaults”',
            ],
          },
          {
            type: 'images',
            images: [
              img('p005_0', 'Settings → General'),
              img('p005_1', 'Map business details to entity'),
              img('p006_0', 'Store address'),
              img('p006_1', 'Store defaults'),
            ],
          },
        ],
      },
      {
        id: 'markets',
        title: 'Create Market',
        summary: 'Create the Thailand market.',
        outcome: ['Thailand appears in the Markets list'],
        blocks: [
          { type: 'link', label: 'Open Shopify Admin', url: 'https://admin.shopify.com/', fallbackPath: 'Settings → Markets' },
          { type: 'steps', items: ['Click on “Markets”', 'Create “Market”', 'Select “Thailand”'] },
          {
            type: 'images',
            images: [img('p007_0', 'Markets'), img('p007_1', 'Create market'), img('p007_2', 'Thailand')],
          },
        ],
      },
      {
        id: 'shipping',
        title: 'Shipping & Delivery',
        summary: 'Shop location, shipping profile and fulfilment.',
        blocks: [
          { type: 'link', label: 'Open Shopify Admin', url: 'https://admin.shopify.com/', fallbackPath: 'Settings → Shipping and delivery' },
          {
            type: 'steps',
            items: [
              'Specify “Shop Location”',
              'Search for “Shipping and Delivery”',
              'Add “Shipping Profile”',
              'Specify “Fulfilling”',
            ],
          },
          {
            type: 'images',
            images: [
              img('p008_0', 'Shop location'),
              img('p009_0', 'Shipping and delivery'),
              img('p009_1', 'Add shipping profile'),
              img('p010_0', 'Fulfilling'),
              img('p010_1', 'Fulfilling — rates'),
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'metafields',
    title: 'Metafields',
    icon: Database,
    summary: 'Custom data definitions for products and pages.',
    topics: [
      {
        id: 'product-metafields',
        title: 'Product Metafields',
        summary: 'Settings → Metafields and metaobjects → Products.',
        outcome: ['All 7 product definitions are listed under Product metafield definitions'],
        blocks: [
          { type: 'link', label: 'Open Shopify Admin', url: 'https://admin.shopify.com/', fallbackPath: 'Settings → Metafields and metaobjects → Products' },
          {
            type: 'note',
            text: 'A metafield is an extra field attached to an existing Shopify resource (here: Products). A metaobject is a reusable structured record — not used in this exercise.',
          },
          {
            type: 'steps',
            items: [
              'Search for “Metafields and metaobjects”',
              'Open “Products” and click “Add definition”',
              'Create one definition for each key below',
            ],
          },
          {
            type: 'copylist',
            title: 'Product metafield keys',
            meta: 'Resource: Products · Namespace: custom',
            items: PRODUCT_METAFIELDS.map((m) => m.key),
            types: PRODUCT_METAFIELDS.map((m) => m.type),
            promptHidden: true,
            prompt: {
              title: 'Sidekick prompt – Product metafields',
              text: SIDEKICK_PRODUCT_MF_PROMPT,
              tip: 'Paste this into Shopify Sidekick to create all 7 product definitions. If Sidekick can’t, use Add definition manually with the types listed above. Always verify in Admin.',
            },
          },
          { type: 'images', images: [img('p013_0', 'Search metafields'), img('p013_1', 'Product metafield definitions'), img('p014_0', 'Add definition')] },
          { type: 'images', images: PRODUCT_METAFIELDS.map((m) => img(m.page, m.key)) },
        ],
      },
      {
        id: 'page-text-metafields',
        title: 'Page – Text Metafields',
        summary: '8 rich-text definitions for the About Us page.',
        outcome: ['8 Rich text definitions are listed under Settings → Metafields and metaobjects → Pages'],
        blocks: [
          { type: 'link', label: 'Open Shopify Admin', url: 'https://admin.shopify.com/', fallbackPath: 'Settings → Metafields and metaobjects → Pages' },
          {
            type: 'copylist',
            title: 'Page text metafields',
            meta: 'Resource: Pages · Type: Rich text · Namespace: custom',
            items: PAGE_TEXT_METAFIELDS,
            prompt: {
              title: 'Sidekick prompt – Text metafields',
              text: SIDEKICK_PROMPT,
              tip: 'Paste this into Shopify Sidekick to create all 8 definitions. Sidekick may not be able to do this in every store — if it can’t, use Add definition manually (Name → Type: Rich text). Always verify in Admin; Sidekick’s reply is not proof the definitions exist.',
            },
          },
          {
            type: 'note',
            text: 'The names above are display names. Shopify generates the namespace/key (e.g. custom.about_us_brand_history) — spaces and capitals may not be kept, so check the actual key in Admin.',
          },
          {
            type: 'images',
            images: [
              img('p021_0', 'Page metafield definitions — overview'),
              img('p022_0', 'about_us_Brand History'),
              img('p022_1', 'about_us_The Founder'),
              img('p023_0', 'about_us_Our Innovation'),
              img('p023_1', 'about_us_Our Mission'),
              img('p024_0', 'about_us_Our Vision'),
              img('p024_1', 'about_us_Our Core Values'),
              img('p025_0', 'about_us_What We Make'),
              img('p025_1', 'about_us_Why Choose NovaStep'),
            ],
          },
        ],
      },
      {
        id: 'page-image-metafields',
        title: 'Page – Image Metafields',
        summary: '8 file (image) definitions for the About Us page.',
        outcome: ['8 File definitions (about_us_*_img) are listed under Settings → Metafields and metaobjects → Pages'],
        blocks: [
          { type: 'link', label: 'Open Shopify Admin', url: 'https://admin.shopify.com/', fallbackPath: 'Settings → Metafields and metaobjects → Pages' },
          {
            type: 'copylist',
            title: 'Page image metafields',
            meta: 'Resource: Pages · Type: File (Images) · Namespace: custom',
            items: PAGE_IMAGE_METAFIELDS,
            prompt: {
              title: 'Sidekick prompt – Image metafields',
              text: SIDEKICK_IMAGE_PROMPT,
              tip: 'Paste this into Shopify Sidekick to create all 8 image definitions. If Sidekick can’t, use Add definition manually (Name → Type: File → Accept: Images → One value). Always verify in Admin.',
            },
          },
          {
            type: 'images',
            images: [
              img('p027_0', 'Page metafield definitions — overview'),
              img('p028_0', 'about_us_hero_img'),
              img('p028_1', 'about_us_our_story_img'),
              img('p029_0', 'about_us_brand_history_img'),
              img('p029_1', 'about_us_the_founder_img'),
              img('p030_0', 'about_us_innovation_img'),
              img('p030_1', 'about_us_our_vision_img'),
              img('p031_0', 'about_us_our_mission_img'),
              img('p031_1', 'about_us_our_core_values_img'),
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'products',
    title: 'Products',
    icon: Package,
    summary: 'Four NovaStep demo products with variants and metafields.',
    topics: [...productTopics, UPLOAD_IMAGES_TOPIC, CREATE_COLLECTION_TOPIC],
  },
  {
    id: 'inventory',
    title: 'Inventory',
    icon: Boxes,
    summary: 'Manual adjustment and CSV bulk import.',
    topics: [
      {
        id: 'inventory-terms',
        title: 'Inventory Terms',
        summary: 'What On hand, Available, Committed, Unavailable and Incoming mean.',
        blocks: [
          { type: 'inventory-terms' },
          {
            type: 'link',
            label: 'Shopify Help: Inventory states',
            url: 'https://help.shopify.com/en/manual/products/inventory/fundamentals/inventory-states',
            purpose: 'Official definitions of each inventory state.',
          },
        ],
      },
      {
        id: 'manual-adjust',
        title: 'Manual Adjust',
        summary: 'Set stock levels by hand, or let Sidekick do it for every variant.',
        outcome: ['Every variant shows the planned On hand quantity at your location'],
        blocks: [
          { type: 'steps', items: ['Go to “Inventory”', 'Specify inventory balance “On hand”', 'Click “Save”'] },
          { type: 'inventory' },
          { type: 'images', images: [img('p095_0'), img('p095_1'), img('p095_2')] },
        ],
      },
      {
        id: 'bulk-import',
        title: 'Bulk Import',
        blocks: [
          { type: 'steps', title: 'Export current inventory template', items: ['Click “Export”', 'Click “Export Variants” to save “.csv”'] },
          { type: 'images', images: [img('p096_0'), img('p096_1')] },
          { type: 'steps', title: 'Maintain new inventory', items: ['Open the “.csv” with Excel', 'Enter stock balance into the column “On hand (New)”', 'Save the file'] },
          { type: 'images', images: [img('p097_0'), img('p097_1')] },
          { type: 'steps', title: 'Import inventory into Shopify', items: ['Click “Import”', 'Browse & choose file', 'Click “Upload file”', 'Click “Start Import”', 'Inventory updated'] },
          { type: 'images', images: [img('p098_0'), img('p098_1'), img('p099_0'), img('p099_1', 'Inventory updated')] },
        ],
      },
    ],
  },
  {
    id: 'theme',
    title: 'Theme',
    icon: Palette,
    summary: 'Horizon theme — Home, About Us, Contact Us and Store Location.',
    topics: [
      {
        id: 'select-theme',
        title: 'Select Theme',
        summary: 'Use the Horizon theme.',
        blocks: [
          {
            type: 'kv',
            rows: [
              {
                label: 'Theme',
                value: 'Horizon',
                link: { label: 'Open in Theme Store', url: 'https://themes.shopify.com/themes?q=horizon' },
                linkHidden: true,
              },
            ],
          },
          {
            type: 'steps',
            title: 'Pages to build',
            items: ['Home', 'About Us', 'Contact Us', 'Store Location'],
          },
          { type: 'images', images: [img('p047_0', 'Horizon theme')] },
        ],
      },
      {
        id: 'theme-editor-basics',
        title: 'How the Theme Editor Works',
        summary: 'Templates, sections and blocks — the building-block idea behind customizing a theme.',
        blocks: [
          { type: 'theme-editor-guide' },
          {
            type: 'link',
            label: 'Shopify Help: Sections and blocks',
            url: 'https://help.shopify.com/en/manual/online-store/themes/theme-structure/sections-and-blocks',
            purpose: 'Official explanation of templates, sections and blocks.',
          },
        ],
      },
      {
        id: 'logo',
        group: 'Home',
        title: 'Logo',
        summary: 'Theme settings → Logo and favicon.',
        blocks: [
          {
            type: 'kv',
            title: 'Logo settings',
            prompt: {
              title: 'Sidekick prompt – Theme logo',
              text: SIDEKICK_LOGO_PROMPT,
              tip: 'Paste this into Shopify Sidekick. It fetches both logo files from their links. If it can’t change theme settings, it uploads the logos to Files — then pick them in Theme settings → Logo and favicon. The inverse logo only shows once the Header step turns on the transparent header.',
            },
            rows: [
              { label: 'Default logo', value: 'NovaStep logo (dark)' },
              { label: 'Inverse logo', value: 'NovaStep logo (light)' },
              { label: 'Desktop height', value: '36 px' },
              { label: 'Mobile height', value: '28 px' },
            ],
          },
          { type: 'images', images: [img('p049_0', 'Logo and favicon')] },
        ],
      },
      {
        id: 'header',
        group: 'Home',
        title: 'Header',
        summary: 'Header section settings.',
        blocks: [
          {
            type: 'kv',
            title: 'Header settings',
            prompt: {
              title: 'Sidekick prompt – Header',
              text: SIDEKICK_HEADER_PROMPT,
              tip: 'Paste this into Shopify Sidekick. It turns on the transparent header with the inverse logo and white header text on the Home page only — that’s what makes the inverse logo from the Logo step appear. Product and Collection pages stay solid. Review the preview, then click Save.',
            },
            rows: [
              { label: 'Logo position', value: 'Center' },
              { label: 'Menu position', value: 'Left · Row: Top' },
              { label: 'Search icon', value: 'On · Right · Top' },
              { label: 'Localization', value: 'Country/Region On · Flag Off · Language selector On' },
              { label: 'Home page', value: 'Transparent background On · Inverse logo On · Header text #FFFFFF' },
              { label: 'Product page', value: 'Transparent background Off' },
              { label: 'Collection page', value: 'Transparent background Off' },
            ],
          },
          {
            type: 'images',
            images: [
              img('p050_0', 'Header in editor'),
              img('p050_1', 'Header settings'),
              img('p050_2', 'Header settings (cont.)'),
              img('p051_0', 'Colors & home page transparency'),
            ],
          },
        ],
      },
      {
        id: 'theme-colors',
        group: 'Home',
        title: 'Theme Setting – Colors',
        summary: 'Typography and color schemes.',
        blocks: [
          {
            type: 'kv',
            title: 'Typography settings',
            prompt: {
              title: 'Sidekick prompt – Typography',
              text: SIDEKICK_TYPOGRAPHY_PROMPT,
              tip: 'Paste this into Shopify Sidekick. It sets the fonts, paragraph and Heading 1–6 styles from the workshop. Review the preview, then click Save.',
            },
            rows: [
              { label: 'Text color', value: 'Palette color (black)' },
              { label: 'Fonts', value: 'Inter (Body · Subheading · Heading · Accent)' },
              { label: 'Paragraph', value: '14px · Loose' },
              { label: 'Heading 1', value: 'Heading · 56px · Tight' },
              { label: 'Heading 2', value: 'Heading · 40px · Normal' },
              { label: 'Heading 3', value: 'Heading · 32px · Normal' },
              { label: 'Heading 4', value: 'Heading · 24px · Tight' },
              { label: 'Heading 5', value: 'Subheading · 14px · Loose' },
              { label: 'Heading 6', value: 'Subheading · 12px · Loose' },
            ],
          },
          { type: 'images', images: [img('p052_0', 'Typography'), img('p052_1', 'Headings 1–3'), img('p053_0', 'Headings 4–6')] },
        ],
      },
      {
        id: 'hero',
        group: 'Home',
        title: 'Hero – Bottom align',
        blocks: [
          {
            type: 'specs',
            title: 'Hero text',
            prompt: {
              title: 'Sidekick prompt – Hero',
              text: SIDEKICK_HERO_PROMPT,
              tip: 'Paste this into Shopify Sidekick. It fetches the hero image by link and sets the three text blocks with their styles and colors. Review the preview, then click Save.',
            },
            rows: [
              { text: 'EVERY STEP', style: 'Heading 1', color: '#EEEEEE' },
              { text: 'FORWARD', style: 'Heading 1', color: '#BEA77E' },
              { text: 'Footwear designed for every parts of your life.', style: 'Custom', color: '#EEEEEE', size: '20px' },
            ],
          },
          { type: 'images', images: [img('p054_0', 'Hero – Bottom align')] },
        ],
      },
      {
        id: 'featured-collection',
        group: 'Home',
        title: 'Featured Collection',
        blocks: [
          {
            type: 'specs',
            title: 'Heading',
            prompt: {
              title: 'Sidekick prompt – Featured collection',
              text: SIDEKICK_FEATURED_COLLECTION_PROMPT,
              tip: 'Paste this into Shopify Sidekick. It sets the “ALL PRODUCTS” heading and shows “First Launch Collection” (create it first in Products → Create Collection). Review the preview, then click Save.',
            },
            rows: [{ text: 'ALL PRODUCTS', style: 'Heading 2', color: '#545454' }],
          },
          { type: 'images', images: [img('p056_0', 'Featured collection')] },
        ],
      },
      {
        id: 'image-with-text',
        group: 'Home',
        title: 'Image with Text',
        blocks: [
          {
            type: 'specs',
            title: 'Text',
            prompt: {
              title: 'Sidekick prompt – Image with text',
              text: SIDEKICK_IMAGE_WITH_TEXT_PROMPT,
              tip: 'Paste this into a new Sidekick chat. It fetches the image by link (like the Hero) and sets the headings, text and gold button. For square button corners, paste the CSS yourself with the CSS helper below. Review the preview, then click Save.',
            },
            rows: [
              { text: 'BUILDING A BETTER TOMORROW', style: 'Heading 2', color: '#545454' },
              { text: 'ONE STEP AT A TIME', style: 'Heading 3', color: '#BEA77E' },
              {
                text: 'At NovaStep, our goal is simple: create footwear that empowers people to move forward with confidence.',
                style: 'Custom',
                color: '#545454',
                size: '16px',
              },
              { text: 'DISCOVER NOVA GOAL', style: 'Button · BG / Border', color: '#BEA77E' },
            ],
          },
          {
            type: 'code',
            title: 'Custom CSS – Image with Text',
            lang: 'css',
            code: IMAGE_WITH_TEXT_CSS,
            selector: {
              example: '.button-custom--Aakg1TzlHWGNWeXFLb__button_eygrzd',
              prefer: 'button-custom--',
              hint: 'Each store gets its own button class. In the theme editor preview, right-click the button → Inspect, then copy the class that starts with button-custom-- (pasting the whole class="…" or HTML tag also works).',
            },
          },
          { type: 'images', images: [img('p057_0', 'Image with text'), img('p058_0', 'Custom CSS')] },
        ],
      },
      {
        id: 'featured-product',
        group: 'Home',
        title: 'Featured Product',
        blocks: [
          {
            type: 'steps',
            items: [
              'On the Home page, click “Add section” → “Custom section” (below Image with text)',
              'Inside the Custom section, click “Add block” → “Text” and type “NEW ARRIVAL” — Heading 2, color #545454',
              'Select the Custom section and set Size → Height to “Auto”',
              'Click “Add section” → “Featured product” (below the Custom section)',
              'In the Featured product settings, choose the product “NovaStep Cloud Slide”',
              'Check the images, price, Color and Size options and buy button show, then click “Save”',
            ],
          },
          { type: 'specs', title: 'Heading', rows: [{ text: 'NEW ARRIVAL', style: 'Heading 2', color: '#545454' }] },
          { type: 'images', images: [img('p059_0', 'Featured product')] },
        ],
      },
      {
        id: 'footer',
        group: 'Home',
        title: 'Footer',
        summary: 'Build the black “JOIN US” email sign-up band by hand in the theme editor.',
        outcome: [
          'A full-width black band above the copyright row',
          '“JOIN US” and the sign-up line centered, with the email field below',
          'The left panel shows Group → Group (2 Texts), Spacer, Email signup',
        ],
        blocks: [
          {
            type: 'steps',
            title: 'Build it step by step',
            items: [
              'In the theme editor, scroll the left panel down to “Footer” and select the “Footer” section',
              'Set the Footer section color scheme so its background is black (#000000)',
              'Under the Footer section, click “Add block” → “Group” — this is the OUTER group',
              'Set the OUTER group: Vertical · Center · Position Center · Gap 6px · Width Fill · Height Fit · Background Default',
              'Inside the OUTER group, click “Add block” → “Group” — this is the INNER group',
              'Set the INNER group: Vertical · Center · Position Center · Gap 12px · Width Fill · Height Fit · Background Default',
              'Inside the INNER group, add a “Text” block, type “JOIN US”, format it as H2 in the editor toolbar and set the text color to #DFDFDF',
              'Inside the INNER group, add a second “Text” block with “Get exclusive deals and early access to new products.” — Custom preset, 16px, centered, #DFDFDF',
              'Back in the OUTER group (not the inner one), add a “Spacer” — Pixel, 32px',
              'In the OUTER group, add “Email signup” below the Spacer — Width Custom 62%, Submit button style Link',
              'Delete any leftover default blocks, check the structure below, then click “Save”',
            ],
          },
          {
            type: 'code',
            title: 'Block structure (left panel)',
            lang: 'text',
            code: `Footer  (section · black background)
└─ Group                      ← OUTER group
    ├─ Group                  ← INNER group
    │   ├─ Text  — JOIN US
    │   └─ Text  — Get exclusive deals and early access to new products.
    ├─ Spacer                 ← 32px
    └─ Email signup           ← 62% width`,
          },
          {
            type: 'note',
            text: 'The Spacer and the Email signup sit inside the OUTER group, next to the INNER group — not inside the INNER group. Both groups are Vertical, so everything stacks top to bottom.',
          },
          {
            type: 'kv',
            title: 'OUTER group',
            rows: [
              { label: 'Layout', value: 'Direction Vertical · Alignment Center · Position Center · Gap 6px' },
              { label: 'Size', value: 'Width Fill · Mobile width Fill · Height Fit' },
              { label: 'Appearance', value: 'Background media None · Background color Default · Borders None · Corner radius 0' },
            ],
          },
          {
            type: 'kv',
            title: 'INNER group',
            rows: [
              { label: 'Layout', value: 'Direction Vertical · Alignment Center · Position Center · Gap 12px' },
              { label: 'Size', value: 'Width Fill · Mobile width Fill · Height Fit' },
              { label: 'Appearance', value: 'Background media None · Background color Default · Borders None · Corner radius 0' },
            ],
          },
          {
            type: 'specs',
            title: 'Footer text',
            rows: [
              { text: 'JOIN US', style: 'Heading 2', color: '#DFDFDF' },
              { text: 'Get exclusive deals and early access to new products.', style: 'Custom', color: '#DFDFDF', size: '16px' },
            ],
          },
          {
            type: 'kv',
            title: 'Text blocks',
            rows: [
              { label: 'JOIN US', value: 'H2 (editor toolbar) · Text color #DFDFDF · Background Off · Padding 0 / 0' },
              {
                label: 'Sign-up line',
                value: 'Width Fill · Max width Normal · Align Center · Preset Custom · Body 16px · Line height Normal · Wrap Pretty · #DFDFDF',
              },
            ],
          },
          {
            type: 'kv',
            title: 'Spacer & Email signup',
            rows: [
              { label: 'Spacer', value: 'Unit Pixel · Size 32px · Custom mobile size Off' },
              { label: 'Email signup', value: 'Width Custom 62% · Heading empty · Input border All, Default · Submit button Link' },
            ],
          },
          { type: 'images', images: [img('p060_0', 'Footer'), img('footer_structure', 'Footer structure in the theme editor')] },
        ],
      },
      {
        id: 'about-template-page',
        group: 'About Us',
        title: 'Template & Page',
        summary: 'Create the about-us-mod template and the About us page.',
        blocks: [
          {
            type: 'steps',
            items: ['Create Template: About Us', 'Create Page: About Us', 'Map the page to the template'],
          },
          { type: 'kv', title: 'Template', rows: [{ label: 'Name', value: 'about-us-mod' }, { label: 'Based on', value: 'Default page' }] },
          { type: 'richtext', title: 'Page content', name: 'About us', body: ABOUT_US_PAGE_CONTENT },
          {
            type: 'images',
            images: [img('p062_0', 'Create template'), img('p062_1', 'about-us-mod'), img('p063_0', 'About us page'), img('p063_1', 'Map to template')],
          },
        ],
      },
      {
        id: 'about-metafield-content',
        group: 'About Us',
        title: 'Metafield Content',
        summary: 'Fill the page metafields with the copy below.',
        blocks: [
          {
            type: 'prompt',
            banner: {
              title: 'Fill these metafields with Sidekick',
              subtitle: 'All 8 About us text metafields in one prompt.',
            },
            prompt: {
              title: 'Sidekick prompt – About us metafields',
              text: SIDEKICK_ABOUT_CONTENT_PROMPT,
              tip: 'Paste this into Shopify Sidekick. It fills the values only if the 8 Page metafield definitions already exist (Metafields step) and the About us page has been created. Always check the page in Admin afterwards.',
            },
          },
          ...ABOUT_US_RICHTEXT.map((r) => ({ type: 'richtext' as const, title: r.title, body: r.body })),
          { type: 'images', images: [img('p064_0', 'Page metafields filled')] },
        ],
      },
      {
        id: 'create-pages',
        group: 'Pages & Menu',
        title: 'Create Pages',
        summary: 'Create the Store Location and Contact pages, so the menu can link to them.',
        outcome: ['Online Store → Pages lists About us, Store Location and Contact, all Visible'],
        blocks: [
          {
            type: 'prompt',
            hidden: true,
            banner: { title: 'Create these pages with Sidekick', subtitle: 'Store Location and Contact (with its HTML content) in one prompt.' },
            prompt: {
              title: 'Sidekick prompt – Create pages',
              text: SIDEKICK_CREATE_PAGES_PROMPT,
              tip: 'Paste this into Shopify Sidekick. Templates are assigned later in Page Sections. Check Online Store → Pages afterwards.',
            },
          },
          {
            type: 'note',
            text: 'Do it in two parts: let Sidekick create the Store Location page, then make the Contact page yourself by copying the HTML.',
          },
          {
            type: 'prompt',
            banner: { title: 'Store Location page only — with Sidekick', subtitle: 'Creates just the empty Store Location page.' },
            prompt: {
              title: 'Sidekick prompt – Store Location page',
              text: SIDEKICK_STORE_LOCATION_PAGE_PROMPT,
              tip: 'Paste this into Shopify Sidekick. It creates only the Store Location page — make the Contact page by hand below. Check Online Store → Pages afterwards.',
            },
          },
          {
            type: 'steps',
            title: 'Store Location page — by hand',
            items: ['Go to Online Store → Pages → “Add page”', 'Title “Store Location” — leave the content empty — Visible — “Save”'],
          },
          {
            type: 'steps',
            title: 'Contact page — by hand (copy the HTML)',
            items: [
              'Go to Online Store → Pages → “Add page”',
              'Title “Contact” — open the HTML view (</>) of Content and paste the HTML below — Visible — “Save”',
            ],
          },
          { type: 'code', title: 'Contact – page content (HTML)', lang: 'html', code: contactHtml },
        ],
      },
      {
        id: 'main-menu',
        group: 'Pages & Menu',
        title: 'Main Menu',
        summary: 'Link the header menu to the pages by hand: HOME · PRODUCTS · ABOUT US · STORE LOCATION · CONTACT.',
        outcome: ['The header shows HOME, PRODUCTS, ABOUT US, STORE LOCATION and CONTACT, and each opens the right page'],
        blocks: [
          {
            type: 'steps',
            items: [
              'Go to Content → Menus → “Main menu”',
              'Delete the default menu items',
              'Click “Add menu item” and add the 5 items below, in this order — type the Label in capitals and pick the Link from the list',
              'Drag the items into the order shown, then click “Save”',
            ],
          },
          {
            type: 'kv',
            title: 'Main menu items (Content → Menus → Main menu)',
            copyLabel: true,
            rows: [
              { label: 'HOME', value: 'Home page' },
              { label: 'PRODUCTS', value: 'All products' },
              { label: 'ABOUT US', value: 'Page: About us' },
              { label: 'STORE LOCATION', value: 'Page: Store Location' },
              { label: 'CONTACT', value: 'Page: Contact' },
            ],
          },
          { type: 'images', images: [img('main_menu', 'Main menu items')] },
        ],
      },
      {
        id: 'about-sections',
        group: 'Page Sections',
        title: 'About Us Sections',
        summary: 'Hero, Image with Text ×3, Icon with Text & Pull Quote.',
        blocks: [
          { type: 'specs', title: '1. Hero – Bottom aligned', rows: [{ text: 'ABOUT US', style: 'Heading 1', color: '#EEEEEE' }] },
          { type: 'images', images: [img('p067_0', 'Hero')] },
          {
            type: 'specs',
            title: '2. Image with Text – Our Story',
            rows: [
              { text: 'Our Story', style: 'Heading 2', color: '#646464' },
              { text: '{{ Link to Page Source: Content }}', style: 'Heading 4', color: '#878787' },
            ],
          },
          { type: 'images', images: [img('p068_0', 'Our Story')] },
          {
            type: 'specs',
            title: '3. Image with Text – Brand History',
            rows: [
              { text: 'Brand History', style: 'Heading 2', color: '#646464' },
              { text: '{{ Link to Page Source: about_us_Brand_History }}', style: 'Heading 4', color: '#878787' },
            ],
          },
          { type: 'images', images: [img('p069_0', 'Brand History')] },
          {
            type: 'specs',
            title: '4. Image with Text – Our Innovation',
            rows: [
              { text: 'Our Innovation', style: 'Heading 2', color: '#646464' },
              { text: '{{ Link to Page Source: about_us_Our_Innovation }}', style: 'Heading 4', color: '#878787' },
            ],
          },
          { type: 'images', images: [img('p070_0', 'Our Innovation')] },
          {
            type: 'specs',
            title: '5. Icon with Text',
            rows: [
              { text: 'Vision  (Icon: Eye)', style: 'Heading 3', color: '#646464' },
              { text: '{{ Link to Page Source: about_us_Our_Vision }}', style: 'Heading 4', color: '#878787' },
              { text: 'Mission  (Icon: Heart)', style: 'Heading 3', color: '#646464' },
              { text: '{{ Link to Page Source: about_us_Our_Mission }}', style: 'Heading 4', color: '#878787' },
            ],
          },
          { type: 'images', images: [img('p071_0', 'Icon with Text')] },
          {
            type: 'specs',
            title: '6. Pull Quote',
            rows: [
              { text: 'Our Core Values  (Icon: Fire)', style: 'Heading 3', color: '#646464' },
              {
                text: 'At the heart of every product lies a unique story, driven by our passion for quality and innovation. Each item enhances your everyday life and sparks joy.',
                style: 'Heading 4',
                color: '#878787',
              },
            ],
          },
          { type: 'images', images: [img('p072_0', 'Pull Quote')] },
        ],
      },
      {
        id: 'contact-us',
        group: 'Page Sections',
        title: 'Contact Us',
        summary: 'Template + page with custom HTML content.',
        blocks: [
          { type: 'steps', items: ['Create Template: Contact Us', 'Open the Contact page (made in Create Pages) and check its HTML content below', 'Map the page to the template'] },
          {
            type: 'steps',
            title: 'Build the contact template in the theme editor',
            items: [
              'In the theme editor, open the “contact” template (top bar → Pages → contact)',
              'Under Template → “Page”, remove every block (and any other section) until only an empty “Page” section is left',
              'Click “Add section” → “Custom section”',
              'Inside the Custom section, click “Add block” → “Text”',
              'Select the Text block: Layout → Width “Fill” · Alignment “Center”',
              'In the Text field, click the dynamic source icon (stack) → choose Page → “Content”, so the page’s HTML shows here',
              'Check the preview shows the Contact page content, then click “Save”',
            ],
          },
          {
            type: 'note',
            text: 'Hero: first add it yourself — “Add section” → “Hero: Bottom aligned”, move it above the Custom section and click Save. Then use the Sidekick prompt below, or set it by hand: Media 1 = contact-us-hero-img.jpg (Resources), delete the default “Introducing” / “New arrivals” / paragraph blocks and keep one Text block “CONTACT US” — Heading 1 · Fill · Left · #EEEEEE.',
          },
          {
            type: 'specs',
            title: 'Hero – Bottom align (top of the contact template)',
            prompt: {
              title: 'Sidekick prompt – Contact Us Hero',
              text: SIDEKICK_CONTACT_HERO_PROMPT,
              tip: 'First add the Hero yourself: in the contact template click “Add section” → “Hero: Bottom aligned”, move it above the Custom section and click Save. Then paste this into Sidekick — it sets the image and replaces the default text with “CONTACT US”. Review the preview, then click Save.',
            },
            rows: [{ text: 'CONTACT US', style: 'Heading 1', color: '#EEEEEE' }],
          },
          { type: 'code', title: 'Page content (HTML)', lang: 'html', code: contactHtml },
          { type: 'images', images: [img('p074_0', 'Contact template'), img('p075_0', 'Contact page'), img('p077_0', 'Map to template'), img('contact_template_editor', 'Contact template — Custom section + Text (Content)')] },
        ],
      },
      {
        id: 'store-location',
        group: 'Page Sections',
        title: 'Store Location',
        summary: 'Hero + Custom Liquid store locator with Google Maps.',
        blocks: [
          { type: 'steps', items: ['Open the Store Location page (made in Create Pages)', 'Add section: Hero – Bottom align', 'Add Page / Block: Custom Liquid and paste the code below', 'Add the page Custom CSS'] },
          {
            type: 'note',
            text: 'Hero: first add it yourself — “Add section” → “Hero: Bottom aligned” at the top of the template and click Save. Then use the Sidekick prompt below, or set it by hand: Media 1 = store-location-hero-img.jpg (Resources), delete the default “Introducing” / “New arrivals” / paragraph blocks and keep one Text block “STORE LOCATION” — Heading 1 · Fill · Left · #EEEEEE.',
          },
          {
            type: 'specs',
            title: 'Hero – Bottom align',
            prompt: {
              title: 'Sidekick prompt – Store Location Hero',
              text: SIDEKICK_STORE_LOCATION_HERO_PROMPT,
              tip: 'First add the Hero yourself: click “Add section” → “Hero: Bottom aligned” at the top of the template and click Save. Then paste this into Sidekick — it sets the image and replaces the default text with “STORE LOCATION”. Review the preview, then click Save.',
            },
            rows: [{ text: 'STORE LOCATION', style: 'Heading 1', color: '#EEEEEE' }],
          },
          { type: 'code', title: 'Custom Liquid – Store locator', lang: 'liquid', code: storeLocatorLiquid },
          { type: 'code', title: 'Page – Custom CSS', lang: 'css', code: STORE_LOCATION_PAGE_CSS },
          {
            type: 'images',
            images: [
              img('p079_0', 'Store Location page'),
              img('p080_0', 'Hero'),
              img('p081_0', 'Custom Liquid block'),
              img('p081_1', 'Store locator preview'),
              img('p082_0', 'Block settings'),
              img('p082_1', 'Liquid editor'),
              img('p087_0', 'Page custom CSS'),
            ],
          },
        ],
      },
      {
        id: 'product-page',
        group: 'Page Sections',
        title: 'Product Page',
        summary: 'Set up the product photo gallery in the Default product template — by hand in the theme editor.',
        outcome: ['Product pages show a carousel with arrows and thumbnails below the photo, and dots on mobile'],
        blocks: [
          {
            type: 'steps',
            items: [
              'In the theme editor, open the product template: top bar → Products → “Default product” (preview a product, e.g. NovaStep Titan Pro)',
              'Under Template → “Product information”, select the “Product media” block',
              'Set Type to “Carousel”, then fill in the Carousel, Thumbnails and Media settings below',
              'Check the preview: arrows on the photo, thumbnails under it, the whole shoe visible — then click “Save”',
            ],
          },
          {
            type: 'kv',
            title: 'Product media — Carousel',
            rows: [
              { label: 'Type', value: 'Carousel' },
              { label: 'Icons', value: 'Chevrons' },
              { label: 'Desktop pagination', value: 'Thumbnails' },
              { label: 'Mobile pagination', value: 'Dots' },
            ],
          },
          {
            type: 'kv',
            title: 'Thumbnails',
            rows: [
              { label: 'Desktop position', value: 'Bottom' },
              { label: 'Desktop width', value: '44px' },
              { label: 'Corner radius', value: '0px' },
            ],
          },
          {
            type: 'kv',
            title: 'Media',
            rows: [
              { label: 'Aspect ratio', value: 'Auto' },
              { label: 'Constrain to screen height', value: 'On' },
              { label: 'Media fit', value: 'Contain' },
              { label: 'Corner radius', value: '0px' },
            ],
          },
          { type: 'images', images: [img('product_media', 'Default product → Product media')] },
        ],
      },
      {
        id: 'store-preview',
        group: 'Review',
        title: 'Store Preview',
        summary: 'Everything is built — now open the store and check it the way a customer sees it.',
        outcome: ['You have clicked through every page on desktop and mobile, and fixed anything that looked wrong'],
        blocks: [
          { type: 'link', label: 'Open Shopify Admin', url: 'https://admin.shopify.com/', fallbackPath: 'Online Store → Preferences → Password protection' },
          {
            type: 'steps',
            title: 'Open the store',
            items: [
              'In Admin, go to Online Store and click the eye icon “View your store” (or “View” in the theme editor)',
              'The store is still password protected — copy the storefront password from Online Store → Preferences → Password protection',
              'Enter the password on the store page to see the live storefront',
            ],
          },
          {
            type: 'note',
            text: 'Share the store with the password, not your Admin login. Password protection stays on until you pick a paid plan and remove it — that is fine for this demo.',
          },
          {
            type: 'steps',
            title: 'Click through — tick each one as you check it',
            items: [
              'Header: transparent with the inverse logo on Home, solid on other pages · menu HOME · PRODUCTS · ABOUT US · STORE LOCATION · CONTACT',
              'Home: Hero “EVERY STEP FORWARD” · Featured collection “ALL PRODUCTS” · Image with text · NEW ARRIVAL featured product',
              'Footer: black “JOIN US” band with the email sign-up on every page',
              'Products: open a product — photos change with Color, Size options, price and the metafield tabs show',
              'About us: Hero, the image-with-text stories and the metafield copy',
              'Store Location: Hero and the store locator map',
              'Contact: Hero and the contact cards from the page content',
            ],
          },
          {
            type: 'steps',
            title: 'Check on mobile',
            items: [
              'In the theme editor, switch the preview to mobile (phone icon in the top bar)',
              'Or open your store link on your phone and enter the storefront password',
              'Check the menu opens, images fit and text is readable',
            ],
          },
          {
            type: 'note',
            tone: 'warn',
            text: 'Something looks wrong? Go back to that step in the sidebar (Theme → Home, Pages & Menu, Page Sections), fix it in the theme editor and click Save, then refresh the store.',
          },
        ],
      },
    ],
  },
  {
    id: 'apps',
    title: 'Apps',
    icon: Blocks,
    summary: 'Install Wishlist by Square and Shopify Inbox.',
    topics: [
      {
        id: 'wishlist',
        title: 'Wishlist by Square',
        summary: 'Let shoppers save products and buy them later.',
        blocks: [
          {
            type: 'link',
            label: 'Open in Shopify App Store',
            url: 'https://apps.shopify.com/wishlist-by-square',
            purpose: 'App listing for Wishlist by Square — click “Install” and choose your store.',
            fallbackPath: 'Admin → Apps → Shopify App Store → search “Wishlist by Square”',
          },
          {
            type: 'steps',
            items: [
              'Click on “Apps” (+ Add)',
              'Click on “Shopify App Store”',
              'Search for “Wishlist by Square” and click “Install”',
              'Confirm “Install”',
              'Try “App Embed”',
            ],
          },
          {
            type: 'images',
            images: [img('p089_0'), img('p089_1'), img('p090_0'), img('p090_1'), img('p090_2'), img('p091_0', 'App embed')],
          },
        ],
      },
      {
        id: 'shopify-inbox',
        title: 'Shopify Inbox',
        summary: 'Chat with customers from your online store.',
        blocks: [
          {
            type: 'link',
            label: 'Open in Shopify App Store',
            url: 'https://apps.shopify.com/inbox',
            purpose: 'App listing for Shopify Inbox — click “Install” and choose your store.',
            fallbackPath: 'Admin → Apps → Shopify App Store → search “Shopify Inbox”',
          },
          { type: 'steps', items: ['Search for “Shopify Inbox” and click “Install”', 'Add “Shopify Inbox” to the theme'] },
          { type: 'images', images: [img('p092_0'), img('p092_1'), img('p093_0', 'Inbox in theme')] },
        ],
      },
    ],
  },
  {
    id: 'payments',
    title: 'Payments & Test Order',
    icon: CreditCard,
    summary: 'Activate the test gateway and place a test order.',
    topics: [
      {
        id: 'test-payment',
        title: 'Activate Test Payment',
        tag: 'workshop',
        outcome: ['“Test payment gateway” shows the green “Active” badge'],
        blocks: [
          {
            type: 'note',
            tone: 'warn',
            text: 'Workshop/Test only: the test gateway simulates payments — no real money moves. Going live needs a paid plan, a real payment provider and its verification; check current Shopify rules for your store type.',
          },
          {
            type: 'steps',
            items: [
              'Go to “Settings” → “Payments”',
              'The yellow banner says “Development stores can only process test payments” — click “Activate the test payment gateway” (or “Choose a provider” → search “Test payment gateway”)',
              'On the “Test payment gateway” page, read the test values, then click “Activate”',
              'Done — the page shows an “Active” badge and the message “Test payment gateway activated”',
            ],
          },
          {
            type: 'kv',
            title: 'Test card values (use at checkout)',
            rows: [
              { label: 'Approved transaction', value: '1' },
              { label: 'Declined transaction', value: '2' },
              { label: 'Gateway failure', value: '3' },
              { label: 'Expiry date', value: 'Any future date (e.g. 12/30)' },
              { label: 'Security code', value: 'Any 3 digits (e.g. 123)' },
            ],
          },
          {
            type: 'note',
            text: 'Leave PayPal Inactive and skip “Manual payment methods” — the test gateway is all you need for the test order. Use “Deactivate” on the same page when you are done testing.',
          },
          {
            type: 'images',
            images: [img('test_pay_payments', 'Settings → Payments'), img('test_pay_gateway', 'Test payment gateway — Activate'), img('test_pay_active', 'Active')],
          },
        ],
      },
      {
        id: 'test-order',
        title: 'Place Test Order',
        tag: 'workshop',
        outcome: ['The order confirmation page is shown', 'The order appears in Admin → Orders'],
        blocks: [
          {
            type: 'steps',
            items: [
              'Go to the Online Store',
              'Go to a “Product” page',
              'Click “Buy it now”',
              'Enter “Email” & “Address”, then choose the “Shipping method”',
              'Enter “1” as the card number (test gateway), any future expiry date and any 3-digit security code',
              'Click “Pay now”',
              'Order confirmed',
            ],
          },
          { type: 'images', images: [img('p103_0'), img('p103_1'), img('p104_0'), img('p104_1'), img('p105_0', 'Order confirmed')] },
        ],
      },
    ],
  },
  {
    id: 'orders',
    title: 'Order Fulfillment',
    icon: Truck,
    summary: 'Fulfil, print and deliver the test order.',
    topics: [
      {
        id: 'order-terms',
        title: 'Order Terms',
        summary: 'What the Payment, Fulfillment and Delivery statuses on an order mean.',
        blocks: [
          { type: 'order-terms' },
          {
            type: 'link',
            label: 'Shopify Help: Order status',
            url: 'https://help.shopify.com/en/manual/fulfillment/managing-orders/order-status',
            purpose: 'Every payment, fulfillment and order status explained by Shopify.',
          },
        ],
      },
      {
        id: 'fulfill',
        title: 'Fulfil & Deliver',
        tag: 'workshop',
        outcome: ['The order status shows Fulfilled, then Delivered'],
        blocks: [
          {
            type: 'steps',
            items: [
              'Go to “Orders”',
              'Click on the “Order”',
              'Click “Mark as fulfilled”',
              'Enter “Tracking” details and “Save”',
              'Print “Order Page”',
              'Print “Packing Slip”',
              'Click “Mark as delivered” when the customer receives the goods',
            ],
          },
          {
            type: 'images',
            images: [img('p106_0'), img('p106_1'), img('p107_0'), img('p107_1'), img('p108_0'), img('p108_1'), img('p108_2'), img('p108_3'), img('p109_0', 'Mark as delivered')],
          },
        ],
      },
    ],
  },
  {
    id: 'delete-store',
    title: 'Delete Store',
    icon: Trash2,
    summary: 'Clean up the demo store after the session.',
    topics: [
      {
        id: 'delete',
        title: 'Delete Store',
        tag: 'workshop',
        blocks: [
          { type: 'note', tone: 'warn', text: 'Deleting a store cannot be undone. Only do this at the end of the demo.' },
          { type: 'steps', items: ['Go to “Settings”', 'Choose “Plan”', 'Click “Delete store”'] },
          { type: 'images', images: [img('p110_0')] },
        ],
      },
    ],
  },
];

export interface FlatTopic {
  section: Section;
  topic: Topic;
  path: string;
}

export const FLAT_TOPICS: FlatTopic[] = SECTIONS.flatMap((section) =>
  section.topics.map((topic) => ({ section, topic, path: `/${section.id}/${topic.id}` })),
);

export function findTopic(sectionId?: string, topicId?: string): FlatTopic | undefined {
  return FLAT_TOPICS.find((t) => t.section.id === sectionId && t.topic.id === topicId);
}
