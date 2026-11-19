import type { LucideIcon } from 'lucide-react';

export interface GuideImage {
  /** File name (without extension) under /public/guide. */
  id: string;
  caption?: string;
}

export interface SpecRow {
  text: string;
  /** Shopify text style, e.g. "Heading 1" or "Custom". */
  style: string;
  color?: string;
  size?: string;
}

export interface Product {
  title: string;
  description: string;
  colors: string[];
  sizes: string[];
  price: string;
  full_product_description: string;
  features: string[];
  materials: string[];
  weight: string;
  care_instructions: string[];
  gender: string;
  story: { heading: string; body: string };
  /** Photo file prefix under /resources/products — `${photoBase}-${color}-img.jpg` and `-main-img.jpg`. */
  photoBase: string;
  images: GuideImage[];
}

/** A copy-ready prompt opened from a button in a modal (e.g. a Shopify Sidekick request). */
export interface PromptSpec {
  title: string;
  text: string;
  tip?: string;
}

export type Block =
  | { type: 'steps'; title?: string; items: string[] }
  | { type: 'images'; images: GuideImage[] }
  | { type: 'specs'; title: string; rows: SpecRow[] }
  | { type: 'code'; title: string; lang: string; code: string }
  | { type: 'copylist'; title: string; meta?: string; items: string[]; prompt?: PromptSpec }
  | { type: 'kv'; title?: string; rows: { label: string; value: string }[] }
  | { type: 'richtext'; title: string; body: string }
  | { type: 'note'; tone?: 'info' | 'warn'; text: string }
  | { type: 'link'; label: string; url: string; purpose?: string; fallbackPath?: string }
  | { type: 'product'; product: Product };

export interface Topic {
  id: string;
  title: string;
  /** Optional sub-heading shown in the sidebar above this topic (e.g. "Home" under Theme). */
  group?: string;
  summary?: string;
  /** Workshop/Test practice vs Production/Go-live guidance (spec FR-12). */
  tag?: 'workshop' | 'production';
  /** “You should now see…” verification checklist. */
  outcome?: string[];
  blocks: Block[];
}

export interface Section {
  id: string;
  title: string;
  icon: LucideIcon;
  summary: string;
  topics: Topic[];
}
