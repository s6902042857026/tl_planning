// ============================================================
// Seed Script: ส่งข้อมูล KPI ขึ้น Supabase (ใช้ Node.js http/https โดยตรง)
// รันด้วย: node scripts/seed-supabase.mjs
// รองรับ Node.js 16+
// ============================================================

import https from 'https';

const SUPABASE_URL = 'https://vrjkzblojbbvclsjinhx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyamt6YmxvamJidmNsc2ppbmh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5NjAzNDMsImV4cCI6MjEwMjUzNjM0M30.mEolKkADEVXrGH8J5Vc-0xHFwdTx8VACSHD913YypmI';

// ---- Helper: POST to Supabase REST API ----
function supabaseUpsert(table, rows) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(rows);
    const options = {
      hostname: 'vrjkzblojbbvclsjinhx.supabase.co',
      path: `/rest/v1/${table}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'resolution=merge-duplicates,return=representation',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(data)); } catch { resolve([]); }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ---- Helper: GET test ----
function supabaseGet(table) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'vrjkzblojbbvclsjinhx.supabase.co',
      path: `/rest/v1/${table}?limit=1`,
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(data)); } catch { resolve([]); }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// ---- ข้อมูล Departments ----
const departments = [
  { id: 'dept_elec',      name: 'แผนกวิชาช่างไฟฟ้ากำลัง',             code: 'EE',   category: 'ช่างอุตสาหกรรม',    head_name: 'นายสมชาย ไฟฟ้า' },
  { id: 'dept_mech',      name: 'แผนกวิชาช่างยนต์',                   code: 'AT',   category: 'ช่างอุตสาหกรรม',    head_name: 'นายณรงค์ เครื่องกล' },
  { id: 'dept_it',        name: 'แผนกวิชาเทคโนโลยีสารสนเทศ',           code: 'IT',   category: 'เทคโนโลยีสารสนเทศ', head_name: 'ดร.กานต์ นวัตกรรม' },
  { id: 'dept_acc',       name: 'แผนกวิชาการบัญชี',                   code: 'AC',   category: 'พาณิชยกรรม',        head_name: 'นางกัญญารัตน์ การเงิน' },
  { id: 'dept_mkt',       name: 'แผนกวิชาการตลาดและดิจิทัล',           code: 'MK',   category: 'พาณิชยกรรม',        head_name: 'นางสาวพิมพา พาณิชย์' },
  { id: 'dept_food',      name: 'แผนกวิชาอาหารและโภชนาการ',            code: 'FD',   category: 'คหกรรมศาสตร์',      head_name: 'นางมาริสา เชฟดี' },
  { id: 'dept_con',       name: 'แผนกวิชาช่างก่อสร้างและโยธา',          code: 'CN',   category: 'ช่างอุตสาหกรรม',    head_name: 'นายวิชัย โยธาการ' },
  { id: 'dept_general',   name: 'แผนกวิชาสามัญสัมพันธ์',               code: 'GEN',  category: 'ศึกษาทั่วไป',       head_name: 'นายประเสริฐ สอนดี' },
  { id: 'dept_plan',      name: 'งานพัฒนายุทธศาสตร์และแผนงาน',          code: 'PLAN', category: 'ฝ่ายบริหาร',        head_name: 'นายอนุชา ยุทธศาสตร์' },
  { id: 'dept_qa',        name: 'งานประกันคุณภาพการศึกษา',              code: 'QA',   category: 'ฝ่ายบริหาร',        head_name: 'ดร.มงคล มาตรฐาน' },
  { id: 'dept_coop',      name: 'งานความร่วมมือและทวิภาคี',             code: 'COOP', category: 'ฝ่ายพัฒนากิจการ',   head_name: 'นายสุรชัย สัมพันธ์' },
  { id: 'dept_research',  name: 'งานส่งเสริมวิจัยและนวัตกรรม',          code: 'RES',  category: 'ฝ่ายวิชาการ',       head_name: 'ดร.วิจัย ประดิษฐ์' },
  { id: 'dept_incubator', name: 'ศูนย์บ่มเพาะผู้ประกอบการอาชีวศึกษา',  code: 'BIZ',  category: 'งานส่งเสริมธุรกิจ', head_name: 'นางสาววาสนา ธุรกิจก้าวหน้า' },
];

const kpiDomains = [
  { id: 'domain_1', code: 'D1', name: 'งานพัฒนายุทธศาสตร์ แผนงาน และงบประมาณ', short_name: 'ยุทธศาสตร์ & งบประมาณ', description: 'ศูนย์กลางการบริหารจัดการยุทธศาสตร์ แผนงาน และงบประมาณประจำปี', icon: 'Compass', target_score: 100, sort_order: 1 },
  { id: 'domain_2', code: 'D2', name: 'งานมาตรฐานและการประกันคุณภาพการศึกษา', short_name: 'มาตรฐาน & ประกันคุณภาพ', description: 'รับผิดชอบระบบประกันคุณภาพทั้งภายในและภายนอกสถานศึกษา', icon: 'ShieldCheck', target_score: 100, sort_order: 2 },
  { id: 'domain_3', code: 'D3', name: 'งานส่งเสริมการวิจัย นวัตกรรม และสิ่งประดิษฐ์', short_name: 'วิจัย & นวัตกรรม', description: 'จัดเก็บผลงานทางวิชาการ สิ่งประดิษฐ์ และนวัตกรรมของครูและนักเรียน', icon: 'Lightbulb', target_score: 100, sort_order: 3 },
  { id: 'domain_4', code: 'D4', name: 'งานศูนย์ดิจิทัลและสื่อสารองค์กร (สารสนเทศและ ICT)', short_name: 'ดิจิทัล & ICT', description: 'จัดเก็บข้อมูลพื้นฐานและฐานระบบสารสนเทศของสถานศึกษา', icon: 'Server', target_score: 100, sort_order: 4 },
  { id: 'domain_5', code: 'D5', name: 'งานติดตามและประเมินผลการอาชีวศึกษา', short_name: 'ติดตาม & ประเมินผล', description: 'ติดตามผู้สำเร็จการศึกษาและการประเมินความพึงพอใจ', icon: 'Users', target_score: 100, sort_order: 5 },
  { id: 'domain_6', code: 'D6', name: 'งานส่งเสริมธุรกิจและการเป็นผู้ประกอบการ', short_name: 'ส่งเสริมธุรกิจ & ผู้ประกอบการ', description: 'จัดเก็บโครงการ/ผลงานนวัตกรรมเชิงพาณิชย์ ศูนย์บ่มเพาะฯ และการหารายได้ระหว่างเรียน', icon: 'Store', target_score: 100, sort_order: 6 },
];

const kpiCategories = [
  { id: 'cat_1_1', domain_id: 'domain_1', name: 'เอกสารยุทธศาสตร์และแผนระยะยาว', sort_order: 1 },
  { id: 'cat_1_2', domain_id: 'domain_1', name: 'เอกสารแผนปฏิบัติราชการและโครงการ', sort_order: 2 },
  { id: 'cat_1_3', domain_id: 'domain_1', name: 'เอกสารสรุปผลและรายงานงบประมาณ', sort_order: 3 },
  { id: 'cat_2_1', domain_id: 'domain_2', name: 'เอกสารรายงานการประเมินตนเอง (SAR)', sort_order: 1 },
  { id: 'cat_2_2', domain_id: 'domain_2', name: 'เอกสารเกณฑ์มาตรฐานและประเมินคุณภาพ', sort_order: 2 },
  { id: 'cat_3_1', domain_id: 'domain_3', name: 'เอกสารวิจัยและนวัตกรรม', sort_order: 1 },
  { id: 'cat_3_2', domain_id: 'domain_3', name: 'เอกสารการประกวดและรางวัล', sort_order: 2 },
  { id: 'cat_4_1', domain_id: 'domain_4', name: 'ข้อมูลพื้นฐานสถานศึกษา (Basic Data)', sort_order: 1 },
  { id: 'cat_4_2', domain_id: 'domain_4', name: 'เอกสารพัฒนาระบบและประชาสัมพันธ์', sort_order: 2 },
  { id: 'cat_5_1', domain_id: 'domain_5', name: 'เอกสารติดตามผู้สำเร็จการศึกษา', sort_order: 1 },
  { id: 'cat_6_1', domain_id: 'domain_6', name: 'งานศูนย์บ่มเพาะและนวัตกรรมเชิงพาณิชย์', sort_order: 1 },
  { id: 'cat_6_2', domain_id: 'domain_6', name: 'โครงการหารายได้ระหว่างเรียนและความร่วมมือธุรกิจ', sort_order: 2 },
];

const kpis = [
  { id: 'kpi_1_1_1', category_id: 'cat_1_1', domain_id: 'domain_1', code: 'KPI-1.1.1', title: 'แผนพัฒนาการจัดการศึกษาของสถานศึกษา (3-5 ปี)', description: 'จัดทำและทบทวนแผนยุทธศาสตร์การพัฒนาสถานศึกษา ระยะ 3-5 ปี ให้สอดคล้องกับนโยบาย สอศ. และกระทรวงศึกษาธิการ', target_unit: 'เล่มแผนงาน', target_value: 1, frequency: 'ตามรอบแผน (3-5 ปี)', required_file_types: ['pdf', 'docx'] },
  { id: 'kpi_1_1_2', category_id: 'cat_1_1', domain_id: 'domain_1', code: 'KPI-1.1.2', title: 'กรอบยุทธศาสตร์ นโยบาย และเป้าหมายสถานศึกษา', description: 'เอกสารกำหนดกรอบยุทธศาสตร์ พันธกิจ วิสัยทัศน์ นโยบายเร่งด่วน และเป้าประสงค์ประจำปี', target_unit: 'ฉบับ', target_value: 1, frequency: 'รายปีงบประมาณ', required_file_types: ['pdf', 'docx'] },
  { id: 'kpi_1_2_1', category_id: 'cat_1_2', domain_id: 'domain_1', code: 'KPI-1.2.1', title: 'แบบเสนอโครงการประจำปีงบประมาณ (ข้อเสนอ/อนุมัติโครงการ)', description: 'ข้อเสนอโครงการตามแบบฟอร์ม สอศ. พร้อมการพิจารณาอนุมัติงบประมาณจากคณะกรรมการสถานศึกษา', target_unit: 'โครงการ', target_value: 45, frequency: 'รายปีงบประมาณ / รายภาคเรียน', required_file_types: ['pdf', 'docx', 'xlsx'] },
  { id: 'kpi_1_2_2', category_id: 'cat_1_2', domain_id: 'domain_1', code: 'KPI-1.2.2', title: 'แผนปฏิบัติราชการประจำปีงบประมาณ', description: 'เล่มแผนปฏิบัติราชการประจำปีงบประมาณที่ได้รับความเห็นชอบจากคณะกรรมการบริหารสถานศึกษา', target_unit: 'เล่มแผน', target_value: 1, frequency: 'รายปีงบประมาณ', required_file_types: ['pdf'] },
  { id: 'kpi_1_2_3', category_id: 'cat_1_2', domain_id: 'domain_1', code: 'KPI-1.2.3', title: 'เอกสารขอปรับแผน / ขออนุมัติโครงการเพิ่มเติม', description: 'แบบฟอร์มขอเปลี่ยนแปลงรายละเอียดโครงการ การโอนเปลี่ยนแปลงงบประมาณ หรือขออนุมัติโครงการเร่งด่วน', target_unit: 'ฉบับ', target_value: 10, frequency: 'ตามความจำเป็น', required_file_types: ['pdf', 'docx'] },
  { id: 'kpi_1_3_1', category_id: 'cat_1_3', domain_id: 'domain_1', code: 'KPI-1.3.1', title: 'รายงานผลการดำเนินงานตามโครงการ (เล่มสรุปโครงการ / สรุปผล PDCA)', description: 'รายงานผลสัมฤทธิ์โครงการ พร้อมภาพถ่ายกิจกรรม และแบบประเมินผลตามกระบวนการ PDCA', target_unit: 'เล่มสรุป', target_value: 45, frequency: 'หลังเสร็จสิ้นโครงการ (ภายใน 30 วัน)', required_file_types: ['pdf', 'docx', 'zip'] },
  { id: 'kpi_1_3_2', category_id: 'cat_1_3', domain_id: 'domain_1', code: 'KPI-1.3.2', title: 'สรุปผลการใช้จ่ายงบประมาณประจำปี', description: 'รายงานสถานะการเบิกจ่ายงบประมาณรายไตรมาสและสิ้นปีงบประมาณ เทียบกับเป้าหมายการใช้จ่าย', target_unit: 'รายงาน', target_value: 4, frequency: 'รายไตรมาส', required_file_types: ['pdf', 'xlsx'] },
  { id: 'kpi_1_3_3', category_id: 'cat_1_3', domain_id: 'domain_1', code: 'KPI-1.3.3', title: 'รายงานผลการติดตามและประเมินผลการปฏิบัติงานตามแผน', description: 'รายงานการกำกับติดตามความก้าวหน้าโครงการ ปัญหา อุปสรรค และข้อเสนอแนะเชิงนโยบาย', target_unit: 'ฉบับ', target_value: 2, frequency: 'รายภาคเรียน', required_file_types: ['pdf'] },
  { id: 'kpi_2_1_1', category_id: 'cat_2_1', domain_id: 'domain_2', code: 'KPI-2.1.1', title: 'รายงานการประเมินตนเองของสถานศึกษา (SAR สถานศึกษา)', description: 'รายงาน SAR ประจำปีของสถานศึกษา เพื่อเสนอต่อคณะกรรมการสถานศึกษาและ สอศ.', target_unit: 'เล่ม SAR', target_value: 1, frequency: 'รายปีการศึกษา', required_file_types: ['pdf'] },
  { id: 'kpi_2_1_2', category_id: 'cat_2_1', domain_id: 'domain_2', code: 'KPI-2.1.2', title: 'รายงานการประเมินตนเองของแผนกวิชา (SAR แผนกวิชา / Web SAR)', description: 'รายงานผลการดำเนินงานและร่องรอยการประกันคุณภาพของทุกแผนกวิชา', target_unit: 'แผนกวิชา', target_value: 12, frequency: 'รายปีการศึกษา', required_file_types: ['pdf', 'url'] },
  { id: 'kpi_2_1_3', category_id: 'cat_2_1', domain_id: 'domain_2', code: 'KPI-2.1.3', title: 'รายงานการประเมินตนเองรายบุคคลของครูผู้สอน (SAR บุคลากร)', description: 'รายงานผลการจัดการเรียนรู้ ผลสัมฤทธิ์ และภาระงานประจำปีของครูผู้สอนทุกคน', target_unit: 'คน', target_value: 85, frequency: 'รายปีการศึกษา', required_file_types: ['pdf'] },
  { id: 'kpi_2_2_1', category_id: 'cat_2_2', domain_id: 'domain_2', code: 'KPI-2.2.1', title: 'คู่มือ/เกณฑ์การประกันคุณภาพการศึกษาอาชีวศึกษา', description: 'คู่มือการประกันคุณภาพภายในและแนวทางการประเมินตามมาตรฐานการอาชีวศึกษา', target_unit: 'เล่มคู่มือ', target_value: 1, frequency: 'รายปีการศึกษา', required_file_types: ['pdf'] },
  { id: 'kpi_2_2_2', category_id: 'cat_2_2', domain_id: 'domain_2', code: 'KPI-2.2.2', title: 'หลักฐาน/ร่องรอยการประเมินมาตรฐานการอาชีวศึกษา (แยกตามตัวชี้วัด)', description: 'คลังเอกสารร่องรอยหลักฐานตาม 5 มาตรฐาน 25 ประเด็นการประเมินของ สอศ.', target_unit: 'ชุดหลักฐาน', target_value: 25, frequency: 'รายภาคเรียน', required_file_types: ['pdf', 'zip', 'url'] },
  { id: 'kpi_2_2_3', category_id: 'cat_2_2', domain_id: 'domain_2', code: 'KPI-2.2.3', title: 'รายงานการควบคุมภายใน และรายงานการประเมินคุณธรรมและความโปร่งใส (ITA)', description: 'รายงานผลการประเมินการควบคุมภายใน (ปค.4/ปค.5) และเอกสารเปิดเผยข้อมูลสาธารณะ OIT', target_unit: 'ชุดรายงาน', target_value: 2, frequency: 'รายปีงบประมาณ', required_file_types: ['pdf'] },
  { id: 'kpi_3_1_1', category_id: 'cat_3_1', domain_id: 'domain_3', code: 'KPI-3.1.1', title: 'รายงานการวิจัยในชั้นเรียน / วิจัยสถาบัน (ของครูผู้สอน)', description: 'งานวิจัยเพื่อพัฒนาการเรียนรู้ในชั้นเรียน หรือวิจัยสถาบันเพื่อพัฒนาระบบบริหารจัดการ', target_unit: 'เรื่อง', target_value: 40, frequency: 'รายปีการศึกษา', required_file_types: ['pdf', 'docx'] },
  { id: 'kpi_3_1_2', category_id: 'cat_3_1', domain_id: 'domain_3', code: 'KPI-3.1.2', title: 'ข้อเสนอและเล่มรายงานสิ่งประดิษฐ์/นวัตกรรมของนักเรียน นักศึกษา', description: 'เอกสารข้อเสนอโครงการ (Proposal) และเล่มรายงานสิ่งประดิษฐ์คนรุ่นใหม่ 5 ประเภท', target_unit: 'ผลงาน', target_value: 25, frequency: 'รายปีการศึกษา', required_file_types: ['pdf', 'docx'] },
  { id: 'kpi_3_1_3', category_id: 'cat_3_1', domain_id: 'domain_3', code: 'KPI-3.1.3', title: 'เอกสารขออนุญาต/จดสิทธิบัตร หรืออนุสิทธิบัตรผลงาน', description: 'เอกสารคำขอรับสิทธิบัตร/อนุสิทธิบัตร หรือลิขสิทธิ์ ต่อกรมทรัพย์สินทางปัญญา', target_unit: 'คำขอ', target_value: 5, frequency: 'รายปีงบประมาณ', required_file_types: ['pdf'] },
  { id: 'kpi_3_2_1', category_id: 'cat_3_2', domain_id: 'domain_3', code: 'KPI-3.2.1', title: 'ใบสมัคร และรายงานผลการแข่งขันทักษะวิชาชีพ / สิ่งประดิษฐ์', description: 'รายงานผลการเข้าร่วมประกวดแข่งขันทักษะวิชาชีพระดับ อศจ. / ระดับภาค / ระดับชาติ', target_unit: 'รายการ', target_value: 15, frequency: 'ตามรอบการแข่งขัน', required_file_types: ['pdf', 'docx'] },
  { id: 'kpi_3_2_2', category_id: 'cat_3_2', domain_id: 'domain_3', code: 'KPI-3.2.2', title: 'หลักฐานเกียรติบัตร/รางวัลของสถานศึกษา ครู และนักเรียน', description: 'สำเนาเกียรติบัตร โล่รางวัล หรือหนังสือรับรองรางวัลระดับจังหวัด ภาค ชาติ และนานาชาติ', target_unit: 'รางวัล', target_value: 30, frequency: 'ตลอดปีการศึกษา', required_file_types: ['pdf', 'jpg', 'png'] },
  { id: 'kpi_4_1_1', category_id: 'cat_4_1', domain_id: 'domain_4', code: 'KPI-4.1.1', title: 'ข้อมูลครุภัณฑ์ สิ่งก่อสร้าง อาคารสถานที่ ห้องเรียน และห้องปฏิบัติการ', description: 'ฐานข้อมูลสินทรัพย์ ครุภัณฑ์การศึกษา อาคารสถานที่ และระบบสาธารณูปโภคประจำปี', target_unit: 'ฐานข้อมูล', target_value: 1, frequency: 'รายภาคเรียน', required_file_types: ['pdf', 'xlsx'] },
  { id: 'kpi_4_1_2', category_id: 'cat_4_1', domain_id: 'domain_4', code: 'KPI-4.1.2', title: 'สถิติข้อมูลนักเรียน นักศึกษา และข้อมูลบุคลากร', description: 'สถิติจำนวนนักเรียน นักศึกษาจำแนกตามสาขาวิชา/ชั้นปี (10 มิ.ย./10 พ.ย.) และสถิติกำลังคน', target_unit: 'ชุดข้อมูล', target_value: 2, frequency: 'รายภาคเรียน (10 มิ.ย./10 พ.ย.)', required_file_types: ['pdf', 'xlsx'] },
  { id: 'kpi_4_2_1', category_id: 'cat_4_2', domain_id: 'domain_4', code: 'KPI-4.2.1', title: 'รายงานระบบสารสนเทศติดตามผล (v-cop / Data Center)', description: 'รายงานการนำเข้าและปรับปรุงข้อมูลในระบบ v-cop, RMS, และฐานข้อมูล สอศ.', target_unit: 'รายงาน', target_value: 4, frequency: 'รายไตรมาส', required_file_types: ['pdf', 'xlsx'] },
  { id: 'kpi_4_2_2', category_id: 'cat_4_2', domain_id: 'domain_4', code: 'KPI-4.2.2', title: 'เอกสารเกี่ยวกับการพัฒนาระบบเครือข่าย เว็บไซต์ และสื่อดิจิทัลของวิทยาลัย', description: 'แผนพัฒนาระบบเครือข่ายคอมพิวเตอร์ สถิติการเข้าชมเว็บไซต์ และรายงานสื่อดิจิทัลประชาสัมพันธ์', target_unit: 'รายงาน', target_value: 2, frequency: 'รายภาคเรียน', required_file_types: ['pdf', 'url'] },
  { id: 'kpi_5_1_1', category_id: 'cat_5_1', domain_id: 'domain_5', code: 'KPI-5.1.1', title: 'รายงานการติดตามผู้สำเร็จการศึกษา (การมีงานทำ / การศึกษาต่อ)', description: 'รายงานภาวะการมีงานทำและการศึกษาต่อของผู้สำเร็จการศึกษาระดับ ปวช. และ ปวส.', target_unit: 'ฉบับรายงาน', target_value: 1, frequency: 'รายปีการศึกษา', required_file_types: ['pdf', 'xlsx'] },
  { id: 'kpi_5_1_2', category_id: 'cat_5_1', domain_id: 'domain_5', code: 'KPI-5.1.2', title: 'แบบสำรวจความพึงพอใจของผู้ใช้ผู้สำเร็จการศึกษา (สถานประกอบการ)', description: 'ผลการประเมินสมรรถนะและความพึงพอใจของนายจ้าง/สถานประกอบการต่อผู้สำเร็จการศึกษา', target_unit: 'รายงานผล', target_value: 1, frequency: 'รายปีการศึกษา', required_file_types: ['pdf', 'xlsx'] },
  { id: 'kpi_6_1_1', category_id: 'cat_6_1', domain_id: 'domain_6', code: 'KPI-6.1.1', title: 'เอกสารรายงานผลการดำเนินงานศูนย์ส่งเสริมการเป็นผู้ประกอบการ (ศูนย์บ่มเพาะฯ)', description: 'รายงานผลการบ่มเพาะธุรกิจนักศึกษา แผนธุรกิจ และการประเมินศูนย์บ่มเพาะระดับภาค/ชาติ', target_unit: 'เล่มสรุป', target_value: 1, frequency: 'รายปีการศึกษา', required_file_types: ['pdf', 'docx'] },
  { id: 'kpi_6_1_2', category_id: 'cat_6_1', domain_id: 'domain_6', code: 'KPI-6.1.2', title: 'โครงการ/ผลงานนวัตกรรมเชิงพาณิชย์ (Commercial Innovation)', description: 'รายงานผลงานสิ่งประดิษฐ์และนวัตกรรมที่มีการต่อยอดสู่การผลิตหรือจำหน่ายเชิงพาณิชย์จริง', target_unit: 'โครงการ', target_value: 5, frequency: 'รายปีการศึกษา', required_file_types: ['pdf', 'docx', 'xlsx'] },
  { id: 'kpi_6_2_1', category_id: 'cat_6_2', domain_id: 'domain_6', code: 'KPI-6.2.1', title: 'เอกสารโครงการส่งเสริมการหารายได้ระหว่างเรียนของนักเรียน นักศึกษา', description: 'รายงานการดำเนินงานโครงการฝึกประสบการณ์สร้างรายได้ระหว่างเรียนและการประกอบอาชีพอิสระ', target_unit: 'โครงการ', target_value: 10, frequency: 'รายภาคเรียน', required_file_types: ['pdf', 'xlsx'] },
  { id: 'kpi_6_2_2', category_id: 'cat_6_2', domain_id: 'domain_6', code: 'KPI-6.2.2', title: 'บันทึกความเข้าใจ (MOU) และความร่วมมือทางธุรกิจกับสถานประกอบการ', description: 'เอกสารข้อตกลงความร่วมมือในการพัฒนาทักษะอาชีพ การฝึกงาน และการส่งเสริมธุรกิจกับภาคเอกชน', target_unit: 'ฉบับ MOU', target_value: 20, frequency: 'ตลอดปีงบประมาณ', required_file_types: ['pdf'] },
];

// ======================================================
// Main Seed Function
// ======================================================
async function seed() {
  console.log('🚀 เริ่มต้น Seed ข้อมูลขึ้น Supabase...\n');
  console.log('🔗 URL:', SUPABASE_URL);

  // 1. Test connection
  console.log('\n🔌 ทดสอบการเชื่อมต่อ...');
  try {
    const result = await supabaseGet('kpi_domains');
    console.log('✅ เชื่อมต่อ Supabase สำเร็จ\n');
  } catch (err) {
    console.error('❌ ไม่สามารถเชื่อมต่อ Supabase:', err.message);
    console.log('\n📋 กรุณาตรวจสอบ:');
    console.log('   1. รัน schema.sql ใน Supabase Dashboard > SQL Editor ก่อน');
    console.log('   2. ตรวจสอบ API key ใน .env.local');
    process.exit(1);
  }

  // 2. departments
  console.log(`📦 Seed departments (${departments.length} rows)...`);
  try {
    await supabaseUpsert('departments', departments);
    console.log(`  ✅ departments: ${departments.length} rows`);
  } catch (e) { console.error('  ❌ departments:', e.message); }

  // 3. kpi_domains
  console.log(`📦 Seed kpi_domains (${kpiDomains.length} rows)...`);
  try {
    await supabaseUpsert('kpi_domains', kpiDomains);
    console.log(`  ✅ kpi_domains: ${kpiDomains.length} rows`);
  } catch (e) { console.error('  ❌ kpi_domains:', e.message); }

  // 4. kpi_categories
  console.log(`📦 Seed kpi_categories (${kpiCategories.length} rows)...`);
  try {
    await supabaseUpsert('kpi_categories', kpiCategories);
    console.log(`  ✅ kpi_categories: ${kpiCategories.length} rows`);
  } catch (e) { console.error('  ❌ kpi_categories:', e.message); }

  // 5. kpis
  console.log(`📦 Seed kpis (${kpis.length} rows)...`);
  try {
    await supabaseUpsert('kpis', kpis);
    console.log(`  ✅ kpis: ${kpis.length} rows`);
  } catch (e) { console.error('  ❌ kpis:', e.message); }

  console.log('\n' + '='.repeat(60));
  console.log('🎉 Seed เสร็จสมบูรณ์!');
  console.log('='.repeat(60));
  console.log(`  departments   : ${departments.length}`);
  console.log(`  kpi_domains   : ${kpiDomains.length}`);
  console.log(`  kpi_categories: ${kpiCategories.length}`);
  console.log(`  kpis          : ${kpis.length}`);
  console.log('\n✅ เปิด App → Footer ควรแสดงจุดเขียว "Supabase Database Connected"');
}

seed().catch(err => {
  console.error('❌ เกิดข้อผิดพลาด:', err);
  process.exit(1);
});
