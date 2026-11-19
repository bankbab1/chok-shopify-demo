import { useState } from 'react';
import clsx from 'clsx';
import { Check, CheckSquare, Layers, Maximize2, Square } from 'lucide-react';
import { RESOURCE_GROUPS } from '../data/resources';
import { entriesFor } from '../pages/ResourcesPage';
import { ZipButton } from './ZipButton';
import { PromptButton } from './PromptButton';
import type { Resource, ResourceSet } from '../data/resources';
import { usePersistedState } from '../hooks/usePersistedState';
import { useT } from '../i18n';
import { ImagePreviewModal } from './ImagePreview';

const fileName = (url: string) => url.split('/').pop()!;

/** Public image URL on this site (Sidekick fetches it, so it must be reachable from the internet). */
const publicUrl = (r: Resource) => `${window.location.origin}${r.file}`;
const isLocal = () => /^(localhost|127\.|\[::1\])/.test(window.location.hostname);

const LOCAL_TIP = 'These links point to localhost, which Sidekick cannot reach — open this page on the live site to get working links.';

/**
 * Numbered image list for one product. In Shopify the FIRST media item is the featured image (★),
 * so the main image is spelled out as "Media position 1 — FEATURED" and colours as later positions.
 */
function imageLines(set: ResourceSet): string {
  const [main, ...colors] = set.items;
  return [
    `Media position 1 — FEATURED image (★, shown first on the store). Use this image and no other:\n   ${publicUrl(main)}`,
    ...colors.map(
      (c, i) =>
        `Media position ${i + 2} — ${c.title}: add to the media, then set it as the variant image for every variant where Color = ${c.title} (all sizes). Not the featured image.\n   ${publicUrl(c)}`,
    ),
  ].join('\n');
}

const MEDIA_RULES = `- Add the images one at a time, in exactly the order listed, so the Media order matches the positions.
- The featured image (★, Media position 1) must be the "Media position 1" image. A color image must never become the featured image.
- When all images are added, check the Media order. If the position 1 image is not first, reorder the media so it is. Setting variant images must not change the featured image.
- Assign each color image to all variants of that color, across every size.
- If an image from these links is already in the product's Media, reuse it instead of adding a duplicate. Keep any other existing images.
- Do not change prices, titles, options or any other product data.`;

/** Copy-ready Sidekick request for one product. */
export function imagesPrompt(set: ResourceSet): string {
  return `Please add product images to **${set.title}** from the public image links below.

${imageLines(set)}

**Requirements:**
${MEDIA_RULES}
- If you cannot assign variant images or reorder the media, add the media anyway and tell me which steps need manual action.

Then show me the final Media order (position → image) and which variants got which image, so I can review and save.`;
}

/** Copy-ready Sidekick request for several products at once. */
export function bulkImagesPrompt(sets: ResourceSet[]): string {
  const sections = sets.map((s, i) => `## ${i + 1}. ${s.title}\n${imageLines(s)}`).join('\n\n');
  const images = sets.reduce((n, s) => n + s.items.length, 0);
  return `Please add product images to the ${sets.length} products below (${images} images in total) from the public image links. Finish one product completely before starting the next.

${sections}

**Requirements (apply to each product):**
${MEDIA_RULES}
- If you cannot finish a product, assign its variant images or reorder its media, continue with the others and tell me which steps need manual action.

Then show me, per product, the final Media order (position → image) and which variants got which image, so I can review and save.`;
}

/** Small yellow dot that reveals a hidden shortcut (manual-first exercises). */
function RevealDot({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  const t = useT();
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={t('Show shortcut')}
      aria-pressed={on}
      className={clsx(
        'h-2.5 w-2.5 shrink-0 rounded-full transition hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2',
        on ? 'bg-amber-500' : 'bg-amber-300 hover:bg-amber-400',
      )}
    />
  );
}

/** Bulk prompt: pick which products to include (default: all except the first, which is done by hand). */
function BulkImagesPrompt({ sets }: { sets: ResourceSet[] }) {
  const t = useT();
  const [picked, setPicked] = usePersistedState<string[]>(
    'sdp-upload-bulk',
    sets.slice(1).map((s) => s.id),
  );
  const chosen = sets.filter((s) => picked.includes(s.id));
  const images = chosen.reduce((n, s) => n + s.items.length, 0);
  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <div className="overflow-hidden rounded-xl border border-indigo-200 bg-white dark:border-indigo-400/30 dark:bg-slate-900">
      <div className="flex flex-wrap items-center gap-3 bg-indigo-50/60 px-4 py-3 dark:bg-indigo-500/10">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
          <Layers size={16} />
        </span>
        <div className="min-w-0 flex-1 basis-56">
          <div className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">{t('Bulk upload with Sidekick')}</div>
          <div className="text-xs text-indigo-800/70 dark:text-indigo-200/70">
            {t('Did the first product by hand? Send the rest in one prompt.')}
          </div>
        </div>
        {chosen.length > 0 ? (
          <PromptButton
            prompt={{
              title: `Sidekick prompt – Images: ${chosen.length} products`,
              text: bulkImagesPrompt(chosen),
              tip: isLocal()
                ? LOCAL_TIP
                : 'Paste this into Shopify Sidekick. It fetches each image link and prepares the photos product by product for your review — click Save when it looks right. Check each product’s color variants afterwards.',
            }}
          />
        ) : (
          <span className="text-xs text-slate-400">{t('Select at least one product')}</span>
        )}
      </div>

      <div className="space-y-3 px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {sets.map((s, i) => {
            const on = picked.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggle(s.id)}
                aria-pressed={on}
                className={clsx(
                  'inline-flex h-9 items-center gap-2 rounded-full border pl-2 pr-3 text-sm transition active:scale-95',
                  on
                    ? 'border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500'
                    : 'border-slate-200 text-slate-600 hover:border-indigo-300 dark:border-white/10 dark:text-slate-300',
                )}
              >
                <span
                  className={clsx(
                    'flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold',
                    on ? 'bg-white/25' : 'bg-slate-100 dark:bg-white/10',
                  )}
                >
                  {on ? <Check size={12} strokeWidth={3} /> : i + 1}
                </span>
                {s.title.replace(/^NovaStep\s+/, '')}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
          <span className="tabular-nums">{t('{p} products · {n} images selected', { p: chosen.length, n: images })}</span>
          <span className="text-slate-300 dark:text-slate-600">|</span>
          <button type="button" onClick={() => setPicked(sets.slice(1).map((s) => s.id))} className="font-semibold text-indigo-700 hover:underline dark:text-indigo-300">
            {t('Skip the first (done by hand)')}
          </button>
          <button type="button" onClick={() => setPicked(sets.map((s) => s.id))} className="font-semibold text-indigo-700 hover:underline dark:text-indigo-300">
            {t('Select all')}
          </button>
          <button type="button" onClick={() => setPicked([])} className="font-semibold text-indigo-700 hover:underline dark:text-indigo-300">
            {t('Clear')}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Bulk Sidekick prompt on top, then one card per product: which photo goes where (main image →
 * Media first, colour photo → that colour's variants), a per-product ZIP, a hidden per-product
 * prompt (yellow dot), and two self-check ticks that persist in this browser.
 */
export function UploadImagesGuide() {
  const t = useT();
  const group = RESOURCE_GROUPS.find((g) => g.id === 'products')!;
  const [checks, setChecks] = usePersistedState<Record<string, boolean>>('sdp-upload-checks', {});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [preview, setPreview] = useState<{ set: string; index: number } | null>(null);
  const toggle = (k: string) => setChecks((c) => ({ ...c, [k]: !c[k] }));

  return (
    <div className="space-y-4">
      <BulkImagesPrompt sets={group.sets} />

      {group.sets.map((set) => {
        const [main, ...variants] = set.items;
        const ticks = [
          { key: `${set.id}:media`, label: t('All photos uploaded to Media (main image first)') },
          { key: `${set.id}:variants`, label: t('Each color variant has its photo') },
        ];
        const done = ticks.every((x) => checks[x.key]);
        return (
          <div key={set.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900">
            <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3 dark:border-white/10">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 font-semibold">
                  {set.title}
                  <RevealDot on={!!revealed[set.id]} onToggle={() => setRevealed((r) => ({ ...r, [set.id]: !r[set.id] }))} />
                  {done && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200">
                      {t('Done ✓')}
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {t('{n} files', { n: set.items.length })} · {t('1 main + {v} color photos', { v: variants.length })}
                </div>
              </div>
              {revealed[set.id] && (
                <PromptButton
                  prompt={{
                    title: `Sidekick prompt – Images: ${set.title}`,
                    text: imagesPrompt(set),
                    tip: isLocal()
                      ? LOCAL_TIP
                      : 'Paste this into Shopify Sidekick. It fetches each image link and prepares the photos for your review — click Save when it looks right. Check that each color variant shows the right photo.',
                  }}
                />
              )}
              <ZipButton
                name={`${set.folder}.zip`}
                label="Download product (ZIP)"
                entries={() => entriesFor(group, set, '').map((e) => ({ ...e, path: fileName(e.url) }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-5">
              {[main, ...variants].map((r, i) => (
                <figure key={r.file} className="overflow-hidden rounded-lg border border-slate-200 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setPreview({ set: set.id, index: i })}
                    aria-label={`${t('Preview')} — ${set.title} ${r.title}`}
                    className="group relative block aspect-square w-full cursor-zoom-in bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 dark:bg-slate-950"
                  >
                    <img src={r.file} alt={`${set.title} — ${r.title}`} loading="lazy" className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
                    <span className="absolute bottom-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white opacity-0 transition group-hover:opacity-100">
                      <Maximize2 size={13} />
                    </span>
                    <span
                      className={clsx(
                        'absolute left-1.5 top-1.5 rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white',
                        i === 0 ? 'bg-indigo-600' : 'bg-black/60',
                      )}
                    >
                      {i === 0 ? t('Media #1') : t('Variant')}
                    </span>
                  </button>
                  <figcaption className="flex flex-col gap-1 px-2 py-1.5 text-[11px] leading-tight">
                    <div className="font-semibold">{i === 0 ? t('Main image') : r.title}</div>
                    <div className="text-slate-500 dark:text-slate-400">
                      {i === 0 ? t('Upload first — featured image') : t('Assign to every “{c}” variant', { c: r.title })}
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-slate-100 px-4 py-3 text-sm dark:border-white/10">
              {ticks.map((x) => (
                <button key={x.key} type="button" onClick={() => toggle(x.key)} aria-pressed={!!checks[x.key]} className="flex items-center gap-2 text-left">
                  {checks[x.key] ? (
                    <CheckSquare size={17} className="shrink-0 text-indigo-600 dark:text-indigo-300" />
                  ) : (
                    <Square size={17} className="shrink-0 text-slate-400" />
                  )}
                  <span className={clsx(checks[x.key] && 'text-slate-500 line-through dark:text-slate-400')}>{x.label}</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {(() => {
        const set = preview && group.sets.find((x) => x.id === preview.set);
        return (
          <ImagePreviewModal
            heading={set?.title}
            images={(set?.items ?? []).map((r, i) => ({
              src: r.file,
              title: i === 0 ? t('Main image') : r.title,
              badge: i === 0 ? t('Media #1') : t('Variant'),
              subtitle: i === 0 ? t('Upload first — featured image') : t('Assign to every “{c}” variant', { c: r.title }),
            }))}
            index={set ? preview!.index : null}
            onIndex={(index) => setPreview((p) => (p ? { ...p, index } : p))}
            onClose={() => setPreview(null)}
          />
        );
      })()}
    </div>
  );
}
