import clsx from 'clsx';
import { FlaskConical, Rocket } from 'lucide-react';
import { useT } from '../i18n';

/** Workshop/Test vs Production/Go-live label (spec FR-12). Icon + text, never colour alone. */
export function TagBadge({ tag }: { tag: 'workshop' | 'production' }) {
  const t = useT();
  const prod = tag === 'production';
  const Icon = prod ? Rocket : FlaskConical;
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold',
        prod
          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
          : 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-200 dark:ring-indigo-400/30',
      )}
    >
      <Icon size={11} />
      {t(prod ? 'Production / Go live' : 'Workshop / Test')}
    </span>
  );
}
