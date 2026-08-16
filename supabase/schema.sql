-- ==============================================================================
-- ระบบติดตามตัวชี้วัด ฝ่ายยุทธศาสตร์และแผนงาน สังกัดสำนักงานคณะกรรมการการอาชีวศึกษา
-- Supabase SQL Schema & Seed Data
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE user_role AS ENUM ('user', 'admin', 'executive');
CREATE TYPE submission_status AS ENUM ('pending', 'approved', 'revision', 'rejected');
CREATE TYPE pdca_stage AS ENUM ('Plan', 'Do', 'Check', 'Action');

-- 3. DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS departments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    category TEXT NOT NULL,
    head_name TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role DEFAULT 'user' NOT NULL,
    department_id TEXT REFERENCES departments(id) ON DELETE SET NULL,
    position TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. KPI DOMAINS TABLE
CREATE TABLE IF NOT EXISTS kpi_domains (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'Compass',
    target_score NUMERIC DEFAULT 100,
    sort_order INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. KPI CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS kpi_categories (
    id TEXT PRIMARY KEY,
    domain_id TEXT REFERENCES kpi_domains(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    sort_order INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. KPIS (INDICATORS) TABLE
CREATE TABLE IF NOT EXISTS kpis (
    id TEXT PRIMARY KEY,
    category_id TEXT REFERENCES kpi_categories(id) ON DELETE CASCADE NOT NULL,
    domain_id TEXT REFERENCES kpi_domains(id) ON DELETE CASCADE NOT NULL,
    code TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    target_unit TEXT,
    target_value NUMERIC DEFAULT 1,
    frequency TEXT,
    required_file_types TEXT[] DEFAULT '{"pdf"}'::TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kpi_id TEXT REFERENCES kpis(id) ON DELETE RESTRICT NOT NULL,
    domain_id TEXT REFERENCES kpi_domains(id) ON DELETE RESTRICT NOT NULL,
    department_id TEXT REFERENCES departments(id) ON DELETE SET NULL,
    submitted_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    submitter_name TEXT NOT NULL,
    project_name TEXT NOT NULL,
    fiscal_year TEXT NOT NULL DEFAULT '2568',
    academic_year TEXT NOT NULL DEFAULT '2567',
    budget_planned NUMERIC DEFAULT 0,
    budget_spent NUMERIC DEFAULT 0,
    pdca_stage pdca_stage DEFAULT 'Plan',
    status submission_status DEFAULT 'pending',
    score NUMERIC,
    notes TEXT,
    review_comment TEXT,
    reviewer_name TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. SUBMISSION FILES TABLE
CREATE TABLE IF NOT EXISTS submission_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE NOT NULL,
    file_name TEXT NOT NULL,
    file_size TEXT,
    file_type TEXT,
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 10. ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Allow read access for authenticated & anon clients for dashboard viewing
CREATE POLICY "Public Read Access for KPIs" ON kpis FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Domains" ON kpi_domains FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Categories" ON kpi_categories FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Departments" ON departments FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Submissions" ON submissions FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Files" ON submission_files FOR SELECT USING (true);

-- Allow Insert/Update for Submissions
CREATE POLICY "Allow Insert Submissions" ON submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow Update Submissions" ON submissions FOR UPDATE USING (true);
CREATE POLICY "Allow Insert Files" ON submission_files FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

INSERT INTO departments (id, name, code, category, head_name) VALUES
('dept_elec', 'แผนกวิชาช่างไฟฟ้ากำลัง', 'EE', 'ช่างอุตสาหกรรม', 'นายสมชาย ไฟฟ้า'),
('dept_mech', 'แผนกวิชาช่างยนต์', 'AT', 'ช่างอุตสาหกรรม', 'นายณรงค์ เครื่องกล'),
('dept_it', 'แผนกวิชาเทคโนโลยีสารสนเทศ', 'IT', 'เทคโนโลยีสารสนเทศ', 'ดร.กานต์ นวัตกรรม'),
('dept_acc', 'แผนกวิชาการบัญชี', 'AC', 'พาณิชยกรรม', 'นางกัญญารัตน์ การเงิน'),
('dept_mkt', 'แผนกวิชาการตลาดและดิจิทัล', 'MK', 'พาณิชยกรรม', 'นางสาวพิมพา พาณิชย์'),
('dept_food', 'แผนกวิชาอาหารและโภชนาการ', 'FD', 'คหกรรมศาสตร์', 'นางมาริสา เชฟดี'),
('dept_con', 'แผนกวิชาช่างก่อสร้างและโยธา', 'CN', 'ช่างอุตสาหกรรม', 'นายวิชัย โยธาการ'),
('dept_general', 'แผนกวิชาสามัญสัมพันธ์', 'GEN', 'ศึกษาทั่วไป', 'นายประเสริฐ สอนดี'),
('dept_plan', 'งานพัฒนายุทธศาสตร์และแผนงาน', 'PLAN', 'ฝ่ายบริหาร', 'นายอนุชา ยุทธศาสตร์'),
('dept_qa', 'งานประกันคุณภาพการศึกษา', 'QA', 'ฝ่ายบริหาร', 'ดร.มงคล มาตรฐาน'),
('dept_coop', 'งานความร่วมมือและทวิภาคี', 'COOP', 'ฝ่ายพัฒนากิจการ', 'นายสุรชัย สัมพันธ์'),
('dept_research', 'งานส่งเสริมวิจัยและนวัตกรรม', 'RES', 'ฝ่ายวิชาการ', 'ดร.วิจัย ประดิษฐ์')
ON CONFLICT (id) DO NOTHING;

INSERT INTO kpi_domains (id, code, name, short_name, description, icon, target_score, sort_order) VALUES
('domain_1', 'D1', 'งานพัฒนายุทธศาสตร์ แผนงาน และงบประมาณ', 'ยุทธศาสตร์ & งบประมาณ', 'ศูนย์กลางการบริหารจัดการยุทธศาสตร์ แผนงาน และงบประมาณประจำปี', 'Compass', 100, 1),
('domain_2', 'D2', 'งานมาตรฐานและการประกันคุณภาพการศึกษา', 'มาตรฐาน & ประกันคุณภาพ', 'รับผิดชอบระบบประกันคุณภาพทั้งภายในและภายนอกสถานศึกษา', 'ShieldCheck', 100, 2),
('domain_3', 'D3', 'งานส่งเสริมการวิจัย นวัตกรรม และสิ่งประดิษฐ์', 'วิจัย & นวัตกรรม', 'จัดเก็บผลงานทางวิชาการ สิ่งประดิษฐ์ และนวัตกรรมของครูและนักเรียน', 'Lightbulb', 100, 3),
('domain_4', 'D4', 'งานศูนย์ดิจิทัลและสื่อสารองค์กร (สารสนเทศและ ICT)', 'ดิจิทัล & ICT', 'จัดเก็บข้อมูลพื้นฐานและฐานระบบสารสนเทศของสถานศึกษา', 'Server', 100, 4),
('domain_5', 'D5', 'งานติดตาม ประเมินผล และความร่วมมือ / ผู้ประกอบการ', 'ติดตามผล & ความร่วมมือ', 'ติดตามผู้สำเร็จการศึกษาและการประเมินความพึงพอใจ', 'Users', 100, 5)
ON CONFLICT (id) DO NOTHING;
