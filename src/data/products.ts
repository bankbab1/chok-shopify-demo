import type { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    title: 'NovaStep AeroRun',
    photoBase: 'novastep-aerorun',
    description:
      'Lightweight everyday running shoes with responsive cushioning and breathable mesh upper. Designed for comfort from morning workouts to daily wear.',
    colors: ['Pink', 'Orange', 'Blue', 'Red'],
    sizes: ['6', '7', '8', '9', '10', '11', '12', '13'],
    price: '2,990.00',
    full_product_description:
      "Experience lightweight comfort with the all-new NovaStep AeroRun. Built for everyday movement, AeroRun combines a breathable engineered mesh upper with soft responsive cushioning to keep every step comfortable. Whether you're heading to the gym, commuting to work, or walking around the city, AeroRun delivers style and performance in one package.",
    features: [
      'Ultra-lightweight construction',
      'Breathable engineered mesh upper',
      'Responsive EVA cushioning',
      'Slip-resistant rubber outsole',
      'Padded heel for all-day comfort',
      'Suitable for running, walking, and everyday lifestyle',
    ],
    materials: ['Upper: Engineered Mesh', 'Midsole: EVA Foam', 'Outsole: Rubber'],
    weight: 'Approx. 285g (US Size 9)',
    care_instructions: ['Hand wash only', 'Air dry naturally', 'Avoid direct sunlight for extended periods'],
    gender: 'Unisex',
    story: {
      heading: 'Inspired by Everyday Motion',
      body: "NovaStep was founded with one simple idea: Great shoes shouldn't be reserved only for professional athletes.\n\nThe AeroRun project began with a team of footwear designers who wanted to create a sneaker that feels equally comfortable during a morning run, a busy workday, and an evening walk around the city. Instead of chasing trends, the design focuses on lightweight comfort, clean aesthetics, and versatile performance.\n\nEvery curve of the midsole and every layer of breathable mesh was carefully engineered to reduce fatigue while maintaining a modern silhouette.\n\nToday, AeroRun represents NovaStep's commitment to creating footwear that supports every journey—whether you're chasing fitness goals or simply enjoying everyday life.",
    },
    images: [
      { id: 'p034_0', caption: 'Product details' },
      { id: 'p034_1', caption: 'Product metafields' },
    ],
  },
  {
    title: 'NovaStep Elite Classic',
    photoBase: 'novastep-eliteclassic',
    description:
      'Premium leather golf shoes featuring waterproof protection, lightweight cushioning, and superior traction for every round.',
    colors: ['White', 'Black', 'Brown', 'Blue'],
    sizes: ['7', '8', '9', '10', '11', '12', '13'],
    price: '3,490.00',
    full_product_description:
      "Designed for golfers who appreciate timeless style without compromising performance. The NovaStep Elite Classic blends premium full-grain leather with modern comfort technology, delivering exceptional support from the first tee to the clubhouse. Its waterproof upper, cushioned midsole, and high-traction outsole ensure confidence on every step, while the classic silhouette transitions effortlessly beyond the course. Whether you're competing, practicing, or enjoying a casual round with friends, Elite Classic offers refined comfort all day long.",
    features: [
      'Premium full-grain leather upper',
      'Waterproof construction',
      'Lightweight EVA cushioning',
      'High-traction golf outsole',
      'Soft leather lining',
      'Classic lace-up design',
      'Comfortable for walking 18 holes',
    ],
    materials: [
      'Upper: Premium Full-Grain Leather',
      'Lining: Soft Leather',
      'Midsole: EVA Cushioning',
      'Outsole: High-Traction Rubber',
    ],
    weight: 'Approx. 390g (US 9)',
    care_instructions: [
      'Clean with a soft damp cloth',
      'Use leather conditioner regularly',
      'Air dry naturally',
      'Store in a cool, dry place',
      'Avoid prolonged exposure to direct sunlight',
    ],
    gender: 'Male',
    story: {
      heading: 'Tradition Meets Modern Performance',
      body: "Golf has always been a game of precision, patience, and timeless style. Inspired by classic golf footwear, the NovaStep design team set out to create a shoe that respects tradition while embracing modern performance technology.\n\nAfter months of prototyping and testing across various course conditions, Elite Classic was born—combining premium leather craftsmanship with lightweight cushioning and reliable traction. Every detail, from the waterproof leather upper to the supportive midsole and stable outsole, is engineered to provide confidence throughout every swing and every step.\n\nWhether you're walking the fairway at sunrise or heading to the clubhouse afterward, Elite Classic is designed to look as refined as it performs.",
    },
    images: [
      { id: 'p037_0', caption: 'Product details' },
      { id: 'p037_1', caption: 'Product metafields' },
    ],
  },
  {
    title: 'NovaStep Cloud Slide',
    photoBase: 'novastepcloudslide',
    description:
      'Ultra-soft everyday slides made with lightweight EVA foam for unmatched comfort at home, outdoors, or after workouts.',
    colors: ['Beige', 'Black', 'White', 'Green'],
    sizes: ['5', '6', '7', '8', '9', '10', '11', '12'],
    price: '2,290.00',
    full_product_description:
      "Experience all-day comfort with the NovaStep Cloud Slide, designed for effortless everyday wear. Crafted from lightweight EVA foam, Cloud Slide provides exceptional cushioning while maintaining a clean, minimalist design. Whether you're relaxing at home, heading to the beach, or recovering after a workout, these slides deliver soft support with every step. The ergonomic footbed and textured surface help keep your feet comfortable throughout the day, while the durable outsole provides reliable traction on a variety of surfaces.",
    features: [
      'One-piece molded EVA foam construction',
      'Ultra-lightweight design',
      'Soft cloud-like cushioning',
      'Ergonomic footbed for enhanced comfort',
      'Water-resistant material',
      'Anti-slip outsole',
      'Easy to clean',
      'Suitable for indoor and outdoor use',
    ],
    materials: ['Uppersole: EVA Foam', 'Midsole: EVA Foam', 'Outsole: EVA Foam'],
    weight: 'Approx. 220g (Size 9)',
    care_instructions: [
      'Rinse with clean water after use',
      'Wipe with a soft cloth',
      'Air dry naturally',
      'Do not expose to high heat for extended periods',
      'Store in a cool, dry place',
    ],
    gender: 'Unisex',
    story: {
      heading: 'Comfort Inspired by Every Step',
      body: "Modern lifestyles demand footwear that is simple, comfortable, and versatile. The NovaStep design team spent months refining a slide that delivers maximum comfort without unnecessary complexity.\n\nBy using a single-piece EVA foam construction, Cloud Slide offers a lightweight feel, excellent durability, and easy maintenance. The ergonomic shape naturally supports the foot while the cushioned sole absorbs impact, making it perfect for everyday activities—from relaxing at home to post-workout recovery or casual outings.\n\nCloud Slide reflects NovaStep's philosophy that comfort should be effortless, stylish, and accessible for everyone.",
    },
    images: [
      { id: 'p040_0', caption: 'Product details' },
      { id: 'p040_1', caption: 'Product metafields' },
    ],
  },
  {
    title: 'NovaStep Titan Pro',
    photoBase: 'novastep-titanpro',
    description:
      'Lightweight safety shoes with steel toe protection, slip-resistant outsole, and breathable upper for demanding work environments.',
    colors: ['Black', 'White', 'Beige', 'Red'],
    sizes: ['6', '7', '8', '9', '10', '11'],
    price: '4,590.00',
    full_product_description:
      "Built for professionals who demand both safety and comfort. The NovaStep Titan Pro combines industrial-grade protection with athletic-inspired comfort, making it ideal for construction sites, warehouses, manufacturing facilities, logistics operations, and maintenance work. Designed with a reinforced steel toe cap, puncture-resistant midsole, breathable mesh upper, and shock-absorbing outsole, Titan Pro keeps you protected without sacrificing all-day comfort. Whether you're lifting, walking, climbing, or standing for long hours, Titan Pro is engineered to perform.",
    features: [
      'Steel Toe Cap (200 Joules Protection)',
      'Slip-Resistant Rubber Outsole',
      'Breathable Mesh Upper',
      'Puncture-Resistant Midsole',
      'Shock-Absorbing EVA Cushion',
      'Oil & Abrasion Resistant Outsole',
      'Lightweight Construction',
      'Comfortable for Extended Wear',
    ],
    materials: [
      'Uppersole: Breathable Mesh + Synthetic Leather',
      'Toe Protection: Steel Toe Cap',
      'Midsole: EVA Cushion',
      'Mid Plate: Kevlar Puncture Resistant Plate',
      'Outsole: Rubber',
    ],
    weight: 'Approx. 680g (Size US 9)',
    care_instructions: [
      'Clean with a soft brush or damp cloth',
      'Air dry after use',
      'Do not machine wash',
      'Avoid prolonged exposure to direct sunlight',
      'Store in a dry, ventilated area',
    ],
    gender: 'Unisex',
    story: {
      heading: 'Engineered for Every Shift',
      body: "Every profession deserves footwear that works as hard as the people wearing it. NovaStep developed the Titan Pro after studying the daily challenges faced by warehouse operators, construction workers, technicians, and industrial professionals.\n\nThe goal was simple: create a safety shoe that delivers maximum protection while remaining comfortable enough for long shifts.\n\nTitan Pro combines modern athletic shoe comfort with certified workplace protection. The breathable upper helps reduce heat buildup, while the reinforced steel toe and puncture-resistant midsole provide confidence in demanding environments.\n\nFrom warehouse floors to construction sites, Titan Pro is built to protect every step.",
    },
    images: [
      { id: 'p043_0', caption: 'Product details' },
      { id: 'p043_1', caption: 'Product metafields' },
    ],
  },
];
