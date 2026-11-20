/**
 * Public address of the deployed portal. Sidekick fetches image links from the internet, so
 * prompts must never contain localhost links — when the page is opened on a dev server we fall
 * back to the live site, which serves the same /resources files.
 */
export const PUBLIC_SITE = 'https://chok-shopify-demo.chokchai-ecs.workers.dev';

export function publicOrigin(): string {
  return /^(localhost|127\.|\[::1\])/.test(window.location.hostname) ? PUBLIC_SITE : window.location.origin;
}
