import { useState } from 'react';
import clsx from 'clsx';
import {
  AlertTriangle,
  BarChart3,
  Check,
  Heart,
  Megaphone,
  MessageCircle,
  Palette,
  Repeat,
  Share2,
  Smartphone,
  Star,
  Store,
  Truck,
  Boxes,
  Code2,
  Puzzle,
  Scale,
  type LucideIcon,
} from 'lucide-react';
import { useI18n } from '../i18n';

type L = { en: string; th: string };

/* ------------------------------------------------------------------ 1. The idea, in one picture */

function TheIdea() {
  const { lang } = useI18n();
  const th = lang === 'th';
  return (
    <div className="rounded-xl border border-indigo-200 bg-white p-4 dark:border-indigo-400/30 dark:bg-slate-900">
      <div className="text-sm font-semibold">{th ? 'เข้าใจง่ายที่สุด: เหมือนแอปในมือถือ' : 'The simplest way to think about it: like apps on your phone'}</div>
      <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {th
          ? 'มือถือใหม่ทำงานพื้นฐานได้ (โทร ถ่ายรูป) แต่ถ้าอยากได้ความสามารถเพิ่ม ก็ไปโหลดแอปจาก App Store / Google Play — Shopify ก็เหมือนกัน ร้านค้าทำงานหลักได้ครบ (สินค้า ตะกร้า ชำระเงิน คำสั่งซื้อ) และถ้าอยากได้ฟีเจอร์เพิ่ม ก็ติดตั้งแอปจาก Shopify App Store โดยไม่ต้องเขียนโค้ด'
          : 'A new phone does the basics (calls, camera). For anything more, you install an app from the App Store or Google Play. Shopify works the same way: your store already handles the core (products, cart, checkout, orders), and when you want more, you install an app from the Shopify App Store — no coding.'}
      </p>
      <div className="mt-4 grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <div className="rounded-lg bg-slate-50 p-3 dark:bg-white/5">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Smartphone size={16} className="text-slate-500" /> {th ? 'มือถือ' : 'Phone'}
          </div>
          <div className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            {th ? 'App Store / Google Play → ติดตั้งแอป → ได้ฟีเจอร์ใหม่ เช่น LINE, Grab' : 'App Store / Google Play → install → new features, e.g. a chat or a taxi app'}
          </div>
        </div>
        <div className="text-center text-xl font-semibold text-indigo-400">=</div>
        <div className="rounded-lg bg-indigo-50 p-3 dark:bg-indigo-500/10">
          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-900 dark:text-indigo-100">
            <Store size={16} /> {th ? 'ร้าน Shopify' : 'Shopify store'}
          </div>
          <div className="mt-2 text-xs leading-relaxed text-indigo-900/80 dark:text-indigo-100/80">
            {th ? 'Shopify App Store → ติดตั้งแอป → ร้านได้ฟีเจอร์ใหม่ เช่น แชตกับลูกค้า, Wishlist, รีวิวสินค้า' : 'Shopify App Store → install → your store gets new features, e.g. customer chat, wishlist, product reviews'}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ 2. Phone app vs Shopify app */

const COMPARE: { topic: L; phone: L; shopify: L }[] = [
  {
    topic: { en: 'Where you get it', th: 'โหลดจากไหน' },
    phone: { en: 'App Store / Google Play', th: 'App Store / Google Play' },
    shopify: { en: 'Shopify App Store (apps.shopify.com) or Admin → Apps', th: 'Shopify App Store (apps.shopify.com) หรือ Admin → Apps' },
  },
  {
    topic: { en: 'Installed on', th: 'ติดตั้งที่ไหน' },
    phone: { en: 'Your phone', th: 'มือถือของคุณ' },
    shopify: { en: 'Your store — works in Admin and can add blocks to your theme', th: 'ร้านค้าของคุณ — ใช้งานใน Admin และเพิ่มบล็อกลงในธีมได้' },
  },
  {
    topic: { en: 'Who uses it', th: 'ใครใช้' },
    phone: { en: 'You', th: 'ตัวคุณเอง' },
    shopify: { en: 'You (in Admin) and your customers (on the storefront)', th: 'คุณ (ใน Admin) และลูกค้า (บนหน้าร้าน)' },
  },
  {
    topic: { en: 'Permissions', th: 'การขอสิทธิ์' },
    phone: { en: '“Allow camera / location?”', th: '“อนุญาตให้ใช้กล้อง / ตำแหน่ง?”' },
    shopify: { en: '“Allow access to products / orders / customers?” — you approve when installing', th: '“อนุญาตให้เข้าถึงสินค้า / คำสั่งซื้อ / ลูกค้า?” — กดยอมรับตอนติดตั้ง' },
  },
  {
    topic: { en: 'Price', th: 'ราคา' },
    phone: { en: 'Free, paid or subscription', th: 'ฟรี ซื้อครั้งเดียว หรือรายเดือน' },
    shopify: { en: 'Free, free plan + paid plans, or monthly — charged on your Shopify bill', th: 'ฟรี มีแพ็กเกจฟรี + แบบเสียเงิน หรือรายเดือน — เรียกเก็บรวมในบิล Shopify' },
  },
];

function Compare() {
  const { lang } = useI18n();
  const th = lang === 'th';
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900">
      <div className="border-b border-slate-100 px-4 py-3 text-sm font-semibold dark:border-white/5">
        {th ? 'เหมือนแอปใน App Store / Google Play ไหม? — เหมือนเกือบทุกอย่าง ต่างกันตรงนี้' : 'Is it like the App Store / Google Play? — Almost exactly. The differences:'}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-xs">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 dark:bg-white/5">
            <tr>
              <th className="px-4 py-2 font-semibold"></th>
              <th className="px-4 py-2 font-semibold">{th ? 'แอปในมือถือ' : 'Phone app'}</th>
              <th className="px-4 py-2 font-semibold text-indigo-500">{th ? 'แอป Shopify' : 'Shopify app'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {COMPARE.map((r) => (
              <tr key={r.topic.en}>
                <td className="px-4 py-2.5 font-semibold text-slate-700 dark:text-slate-200">{r.topic[lang]}</td>
                <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{r.phone[lang]}</td>
                <td className="px-4 py-2.5 text-slate-800 dark:text-slate-100">{r.shopify[lang]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ 3. What problem do you want to solve? */

interface Need {
  key: string;
  icon: LucideIcon;
  need: L;
  how: L;
  examples: string;
  workshop?: string;
}

/* Example apps are well-known listings; check the App Store for current plans and prices. */
const NEEDS: Need[] = [
  {
    key: 'chat',
    icon: MessageCircle,
    need: { en: 'Talk to customers', th: 'คุยกับลูกค้า' },
    how: { en: 'A chat bubble on the store; answer questions from Admin or your phone.', th: 'ปุ่มแชตบนหน้าร้าน ตอบคำถามลูกค้าได้จาก Admin หรือมือถือ' },
    examples: 'Shopify Inbox',
    workshop: 'Shopify Inbox',
  },
  {
    key: 'wishlist',
    icon: Heart,
    need: { en: 'Let shoppers save for later', th: 'ให้ลูกค้าเก็บสินค้าไว้ซื้อทีหลัง' },
    how: { en: 'A heart button saves products to a list; shoppers come back and buy.', th: 'ปุ่มหัวใจบันทึกสินค้าไว้ในรายการ ลูกค้ากลับมาซื้อทีหลังได้' },
    examples: 'Wishlist by Square',
    workshop: 'Wishlist by Square',
  },
  {
    key: 'reviews',
    icon: Star,
    need: { en: 'Build trust', th: 'สร้างความน่าเชื่อถือ' },
    how: { en: 'Collect product reviews and star ratings and show them on product pages.', th: 'เก็บรีวิวและคะแนนดาว แล้วแสดงในหน้าสินค้า' },
    examples: 'Judge.me · Shopify Product Reviews',
  },
  {
    key: 'marketing',
    icon: Megaphone,
    need: { en: 'Bring customers back', th: 'ดึงลูกค้ากลับมาซื้อซ้ำ' },
    how: { en: 'Email campaigns, abandoned-cart reminders and sign-up pop-ups.', th: 'ส่งอีเมลแคมเปญ เตือนตะกร้าที่ค้างไว้ และป๊อปอัปสมัครสมาชิก' },
    examples: 'Shopify Email · Klaviyo · Shopify Forms',
  },
  {
    key: 'channels',
    icon: Share2,
    need: { en: 'Sell on social and search', th: 'ขายบนโซเชียลและ Google' },
    how: { en: 'Sync your products to other channels so people can find and buy them there.', th: 'ซิงก์สินค้าไปช่องทางอื่น ให้คนเจอและซื้อได้จากที่นั่น' },
    examples: 'Facebook & Instagram · Google & YouTube · TikTok',
  },
  {
    key: 'shipping',
    icon: Truck,
    need: { en: 'Ship faster', th: 'จัดส่งได้เร็วขึ้น' },
    how: { en: 'Print shipping labels, connect local carriers and send tracking updates.', th: 'พิมพ์ใบปะหน้า เชื่อมต่อขนส่ง และส่งอัปเดตการติดตามพัสดุ' },
    examples: 'Shipping & delivery apps for your carriers',
  },
  {
    key: 'inventory',
    icon: Boxes,
    need: { en: 'Manage stock and data', th: 'จัดการสต็อกและข้อมูล' },
    how: { en: 'Bulk edit products, import/export, and automate repetitive tasks.', th: 'แก้ไขสินค้าทีละมาก ๆ นำเข้า/ส่งออก และทำงานซ้ำ ๆ อัตโนมัติ' },
    examples: 'Shopify Flow · Matrixify',
  },
  {
    key: 'design',
    icon: Palette,
    need: { en: 'Design special pages', th: 'ออกแบบหน้าพิเศษ' },
    how: { en: 'Drag-and-drop page builders for landing pages and campaigns.', th: 'เครื่องมือสร้างหน้าแบบลากวาง สำหรับหน้าแคมเปญหรือโปรโมชั่น' },
    examples: 'Page builder apps',
  },
  {
    key: 'subscriptions',
    icon: Repeat,
    need: { en: 'Sell subscriptions', th: 'ขายแบบสมัครสมาชิก' },
    how: { en: 'Repeat deliveries billed automatically, e.g. socks every month.', th: 'ส่งสินค้าซ้ำและตัดเงินอัตโนมัติ เช่น ถุงเท้าทุกเดือน' },
    examples: 'Shopify Subscriptions',
  },
  {
    key: 'reports',
    icon: BarChart3,
    need: { en: 'Understand your numbers', th: 'เข้าใจตัวเลขของร้าน' },
    how: { en: 'Deeper reports and dashboards than the built-in Analytics.', th: 'รายงานและแดชบอร์ดที่ละเอียดกว่า Analytics ในตัว' },
    examples: 'Reporting & analytics apps',
  },
];

function NeedPicker() {
  const { lang } = useI18n();
  const th = lang === 'th';
  const [pick, setPick] = useState('chat');
  const n = NEEDS.find((x) => x.key === pick)!;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
      <div className="text-sm font-semibold">{th ? 'ตอบโจทย์ด้านไหน? — เลือกสิ่งที่ร้านอยากทำ' : 'What problems do apps solve? — Pick what your store needs'}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {NEEDS.map((x) => (
          <button
            key={x.key}
            type="button"
            onClick={() => setPick(x.key)}
            aria-pressed={pick === x.key}
            className={clsx(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition',
              pick === x.key
                ? 'border-indigo-600 bg-indigo-600 text-white'
                : 'border-slate-200 text-slate-600 hover:border-slate-400 dark:border-white/10 dark:text-slate-300',
            )}
          >
            <x.icon size={13} />
            {x.need[lang]}
            {x.workshop && <span className={clsx('h-1.5 w-1.5 rounded-full', pick === x.key ? 'bg-white' : 'bg-emerald-500')} aria-hidden="true" />}
          </button>
        ))}
      </div>
      <div className="mt-4 flex gap-3 rounded-lg bg-indigo-50 p-4 dark:bg-indigo-500/10">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white">
          <n.icon size={18} />
        </span>
        <div className="min-w-0 text-sm">
          <div className="font-semibold text-indigo-950 dark:text-indigo-50">{n.need[lang]}</div>
          <p className="mt-1 leading-relaxed text-indigo-900/90 dark:text-indigo-100/90">{n.how[lang]}</p>
          <p className="mt-2 text-xs text-indigo-900/80 dark:text-indigo-100/80">
            <span className="font-semibold">{th ? 'ตัวอย่างแอป: ' : 'Example apps: '}</span>
            {n.examples}
          </p>
          {n.workshop && (
            <p className="mt-2 inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200">
              <Check size={12} /> {th ? `ใช้ในเวิร์กช็อปนี้: ${n.workshop}` : `In this workshop: ${n.workshop}`}
            </p>
          )}
        </div>
      </div>
      <p className="mt-2 text-[11px] text-slate-400">
        {th ? '● จุดสีเขียว = แอปที่เราจะติดตั้งในเวิร์กช็อปนี้ · ราคาและแพ็กเกจดูล่าสุดได้ที่ App Store' : '● Green dot = an app we install in this workshop · Check the App Store for current plans and prices'}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ 4. Why it's good + what to watch */

const GOOD: L[] = [
  { en: 'Add a feature in minutes — no developer, no code.', th: 'เพิ่มฟีเจอร์ได้ในไม่กี่นาที — ไม่ต้องจ้างนักพัฒนา ไม่ต้องเขียนโค้ด' },
  { en: 'Try before you commit: many apps have a free plan or a free trial.', th: 'ลองก่อนได้: หลายแอปมีแพ็กเกจฟรีหรือช่วงทดลองใช้' },
  { en: 'Works with your store data: products, orders and customers stay in one place.', th: 'ทำงานกับข้อมูลร้านโดยตรง: สินค้า คำสั่งซื้อ และลูกค้าอยู่ที่เดียว' },
  { en: 'Apps appear in the theme editor as blocks (“app blocks”), so you place them like any other block.', th: 'แอปจะโผล่ใน Theme editor เป็นบล็อก (“App blocks”) วางได้เหมือนบล็อกอื่น' },
  { en: 'Shopify reviews apps before they are listed; “Built for Shopify” marks apps that meet extra quality standards.', th: 'Shopify ตรวจสอบแอปก่อนขึ้น Store และป้าย “Built for Shopify” คือแอปที่ผ่านมาตรฐานคุณภาพเพิ่มเติม' },
];

const WATCH: L[] = [
  { en: 'Monthly fees add up — check the price of every app you keep.', th: 'ค่ารายเดือนรวมกันแล้วสูงได้ — เช็กราคาทุกแอปที่ใช้อยู่' },
  { en: 'Too many apps can slow the store down. Keep only what you use.', th: 'แอปเยอะเกินไปทำให้ร้านช้าได้ เก็บไว้เฉพาะที่ใช้จริง' },
  { en: 'Read the permissions and the reviews before you install.', th: 'อ่านสิทธิ์ที่ขอและรีวิวก่อนติดตั้ง' },
  { en: 'Uninstall apps you don’t use — and remove any app blocks they left in the theme.', th: 'ถอนการติดตั้งแอปที่ไม่ใช้ — และลบ App blocks ที่ค้างอยู่ในธีม' },
];

function GoodAndWatch() {
  const { lang } = useI18n();
  const th = lang === 'th';
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-400/30 dark:bg-emerald-500/10">
        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-900 dark:text-emerald-100">
          <Check size={16} /> {th ? 'ดียังไง' : 'Why apps are good'}
        </div>
        <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-emerald-950/90 dark:text-emerald-50/90">
          {GOOD.map((x) => (
            <li key={x.en} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              {x[lang]}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-400/30 dark:bg-amber-500/10">
        <div className="flex items-center gap-2 text-sm font-semibold text-amber-900 dark:text-amber-100">
          <AlertTriangle size={16} /> {th ? 'ข้อควรระวัง' : 'What to watch'}
        </div>
        <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-amber-950/90 dark:text-amber-50/90">
          {WATCH.map((x) => (
            <li key={x.en} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
              {x[lang]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ 5. App, or build it yourself? */

const UPDATE_ROWS: { where: L; update: L; tone: 'green' | 'amber' | 'rose' }[] = [
  {
    where: { en: 'Custom Liquid block (theme editor)', th: 'บล็อก Custom Liquid (Theme editor)' },
    update: {
      en: 'Usually carried over on a theme update (it is stored as a setting) — but it can break if it relies on theme classes or CSS that changed. Check it after every update.',
      th: 'ส่วนใหญ่ย้ายไปเวอร์ชันใหม่ให้ (เก็บเป็นการตั้งค่า) — แต่อาจพังถ้าโค้ดอิง class หรือ CSS ของธีมที่เปลี่ยน ต้องเปิดเช็กทุกครั้งหลังอัปเดต',
    },
    tone: 'amber',
  },
  {
    where: { en: 'Edited theme files (Edit code)', th: 'แก้ไฟล์ .liquid ของธีม (Edit code)' },
    update: {
      en: 'Shopify can’t update it for you. The new version is a fresh copy without your code — you re-apply your changes by hand every time.',
      th: 'Shopify อัปเดตให้อัตโนมัติไม่ได้ เวอร์ชันใหม่เป็นสำเนาใหม่ที่ไม่มีโค้ดของเรา — ต้องนำโค้ดไปใส่ใหม่เองทุกครั้ง',
    },
    tone: 'rose',
  },
  {
    where: { en: 'Switching to another theme', th: 'เปลี่ยนไปใช้ธีมอื่น' },
    update: {
      en: 'Custom code is gone — rebuild it. Most apps keep working in any Online Store 2.0 theme: just place their app block again.',
      th: 'โค้ดที่ทำเองหายทั้งหมด ต้องทำใหม่ ขณะที่แอปส่วนใหญ่ใช้ได้กับทุกธีม Online Store 2.0 — แค่วาง App block ใหม่',
    },
    tone: 'rose',
  },
];

const DOT = { green: 'bg-emerald-500', amber: 'bg-amber-500', rose: 'bg-rose-500' };

const DIY_CONS: L[] = [
  { en: 'Needs a developer for every change — there is no settings screen for your team.', th: 'ต้องมีนักพัฒนาทุกครั้งที่จะแก้ — ไม่มีหน้าตั้งค่าให้ทีมร้านปรับเอง' },
  {
    en: 'Liquid only renders the page. It can’t save data, send emails or run in the background — a logged-in wishlist, chat or reviews need a server (an app).',
    th: 'Liquid ทำได้แค่แสดงผลหน้าเว็บ เก็บข้อมูล ส่งอีเมล หรือทำงานเบื้องหลังไม่ได้ — Wishlist แบบล็อกอิน แชต หรือรีวิว ต้องมีเซิร์ฟเวอร์ (คือแอป)',
  },
  { en: 'Security, speed and bugs are on you — there is no vendor support.', th: 'ความปลอดภัย ความเร็ว และบั๊กเป็นความรับผิดชอบของเรา — ไม่มีผู้ให้บริการคอยซัพพอร์ต' },
  { en: 'If the person who wrote it leaves, someone new must learn the code.', th: 'ถ้าคนเขียนลาออก คนใหม่ต้องมาไล่อ่านโค้ด' },
];

const DIY_PROS: L[] = [
  { en: 'No monthly fee.', th: 'ไม่มีค่ารายเดือน' },
  { en: 'Full control over how it looks and works.', th: 'ควบคุมหน้าตาและการทำงานได้ 100%' },
  { en: 'Often lighter than an app — no extra scripts loaded.', th: 'มักเบากว่าแอป — ไม่ต้องโหลด script เสริม' },
];

function AppOrDiy() {
  const { lang } = useI18n();
  const th = lang === 'th';
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Scale size={16} className="text-indigo-500" />
        {th ? 'แอป หรือ ทำเอง (Custom Liquid / Dev)?' : 'App, or build it yourself (Custom Liquid / dev)?'}
      </div>
      <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        {th
          ? 'ทำเองได้ — เราใช้ Custom Liquid ไปแล้วกับตัวค้นหาสาขาในหน้า Store Location แต่มีข้อแลกเปลี่ยน โดยเฉพาะตอนธีมอัปเดต'
          : 'You can — we already used Custom Liquid for the store locator on the Store Location page. But there are trade-offs, especially when the theme updates.'}
      </p>

      {/* What happens on a theme update */}
      <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 dark:border-white/10">
        <div className="bg-slate-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:bg-white/5">
          {th ? 'ตอนธีมอัปเดต ต้องคอยปรับไหม?' : 'When the theme updates — do you have to fix it?'}
        </div>
        <dl className="divide-y divide-slate-100 dark:divide-white/5">
          {UPDATE_ROWS.map((r) => (
            <div key={r.where.en} className="grid gap-1 px-3 py-2.5 text-sm sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-3">
              <dt className="flex items-start gap-2 font-semibold text-slate-800 dark:text-slate-100">
                <span className={clsx('mt-1.5 h-2 w-2 shrink-0 rounded-full', DOT[r.tone])} aria-hidden="true" />
                {r.where[lang]}
              </dt>
              <dd className="text-slate-600 dark:text-slate-300">{r.update[lang]}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Pros and cons of DIY */}
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg bg-rose-50/70 p-3 dark:bg-rose-500/10">
          <div className="text-xs font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-300">{th ? 'ข้อเสียของการทำเอง' : 'Downsides of DIY'}</div>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-rose-950/90 dark:text-rose-50/90">
            {DIY_CONS.map((x) => (
              <li key={x.en} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                {x[lang]}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg bg-emerald-50/70 p-3 dark:bg-emerald-500/10">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">{th ? 'ข้อดีของการทำเอง' : 'Upsides of DIY'}</div>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-emerald-950/90 dark:text-emerald-50/90">
            {DIY_PROS.map((x) => (
              <li key={x.en} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                {x[lang]}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Rule of thumb */}
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 p-3 dark:border-white/10">
          <div className="flex items-center gap-1.5 text-sm font-semibold">
            <Code2 size={14} className="text-indigo-500" /> Custom Liquid
          </div>
          <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            {th ? 'ฟีเจอร์ที่แค่แสดงผล: ตัวค้นหาสาขา แบนเนอร์ ตารางไซซ์ Section พิเศษ' : 'Display-only features: store locator, banners, size chart, special sections.'}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 p-3 dark:border-white/10">
          <div className="flex items-center gap-1.5 text-sm font-semibold">
            <Puzzle size={14} className="text-indigo-500" /> {th ? 'แอป' : 'App'}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            {th ? 'ต้องเก็บข้อมูล ส่งอีเมล ทำงานเบื้องหลัง หรือเชื่อมระบบอื่น: แชต รีวิว อีเมลการตลาด Wishlist' : 'Needs to save data, send emails, run in the background or connect systems: chat, reviews, email marketing, wishlist.'}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 p-3 dark:border-white/10">
          <div className="flex items-center gap-1.5 text-sm font-semibold">
            <Boxes size={14} className="text-indigo-500" /> {th ? 'Custom app (สายกลาง)' : 'Custom app (middle ground)'}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            {th ? 'นักพัฒนาทำแอปเฉพาะร้าน ยืดหยุ่นและมี App block ที่ไม่หายตอนเปลี่ยนธีม — แต่ต้องดูแลเอง' : 'A developer builds an app just for your store — flexible, with app blocks that survive a theme change — but you maintain it.'}
          </p>
        </div>
      </div>
    </div>
  );
}

export function AppsExplained() {
  return (
    <div className="space-y-5">
      <TheIdea />
      <NeedPicker />
      <Compare />
      <GoodAndWatch />
      <AppOrDiy />
    </div>
  );
}
