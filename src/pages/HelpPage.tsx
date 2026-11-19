import { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { ArrowRight, ChevronDown, Search } from 'lucide-react';
import { FAQS } from '../data/help';
import { useT } from '../i18n';

export default function HelpPage() {
  const t = useT();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  const q = query.trim().toLowerCase();
  const groups = FAQS.map((g) => ({
    ...g,
    items: g.items.filter((f) => !q || [f.q, f.a, t(f.q), t(f.a)].join(' ').toLowerCase().includes(q)),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-8 sm:py-8">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('Help & troubleshooting')}</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{t('Common problems during the workshop and how to get unstuck.')}</p>

      <label className="relative mt-5 block">
        <Search size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('Search help…')}
          className="h-11 w-full rounded-full border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-indigo-400 dark:border-white/10 dark:bg-slate-900"
        />
      </label>

      {groups.map((g) => (
        <section key={g.category} className="mt-7">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{t(g.category)}</h2>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900">
            {g.items.map((f) => {
              const isOpen = open === f.q || !!q;
              return (
                <div key={f.q} className="border-b border-slate-100 last:border-0 dark:border-white/5">
                  <button
                    onClick={() => setOpen(isOpen && !q ? null : f.q)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5"
                  >
                    <span className="flex-1">{t(f.q)}</span>
                    <ChevronDown size={15} className={clsx('shrink-0 text-slate-400 transition-transform', isOpen && 'rotate-180')} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                      {t(f.a)}
                      {f.link && (
                        <Link to={f.link.to} className="mt-2 flex w-fit items-center gap-1 text-xs font-semibold text-indigo-700 underline-offset-2 hover:underline dark:text-indigo-300">
                          {t('Go to: {label}', { label: t(f.link.label) })} <ArrowRight size={12} />
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
      {groups.length === 0 && <p className="mt-8 text-center text-sm text-slate-400">{t('Nothing matches “{q}”.', { q: query })}</p>}
    </div>
  );
}
