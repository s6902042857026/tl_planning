# 📊 ระบบติดตามตัวชี้วัด ฝ่ายยุทธศาสตร์และแผนงาน (TTC Planning KPI System)
### สังกัดสำนักงานคณะกรรมการการอาชีวศึกษา (สอศ.)

เว็บแอปพลิเคชันสำหรับการกำกับ ติดตาม และประเมินผลสัมฤทธิ์ตัวชี้วัด 5 ด้านหลัก ของสถานศึกษาอาชีวศึกษา รองรับการแสดงผลบนจอภาพขนาดใหญ่ (ทีวี / โปรเจคเตอร์ สำหรับห้องประชุม), แท็บเล็ต และสมาร์ตโฟน (Responsive ทุก Device) ด้วยฟอนต์ **Kanit** สไตล์ Modern Clean Light Theme

---

## 🌟 จุดเด่นและฟังก์ชันการทำงาน (Key Features)

### 1. โครงสร้างตัวชี้วัด 5 ด้านหลัก (5 Core Strategic Domains)
1. 🧭 **งานพัฒนายุทธศาสตร์ แผนงาน และงบประมาณ**: แผนพัฒนาการศึกษา 3-5 ปี, กรอบยุทธศาสตร์, แบบเสนอโครงการ, แผนปฏิบัติราชการ, PDCA, งบประมาณตามแผน vs จ่ายจริง
2. 🛡️ **งานมาตรฐานและการประกันคุณภาพการศึกษา**: SAR สถานศึกษา, SAR แผนกวิชา (Web SAR), SAR บุคลากร, ร่องรอยตัวชี้วัด สอศ., ควบคุมภายใน และ ITA
3. 💡 **งานส่งเสริมการวิจัย นวัตกรรม และสิ่งประดิษฐ์**: วิจัยในชั้นเรียน/วิจัยสถาบัน, สิ่งประดิษฐ์คนรุ่นใหม่, สิทธิบัตร/อนุสิทธิบัตร, การแข่งขันทักษะวิชาชีพ และรางวัลเชิดชูเกียรติ
4. 🖥️ **งานศูนย์ดิจิทัลและสื่อสารองค์กร (สารสนเทศและ ICT)**: ข้อมูลพื้นฐานสถานศึกษา (ครุภัณฑ์, อาคาร, ห้องเรียน, สถิตินักศึกษา/บุคลากร), ระบบ v-cop, Data Center
5. 👥 **งานติดตาม ประเมินผล และความร่วมมือ / ผู้ประกอบการ**: รายงานการมีงานทำ/ศึกษาต่อ, แบบสำรวจความพึงพอใจนายจ้าง, บันทึกข้อตกลงความร่วมมือ (MOU), ศูนย์บ่มเพาะผู้ประกอบการ

---

### 2. ระบบสิทธิ์ 3 บทบาทตาม Use Case Diagram
* 👤 **ผู้ใช้งานทั่วไป (General User: ครู / แผนก / นักเรียน / บุคลากร)**:
  - เข้าสู่ระบบ
  - อัปโหลดเอกสาร / รายงานตัวชี้วัด (ระบุงบประมาณ, แนบไฟล์ PDF/Docs/Links, ขั้นตอน PDCA)
  - ตรวจสอบสถานะการส่งงาน (รอตรวจ ⏳, อนุมัติ ✅, ให้แก้ไข ⚠️)
* 🛡️ **เจ้าหน้าที่ฝ่ายยุทธศาสตร์ฯ (Admin / Strategic Officer)**:
  - ตรวจสอบและอนุมัติเอกสาร (Approve / Reject / Request revision พร้อมระบุคะแนน 0-100 และข้อเสนอแนะ)
  - ติดตามและคัดกรองผู้ยังไม่ส่งงาน (Missing Submissions Tracker พร้อมระบบส่งแจ้งเตือนเร่งรัด)
  - จัดการหมวดหมู่ตัวชี้วัด (KPI Master Data Manager)
* 👑 **ผู้บริหาร (Executive)**:
  - ดูแดชบอร์ดภาพรวม (% Total Completion Rate, กราฟ 5 หมวดงาน, ประสิทธิภาพการเบิกจ่ายงบประมาณ)
  - ดูรายงานสรุปผลสัมฤทธิ์ตามวงจร PDCA, คลังรางวัลเกียรติยศ และ MOU
  - ส่งออกรายงานราชการ (Export PDF ตามแบบ สอศ., Excel .xlsx, CSV, สั่งพิมพ์)

---

### 3. โหมดฉายจอทีวีและโปรเจคเตอร์ (TV / Projector Presentation Mode)
- ออกแบบเฉพาะสำหรับห้องประชุมสัมมนาและจอทีวี Display Board
- ตัวเลขสถิติขนาดใหญ่พิเศษ คอนทราสต์สูง อ่านง่ายจากระยะไกล
- ระบบหมุนเวียนสไลด์ตัวชี้วัด 5 ด้านอัตโนมัติ (Auto-cycling Slides) พร้อมนาฬิกาดิจิทัลเรียลไทม์
- แถบข่าวความก้าวหน้าล่าสุด (Live Status Ticker)

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend**: React 18, Vite, Tailwind CSS (Font Kanit & Sarabun)
- **Icons**: Lucide React
- **Data Visualizations**: Recharts (Bar Charts, Donut PDCA, Radial meters)
- **Export Engines**: jsPDF, jspdf-autotable, SheetJS (xlsx)
- **Database Backend**: **Supabase** (PostgreSQL) พร้อมระบบออฟไลน์ / LocalStorage Fallback อัจฉริยะ
- **Deployment**: **Vercel** (`vercel.json`)

---

## 🚀 วิธีการติดตั้งและรันในเครื่อง (Local Setup)

```bash
# 1. ติดตั้ง Dependencies
npm install

# 2. เริ่มต้น Dev Server
npm run dev

# 3. สร้าง Production Build
npm run build
```

---

## 🗄️ การตั้งค่าฐานข้อมูล Supabase (Supabase Setup)

1. เข้าไปที่ [Supabase Dashboard](https://supabase.com) แล้วสร้างโปรเจกต์ใหม่
2. ไปที่เมนู **SQL Editor** แล้วคัดลอกคำสั่งทั้งหมดในไฟล์ `supabase/schema.sql` มาวางและกด **Run**
3. ไปที่ **Project Settings > API** แล้วนำค่า URL และ Anon Key มาสร้างไฟล์ `.env.local`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. ระบบจะเชื่อมต่อกับ Supabase อัตโนมัติ โดยมีระบบ LocalStorage Fallback ให้ใช้งานได้ทันทีแม้ยังไม่ได้ต่อฐานข้อมูล

---

## ☁️ การ Deploy บน Vercel

โปรเจกต์นี้ได้รับการตั้งค่า `vercel.json` และ build command พร้อมสำหรับการ Deploy บน Vercel ทันที:
1. Push โค้ดขึ้น GitHub
2. ไปที่ [Vercel](https://vercel.com) แล้วกด **Add New Project** -> เลือก GitHub Repository `tl_planning`
3. ตั้งค่า Framework Preset เป็น **Vite**
4. (ตัวเลือก) ระบุ Environment Variables `VITE_SUPABASE_URL` และ `VITE_SUPABASE_ANON_KEY`
5. กด **Deploy**
