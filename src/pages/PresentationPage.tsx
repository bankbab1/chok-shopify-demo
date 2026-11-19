import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Expand,
  Keyboard,
  MonitorOff,
  NotebookPen,
  Pause,
  Play,
  RotateCcw,
  Timer,
} from 'lucide-react';
import { SLIDES } from '../data/slides';
import { SECTIONS } from '../data/guide';

/** App module number ("02") for a hands-on link like "/create-store" — matches the sidebar, not the slide's own numbering. */
function moduleNo(to: string) {
  const i = SECTIONS.findIndex((sec) => `/${sec.id}` === to);
  return i < 0 ? '' : String(i + 1).padStart(2, '0');
}
import { useI18n } from '../i18n';
import { usePersistedState } from '../hooks/usePersistedState';

const src = (file: number) => `/slides/slide-${String(file).padStart(2, '0')}.webp`;
const srcAt = (n: number) => src(SLIDES[n - 1].file);

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function PresentationPage() {
  const { slide: slideParam } = useParams();
  const n = Number(slideParam ?? 1);
  if (!Number.isInteger(n) || n < 1 || n > SLIDES.length) return <Navigate to="/present/1" replace />;
  return <Presenter n={n} />;
}

function Presenter({ n }: { n: number }) {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const stageRef = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const [isFull, setIsFull] = useState(false);
  const [blank, setBlank] = useState(false);
  const [showNotes, setShowNotes] = usePersistedState('sdp-present-notes', true);
  const [showKeys, setShowKeys] = useState(false);

  const slide = SLIDES[n - 1];
  const next = SLIDES[n];

  const go = useCallback(
    (to: number) => {
      const clamped = Math.min(SLIDES.length, Math.max(1, to));
      setBlank(false);
      navigate(`/present/${clamped}`, { replace: true });
    },
    [navigate],
  );

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void stageRef.current?.requestFullscreen?.();
  }, []);

  // Keyboard: works like PowerPoint / Keynote clickers (most clickers send PageUp/PageDown).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest('input, textarea, select, [contenteditable="true"]') || e.metaKey || e.ctrlKey || e.altKey) return;
      if (document.querySelector('[role="dialog"]')) return;
      const k = e.key;
      if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(k)) go(n + 1);
      else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(k)) go(n - 1);
      else if (k === 'Home') go(1);
      else if (k === 'End') go(SLIDES.length);
      else if (k === 'f' || k === 'F') toggleFullscreen();
      else if (k === 'b' || k === 'B' || k === '.') setBlank((v) => !v);
      else if (k === 'n' || k === 'N') setShowNotes((v) => !v);
      else if (k === '?') setShowKeys((v) => !v);
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [n, go, toggleFullscreen, setShowNotes]);

  useEffect(() => {
    const onFs = () => setIsFull(document.fullscreenElement === stageRef.current);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  // Preload neighbours so the next click is instant.
  useEffect(() => {
    [n + 1, n + 2, n - 1].filter((x) => x >= 1 && x <= SLIDES.length).forEach((x) => {
      const im = new Image();
      im.src = srcAt(x);
    });
  }, [n]);

  useEffect(() => {
    thumbsRef.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [n]);

  return (
    <div className="mx-auto flex max-w-[1500px] flex-col gap-4 px-4 py-4 sm:px-6 lg:py-6">
      <div className={clsx('grid gap-4', showNotes && 'xl:grid-cols-[minmax(0,1fr)_340px]')}>
        {/* ---------------- Stage ---------------- */}
        <div className="min-w-0">
          <div
            ref={stageRef}
            className={clsx(
              'group relative overflow-hidden bg-black',
              isFull ? 'flex h-screen w-screen items-center justify-center' : 'aspect-video rounded-xl shadow-lg ring-1 ring-black/5',
            )}
          >
            <img
              key={n}
              src={srcAt(n)}
              alt={`${n}. ${slide.title}`}
              draggable={false}
              className={clsx('h-full w-full select-none object-contain motion-safe:animate-[fadeIn_.2s_ease-out]', blank && 'invisible')}
            />
            {/* Click left/right third to go back/forward (handy on a touch screen or in fullscreen). */}
            <button aria-label={t('Previous slide')} onClick={() => go(n - 1)} className="absolute inset-y-0 left-0 w-1/3 cursor-w-resize focus:outline-none" />
            <button aria-label={t('Next slide')} onClick={() => go(n + 1)} className="absolute inset-y-0 right-0 w-2/3 cursor-e-resize focus:outline-none" />
            {blank && <div className="pointer-events-none absolute inset-0 flex items-end justify-center pb-6 text-xs text-white/30">{t('Screen blanked — press B to resume')}</div>}
            <div
              className={clsx(
                'pointer-events-none absolute bottom-3 right-3 rounded-full bg-black/55 px-3 py-1 text-xs tabular-nums text-white transition-opacity',
                isFull ? 'opacity-0 group-hover:opacity-100' : 'opacity-0 group-hover:opacity-100',
              )}
            >
              {n} / {SLIDES.length}
            </div>
          </div>

          {/* Controls */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <CtrlButton onClick={() => go(n - 1)} disabled={n === 1} label={t('Previous slide')}>
              <ChevronLeft size={18} />
            </CtrlButton>
            <div className="min-w-[72px] text-center text-sm font-semibold tabular-nums">
              {n} <span className="text-slate-400">/ {SLIDES.length}</span>
            </div>
            <CtrlButton onClick={() => go(n + 1)} disabled={n === SLIDES.length} label={t('Next slide')}>
              <ChevronRight size={18} />
            </CtrlButton>
            <div className="mx-1 hidden h-6 w-px bg-slate-200 sm:block dark:bg-white/10" />
            <div className="min-w-0 flex-1 basis-40 truncate text-sm font-medium text-slate-700 dark:text-slate-200">{slide.title}</div>
            <CtrlButton onClick={() => setBlank((v) => !v)} label={t('Blank screen (B)')} active={blank}>
              <MonitorOff size={16} />
            </CtrlButton>
            <CtrlButton onClick={() => setShowNotes((v) => !v)} label={t('Speaker notes (N)')} active={showNotes}>
              <NotebookPen size={16} />
            </CtrlButton>
            <CtrlButton onClick={() => setShowKeys((v) => !v)} label={t('Keyboard shortcuts (?)')} active={showKeys}>
              <Keyboard size={16} />
            </CtrlButton>
            <button
              onClick={toggleFullscreen}
              className="inline-flex h-9 items-center gap-2 rounded-full bg-indigo-600 px-4 text-xs font-semibold text-white transition hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500"
            >
              <Expand size={14} /> {t('Present (F)')}
            </button>
          </div>

          <div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
            <div className="h-full rounded-full bg-indigo-600 transition-[width] duration-300 dark:bg-indigo-400" style={{ width: `${(n / SLIDES.length) * 100}%` }} />
          </div>

          {showKeys && (
            <div className="mt-3 grid gap-x-6 gap-y-1.5 rounded-xl border border-slate-200 bg-white p-4 text-xs sm:grid-cols-2 dark:border-white/10 dark:bg-slate-900">
              {[
                ['→  Space  PageDown', t('Next slide')],
                ['←  PageUp', t('Previous slide')],
                ['Home / End', t('First / last slide')],
                ['F', t('Fullscreen (Esc to exit)')],
                ['B', t('Blank screen')],
                ['N', t('Show / hide speaker notes')],
              ].map(([k, d]) => (
                <div key={k} className="flex items-center gap-3">
                  <kbd className="min-w-[120px] rounded-md bg-slate-100 px-2 py-1 font-mono text-[11px] text-slate-700 dark:bg-white/10 dark:text-slate-200">{k}</kbd>
                  <span className="text-slate-600 dark:text-slate-300">{d}</span>
                </div>
              ))}
              <p className="text-[11px] text-slate-400 sm:col-span-2">{t('Presentation clickers that send PageUp / PageDown work too.')}</p>
            </div>
          )}
        </div>

        {/* ---------------- Speaker panel ---------------- */}
        {showNotes && (
          <aside className="flex min-w-0 flex-col gap-4">
            <SpeakerTimer n={n} />
            <div className="rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900">
              <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 text-sm font-semibold dark:border-white/10">
                <NotebookPen size={15} className="text-indigo-500" /> {t('Speaker notes')}
                {slide.minutes && <span className="ml-auto text-[11px] font-normal text-slate-400">~{t('{n} min', { n: slide.minutes })}</span>}
              </div>
              <ul className="space-y-2.5 px-4 py-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                {slide.notes[lang].map((note) => (
                  <li key={note} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
              {slide.links && (
                <div className="flex flex-col gap-2 border-t border-slate-100 px-4 py-3 dark:border-white/10">
                  {slide.links.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      className="group flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100 dark:bg-indigo-500/15 dark:text-indigo-200 dark:hover:bg-indigo-500/25"
                    >
                      {moduleNo(l.to) && (
                        <span className="rounded-md bg-indigo-600 px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-white dark:bg-indigo-500">{moduleNo(l.to)}</span>
                      )}
                      <span className="flex-1">{t(l.label)}</span>
                      <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {next && (
              <button
                onClick={() => go(n + 1)}
                className="group overflow-hidden rounded-xl border border-slate-200 bg-white text-left transition hover:border-indigo-300 dark:border-white/10 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {t('Up next')} <span className="tabular-nums">{next.n}</span>
                </div>
                <img src={src(next.file)} alt="" loading="lazy" className="aspect-video w-full bg-black object-contain" />
                <div className="truncate px-4 py-2 text-xs font-medium">{next.title}</div>
              </button>
            )}
          </aside>
        )}
      </div>

      {/* ---------------- Thumbnails ---------------- */}
      <div ref={thumbsRef} className="flex gap-2 overflow-x-auto pb-2">
        {SLIDES.map((sl) => (
          <button
            key={sl.n}
            onClick={() => go(sl.n)}
            aria-current={sl.n === n}
            title={`${sl.n}. ${sl.title}`}
            className={clsx(
              'relative w-36 shrink-0 overflow-hidden rounded-lg border-2 transition',
              sl.n === n ? 'border-indigo-600 shadow-md dark:border-indigo-400' : 'border-transparent opacity-70 hover:opacity-100',
            )}
          >
            <img src={src(sl.file)} alt="" loading="lazy" className="aspect-video w-full bg-black object-cover" />
            <span className="absolute left-1 top-1 rounded bg-black/60 px-1.5 text-[10px] font-semibold tabular-nums text-white">{sl.n}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function CtrlButton({ onClick, disabled, label, active, children }: { onClick: () => void; disabled?: boolean; label: string; active?: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={clsx(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition active:scale-95 disabled:opacity-30',
        active
          ? 'border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500'
          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-white/10',
      )}
    >
      {children}
    </button>
  );
}

/** Elapsed-time clock for the speaker; starts automatically on the first slide change. */
function SpeakerTimer({ n }: { n: number }) {
  const { t } = useI18n();
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const firstSlide = useRef(n);

  useEffect(() => {
    if (n !== firstSlide.current) setRunning(true);
  }, [n]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const planned = SLIDES.reduce((sum, sl) => sum + (sl.minutes ?? 0), 0);
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-900">
      <Timer size={18} className="text-indigo-500" />
      <div className="flex-1">
        <div className="text-2xl font-bold tabular-nums leading-none">{formatTime(elapsed)}</div>
        <div className="mt-1 text-[11px] text-slate-400">{t('Planned ~{n} min', { n: planned })}</div>
      </div>
      <button
        onClick={() => setRunning((r) => !r)}
        aria-label={t(running ? 'Pause timer' : 'Start timer')}
        title={t(running ? 'Pause timer' : 'Start timer')}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500"
      >
        {running ? <Pause size={15} /> : <Play size={15} className="translate-x-px" />}
      </button>
      <button
        onClick={() => {
          setRunning(false);
          setElapsed(0);
        }}
        aria-label={t('Reset timer')}
        title={t('Reset timer')}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-white/10 dark:hover:bg-white/10"
      >
        <RotateCcw size={14} />
      </button>
    </div>
  );
}
