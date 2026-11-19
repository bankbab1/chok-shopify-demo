export interface Resource {
  title: string;
  file: string;
  /** Where in the workshop this asset is uploaded. */
  usedIn: string;
}

export interface ResourceGroup {
  id: string;
  title: string;
  description: string;
  items: Resource[];
}

const r = (file: string, title: string, usedIn: string): Resource => ({ file: `/resources/${file}`, title, usedIn });

const productPhotos = (base: string, name: string, colors: string[]): Resource[] => [
  r(`products/${base}-main-img.jpg`, `${name} — main`, `Products → ${name} → Media`),
  ...colors.map((c) => r(`products/${base}-${c.toLowerCase()}-img.jpg`, `${name} — ${c}`, `Products → ${name} → Variant ${c}`)),
];

export const RESOURCE_GROUPS: ResourceGroup[] = [
  {
    id: 'brand',
    title: 'Brand logo',
    description: 'NovaStep logo for Theme settings → Logo and favicon.',
    items: [
      r('brand-logo/mockup-logo-ns.png', 'NovaStep logo (default)', 'Theme settings → Logo → Default logo'),
      r('brand-logo/mockup-logo-ns-i.png', 'NovaStep logo (inverse)', 'Theme settings → Logo → Inverse logo'),
    ],
  },
  {
    id: 'products',
    title: 'Product photos',
    description: 'Main and per-color images for the four demo products.',
    items: [
      ...productPhotos('novastep-aerorun', 'AeroRun', ['Pink', 'Orange', 'Blue', 'Red']),
      ...productPhotos('novastep-eliteclassic', 'Elite Classic', ['White', 'Black', 'Brown', 'Blue']),
      ...productPhotos('novastepcloudslide', 'Cloud Slide', ['Beige', 'Black', 'White', 'Green']),
      ...productPhotos('novastep-titanpro', 'Titan Pro', ['Black', 'White', 'Beige', 'Red']),
    ],
  },
  {
    id: 'page-heroes',
    title: 'Page hero images',
    description: 'Background images for the Hero sections of each page.',
    items: [
      r('home/home-hero-img.jpg', 'Home — hero', 'Theme → Home → Hero'),
      r('home/home-alt-img.jpg', 'Home — image with text', 'Theme → Home → Image with Text'),
      r('products/products-hero-img.jpg', 'Products — hero', 'Theme → Products / collection hero'),
      r('contactus/contact-us-hero-img.jpg', 'Contact Us — hero', 'Theme → Contact Us → Hero'),
      r('storelocation/store-location-hero-img.jpg', 'Store Location — hero', 'Theme → Store Location → Hero'),
    ],
  },
  {
    id: 'about-us',
    title: 'About Us images',
    description: 'Values for the Page image metafields (about_us_*_img).',
    items: [
      r('aboutus/about-us-hero-img.jpg', 'about_us_hero_img', 'Pages → About us → metafield'),
      r('aboutus/about-us-our-story-img.jpg', 'about_us_our_story_img', 'Pages → About us → metafield'),
      r('aboutus/about-us-brand-history-img.jpg', 'about_us_brand_history_img', 'Pages → About us → metafield'),
      r('aboutus/about-us-the-founder-img.jpg', 'about_us_the_founder_img', 'Pages → About us → metafield'),
      r('aboutus/about-us-our-innovation-img.jpg', 'about_us_innovation_img', 'Pages → About us → metafield'),
    ],
  },
];
