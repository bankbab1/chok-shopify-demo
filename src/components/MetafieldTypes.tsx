import clsx from 'clsx';
import { useI18n } from '../i18n';

type L = { en: string; th: string };

interface MfType {
  name: string;
  /** Shown in grey after the name, e.g. "(Single line text)" — exactly as the Type dropdown shows it. */
  sub?: string;
  what: L;
  example: L;
  /** Where the workshop uses this type. */
  used?: string;
}

interface MfGroup {
  key: string;
  title: L;
  tone: string;
  types: MfType[];
}

/* Follows the "Type" dropdown in Settings → Metafields and metaobjects → (resource) → Add definition. */
const GROUPS: MfGroup[] = [
  {
    key: 'text',
    title: { en: 'Text', th: 'ข้อความ' },
    tone: 'bg-indigo-600',
    types: [
      {
        name: 'Single line text',
        what: { en: 'One short line of plain text — no line breaks.', th: 'ข้อความสั้น 1 บรรทัด ไม่มีการขึ้นบรรทัดใหม่' },
        example: { en: 'Weight: 250 g', th: 'น้ำหนัก: 250 g' },
        used: 'weight · gender (list)',
      },
      {
        name: 'Multi-line text',
        what: { en: 'Plain text that can have several lines / paragraphs, but no formatting (no bold, bullets or links).', th: 'ข้อความธรรมดาที่ขึ้นบรรทัดใหม่ได้หลายย่อหน้า แต่จัดรูปแบบไม่ได้ (ไม่มีตัวหนา บูลเล็ต หรือลิงก์)' },
        example: { en: 'A long product description.', th: 'คำอธิบายสินค้ายาว ๆ' },
        used: 'full_product_description',
      },
      {
        name: 'Rich text',
        what: { en: 'Text with formatting you set in an editor: bold, italic, headings, bullet lists and links.', th: 'ข้อความที่จัดรูปแบบได้ในตัวแก้ไข เช่น ตัวหนา ตัวเอียง หัวข้อ บูลเล็ต และลิงก์' },
        example: { en: 'Care instructions as a bullet list.', th: 'วิธีดูแลรักษาแบบเป็นข้อ ๆ' },
        used: 'story · care_instructions · materials · features',
      },
      {
        name: 'Choice list',
        sub: '(Single line text)',
        what: { en: 'Single line text that must be one of the choices you define — the value is picked from a dropdown, not typed.', th: 'ข้อความ 1 บรรทัดที่ต้องเลือกจากตัวเลือกที่กำหนดไว้ — เลือกจากรายการ ไม่ต้องพิมพ์เอง' },
        example: { en: 'Gender: Male / Female / Unisex.', th: 'เพศ: Male / Female / Unisex' },
      },
      {
        name: 'Email',
        sub: '(Single line text)',
        what: { en: 'Single line text that must look like an email address.', th: 'ข้อความ 1 บรรทัดที่ต้องมีรูปแบบเป็นอีเมล' },
        example: { en: 'support@example.com', th: 'support@example.com' },
      },
    ],
  },
  {
    key: 'media',
    title: { en: 'Media', th: 'สื่อ' },
    tone: 'bg-rose-600',
    types: [
      {
        name: 'File',
        what: { en: 'Any file uploaded to Shopify Files — PDF, document, image or video.', th: 'ไฟล์ใด ๆ ที่อัปโหลดใน Shopify Files เช่น PDF เอกสาร รูป หรือวิดีโอ' },
        example: { en: 'A size-guide PDF.', th: 'ไฟล์ PDF ตารางไซซ์' },
      },
      {
        name: 'Image',
        sub: '(File)',
        what: { en: 'A file restricted to images only.', th: 'ไฟล์ที่จำกัดให้เป็นรูปภาพเท่านั้น' },
        example: { en: 'A lifestyle photo shown on the product page.', th: 'รูปไลฟ์สไตล์ที่แสดงในหน้าสินค้า' },
      },
      {
        name: 'Video',
        sub: '(File)',
        what: { en: 'A file restricted to video only.', th: 'ไฟล์ที่จำกัดให้เป็นวิดีโอเท่านั้น' },
        example: { en: 'A short product demo clip.', th: 'คลิปสาธิตสินค้าสั้น ๆ' },
      },
    ],
  },
  {
    key: 'reference',
    title: { en: 'Reference', th: 'อ้างอิง (Reference)' },
    tone: 'bg-violet-600',
    types: [
      {
        name: 'Product',
        what: { en: 'Points to another product in your store. Also available: Product variant, Collection, Customer, Company, Order, Page, Blog and Blog post.', th: 'ชี้ไปยังสินค้าอื่นในร้าน และมีให้เลือกอีก: Product variant, Collection, Customer, Company, Order, Page, Blog และ Blog post' },
        example: { en: '“Pairs well with” → another product.', th: '“เข้ากันได้ดีกับ” → สินค้าอีกชิ้น' },
      },
      {
        name: 'Metaobject',
        what: { en: 'Points to a metaobject — a reusable structured record you design yourself (the arrow › lets you pick which metaobject). Not used in this workshop.', th: 'ชี้ไปยัง Metaobject — ข้อมูลแบบมีโครงสร้างที่ออกแบบเองและนำกลับมาใช้ซ้ำได้ (ลูกศร › ใช้เลือกว่าเป็น Metaobject ตัวไหน) เวิร์กชอปนี้ไม่ได้ใช้' },
        example: { en: 'A “Designer” record with name, photo and bio.', th: 'ข้อมูล “Designer” ที่มีชื่อ รูป และประวัติ' },
      },
    ],
  },
  {
    key: 'number',
    title: { en: 'Number', th: 'ตัวเลข' },
    tone: 'bg-emerald-600',
    types: [
      {
        name: 'Integer',
        what: { en: 'A whole number, no decimals.', th: 'จำนวนเต็ม ไม่มีทศนิยม' },
        example: { en: 'Pairs per box: 2', th: 'จำนวนคู่ต่อกล่อง: 2' },
      },
      {
        name: 'Decimal',
        what: { en: 'A number with decimals.', th: 'ตัวเลขที่มีทศนิยม' },
        example: { en: 'Heel drop: 8.5', th: 'ความต่างส้น: 8.5' },
      },
      {
        name: 'Money',
        what: { en: 'An amount plus a currency.', th: 'จำนวนเงินพร้อมสกุลเงิน' },
        example: { en: 'Original price: 3,500 THB', th: 'ราคาเดิม: 3,500 THB' },
      },
      {
        name: 'Rating',
        what: { en: 'A score on a scale you choose (min and max), e.g. 1–5 stars.', th: 'คะแนนในช่วงที่กำหนด (ต่ำสุด–สูงสุด) เช่น 1–5 ดาว' },
        example: { en: 'Cushioning: 4 out of 5', th: 'ความนุ่ม: 4 จาก 5' },
      },
      {
        name: 'Measurement',
        what: { en: 'A value with a unit. The arrow › lets you choose Dimension (length), Volume or Weight.', th: 'ค่าพร้อมหน่วย ลูกศร › ใช้เลือกประเภท: Dimension (ความยาว), Volume (ปริมาตร) หรือ Weight (น้ำหนัก)' },
        example: { en: 'Weight: 250 g (a real unit, unlike plain text).', th: 'น้ำหนัก: 250 g (มีหน่วยจริง ต่างจากข้อความธรรมดา)' },
      },
      {
        name: 'ID',
        what: { en: 'An identifier — a code or number used to match records, not to calculate with.', th: 'รหัสระบุตัวตน — ใช้จับคู่ข้อมูล ไม่ได้ใช้คำนวณ' },
        example: { en: 'An ID from your ERP system.', th: 'รหัสจากระบบ ERP ของคุณ' },
      },
    ],
  },
  {
    key: 'link',
    title: { en: 'Link', th: 'ลิงก์' },
    tone: 'bg-sky-600',
    types: [
      {
        name: 'Link',
        what: { en: 'A clickable link made of a label (text) and a URL.', th: 'ลิงก์ที่คลิกได้ ประกอบด้วยข้อความและ URL' },
        example: { en: 'Label: Size guide · URL: https://…', th: 'ข้อความ: Size guide · URL: https://…' },
      },
      {
        name: 'URL',
        what: { en: 'A web address on its own, no label.', th: 'ที่อยู่เว็บอย่างเดียว ไม่มีข้อความกำกับ' },
        example: { en: 'https://example.com/spec-sheet', th: 'https://example.com/spec-sheet' },
      },
    ],
  },
  {
    key: 'date',
    title: { en: 'Date and time', th: 'วันที่และเวลา' },
    tone: 'bg-amber-500',
    types: [
      {
        name: 'Date',
        what: { en: 'A calendar date only.', th: 'วันที่อย่างเดียว' },
        example: { en: 'Release date: 2026-12-01', th: 'วันวางขาย: 2026-12-01' },
      },
      {
        name: 'Date and time',
        what: { en: 'A date plus a time of day.', th: 'วันที่พร้อมเวลา' },
        example: { en: 'Sale ends: 2026-12-31 23:59', th: 'โปรโมชันสิ้นสุด: 2026-12-31 23:59' },
      },
    ],
  },
  {
    key: 'other',
    title: { en: 'Other', th: 'อื่น ๆ' },
    tone: 'bg-slate-600',
    types: [
      {
        name: 'True or false',
        what: { en: 'A yes / no switch.', th: 'สวิตช์ ใช่ / ไม่ใช่' },
        example: { en: 'Is waterproof: true', th: 'กันน้ำ: true' },
      },
      {
        name: 'Color',
        what: { en: 'A color value (hex code) picked with a color picker.', th: 'ค่าสี (รหัส hex) เลือกจากตัวเลือกสี' },
        example: { en: '#E91E63', th: '#E91E63' },
      },
      {
        name: 'JSON',
        what: { en: 'Structured data in JSON format, for developers or apps.', th: 'ข้อมูลแบบมีโครงสร้างในรูปแบบ JSON สำหรับนักพัฒนาหรือแอป' },
        example: { en: '{ "sizes": [5, 6, 7] }', th: '{ "sizes": [5, 6, 7] }' },
      },
    ],
  },
];

export function MetafieldTypes() {
  const { lang } = useI18n();
  const th = lang === 'th';
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
        <div className="text-sm font-semibold">{th ? 'ก่อนเลือก Type: “One value” หรือ “List of values”' : 'Before picking a type: “One value” or “List of values”'}</div>
        <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          {th
            ? 'ปุ่มเล็ก ๆ ข้างช่อง Type ใช้เลือกว่า field นี้เก็บค่าเดียว (One value) หรือเก็บหลายค่าเป็นรายการ (List of values) ได้ทุก Type ในรายการด้านล่าง'
            : 'The small button next to the Type field decides whether the field holds a single value (One value) or several values as a list (List of values). It works with any type below.'}
        </p>
        <div className="mt-2 grid gap-2 text-xs sm:grid-cols-2">
          <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-white/5">
            <b>One value</b> — {th ? 'เช่น weight = 250 g' : 'e.g. weight = 250 g'}
          </div>
          <div className="rounded-lg bg-slate-50 p-2.5 dark:bg-white/5">
            <b>List of values</b> — {th ? 'เช่น gender = Male, Female (Single line text แบบรายการ)' : 'e.g. gender = Male, Female (a list of Single line text)'}
          </div>
        </div>
      </div>

      {GROUPS.map((g) => (
        <section key={g.key} className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-900">
          <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 dark:border-white/5">
            <span className={clsx('h-2.5 w-2.5 rounded-full', g.tone)} />
            <h3 className="text-sm font-semibold">{g.title[lang]}</h3>
            <span className="text-[11px] text-slate-400">{g.title.en !== g.title[lang] ? g.title.en : ''}</span>
          </div>
          <ul className="divide-y divide-slate-100 dark:divide-white/5">
            {g.types.map((tp) => (
              <li key={tp.name + (tp.sub ?? '')} className="px-4 py-3">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-sm font-semibold">{tp.name}</span>
                  {tp.sub && <span className="text-xs text-slate-400">{tp.sub}</span>}
                  {tp.used && (
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
                      {th ? 'ใช้ในเวิร์กชอป' : 'Used in workshop'}: {tp.used}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{tp.what[lang]}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold">{th ? 'ตัวอย่าง: ' : 'Example: '}</span>
                  {tp.example[lang]}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
