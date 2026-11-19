/**
 * Real Shopify stores to show during the session.
 * NOTE: everything here ships in the public bundle — the storefront password below is a
 * pre-launch preview password meant to be shared with workshop participants, not a credential.
 */
export interface ExampleStore {
  id: string;
  name: string;
  url: string;
  category: string;
  /** Short badges, e.g. "Headless", "Hydrogen". */
  tags: string[];
  description: string;
  points: string[];
  /** Storefront password page (store not launched yet). */
  password?: string;
}

export const EXAMPLE_STORES: ExampleStore[] = [
  {
    id: 'cher',
    name: 'Cher Skincare',
    url: 'https://cherskincare.com',
    category: 'Skincare',
    tags: ['Headless Shopify', 'Hydrogen (React)'],
    description:
      'A headless Shopify store: the storefront is built with Hydrogen, Shopify’s React framework, instead of a Liquid theme.',
    points: [
      'No .liquid theme files — the whole frontend is a React app built with Hydrogen',
      'Shopify still runs products, inventory, cart, checkout and orders in the back end',
      'The frontend reads store data through Shopify’s Storefront API',
      'Full design freedom, but it needs developers to build and maintain',
    ],
  },
  {
    id: 'tada',
    name: 'Tada Parfumeur',
    url: 'https://tadaparfumeur.com/en-th',
    category: 'Fragrance',
    tags: ['Pre-launch', 'Password protected'],
    description: 'Not live yet — the storefront is behind Shopify’s password page. Copy the password, open the site, and paste it to enter.',
    points: [
      'Shopify shows a password page until a store goes live',
      'The /en-th path is a Markets URL: English language, Thailand market',
      'Good example of reviewing a store with the team before launch',
    ],
    password: 'rtogay',
  },
];
