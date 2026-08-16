import { KPI_DOMAINS, DEPARTMENTS } from '../data/kpiStructure';
import { INITIAL_SUBMISSIONS } from '../data/mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const LOCAL_STORAGE_KEY = 'ttc_planning_submissions_v1';
const KPIS_STORAGE_KEY = 'ttc_planning_custom_kpis_v1';

export const kpiService = {
  // Get all domains and KPIs
  getDomains() {
    return KPI_DOMAINS;
  },

  // Get all departments
  getDepartments() {
    return DEPARTMENTS;
  },

  // Get all submissions (from LocalStorage or Supabase)
  async getSubmissions() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('submissions')
          .select(`*, submission_files(*)`)
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data.map(item => ({
            id: item.id,
            kpiId: item.kpi_id,
            domainId: item.domain_id,
            departmentId: item.department_id,
            departmentName: item.department_name,
            submittedBy: item.submitter_name,
            submittedAt: item.created_at,
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
              url: f.file_url
            })),
            notes: item.notes,
            reviewComment: item.review_comment,
            reviewerName: item.reviewer_name
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to LocalStorage', err);
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
    // Initialize default seed
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SUBMISSIONS));
    return INITIAL_SUBMISSIONS;
  },

  // Save new submission
  async createSubmission(submissionData) {
    const newSubmission = {
      id: 'sub_' + Date.now(),
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'pending',
      score: null,
      reviewComment: null,
      reviewerName: null,
      ...submissionData
    };

    const currentList = await this.getSubmissions();
    const updatedList = [newSubmission, ...currentList];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));

    // Also sync to Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('submissions').insert([{
          kpi_id: newSubmission.kpiId,
          domain_id: newSubmission.domainId,
          department_id: newSubmission.departmentId,
          submitter_name: newSubmission.submittedBy,
          project_name: newSubmission.projectName,
          fiscal_year: newSubmission.fiscalYear,
          academic_year: newSubmission.academicYear,
          budget_planned: newSubmission.budgetPlanned,
          budget_spent: newSubmission.budgetSpent,
          pdca_stage: newSubmission.pdcaStage,
          status: newSubmission.status,
          notes: newSubmission.notes
        }]);
      } catch (err) {
        console.warn('Sync to Supabase failed', err);
      }
    }

    return newSubmission;
  },

  // Update submission status (Approve / Reject / Request Revision)
  async reviewSubmission(id, { status, score, reviewComment, reviewerName }) {
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
      updatedAt: new Date().toISOString()
    };

    currentList[index] = updated;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentList));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('submissions').update({
          status,
          score: updated.score,
          review_comment: reviewComment,
          reviewer_name: reviewerName,
          reviewed_at: updated.reviewedAt
        }).eq('id', id);
      } catch (err) {
        console.warn('Sync review to Supabase failed', err);
      }
    }

    return updated;
  },

  // Delete submission
  async deleteSubmission(id) {
    const currentList = await this.getSubmissions();
    const filtered = currentList.filter(item => item.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },

  // Reset to initial mock data
  resetMockData() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SUBMISSIONS));
    return INITIAL_SUBMISSIONS;
  }
};
