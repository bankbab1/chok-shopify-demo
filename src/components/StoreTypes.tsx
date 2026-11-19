import clsx from 'clsx';
import { Briefcase, FlaskConical, Handshake, Store } from 'lucide-react';
import { useI18n } from '../i18n';

type L = { en: string; th: string };

interface StoreType {
  key: string;
  name: string;
  thai: string;
  icon: typeof Store;
  tone: string;
  workshop?: boolean;
  summary: L;
  bestFor: L;
}

/*
 * Facts from shopify.dev → "About stores", "Dev stores" and "Client transfer stores", and
 * Shopify Pricing for regular stores. Keep wording careful: Shopify changes plans and limits.
 */
const TYPES: StoreType[] = [
  {
    key: 'store',
    name: 'Store',
    thai: 'ร้านค้าจริง',
    icon: Store,
    tone: 'bg-emerald-600 text-white',
    summary: {
      en: 'A merchant’s own store, started from shopify.com and kept on a paid plan. It takes real orders and real payments.',
      th: 'ร้านค้าของผู้ค้าเอง สมัครจาก shopify.com และใช้แพ็กเกจแบบชำระเงิน รับคำสั่งซื้อและรับชำระเงินได้จริง',
    },
    bestFor: { en: 'Selling for real (Go live).', th: 'เปิดขายจริง (Go live)' },
  },
  {
    key: 'dev',
    name: 'Dev store',
    thai: 'ร้านค้าสำหรับพัฒนา/ทดสอบ',
    icon: FlaskConical,
    tone: 'bg-indigo-600 text-white',
    workshop: true,
    summary: {
      en: 'A testing store your organization owns, created in the Dev Dashboard on any plan (Basic, Grow, Advanced, Plus). Behaves like a real store, but can’t process real transactions.',
      th: 'ร้านสำหรับทดสอบที่องค์กรของคุณเป็นเจ้าของ สร้างจาก Dev Dashboard โดยเลือกแพ็กเกจใดก็ได้ (Basic, Grow, Advanced, Plus) ทำงานเหมือนร้านจริง แต่รับชำระเงินจริงไม่ได้',
    },
    bestFor: { en: 'Learning, demos, building and testing themes and apps.', th: 'การเรียนรู้ การสาธิต การพัฒนาและทดสอบธีมและแอป' },
  },
  {
    key: 'transfer',
    name: 'Client transfer store',
    thai: 'ร้านที่สร้างให้ลูกค้าแล้วโอนต่อ',
    icon: Briefcase,
    tone: 'bg-amber-500 text-white',
    summary: {
      en: 'A store you build for a client. You own it during the build, then transfer ownership — the client picks a paid plan when they accept and goes live.',
      th: 'ร้านที่คุณสร้างให้ลูกค้า ระหว่างพัฒนาคุณเป็นเจ้าของ เมื่อพร้อมจึงโอนความเป็นเจ้าของ — ลูกค้าเลือกแพ็กเกจตอนรับโอน แล้วเปิดขายจริง',
    },
    bestFor: { en: 'Agencies and freelancers building a store for a merchant.', th: 'เอเจนซีหรือฟรีแลนซ์ที่สร้างร้านให้ลูกค้า' },
  },
];

const ROWS: { label: L; values: [L, L, L] }[] = [
  {
    label: { en: 'Who owns it', th: 'ใครเป็นเจ้าของ' },
    values: [
      { en: 'The merchant', th: 'ผู้ค้า (เจ้าของร้าน)' },
      { en: 'You (your organization)', th: 'คุณ (องค์กรของคุณ)' },
      { en: 'You during the build → the client after transfer', th: 'คุณระหว่างพัฒนา → ลูกค้าหลังโอน' },
    ],
  },
  {
    label: { en: 'Where it’s created', th: 'สร้างจากที่ไหน' },
    values: [
      { en: 'shopify.com (free trial → paid plan)', th: 'shopify.com (ทดลองใช้ → แพ็กเกจแบบชำระเงิน)' },
      { en: 'Dev Dashboard → Stores → Create store → “Dev”', th: 'Dev Dashboard → Stores → Create store → “Dev”' },
      { en: 'Dev Dashboard → Stores → Create store → “Client transfer store”', th: 'Dev Dashboard → Stores → Create store → “Client transfer store”' },
    ],
  },
  {
    label: { en: 'Plan', th: 'แพ็กเกจ' },
    values: [
      { en: 'Paid plan chosen by the merchant', th: 'แพ็กเกจแบบชำระเงินที่ผู้ค้าเลือก' },
      { en: 'Pick any plan to test its features', th: 'เลือกแพ็กเกจใดก็ได้เพื่อทดสอบฟีเจอร์' },
      { en: 'Most Advanced-plan features (or Plus) during the build; the client picks the plan on transfer', th: 'ได้ฟีเจอร์ส่วนใหญ่ของ Advanced (หรือ Plus) ระหว่างพัฒนา ลูกค้าเลือกแพ็กเกจตอนรับโอน' },
    ],
  },
  {
    label: { en: 'Real orders & payments', th: 'รับคำสั่งซื้อ/ชำระเงินจริง' },
    values: [
      { en: 'Yes', th: 'ได้' },
      { en: 'No — test orders only (test payment gateway)', th: 'ไม่ได้ — สั่งซื้อทดสอบเท่านั้น (ช่องทางชำระเงินทดสอบ)' },
      { en: 'No — test orders only until the client takes over', th: 'ไม่ได้ — สั่งซื้อทดสอบเท่านั้น จนกว่าลูกค้าจะรับโอน' },
    ],
  },
  {
    label: { en: 'Password page', th: 'หน้าใส่รหัสผ่าน' },
    values: [
      { en: 'Optional — removed when you launch', th: 'ไม่บังคับ — นำออกได้เมื่อเปิดร้าน' },
      { en: 'Used to keep the test store private', th: 'ใช้ปิดร้านทดสอบไว้เป็นส่วนตัว' },
      { en: 'On by default and can’t be removed while it’s yours', th: 'เปิดไว้ตั้งแต่แรก และนำออกไม่ได้ระหว่างที่ยังเป็นของคุณ' },
    ],
  },
  {
    label: { en: 'Transfer to a merchant', th: 'โอนให้ผู้ค้าได้ไหม' },
    values: [
      { en: '— (already the merchant’s)', th: '— (เป็นของผู้ค้าอยู่แล้ว)' },
      { en: 'No', th: 'ไม่ได้' },
      { en: 'Yes — invite expires after 7 days; turn off Shopify Payments first', th: 'ได้ — คำเชิญหมดอายุใน 7 วัน และต้องปิด Shopify Payments ก่อนโอน' },
    ],
  },
  {
    label: { en: 'Apps', th: 'แอป' },
    values: [
      { en: 'Any App Store app', th: 'แอปจาก App Store ได้ทั้งหมด' },
      { en: 'App Store apps (after identity verification) plus your own custom/draft apps', th: 'แอปจาก App Store (หลังยืนยันตัวตน) และแอป Custom/Draft ของคุณเอง' },
      { en: 'Only free and partner-friendly apps — no custom/draft apps', th: 'เฉพาะแอปฟรีและแอปที่รองรับพาร์ทเนอร์ — ติดตั้งแอป Custom/Draft ไม่ได้' },
    ],
  },
];

export function StoreTypes() {
  const { lang } = useI18n();
  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-3">
        {TYPES.map((s) => (
          <div
            key={s.key}
            className={clsx(
              'relative flex flex-col rounded-xl border bg-white p-4 dark:bg-slate-900',
              s.workshop ? 'border-indigo-400 ring-2 ring-indigo-500/20 dark:border-indigo-400/60' : 'border-slate-200 dark:border-white/10',
            )}
          >
            {s.workshop && (
              <span className="absolute -top-2.5 right-3 rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white dark:bg-indigo-500">
                {lang === 'th' ? 'ใช้ในเวิร์กช็อปนี้' : 'Used in this workshop'}
              </span>
            )}
            <div className="flex items-center gap-3">
              <span className={clsx('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', s.tone)}>
                <s.icon size={18} />
              </span>
              <div>
                <div className="font-semibold">{s.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{s.thai}</div>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-200">{s.summary[lang]}</p>
            <div className="mt-auto pt-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-200">{lang === 'th' ? 'เหมาะกับ: ' : 'Best for: '}</span>
              {s.bestFor[lang]}
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900">
        <div className="border-b border-slate-100 px-4 py-3 text-sm font-semibold dark:border-white/10">
          {lang === 'th' ? 'เปรียบเทียบแบบเคียงกัน' : 'Side-by-side comparison'}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500 dark:bg-white/5 dark:text-slate-400">
              <tr>
                <th className="w-40 px-4 py-2.5 font-medium" />
                {TYPES.map((s) => (
                  <th key={s.key} className={clsx('px-4 py-2.5 font-semibold', s.workshop && 'text-indigo-700 dark:text-indigo-300')}>
                    {s.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {ROWS.map((r) => (
                <tr key={r.label.en} className="align-top">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400">{r.label[lang]}</th>
                  {r.values.map((v, i) => (
                    <td key={i} className={clsx('px-4 py-3 leading-relaxed', TYPES[i].workshop && 'bg-indigo-50/50 dark:bg-indigo-500/5')}>
                      {v[lang]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-white/10 dark:bg-slate-900">
        <Handshake size={18} className="mt-0.5 shrink-0 text-slate-500" />
        <p className="leading-relaxed text-slate-600 dark:text-slate-300">
          <span className="font-semibold text-slate-800 dark:text-slate-100">Collaboration · </span>
          {lang === 'th'
            ? 'อีกรูปแบบหนึ่งใน Dev Dashboard: ผู้ค้าให้สิทธิ์ Collaborator แก่คุณเพื่อเข้าไปทำงานในร้านจริงของเขา คุณไม่ได้เป็นเจ้าของร้านและไม่มีการโอนร้าน'
            : 'A fourth option in the Dev Dashboard: a merchant gives you collaborator access to work inside their live store. You don’t own it and it isn’t transferred.'}
        </p>
      </div>
    </div>
  );
}
