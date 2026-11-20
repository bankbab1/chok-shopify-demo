import type { LucideIcon } from 'lucide-react';

export interface GuideImage {
  /** File name (without extension) under /public/guide. */
  id: string;
  /** Full image URL, for images outside /public/guide (e.g. a presentation slide). */
  src?: string;
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

/**
 * Lets the participant paste their own element class/ID; every `{{selector}}` in the code is
 * replaced with it (e.g. Shopify's per-store `button-custom--…` block class).
 */
export interface SelectorSpec {
  /** Example selector shown until the user types their own. */
  example: string;
  /** Prefer the class that starts with this when a whole class list / HTML tag is pasted. */
  prefer?: string;
  /** Short how-to-find-it hint. */
  hint?: string;
}

export interface KvRow {
  label: string;
  value: string;
  /** Optional external link for the value, e.g. the theme's Theme Store page. */
  link?: { label: string; url: string };
  /** Hide the link behind a small yellow dot (manual-first: let people find it themselves). */
  linkHidden?: boolean;
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
  | { type: 'specs'; title: string; rows: SpecRow[]; prompt?: PromptSpec }
  | { type: 'code'; title: string; lang: string; code: string; selector?: SelectorSpec }
  | {
      type: 'copylist';
      title: string;
      meta?: string;
      items: string[];
      prompt?: PromptSpec;
      /** Hide the prompt button behind a small dot next to the title (manual-first exercises). */
      promptHidden?: boolean;
      types?: string[];
    }
  /** Collapsible copy-ready prompt card (collapsed by default). */
  | { type: 'prompt'; prompt: PromptSpec }
  | { type: 'kv'; title?: string; rows: KvRow[]; prompt?: PromptSpec }
  /** `name` = the exact value to type into a Title/Name field, copied on its own. */
  | { type: 'richtext'; title: string; body: string; name?: string }
  | { type: 'note'; tone?: 'info' | 'warn'; text: string }
  | { type: 'link'; label: string; url: string; purpose?: string; fallbackPath?: string }
  | { type: 'product'; product: Product }
  /** Stock planner for the NovaStep products; generates a Sidekick prompt to set On hand. */
  | { type: 'inventory' }
  /** Per-product photo upload guide (main + variant images) with ZIP downloads. */
  | { type: 'upload-images' }
  /** Inventory glossary + interactive On hand / Available calculator. */
  | { type: 'inventory-terms' }
  /** Store vs Dev store vs Client transfer store comparison. */
  | { type: 'store-types' }
  /** Concept guide: how the theme editor works (templates, sections, blocks, settings). */
  | { type: 'theme-editor-guide' };

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
