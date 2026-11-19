import { Download, ExternalLink } from 'lucide-react';
import { RESOURCE_GROUPS } from '../data/resources';
import { useT } from '../i18n';

export default function ResourcesPage() {
  const t = useT();
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-8 sm:py-8">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t('Resources')}</h1>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        {t('Images to upload into your Shopify store during the workshop. Download a file, then upload it in the place shown on its card.')}
      </p>

      {RESOURCE_GROUPS.map((g) => (
        <section key={g.id} className="mt-8">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">{t(g.title)}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t(g.description)}</p>
            </div>
            <span className="shrink-0 text-xs tabular-nums text-slate-400">{t('{n} files', { n: g.items.length })}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {g.items.map((r) => {
              const ext = r.file.split('.').pop()!.toUpperCase();
              const fileName = r.file.split('/').pop();
              const isLogo = g.id === 'brand';
              return (
                <figure key={r.file} className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900">
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
                      {r.title}
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
                        download={fileName}
                        className="inline-flex h-7 items-center gap-1 rounded-full bg-indigo-600 px-3 text-[11px] font-semibold text-white hover:bg-indigo-700 dark:bg-indigo-500"
                      >
                        <Download size={12} /> {t('Download')}
                      </a>
                    </div>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
