import { useState } from 'react';
import clsx from 'clsx';
import { AlertTriangle, Check, ChevronDown, Code2, Copy, Download, ExternalLink, Info, ListChecks, Sparkles } from 'lucide-react';
import type { Block, Product, PromptSpec, SelectorSpec, SpecRow } from '../data/types';
import { usePersistedState } from '../hooks/usePersistedState';
import { Card, CardHeader, CopyButton, ImageGrid, Modal, RichLine, copyText } from './ui';
import { useT } from '../i18n';

export function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case 'steps':
      return <Steps title={block.title} items={block.items} />;
    case 'images':
      return <ImageGrid images={block.images} />;
    case 'specs':
      return <Specs title={block.title} rows={block.rows} />;
    case 'code':
      return <CodeBlock title={block.title} lang={block.lang} code={block.code} selector={block.selector} />;
    case 'copylist':
      return <CopyList title={block.title} meta={block.meta} items={block.items} prompt={block.prompt} />;
    case 'kv':
      return <KeyValues title={block.title} rows={block.rows} />;
    case 'richtext':
      return <RichText title={block.title} body={block.body} />;
    case 'note':
      return <Note tone={block.tone} text={block.text} />;
    case 'link':
      return <LinkCard label={block.label} url={block.url} purpose={block.purpose} fallbackPath={block.fallbackPath} />;
    case 'product':
      return <ProductCard product={block.product} />;
  }
}

/* ---------------------------------------------------------------- Link */

function LinkCard({ label, url, purpose, fallbackPath }: { label: string; url: string; purpose?: string; fallbackPath?: string }) {
  const t = useT();
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-900">
      <div className="min-w-0 flex-1 basis-56">
        <div className="text-xs text-slate-500 dark:text-slate-400">{t(purpose ?? 'Opens in a new tab — this guide stays open.')}</div>
        {fallbackPath && (
          <div className="mt-1 text-sm">
            <span className="text-slate-500 dark:text-slate-400">{t('Then go to ')}</span>
            <span className="font-medium">{fallbackPath}</span>
          </div>
        )}
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full bg-indigo-600 px-4 text-xs font-semibold text-white transition hover:bg-indigo-700 dark:bg-indigo-500 dark:text-white dark:hover:bg-indigo-400"
      >
        {t(label)}
        <ExternalLink size={13} />
      </a>
    </div>
  );
}

/* ---------------------------------------------------------------- Steps */

function Steps({ title, items }: { title?: string; items: string[] }) {
  const t = useT();
  // Click-to-tick: lets the presenter track where they are during a live demo (not persisted).
  const [ticked, setTicked] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setTicked((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });
  return (
    <Card>
      <CardHeader
        title={
          <span className="flex items-center gap-2">
            <ListChecks size={16} className="text-slate-400" /> {t(title ?? 'Steps')}
          </span>
        }
        meta={t('Click a step to tick it off while presenting')}
      />
      <ol className="divide-y divide-slate-100 dark:divide-white/5">
        {items.map((item, i) => {
          const on = ticked.has(i);
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-pressed={on}
                className="flex w-full items-start gap-3 px-4 py-3 text-left text-sm transition hover:bg-slate-50 dark:hover:bg-white/5"
              >
                <span
                  className={clsx(
                    'mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums transition',
                    on
                      ? 'bg-indigo-600 text-white dark:bg-indigo-500 dark:text-white'
                      : 'border border-slate-300 text-slate-500 dark:border-white/20 dark:text-slate-300',
                  )}
                >
                  {on ? <Check size={13} /> : i + 1}
                </span>
                <span className={clsx('leading-6', on && 'text-slate-400 line-through decoration-slate-300 dark:text-slate-500')}>
                  <RichLine text={t(item)} />
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

/* ---------------------------------------------------------------- Specs */

const STYLE_SIZE: Record<string, string> = {
  'Heading 1': 'text-3xl sm:text-4xl font-bold tracking-tight',
  'Heading 2': 'text-2xl sm:text-3xl font-bold tracking-tight',
  'Heading 3': 'text-xl sm:text-2xl font-semibold',
  'Heading 4': 'text-base font-medium',
};

function isLight(hex?: string) {
  if (!hex) return false;
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((o) => parseInt(h.slice(o, o + 2), 16));
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.72;
}

function Specs({ title, rows }: { title: string; rows: SpecRow[] }) {
  const t = useT();
  const darkPreview = rows.some((r) => isLight(r.color));
  return (
    <Card>
      <CardHeader title={t(title)} meta={t('Text, style and color as configured in the theme editor')} />
      <div className={clsx('space-y-3 px-5 py-6', darkPreview ? 'bg-[#2b2b2b]' : 'bg-[#fafaf8] dark:bg-[#f2f2ef]')}>
        {rows.map((r, i) => (
          <div
            key={i}
            className={clsx(STYLE_SIZE[r.style] ?? 'text-base', r.style.startsWith('Button') && 'inline-block border px-5 py-2.5 text-sm font-semibold tracking-wide')}
            style={r.style.startsWith('Button') ? { background: r.color, borderColor: r.color, color: '#fff' } : { color: r.color, fontSize: r.size }}
          >
            {r.text}
          </div>
        ))}
      </div>
      <div className="divide-y divide-slate-100 dark:divide-white/5">
        {rows.map((r, i) => (
          <div key={i} className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 text-xs">
            <div className="flex min-w-0 flex-1 basis-56 items-center gap-2">
              <span className="min-w-0 text-[13px] font-medium leading-snug text-slate-800 dark:text-slate-100">{r.text}</span>
              <CopyButton text={r.text} compact />
            </div>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600 dark:bg-white/10 dark:text-slate-300">{r.style}</span>
            {r.size && <span className="rounded-full bg-slate-100 px-2 py-0.5 tabular-nums text-slate-600 dark:bg-white/10 dark:text-slate-300">{r.size}</span>}
            {r.color && <ColorChip color={r.color} />}
          </div>
        ))}
      </div>
    </Card>
  );
}

/** Swatch + hex as one button: click copies the colour code. */
function ColorChip({ color }: { color: string }) {
  const t = useT();
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() =>
        void copyText(color).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        })
      }
      title={t('Copy color {c}', { c: color })}
      aria-label={t('Copy color {c}', { c: color })}
      className={clsx(
        'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border pl-1.5 pr-2.5 font-mono text-xs transition active:scale-95',
        copied
          ? 'border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200'
          : 'border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10',
      )}
    >
      <span className="h-5 w-5 rounded-full border border-black/10 dark:border-white/20" style={{ background: color }} />
      {copied ? t('Copied') : color}
      {copied ? <Check size={12} /> : <Copy size={12} className="text-slate-400" />}
    </button>
  );
}

/* ---------------------------------------------------------------- Code */

/**
 * Turns whatever the user pasted into a CSS selector:
 * "button-custom--x", ".button-custom--x", "#id", 'class="button button-custom--x"', or a whole HTML tag.
 */
export function toSelector(raw: string, prefer?: string): string {
  let v = raw.trim();
  if (!v) return '';
  const classAttr = v.match(/class\s*=\s*["']([^"']+)["']/i);
  const idAttr = v.match(/(?:^|[\s<])id\s*=\s*["']([^"']+)["']/i);
  if (classAttr) v = classAttr[1];
  else if (idAttr && !/^[.#]/.test(v)) return `#${idAttr[1].trim()}`;
  if (/^[.#]/.test(v) && !/\s/.test(v)) return v;
  const tokens = v.split(/[\s,]+/).map((x) => x.replace(/^\./, '')).filter(Boolean);
  if (!tokens.length) return '';
  const pick = (prefer && tokens.find((x) => x.startsWith(prefer))) || tokens.find((x) => x.includes('--')) || tokens[tokens.length - 1];
  return pick.startsWith('#') ? pick : `.${pick}`;
}

function CodeBlock({ title, lang, code: template, selector }: { title: string; lang: string; code: string; selector?: SelectorSpec }) {
  const t = useT();
  const [raw, setRaw] = usePersistedState(`sdp-selector:${title}`, '');
  const parsed = selector ? toSelector(raw, selector.prefer) : '';
  const usingExample = !!selector && !parsed;
  const code = selector ? template.split('{{selector}}').join(parsed || selector.example) : template;
  const lines = code.split('\n').length;
  const long = lines > 24;
  const [expanded, setExpanded] = useState(!long);
  return (
    <Card className="overflow-hidden">
      <CardHeader
        title={
          <span className="flex items-center gap-2">
            <Code2 size={16} className="text-slate-400" /> {t(title)}
          </span>
        }
        meta={`${lang.toUpperCase()} · ${t('{n} lines', { n: lines })}`}
        action={<CopyButton text={code} label={usingExample ? 'Copy example' : 'Copy code'} primary={!!selector && !usingExample} />}
      />

      {selector && (
        <div className="space-y-2 border-b border-slate-100 bg-indigo-50/40 px-4 py-3 dark:border-white/10 dark:bg-indigo-500/5">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200" htmlFor={`sel-${title}`}>
            {t('Your element class')}
          </label>
          <div className="flex gap-2">
            <input
              id={`sel-${title}`}
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              placeholder={selector.example}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 font-mono text-[13px] outline-none transition placeholder:text-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15 dark:border-white/10 dark:bg-slate-950 dark:placeholder:text-slate-600"
            />
            {raw && (
              <button
                onClick={() => setRaw('')}
                className="h-10 shrink-0 rounded-lg border border-slate-200 px-3 text-xs text-slate-500 hover:bg-white dark:border-white/10 dark:hover:bg-white/10"
              >
                {t('Clear')}
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            {usingExample ? (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 font-semibold text-amber-800 dark:bg-amber-500/15 dark:text-amber-200">{t('Showing example — paste your class')}</span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 font-semibold text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200">
                <Check size={11} /> {t('Using')} <code className="font-mono">{parsed}</code>
              </span>
            )}
          </div>
          {selector.hint && <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{t(selector.hint)}</p>}
        </div>
      )}

      <div className="relative">
        <pre
          className={clsx(
            'overflow-x-auto bg-[#131922] p-4 font-mono text-[12px] leading-relaxed text-slate-200 dark:bg-black/40',
            selector && 'whitespace-pre-wrap break-all',
            !expanded && 'max-h-80 overflow-y-hidden',
          )}
        >
          <code>{code}</code>
        </pre>
        {long && (
          <div className={clsx('flex justify-center', !expanded && 'absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#131922] to-transparent pb-3 pt-16')}>
            <button
              onClick={() => setExpanded((v) => !v)}
              className={clsx(
                'flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium',
                expanded ? 'my-2 text-slate-500 hover:text-slate-900 dark:hover:text-white' : 'bg-white text-slate-900',
              )}
            >
              {expanded ? t('Collapse') : t('Show all {n} lines', { n: lines })}
              <ChevronDown size={13} className={clsx(expanded && 'rotate-180')} />
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}

/* ---------------------------------------------------------------- Prompt (button + modal) */

function PromptButton({ prompt }: { prompt: PromptSpec }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={t('Open the prompt to paste into Shopify Sidekick')}
        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 text-xs font-semibold text-indigo-700 transition hover:border-indigo-400 hover:bg-indigo-100 active:scale-95 dark:border-indigo-400/40 dark:bg-indigo-500/15 dark:text-indigo-200 dark:hover:bg-indigo-500/25"
      >
        <Sparkles size={13} />
        {t('Sidekick prompt')}
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={t(prompt.title)}
        icon={
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
            <Sparkles size={15} />
          </span>
        }
        footer={<CopyButton text={prompt.text} label="Copy prompt" primary />}
      >
        {prompt.tip && (
          <div className="mx-5 mt-4 flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-xs leading-relaxed text-slate-600 dark:bg-white/5 dark:text-slate-300">
            <Info size={14} className="mt-0.5 shrink-0" />
            <span>{t(prompt.tip)}</span>
          </div>
        )}
        <pre className="m-5 select-text whitespace-pre-wrap break-words rounded-xl bg-[#131922] p-4 font-mono text-[12.5px] leading-relaxed text-slate-200 dark:bg-black/40">
          {prompt.text}
        </pre>
      </Modal>
    </>
  );
}

/* ---------------------------------------------------------------- Lists */

function CopyList({ title, meta, items, prompt }: { title: string; meta?: string; items: string[]; prompt?: PromptSpec }) {
  const t = useT();
  return (
    <Card>
      <CardHeader
        title={t(title)}
        meta={meta}
        action={
          <div className="flex flex-wrap gap-2">
            {prompt && <PromptButton prompt={prompt} />}
            <CopyButton text={items.join('\n')} label="Copy all" />
          </div>
        }
      />
      <ul className="divide-y divide-slate-100 dark:divide-white/5">
        {items.map((it, i) => (
          <li key={it} className="flex items-center gap-3 px-4 py-2">
            <span className="w-5 text-right text-xs tabular-nums text-slate-400">{i + 1}</span>
            <code className="min-w-0 flex-1 truncate font-mono text-[13px]">{it}</code>
            <CopyButton text={it} compact />
          </li>
        ))}
      </ul>
    </Card>
  );
}

function KeyValues({ title, rows }: { title?: string; rows: { label: string; value: string }[] }) {
  const t = useT();
  return (
    <Card>
      {title && <CardHeader title={t(title)} />}
      <dl className="divide-y divide-slate-100 dark:divide-white/5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-3 px-4 py-2.5 text-sm">
            <dt className="w-36 shrink-0 text-xs text-slate-500 dark:text-slate-400">{t(r.label)}</dt>
            <dd className="min-w-0 flex-1 font-medium">{t(r.value)}</dd>
            <CopyButton text={r.value} compact />
          </div>
        ))}
      </dl>
    </Card>
  );
}

function FormattedBody({ body }: { body: string }) {
  const paras = body.split(/\n\n+/);
  return (
    <div className="space-y-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
      {paras.map((p, i) => {
        const lines = p.split('\n');
        if (lines.every((l) => l.startsWith('● ')))
          return (
            <ul key={i} className="list-disc space-y-1 pl-5 marker:text-indigo-400">
              {lines.map((l) => (
                <li key={l}>{l.slice(2)}</li>
              ))}
            </ul>
          );
        if (lines.length === 2 && lines[0].length < 40)
          return (
            <p key={i}>
              <strong className="text-slate-900 dark:text-white">{lines[0]}</strong>
              <br />
              {lines[1]}
            </p>
          );
        return (
          <p key={i} className="whitespace-pre-line">
            {p}
          </p>
        );
      })}
    </div>
  );
}

function RichText({ title, body }: { title: string; body: string }) {
  const t = useT();
  return (
    <Card>
      <CardHeader
        title={<code className="font-mono text-[13px]">{t(title)}</code>}
        action={
          <div className="flex gap-2">
            <CopyButton text={title} label="Name" />
            <CopyButton text={body} label="Content" />
          </div>
        }
      />
      <div className="px-4 py-4">
        <FormattedBody body={body} />
      </div>
    </Card>
  );
}

function Note({ tone = 'info', text }: { tone?: 'info' | 'warn'; text: string }) {
  const t = useT();
  const Icon = tone === 'warn' ? AlertTriangle : Info;
  return (
    <div
      role={tone === 'warn' ? 'alert' : undefined}
      className={clsx(
        'flex items-start gap-3 rounded-xl border px-4 py-3 text-sm',
        tone === 'warn'
          ? 'border-red-200 bg-red-50 text-red-800 dark:border-red-400/30 dark:bg-red-500/10 dark:text-red-200'
          : 'border-indigo-200 bg-indigo-50 text-indigo-900 dark:border-indigo-400/30 dark:bg-indigo-500/10 dark:text-indigo-100',
      )}
    >
      <Icon size={16} className="mt-0.5 shrink-0" />
      <span>{t(text)}</span>
    </div>
  );
}

/* ---------------------------------------------------------------- Product */

const SWATCH: Record<string, string> = {
  Pink: '#f4a7b9',
  Orange: '#f28c38',
  Blue: '#3b6fd8',
  Red: '#d64545',
  White: '#ffffff',
  Black: '#1a1a1a',
  Brown: '#7a5235',
  Beige: '#e3d5b8',
  Green: '#4f8a5b',
};

const PRODUCT_TABS = ['full_product_description', 'features', 'materials', 'care_instructions', 'story', 'weight', 'gender'] as const;
type ProductTab = (typeof PRODUCT_TABS)[number];

function tabText(p: Product, tab: ProductTab): string {
  switch (tab) {
    case 'features':
    case 'materials':
    case 'care_instructions':
      return p[tab].map((x) => `● ${x}`).join('\n');
    case 'story':
      return `${p.story.heading}\n\n${p.story.body}`;
    default:
      return p[tab];
  }
}

function ProductCard({ product: p }: { product: Product }) {
  const t = useT();
  const [pickedColor, setColor] = useState(p.colors[0]);
  const [pickedSize, setSize] = useState(p.sizes[0]);
  // Guard: never show a colour/size this product doesn't have.
  const color = p.colors.includes(pickedColor) ? pickedColor : p.colors[0];
  const size = p.sizes.includes(pickedSize) ? pickedSize : p.sizes[0];
  const [tab, setTab] = useState<ProductTab>('full_product_description');
  const variantCount = p.colors.length * p.sizes.length;
  const photo = `/resources/products/${p.photoBase}-${color.toLowerCase()}-img.jpg`;

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden">
        <div className="grid gap-0 md:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col justify-between gap-5 bg-[#2b2b2b] p-6 text-[#eeeeee]">
            <div className="group relative overflow-hidden rounded-lg bg-white">
              <img key={photo} src={photo} alt={`${p.title} — ${color}`} className="aspect-square w-full object-cover motion-safe:animate-[fadeIn_.25s_ease-out]" />
              <a
                href={photo}
                download
                title={t('Download this photo')}
                aria-label={t('Download this photo')}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100 focus:opacity-100"
              >
                <Download size={14} />
              </a>
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">NovaStep · {p.gender}</div>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">{p.title.replace('NovaStep ', '')}</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{p.description}</p>
            </div>
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="text-xs text-white/50">{t('Price')}</div>
                <div className="text-2xl font-semibold tabular-nums">฿{p.price}</div>
              </div>
              <div className="text-right text-xs text-white/50">
                {t('{n} variants', { n: variantCount })}
                <br />
                {p.weight}
              </div>
            </div>
          </div>
          <div className="space-y-5 p-6">
            <Field label={t('Title')}>
              <div className="flex items-center gap-2">
                <span className="flex-1 font-medium">{p.title}</span>
                <CopyButton text={p.title} compact />
              </div>
            </Field>
            <Field label={t('Description')}>
              <div className="flex items-start gap-2">
                <span className="flex-1 text-sm text-slate-600 dark:text-slate-300">{p.description}</span>
                <CopyButton text={p.description} compact />
              </div>
            </Field>
            <Field label={t('Color — {c}', { c: color })} copy={p.colors.join(', ')}>
              <div className="flex flex-wrap gap-2">
                {p.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    title={c}
                    aria-label={c}
                    aria-pressed={color === c}
                    className={clsx(
                      'h-8 w-8 rounded-full border-2 transition',
                      color === c
                        ? 'border-indigo-600 ring-2 ring-indigo-600 ring-offset-2 dark:border-indigo-400 dark:ring-indigo-400 dark:ring-offset-slate-900'
                        : 'border-slate-200 dark:border-white/20',
                    )}
                    style={{ background: SWATCH[c] ?? '#ccc' }}
                  />
                ))}
              </div>
            </Field>
            <Field label={t('Size (US) — {s}', { s: size })} copy={p.sizes.join(', ')}>
              <div className="flex flex-wrap gap-1.5">
                {p.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    aria-pressed={size === s}
                    className={clsx(
                      'h-9 min-w-9 rounded-full border px-3 text-sm tabular-nums transition',
                      size === s
                        ? 'border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500 dark:text-white'
                        : 'border-slate-200 hover:border-slate-400 dark:border-white/15',
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Field>
            <Field label={t('Price (THB)')}>
              <div className="flex items-center gap-2">
                <span className="flex-1 font-medium tabular-nums">{p.price}</span>
                <CopyButton text={p.price.replace(/,/g, '')} compact />
              </div>
            </Field>
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader
          title="Product metafields"
          meta={t('custom.* — pick a field, then copy its value into Shopify')}
          action={<CopyButton text={tabText(p, tab)} label="Copy value" />}
        />
        <div className="flex gap-1 overflow-x-auto border-b border-slate-100 px-3 py-2 dark:border-white/10">
          {PRODUCT_TABS.map((tb) => (
            <button
              key={tb}
              onClick={() => setTab(tb)}
              aria-pressed={tab === tb}
              className={clsx(
                'shrink-0 rounded-full px-3 py-1.5 font-mono text-xs transition',
                tab === tb
                  ? 'bg-indigo-50 font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200'
                  : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10',
              )}
            >
              {tb}
            </button>
          ))}
        </div>
        <div className="px-4 py-4">
          {tab === 'story' ? (
            <>
              <div className="mb-2 text-base font-semibold">{p.story.heading}</div>
              <FormattedBody body={p.story.body} />
            </>
          ) : (
            <FormattedBody body={tabText(p, tab)} />
          )}
        </div>
      </Card>

      <ImageGrid images={p.images} />
    </div>
  );
}

function Field({ label, copy, children }: { label: string; copy?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        <span>{label}</span>
        {copy && <CopyButton text={copy} compact />}
      </div>
      {children}
    </div>
  );
}
