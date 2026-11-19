import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { ArrowLeft, ArrowRight, CircleCheck, CircleHelp, Circle, ListChecks } from 'lucide-react';
import { FLAT_TOPICS, findTopic } from '../data/guide';
import { BlockView } from '../components/Blocks';
import { useProgress } from '../hooks/useProgress';
import { Card, CardHeader } from '../components/ui';
import { TagBadge } from '../components/TagBadge';
import { useT } from '../i18n';

export default function TopicPage() {
  const t = useT();
  const { sectionId, topicId } = useParams();
  const found = findTopic(sectionId, topicId);
  const { done, toggle, visit } = useProgress();

  useEffect(() => {
    if (found) visit(found.path);
  }, [found, visit]);

  if (!found) return <Navigate to={sectionId ? `/${sectionId}` : '/'} replace />;
  const { section, topic, path } = found;
  const idx = FLAT_TOPICS.findIndex((tp) => tp.path === path);
  const prev = FLAT_TOPICS[idx - 1];
  const next = FLAT_TOPICS[idx + 1];
  const isDone = !!done[path];
  const stepNo = section.topics.findIndex((tp) => tp.id === topic.id) + 1;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-8 sm:py-8">
      <div className="mb-6 flex flex-wrap items-start gap-4">
        <div className="min-w-0 flex-1 basis-72">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <section.icon size={14} />
            <span>
              {t(section.title)}
              {topic.group ? ` · ${t(topic.group)}` : ''}
            </span>
            <span className="tabular-nums">· {t('Step {n} of {total}', { n: stepNo, total: section.topics.length })}</span>
            {topic.tag && <TagBadge tag={topic.tag} />}
          </div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t(topic.title)}</h1>
          {topic.summary && <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">{t(topic.summary)}</p>}
        </div>
        <CompleteButton done={isDone} onClick={() => toggle(path)} />
      </div>

      {/* key={path}: remount on every step change so per-block state (selected colour/size, ticked
          steps, expanded code) never leaks from one step into the next. */}
      <div key={path} className="space-y-5">
        {topic.blocks.map((b, i) => (
          <BlockView key={i} block={b} />
        ))}

        {topic.outcome && (
          <Card>
            <CardHeader
              title={
                <span className="flex items-center gap-2">
                  <ListChecks size={16} className="text-slate-400" /> {t('You should now see…')}
                </span>
              }
            />
            <ul className="space-y-2 px-4 py-3 text-sm">
              {topic.outcome.map((o) => (
                <li key={o} className="flex items-start gap-2">
                  <CircleCheck size={16} className="mt-0.5 shrink-0 text-indigo-500" />
                  {t(o)}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 p-5 text-center dark:border-white/15">
        <p className="text-sm text-slate-600 dark:text-slate-300">{t(isDone ? 'Nice — this step is marked done.' : 'Finished this step in Shopify?')}</p>
        <CompleteButton done={isDone} onClick={() => toggle(path)} />
        <Link to="/help" className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
          <CircleHelp size={12} /> {t('Stuck? See Help & troubleshooting')}
        </Link>
      </div>

      <nav className="mt-6 grid grid-cols-2 gap-3">
        {prev ? <PrevNext dir="prev" to={prev.path} label={t(prev.topic.title)} sub={t(prev.section.title)} /> : <span />}
        {next ? <PrevNext dir="next" to={next.path} label={t(next.topic.title)} sub={t(next.section.title)} /> : <span />}
      </nav>
    </div>
  );
}

function CompleteButton({ done, onClick }: { done: boolean; onClick: () => void }) {
  const t = useT();
  return (
    <button
      onClick={onClick}
      aria-pressed={done}
      className={clsx(
        'inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-5 text-sm font-semibold transition active:scale-95',
        done
          ? 'bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500'
          : 'border border-slate-300 bg-white text-slate-700 hover:border-indigo-400 hover:text-indigo-700 dark:border-white/20 dark:bg-slate-900 dark:text-slate-200',
      )}
    >
      {done ? <CircleCheck size={16} /> : <Circle size={16} />}
      {t(done ? 'Completed' : 'Mark as complete')}
    </button>
  );
}

function PrevNext({ dir, to, label, sub }: { dir: 'prev' | 'next'; to: string; label: string; sub: string }) {
  const t = useT();
  return (
    <Link
      to={to}
      className={clsx(
        'group flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-indigo-300 dark:border-white/10 dark:bg-slate-900 dark:hover:border-indigo-400/50',
        dir === 'next' && 'flex-row-reverse text-right',
      )}
    >
      {dir === 'prev' ? (
        <ArrowLeft size={16} className="shrink-0 text-slate-400 transition group-hover:-translate-x-0.5" />
      ) : (
        <ArrowRight size={16} className="shrink-0 text-slate-400 transition group-hover:translate-x-0.5" />
      )}
      <div className="min-w-0">
        <div className="truncate text-[11px] uppercase tracking-wider text-slate-400">
          {t(dir === 'prev' ? 'Previous' : 'Next')} · {sub}
        </div>
        <div className="truncate text-sm font-medium">{label}</div>
      </div>
    </Link>
  );
}
