/**
 * Speaker deck (from Presentation_Speaker.pdf). Images live in /public/slides/slide-NN.webp.
 * Notes are the presenter's talking points, written per language (the speaker presents in Thai).
 * `links` jump from a slide to the matching hands-on workshop module.
 */
export interface Slide {
  /** Position in the deck (1-based), computed from the list order. */
  n: number;
  /** Image file number: /public/slides/slide-NN.webp (from the original PDF page). */
  file: number;
  title: string;
  notes: { th: string[]; en: string[] };
  links?: { label: string; to: string }[];
  /** Rough speaking time in minutes, used for the agenda/timer hint. */
  minutes?: number;
}

const s = (
  file: number,
  title: string,
  th: string[],
  en: string[],
  extra: Partial<Pick<Slide, 'links' | 'minutes'>> = {},
): Omit<Slide, 'n'> => ({ file, title, notes: { th, en }, ...extra });

// Original PDF page 8 (Customer Journey) was removed from the deck.
const DECK: Omit<Slide, 'n'>[] = [
  s(
    1,
    'Shopify Business Builder',
    ['กล่าวทักทายและแนะนำตัว', 'หัวข้อวันนี้: สร้างร้านค้าออนไลน์พร้อมขายจริงภายใน 1 วัน', 'ไฮไลต์จุดเด่น: ใช้งานง่าย ยืดหยุ่น เติบโตได้ รองรับธุรกิจทุกขนาด ปลอดภัย'],
    ['Welcome everyone and introduce yourself', 'Today: build an online store that is ready to sell — in one day', 'Highlights: easy to use, flexible, scalable, for any business size, secure'],
    { minutes: 2 },
  ),
  s(
    2,
    'Beat Protocol — Your Technology & Digital Solutions Partner',
    [
      'แนะนำบริษัท บีท โปรโตคอล — Technology & Digital Solutions Partner',
      'ให้บริการตั้งแต่ระบบบริหารคลังสินค้า (WMS) กระบวนการผลิต ไปจนถึงแพลตฟอร์ม E-Commerce และการเชื่อมต่อระบบ',
      'ดูแลครบ: Business Analysis → Solution Design → Software Development → System Integration → Long-term Support',
      'เน้นว่าเทคโนโลยีที่ดีต้องช่วยให้ธุรกิจทำงานได้ดีขึ้น เร็วขึ้น และแข่งขันได้มากขึ้น',
    ],
    [
      'Introduce Beat Protocol — a Technology & Digital Solutions Partner',
      'From warehouse management (WMS) and manufacturing to e-commerce platforms and system integration',
      'End to end: Business Analysis → Solution Design → Software Development → System Integration → Long-term Support',
      'Good technology should make the business work better, faster and more competitively',
    ],
    { minutes: 2 },
  ),
  s(
    3,
    'Sales Channel Challenges',
    [
      'ถามผู้ฟัง: ใครขายผ่าน Shopee / Lazada / TikTok Shop อยู่บ้าง?',
      'ปัญหาหลัก: พึ่งพา Marketplace มากเกินไป',
      'ต้นทุนสูงขึ้นจาก GP (Commission) และค่าธรรมเนียม ซึ่งกระทบกำไรโดยตรง',
      'ต้องทำตามกฎและเงื่อนไขของแพลตฟอร์ม ควบคุมหรือกำหนดเองไม่ได้',
    ],
    [
      'Ask the room: who sells on Shopee / Lazada / TikTok Shop today?',
      'The core problem: relying too much on marketplaces',
      'GP (commission) and fees keep rising and eat directly into profit',
      'You must follow the platform’s rules — you can’t control or set them yourself',
    ],
    { minutes: 2 },
  ),
  s(
    4,
    'Problems When Building Your Own Website',
    [
      'ถ้าสร้างเว็บเอง ต้องจัดการทุกอย่างด้วยตัวเอง: Hosting, ออกแบบเว็บ, Payment Gateway, Security, Shipping, Backup, Scalability, Maintenance',
      'ผลคือ หลายระบบ หลายผู้ให้บริการ ต้องดูแลเอง',
      'Shopify จัดการระบบหลักให้ทั้งหมด และเสริมความสามารถได้ด้วย Shopify App',
      'สรุป: โฟกัสสิ่งที่สำคัญกว่า — การขายและการเติบโตของธุรกิจ',
    ],
    [
      'Building your own site means handling everything: hosting, design, payment gateway, security, shipping, backup, scalability, maintenance',
      'The result: many systems, many vendors, all on you',
      'Shopify runs the core for you and extends with Shopify Apps',
      'Takeaway: focus on what matters — sales and growth',
    ],
    { minutes: 2 },
  ),
  s(
    5,
    'E-Commerce Website Options',
    [
      'มีหลายแพลตฟอร์มให้เลือก แต่ละตัวมีจุดเด่นและข้อจำกัดต่างกัน',
      'WordPress + WooCommerce: Open Source ยืดหยุ่นสูง แต่ต้องดูแล Hosting, Security, Updates และ Plugin เอง',
      'Magento: รองรับระบบซับซ้อนและปรับ Business Logic ได้มาก แต่ต้องใช้งบประมาณและทีม Technical',
      'ปูไปสู่สไลด์ถัดไป: แล้ว Shopify ต่างอย่างไร?',
    ],
    [
      'Many platforms exist — each with its own strengths and limits',
      'WordPress + WooCommerce: open source and flexible, but you maintain hosting, security, updates and plugins',
      'Magento: handles complex commerce and custom logic, but needs budget and a technical team',
      'Lead in: so how is Shopify different?',
    ],
    { minutes: 2 },
  ),
  s(
    6,
    'What is Shopify?',
    [
      'Shopify คือแพลตฟอร์มที่ช่วยให้สร้างร้านค้าออนไลน์และเริ่มขายสินค้าได้ง่ายขึ้น',
      'อธิบาย Flow: สินค้า → Shopify Store → ลูกค้า',
      'ครอบคลุม สร้างร้าน, ขายสินค้า, จัดการหลังบ้าน',
      'ไม่ต้องเริ่มเขียนเว็บเอง — Shopify เตรียมระบบ E-Commerce หลักไว้ให้แล้ว',
    ],
    [
      'Shopify is a platform that makes it easy to build an online store and start selling',
      'Explain the flow: products → Shopify Store → customers',
      'Covers building the store, selling, and back-office management',
      'No need to code a site from scratch — the e-commerce core is ready',
    ],
    { minutes: 2 },
  ),
  s(
    7,
    'What Can Shopify Do?',
    [
      'ฟีเจอร์หลักที่ใช้ในคอร์สนี้: Online Store, Products, Payments, Orders, Shipping, Analytics',
      'ฟีเจอร์เสริมที่ควรรู้: Markets, App Store',
      'สำหรับธุรกิจเฉพาะ: POS และ B2B (บางฟีเจอร์ขึ้นกับแพ็กเกจ)',
      'ย้ำว่าวันนี้โฟกัสที่การสร้างร้านและเริ่มขายสินค้า',
    ],
    [
      'Core features used in this course: Online Store, Products, Payments, Orders, Shipping, Analytics',
      'Good to know: Markets and the App Store',
      'For specific businesses: POS and B2B (some depend on the plan)',
      'Today’s focus: building the store and starting to sell',
    ],
    { minutes: 2 },
  ),
  s(
    9,
    'Shopify Architecture — 3 Main Layers',
    [
      '1) Storefront — หน้าร้าน: Homepage, Product Page, Collection, Cart, Checkout',
      '2) Commerce Core — หัวใจของร้าน: Products, Variants, Inventory, Orders, Customers, Discounts, Markets, Payments, Shipping',
      '3) Infrastructure — Server, Database, SSL, Security, Scaling, Backup',
      'คุณโฟกัสการสร้างร้านและการขาย ส่วนที่เหลือ Shopify ดูแลให้',
    ],
    [
      '1) Storefront: homepage, product page, collection, cart, checkout',
      '2) Commerce Core: products, variants, inventory, orders, customers, discounts, markets, payments, shipping',
      '3) Infrastructure: server, database, SSL, security, scaling, backup',
      'You focus on the store and sales — Shopify handles the rest',
    ],
    { minutes: 2 },
  ),
  s(
    10,
    'What Does Shopify Take Care Of?',
    [
      'คุณดูแล: สินค้า ราคา รูปภาพและเนื้อหา โปรโมชัน ลูกค้า คำสั่งซื้อ',
      'Shopify ดูแล: Hosting & Server, Security, Database, Performance, Backup & Recovery, Scalability',
      'You + Shopify = Online Business',
      'Shopify คือพาร์ทเนอร์ที่ช่วยให้สร้างร้านได้ง่าย ปลอดภัย และเติบโตได้อย่างยั่งยืน',
    ],
    [
      'You handle: products, pricing, images and content, promotions, customers, orders',
      'Shopify handles: hosting & servers, security, database, performance, backup & recovery, scalability',
      'You + Shopify = an online business',
      'Shopify is the partner that keeps it simple, secure and scalable',
    ],
    { minutes: 2 },
  ),
  s(
    11,
    'Shopify Plans',
    [
      'แนะนำแพ็กเกจ: Basic, Grow, Advanced, Shopify Plus',
      'แนะนำให้เริ่มจาก Basic แล้วอัปเกรดเมื่อธุรกิจเติบโต',
      'ชี้ความต่างหลัก: จำนวนบัญชีพนักงาน ค่าธรรมเนียม Third-party payment รายงาน และการสนับสนุน',
      'หมายเหตุ: ราคาและเงื่อนไขอาจเปลี่ยน — ตรวจสอบล่าสุดที่ shopify.com',
    ],
    [
      'Plans: Basic, Grow, Advanced, Shopify Plus',
      'Start with Basic and upgrade as you grow',
      'Main differences: staff accounts, third-party payment fees, reporting and support',
      'Note: prices and terms change — check shopify.com for the latest',
    ],
    { minutes: 2 },
  ),
  s(
    12,
    'Build Your Own Shopify Store in One Day',
    [
      'ภายใน 1 วัน คุณจะได้สร้าง Shopify Store ของตัวเอง ตั้งแต่เริ่มต้นจนเห็นภาพการขายครบ Flow',
      'วันนี้มี 6 หัวข้อ: สร้างร้าน, ตั้งค่าร้าน, Metafields, สินค้าและสต็อก, ออกแบบร้าน (Theme), ทดลองสั่งซื้อและจัดการคำสั่งซื้อ',
      'เป้าหมาย: สร้างร้าน Shopify ได้จริง และพร้อมนำไปต่อยอดใช้งานได้',
    ],
    [
      'In one day you’ll build your own Shopify store and see the full sales flow',
      'Six topics today: create store, store setup, metafields, products & inventory, theme, test orders & order management',
      'Goal: a real Shopify store you can keep building on',
    ],
    { minutes: 2 },
  ),
  s(
    13,
    'Hands-on Workshop Begins',
    [
      'เข้าสู่ช่วงลงมือทำ — เรียนรู้ ทดลอง สร้าง และพร้อมเปิดใช้งาน',
      'แจ้งผู้เข้าร่วมให้เปิดคู่มือนี้คู่กับ Shopify Admin',
      'ทบทวน 6 สิ่งที่จะทำ และย้ำว่าจบคอร์สจะได้ร้านค้าที่พร้อมใช้งาน',
    ],
    [
      'Time to get hands-on — learn, try, build, launch',
      'Ask participants to open this guide side by side with Shopify Admin',
      'Recap the six steps; by the end everyone has a working store',
    ],
    { minutes: 1, links: [{ label: 'Open workshop overview', to: '/' }] },
  ),
  s(
    14,
    '01 Create Store',
    [
      'เริ่มต้นเส้นทาง eCommerce ด้วยการสร้างร้านค้า Shopify ของคุณเอง',
      'ขั้นตอน: สมัครใช้งาน → สร้างร้านค้า → เลือกแผน → พร้อมใช้งาน',
      'สิ่งที่ได้: ร้านค้าใหม่ พร้อมเข้าใจภาพรวมการทำงานของ Shopify',
    ],
    [
      'Start the e-commerce journey by creating your own Shopify store',
      'Steps: sign up → create store → choose a plan → ready',
      'Outcome: a new store and an overview of how Shopify works',
    ],
    { minutes: 1, links: [{ label: 'Go to hands-on: Create Store', to: '/create-store' }] },
  ),
  s(
    15,
    '02 Store Setup',
    [
      'ตั้งค่าและเตรียมร้านให้พร้อมใช้งานอย่างมืออาชีพ',
      'หัวข้อ: Business Entities, Store Details, Create Market, Shipping and Delivery',
      'สิ่งที่ได้: ร้านค้าพร้อมรับคำสั่งซื้อจริง',
    ],
    [
      'Set up the store so it’s ready to run professionally',
      'Topics: Business Entities, Store Details, Create Market, Shipping and Delivery',
      'Outcome: a store that can take real orders',
    ],
    { minutes: 1, links: [{ label: 'Go to hands-on: Store Setup', to: '/store-setup' }] },
  ),
  s(
    16,
    '03 Metafields',
    [
      'เพิ่มข้อมูลเฉพาะให้สินค้าโดดเด่น — ข้อมูลที่ไม่มีในระบบมาตรฐาน',
      'หัวข้อ: Metafields Setting, Product Metafields, Page Text Metafields, Page Image Metafields',
      'สาธิต Prompt ของ Sidekick ที่ปุ่ม “Prompt สำหรับ Sidekick” ในคู่มือ',
      'ผลลัพธ์: ข้อมูลครบถ้วน แสดงผลสวยงาม ลูกค้าเชื่อมั่นมากขึ้น',
    ],
    [
      'Add custom data that the standard fields don’t cover',
      'Topics: Metafields setting, product metafields, page text metafields, page image metafields',
      'Demo the Sidekick prompt via the “Sidekick prompt” button in this guide',
      'Result: complete, well-presented information that builds customer trust',
    ],
    { minutes: 1, links: [{ label: 'Go to hands-on: Metafields', to: '/metafields' }] },
  ),
  s(
    17,
    '04 Products & Inventory',
    [
      'จัดการสินค้าและสต็อกอย่างมั่นใจ',
      'หัวข้อ: Create Product, Details & Pricing, Variants (Size / Color), Inventory (SKU, Quantity), Organization & Collections, Status & Publishing',
      'ผลลัพธ์: สินค้าและสต็อกถูกต้อง ร้านพร้อมขาย',
    ],
    [
      'Manage products and stock with confidence',
      'Topics: create product, details & pricing, variants (size/colour), inventory (SKU, quantity), organization & collections, status & publishing',
      'Result: accurate products and stock — ready to sell',
    ],
    {
      minutes: 1,
      links: [
        { label: 'Go to hands-on: Products', to: '/products' },
        { label: 'Go to hands-on: Inventory', to: '/inventory' },
      ],
    },
  ),
  s(
    18,
    '05 Themes',
    [
      'ออกแบบร้านค้าให้โดดเด่น สร้างประสบการณ์ที่ดีให้ลูกค้าตั้งแต่แรกเห็น',
      'หัวข้อ: Explore Shopify Themes, Customize Your Theme, Pages & Navigation, Publish & Preview',
      'ผลลัพธ์: ร้านค้าพร้อมใช้งานจริง สวยงาม น่าเชื่อถือ',
    ],
    [
      'Design a store that stands out and makes a great first impression',
      'Topics: explore Shopify themes, customize your theme, pages & navigation, publish & preview',
      'Result: a polished, trustworthy store ready to go live',
    ],
    { minutes: 1, links: [{ label: 'Go to hands-on: Theme', to: '/theme' }] },
  ),
  s(
    19,
    '06 Test Place Order & Order Management',
    [
      'เรียนรู้ขั้นตอนการสั่งซื้อ และการจัดการออเดอร์ในร้านของคุณ',
      'หัวข้อ: Test Place Order, Review Order, Process Order, Fulfillment & Shipping, Customer Notification',
      'ย้ำว่าเป็นการทดสอบด้วยช่องทางชำระเงินทดสอบ — ไม่มีการตัดเงินจริง',
      'ผลลัพธ์: จัดการออเดอร์ได้อย่างมั่นใจ พร้อมให้บริการลูกค้าได้จริง',
    ],
    [
      'Walk through placing an order and managing it in your store',
      'Topics: test place order, review order, process order, fulfillment & shipping, customer notification',
      'Stress that it uses the test gateway — no real money moves',
      'Result: confident order handling, ready to serve real customers',
    ],
    {
      minutes: 1,
      links: [
        { label: 'Go to hands-on: Payments & Test Order', to: '/payments' },
        { label: 'Go to hands-on: Order Fulfillment', to: '/orders' },
      ],
    },
  ),
  s(
    20,
    'Contact Us',
    ['ขอบคุณผู้เข้าร่วม และเปิดช่วงถาม-ตอบ', 'แจ้งช่องทางติดต่อ Beat Protocol: อีเมล โทรศัพท์ เว็บไซต์ Facebook และ YouTube'],
    ['Thank everyone and open the floor for Q&A', 'Share Beat Protocol’s contact channels: email, phone, website, Facebook and YouTube'],
    { minutes: 2 },
  ),
];

export const SLIDES: Slide[] = DECK.map((slide, i) => ({ ...slide, n: i + 1 }));
