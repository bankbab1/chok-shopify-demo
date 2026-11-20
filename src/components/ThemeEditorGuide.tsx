import { useState, type ReactNode } from 'react';
import clsx from 'clsx';
import {
  AlertTriangle,
  ArrowDownUp,
  CheckCircle2,
  Code2,
  FileCode2,
  GitBranch,
  MousePointer2,
  PanelTop,
  Terminal,
  XCircle,
  Copy,
  Eye,
  EyeOff,
  Globe,
  Layers,
  LayoutTemplate,
  MonitorSmartphone,
  MousePointerClick,
  Palette,
  Save,
  SlidersHorizontal,
  Square,
  Undo2,
  type LucideIcon,
} from 'lucide-react';
import { useI18n } from '../i18n';

type L = { en: string; th: string };

/* ------------------------------------------------------------------ 1. The building blocks */

type LevelKey = 'theme' | 'group' | 'template' | 'section' | 'block';

/** Each level has its own colour so the selected one is easy to spot. */
const LEVELS: { key: LevelKey; name: string; icon: LucideIcon; box: string; ring: string; chip: string; what: L; example: L }[] = [
  {
    key: 'theme',
    name: 'Theme',
    icon: Palette,
    box: 'border-violet-300 bg-violet-50/70 dark:border-violet-400/40 dark:bg-violet-500/10',
    ring: 'ring-4 ring-violet-500 border-violet-500 shadow-lg shadow-violet-500/20',
    chip: 'bg-violet-600 border-violet-600',
    what: { en: 'The whole design of the store — layouts, styles and global settings.', th: 'การออกแบบทั้งหมดของร้าน — เลย์เอาต์ สไตล์ และการตั้งค่าทั้งร้าน' },
    example: { en: 'Horizon', th: 'Horizon' },
  },
  {
    key: 'group',
    name: 'Section group',
    icon: PanelTop,
    box: 'border-rose-300 bg-rose-50/70 dark:border-rose-400/40 dark:bg-rose-500/10',
    ring: 'ring-4 ring-rose-500 border-rose-500 shadow-lg shadow-rose-500/20',
    chip: 'bg-rose-600 border-rose-600',
    what: {
      en: 'The Header and the Footer. They wrap every page and are shared by all templates — edit them once and every page changes.',
      th: 'Header และ Footer ครอบทุกหน้าและใช้ร่วมกันทุก Template — แก้ครั้งเดียว ทุกหน้าเปลี่ยนตาม',
    },
    example: { en: 'Header (logo, menu) · Footer (JOIN US, copyright)', th: 'Header (โลโก้ เมนู) · Footer (JOIN US, ลิขสิทธิ์)' },
  },
  {
    key: 'template',
    name: 'Template',
    icon: LayoutTemplate,
    box: 'border-sky-300 bg-sky-50/70 dark:border-sky-400/40 dark:bg-sky-500/10',
    ring: 'ring-4 ring-sky-500 border-sky-500 shadow-lg shadow-sky-500/20',
    chip: 'bg-sky-600 border-sky-600',
    what: {
      en: 'The body of one page type, between the Header and the Footer. Every product page shares the Product template.',
      th: 'ส่วนเนื้อหา (Body) ของหน้าแต่ละประเภท อยู่ระหว่าง Header กับ Footer สินค้าทุกชิ้นใช้ Template สินค้าร่วมกัน',
    },
    example: { en: 'Home page · Product · Collection · Page (about-us-mod)', th: 'Home page · Product · Collection · Page (about-us-mod)' },
  },
  {
    key: 'section',
    name: 'Section',
    icon: Square,
    box: 'border-emerald-300 bg-emerald-50/70 dark:border-emerald-400/40 dark:bg-emerald-500/10',
    ring: 'ring-4 ring-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/20',
    chip: 'bg-emerald-600 border-emerald-600',
    what: { en: 'A full-width band of the page that you add, reorder, hide or remove.', th: 'แถบเต็มความกว้างของหน้า ที่เพิ่ม สลับลำดับ ซ่อน หรือลบได้' },
    example: { en: 'Hero · Featured collection · Image with text · Featured product', th: 'Hero · Featured collection · Image with text · Featured product' },
  },
  {
    key: 'block',
    name: 'Block',
    icon: Layers,
    box: 'border-amber-300 bg-amber-50/80 dark:border-amber-400/40 dark:bg-amber-500/10',
    ring: 'ring-4 ring-amber-500 border-amber-500 shadow-lg shadow-amber-500/20',
    chip: 'bg-amber-500 border-amber-500',
    what: {
      en: 'A piece inside a section — heading, text, button, image. In Horizon, a Group block can hold other blocks, so blocks nest.',
      th: 'ชิ้นส่วนภายใน Section เช่น หัวข้อ ข้อความ ปุ่ม รูป ใน Horizon บล็อก Group ใส่บล็อกอื่นไว้ข้างในได้ จึงซ้อนกันได้',
    },
    example: { en: 'Heading “EVERY STEP” · Text · Button · Group', th: 'Heading “EVERY STEP” · Text · Button · Group' },
  },
];

const level = (k: LevelKey) => LEVELS.find((l) => l.key === k)!;

function BuildingBlocks() {
  const { lang } = useI18n();
  const [active, setActive] = useState<LevelKey>('section');
  const info = level(active);

  /** A clickable layer box: strong coloured ring when selected, faded when another level is selected. */
  const Box = ({ k, label, className, children }: { k: LevelKey; label?: string; className?: string; children?: ReactNode }) => {
    const l = level(k);
    const on = active === k;
    return (
      <div
        role="button"
        tabIndex={0}
        aria-pressed={on}
        onClick={(e) => {
          e.stopPropagation();
          setActive(k);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            setActive(k);
          }
        }}
        className={clsx(
          'cursor-pointer rounded-lg border-2 transition duration-200 focus-visible:outline-none',
          // Unselected layers go neutral grey (not transparent — opacity would also dim the selected child inside).
          on ? clsx(l.box, l.ring) : 'border-slate-200 bg-white/70 hover:border-slate-400 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/30',
          className,
        )}
      >
        <span className={clsx('flex items-center gap-1.5 text-xs font-semibold', on ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300')}>
          <l.icon size={13} />
          {l.name}
          {label && <span className="font-normal text-slate-500 dark:text-slate-400">· {label}</span>}
        </span>
        {children}
      </div>
    );
  };

  const Chip = ({ text }: { text: string }) => {
    const on = active === 'block';
    return (
      <span
        role="button"
        tabIndex={0}
        aria-pressed={on}
        onClick={(e) => {
          e.stopPropagation();
          setActive('block');
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.stopPropagation();
            setActive('block');
          }
        }}
        className={clsx(
          'cursor-pointer rounded border-2 px-2 py-0.5 text-[11px] font-medium transition',
          on
            ? clsx(level('block').box, level('block').ring, 'text-slate-900 dark:text-white')
            : 'border-slate-200 bg-white text-slate-500 hover:border-slate-400 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400',
        )}
      >
        {text}
      </span>
    );
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
      <div className="text-sm font-semibold">{lang === 'th' ? '1 · แนวคิด: หน้าเว็บประกอบจากบล็อกซ้อนกัน' : '1 · The idea: a page is built from nested blocks'}</div>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {lang === 'th'
          ? 'เหมือนตัวต่อ LEGO หรือ Visual block builder: ไม่ต้องเขียนโค้ด แค่วางชิ้นส่วนซ้อนกันแล้วปรับค่า หน้าเว็บแบ่งเป็น Header · Body (Template) · Footer — คลิกแต่ละชั้นเพื่อดูคำอธิบาย'
          : 'Like LEGO or any visual block builder: no code — you stack pieces inside each other and adjust their settings. Every page is Header · Body (template) · Footer. Click a layer to learn what it is.'}
      </p>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        {/* Nested boxes: Theme ⊃ Header group / Template (body) / Footer group */}
        <Box k="theme" label="Horizon" className="space-y-2 p-3">
          <Box k="group" label={lang === 'th' ? 'Header — ทุกหน้า' : 'Header — every page'} className="mt-2 px-2.5 py-2">
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <Chip text="Logo" />
              <Chip text="Menu" />
            </div>
          </Box>

          <Box k="template" label={lang === 'th' ? 'Home page — Body' : 'Home page — body'} className="p-2.5">
            <div className="mt-2 space-y-1.5">
              <Box k="section" label="Hero" className="px-2.5 py-2">
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <Chip text="Heading" />
                  <Chip text="Heading" />
                  <Chip text="Text" />
                </div>
              </Box>
              <Box k="section" label="Featured collection" className="px-2.5 py-2" />
              <Box k="section" label="Image with text" className="px-2.5 py-2" />
            </div>
          </Box>

          <Box k="group" label={lang === 'th' ? 'Footer — ทุกหน้า' : 'Footer — every page'} className="px-2.5 py-2">
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <Chip text="Group" />
              <Chip text="Email signup" />
            </div>
          </Box>
        </Box>

        {/* Explanation of the selected layer */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-1.5">
            {LEVELS.map((l) => (
              <button
                key={l.key}
                type="button"
                onClick={() => setActive(l.key)}
                aria-pressed={active === l.key}
                className={clsx(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition',
                  active === l.key ? clsx(l.chip, 'text-white') : 'border-slate-200 text-slate-600 hover:border-slate-400 dark:border-white/10 dark:text-slate-300',
                )}
              >
                <l.icon size={12} /> {l.name}
              </button>
            ))}
          </div>
          <div className={clsx('flex-1 rounded-xl border-2 p-4 transition', info.box)}>
            <div className="flex items-center gap-2 text-base font-semibold">
              <span className={clsx('flex h-7 w-7 items-center justify-center rounded-lg text-white', info.chip)}>
                <info.icon size={15} />
              </span>
              {info.name}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{info.what[lang]}</p>
            <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-200">{lang === 'th' ? 'ตัวอย่างในร้าน NovaStep: ' : 'In the NovaStep store: '}</span>
              {info.example[lang]}
            </div>
          </div>
          <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-slate-200 text-center text-[11px] font-semibold dark:border-white/10">
            <span className="bg-rose-50 py-1.5 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200">Header</span>
            <span className="bg-sky-50 py-1.5 text-sky-700 dark:bg-sky-500/10 dark:text-sky-200">Body (Template)</span>
            <span className="bg-rose-50 py-1.5 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200">Footer</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ 2. The editor screen */

const AREAS: { key: string; title: L; text: L }[] = [
  {
    key: 'top',
    title: { en: 'Top bar', th: 'แถบด้านบน' },
    text: {
      en: 'Switch which template you’re editing (Home page, Products, Pages…), preview desktop or mobile, undo/redo, and Save. Nothing goes live until you click Save.',
      th: 'เลือกว่ากำลังแก้ Template ไหน (Home page, Products, Pages…) ดูตัวอย่างแบบเดสก์ท็อป/มือถือ ย้อนกลับ/ทำซ้ำ และกด Save — จะยังไม่ขึ้นหน้าร้านจริงจนกว่าจะกด Save',
    },
  },
  {
    key: 'left',
    title: { en: 'Left panel — structure', th: 'แผงซ้าย — โครงสร้าง' },
    text: {
      en: 'The page as a tree: Header, the template’s sections and blocks, and the Footer. Click to select, drag to reorder, “Add section” / “Add block” to insert, and the eye icon to hide.',
      th: 'โครงสร้างหน้าแบบต้นไม้: Header, Section และบล็อกของ Template และ Footer คลิกเพื่อเลือก ลากเพื่อสลับลำดับ ใช้ “Add section” / “Add block” เพื่อเพิ่ม และไอคอนรูปตาเพื่อซ่อน',
    },
  },
  {
    key: 'preview',
    title: { en: 'Centre — live preview', th: 'ตรงกลาง — ตัวอย่างสด' },
    text: {
      en: 'Your real store with your changes applied. Click anything in the preview to jump to its settings.',
      th: 'หน้าร้านจริงพร้อมการเปลี่ยนแปลงที่แก้อยู่ คลิกที่ส่วนใดในตัวอย่างเพื่อไปยังการตั้งค่าของส่วนนั้นทันที',
    },
  },
  {
    key: 'right',
    title: { en: 'Right panel — settings', th: 'แผงขวา — การตั้งค่า' },
    text: {
      en: 'The settings of whatever is selected: text, colors, images, layout. The gear icon opens Theme settings for the whole store.',
      th: 'การตั้งค่าของสิ่งที่เลือกอยู่: ข้อความ สี รูป เลย์เอาต์ ไอคอนฟันเฟืองจะเปิด Theme settings ที่มีผลทั้งร้าน',
    },
  },
];

function EditorMap() {
  const { lang } = useI18n();
  const [area, setArea] = useState('left');
  const sel = AREAS.find((a) => a.key === area)!;
  const zone = (key: string) =>
    clsx(
      'cursor-pointer rounded-md border-2 border-dashed transition',
      area === key ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/15' : 'border-slate-300 bg-white hover:border-indigo-300 dark:border-white/15 dark:bg-slate-950',
    );
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
      <div className="text-sm font-semibold">{lang === 'th' ? '2 · หน้าจอ Theme editor (คลิกแต่ละส่วน)' : '2 · The theme editor screen (click an area)'}</div>
      <div className="mt-3 grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="flex aspect-[16/10] flex-col gap-1.5 rounded-xl bg-slate-100 p-2 dark:bg-white/5">
          <div role="button" tabIndex={0} onClick={() => setArea('top')} onKeyDown={(e) => e.key === 'Enter' && setArea('top')} className={clsx(zone('top'), 'flex h-8 items-center justify-between px-2 text-[10px] text-slate-500')}>
            <span>Horizon · Home page ▾</span>
            <span className="flex items-center gap-1.5">
              <MonitorSmartphone size={11} /> <Undo2 size={11} />
              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-white">Save</span>
            </span>
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-[28%_1fr_26%] gap-1.5">
            <div role="button" tabIndex={0} onClick={() => setArea('left')} onKeyDown={(e) => e.key === 'Enter' && setArea('left')} className={clsx(zone('left'), 'space-y-1 p-1.5 text-[9px] text-slate-500')}>
              <div className="font-semibold">Header</div>
              <div className="pl-1">▸ Hero</div>
              <div className="pl-3">· Heading</div>
              <div className="pl-3">· Text</div>
              <div className="pl-1">▸ Featured collection</div>
              <div className="pl-1">▸ Image with text</div>
              <div className="text-indigo-600">⊕ Add section</div>
              <div className="font-semibold">Footer</div>
            </div>
            <div role="button" tabIndex={0} onClick={() => setArea('preview')} onKeyDown={(e) => e.key === 'Enter' && setArea('preview')} className={clsx(zone('preview'), 'flex flex-col gap-1 p-1.5')}>
              <div className="flex flex-1 items-end rounded bg-gradient-to-br from-slate-500 to-slate-800 p-1.5 text-[9px] font-bold text-white">EVERY STEP FORWARD</div>
              <div className="grid h-1/3 grid-cols-3 gap-1">
                <span className="rounded bg-slate-200 dark:bg-white/10" />
                <span className="rounded bg-slate-200 dark:bg-white/10" />
                <span className="rounded bg-slate-200 dark:bg-white/10" />
              </div>
            </div>
            <div role="button" tabIndex={0} onClick={() => setArea('right')} onKeyDown={(e) => e.key === 'Enter' && setArea('right')} className={clsx(zone('right'), 'space-y-1.5 p-1.5 text-[9px] text-slate-500')}>
              <div className="font-semibold">Heading</div>
              <div className="h-2 rounded bg-slate-200 dark:bg-white/10" />
              <div className="h-2 w-2/3 rounded bg-slate-200 dark:bg-white/10" />
              <div className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-[#BEA77E]" /> #BEA77E
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-slate-50 p-4 dark:bg-white/5">
          <div className="flex items-center gap-2 font-semibold">
            <MousePointerClick size={16} className="text-indigo-500" /> {sel.title[lang]}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{sel.text[lang]}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {AREAS.map((a) => (
              <button
                key={a.key}
                type="button"
                onClick={() => setArea(a.key)}
                aria-pressed={area === a.key}
                className={clsx(
                  'rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition',
                  area === a.key ? 'border-indigo-600 bg-indigo-600 text-white dark:bg-indigo-500' : 'border-slate-200 text-slate-600 dark:border-white/10 dark:text-slate-300',
                )}
              >
                {a.title[lang]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ 3. Global vs local */

function Scope() {
  const { lang } = useI18n();
  const rows: { icon: LucideIcon; where: L; affects: L; examples: L; tone: string }[] = [
    {
      icon: Globe,
      where: { en: 'Theme settings (gear icon)', th: 'Theme settings (ไอคอนฟันเฟือง)' },
      affects: { en: 'The whole store', th: 'ทั้งร้าน' },
      examples: { en: 'Logo, typography, colors, buttons', th: 'โลโก้ ตัวอักษร สี ปุ่ม' },
      tone: 'text-indigo-600 dark:text-indigo-300',
    },
    {
      icon: Square,
      where: { en: 'Section settings', th: 'การตั้งค่า Section' },
      affects: { en: 'That one section', th: 'เฉพาะ Section นั้น' },
      examples: { en: 'Hero image, layout, Custom CSS', th: 'รูป Hero เลย์เอาต์ Custom CSS' },
      tone: 'text-emerald-600 dark:text-emerald-300',
    },
    {
      icon: Layers,
      where: { en: 'Block settings', th: 'การตั้งค่าบล็อก' },
      affects: { en: 'That one block', th: 'เฉพาะบล็อกนั้น' },
      examples: { en: 'Heading text, text color, button label', th: 'ข้อความหัวข้อ สีข้อความ ข้อความปุ่ม' },
      tone: 'text-amber-600 dark:text-amber-300',
    },
  ];
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900">
      <div className="border-b border-slate-100 px-4 py-3 text-sm font-semibold dark:border-white/10">
        {lang === 'th' ? '3 · แก้ที่ไหน มีผลแค่ไหน' : '3 · Where you edit decides what changes'}
      </div>
      <div className="divide-y divide-slate-100 dark:divide-white/5">
        {rows.map((r) => (
          <div key={r.where.en} className="grid grid-cols-[auto_1fr] items-start gap-x-3 gap-y-1 px-4 py-3 text-sm sm:grid-cols-[auto_1.2fr_0.8fr_1.4fr]">
            <r.icon size={18} className={clsx('mt-0.5', r.tone)} />
            <div className="font-semibold">{r.where[lang]}</div>
            <div className="col-start-2 text-slate-600 sm:col-start-auto dark:text-slate-300">→ {r.affects[lang]}</div>
            <div className="col-start-2 text-xs text-slate-500 sm:col-start-auto dark:text-slate-400">{r.examples[lang]}</div>
          </div>
        ))}
      </div>
      <p className="border-t border-slate-100 px-4 py-2.5 text-xs text-slate-500 dark:border-white/10 dark:text-slate-400">
        {lang === 'th'
          ? 'เคล็ดลับ: ถ้าอยากเปลี่ยนแค่จุดเดียว ให้แก้ที่ Section/บล็อก — ถ้าแก้ใน Theme settings จะเปลี่ยนทุกหน้า'
          : 'Tip: to change one spot, edit the section or block — editing Theme settings changes every page.'}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ 4. Method */

function Method() {
  const { lang } = useI18n();
  const steps: L[] = [
    { en: 'Online Store → Themes → Customize opens the editor on your theme.', th: 'Online Store → Themes → Customize เพื่อเปิด Editor ของธีม' },
    { en: 'Pick the template to edit from the top dropdown (Home page, Products, Pages…).', th: 'เลือก Template ที่จะแก้จากเมนูด้านบน (Home page, Products, Pages…)' },
    { en: 'Set the global look first in Theme settings: logo, colors, typography.', th: 'ตั้งค่าภาพรวมก่อนใน Theme settings: โลโก้ สี ตัวอักษร' },
    { en: 'Add sections in the order you want; drag them to reorder.', th: 'เพิ่ม Section ตามลำดับที่ต้องการ แล้วลากเพื่อสลับลำดับ' },
    { en: 'Open each section, add or remove blocks, and fill in the right panel.', th: 'เปิดแต่ละ Section เพิ่ม/ลบบล็อก และกรอกค่าที่แผงขวา' },
    { en: 'Check the preview on desktop and mobile.', th: 'ตรวจตัวอย่างทั้งเดสก์ท็อปและมือถือ' },
    { en: 'Click Save — only then do the changes go live.', th: 'กด Save — การเปลี่ยนแปลงจึงจะขึ้นหน้าร้านจริง' },
  ];
  const actions: { icon: LucideIcon; label: L }[] = [
    { icon: ArrowDownUp, label: { en: 'Drag ⋮⋮ to reorder', th: 'ลาก ⋮⋮ เพื่อสลับลำดับ' } },
    { icon: EyeOff, label: { en: 'Eye icon hides without deleting', th: 'ไอคอนตาซ่อนได้โดยไม่ลบ' } },
    { icon: Copy, label: { en: 'Duplicate a section or block', th: 'ทำสำเนา Section หรือบล็อก' } },
    { icon: Undo2, label: { en: 'Undo / redo (top bar)', th: 'ย้อนกลับ / ทำซ้ำ (แถบบน)' } },
    { icon: SlidersHorizontal, label: { en: 'Dynamic source (⛁) links a setting to a metafield', th: 'Dynamic source (⛁) เชื่อมค่ากับ Metafield' } },
    { icon: Save, label: { en: 'Save often; Duplicate the theme to experiment safely', th: 'กด Save บ่อย ๆ และ Duplicate ธีมไว้ทดลองอย่างปลอดภัย' } },
  ];
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
        <div className="text-sm font-semibold">{lang === 'th' ? '4 · วิธีแก้ไขธีม ทีละขั้น' : '4 · The method, step by step'}</div>
        <ol className="mt-3 space-y-2">
          {steps.map((s, i) => (
            <li key={s.en} className="flex gap-3 text-sm">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">{i + 1}</span>
              <span className="leading-6 text-slate-700 dark:text-slate-200">{s[lang]}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
        <div className="text-sm font-semibold">{lang === 'th' ? 'คำสั่งที่ใช้บ่อย' : 'Everyday actions'}</div>
        <ul className="mt-3 space-y-2.5">
          {actions.map((a) => (
            <li key={a.label.en} className="flex items-start gap-3 text-sm">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300">
                <a.icon size={14} />
              </span>
              <span className="leading-7 text-slate-700 dark:text-slate-200">{a.label[lang]}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 flex items-start gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-xs text-indigo-900 dark:bg-indigo-500/10 dark:text-indigo-100">
          <Eye size={14} className="mt-0.5 shrink-0" />
          {lang === 'th'
            ? 'ทุกขั้นตอนถัดไปในเมนูธีม (Logo, Header, Hero…) คือการทำตามวิธีนี้กับแต่ละ Section'
            : 'Every next step in this Theme menu (Logo, Header, Hero…) is this method applied to one section.'}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ 5. Behind the scenes: Liquid */

const FILE_TREE = `theme/
├─ layout/      theme.liquid        ← the page frame (<head>, Header + Footer groups)
├─ templates/   index.json          ← Home page: which sections, in what order
│               product.json · page.about-us-mod.json …
├─ sections/    hero.liquid …       ← section code (Liquid + HTML + schema)
│               header-group.json · footer-group.json   ← section groups
├─ blocks/      text.liquid · group.liquid …   ← theme blocks (Horizon)
├─ snippets/    reusable Liquid pieces (not visible in the editor)
├─ assets/      CSS · JS · images
├─ config/      settings_schema.json · settings_data.json   ← Theme settings
└─ locales/     translations (en.default.json, th.json …)`;

const WAYS: { key: string; icon: LucideIcon; title: L; level: L; how: L; pros: L[]; cons: L[]; update: L; safe: 'high' | 'mid' | 'low' }[] = [
  {
    key: 'editor',
    icon: MousePointer2,
    title: { en: 'Theme editor (no code)', th: 'Theme editor (ไม่ต้องเขียนโค้ด)' },
    level: { en: 'Anyone', th: 'ทุกคน' },
    how: { en: 'Click and fill in settings in Customize. Saves to JSON files (templates, section groups, settings_data.json).', th: 'คลิกและกรอกค่าในหน้า Customize — บันทึกลงไฟล์ JSON (Template, Section group, settings_data.json)' },
    pros: [
      { en: 'Safe and fast — live preview', th: 'ปลอดภัยและเร็ว — เห็นผลทันที' },
      { en: 'No coding skills needed', th: 'ไม่ต้องมีทักษะเขียนโค้ด' },
    ],
    cons: [{ en: 'Limited to the settings the theme provides', th: 'ทำได้เฉพาะค่าที่ธีมเตรียมไว้' }],
    update: { en: 'Kept — editor changes are copied to the updated theme', th: 'อยู่ครบ — การแก้ใน Editor ถูกคัดลอกไปยังธีมเวอร์ชันใหม่' },
    safe: 'high',
  },
  {
    key: 'lowcode',
    icon: Code2,
    title: { en: 'Low-code inside the editor', th: 'Low-code ภายใน Editor' },
    level: { en: 'Basic CSS / Liquid', th: 'CSS / Liquid พื้นฐาน' },
    how: { en: 'Add a section’s Custom CSS, or a Custom Liquid block (like the Store Location map) — still from Customize.', th: 'ใส่ Custom CSS ของ Section หรือบล็อก Custom Liquid (เช่น แผนที่ Store Location) — ยังทำใน Customize' },
    pros: [
      { en: 'Small tweaks without touching theme files', th: 'ปรับเล็ก ๆ ได้โดยไม่แตะไฟล์ธีม' },
      { en: 'Scoped to one section', th: 'มีผลเฉพาะ Section นั้น' },
    ],
    cons: [
      { en: 'CSS selectors and size are limited', th: 'Selector และขนาดของ CSS มีข้อจำกัด' },
      { en: 'Gets messy if overused', th: 'ถ้าใช้มากเกินไปจะดูแลยาก' },
    ],
    update: { en: 'Kept — stored with the editor settings', th: 'อยู่ครบ — บันทึกไปพร้อมการตั้งค่าใน Editor' },
    safe: 'high',
  },
  {
    key: 'codeeditor',
    icon: FileCode2,
    title: { en: 'Edit code in Shopify admin', th: 'แก้โค้ดในหลังบ้าน Shopify' },
    level: { en: 'Developer', th: 'นักพัฒนา' },
    how: { en: 'Online Store → Themes → ⋯ → Edit code. Change .liquid, CSS and JS files right in the browser.', th: 'Online Store → Themes → ⋯ → Edit code แก้ไฟล์ .liquid, CSS และ JS ในเบราว์เซอร์ได้ทันที' },
    pros: [
      { en: 'Full control — anything is possible', th: 'ควบคุมได้ทั้งหมด — ทำได้ทุกอย่าง' },
      { en: 'No setup needed', th: 'ไม่ต้องติดตั้งอะไร' },
    ],
    cons: [
      { en: 'Easy to break the live store', th: 'ทำหน้าร้านจริงพังได้ง่าย' },
      { en: 'No proper version history or code review', th: 'ไม่มีประวัติเวอร์ชันหรือการรีวิวโค้ดที่ดี' },
    ],
    update: { en: 'At risk — removed if they conflict with the update', th: 'มีความเสี่ยง — จะถูกลบออกหากขัดกับการอัปเดต' },
    safe: 'low',
  },
  {
    key: 'local',
    icon: Terminal,
    title: { en: 'Local development (Shopify CLI + Git)', th: 'พัฒนาบนเครื่อง (Shopify CLI + Git)' },
    level: { en: 'Developer / team', th: 'นักพัฒนา / ทีม' },
    how: {
      en: 'shopify theme pull → edit in VS Code → shopify theme dev (local preview) → shopify theme push. Or connect the theme to a GitHub branch.',
      th: 'shopify theme pull → แก้ใน VS Code → shopify theme dev (ดูตัวอย่างบนเครื่อง) → shopify theme push หรือเชื่อมธีมกับ Branch บน GitHub',
    },
    pros: [
      { en: 'Version control, code review and rollback', th: 'มี Version control รีวิวโค้ด และย้อนกลับได้' },
      { en: 'Team workflow; test on a preview theme first', th: 'ทำงานเป็นทีม ทดสอบบนธีมพรีวิวก่อน' },
    ],
    cons: [
      { en: 'Needs setup and developer skills', th: 'ต้องติดตั้งเครื่องมือและมีทักษะนักพัฒนา' },
      { en: 'Editor changes on the live theme must be pulled back, or they get overwritten', th: 'การแก้ใน Editor บนธีมจริงต้อง Pull กลับมา ไม่เช่นนั้นจะถูกเขียนทับ' },
    ],
    update: { en: 'Manual — but Git shows exactly what changed, so re-applying is easy', th: 'ทำเอง — แต่ Git แสดงสิ่งที่แก้ไว้ชัดเจน จึงนำกลับมาใส่ใหม่ได้ง่าย' },
    safe: 'mid',
  },
];

function LiquidBehindTheScenes() {
  const { lang } = useI18n();
  const safeTone = { high: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200', mid: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200', low: 'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-200' };
  const safeLabel = {
    high: { en: 'Update-safe', th: 'ปลอดภัยเมื่ออัปเดต' },
    mid: { en: 'Manageable', th: 'จัดการได้' },
    low: { en: 'Update risk', th: 'เสี่ยงเมื่ออัปเดต' },
  };
  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
      <div>
        <div className="text-sm font-semibold">{lang === 'th' ? '5 · เบื้องหลัง: ธีมคือไฟล์ Liquid' : '5 · Behind the scenes: a theme is Liquid files'}</div>
        <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {lang === 'th'
            ? 'ทุกอย่างที่คลิกใน Theme editor ถูกเก็บเป็นไฟล์ในธีม: โค้ดหน้าตาเป็นไฟล์ Liquid (.liquid = HTML + แท็ก Liquid ของ Shopify) ส่วนค่าที่ตั้งใน Editor เก็บเป็นไฟล์ JSON'
            : 'Everything you click in the theme editor is stored as files in the theme: the code is Liquid (.liquid = HTML + Shopify’s Liquid tags), and the values you set in the editor are stored as JSON.'}
        </p>
      </div>

      <pre className="overflow-x-auto rounded-xl bg-[#131922] p-4 font-mono text-[11.5px] leading-relaxed text-slate-200 dark:bg-black/40">{FILE_TREE}</pre>

      <div>
        <div className="mb-2 text-sm font-semibold">{lang === 'th' ? 'ปรับแต่งธีมได้ 4 แบบ' : '4 ways to customize a theme'}</div>
        <div className="grid gap-3 md:grid-cols-2">
          {WAYS.map((w, i) => (
            <div key={w.key} className="flex flex-col rounded-xl border border-slate-200 p-3.5 dark:border-white/10">
              <div className="flex items-start gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                  <w.icon size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">
                    {i + 1}. {w.title[lang]}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{lang === 'th' ? 'เหมาะกับ: ' : 'Who: '}{w.level[lang]}</div>
                </div>
                <span className={clsx('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold', safeTone[w.safe])}>{safeLabel[w.safe][lang]}</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{w.how[lang]}</p>
              <div className="mt-2 grid gap-2 text-xs sm:grid-cols-2">
                <ul className="space-y-1">
                  {w.pros.map((p) => (
                    <li key={p.en} className="flex gap-1.5 text-slate-700 dark:text-slate-200">
                      <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-emerald-500" />
                      {p[lang]}
                    </li>
                  ))}
                </ul>
                <ul className="space-y-1">
                  {w.cons.map((c) => (
                    <li key={c.en} className="flex gap-1.5 text-slate-700 dark:text-slate-200">
                      <XCircle size={13} className="mt-0.5 shrink-0 text-rose-500" />
                      {c[lang]}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto pt-2.5 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-200">{lang === 'th' ? 'เมื่อธีมอัปเดต: ' : 'On theme update: '}</span>
                {w.update[lang]}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl bg-emerald-50 p-3.5 text-sm dark:bg-emerald-500/10">
          <div className="flex items-center gap-2 font-semibold text-emerald-900 dark:text-emerald-100">
            <GitBranch size={15} /> {lang === 'th' ? 'ควรแก้ไฟล์ Liquid เมื่อไร' : 'When should you edit Liquid?'}
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-relaxed text-emerald-900/90 dark:text-emerald-100/90">
            {(lang === 'th'
              ? [
                  'ใช้ Editor / Custom CSS / Custom Liquid ก่อนเสมอ',
                  'แก้ Liquid เมื่อธีมทำไม่ได้จริง ๆ เช่น Section ใหม่ ลอจิกเฉพาะ หรือเชื่อมระบบอื่น',
                  'สร้างไฟล์ Section/บล็อกใหม่ แทนการแก้ไฟล์เดิมของธีม',
                  'แก้บนธีมสำเนา (Duplicate) หรือธีมพรีวิว ไม่ใช่ธีมที่ใช้งานจริง',
                ]
              : [
                  'Try the editor, Custom CSS or Custom Liquid first',
                  'Edit Liquid only when the theme truly can’t do it — a new section type, custom logic, an integration',
                  'Prefer adding new section/block files over changing the theme’s own files',
                  'Work on a duplicate or preview theme, never straight on the live theme',
                ]
            ).map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl bg-rose-50 p-3.5 text-sm dark:bg-rose-500/10">
          <div className="flex items-center gap-2 font-semibold text-rose-900 dark:text-rose-100">
            <AlertTriangle size={15} /> {lang === 'th' ? 'ข้อเสียเมื่อธีมอัปเดต' : 'The catch when the theme updates'}
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-relaxed text-rose-900/90 dark:text-rose-100/90">
            {(lang === 'th'
              ? [
                  'การอัปเดตจะสร้างสำเนาธีมเวอร์ชันใหม่ — การแก้ใน Editor ถูกคัดลอกไปครบ',
                  'โค้ด Liquid ที่แก้เองจะไปด้วยก็ต่อเมื่อไม่ขัดกับการอัปเดต — ถ้าขัด จะถูกลบออกทั้งหมด',
                  'ไฟล์ที่ธีมเปลี่ยนชื่อหรือโครงสร้างอาจทำให้โค้ดที่แก้ไว้พัง',
                  'สำรองโค้ดก่อนอัปเดตเสมอ (Git ช่วยให้เห็นสิ่งที่ต้องนำกลับมาใส่)',
                  'การอัปเดตมีเฉพาะธีมจาก Theme Store เท่านั้น ธีมที่อัปโหลดเองไม่มีการอัปเดตอัตโนมัติ',
                ]
              : [
                  'An update creates a new copy of the theme — editor changes are copied over',
                  'Your Liquid edits come along only if they don’t conflict; if they do, all of them are removed from the new copy',
                  'Files the theme renamed or restructured can break your edited code',
                  'Always save a copy of your code before updating (Git shows exactly what to re-apply)',
                  'Updates only exist for Theme Store themes — uploaded themes don’t update automatically',
                ]
            ).map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/** Concept guide: how Shopify's theme editor works, explained like a visual block builder. */
export function ThemeEditorGuide() {
  return (
    <div className="space-y-5">
      <BuildingBlocks />
      <EditorMap />
      <Scope />
      <Method />
      <LiquidBehindTheScenes />
    </div>
  );
}
