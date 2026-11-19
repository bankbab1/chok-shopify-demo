import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import {
  Activity,
  Check,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  CircleHelp,
  FolderDown,
  House,
  Menu,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Presentation,
  Store,
  RotateCcw,
  Search,
  Sun,
  X,
} from 'lucide-react';
import { FLAT_TOPICS, SECTIONS } from '../data/guide';
import { SLIDES } from '../data/slides';
const SLIDE_COUNT = SLIDES.length;
import type { Section } from '../data/types';
import { useTheme } from '../hooks/useTheme';
import { ProgressProvider, useProgress } from '../hooks/useProgress';
import { usePersistedState } from '../hooks/usePersistedState';
import { useI18n, useT, type Lang } from '../i18n';
import { BeatProtocolLink } from './BeatProtocol';

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-400 dark:focus-visible:ring-indigo-300';
const ROW = 'flex w-full items-center gap-2.5 rounded-lg px-2.5 text-[13px] transition-colors';
const ROW_ACTIVE = 'bg-indigo-50 text-indigo-700 font-semibold dark:bg-indigo-500/20 dark:text-indigo-200';
const ROW_IDLE =
  'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white';

const EXTRA_LINKS = [
  { to: '/resources', label: 'Resources', icon: FolderDown },
  { to: '/help', label: 'Help & FAQ', icon: CircleHelp },
];
const PAGE_TITLES: Record<string, string> = { resources: 'Resources', help: 'Help & FAQ', present: 'Presentation', examples: 'Example Stores' };
const EXAMPLES_LINK = { to: '/examples', label: 'Example Stores', icon: Store };
const PRESENT_LINK = { to: '/present', label: 'Presentation', icon: Presentation };

export default function Layout() {
  return (
    <ProgressProvider>
      <Shell />
    </ProgressProvider>
  );
}

/** App mark: pulse line on a purple rounded square (also used as the favicon). */
export function AppLogo({ size = 32 }: { size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-[9px] bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-sm shadow-indigo-900/20"
      style={{ width: size, height: size }}
    >
      <Activity size={Math.round(size * 0.56)} strokeWidth={2.4} />
    </span>
  );
}

function Shell() {
  const t = useT();
  const [theme, setTheme] = useTheme();
  const [collapsed, setCollapsed] = usePersistedState('sdp-sidebar-collapsed', false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    setMobileOpen(false);
    document.getElementById('main-scroll')?.scrollTo({ top: 0 });
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.style.colorScheme = theme;
    document.body.style.background = theme === 'dark' ? '#16181d' : '#f6f5fa';
  }, [theme]);

  const [, sectionId = '', topicId] = location.pathname.split('/');
  const section = SECTIONS.find((s) => s.id === sectionId);
  const topic = section?.topics.find((tp) => tp.id === topicId);

  return (
    <div data-theme={theme} className="flex h-dvh overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      {/* Desktop sidebar */}
      <aside
        className={clsx(
          'hidden min-h-0 shrink-0 border-r border-slate-200 bg-white transition-[width] duration-200 lg:flex lg:flex-col dark:border-white/10 dark:bg-slate-900',
          collapsed ? 'w-[68px]' : 'w-72',
        )}
      >
        <div className={clsx('flex h-16 shrink-0 items-center gap-2 border-b border-slate-200 dark:border-white/10', collapsed ? 'justify-center' : 'pl-4 pr-2')}>
          {!collapsed && <Brand />}
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={t(collapsed ? 'Expand sidebar' : 'Collapse sidebar')}
            title={t(collapsed ? 'Expand sidebar' : 'Collapse sidebar')}
            className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-white"
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>
        {collapsed ? <CollapsedNav /> : <ExpandedNav />}
        <SidebarFooter collapsed={collapsed} theme={theme} onToggleTheme={toggleTheme} />
      </aside>

      {/* Mobile drawer */}
      <div className={clsx('fixed inset-0 z-50 lg:hidden', mobileOpen ? 'pointer-events-auto' : 'pointer-events-none')} aria-hidden={!mobileOpen}>
        <div className={clsx('absolute inset-0 bg-black/40 transition-opacity', mobileOpen ? 'opacity-100' : 'opacity-0')} onClick={() => setMobileOpen(false)} />
        <aside
          className={clsx(
            'absolute inset-y-0 left-0 flex w-80 max-w-[88vw] flex-col bg-white shadow-xl transition-transform duration-200 dark:bg-slate-900',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 pl-4 pr-2 dark:border-white/10">
            <Brand />
            <button
              onClick={() => setMobileOpen(false)}
              aria-label={t('Close menu')}
              className="flex h-9 w-9 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>
          <ExpandedNav />
          <SidebarFooter collapsed={false} theme={theme} onToggleTheme={toggleTheme} />
        </aside>
      </div>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-slate-200 bg-white px-3 sm:px-6 lg:h-16 dark:border-white/10 dark:bg-slate-900">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 lg:hidden dark:text-slate-400 dark:hover:bg-white/10"
            aria-label={t('Open menu')}
          >
            <Menu size={20} />
          </button>
          <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
            {section ? (
              <>
                <Link
                  to={`/${section.id}`}
                  className={clsx('truncate', topic ? 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white' : 'font-semibold')}
                >
                  {t(section.title)}
                </Link>
                {topic && (
                  <>
                    <ChevronRight size={14} className="shrink-0 text-slate-400" />
                    {topic.group && <span className="hidden truncate text-slate-500 sm:inline dark:text-slate-400">{t(topic.group)}</span>}
                    {topic.group && <ChevronRight size={14} className="hidden shrink-0 text-slate-400 sm:inline" />}
                    <span className="truncate font-semibold">{t(topic.title)}</span>
                  </>
                )}
              </>
            ) : (
              <span className="font-semibold">{t(PAGE_TITLES[sectionId] ?? 'Overview')}</span>
            )}
          </nav>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <HeaderProgress />
            <LangToggle />
            <button
              onClick={toggleTheme}
              aria-label={t('Toggle dark mode')}
              title={t('Toggle dark mode')}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition hover:bg-slate-100 active:scale-90 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/10"
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </header>
        <main id="main-scroll" className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function Brand() {
  const t = useT();
  return (
    <Link to="/" className={clsx('flex min-w-0 items-center gap-2.5 rounded-lg', FOCUS)} title={t('Go to overview')}>
      <AppLogo size={34} />
      <div className="min-w-0">
        <div className="truncate text-[15px] font-semibold leading-tight text-slate-900 dark:text-white">Shopify Demo</div>
        <div className="truncate text-[11px] text-slate-500 dark:text-slate-400">{t('NovaStep demo session guide')}</div>
      </div>
    </Link>
  );
}

function LangToggle() {
  const { lang, setLang, t } = useI18n();
  const opts: { v: Lang; label: string }[] = [
    { v: 'th', label: 'ไทย' },
    { v: 'en', label: 'EN' },
  ];
  return (
    <div role="group" aria-label={t('Language')} className="flex h-9 items-center rounded-full border border-slate-200 p-0.5 text-xs font-semibold dark:border-white/10">
      {opts.map((o) => (
        <button
          key={o.v}
          onClick={() => setLang(o.v)}
          aria-pressed={lang === o.v}
          className={clsx(
            'h-full rounded-full px-2.5 transition',
            lang === o.v ? 'bg-indigo-600 text-white dark:bg-indigo-500' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function HeaderProgress() {
  const t = useT();
  const { done } = useProgress();
  const count = FLAT_TOPICS.filter((tp) => done[tp.path]).length;
  return (
    <div className="hidden items-center gap-1.5 text-xs text-slate-500 md:flex dark:text-slate-400" title={t('Topics marked as done in this browser')}>
      <CircleCheck size={14} />
      <span className="tabular-nums">
        {count}/{FLAT_TOPICS.length}
      </span>
    </div>
  );
}

/** Small ring showing a module's completion; a filled check when the whole module is done. */
function ProgressRing({ n, total }: { n: number; total: number }) {
  if (n === 0) return null;
  if (n === total)
    return (
      <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white dark:bg-indigo-500">
        <Check size={11} strokeWidth={3} />
      </span>
    );
  const r = 7;
  const c = 2 * Math.PI * r;
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" className="shrink-0 -rotate-90" aria-label={`${n}/${total}`}>
      <circle cx="9" cy="9" r={r} fill="none" strokeWidth="2.5" className="stroke-slate-200 dark:stroke-white/15" />
      <circle cx="9" cy="9" r={r} fill="none" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - n / total)} className="stroke-indigo-600 dark:stroke-indigo-400" />
    </svg>
  );
}

function sectionDone(section: Section, done: Record<string, boolean>) {
  return section.topics.filter((tp) => done[`/${section.id}/${tp.id}`]).length;
}

function ExpandedNav() {
  const t = useT();
  const location = useLocation();
  const { done } = useProgress();
  const [query, setQuery] = useState('');
  const activeSection = location.pathname.split('/')[1];
  // Accordion: one module open at a time; it follows the current route.
  const [openId, setOpenId] = useState<string | null>(activeSection || null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (activeSection && SECTIONS.some((s) => s.id === activeSection)) setOpenId(activeSection);
  }, [activeSection]);

  // Keep the current item visible after navigation (wait for the accordion to open).
  useEffect(() => {
    const id = setTimeout(() => {
      navRef.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, 220);
    return () => clearTimeout(id);
  }, [location.pathname]);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!q) return SECTIONS;
    const hit = (...xs: (string | undefined)[]) => xs.some((x) => x && (x.toLowerCase().includes(q) || t(x).toLowerCase().includes(q)));
    return SECTIONS.map((s) => ({ ...s, topics: s.topics.filter((tp) => hit(s.title, tp.title, tp.group, tp.summary)) })).filter((s) => s.topics.length > 0);
  }, [q, t]);

  return (
    <>
      <div className="shrink-0 px-3 pb-2 pt-3">
        <label className="relative block">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('Search topics…')}
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-8 text-xs outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/15 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:focus:border-indigo-400"
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="Clear" className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-white/10">
              <X size={12} />
            </button>
          )}
        </label>
      </div>

      <nav ref={navRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-3">
        <NavLink to="/" end className={({ isActive }) => clsx(ROW, 'h-9', FOCUS, isActive ? ROW_ACTIVE : ROW_IDLE)}>
          <House size={17} className="shrink-0" />
          <span className="truncate">{t('Overview')}</span>
        </NavLink>
        <NavLink to={PRESENT_LINK.to} className={({ isActive }) => clsx(ROW, 'mt-0.5 h-9', FOCUS, isActive ? ROW_ACTIVE : ROW_IDLE)}>
          <PRESENT_LINK.icon size={17} className="shrink-0" />
          <span className="min-w-0 flex-1 truncate">{t(PRESENT_LINK.label)}</span>
          <span className="rounded-full bg-indigo-100 px-1.5 py-px text-[10px] font-semibold tabular-nums text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">{SLIDE_COUNT}</span>
        </NavLink>
        <NavLink to={EXAMPLES_LINK.to} className={({ isActive }) => clsx(ROW, 'mt-0.5 h-9', FOCUS, isActive ? ROW_ACTIVE : ROW_IDLE)}>
          <EXAMPLES_LINK.icon size={17} className="shrink-0" />
          <span className="truncate">{t(EXAMPLES_LINK.label)}</span>
        </NavLink>

        <div className="mb-1 mt-4 px-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">{t('Modules')}</div>

        <div className="space-y-0.5">
          {filtered.map((section) => {
            const number = SECTIONS.findIndex((s) => s.id === section.id) + 1;
            const isOpen = q ? true : openId === section.id;
            const isActive = activeSection === section.id;
            const n = sectionDone(section, done);
            let lastGroup: string | undefined;
            return (
              <div key={section.id}>
                <button
                  onClick={() => setOpenId((o) => (o === section.id ? null : section.id))}
                  className={clsx(
                    ROW,
                    'h-10',
                    FOCUS,
                    isActive ? 'font-semibold text-slate-900 dark:text-white' : ROW_IDLE,
                    isActive && !isOpen && 'bg-indigo-50 dark:bg-indigo-500/20',
                  )}
                  aria-expanded={isOpen}
                >
                  <span
                    className={clsx(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors',
                      isActive ? 'bg-indigo-600 text-white dark:bg-indigo-500' : 'bg-slate-100 text-slate-500 dark:bg-white/10 dark:text-slate-300',
                    )}
                  >
                    <section.icon size={15} />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-left">
                    <span className="mr-1.5 text-[11px] font-medium tabular-nums text-slate-400">{String(number).padStart(2, '0')}</span>
                    {t(section.title)}
                  </span>
                  <ProgressRing n={n} total={section.topics.length} />
                  <ChevronDown size={14} className={clsx('shrink-0 text-slate-400 transition-transform duration-200', isOpen && 'rotate-180')} />
                </button>

                <div className="grid transition-[grid-template-rows] duration-200 ease-out" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
                  <div className="overflow-hidden">
                    <ul className="relative mb-1.5 ml-[23px] mt-0.5 border-l border-slate-200 py-0.5 dark:border-white/10">
                      {section.topics.map((topic) => {
                        const showGroup = topic.group && topic.group !== lastGroup;
                        lastGroup = topic.group;
                        const path = `/${section.id}/${topic.id}`;
                        const isDone = !!done[path];
                        return (
                          <li key={topic.id}>
                            {showGroup && (
                              <div className="pb-0.5 pl-4 pt-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{t(topic.group!)}</div>
                            )}
                            <NavLink
                              to={path}
                              tabIndex={isOpen ? 0 : -1}
                              className={({ isActive: a }) =>
                                clsx(
                                  'relative -ml-px flex min-h-8 items-center gap-2 border-l-2 py-1.5 pl-3.5 pr-2 text-[13px] transition-colors',
                                  FOCUS,
                                  a
                                    ? 'border-indigo-600 font-semibold text-indigo-700 dark:border-indigo-400 dark:text-indigo-200'
                                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-900 dark:text-slate-400 dark:hover:border-white/30 dark:hover:text-white',
                                )
                              }
                            >
                              <span className="min-w-0 flex-1 truncate">{t(topic.title)}</span>
                              {isDone && <Check size={13} strokeWidth={2.5} className="shrink-0 text-indigo-600 dark:text-indigo-300" aria-label={t('Completed')} />}
                            </NavLink>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && <p className="px-3 py-4 text-xs text-slate-400">{t('No topics match “{q}”.', { q: query })}</p>}
        </div>

        <div className="mx-2.5 my-3 border-t border-slate-100 dark:border-white/10" />
        <div className="space-y-0.5">
          {EXTRA_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => clsx(ROW, 'h-9', FOCUS, isActive ? ROW_ACTIVE : ROW_IDLE)}>
              <l.icon size={17} className="shrink-0" />
              <span className="truncate">{t(l.label)}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}

function CollapsedNav() {
  const t = useT();
  const location = useLocation();
  const { done } = useProgress();
  const activeSection = location.pathname.split('/')[1];
  const tile = (active: boolean) =>
    clsx('relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors', FOCUS, active ? 'bg-indigo-600 text-white dark:bg-indigo-500' : ROW_IDLE);
  return (
    <nav className="flex min-h-0 flex-1 flex-col items-center gap-1.5 overflow-y-auto px-3 py-3">
      <NavLink to="/" end title={t('Overview')} className={({ isActive }) => tile(isActive)}>
        <House size={18} />
      </NavLink>
      <NavLink to={PRESENT_LINK.to} title={t(PRESENT_LINK.label)} className={({ isActive }) => tile(isActive)}>
        <PRESENT_LINK.icon size={18} />
      </NavLink>
      <NavLink to={EXAMPLES_LINK.to} title={t(EXAMPLES_LINK.label)} className={({ isActive }) => tile(isActive)}>
        <EXAMPLES_LINK.icon size={18} />
      </NavLink>
      <div className="my-1 w-8 border-t border-slate-100 dark:border-white/10" />
      {SECTIONS.map((s) => {
        const complete = sectionDone(s, done) === s.topics.length;
        return (
          <Link key={s.id} to={`/${s.id}`} title={t(s.title)} className={tile(activeSection === s.id)}>
            <s.icon size={18} />
            {complete && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-slate-900" />}
          </Link>
        );
      })}
      <div className="my-1 w-8 border-t border-slate-100 dark:border-white/10" />
      {EXTRA_LINKS.map((l) => (
        <NavLink key={l.to} to={l.to} title={t(l.label)} className={({ isActive }) => tile(isActive)}>
          <l.icon size={18} />
        </NavLink>
      ))}
    </nav>
  );
}

function SidebarFooter({ collapsed, theme, onToggleTheme }: { collapsed: boolean; theme: string; onToggleTheme: () => void }) {
  const t = useT();
  const { done, reset } = useProgress();
  const count = FLAT_TOPICS.filter((tp) => done[tp.path]).length;
  const pct = Math.round((count / FLAT_TOPICS.length) * 100);
  if (collapsed) {
    return (
      <div className="flex shrink-0 flex-col items-center gap-2 border-t border-slate-100 py-3 dark:border-white/10">
        <button onClick={onToggleTheme} title={t('Toggle dark mode')} aria-label={t('Toggle dark mode')} className={clsx('flex h-10 w-10 items-center justify-center rounded-lg', ROW_IDLE)}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <span className="text-[10px] tabular-nums text-slate-400">{pct}%</span>
        <BeatProtocolLink compact />
      </div>
    );
  }
  return (
    <div className="shrink-0 border-t border-slate-100 px-4 py-3 dark:border-white/10">
      <BeatProtocolLink />
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-medium text-slate-600 dark:text-slate-300">{t('Demo progress')}</span>
        <span className="tabular-nums text-slate-500 dark:text-slate-400">
          {count}/{FLAT_TOPICS.length} · {pct}%
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-700 transition-[width] duration-300" style={{ width: `${pct}%` }} />
      </div>
      {count > 0 && (
        <button onClick={reset} className="mt-2 flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-700 dark:hover:text-white">
          <RotateCcw size={11} /> {t('Reset progress')}
        </button>
      )}
      <BuildInfo />
    </div>
  );
}

/** Which commit is live — handy to confirm a Cloudflare deploy picked up the latest push. */
function BuildInfo() {
  const built = new Date(__BUILD_TIME__);
  const when = built.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Bangkok' });
  return (
    <a
      href={`https://github.com/bankbab1/chok-shopify-demo/commit/${__BUILD_SHA__}`}
      target="_blank"
      rel="noopener noreferrer"
      title={`Build ${__BUILD_SHA__} · ${built.toISOString()}`}
      className="mt-2 block font-mono text-[10px] text-slate-400 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-300"
    >
      build {__BUILD_SHA__} · {when}
    </a>
  );
}
