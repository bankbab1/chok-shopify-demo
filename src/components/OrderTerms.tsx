import { useState } from 'react';
import clsx from 'clsx';
import {
  Archive,
  BadgeCheck,
  Ban,
  CircleDollarSign,
  ClipboardCheck,
  CreditCard,
  Hourglass,
  PackageCheck,
  PackageOpen,
  PauseCircle,
  Printer,
  RotateCcw,
  ShoppingBag,
  Truck,
  Undo2,
} from 'lucide-react';
import { useI18n } from '../i18n';
import { TermCard, type L, type Term } from './InventoryTerms';

/* ------------------------------------------------------------------ Order lifecycle */

type Tone = 'yellow' | 'green' | 'grey' | 'blue';

const BADGE: Record<Tone, string> = {
  yellow: 'bg-amber-100 text-amber-800 ring-amber-300 dark:bg-amber-500/15 dark:text-amber-200 dark:ring-amber-400/30',
  green: 'bg-emerald-100 text-emerald-800 ring-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-200 dark:ring-emerald-400/30',
  grey: 'bg-slate-100 text-slate-700 ring-slate-300 dark:bg-white/10 dark:text-slate-200 dark:ring-white/15',
  blue: 'bg-sky-100 text-sky-800 ring-sky-300 dark:bg-sky-500/15 dark:text-sky-200 dark:ring-sky-400/30',
};

interface Stage {
  key: string;
  name: L;
  icon: typeof ShoppingBag;
  payment: [string, Tone];
  fulfillment: [string, Tone];
  delivery: [string, Tone] | null;
  order: [string, Tone];
  inventory: L;
  happens: L;
  next: L;
}

/* The NovaStep test order: 1 × AeroRun Pink / 6, paid with the test gateway (automatic capture). */
const STAGES: Stage[] = [
  {
    key: 'placed',
    name: { en: 'Order placed', th: 'ลูกค้าสั่งซื้อ' },
    icon: ShoppingBag,
    payment: ['Paid', 'grey'],
    fulfillment: ['Unfulfilled', 'yellow'],
    delivery: null,
    order: ['Open', 'grey'],
    inventory: { en: 'Committed +1 · Available −1 (On hand stays the same)', th: 'Committed +1 · Available −1 (On hand ยังเท่าเดิม)' },
    happens: {
      en: 'The customer pays at checkout (card “1” on the test gateway) and gets the order confirmation email. The order appears in Orders with a yellow Unfulfilled badge.',
      th: 'ลูกค้าชำระเงินตอน Checkout (บัตร “1” บน Test gateway) และได้รับอีเมลยืนยันคำสั่งซื้อ คำสั่งซื้อขึ้นในหน้า Orders พร้อมป้ายสีเหลือง Unfulfilled',
    },
    next: { en: 'Pick and pack the item, print the packing slip, then click “Mark as fulfilled”.', th: 'หยิบและแพ็กสินค้า พิมพ์ Packing slip แล้วคลิก “Mark as fulfilled”' },
  },
  {
    key: 'fulfilled',
    name: { en: 'Fulfilled', th: 'จัดส่งแล้ว' },
    icon: PackageCheck,
    payment: ['Paid', 'grey'],
    fulfillment: ['Fulfilled', 'grey'],
    delivery: ['In transit', 'blue'],
    order: ['Open', 'grey'],
    inventory: { en: 'Committed −1 · On hand −1 (the pair has left the shelf)', th: 'Committed −1 · On hand −1 (รองเท้าออกจากชั้นแล้ว)' },
    happens: {
      en: 'You add the tracking number and carrier and click Save. The customer gets a shipping confirmation email with the tracking link.',
      th: 'กรอกเลขพัสดุ (Tracking) และขนส่ง แล้วกด Save ลูกค้าได้รับอีเมลแจ้งจัดส่งพร้อมลิงก์ติดตามพัสดุ',
    },
    next: { en: 'Wait for the parcel to arrive — or click “Mark as delivered” for local delivery or when the carrier can’t update it.', th: 'รอพัสดุถึงลูกค้า — หรือคลิก “Mark as delivered” สำหรับส่งเอง หรือเมื่อขนส่งไม่อัปเดตสถานะให้' },
  },
  {
    key: 'delivered',
    name: { en: 'Delivered', th: 'ส่งถึงแล้ว' },
    icon: BadgeCheck,
    payment: ['Paid', 'grey'],
    fulfillment: ['Fulfilled', 'grey'],
    delivery: ['Delivered', 'green'],
    order: ['Open', 'grey'],
    inventory: { en: 'No change', th: 'ไม่เปลี่ยน' },
    happens: {
      en: 'The carrier’s tracking (or your “Mark as delivered”) sets the delivery status. The customer can see it on their order status page.',
      th: 'สถานะจากระบบติดตามของขนส่ง (หรือการกด “Mark as delivered”) จะตั้งสถานะการจัดส่ง ลูกค้าเห็นได้ในหน้าสถานะคำสั่งซื้อ',
    },
    next: { en: 'Nothing left to do — archive the order to move it out of the open list.', th: 'ไม่มีอะไรต้องทำแล้ว — Archive คำสั่งซื้อเพื่อย้ายออกจากรายการที่เปิดอยู่' },
  },
  {
    key: 'archived',
    name: { en: 'Archived', th: 'เก็บถาวร' },
    icon: Archive,
    payment: ['Paid', 'grey'],
    fulfillment: ['Fulfilled', 'grey'],
    delivery: ['Delivered', 'green'],
    order: ['Archived', 'grey'],
    inventory: { en: 'No change', th: 'ไม่เปลี่ยน' },
    happens: {
      en: 'The order is closed and hidden from the default Orders view, but it stays in reports and you can still find, unarchive, refund or return it.',
      th: 'คำสั่งซื้อถูกปิดและซ่อนจากมุมมองเริ่มต้นของหน้า Orders แต่ยังอยู่ในรายงาน และยังค้นหา Unarchive คืนเงิน หรือรับคืนสินค้าได้',
    },
    next: {
      en: 'Done. Shopify can archive orders automatically once they are paid and fulfilled — see Settings → Checkout → Order processing.',
      th: 'เสร็จสิ้น Shopify สามารถ Archive ให้อัตโนมัติเมื่อชำระและจัดส่งครบ — ดูที่ Settings → Checkout → Order processing',
    },
  },
];

function Badge({ value }: { value: [string, Tone] }) {
  return <span className={clsx('inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset', BADGE[value[1]])}>{value[0]}</span>;
}

/** Click through the life of the test order and see what each status column shows. */
function Lifecycle() {
  const { lang } = useI18n();
  const [i, setI] = useState(0);
  const s = STAGES[i];
  const rows: [string, [string, Tone] | null][] = [
    [lang === 'th' ? 'สถานะการชำระเงิน (Payment)' : 'Payment status', s.payment],
    [lang === 'th' ? 'สถานะการจัดส่ง (Fulfillment)' : 'Fulfillment status', s.fulfillment],
    [lang === 'th' ? 'สถานะพัสดุ (Delivery)' : 'Delivery status', s.delivery],
    [lang === 'th' ? 'คำสั่งซื้อ (Order)' : 'Order', s.order],
  ];

  return (
    <div className="rounded-xl border border-indigo-200 bg-white p-4 dark:border-indigo-400/30 dark:bg-slate-900">
      <div className="text-sm font-semibold">{lang === 'th' ? 'ลองไล่ดู: ชีวิตของคำสั่งซื้อทดสอบ 1 รายการ' : 'Try it: the life of one test order'}</div>
      <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
        {lang === 'th' ? 'NovaStep AeroRun สีชมพู ไซซ์ 6 × 1 — คลิกแต่ละขั้นเพื่อดูว่าสถานะในหน้า Orders เปลี่ยนอย่างไร' : 'NovaStep AeroRun Pink / 6 × 1 — click each stage to see how the badges on the Orders page change.'}
      </div>

      {/* Stage stepper */}
      <ol className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {STAGES.map((x, n) => (
          <li key={x.key}>
            <button
              type="button"
              onClick={() => setI(n)}
              aria-pressed={i === n}
              className={clsx(
                'flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs font-semibold transition',
                i === n
                  ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm'
                  : n < i
                    ? 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-400/30 dark:bg-indigo-500/10 dark:text-indigo-200'
                    : 'border-slate-200 text-slate-600 hover:border-slate-400 dark:border-white/10 dark:text-slate-300',
              )}
            >
              <span className={clsx('flex h-6 w-6 shrink-0 items-center justify-center rounded-full', i === n ? 'bg-white/20' : 'bg-white dark:bg-white/10')}>
                <x.icon size={13} />
              </span>
              <span className="min-w-0">
                <span className="block text-[10px] font-medium opacity-70">{n + 1}</span>
                {x.name[lang]}
              </span>
            </button>
          </li>
        ))}
      </ol>

      <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        {/* What the Orders list shows */}
        <div className="rounded-lg border border-slate-200 dark:border-white/10">
          <div className="border-b border-slate-100 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:border-white/5">
            {lang === 'th' ? 'ที่หน้า Orders จะเห็น' : 'What Orders shows'}
          </div>
          <dl className="divide-y divide-slate-100 dark:divide-white/5">
            {rows.map(([label, v]) => (
              <div key={label} className="flex items-center justify-between gap-3 px-3 py-2 text-xs">
                <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
                <dd>{v ? <Badge value={v} /> : <span className="text-slate-400">—</span>}</dd>
              </div>
            ))}
            <div className="flex items-start justify-between gap-3 px-3 py-2 text-xs">
              <dt className="shrink-0 text-slate-500 dark:text-slate-400">{lang === 'th' ? 'สต็อก' : 'Inventory'}</dt>
              <dd className="text-right font-medium text-slate-700 dark:text-slate-200">{s.inventory[lang]}</dd>
            </div>
          </dl>
        </div>

        {/* What happens and what to do next */}
        <div className="space-y-2">
          <div className="rounded-lg bg-slate-50 px-3 py-2.5 text-sm leading-relaxed text-slate-700 dark:bg-white/5 dark:text-slate-200">
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{lang === 'th' ? 'เกิดอะไรขึ้น' : 'What happens'}</div>
            {s.happens[lang]}
          </div>
          <div className="rounded-lg bg-indigo-50 px-3 py-2.5 text-sm leading-relaxed text-indigo-900 dark:bg-indigo-500/10 dark:text-indigo-100">
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-indigo-500 dark:text-indigo-300">{lang === 'th' ? 'ขั้นต่อไปที่คุณทำ' : 'Your next move'}</div>
            {s.next[lang]}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Term cards (Shopify Help → Order status) */

const PAYMENT: Term[] = [
  {
    key: 'pending',
    name: 'Payment pending',
    icon: Hourglass,
    tone: 'bg-amber-500 text-white',
    thai: 'รอชำระเงิน',
    what: {
      en: 'The order is placed but no money has been received yet — typical for bank deposit, cash on delivery or other manual payment methods.',
      th: 'มีคำสั่งซื้อแล้วแต่ยังไม่ได้รับเงิน — พบบ่อยกับการโอนเงิน เก็บเงินปลายทาง หรือวิธีชำระเงินแบบ Manual',
    },
    example: { en: 'A customer chooses bank deposit → Payment pending until you click “Mark as paid”.', th: 'ลูกค้าเลือกโอนเงิน → Payment pending จนกว่าจะกด “Mark as paid”' },
  },
  {
    key: 'authorized',
    name: 'Authorized',
    icon: CreditCard,
    tone: 'bg-amber-500 text-white',
    thai: 'อนุมัติวงเงินแล้ว',
    what: {
      en: 'The card was approved and the amount is held, but not charged yet. You capture it later. Authorizations expire (often after 7 days).',
      th: 'บัตรผ่านการอนุมัติและกันวงเงินไว้ แต่ยังไม่ได้ตัดเงิน ต้องกด Capture ภายหลัง และการอนุมัติมีวันหมดอายุ (มักประมาณ 7 วัน)',
    },
    example: { en: 'With manual capture on, the test order shows Authorized until you click “Capture payment”.', th: 'ถ้าตั้งเป็น Manual capture คำสั่งซื้อทดสอบจะแสดง Authorized จนกว่าจะกด “Capture payment”' },
  },
  {
    key: 'paid',
    name: 'Paid',
    icon: CircleDollarSign,
    tone: 'bg-emerald-600 text-white',
    thai: 'ชำระเงินแล้ว',
    what: { en: 'The full amount has been captured. With automatic capture (the default) a card order is Paid right after checkout.', th: 'ตัดเงินเต็มจำนวนแล้ว ถ้าใช้ Automatic capture (ค่าเริ่มต้น) คำสั่งซื้อที่จ่ายด้วยบัตรจะเป็น Paid ทันทีหลัง Checkout' },
    example: { en: 'The NovaStep test order paid with card “1” → Paid.', th: 'คำสั่งซื้อทดสอบ NovaStep ที่จ่ายด้วยบัตร “1” → Paid' },
    extra: [{ en: 'Partially paid = only part of the total was received (e.g. a deposit).', th: 'Partially paid = ได้รับเงินเพียงบางส่วน (เช่น มัดจำ)' }],
  },
  {
    key: 'refunded',
    name: 'Refunded',
    icon: Undo2,
    tone: 'bg-slate-700 text-white',
    thai: 'คืนเงินแล้ว',
    what: { en: 'Money was returned to the customer. Partially refunded = only some items or part of the amount.', th: 'คืนเงินให้ลูกค้าแล้ว Partially refunded = คืนเพียงบางรายการหรือบางส่วน' },
    example: { en: 'The customer returns the shoes → “Refund” → Refunded.', th: 'ลูกค้าคืนรองเท้า → กด “Refund” → Refunded' },
    extra: [{ en: 'Voided = an authorization was cancelled before it was captured, so no money moved.', th: 'Voided = ยกเลิกการอนุมัติวงเงินก่อน Capture จึงไม่มีการตัดเงิน' }],
  },
];

const FULFILLMENT: Term[] = [
  {
    key: 'unfulfilled',
    name: 'Unfulfilled',
    icon: PackageOpen,
    tone: 'bg-amber-500 text-white',
    thai: 'ยังไม่จัดส่ง',
    what: { en: 'Nothing has been shipped yet. The items are Committed in inventory. This is your to-do list.', th: 'ยังไม่ได้ส่งสินค้า สินค้าถูกจอง (Committed) ในสต็อก — นี่คือรายการงานที่ต้องทำ' },
    example: { en: 'A new order arrives → yellow Unfulfilled badge.', th: 'มีคำสั่งซื้อใหม่ → ป้ายสีเหลือง Unfulfilled' },
    extra: [{ en: 'Partially fulfilled = some items shipped, others still to send.', th: 'Partially fulfilled = ส่งไปบางรายการ ยังเหลือบางรายการ' }],
  },
  {
    key: 'fulfilled',
    name: 'Fulfilled',
    icon: PackageCheck,
    tone: 'bg-emerald-600 text-white',
    thai: 'จัดส่งแล้ว',
    what: { en: 'Every item has been shipped or handed over. On hand goes down and Committed is released.', th: 'ส่งหรือส่งมอบสินค้าครบทุกรายการแล้ว On hand ลดลงและ Committed ถูกปลดออก' },
    example: { en: 'Click “Mark as fulfilled” and save the tracking number → Fulfilled.', th: 'คลิก “Mark as fulfilled” และบันทึกเลขพัสดุ → Fulfilled' },
  },
  {
    key: 'on-hold',
    name: 'On hold',
    icon: PauseCircle,
    tone: 'bg-slate-700 text-white',
    thai: 'พักไว้ก่อน',
    what: { en: 'Fulfillment is paused — for example while you check an order for fraud or wait for the customer to confirm an address.', th: 'พักการจัดส่งไว้ — เช่น ระหว่างตรวจสอบคำสั่งซื้อที่น่าสงสัย หรือรอลูกค้ายืนยันที่อยู่' },
    example: { en: '“Hold fulfillment” → On hold · “Release fulfillment” → back to Unfulfilled.', th: '“Hold fulfillment” → On hold · “Release fulfillment” → กลับเป็น Unfulfilled' },
  },
  {
    key: 'delivery',
    name: 'In transit / Delivered',
    icon: Truck,
    tone: 'bg-sky-500 text-white',
    thai: 'กำลังส่ง / ส่งถึงแล้ว',
    what: {
      en: 'Delivery status after fulfillment. It updates from the carrier’s tracking, or you set it with “Mark as delivered”.',
      th: 'สถานะพัสดุหลังจัดส่ง อัปเดตจากระบบติดตามของขนส่ง หรือกด “Mark as delivered” เอง',
    },
    example: { en: 'Tracking saved → In transit → customer receives it → Delivered.', th: 'บันทึก Tracking → In transit → ลูกค้าได้รับ → Delivered' },
  },
];

const OTHERS: Term[] = [
  {
    key: 'mark-fulfilled',
    name: 'Mark as fulfilled',
    icon: ClipboardCheck,
    tone: 'bg-indigo-600 text-white',
    thai: 'ยืนยันการจัดส่ง',
    what: { en: 'Tells Shopify the items have shipped. You can add a tracking number and carrier and choose whether to email the customer.', th: 'แจ้ง Shopify ว่าส่งสินค้าแล้ว ใส่เลขพัสดุและขนส่งได้ และเลือกได้ว่าจะส่งอีเมลแจ้งลูกค้าหรือไม่' },
    example: { en: 'Tracking “TH1234567890” · Carrier “Thailand Post”.', th: 'Tracking “TH1234567890” · ขนส่ง “Thailand Post”' },
  },
  {
    key: 'packing-slip',
    name: 'Packing slip / Order page',
    icon: Printer,
    tone: 'bg-indigo-600 text-white',
    thai: 'ใบแพ็กสินค้า / หน้าคำสั่งซื้อ',
    what: {
      en: 'Print → Packing slip goes in the box (items and quantities, no prices). Print → Order page is your own copy with prices and payment.',
      th: 'Print → Packing slip ใส่ไปในกล่อง (รายการและจำนวน ไม่มีราคา) ส่วน Print → Order page เป็นสำเนาของร้าน มีราคาและการชำระเงิน',
    },
    example: { en: 'Print the packing slip before you pack the AeroRun box.', th: 'พิมพ์ Packing slip ก่อนแพ็กกล่อง AeroRun' },
  },
  {
    key: 'return',
    name: 'Return / Refund',
    icon: RotateCcw,
    tone: 'bg-indigo-600 text-white',
    thai: 'รับคืน / คืนเงิน',
    what: { en: 'A return brings items back (and can restock them). A refund gives money back. You can refund with or without a return.', th: 'Return คือรับสินค้าคืน (และนำกลับเข้าสต็อกได้) ส่วน Refund คือคืนเงิน คืนเงินได้ทั้งแบบมีหรือไม่มีการรับคืนสินค้า' },
    example: { en: 'Wrong size → create a return → receive → restock → refund.', th: 'ไซซ์ไม่พอดี → สร้าง Return → รับสินค้า → Restock → คืนเงิน' },
  },
  {
    key: 'archive-cancel',
    name: 'Archive / Cancel',
    icon: Ban,
    tone: 'bg-indigo-600 text-white',
    thai: 'เก็บถาวร / ยกเลิก',
    what: {
      en: 'Archive closes a finished order and hides it from the open list. Cancel stops an order you won’t fulfil — you choose to refund and restock.',
      th: 'Archive ปิดคำสั่งซื้อที่เสร็จแล้วและซ่อนจากรายการที่เปิดอยู่ ส่วน Cancel ยกเลิกคำสั่งซื้อที่จะไม่จัดส่ง — เลือกได้ว่าจะคืนเงินและคืนสต็อก',
    },
    example: { en: 'Customer changes their mind before shipping → Cancel order → Refund + Restock.', th: 'ลูกค้าเปลี่ยนใจก่อนจัดส่ง → Cancel order → คืนเงิน + คืนสต็อก' },
  },
];

function Grid({ title, terms }: { title: string; terms: Term[] }) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</h3>
      <div className="grid gap-3 sm:grid-cols-2">
        {terms.map((x) => (
          <TermCard key={x.key} term={x} />
        ))}
      </div>
    </div>
  );
}

export function OrderTerms() {
  const { lang } = useI18n();
  return (
    <div className="space-y-5">
      <Lifecycle />
      <Grid title={lang === 'th' ? 'สถานะการชำระเงิน (Payment status)' : 'Payment status'} terms={PAYMENT} />
      <Grid title={lang === 'th' ? 'สถานะการจัดส่ง (Fulfillment & delivery)' : 'Fulfillment & delivery status'} terms={FULFILLMENT} />
      <Grid title={lang === 'th' ? 'คำสั่งที่ใช้บ่อยในหน้าคำสั่งซื้อ' : 'Common actions on an order'} terms={OTHERS} />
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {lang === 'th' ? 'ชื่อสถานะเป็นภาษาอังกฤษตามที่แสดงใน Shopify Admin' : 'Status names are shown exactly as they appear in Shopify Admin.'}
      </p>
    </div>
  );
}
