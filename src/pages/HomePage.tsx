import { Link } from 'react-router-dom';
import { ArrowRight, CircleHelp, FlaskConical, FolderDown, Play, RotateCcw } from 'lucide-react';
import { FLAT_TOPICS, SECTIONS } from '../data/guide';
import { useProgress } from '../hooks/useProgress';
import { useT } from '../i18n';

export default function HomePage() {
  const t = useT();
  const { done, last, reset } = useProgress();
  const doneCount = FLAT_TOPICS.filter((tp) => done[tp.path]).length;
  const nextIncomplete = FLAT_TOPICS.find((tp) => !done[tp.path]);
  const continueTo = last && FLAT_TOPICS.some((tp) => tp.path === last) ? last : nextIncomplete?.path;
  const started = doneCount > 0 || !!last;
  const pct = Math.round((doneCount / FLAT_TOPICS.length) * 100);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-8">
      {/* Hero — the NovaStep demo store's own "Hero – Bottom align" look */}
      <section className="relative overflow-hidden rounded-2xl bg-[#2b2b2b] bg-cover bg-center" style={{ backgroundImage: 'url(/resources/home/home-hero-img.jpg)' }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
        <div className="relative flex min-h-[340px] flex-col justify-end p-6 sm:min-h-[400px] sm:p-10">
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">Shopify Demo Session · NovaStep</div>
          <h1 className="text-4xl font-bold leading-none tracking-tight sm:text-6xl">
            <span className="text-[#eeeeee]">EVERY STEP </span>
            <span className="text-gold">FORWARD</span>
          </h1>
          <p className="mt-4 max-w-xl text-sm text-[#eeeeee]/85 sm:text-base">
            {t(
              'Build the NovaStep demo store from scratch — store setup, metafields, products, the Horizon theme, apps, inventory, test payments and fulfillment — one guided step at a time.',
            )}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to={(started ? continueTo : FLAT_TOPICS[0].path) ?? FLAT_TOPICS[0].path}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-indigo-600 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 transition hover:bg-indigo-500"
            >
              <Play size={15} className="fill-current" />
              {t(started ? 'Continue workshop' : 'Start workshop')}
            </Link>
            {started && (
              <Link to={FLAT_TOPICS[0].path} className="inline-flex h-11 items-center rounded-full border border-white/30 px-5 text-sm font-medium text-white hover:bg-white/10">
                {t('Start from the beginning')}
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label={t('Modules')} value={SECTIONS.length} />
        <Stat label={t('Steps')} value={FLAT_TOPICS.length} />
        <Stat label={t('Demo products')} value={4} />
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{t('Your progress')}</span>
            {doneCount > 0 && (
              <button onClick={reset} className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white">
                <RotateCcw size={11} /> {t('Reset')}
              </button>
            )}
          </div>
          <div className="mt-1 text-2xl font-bold tabular-nums">{pct}%</div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-700" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </section>

      <div className="mt-5 flex items-start gap-3 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-900 dark:border-indigo-400/30 dark:bg-indigo-500/10 dark:text-indigo-100">
        <FlaskConical size={16} className="mt-0.5 shrink-0" />
        <span>
          {t(
            'This workshop uses a development store and a test payment gateway — nothing is sold and no real money moves. Progress is saved only in this browser.',
          )}
        </span>
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold">{t('Modules')}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((s, i) => {
          const n = s.topics.filter((tp) => done[`/${s.id}/${tp.id}`]).length;
          const complete = n === s.topics.length;
          return (
            <Link
              key={s.id}
              to={`/${s.id}`}
              className="group flex flex-col rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-300 hover:shadow-sm dark:border-white/10 dark:bg-slate-900 dark:hover:border-indigo-400/50"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                  <s.icon size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] tabular-nums text-slate-400">{t('Module {n}', { n: String(i + 1).padStart(2, '0') })}</div>
                  <div className="truncate font-semibold">{t(s.title)}</div>
                </div>
                <ArrowRight size={16} className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500" />
              </div>
              <p className="mt-3 flex-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{t(s.summary)}</p>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                  <div className="h-full rounded-full bg-indigo-600 dark:bg-indigo-400" style={{ width: `${(n / s.topics.length) * 100}%` }} />
                </div>
                <span className="tabular-nums">{complete ? t('Done ✓') : `${n}/${s.topics.length}`}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <QuickLink to="/resources" icon={FolderDown} title={t('Resources')} text={t('Logo, product photos and page images to upload into Shopify.')} />
        <QuickLink to="/help" icon={CircleHelp} title={t('Help & troubleshooting')} text={t('Common problems: login, menus that differ, Sidekick, test payments.')} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-2xl font-bold tabular-nums">{value}</div>
    </div>
  );
}

function QuickLink({ to, icon: Icon, title, text }: { to: string; icon: typeof FolderDown; title: string; text: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-300 dark:border-white/10 dark:bg-slate-900 dark:hover:border-indigo-400/50"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white dark:bg-indigo-500">
        <Icon size={18} />
      </span>
      <div className="min-w-0">
        <div className="font-semibold">{title}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">{text}</div>
      </div>
    </Link>
  );
}
