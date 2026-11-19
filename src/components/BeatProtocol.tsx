import clsx from 'clsx';
import { ArrowUpRight } from 'lucide-react';
import { useT } from '../i18n';

export const BEAT_PROTOCOL_URL = 'https://beatprotocol.com/';

/** Beat Protocol mark: white pulse line on the brand-orange rounded square. */
export function BeatProtocolMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className={clsx('shrink-0', className)}>
      <rect width="64" height="64" rx="14" fill="#F67337" />
      <path d="M10 34h11l5-12 9 22 5-10h14" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Sidebar card linking to the company profile. `compact` = icon-only tile for the collapsed sidebar. */
export function BeatProtocolLink({ compact }: { compact?: boolean }) {
  const t = useT();
  if (compact)
    return (
      <a
        href={BEAT_PROTOCOL_URL}
        target="_blank"
        rel="noopener noreferrer"
        title={`${t('Powered by')} Beat Protocol`}
        aria-label={`${t('Powered by')} Beat Protocol — ${t('Company profile')}`}
        className="flex h-10 w-10 items-center justify-center rounded-lg transition hover:bg-orange-50 dark:hover:bg-white/10"
      >
        <BeatProtocolMark size={26} />
      </a>
    );
  return (
    <a
      href={BEAT_PROTOCOL_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group mb-3 flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2 transition hover:border-[#F67337]/50 hover:bg-orange-50/60 dark:border-white/10 dark:bg-slate-900 dark:hover:border-[#F67337]/50 dark:hover:bg-white/5"
    >
      <BeatProtocolMark size={28} />
      <span className="min-w-0 flex-1 leading-tight">
        <span className="block text-[10px] uppercase tracking-wider text-slate-400">{t('Powered by')}</span>
        <span className="block truncate text-[13px] font-semibold text-slate-800 dark:text-slate-100">Beat Protocol</span>
      </span>
      <ArrowUpRight size={14} className="shrink-0 text-slate-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#F67337]" />
    </a>
  );
}
