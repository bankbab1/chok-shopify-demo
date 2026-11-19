import { useState } from 'react';
import clsx from 'clsx';
import { ArrowDownToLine, Ban, Barcode, Box, CircleCheck, ClipboardList, MapPin, SlidersHorizontal, type LucideIcon } from 'lucide-react';
import { useI18n } from '../i18n';

type L = { en: string; th: string };

interface Term {
  key: string;
  /** Column label exactly as Shopify Admin shows it. */
  name: string;
  icon: LucideIcon;
  tone: string;
  thai: string;
  what: L;
  example: L;
  extra?: L[];
}

/* Definitions follow Shopify Help → Inventory states. Examples use NovaStep AeroRun Pink / 6. */
const STATES: Term[] = [
  {
    key: 'on-hand',
    name: 'On hand',
    icon: Box,
    tone: 'bg-indigo-600 text-white',
    thai: 'สต็อกที่มีอยู่จริง',
    what: {
      en: 'The total number of units physically at the location. On hand = Available + Committed + Unavailable.',
      th: 'จำนวนสินค้าทั้งหมดที่มีอยู่จริงใน Location นั้น โดย On hand = Available + Committed + Unavailable',
    },
    example: { en: 'You count 10 pairs of AeroRun Pink / 6 on the shelf → On hand = 10.', th: 'นับ AeroRun สีชมพู ไซซ์ 6 บนชั้นได้ 10 คู่ → On hand = 10' },
    extra: [
      {
        en: 'This is the number you set in the stock planner (“Set to”).',
        th: 'คือตัวเลขที่ตั้งค่าในหน้าวางแผนสต็อก (“Set to”)',
      },
    ],
  },
  {
    key: 'available',
    name: 'Available',
    icon: CircleCheck,
    tone: 'bg-emerald-600 text-white',
    thai: 'พร้อมขาย',
    what: {
      en: 'Units you can sell right now: not committed to an order, not set aside as unavailable, and not incoming.',
      th: 'จำนวนที่ขายได้ทันที — ไม่ได้ถูกจองให้คำสั่งซื้อ ไม่ได้ถูกกันไว้เป็น Unavailable และไม่ใช่สินค้าที่กำลังจะเข้า',
    },
    example: { en: '10 on hand − 2 committed − 1 unavailable → Available = 7.', th: 'On hand 10 − จองแล้ว 2 − ใช้ไม่ได้ 1 → Available = 7' },
    extra: [{ en: 'When Available reaches 0, the variant shows as sold out (unless you allow overselling).', th: 'เมื่อ Available เป็น 0 สินค้าตัวเลือกนั้นจะแสดงว่าหมด (เว้นแต่อนุญาตให้ขายเกินสต็อก)' }],
  },
  {
    key: 'committed',
    name: 'Committed',
    icon: ClipboardList,
    tone: 'bg-amber-500 text-white',
    thai: 'จองแล้ว',
    what: {
      en: 'Units set aside for orders that are placed but not yet fulfilled (also draft-order reservations and transfers ready to ship). They can’t be sold again.',
      th: 'จำนวนที่ถูกจองไว้ให้คำสั่งซื้อที่สั่งแล้วแต่ยังไม่จัดส่ง (รวมถึงการจองจาก Draft order และการโอนที่พร้อมส่ง) จึงขายซ้ำไม่ได้',
    },
    example: {
      en: 'A customer orders 2 pairs → Committed = 2. After you “Mark as fulfilled”, they leave Committed and On hand drops to 8.',
      th: 'ลูกค้าสั่ง 2 คู่ → Committed = 2 เมื่อกด “Mark as fulfilled” จำนวนนี้จะออกจาก Committed และ On hand ลดเหลือ 8',
    },
  },
  {
    key: 'unavailable',
    name: 'Unavailable',
    icon: Ban,
    tone: 'bg-rose-500 text-white',
    thai: 'ใช้ขายไม่ได้',
    what: {
      en: 'Units physically there but held back from sale — set aside by apps or for a reason you choose.',
      th: 'สินค้าที่มีอยู่จริงแต่ถูกกันไว้ไม่ให้ขาย — กันไว้โดยแอป หรือด้วยเหตุผลที่คุณเลือก',
    },
    example: { en: '1 pair has a scuffed box → mark it Damaged → Unavailable = 1.', th: 'มี 1 คู่กล่องเสียหาย → ตั้งเป็น Damaged → Unavailable = 1' },
    extra: [
      {
        en: 'Reasons in the dropdown: Damaged · Quality control · Safety stock (kept as a buffer) · Other.',
        th: 'เหตุผลในเมนู: Damaged (ชำรุด) · Quality control (รอตรวจคุณภาพ) · Safety stock (สต็อกสำรอง) · Other (อื่น ๆ)',
      },
    ],
  },
  {
    key: 'incoming',
    name: 'Incoming',
    icon: ArrowDownToLine,
    tone: 'bg-sky-500 text-white',
    thai: 'กำลังเข้า',
    what: {
      en: 'Units on the way from a transfer or purchase order. Not counted in On hand and can’t be sold until received — then they become Available.',
      th: 'สินค้าที่กำลังมาจากการโอนหรือใบสั่งซื้อ ยังไม่นับใน On hand และขายไม่ได้จนกว่าจะรับเข้า — เมื่อรับแล้วจะกลายเป็น Available',
    },
    example: { en: 'A supplier ships 5 more pairs → Incoming = 5 until you receive them.', th: 'ซัพพลายเออร์ส่งมาอีก 5 คู่ → Incoming = 5 จนกว่าจะกดรับสินค้า' },
  },
];

const OTHERS: Term[] = [
  {
    key: 'location',
    name: 'Location',
    icon: MapPin,
    tone: 'bg-slate-700 text-white',
    thai: 'สถานที่เก็บสินค้า',
    what: {
      en: 'A place where you store stock or fulfil orders — a shop, warehouse or pop-up. Every quantity above is per location.',
      th: 'สถานที่เก็บสินค้าหรือจัดส่งคำสั่งซื้อ เช่น หน้าร้าน คลังสินค้า หรือบูธ ตัวเลขทุกช่องด้านบนแยกตาม Location',
    },
    example: { en: '“Shop location” is the default location a new store gets.', th: '“Shop location” คือ Location เริ่มต้นของร้านใหม่' },
  },
  {
    key: 'sku',
    name: 'SKU',
    icon: Barcode,
    tone: 'bg-slate-700 text-white',
    thai: 'รหัสสินค้า',
    what: {
      en: 'Stock Keeping Unit — your own code for each variant, used for counting and reports. Optional; “No SKU” means none was set.',
      th: 'Stock Keeping Unit — รหัสที่ตั้งเองสำหรับแต่ละตัวเลือกสินค้า ใช้ในการนับสต็อกและรายงาน ไม่บังคับ — “No SKU” หมายถึงยังไม่ได้ตั้ง',
    },
    example: { en: 'e.g. NS-AERO-PNK-06 for AeroRun Pink / 6.', th: 'เช่น NS-AERO-PNK-06 สำหรับ AeroRun สีชมพู ไซซ์ 6' },
  },
  {
    key: 'set-adjust',
    name: 'Set to / Adjust by',
    icon: SlidersHorizontal,
    tone: 'bg-slate-700 text-white',
    thai: 'ตั้งค่า / ปรับเพิ่มลด',
    what: {
      en: '“Set to” replaces the quantity with your number. “Adjust by” adds or subtracts from the current quantity.',
      th: '“Set to” แทนที่จำนวนด้วยตัวเลขที่ใส่ ส่วน “Adjust by” บวกหรือลบจากจำนวนเดิม',
    },
    example: { en: 'On hand 10: “Set to 12” → 12 · “Adjust by +2” → 12 · “Adjust by −3” → 7.', th: 'On hand 10: “Set to 12” → 12 · “Adjust by +2” → 12 · “Adjust by −3” → 7' },
  },
];

function TermCard({ term }: { term: Term }) {
  const { lang } = useI18n();
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <span className={clsx('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', term.tone)}>
          <term.icon size={17} />
        </span>
        <div className="min-w-0">
          <div className="font-semibold">{term.name}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{term.thai}</div>
        </div>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{term.what[lang]}</p>
      {term.extra?.map((x) => (
        <p key={x.en} className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {x[lang]}
        </p>
      ))}
      <div className="mt-auto pt-3">
        <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-600 dark:bg-white/5 dark:text-slate-300">
          <span className="font-semibold">{lang === 'th' ? 'ตัวอย่าง: ' : 'Example: '}</span>
          {term.example[lang]}
        </div>
      </div>
    </div>
  );
}

function Num({ label, value, onChange, tone }: { label: string; value: number; onChange: (v: number) => void; tone: string }) {
  return (
    <label className="flex flex-col items-center gap-1">
      <span className={clsx('rounded-md px-2 py-0.5 text-[11px] font-semibold', tone)}>{label}</span>
      <input
        type="number"
        min={0}
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(Math.max(0, Math.min(9999, Math.round(Number(e.target.value)) || 0)))}
        className="h-11 w-20 rounded-lg border border-slate-200 bg-white text-center text-lg font-semibold tabular-nums outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15 dark:border-white/10 dark:bg-slate-950"
      />
    </label>
  );
}

/** Interactive equation: change On hand / Committed / Unavailable and see Available update. */
function Calculator() {
  const { lang } = useI18n();
  const [onHand, setOnHand] = useState(10);
  const [committed, setCommitted] = useState(2);
  const [unavailable, setUnavailable] = useState(1);
  const [incoming, setIncoming] = useState(5);
  const available = onHand - committed - unavailable;
  const bad = available < 0;
  const pct = (n: number) => (onHand > 0 ? `${Math.max(0, (n / onHand) * 100)}%` : '0%');

  return (
    <div className="rounded-xl border border-indigo-200 bg-white p-4 dark:border-indigo-400/30 dark:bg-slate-900">
      <div className="text-sm font-semibold">{lang === 'th' ? 'ลองคำนวณ: ตัวเลขแต่ละช่องสัมพันธ์กันอย่างไร' : 'Try it: how the columns relate'}</div>
      <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
        {lang === 'th' ? 'เปลี่ยนตัวเลขแล้วดูว่า Available เปลี่ยนอย่างไร' : 'Change the numbers and watch Available update.'}
      </div>

      <div className="mt-4 flex flex-wrap items-end justify-center gap-3 text-lg font-semibold text-slate-400">
        <Num label="On hand" value={onHand} onChange={setOnHand} tone="bg-indigo-600 text-white" />
        <span className="pb-2">−</span>
        <Num label="Committed" value={committed} onChange={setCommitted} tone="bg-amber-500 text-white" />
        <span className="pb-2">−</span>
        <Num label="Unavailable" value={unavailable} onChange={setUnavailable} tone="bg-rose-500 text-white" />
        <span className="pb-2">=</span>
        <div className="flex flex-col items-center gap-1">
          <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold text-white">Available</span>
          <span
            className={clsx(
              'flex h-11 min-w-20 items-center justify-center rounded-lg px-3 text-lg tabular-nums',
              bad ? 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200',
            )}
          >
            {available}
          </span>
        </div>
      </div>

      <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10" aria-hidden="true">
        <div className="bg-emerald-500" style={{ width: pct(Math.max(0, available)) }} />
        <div className="bg-amber-500" style={{ width: pct(committed) }} />
        <div className="bg-rose-500" style={{ width: pct(unavailable) }} />
      </div>
      {bad && (
        <p className="mt-2 text-xs text-rose-700 dark:text-rose-300">
          {lang === 'th' ? 'Committed + Unavailable มากกว่า On hand — ตัวเลขนี้เกิดขึ้นได้ถ้าขายเกินสต็อก' : 'Committed + Unavailable is more than On hand — this happens when you oversell.'}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-lg bg-sky-50 px-3 py-2.5 text-sm dark:bg-sky-500/10">
        <Num label="Incoming" value={incoming} onChange={setIncoming} tone="bg-sky-500 text-white" />
        <p className="min-w-0 flex-1 basis-56 text-xs leading-relaxed text-sky-900 dark:text-sky-100">
          {lang === 'th'
            ? `Incoming ไม่นับรวมใน On hand เมื่อกดรับสินค้า ${incoming} ชิ้นนี้ On hand จะเป็น ${onHand + incoming} และ Available จะเป็น ${available + incoming}`
            : `Incoming isn’t part of On hand. When you receive these ${incoming}, On hand becomes ${onHand + incoming} and Available becomes ${available + incoming}.`}
        </p>
      </div>
    </div>
  );
}

export function InventoryTerms() {
  const { lang } = useI18n();
  return (
    <div className="space-y-5">
      <Calculator />
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          {lang === 'th' ? 'สถานะสต็อก (คอลัมน์ในหน้า Inventory)' : 'Inventory states (columns on the Inventory page)'}
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {STATES.map((x) => (
            <TermCard key={x.key} term={x} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{lang === 'th' ? 'คำอื่น ๆ ในหน้า Inventory' : 'Other terms on the Inventory page'}</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {OTHERS.map((x) => (
            <TermCard key={x.key} term={x} />
          ))}
        </div>
      </div>
    </div>
  );
}
