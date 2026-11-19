import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, CircleCheck, Circle } from 'lucide-react';
import { SECTIONS } from '../data/guide';
import { useProgress } from '../hooks/useProgress';
import { TagBadge } from '../components/TagBadge';
import { useT } from '../i18n';

export default function SectionPage() {
  const t = useT();
  const { sectionId } = useParams();
  const idx = SECTIONS.findIndex((s) => s.id === sectionId);
  const { done } = useProgress();
  if (idx < 0) return <Navigate to="/" replace />;
  const section = SECTIONS[idx];
  let lastGroup: string | undefined;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-8 sm:py-8">
      <div className="mb-6 flex items-center gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white dark:bg-indigo-500">
          <section.icon size={22} />
        </span>
        <div>
          <div className="text-xs tabular-nums text-slate-400">{t('Module {n}', { n: String(idx + 1).padStart(2, '0') })}</div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t(section.title)}</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{t(section.summary)}</p>
        </div>
      </div>

      <ol className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900">
        {section.topics.map((tp, i) => {
          const path = `/${section.id}/${tp.id}`;
          const showGroup = tp.group && tp.group !== lastGroup;
          lastGroup = tp.group;
          return (
            <li key={tp.id} className="border-b border-slate-100 last:border-0 dark:border-white/5">
              {showGroup && (
                <div className="bg-slate-50 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:bg-white/5">{t(tp.group!)}</div>
              )}
              <Link to={path} className="group flex items-center gap-3 px-4 py-3.5 transition hover:bg-indigo-50/50 dark:hover:bg-white/5">
                {done[path] ? (
                  <CircleCheck size={18} className="shrink-0 text-indigo-600 dark:text-indigo-300" aria-label={t('Completed')} />
                ) : (
                  <Circle size={18} className="shrink-0 text-slate-300 dark:text-slate-600" aria-label={t('Not completed')} />
                )}
                <span className="w-6 text-xs tabular-nums text-slate-400">{i + 1}.</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 font-medium">
                    {t(tp.title)}
                    {tp.tag && <TagBadge tag={tp.tag} />}
                  </div>
                  {tp.summary && <div className="truncate text-xs text-slate-500 dark:text-slate-400">{t(tp.summary)}</div>}
                </div>
                <ArrowRight size={16} className="shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500" />
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
