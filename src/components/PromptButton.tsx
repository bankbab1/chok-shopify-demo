import { useState } from 'react';
import clsx from 'clsx';
import { ChevronDown, Info, Sparkles } from 'lucide-react';
import type { PromptSpec } from '../data/types';
import { CopyButton, Modal } from './ui';
import { useT } from '../i18n';

/** Button that opens a copy-ready prompt (e.g. for Shopify Sidekick) in a modal. */
export function PromptButton({ prompt }: { prompt: PromptSpec }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={t('Open the prompt to paste into Shopify Sidekick')}
        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 text-xs font-semibold text-indigo-700 transition hover:border-indigo-400 hover:bg-indigo-100 active:scale-95 dark:border-indigo-400/40 dark:bg-indigo-500/15 dark:text-indigo-200 dark:hover:bg-indigo-500/25"
      >
        <Sparkles size={13} />
        {t('Sidekick prompt')}
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={t(prompt.title)}
        icon={
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
            <Sparkles size={15} />
          </span>
        }
        footer={<CopyButton text={prompt.text} label="Copy prompt" primary />}
      >
        {prompt.tip && (
          <div className="mx-5 mt-4 flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-xs leading-relaxed text-slate-600 dark:bg-white/5 dark:text-slate-300">
            <Info size={14} className="mt-0.5 shrink-0" />
            <span>{t(prompt.tip)}</span>
          </div>
        )}
        <pre className="m-5 select-text whitespace-pre-wrap break-words rounded-xl bg-[#131922] p-4 font-mono text-[12.5px] leading-relaxed text-slate-200 dark:bg-black/40">
          {prompt.text}
        </pre>
      </Modal>
    </>
  );
}

/** Inline prompt card: header with Copy is always visible; the prompt text expands on demand (collapsed by default). */
export function PromptCard({ prompt }: { prompt: PromptSpec }) {
  const t = useT();
  const [open, setOpen] = useState(false);
  const lines = prompt.text.split('\n').length;
  return (
    <div className="overflow-hidden rounded-xl border border-indigo-200 bg-white dark:border-indigo-400/30 dark:bg-slate-900">
      <div className="flex flex-wrap items-center gap-3 bg-indigo-50/60 px-4 py-3 dark:bg-indigo-500/10">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex min-w-0 flex-1 basis-56 items-center gap-3 text-left"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
            <Sparkles size={16} />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-indigo-900 dark:text-indigo-100">{t(prompt.title)}</span>
            <span className="block text-xs text-indigo-800/70 dark:text-indigo-200/70">
              {open ? t('Click to hide the prompt') : t('Click to show the prompt ({n} lines)', { n: lines })}
            </span>
          </span>
          <ChevronDown size={16} className={clsx('ml-auto shrink-0 text-indigo-500 transition-transform duration-200', open && 'rotate-180')} />
        </button>
        <CopyButton text={prompt.text} label="Copy prompt" primary />
      </div>
      <div className="grid transition-[grid-template-rows] duration-200 ease-out" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
        <div className="overflow-hidden">
          {prompt.tip && (
            <div className="mx-4 mt-3 flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-xs leading-relaxed text-slate-600 dark:bg-white/5 dark:text-slate-300">
              <Info size={14} className="mt-0.5 shrink-0" />
              <span>{t(prompt.tip)}</span>
            </div>
          )}
          <pre className="m-4 select-text whitespace-pre-wrap break-words rounded-xl bg-[#131922] p-4 font-mono text-[12.5px] leading-relaxed text-slate-200 dark:bg-black/40">
            {prompt.text}
          </pre>
        </div>
      </div>
    </div>
  );
}
