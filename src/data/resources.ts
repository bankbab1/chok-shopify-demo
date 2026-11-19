export interface Resource {
  title: string;
  file: string;
  /** Where in the workshop this asset is uploaded. */
  usedIn: string;
}

/** A folder of files. In the ZIP download each set becomes its own folder. */
export interface ResourceSet {
  id: string;
  title: string;
  /** Folder name inside the ZIP. */
  folder: string;
  items: Resource[];
}

export interface ResourceGroup {
  id: string;
  title: string;
  description: string;
  /** Top-level folder name inside the ZIP. */
  folder: string;
  /** Sub-folders (e.g. one per product). Groups without sub-folders have a single set. */
  sets: ResourceSet[];
}

const r = (file: string, title: string, usedIn: string): Resource => ({ file: `/resources/${file}`, title, usedIn });

const product = (id: string, base: string, name: string, colors: string[]): ResourceSet => ({
  id,
  title: `NovaStep ${name}`,
  folder: `NovaStep ${name}`,
  items: [
    r(`products/${base}-main-img.jpg`, 'Main image', `Products → ${name} → Media`),
    ...colors.map((c) => r(`products/${base}-${c.toLowerCase()}-img.jpg`, c, `Products → ${name} → Variant ${c}`)),
  ],
});

export const RESOURCE_GROUPS: ResourceGroup[] = [
  {
    id: 'brand',
    title: 'Brand logo',
    description: 'NovaStep logo for Theme settings → Logo and favicon.',
    folder: '01 Brand Logo',
    sets: [
      {
        id: 'brand',
        title: 'Brand logo',
        folder: '',
        items: [
          r('brand-logo/mockup-logo-ns.png', 'NovaStep logo (default)', 'Theme settings → Logo → Default logo'),
          r('brand-logo/mockup-logo-ns-i.png', 'NovaStep logo (inverse)', 'Theme settings → Logo → Inverse logo'),
        ],
      },
    ],
  },
  {
    id: 'products',
    title: 'Product photos',
    description: 'Main and per-color images for the four demo products.',
    folder: '02 Products',
    sets: [
      product('aerorun', 'novastep-aerorun', 'AeroRun', ['Pink', 'Orange', 'Blue', 'Red']),
      product('elite-classic', 'novastep-eliteclassic', 'Elite Classic', ['White', 'Black', 'Brown', 'Blue']),
      product('cloud-slide', 'novastepcloudslide', 'Cloud Slide', ['Beige', 'Black', 'White', 'Green']),
      product('titan-pro', 'novastep-titanpro', 'Titan Pro', ['Black', 'White', 'Beige', 'Red']),
    ],
  },
  {
    id: 'page-heroes',
    title: 'Page hero images',
    description: 'Background images for the Hero sections of each page.',
    folder: '03 Page Heroes',
    sets: [
      {
        id: 'page-heroes',
        title: 'Page hero images',
        folder: '',
        items: [
          r('home/home-hero-img.jpg', 'Home — hero', 'Theme → Home → Hero'),
          r('home/home-alt-img.jpg', 'Home — image with text', 'Theme → Home → Image with Text'),
          r('products/products-hero-img.jpg', 'Products — hero', 'Theme → Products / collection hero'),
          r('contactus/contact-us-hero-img.jpg', 'Contact Us — hero', 'Theme → Contact Us → Hero'),
          r('storelocation/store-location-hero-img.jpg', 'Store Location — hero', 'Theme → Store Location → Hero'),
        ],
      },
    ],
  },
  {
    id: 'about-us',
    title: 'About Us images',
    description: 'Values for the Page image metafields (about_us_*_img).',
    folder: '04 About Us',
    sets: [
      {
        id: 'about-us',
        title: 'About Us images',
        folder: '',
        items: [
          r('aboutus/about-us-hero-img.jpg', 'about_us_hero_img', 'Pages → About us → metafield'),
          r('aboutus/about-us-our-story-img.jpg', 'about_us_our_story_img', 'Pages → About us → metafield'),
          r('aboutus/about-us-brand-history-img.jpg', 'about_us_brand_history_img', 'Pages → About us → metafield'),
          r('aboutus/about-us-the-founder-img.jpg', 'about_us_the_founder_img', 'Pages → About us → metafield'),
          r('aboutus/about-us-our-innovation-img.jpg', 'about_us_innovation_img', 'Pages → About us → metafield'),
        ],
      },
    ],
  },
];

export const groupFileCount = (g: ResourceGroup) => g.sets.reduce((n, s) => n + s.items.length, 0);
