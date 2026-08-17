import { KPI_DOMAINS, DEPARTMENTS } from '../data/kpiStructure';
import { INITIAL_SUBMISSIONS } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const LOCAL_STORAGE_KEY = 'ttc_planning_submissions_v1';
const KPIS_STORAGE_KEY = 'ttc_planning_custom_kpis_v1';

export const kpiService = {
  // Get all domains and KPIs (from static data — structure file)
  getDomains() {
    return KPI_DOMAINS;
  },

  // Get all departments (from static data)
  getDepartments() {
    return DEPARTMENTS;
  },

  // ============================================================
  // GET ALL SUBMISSIONS — Supabase first, localStorage fallback
  // ============================================================
  async getSubmissions() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('submissions')
          .select(`*, submission_files(*)`)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map(item => ({
            id: item.id,
            kpiId: item.kpi_id,
            domainId: item.domain_id,
            departmentId: item.department_id,
            departmentName: item.department_name,
            submittedBy: item.submitter_name,
            submittedAt: item.created_at,
            updatedAt: item.updated_at,
            fiscalYear: item.fiscal_year,
            academicYear: item.academic_year,
            projectName: item.project_name,
            budgetPlanned: item.budget_planned,
            budgetSpent: item.budget_spent,
            pdcaStage: item.pdca_stage,
            status: item.status,
            score: item.score,
            documents: (item.submission_files || []).map(f => ({
              name: f.file_name,
              size: f.file_size,
              type: f.file_type,
              url: f.file_url,
            })),
            notes: item.notes,
            reviewComment: item.review_comment,
            reviewerName: item.reviewer_name,
            reviewedAt: item.reviewed_at,
          }));
        }
        if (error) {
          console.warn('Supabase fetch error, falling back to LocalStorage:', error.message);
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to LocalStorage:', err);
      }
    }

    // LocalStorage Fallback
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing stored submissions', e);
      }
    }
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SUBMISSIONS));
    return INITIAL_SUBMISSIONS;
  },

  // ============================================================
  // CREATE SUBMISSION — Supabase first, localStorage fallback
  // ============================================================
  async createSubmission(submissionData) {
    if (isSupabaseConfigured && supabase) {
      try {
        const insertPayload = {
          kpi_id: submissionData.kpiId,
          domain_id: submissionData.domainId,
          department_id: submissionData.departmentId,
          department_name: submissionData.departmentName,
          submitter_name: submissionData.submittedBy,
          project_name: submissionData.projectName,
          fiscal_year: submissionData.fiscalYear || '2568',
          academic_year: submissionData.academicYear || '2567',
          budget_planned: submissionData.budgetPlanned || 0,
          budget_spent: submissionData.budgetSpent || 0,
          pdca_stage: submissionData.pdcaStage || 'Plan',
          status: 'pending',
          notes: submissionData.notes || null,
        };

        const { data, error } = await supabase
          .from('submissions')
          .insert([insertPayload])
          .select()
          .single();

        if (error) throw error;

        // Upload documents as submission_files
        if (submissionData.documents && submissionData.documents.length > 0 && data?.id) {
          const fileRows = submissionData.documents.map(doc => ({
            submission_id: data.id,
            file_name: doc.name,
            file_size: doc.size || null,
            file_type: doc.type || null,
            file_url: doc.url || doc.name,
          }));
          await supabase.from('submission_files').insert(fileRows);
        }

        // Map back to frontend format
        const created = {
          id: data.id,
          kpiId: data.kpi_id,
          domainId: data.domain_id,
          departmentId: data.department_id,
          departmentName: data.department_name,
          submittedBy: data.submitter_name,
          submittedAt: data.created_at,
          updatedAt: data.updated_at,
          fiscalYear: data.fiscal_year,
          academicYear: data.academic_year,
          projectName: data.project_name,
          budgetPlanned: data.budget_planned,
          budgetSpent: data.budget_spent,
          pdcaStage: data.pdca_stage,
          status: data.status,
          score: data.score,
          documents: submissionData.documents || [],
          notes: data.notes,
          reviewComment: null,
          reviewerName: null,
        };

        return created;
      } catch (err) {
        console.warn('Supabase createSubmission failed, using localStorage:', err.message);
      }
    }

    // LocalStorage Fallback
    const newSubmission = {
      id: 'sub_' + Date.now(),
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'pending',
      score: null,
      reviewComment: null,
      reviewerName: null,
      ...submissionData,
    };
    const currentList = await this.getSubmissions();
    const updatedList = [newSubmission, ...currentList];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
    return newSubmission;
  },

  // ============================================================
  // REVIEW SUBMISSION — Supabase first
  // ============================================================
  async reviewSubmission(id, { status, score, reviewComment, reviewerName }) {
    if (isSupabaseConfigured && supabase) {
      try {
        const reviewedAt = new Date().toISOString();
        const { data, error } = await supabase
          .from('submissions')
          .update({
            status,
            score: score !== undefined ? Number(score) : null,
            review_comment: reviewComment,
            reviewer_name: reviewerName,
            reviewed_at: reviewedAt,
            updated_at: reviewedAt,
          })
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;

        return {
          id: data.id,
          kpiId: data.kpi_id,
          domainId: data.domain_id,
          departmentId: data.department_id,
          departmentName: data.department_name,
          submittedBy: data.submitter_name,
          submittedAt: data.created_at,
          updatedAt: data.updated_at,
          fiscalYear: data.fiscal_year,
          academicYear: data.academic_year,
          projectName: data.project_name,
          budgetPlanned: data.budget_planned,
          budgetSpent: data.budget_spent,
          pdcaStage: data.pdca_stage,
          status: data.status,
          score: data.score,
          notes: data.notes,
          reviewComment: data.review_comment,
          reviewerName: data.reviewer_name,
          reviewedAt: data.reviewed_at,
          documents: [],
        };
      } catch (err) {
        console.warn('Supabase reviewSubmission failed, using localStorage:', err.message);
      }
    }

    // LocalStorage Fallback
    const currentList = await this.getSubmissions();
    const index = currentList.findIndex(item => item.id === id);
    if (index === -1) throw new Error('ไม่พบข้อมูลรายการที่ต้องการตรวจสอบ');
    const updated = {
      ...currentList[index],
      status,
      score: score !== undefined ? Number(score) : currentList[index].score,
      reviewComment,
      reviewerName,
      reviewedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    currentList[index] = updated;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentList));
    return updated;
  },

  // ============================================================
  // DELETE SUBMISSION — Supabase first
  // ============================================================
  async deleteSubmission(id) {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.from('submissions').delete().eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.warn('Supabase deleteSubmission failed, using localStorage:', err.message);
      }
    }

    // LocalStorage Fallback
    const currentList = await this.getSubmissions();
    const filtered = currentList.filter(item => item.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  // Reset to initial mock data (local only)
  resetMockData() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SUBMISSIONS));
    return INITIAL_SUBMISSIONS;
  },
};
