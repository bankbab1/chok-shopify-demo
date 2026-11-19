import { useState } from 'react';
import clsx from 'clsx';
import { Check, FileArchive, Loader2 } from 'lucide-react';
import { downloadZip, type ZipEntry } from '../lib/zip';
import { useT } from '../i18n';

type ZipState = { status: 'idle' } | { status: 'busy'; done: number; total: number } | { status: 'done' } | { status: 'error' };

/** Button that builds and downloads a ZIP; shows progress while fetching files. */
export function ZipButton({ name, entries, label, primary }: { name: string; entries: () => ZipEntry[]; label: string; primary?: boolean }) {
  const t = useT();
  const [state, setState] = useState<ZipState>({ status: 'idle' });
  const run = async () => {
    const list = entries();
    setState({ status: 'busy', done: 0, total: list.length });
    try {
      await downloadZip(name, list, (done, total) => setState({ status: 'busy', done, total }));
      setState({ status: 'done' });
      setTimeout(() => setState({ status: 'idle' }), 2000);
    } catch {
      setState({ status: 'error' });
      setTimeout(() => setState({ status: 'idle' }), 3000);
    }
  };
  const busy = state.status === 'busy';
  return (
    <button
      onClick={run}
      disabled={busy}
      aria-live="polite"
      className={clsx(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full font-semibold transition active:scale-95 disabled:cursor-wait',
        primary
          ? 'h-10 bg-indigo-600 px-5 text-sm text-white shadow-sm hover:bg-indigo-700 dark:bg-indigo-500'
          : 'h-8 border border-indigo-200 bg-indigo-50 px-3 text-xs text-indigo-700 hover:bg-indigo-100 dark:border-indigo-400/30 dark:bg-indigo-500/15 dark:text-indigo-200 dark:hover:bg-indigo-500/25',
      )}
    >
      {busy ? (
        <Loader2 size={primary ? 16 : 13} className="animate-spin" />
      ) : state.status === 'done' ? (
        <Check size={primary ? 16 : 13} />
      ) : (
        <FileArchive size={primary ? 16 : 13} />
      )}
      {busy
        ? t('Preparing {done}/{total}…', { done: state.done, total: state.total })
        : state.status === 'done'
          ? t('Downloaded')
          : state.status === 'error'
            ? t('Download failed — try again')
            : t(label)}
    </button>
  );
}
