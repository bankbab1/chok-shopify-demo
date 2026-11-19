import { useState } from 'react';
import clsx from 'clsx';
import { Check, Download, ExternalLink, FileArchive, Loader2, Package } from 'lucide-react';
import { RESOURCE_GROUPS, groupFileCount, type Resource, type ResourceGroup, type ResourceSet } from '../data/resources';
import { downloadZip, type ZipEntry } from '../lib/zip';
import { useT } from '../i18n';

const ROOT = 'NovaStep Workshop Resources';
const fileName = (r: Resource) => r.file.split('/').pop()!;
const join = (...parts: string[]) => parts.filter(Boolean).join('/');

function entriesFor(group: ResourceGroup, set?: ResourceSet, root = ROOT): ZipEntry[] {
  const sets = set ? [set] : group.sets;
  return sets.flatMap((s) => s.items.map((it) => ({ url: it.file, path: join(root, group.folder, s.folder, fileName(it)) })));
}

type ZipState = { status: 'idle' } | { status: 'busy'; done: number; total: number } | { status: 'done' } | { status: 'error' };

/** Button that builds and downloads a ZIP; shows progress while fetching files. */
function ZipButton({ name, entries, label, primary }: { name: string; entries: () => ZipEntry[]; label: string; primary?: boolean }) {
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

function ResourceCard({ r, isLogo }: { r: Resource; isLogo: boolean }) {
  const t = useT();
  const ext = r.file.split('.').pop()!.toUpperCase();
  return (
    <figure className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900">
      <div
        className={
          isLogo
            ? 'flex aspect-[4/3] items-center justify-center bg-[repeating-conic-gradient(#e5e5e5_0%_25%,#fff_0%_50%)] bg-[length:16px_16px] p-4'
            : 'aspect-[4/3] bg-slate-100 dark:bg-slate-950'
        }
      >
        <img src={r.file} alt={r.title} loading="lazy" className={isLogo ? 'max-h-full max-w-full object-contain' : 'h-full w-full object-cover'} />
      </div>
      <figcaption className="flex flex-1 flex-col gap-1 p-3">
        <div className="truncate text-sm font-medium" title={r.title}>
          {t(r.title)}
        </div>
        <div className="line-clamp-2 text-[11px] text-slate-500 dark:text-slate-400">{r.usedIn}</div>
        <div className="mt-auto flex items-center gap-2 pt-2">
          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 dark:bg-white/10 dark:text-slate-300">{ext}</span>
          <a
            href={r.file}
            target="_blank"
            rel="noopener noreferrer"
            title={t('Open full size')}
            aria-label={t('Open full size')}
            className="ml-auto flex h-7 w-7 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
          >
            <ExternalLink size={13} />
          </a>
          <a
            href={r.file}
            download={fileName(r)}
            className="inline-flex h-7 items-center gap-1 rounded-full bg-indigo-600 px-3 text-[11px] font-semibold text-white hover:bg-indigo-700 dark:bg-indigo-500"
          >
            <Download size={12} /> {t('Download')}
          </a>
        </div>
      </figcaption>
    </figure>
  );
}

export default function ResourcesPage() {
  const t = useT();
  const total = RESOURCE_GROUPS.reduce((n, g) => n + groupFileCount(g), 0);
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 flex-1 basis-72">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('Resources')}</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            {t('Images to upload into your Shopify store during the workshop. Download a file, then upload it in the place shown on its card.')}
          </p>
        </div>
        <ZipButton
          primary
          name={`${ROOT}.zip`}
          label="Download all (ZIP)"
          entries={() => RESOURCE_GROUPS.flatMap((g) => entriesFor(g))}
        />
      </div>

      {/* Folder map of the ZIP so people know what they'll get */}
      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        {RESOURCE_GROUPS.map((g) => (
          <a
            key={g.id}
            href={`#res-${g.id}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-600 hover:border-indigo-300 hover:text-indigo-700 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
          >
            📁 {g.folder}
            <span className="tabular-nums text-slate-400">{groupFileCount(g)}</span>
          </a>
        ))}
        <span className="self-center text-slate-400">{t('{n} files in total', { n: total })}</span>
      </div>

      {RESOURCE_GROUPS.map((g) => (
        <section key={g.id} id={`res-${g.id}`} className="mt-10 scroll-mt-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-white/10">
            <div className="min-w-0">
              <h2 className="text-lg font-semibold">{t(g.title)}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t(g.description)} · <span className="tabular-nums">{t('{n} files', { n: groupFileCount(g) })}</span>
              </p>
            </div>
            <ZipButton name={`${g.folder}.zip`} label="Download section (ZIP)" entries={() => entriesFor(g, undefined, '')} />
          </div>

          <div className="space-y-6">
            {g.sets.map((s) => (
              <div key={s.id}>
                {g.sets.length > 1 && (
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                      <Package size={16} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold">{s.title}</h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{t('{n} files', { n: s.items.length })}</p>
                    </div>
                    <ZipButton name={`${s.folder}.zip`} label="Download product (ZIP)" entries={() => entriesFor(g, s, '').map((e) => ({ ...e, path: fileName({ file: e.url } as Resource) }))} />
                  </div>
                )}
                <div className={clsx('grid grid-cols-2 gap-3 sm:grid-cols-3', g.sets.length > 1 ? 'lg:grid-cols-5' : 'lg:grid-cols-4')}>
                  {s.items.map((r) => (
                    <ResourceCard key={r.file} r={r} isLogo={g.id === 'brand'} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
