export interface Faq {
  q: string;
  a: string;
  /** Optional topic path to jump back to. */
  link?: { label: string; to: string };
}

export const FAQS: { category: string; items: Faq[] }[] = [
  {
    category: 'Access & navigation',
    items: [
      {
        q: 'I can’t log in to the Dev Dashboard or Shopify Admin.',
        a: 'Make sure you’re signed in with the Shopify account the workshop store was created under. Try a private window if another Shopify account is already signed in. Store access and permissions depend on who created or invited you to the store.',
      },
      {
        q: 'The menu in Shopify looks different from the screenshots.',
        a: 'Shopify updates its Admin regularly. Use the search bar at the top of Shopify Admin and type the setting name shown in the step (e.g. “Markets”, “Metafields and metaobjects”) — it’s usually the quickest way to the same screen.',
      },
      {
        q: 'A link opened Shopify Admin but not the exact page.',
        a: 'Store-specific Admin pages need your store context, so the guide links to the Admin entry point. Follow the navigation path shown under the link (e.g. Settings → Markets).',
      },
    ],
  },
  {
    category: 'Metafields & Sidekick',
    items: [
      {
        q: 'Sidekick couldn’t create the metafield definitions.',
        a: 'Sidekick’s abilities can vary by store and permissions. Create the definitions manually: Settings → Metafields and metaobjects → Pages → Add definition, enter the name and choose Rich text. Always confirm the definitions are listed in Admin.',
        link: { label: 'Page – Text Metafields', to: '/metafields/page-text-metafields' },
      },
      {
        q: 'The metafield key is different from the name I typed.',
        a: 'Shopify generates the namespace and key from the display name — spaces and capitals are usually converted (e.g. custom.about_us_brand_history). Use the key that Admin shows when connecting dynamic sources in the theme.',
      },
      {
        q: 'My metafield doesn’t show up in the theme editor’s dynamic source picker.',
        a: 'Check that the definition’s type matches the setting (a Rich text metafield won’t appear for an image setting) and that the page or product actually uses the template you’re editing.',
      },
    ],
  },
  {
    category: 'Payments & orders',
    items: [
      {
        q: 'I can’t find the test payment provider.',
        a: 'Go to Settings → Payments → Payment providers and look for the testing option. Availability can depend on store type and plan — ask the instructor if it’s missing.',
        link: { label: 'Activate Test Payment', to: '/payments/test-payment' },
      },
      {
        q: 'Is the test order a real payment?',
        a: 'No. The test gateway only simulates payments for practice. Accepting real payments requires a paid plan, a live payment provider and its verification.',
      },
    ],
  },
  {
    category: 'This guide',
    items: [
      {
        q: 'The Copy button doesn’t work.',
        a: 'Your browser may block clipboard access (common on http:// or inside some embedded browsers). Select the text manually and press Ctrl+C (⌘C on Mac).',
      },
      {
        q: 'My progress disappeared.',
        a: 'Progress is saved only in this browser on this device. Clearing site data, using a private window or switching devices starts fresh. Progress is self-marked — it doesn’t check your Shopify store.',
      },
    ],
  },
];
