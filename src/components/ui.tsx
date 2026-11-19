import { Fragment, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { Check, ChevronLeft, ChevronRight, Copy, Maximize2, X } from 'lucide-react';
import type { GuideImage } from '../data/types';
import { useI18n, useT } from '../i18n';

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900', className)}>
      {children}
    </div>
  );
}

export function CardHeader({ title, meta, action }: { title: ReactNode; meta?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3 dark:border-white/10">
      <div className="min-w-0 flex-1 basis-40">
        <div className="truncate text-sm font-semibold">{title}</div>
        {meta && <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{meta}</div>}
      </div>
      {action}
    </div>
  );
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
}

export function CopyButton({
  text,
  label = 'Copy',
  compact,
  primary,
}: {
  text: string;
  label?: string;
  compact?: boolean;
  primary?: boolean;
}) {
  const t = useT();
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1400);
    return () => clearTimeout(id);
  }, [copied]);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        void copyText(text).then(() => setCopied(true));
      }}
      title={copied ? t('Copied!') : `${t('Copy')}: ${text.length > 60 ? text.slice(0, 60) + '…' : text}`}
      aria-live="polite"
      className={clsx(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full border text-xs font-medium transition active:scale-95',
        compact ? 'h-7 w-7 justify-center' : 'h-8 px-3',
        copied || primary
          ? 'border-indigo-600 bg-indigo-600 text-white hover:bg-indigo-700 dark:border-indigo-500 dark:bg-indigo-500 dark:text-white'
          : 'border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10',
      )}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      {!compact && <span>{copied ? t('Copied') : t(label)}</span>}
    </button>
  );
}

/** Accessible dialog rendered in a portal; closes on Esc, backdrop click or the X button. */
export function Modal({
  open,
  onClose,
  title,
  icon,
  footer,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  icon?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}) {
  const t = useT();
  const { lang } = useI18n();
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      prev?.focus?.();
    };
  }, [open, onClose]);
  if (!open) return null;
  // Portal target inherits the theme from the app root so dark mode applies inside the dialog.
  const theme = document.querySelector('[data-theme]')?.getAttribute('data-theme') ?? 'light';
  return createPortal(
    <div data-theme={theme} lang={lang} className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] motion-safe:animate-[fadeIn_.15s_ease-out]" onClick={onClose} />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        className="relative flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white text-slate-900 shadow-2xl outline-none sm:rounded-2xl dark:bg-slate-900 dark:text-white"
      >
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 dark:border-white/10">
          {icon}
          <div className="min-w-0 flex-1 truncate text-base font-semibold">{title}</div>
          <button
            onClick={onClose}
            aria-label={t('Close')}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        {footer && <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 px-5 py-3 dark:border-white/10">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

/** Renders “quoted” UI labels as emphasised chips and bare URLs as links. */
export function RichLine({ text }: { text: string }) {
  const parts = text.split(/(“[^”]+”|https?:\/\/\S+)/g);
  return (
    <>
      {parts.map((p, i) => {
        if (p.startsWith('“'))
          return (
            <span key={i} className="mx-0.5 rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-900 dark:bg-white/10 dark:text-white">
              {p.slice(1, -1)}
            </span>
          );
        if (/^https?:\/\//.test(p))
          return (
            <a key={i} href={p} target="_blank" rel="noopener noreferrer" className="break-all underline underline-offset-2 hover:text-indigo-600">
              {p}
            </a>
          );
        return <Fragment key={i}>{p}</Fragment>;
      })}
    </>
  );
}

export function ImageGrid({ images }: { images: GuideImage[] }) {
  const t = useT();
  const [index, setIndex] = useState<number | null>(null);
  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, close, step]);

  const current = index === null ? null : images[index];
  const caption = (im: GuideImage, i: number) => (im.caption ? t(im.caption) : t('Screenshot {n}', { n: i + 1 }));

  return (
    <>
      <div className={clsx('grid gap-3', images.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3')}>
        {images.map((im, i) => (
          <button
            key={im.id + i}
            type="button"
            onClick={() => setIndex(i)}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white text-left transition hover:border-slate-400 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-white/10 dark:bg-slate-900 dark:hover:border-white/30"
          >
            <div className="flex h-52 items-center justify-center overflow-hidden bg-slate-100 p-2 dark:bg-slate-950">
              <img
                src={im.src ?? `/guide/${im.id}.webp`}
                alt={caption(im, i)}
                loading="lazy"
                className="max-h-full max-w-full rounded object-contain transition duration-300 group-hover:scale-[1.02]"
              />
            </div>
            <div className="flex items-center gap-2 px-3 py-2 text-xs text-slate-600 dark:text-slate-300">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-semibold tabular-nums dark:bg-white/10">
                {i + 1}
              </span>
              <span className="flex-1 truncate">{caption(im, i)}</span>
              <Maximize2 size={13} className="shrink-0 opacity-0 transition group-hover:opacity-100" />
            </div>
          </button>
        ))}
      </div>

      {current &&
        createPortal(
          <div role="dialog" aria-modal="true" className="fixed inset-0 z-[100] flex flex-col bg-black/85 backdrop-blur-sm" onClick={close}>
            <div className="flex items-center gap-3 px-4 py-3 text-sm text-white/90" onClick={(e) => e.stopPropagation()}>
              <span className="tabular-nums text-white/60">
                {index! + 1} / {images.length}
              </span>
              <span className="flex-1 truncate font-medium">{caption(current, index!)}</span>
              <button onClick={close} aria-label={t('Close')} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10">
                <X size={20} />
              </button>
            </div>
            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-6 sm:px-16">
              <img
                src={current.src ?? `/guide/${current.id}.webp`}
                alt={caption(current, index!)}
                className="max-h-full max-w-full rounded-lg bg-white object-contain shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
              {images.length > 1 && (
                <>
                  <LightboxArrow side="left" label={t('Previous image')} onClick={() => step(-1)} />
                  <LightboxArrow side="right" label={t('Next image')} onClick={() => step(1)} />
                </>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function LightboxArrow({ side, label, onClick }: { side: 'left' | 'right'; label: string; onClick: () => void }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={label}
      className={clsx(
        'absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25',
        side === 'left' ? 'left-2 sm:left-4' : 'right-2 sm:right-4',
      )}
    >
      {side === 'left' ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
    </button>
  );
}
