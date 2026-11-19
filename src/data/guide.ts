import {
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

const PRODUCT_METAFIELDS: { key: string; page: string }[] = [
  { key: 'story', page: 'p014_1' },
  { key: 'gender', page: 'p015_0' },
  { key: 'care_instructions', page: 'p016_0' },
  { key: 'weight', page: 'p017_0' },
  { key: 'materials', page: 'p018_0' },
  { key: 'features', page: 'p019_0' },
  { key: 'full_product_description', page: 'p020_0' },
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

const IMAGE_WITH_TEXT_CSS = `.button-custom--Aakg1TzlHWGNWeXFLb__button_eygrzd {
  border-radius: 0;
}
.button-custom--Aakg1TzlHWGNWeXFLb__button_eygrzd:hover {
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

const productTopics: Topic[] = PRODUCTS.map((p) => ({
  id: p.title.toLowerCase().replace(/^novastep\s+/, '').replace(/\s+/g, '-'),
  title: p.title.replace(/^NovaStep\s+/, ''),
  summary: p.description,
  blocks: [{ type: 'product', product: p }],
}));

export const SECTIONS: Section[] = [
  {
    id: 'create-store',
    title: 'Create Store',
    icon: Store,
    summary: 'Spin up a new development store from the Shopify Dev Dashboard.',
    topics: [
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
    topics: productTopics,
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
          { type: 'kv', rows: [{ label: 'Theme', value: 'Horizon' }] },
          {
            type: 'steps',
            title: 'Pages to build',
            items: ['Home', 'About Us', 'Contact Us', 'Store Location'],
          },
          { type: 'images', images: [img('p047_0', 'Horizon theme')] },
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
            rows: [
              { label: 'Logo position', value: 'Center' },
              { label: 'Menu position', value: 'Left · Row: Top' },
              { label: 'Search icon', value: 'On · Right · Top' },
              { label: 'Home page', value: 'Transparent background + Inverse logo' },
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
          { type: 'images', images: [img('p052_0', 'Typography'), img('p052_1', 'Color schemes'), img('p053_0', 'Color scheme detail')] },
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
          { type: 'specs', title: 'Heading', rows: [{ text: 'ALL PRODUCTS', style: 'Heading 2', color: '#545454' }] },
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
          { type: 'code', title: 'Custom CSS – Image with Text', lang: 'css', code: IMAGE_WITH_TEXT_CSS },
          { type: 'images', images: [img('p057_0', 'Image with text'), img('p058_0', 'Custom CSS')] },
        ],
      },
      {
        id: 'featured-product',
        group: 'Home',
        title: 'Featured Product',
        blocks: [
          { type: 'specs', title: 'Heading', rows: [{ text: 'NEW ARRIVAL', style: 'Heading 2', color: '#545454' }] },
          { type: 'images', images: [img('p059_0', 'Featured product')] },
        ],
      },
      {
        id: 'footer',
        group: 'Home',
        title: 'Footer',
        blocks: [
          {
            type: 'specs',
            title: 'Footer text',
            rows: [
              { text: 'JOIN US', style: 'Heading 2', color: '#DFDFDF' },
              { text: 'Get exclusive deals and early access to new products.', style: 'Custom', color: '#DFDFDF', size: '16px' },
            ],
          },
          { type: 'images', images: [img('p060_0', 'Footer')] },
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
          { type: 'richtext', title: 'Page content (Title: About us)', body: ABOUT_US_PAGE_CONTENT },
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
          ...ABOUT_US_RICHTEXT.map((r) => ({ type: 'richtext' as const, title: r.title, body: r.body })),
          { type: 'images', images: [img('p064_0', 'Page metafields filled')] },
        ],
      },
      {
        id: 'about-sections',
        group: 'About Us',
        title: 'Sections',
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
        group: 'Contact & Location',
        title: 'Contact Us',
        summary: 'Template + page with custom HTML content.',
        blocks: [
          { type: 'steps', items: ['Create Template: Contact Us', 'Create Page: Contact (Title: Contact)', 'Paste the HTML below into Content (HTML view)', 'Map the page to the template'] },
          { type: 'code', title: 'Page content (HTML)', lang: 'html', code: contactHtml },
          { type: 'images', images: [img('p074_0', 'Contact template'), img('p075_0', 'Contact page'), img('p077_0', 'Map to template')] },
        ],
      },
      {
        id: 'store-location',
        group: 'Contact & Location',
        title: 'Store Location',
        summary: 'Hero + Custom Liquid store locator with Google Maps.',
        blocks: [
          { type: 'steps', items: ['Create Page: Store Location', 'Add section: Hero – Bottom align', 'Add Page / Block: Custom Liquid and paste the code below', 'Add the page Custom CSS'] },
          { type: 'specs', title: 'Hero – Bottom align', rows: [{ text: 'STORE LOCATION', style: 'Heading 1', color: '#EEEEEE' }] },
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
    id: 'inventory',
    title: 'Inventory',
    icon: Boxes,
    summary: 'Manual adjustment and CSV bulk import.',
    topics: [
      {
        id: 'manual-adjust',
        title: 'Manual Adjust',
        blocks: [
          { type: 'steps', items: ['Go to “Inventory”', 'Specify inventory balance “On hand”', 'Click “Save”'] },
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
    id: 'payments',
    title: 'Payments & Test Order',
    icon: CreditCard,
    summary: 'Activate the test gateway and place a test order.',
    topics: [
      {
        id: 'test-payment',
        title: 'Activate Test Payment',
        tag: 'workshop',
        outcome: ['The test payment provider shows as “Activated”'],
        blocks: [
          {
            type: 'note',
            tone: 'warn',
            text: 'Workshop/Test only: the test gateway simulates payments — no real money moves. Going live needs a paid plan, a real payment provider and its verification; check current Shopify rules for your store type.',
          },
          {
            type: 'steps',
            items: ['Go to “Settings”', 'Click on “Payments”', 'Choose “Payment providers”', 'Select “For Testing”', 'Click “Activate”', 'Done — “Activated”'],
          },
          { type: 'images', images: [img('p101_0'), img('p101_1'), img('p102_0', 'Activated')] },
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
              'Enter “1” into “Credit Card number” (Bogus gateway)',
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
