/**
 * โครงสร้างตัวชี้วัด 6 ด้านหลัก ฝ่ายยุทธศาสตร์และแผนงาน สังกัดสำนักงานคณะกรรมการการอาชีวศึกษา (สอศ.)
 * อ้างอิงตามข้อกำหนดใน KPI_App.txt (วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์)
 */

export const KPI_DOMAINS = [
  {
    id: 'domain_1',
    code: 'D1',
    name: 'งานพัฒนายุทธศาสตร์ แผนงาน และงบประมาณ',
    shortName: 'ยุทธศาสตร์ & งบประมาณ',
    description: 'ศูนย์กลางการบริหารจัดการยุทธศาสตร์ แผนงาน และงบประมาณประจำปี',
    icon: 'Compass',
    color: 'from-blue-600 to-indigo-700',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    targetScore: 100,
    categories: [
      {
        id: 'cat_1_1',
        name: 'เอกสารยุทธศาสตร์และแผนระยะยาว',
        kpis: [
          {
            id: 'kpi_1_1_1',
            code: 'KPI-1.1.1',
            title: 'แผนพัฒนาการจัดการศึกษาของสถานศึกษา (3-5 ปี)',
            description: 'จัดทำและทบทวนแผนยุทธศาสตร์การพัฒนาสถานศึกษา ระยะ 3-5 ปี ให้สอดคล้องกับนโยบาย สอศ. และกระทรวงศึกษาธิการ',
            requiredFileTypes: ['pdf', 'docx'],
            targetUnit: 'เล่มแผนงาน',
            targetValue: 1,
            frequency: 'ตามรอบแผน (3-5 ปี)',
            responsibleRoles: ['ฝ่ายแผนงาน', 'หัวหน้างานแผนฯ']
          },
          {
            id: 'kpi_1_1_2',
            code: 'KPI-1.1.2',
            title: 'กรอบยุทธศาสตร์ นโยบาย และเป้าหมายสถานศึกษา',
            description: 'เอกสารกำหนดกรอบยุทธศาสตร์ พันธกิจ วิสัยทัศน์ นโยบายเร่งด่วน และเป้าประสงค์ประจำปี',
            requiredFileTypes: ['pdf', 'docx'],
            targetUnit: 'ฉบับ',
            targetValue: 1,
            frequency: 'รายปีงบประมาณ',
            responsibleRoles: ['ฝ่ายแผนงาน']
          }
        ]
      },
      {
        id: 'cat_1_2',
        name: 'เอกสารแผนปฏิบัติราชการและโครงการ',
        kpis: [
          {
            id: 'kpi_1_2_1',
            code: 'KPI-1.2.1',
            title: 'แบบเสนอโครงการประจำปีงบประมาณ (ข้อเสนอ/อนุมัติโครงการ)',
            description: 'ข้อเสนอโครงการตามแบบฟอร์ม สอศ. พร้อมการพิจารณาอนุมัติงบประมาณจากคณะกรรมการสถานศึกษา',
            requiredFileTypes: ['pdf', 'docx', 'xlsx'],
            targetUnit: 'โครงการ',
            targetValue: 45,
            frequency: 'รายปีงบประมาณ / รายภาคเรียน',
            responsibleRoles: ['ทุกแผนกวิชา / ทุกงาน']
          },
          {
            id: 'kpi_1_2_2',
            code: 'KPI-1.2.2',
            title: 'แผนปฏิบัติราชการประจำปีงบประมาณ',
            description: 'เล่มแผนปฏิบัติราชการประจำปีงบประมาณที่ได้รับความเห็นชอบจากคณะกรรมการบริหารสถานศึกษา',
            requiredFileTypes: ['pdf'],
            targetUnit: 'เล่มแผน',
            targetValue: 1,
            frequency: 'รายปีงบประมาณ',
            responsibleRoles: ['ฝ่ายแผนงาน']
          },
          {
            id: 'kpi_1_2_3',
            code: 'KPI-1.2.3',
            title: 'เอกสารขอปรับแผน / ขออนุมัติโครงการเพิ่มเติม',
            description: 'แบบฟอร์มขอเปลี่ยนแปลงรายละเอียดโครงการ การโอนเปลี่ยนแปลงงบประมาณ หรือขออนุมัติโครงการเร่งด่วน',
            requiredFileTypes: ['pdf', 'docx'],
            targetUnit: 'ฉบับ',
            targetValue: 10,
            frequency: 'ตามความจำเป็น',
            responsibleRoles: ['ผู้รับผิดชอบโครงการ']
          }
        ]
      },
      {
        id: 'cat_1_3',
        name: 'เอกสารสรุปผลและรายงานงบประมาณ',
        kpis: [
          {
            id: 'kpi_1_3_1',
            code: 'KPI-1.3.1',
            title: 'รายงานผลการดำเนินงานตามโครงการ (เล่มสรุปโครงการ / สรุปผล PDCA)',
            description: 'รายงานผลสัมฤทธิ์โครงการ พร้อมภาพถ่ายกิจกรรม และแบบประเมินผลตามกระบวนการ PDCA',
            requiredFileTypes: ['pdf', 'docx', 'zip'],
            targetUnit: 'เล่มสรุป',
            targetValue: 45,
            frequency: 'หลังเสร็จสิ้นโครงการ (ภายใน 30 วัน)',
            responsibleRoles: ['ทุกแผนกวิชา / ผู้จัดทำโครงการ']
          },
          {
            id: 'kpi_1_3_2',
            code: 'KPI-1.3.2',
            title: 'สรุปผลการใช้จ่ายงบประมาณประจำปี',
            description: 'รายงานสถานะการเบิกจ่ายงบประมาณรายไตรมาสและสิ้นปีงบประมาณ เทียบกับเป้าหมายการใช้จ่าย',
            requiredFileTypes: ['pdf', 'xlsx'],
            targetUnit: 'รายงาน',
            targetValue: 4,
            frequency: 'รายไตรมาส',
            responsibleRoles: ['งานการเงิน / งานแผนฯ']
          },
          {
            id: 'kpi_1_3_3',
            code: 'KPI-1.3.3',
            title: 'รายงานผลการติดตามและประเมินผลการปฏิบัติงานตามแผน',
            description: 'รายงานการกำกับติดตามความก้าวหน้าโครงการ ปัญหา อุปสรรค และข้อเสนอแนะเชิงนโยบาย',
            requiredFileTypes: ['pdf'],
            targetUnit: 'ฉบับ',
            targetValue: 2,
            frequency: 'รายภาคเรียน',
            responsibleRoles: ['คณะกรรมการติดตามประเมินผล']
          }
        ]
      }
    ]
  },
  {
    id: 'domain_2',
    code: 'D2',
    name: 'งานมาตรฐานและการประกันคุณภาพการศึกษา',
    shortName: 'มาตรฐาน & ประกันคุณภาพ',
    description: 'รับผิดชอบระบบประกันคุณภาพทั้งภายในและภายนอกสถานศึกษาตามมาตรฐาน สอศ.',
    icon: 'ShieldCheck',
    color: 'from-emerald-600 to-teal-700',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    targetScore: 100,
    categories: [
      {
        id: 'cat_2_1',
        name: 'เอกสารรายงานการประเมินตนเอง (SAR)',
        kpis: [
          {
            id: 'kpi_2_1_1',
            code: 'KPI-2.1.1',
            title: 'รายงานการประเมินตนเองของสถานศึกษา (SAR สถานศึกษา)',
            description: 'รายงาน SAR ประจำปีของสถานศึกษา เพื่อเสนอต่อคณะกรรมการสถานศึกษาและ สอศ.',
            requiredFileTypes: ['pdf'],
            targetUnit: 'เล่ม SAR',
            targetValue: 1,
            frequency: 'รายปีการศึกษา',
            responsibleRoles: ['งานประกันคุณภาพการศึกษา']
          },
          {
            id: 'kpi_2_1_2',
            code: 'KPI-2.1.2',
            title: 'รายงานการประเมินตนเองของแผนกวิชา (SAR แผนกวิชา / Web SAR)',
            description: 'รายงานผลการดำเนินงานและร่องรอยการประกันคุณภาพของทุกแผนกวิชา',
            requiredFileTypes: ['pdf', 'url'],
            targetUnit: 'แผนกวิชา',
            targetValue: 12,
            frequency: 'รายปีการศึกษา',
            responsibleRoles: ['หัวหน้าแผนกวิชาทุกแผนก']
          },
          {
            id: 'kpi_2_1_3',
            code: 'KPI-2.1.3',
            title: 'รายงานการประเมินตนเองรายบุคคลของครูผู้สอน (SAR บุคลากร)',
            description: 'รายงานผลการจัดการเรียนรู้ ผลสัมฤทธิ์ และภาระงานประจำปีของครูผู้สอนทุกคน',
            requiredFileTypes: ['pdf'],
            targetUnit: 'คน',
            targetValue: 85,
            frequency: 'รายปีการศึกษา',
            responsibleRoles: ['ครูและบุคลากรทางการศึกษา']
          }
        ]
      },
      {
        id: 'cat_2_2',
        name: 'เอกสารเกณฑ์มาตรฐานและประเมินคุณภาพ',
        kpis: [
          {
            id: 'kpi_2_2_1',
            code: 'KPI-2.2.1',
            title: 'คู่มือ/เกณฑ์การประกันคุณภาพการศึกษาอาชีวศึกษา',
            description: 'คู่มือการประกันคุณภาพภายในและแนวทางการประเมินตามมาตรฐานการอาชีวศึกษา',
            requiredFileTypes: ['pdf'],
            targetUnit: 'เล่มคู่มือ',
            targetValue: 1,
            frequency: 'รายปีการศึกษา',
            responsibleRoles: ['งานประกันคุณภาพ']
          },
          {
            id: 'kpi_2_2_2',
            code: 'KPI-2.2.2',
            title: 'หลักฐาน/ร่องรอยการประเมินมาตรฐานการอาชีวศึกษา (แยกตามตัวชี้วัด)',
            description: 'คลังเอกสารร่องรอยหลักฐานตาม 5 มาตรฐาน 25 ประเด็นการประเมินของ สอศ.',
            requiredFileTypes: ['pdf', 'zip', 'url'],
            targetUnit: 'ชุดหลักฐาน',
            targetValue: 25,
            frequency: 'รายภาคเรียน',
            responsibleRoles: ['ผู้รับผิดชอบมาตรฐาน']
          },
          {
            id: 'kpi_2_2_3',
            code: 'KPI-2.2.3',
            title: 'รายงานการควบคุมภายใน และรายงานการประเมินคุณธรรมและความโปร่งใส (ITA)',
            description: 'รายงานผลการประเมินการควบคุมภายใน (ปค.4/ปค.5) และเอกสารเปิดเผยข้อมูลสาธารณะ OIT',
            requiredFileTypes: ['pdf'],
            targetUnit: 'ชุดรายงาน',
            targetValue: 2,
            frequency: 'รายปีงบประมาณ',
            responsibleRoles: ['คณะทำงาน ITA / ควบคุมภายใน']
          }
        ]
      }
    ]
  },
  {
    id: 'domain_3',
    code: 'D3',
    name: 'งานส่งเสริมการวิจัย นวัตกรรม และสิ่งประดิษฐ์',
    shortName: 'วิจัย & นวัตกรรม',
    description: 'จัดเก็บผลงานทางวิชาการ สิ่งประดิษฐ์ และนวัตกรรมของครูและนักเรียน นักศึกษา',
    icon: 'Lightbulb',
    color: 'from-amber-500 to-orange-600',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    targetScore: 100,
    categories: [
      {
        id: 'cat_3_1',
        name: 'เอกสารวิจัยและนวัตกรรม',
        kpis: [
          {
            id: 'kpi_3_1_1',
            code: 'KPI-3.1.1',
            title: 'รายงานการวิจัยในชั้นเรียน / วิจัยสถาบัน (ของครูผู้สอน)',
            description: 'งานวิจัยเพื่อพัฒนาการเรียนรู้ในชั้นเรียน หรือวิจัยสถาบันเพื่อพัฒนาระบบบริหารจัดการ',
            requiredFileTypes: ['pdf', 'docx'],
            targetUnit: 'เรื่อง',
            targetValue: 40,
            frequency: 'รายปีการศึกษา',
            responsibleRoles: ['ครูผู้สอนทุกคน']
          },
          {
            id: 'kpi_3_1_2',
            code: 'KPI-3.1.2',
            title: 'ข้อเสนอและเล่มรายงานสิ่งประดิษฐ์/นวัตกรรมของนักเรียน นักศึกษา',
            description: 'เอกสารข้อเสนอโครงการ (Proposal) และเล่มรายงานสิ่งประดิษฐ์คนรุ่นใหม่ 5 ประเภท',
            requiredFileTypes: ['pdf', 'docx'],
            targetUnit: 'ผลงาน',
            targetValue: 25,
            frequency: 'รายปีการศึกษา',
            responsibleRoles: ['ครูที่ปรึกษา / นักเรียน']
          },
          {
            id: 'kpi_3_1_3',
            code: 'KPI-3.1.3',
            title: 'เอกสารขออนุญาต/จดสิทธิบัตร หรืออนุสิทธิบัตรผลงาน',
            description: 'เอกสารคำขอรับสิทธิบัตร/อนุสิทธิบัตร หรือลิขสิทธิ์ ต่อกรมทรัพย์สินทางปัญญา',
            requiredFileTypes: ['pdf'],
            targetUnit: 'คำขอ',
            targetValue: 5,
            frequency: 'รายปีงบประมาณ',
            responsibleRoles: ['งานวิจัยและสิ่งประดิษฐ์']
          }
        ]
      },
      {
        id: 'cat_3_2',
        name: 'เอกสารการประกวดและรางวัล',
        kpis: [
          {
            id: 'kpi_3_2_1',
            code: 'KPI-3.2.1',
            title: 'ใบสมัคร และรายงานผลการแข่งขันทักษะวิชาชีพ / สิ่งประดิษฐ์',
            description: 'รายงานผลการเข้าร่วมประกวดแข่งขันทักษะวิชาชีพระดับ อศจ. / ระดับภาค / ระดับชาติ',
            requiredFileTypes: ['pdf', 'docx'],
            targetUnit: 'รายการ',
            targetValue: 15,
            frequency: 'ตามรอบการแข่งขัน',
            responsibleRoles: ['หัวหน้าแผนก / ครูผู้ควบคุม']
          },
          {
            id: 'kpi_3_2_2',
            code: 'KPI-3.2.2',
            title: 'หลักฐานเกียรติบัตร/รางวัลของสถานศึกษา ครู และนักเรียน',
            description: 'สำเนาเกียรติบัตร โล่รางวัล หรือหนังสือรับรองรางวัลระดับจังหวัด ภาค ชาติ และนานาชาติ',
            requiredFileTypes: ['pdf', 'jpg', 'png'],
            targetUnit: 'รางวัล',
            targetValue: 30,
            frequency: 'ตลอดปีการศึกษา',
            responsibleRoles: ['ครู / นักเรียน / ทุกแผนก']
          }
        ]
      }
    ]
  },
  {
    id: 'domain_4',
    code: 'D4',
    name: 'งานศูนย์ดิจิทัลและสื่อสารองค์กร (สารสนเทศและ ICT)',
    shortName: 'ดิจิทัล & ICT',
    description: 'จัดเก็บข้อมูลพื้นฐานและฐานระบบสารสนเทศของสถานศึกษาตามมาตรฐานศูนย์ข้อมูลกลาง',
    icon: 'Server',
    color: 'from-cyan-600 to-blue-700',
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    targetScore: 100,
    categories: [
      {
        id: 'cat_4_1',
        name: 'ข้อมูลพื้นฐานสถานศึกษา (Basic Data)',
        kpis: [
          {
            id: 'kpi_4_1_1',
            code: 'KPI-4.1.1',
            title: 'ข้อมูลครุภัณฑ์ สิ่งก่อสร้าง อาคารสถานที่ ห้องเรียน และห้องปฏิบัติการ',
            description: 'ฐานข้อมูลสินทรัพย์ ครุภัณฑ์การศึกษา อาคารสถานที่ และระบบสาธารณูปโภคประจำปี',
            requiredFileTypes: ['pdf', 'xlsx'],
            targetUnit: 'ฐานข้อมูล',
            targetValue: 1,
            frequency: 'รายภาคเรียน',
            responsibleRoles: ['งานพัสดุ / งานอาคารสถานที่']
          },
          {
            id: 'kpi_4_1_2',
            code: 'KPI-4.1.2',
            title: 'สถิติข้อมูลนักเรียน นักศึกษา และข้อมูลบุคลากร',
            description: 'สถิติจำนวนนักเรียน นักศึกษาจำแนกตามสาขาวิชา/ชั้นปี (10 มิ.ย./10 พ.ย.) และสถิติกำลังคน',
            requiredFileTypes: ['pdf', 'xlsx'],
            targetUnit: 'ชุดข้อมูล',
            targetValue: 2,
            frequency: 'รายภาคเรียน (10 มิ.ย./10 พ.ย.)',
            responsibleRoles: ['งานทะเบียน / งานบุคลากร']
          }
        ]
      },
      {
        id: 'cat_4_2',
        name: 'เอกสารพัฒนาระบบและประชาสัมพันธ์',
        kpis: [
          {
            id: 'kpi_4_2_1',
            code: 'KPI-4.2.1',
            title: 'รายงานระบบสารสนเทศติดตามผล (v-cop / Data Center)',
            description: 'รายงานการนำเข้าและปรับปรุงข้อมูลในระบบ v-cop, RMS, และฐานข้อมูล สอศ.',
            requiredFileTypes: ['pdf', 'xlsx'],
            targetUnit: 'รายงาน',
            targetValue: 4,
            frequency: 'รายไตรมาส',
            responsibleRoles: ['งานศูนย์ข้อมูลสารสนเทศ']
          },
          {
            id: 'kpi_4_2_2',
            code: 'KPI-4.2.2',
            title: 'เอกสารเกี่ยวกับการพัฒนาระบบเครือข่าย เว็บไซต์ และสื่อดิจิทัลของวิทยาลัย',
            description: 'แผนพัฒนาระบบเครือข่ายคอมพิวเตอร์ สถิติการเข้าชมเว็บไซต์ และรายงานสื่อดิจิทัลประชาสัมพันธ์',
            requiredFileTypes: ['pdf', 'url'],
            targetUnit: 'รายงาน',
            targetValue: 2,
            frequency: 'รายภาคเรียน',
            responsibleRoles: ['งานศูนย์ดิจิทัลและสื่อสารองค์กร']
          }
        ]
      }
    ]
  },
  {
    id: 'domain_5',
    code: 'D5',
    name: 'งานติดตามและประเมินผลการอาชีวศึกษา',
    shortName: 'ติดตาม & ประเมินผล',
    description: 'ติดตามผู้สำเร็จการศึกษาและการประเมินความพึงพอใจของนายจ้างและสถานประกอบการ',
    icon: 'Users',
    color: 'from-purple-600 to-indigo-600',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    targetScore: 100,
    categories: [
      {
        id: 'cat_5_1',
        name: 'เอกสารติดตามผู้สำเร็จการศึกษา',
        kpis: [
          {
            id: 'kpi_5_1_1',
            code: 'KPI-5.1.1',
            title: 'รายงานการติดตามผู้สำเร็จการศึกษา (การมีงานทำ / การศึกษาต่อ)',
            description: 'รายงานภาวะการมีงานทำและการศึกษาต่อของผู้สำเร็จการศึกษาระดับ ปวช. และ ปวส.',
            requiredFileTypes: ['pdf', 'xlsx'],
            targetUnit: 'ฉบับรายงาน',
            targetValue: 1,
            frequency: 'รายปีการศึกษา',
            responsibleRoles: ['งานแนะแนวและจัดหางาน']
          },
          {
            id: 'kpi_5_1_2',
            code: 'KPI-5.1.2',
            title: 'แบบสำรวจความพึงพอใจของผู้ใช้ผู้สำเร็จการศึกษา (สถานประกอบการ)',
            description: 'ผลการประเมินสมรรถนะและความพึงพอใจของนายจ้าง/สถานประกอบการต่อผู้สำเร็จการศึกษา',
            requiredFileTypes: ['pdf', 'xlsx'],
            targetUnit: 'รายงานผล',
            targetValue: 1,
            frequency: 'รายปีการศึกษา',
            responsibleRoles: ['งานประกันคุณภาพ / งานความร่วมมือ']
          }
        ]
      }
    ]
  },
  {
    id: 'domain_6',
    code: 'D6',
    name: 'งานส่งเสริมธุรกิจและการเป็นผู้ประกอบการ',
    shortName: 'ส่งเสริมธุรกิจ & ผู้ประกอบการ',
    description: 'จัดเก็บโครงการ/ผลงานนวัตกรรมเชิงพาณิชย์ งานศูนย์บ่มเพาะผู้ประกอบการอาชีวศึกษา และการหารายได้ระหว่างเรียน',
    icon: 'Store',
    color: 'from-rose-600 to-amber-600',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    targetScore: 100,
    categories: [
      {
        id: 'cat_6_1',
        name: 'งานศูนย์บ่มเพาะและนวัตกรรมเชิงพาณิชย์',
        kpis: [
          {
            id: 'kpi_6_1_1',
            code: 'KPI-6.1.1',
            title: 'เอกสารรายงานผลการดำเนินงานศูนย์ส่งเสริมการเป็นผู้ประกอบการ (ศูนย์บ่มเพาะฯ)',
            description: 'รายงานผลการบ่มเพาะธุรกิจนักศึกษา แผนธุรกิจ และการประเมินศูนย์บ่มเพาะระดับภาค/ชาติ',
            requiredFileTypes: ['pdf', 'docx'],
            targetUnit: 'เล่มสรุป',
            targetValue: 1,
            frequency: 'รายปีการศึกษา',
            responsibleRoles: ['ศูนย์บ่มเพาะผู้ประกอบการอาชีวศึกษา']
          },
          {
            id: 'kpi_6_1_2',
            code: 'KPI-6.1.2',
            title: 'โครงการ/ผลงานนวัตกรรมเชิงพาณิชย์ (Commercial Innovation)',
            description: 'รายงานผลงานสิ่งประดิษฐ์และนวัตกรรมที่มีการต่อยอดสู่การผลิตหรือจำหน่ายเชิงพาณิชย์จริง',
            requiredFileTypes: ['pdf', 'docx', 'xlsx'],
            targetUnit: 'โครงการ',
            targetValue: 5,
            frequency: 'รายปีการศึกษา',
            responsibleRoles: ['ศูนย์บ่มเพาะฯ / งานวิจัย']
          }
        ]
      },
      {
        id: 'cat_6_2',
        name: 'โครงการหารายได้ระหว่างเรียนและความร่วมมือธุรกิจ',
        kpis: [
          {
            id: 'kpi_6_2_1',
            code: 'KPI-6.2.1',
            title: 'เอกสารโครงการส่งเสริมการหารายได้ระหว่างเรียนของนักเรียน นักศึกษา',
            description: 'รายงานการดำเนินงานโครงการฝึกประสบการณ์สร้างรายได้ระหว่างเรียนและการประกอบอาชีพอิสระ',
            requiredFileTypes: ['pdf', 'xlsx'],
            targetUnit: 'โครงการ',
            targetValue: 10,
            frequency: 'รายภาคเรียน',
            responsibleRoles: ['ทุกแผนกวิชา / งานกิจกรรมนักเรียน']
          },
          {
            id: 'kpi_6_2_2',
            code: 'KPI-6.2.2',
            title: 'บันทึกความเข้าใจ (MOU) และความร่วมมือทางธุรกิจกับสถานประกอบการ',
            description: 'เอกสารข้อตกลงความร่วมมือในการพัฒนาทักษะอาชีพ การฝึกงาน และการส่งเสริมธุรกิจกับภาคเอกชน',
            requiredFileTypes: ['pdf'],
            targetUnit: 'ฉบับ MOU',
            targetValue: 20,
            frequency: 'ตลอดปีงบประมาณ',
            responsibleRoles: ['งานความร่วมมือ / ศูนย์บ่มเพาะฯ']
          }
        ]
      }
    ]
  }
];

export const DEPARTMENTS = [
  { id: 'dept_elec', name: 'แผนกวิชาช่างไฟฟ้ากำลัง', category: 'ช่างอุตสาหกรรม', head: 'นายสมชาย ไฟฟ้า', code: 'EE' },
  { id: 'dept_mech', name: 'แผนกวิชาช่างยนต์', category: 'ช่างอุตสาหกรรม', head: 'นายณรงค์ เครื่องกล', code: 'AT' },
  { id: 'dept_it', name: 'แผนกวิชาเทคโนโลยีสารสนเทศ', category: 'เทคโนโลยีสารสนเทศ', head: 'ดร.กานต์ นวัตกรรม', code: 'IT' },
  { id: 'dept_acc', name: 'แผนกวิชาการบัญชี', category: 'พาณิชยกรรม', head: 'นางกัญญารัตน์ การเงิน', code: 'AC' },
  { id: 'dept_mkt', name: 'แผนกวิชาการตลาดและดิจิทัล', category: 'พาณิชยกรรม', head: 'นางสาวพิมพา พาณิชย์', code: 'MK' },
  { id: 'dept_food', name: 'แผนกวิชาอาหารและโภชนาการ', category: 'คหกรรมศาสตร์', head: 'นางมาริสา เชฟดี', code: 'FD' },
  { id: 'dept_con', name: 'แผนกวิชาช่างก่อสร้างและโยธา', category: 'ช่างอุตสาหกรรม', head: 'นายวิชัย โยธาการ', code: 'CN' },
  { id: 'dept_general', name: 'แผนกวิชาสามัญสัมพันธ์', category: 'ศึกษาทั่วไป', head: 'นายประเสริฐ สอนดี', code: 'GEN' },
  { id: 'dept_plan', name: 'งานพัฒนายุทธศาสตร์และแผนงาน', category: 'ฝ่ายบริหาร', head: 'นายอนุชา ยุทธศาสตร์', code: 'PLAN' },
  { id: 'dept_qa', name: 'งานประกันคุณภาพการศึกษา', category: 'ฝ่ายบริหาร', head: 'ดร.มงคล มาตรฐาน', code: 'QA' },
  { id: 'dept_coop', name: 'งานความร่วมมือและทวิภาคี', category: 'ฝ่ายพัฒนากิจการ', head: 'นายสุรชัย สัมพันธ์', code: 'COOP' },
  { id: 'dept_research', name: 'งานส่งเสริมวิจัยและนวัตกรรม', category: 'ฝ่ายวิชาการ', head: 'ดร.วิจัย ประดิษฐ์', code: 'RES' },
  { id: 'dept_incubator', name: 'ศูนย์บ่มเพาะผู้ประกอบการอาชีวศึกษา', category: 'งานส่งเสริมธุรกิจ', head: 'นางสาววาสนา ธุรกิจก้าวหน้า', code: 'BIZ' }
];

export const FISCAL_YEARS = ['2567', '2568', '2569'];
export const CURRENT_FISCAL_YEAR = '2568';
export const CURRENT_ACADEMIC_YEAR = '2567';
