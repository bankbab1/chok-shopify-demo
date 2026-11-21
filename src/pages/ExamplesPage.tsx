import { CircleCheck, ExternalLink, KeyRound, Store } from 'lucide-react';
import { EXAMPLE_STORES } from '../data/examples';
import { CopyButton } from '../components/ui';
import { useT } from '../i18n';

const DEMO_ID = 'chok-demo';

const COMPARE: { aspect: string; theme: string; headless: string }[] = [
  { aspect: 'Frontend', theme: 'Shopify theme (Liquid), e.g. Horizon', headless: 'Custom React app (Hydrogen)' },
  { aspect: 'Who builds it', theme: 'Theme editor — no code needed', headless: 'Developers' },
  { aspect: 'Design freedom', theme: 'Within the theme’s sections and settings', headless: 'Anything you can build' },
  { aspect: 'Hosting', theme: 'Included with Shopify', headless: 'Usually Shopify Oxygen (or your own hosting)' },
  { aspect: 'Back end (products, checkout, orders)', theme: 'Shopify', headless: 'Shopify (via Storefront API)' },
  { aspect: 'Best for', theme: 'Most stores — fast to launch', headless: 'Brands needing a unique, custom experience' },
];

export default function ExamplesPage({ demo = false }: { demo?: boolean }) {
  const t = useT();
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-8 sm:py-8">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t(demo ? 'Demo Example' : 'Example Stores')}</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{t(demo ? 'A finished demo store to look at and compare with yours. Links open in a new tab.' : 'Real Shopify stores to show during the session. Links open in a new tab.')}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {EXAMPLE_STORES.filter((s) => (s.id === DEMO_ID) === demo).map((s) => (
          <article key={s.id} className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900">
            <div className="flex items-start gap-3 border-b border-slate-100 p-5 dark:border-white/10">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                <Store size={20} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{t(s.category)}</div>
                <h2 className="text-lg font-semibold">{s.name}</h2>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="break-all text-xs text-indigo-600 hover:underline dark:text-indigo-300">
                  {s.url.replace(/^https?:\/\//, '')}
                </a>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-4 p-5">
              <div className="flex flex-wrap gap-1.5">
                {s.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200">
                    {t(tag)}
                  </span>
                ))}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">{t(s.description)}</p>
              <ul className="space-y-2 text-sm">
                {s.points.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <CircleCheck size={15} className="mt-0.5 shrink-0 text-indigo-500" />
                    <span>{t(p)}</span>
                  </li>
                ))}
              </ul>

              {s.password && (
                <div className="flex flex-wrap items-center gap-3 rounded-lg border border-dashed border-indigo-300 bg-indigo-50/60 px-3 py-2.5 dark:border-indigo-400/40 dark:bg-indigo-500/10">
                  <KeyRound size={16} className="shrink-0 text-indigo-600 dark:text-indigo-300" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{t('Storefront password')}</div>
                    <code className="font-mono text-base font-semibold tracking-wide">{s.password}</code>
                  </div>
                  <CopyButton text={s.password} label="Copy password" primary />
                </div>
              )}

              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex h-10 items-center justify-center gap-2 rounded-full bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700 dark:bg-indigo-500"
              >
                {t('Open store')} <ExternalLink size={14} />
              </a>
            </div>
          </article>
        ))}
      </div>

      {!demo && <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900">
        <div className="border-b border-slate-100 px-5 py-4 dark:border-white/10">
          <h2 className="font-semibold">{t('Theme (Liquid) vs Headless (Hydrogen)')}</h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{t('This workshop builds NovaStep with a theme. Cher Skincare is headless.')}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 dark:bg-white/5 dark:text-slate-400">
              <tr>
                <th className="px-5 py-2.5 font-medium" />
                <th className="px-5 py-2.5 font-semibold">{t('Theme (Liquid)')}</th>
                <th className="px-5 py-2.5 font-semibold">{t('Headless (Hydrogen)')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {COMPARE.map((r) => (
                <tr key={r.aspect}>
                  <th className="px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400">{t(r.aspect)}</th>
                  <td className="px-5 py-3">{t(r.theme)}</td>
                  <td className="px-5 py-3">{t(r.headless)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>}
    </div>
  );
}
