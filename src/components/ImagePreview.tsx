import { useEffect } from 'react';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight, Download, ImageIcon } from 'lucide-react';
import { Modal } from './ui';
import { useT } from '../i18n';

export interface PreviewImage {
  src: string;
  title: string;
  subtitle?: string;
  badge?: string;
}

const fileName = (src: string) => src.split('/').pop()!;

/** Preview card in a modal: large image, role, Download button, ← → between images of the same set. */
export function ImagePreviewModal({
  images,
  index,
  onIndex,
  onClose,
  heading,
}: {
  images: PreviewImage[];
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
  heading?: string;
}) {
  const t = useT();
  const open = index !== null;
  const cur = open ? images[index] : null;
  const go = (d: number) => index !== null && onIndex((index + d + images.length) % images.length);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={heading ? `${heading} — ${cur?.title ?? ''}` : cur?.title}
      icon={
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
          <ImageIcon size={15} />
        </span>
      }
      footer={
        cur && (
          <>
            <span className="mr-auto truncate font-mono text-xs text-slate-500 dark:text-slate-400">{fileName(cur.src)}</span>
            <a
              href={cur.src}
              download={fileName(cur.src)}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-indigo-600 px-5 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500"
            >
              <Download size={16} /> {t('Download')}
            </a>
          </>
        )
      }
    >
      {cur && (
        <div className="space-y-3 p-5">
          <div className="relative overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-950">
            <img key={cur.src} src={cur.src} alt={cur.title} className="mx-auto max-h-[60vh] w-full object-contain motion-safe:animate-[fadeIn_.2s_ease-out]" />
            {cur.badge && (
              <span className="absolute left-3 top-3 rounded-md bg-indigo-600 px-2 py-0.5 text-[11px] font-bold text-white">{cur.badge}</span>
            )}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => go(-1)}
                  aria-label={t('Previous image')}
                  className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow hover:bg-white"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => go(1)}
                  aria-label={t('Next image')}
                  className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow hover:bg-white"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
          {cur.subtitle && <p className="text-sm text-slate-600 dark:text-slate-300">{cur.subtitle}</p>}
          {images.length > 1 && (
            <div className="flex justify-center gap-2">
              {images.map((im, i) => (
                <button
                  key={im.src}
                  onClick={() => onIndex(i)}
                  aria-label={im.title}
                  aria-current={i === index}
                  className={clsx(
                    'h-12 w-12 overflow-hidden rounded-lg border-2 transition',
                    i === index ? 'border-indigo-600 dark:border-indigo-400' : 'border-transparent opacity-60 hover:opacity-100',
                  )}
                >
                  <img src={im.src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
