-- ============================================================
-- GRANT + RLS Setup สำหรับ Supabase
-- รันไฟล์นี้ใน Supabase Dashboard > SQL Editor
-- ============================================================

-- GRANT SELECT/INSERT/UPDATE/DELETE ให้ anon และ authenticated roles
GRANT SELECT, INSERT, UPDATE, DELETE ON public.departments TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_profiles TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.kpi_domains TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.kpi_categories TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.kpis TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.submissions TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.submission_files TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.activity_logs TO anon, authenticated;

-- GRANT สำหรับ sequences (uuid)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- ============================================================
-- RLS Policies (ถ้ายังไม่มี)
-- ============================================================

-- kpi_domains
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='kpi_domains' AND policyname='Public Read Access for Domains') THEN
    CREATE POLICY "Public Read Access for Domains" ON kpi_domains FOR SELECT USING (true);
  END IF;
END $$;

-- kpi_categories
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='kpi_categories' AND policyname='Public Read Access for Categories') THEN
    CREATE POLICY "Public Read Access for Categories" ON kpi_categories FOR SELECT USING (true);
  END IF;
END $$;

-- kpis
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='kpis' AND policyname='Public Read Access for KPIs') THEN
    CREATE POLICY "Public Read Access for KPIs" ON kpis FOR SELECT USING (true);
  END IF;
END $$;

-- departments
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='departments' AND policyname='Public Read Access for Departments') THEN
    CREATE POLICY "Public Read Access for Departments" ON departments FOR SELECT USING (true);
  END IF;
END $$;

-- submissions
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='submissions' AND policyname='Public Read Access for Submissions') THEN
    CREATE POLICY "Public Read Access for Submissions" ON submissions FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='submissions' AND policyname='Allow Insert Submissions') THEN
    CREATE POLICY "Allow Insert Submissions" ON submissions FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='submissions' AND policyname='Allow Update Submissions') THEN
    CREATE POLICY "Allow Update Submissions" ON submissions FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='submissions' AND policyname='Allow Delete Submissions') THEN
    CREATE POLICY "Allow Delete Submissions" ON submissions FOR DELETE USING (true);
  END IF;
END $$;

-- submission_files
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='submission_files' AND policyname='Public Read Access for Files') THEN
    CREATE POLICY "Public Read Access for Files" ON submission_files FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='submission_files' AND policyname='Allow Insert Files') THEN
    CREATE POLICY "Allow Insert Files" ON submission_files FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- user_profiles
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_profiles' AND policyname='Public Read Access for User Profiles') THEN
    CREATE POLICY "Public Read Access for User Profiles" ON user_profiles FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_profiles' AND policyname='Allow Insert User Profiles') THEN
    CREATE POLICY "Allow Insert User Profiles" ON user_profiles FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_profiles' AND policyname='Allow Update User Profiles') THEN
    CREATE POLICY "Allow Update User Profiles" ON user_profiles FOR UPDATE USING (true);
  END IF;
END $$;

-- ============================================================
-- UPSERT GRANT สำหรับ kpi_domains (allow anon to INSERT/UPDATE)
-- ============================================================
GRANT INSERT, UPDATE ON public.kpi_domains TO anon, authenticated;
GRANT INSERT, UPDATE ON public.kpi_categories TO anon, authenticated;
GRANT INSERT, UPDATE ON public.kpis TO anon, authenticated;
GRANT INSERT, UPDATE ON public.departments TO anon, authenticated;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='kpi_domains' AND policyname='Allow Insert Domains') THEN
    CREATE POLICY "Allow Insert Domains" ON kpi_domains FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='kpi_domains' AND policyname='Allow Update Domains') THEN
    CREATE POLICY "Allow Update Domains" ON kpi_domains FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='kpi_categories' AND policyname='Allow Insert Categories') THEN
    CREATE POLICY "Allow Insert Categories" ON kpi_categories FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='kpi_categories' AND policyname='Allow Update Categories') THEN
    CREATE POLICY "Allow Update Categories" ON kpi_categories FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='kpis' AND policyname='Allow Insert KPIs') THEN
    CREATE POLICY "Allow Insert KPIs" ON kpis FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='kpis' AND policyname='Allow Update KPIs') THEN
    CREATE POLICY "Allow Update KPIs" ON kpis FOR UPDATE USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='departments' AND policyname='Allow Insert Departments') THEN
    CREATE POLICY "Allow Insert Departments" ON departments FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='departments' AND policyname='Allow Update Departments') THEN
    CREATE POLICY "Allow Update Departments" ON departments FOR UPDATE USING (true);
  END IF;
END $$;

-- Done!
SELECT 'GRANT และ RLS พร้อมใช้งาน ✅' as status;
