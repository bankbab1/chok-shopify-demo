import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import QRCode from 'qrcode';
import { Check, Copy, Maximize2, QrCode, Share2, X } from 'lucide-react';
import { Modal } from './ui';
import { AppLogo } from './AppLogo';
import { useT } from '../i18n';

/** Inline SVG QR code (error correction H so the logo in the middle doesn't break scanning). */
function QrSvg({ value, className }: { value: string; className?: string }) {
  const [svg, setSvg] = useState('');
  useEffect(() => {
    let alive = true;
    QRCode.toString(value, { type: 'svg', errorCorrectionLevel: 'H', margin: 1, color: { dark: '#1e1b4b', light: '#ffffff' } })
      .then((s) => alive && setSvg(s))
      .catch(() => alive && setSvg(''));
    return () => {
      alive = false;
    };
  }, [value]);
  return (
    <div className={clsx('relative aspect-square bg-white', className)}>
      <div className="h-full w-full [&>svg]:h-full [&>svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />
      {svg && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[12px] bg-white p-1.5">
          <AppLogo size={44} />
        </span>
      )}
    </div>
  );
}

/** Header button → modal with a scannable QR of the site, Share (native) and Copy link. */
export function ShareSiteButton() {
  const t = useT();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [thisPage, setThisPage] = useState(false);
  const [copied, setCopied] = useState(false);
  const [projector, setProjector] = useState(false);

  const home = `${window.location.origin}/`;
  const url = thisPage ? `${window.location.origin}${location.pathname}` : home;
  const display = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const canShare = typeof navigator !== 'undefined' && !!navigator.share;

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(id);
  }, [copied]);

  useEffect(() => {
    if (!projector) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setProjector(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [projector]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
  };

  const share = async () => {
    try {
      await navigator.share({ title: 'Shopify Demo — NovaStep', text: t('Open the Shopify workshop guide'), url });
    } catch {
      /* user cancelled */
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={t('Share this site')}
        title={t('Share this site')}
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-200 px-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 active:scale-95 sm:px-3 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
      >
        <QrCode size={16} />
        <span className="hidden sm:inline">{t('Share')}</span>
      </button>

      <Modal
        open={open && !projector}
        onClose={() => setOpen(false)}
        title={t('Share this site')}
        icon={
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
            <QrCode size={16} />
          </span>
        }
      >
        <div className="flex flex-col items-center gap-4 px-5 py-5">
          <p className="text-center text-sm text-slate-600 dark:text-slate-300">{t('Scan with your phone camera to open the guide.')}</p>
          <QrSvg value={url} className="w-60 rounded-2xl p-2 shadow-md ring-1 ring-slate-200 sm:w-72 dark:ring-white/10" />
          <div className="w-full max-w-sm truncate rounded-lg bg-slate-100 px-3 py-2 text-center font-mono text-xs text-slate-700 dark:bg-white/10 dark:text-slate-200" title={url}>
            {display}
          </div>

          <div role="group" aria-label={t('Link to')} className="flex rounded-full border border-slate-200 p-0.5 text-xs font-semibold dark:border-white/10">
            {[
              { v: false, label: t('Home page') },
              { v: true, label: t('This page') },
            ].map((o) => (
              <button
                key={String(o.v)}
                onClick={() => setThisPage(o.v)}
                aria-pressed={thisPage === o.v}
                className={clsx(
                  'rounded-full px-3 py-1.5 transition',
                  thisPage === o.v ? 'bg-indigo-600 text-white dark:bg-indigo-500' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
                )}
              >
                {o.label}
              </button>
            ))}
          </div>

          <div className="grid w-full max-w-sm grid-cols-2 gap-2">
            <button
              onClick={canShare ? share : copy}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500"
            >
              <Share2 size={16} /> {t('Share')}
            </button>
            <button
              onClick={copy}
              aria-live="polite"
              className={clsx(
                'inline-flex h-11 items-center justify-center gap-2 rounded-full border text-sm font-semibold transition active:scale-95',
                copied
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10',
              )}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? t('Copied') : t('Copy link')}
            </button>
          </div>
          <button
            onClick={() => setProjector(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:underline dark:text-indigo-300"
          >
            <Maximize2 size={13} /> {t('Show on projector (full screen)')}
          </button>
        </div>
      </Modal>

      {/* Projector view: huge QR for the whole room to scan */}
      {open && projector && (
        <div className="fixed inset-0 z-[95] flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-950 p-6 text-white">
          <button
            onClick={() => setProjector(false)}
            aria-label={t('Close')}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
          >
            <X size={22} />
          </button>
          <div className="flex items-center gap-3">
            <AppLogo size={44} />
            <div className="text-2xl font-bold sm:text-3xl">Shopify Demo</div>
          </div>
          <div className="text-center text-lg text-white/80 sm:text-2xl">{t('Scan to open the workshop guide')}</div>
          <QrSvg value={url} className="w-[min(70vh,80vw)] rounded-3xl p-4 shadow-2xl" />
          <div className="rounded-full bg-white/10 px-5 py-2 font-mono text-base sm:text-xl">{display}</div>
        </div>
      )}
    </>
  );
}
