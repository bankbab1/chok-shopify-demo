import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { Check, Copy, Mail, Phone, X } from 'lucide-react';
import { copyText } from './ui';
import { useT } from '../i18n';

/** Presenter profile shown from the sidebar "CT" button. */
const PROFILE = {
  initials: 'CT',
  name: 'Chokchai Thawatcharaporn',
  position: 'Senior Digital Solution',
  mobile: '+66 85 994 1717',
  tel: '+66859941717',
  email: 'ct_chok@hotmail.com',
  photo: '/profile/chokchai.webp',
};

/** One contact line: icon, tappable value (tel:/mailto:), copy button. */
function ContactRow({ icon, value, href }: { icon: ReactNode; value: string; href: string }) {
  const t = useT();
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 dark:bg-white/5">
      <span className="shrink-0 text-slate-400">{icon}</span>
      <a href={href} className="min-w-0 flex-1 truncate font-medium tabular-nums hover:text-indigo-700 dark:hover:text-indigo-300">
        {value}
      </a>
      <button
        onClick={() =>
          void copyText(value).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
          })
        }
        aria-label={`${t('Copy')} ${value}`}
        title={t('Copy')}
        className={clsx(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition',
          copied ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10',
        )}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </button>
    </div>
  );
}

function Card({ onClose }: { onClose: () => void }) {
  const t = useT();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const theme = document.querySelector('[data-theme]')?.getAttribute('data-theme') ?? 'light';
  return createPortal(
    <div data-theme={theme} className="fixed inset-0 z-[70]" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={PROFILE.name}
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-4 left-4 w-[min(320px,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl motion-safe:animate-[slideInLeft_.28s_cubic-bezier(.2,.8,.2,1)] dark:border-white/10 dark:bg-slate-900 dark:text-white"
      >
        <div className="h-16 bg-gradient-to-br from-indigo-500 to-indigo-700" />
        <button
          onClick={onClose}
          aria-label={t('Close')}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30"
        >
          <X size={16} />
        </button>
        <div className="-mt-10 px-5 pb-5">
          <img
            src={PROFILE.photo}
            alt={PROFILE.name}
            width={80}
            height={80}
            className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-md dark:border-slate-900"
          />
          <div className="mt-3 text-lg font-semibold leading-tight">{PROFILE.name}</div>
          <div className="mt-0.5 text-sm text-indigo-700 dark:text-indigo-300">{PROFILE.position}</div>

          <div className="mt-4 space-y-2">
            <ContactRow icon={<Phone size={15} />} value={PROFILE.mobile} href={`tel:${PROFILE.tel}`} />
            <ContactRow icon={<Mail size={15} />} value={PROFILE.email} href={`mailto:${PROFILE.email}`} />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <a
              href={`tel:${PROFILE.tel}`}
              className="flex h-10 items-center justify-center gap-2 rounded-full bg-indigo-600 text-sm font-semibold text-white transition hover:bg-indigo-700 dark:bg-indigo-500"
            >
              <Phone size={15} /> {t('Call')}
            </a>
            <a
              href={`mailto:${PROFILE.email}`}
              className="flex h-10 items-center justify-center gap-2 rounded-full border border-indigo-200 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 dark:border-indigo-400/40 dark:text-indigo-200 dark:hover:bg-indigo-500/15"
            >
              <Mail size={15} /> {t('Email')}
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** Small round "CT" badge (sidebar footer, next to the progress bar) that opens the presenter card. Pale until hovered. */
export function ProfileButton() {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={`${t('Presenter')}: ${PROFILE.name}`}
        data-tip-side="right"
        aria-label={`${t('Presenter')}: ${PROFILE.name}`}
        className={clsx(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold tracking-wide transition duration-200 active:scale-95',
          open
            ? 'bg-indigo-600 text-white shadow-md dark:bg-indigo-500'
            : 'bg-indigo-100 text-indigo-500 hover:scale-105 hover:bg-indigo-600 hover:text-white hover:shadow-md dark:bg-indigo-500/15 dark:text-indigo-300 dark:hover:bg-indigo-500 dark:hover:text-white',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900',
        )}
      >
        {PROFILE.initials}
      </button>
      {open && <Card onClose={() => setOpen(false)} />}
    </>
  );
}
