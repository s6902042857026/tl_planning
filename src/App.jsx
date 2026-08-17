import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { kpiService } from './services/kpiService';
import Navbar from './components/common/Navbar';
import Toast from './components/common/Toast';
import AuthPage from './components/auth/AuthPage';
import ChangePasswordModal from './components/auth/ChangePasswordModal';
import ExecutiveDashboard from './components/dashboard/ExecutiveDashboard';
import DomainsOverview from './components/dashboard/DomainsOverview';
import DomainDetailModal from './components/dashboard/DomainDetailModal';
import SubmissionUploadModal from './components/submissions/SubmissionUploadModal';
import SubmissionList from './components/submissions/SubmissionList';
import SubmissionDetailModal from './components/submissions/SubmissionDetailModal';
import ReviewTable from './components/admin/ReviewTable';
import MissingSubmissionsTracker from './components/admin/MissingSubmissionsTracker';
import KpiManager from './components/admin/KpiManager';
import ExecutivePDCAView from './components/executive/ExecutivePDCAView';
import AwardsAndMOUShowcase from './components/executive/AwardsAndMOUShowcase';
import ExportReportModal from './components/executive/ExportReportModal';
import UseCaseDiagramModal from './components/usecase/UseCaseDiagramModal';
import TvProjectorView from './components/tv/TvProjectorView';
import { isSupabaseConfigured } from './lib/supabase';
import { Sparkles, RefreshCw, ExternalLink } from 'lucide-react';

export default function App() {
  const { currentUser, isAuthenticated, loading: authLoading, tvMode, setTvMode, showToast } = useAuth();
  
  // Default landing tab based on role
  const getDefaultTab = (role) => {
    if (role === 'executive') return 'dashboard';
    if (role === 'admin') return 'review_table';
    return 'my_submissions';
  };

  const [activeTab, setActiveTab] = useState(() => currentUser ? getDefaultTab(currentUser.role) : 'my_submissions');
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Automatically adjust active tab whenever role changes or if unauthorized role tries to view executive dashboard
  useEffect(() => {
    if (currentUser && currentUser.role !== 'executive' && (activeTab === 'dashboard' || activeTab === 'executive_pdca' || activeTab === 'awards_mou')) {
      setActiveTab(getDefaultTab(currentUser.role));
    }
  }, [currentUser?.role]);

  // Modal States
  const [useCaseModalOpen, setUseCaseModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [selectedDomainForDetail, setSelectedDomainForDetail] = useState(null);
  const [selectedSubmissionForDetail, setSelectedSubmissionForDetail] = useState(null);
  const [selectedKpiForUpload, setSelectedKpiForUpload] = useState(null);
  const [selectedDomainForUpload, setSelectedDomainForUpload] = useState(null);

  // Load Submissions
  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const data = await kpiService.getSubmissions();
      setSubmissions(data);
    } catch (err) {
      console.error('Failed to load submissions', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchSubmissions();
    }
  }, [currentUser]);

  // Handlers
  const handleCreateSubmission = async (formData) => {
    const created = await kpiService.createSubmission(formData);
    setSubmissions(prev => [created, ...prev]);
  };

  const handleReviewSubmission = async (id, reviewData) => {
    const updated = await kpiService.reviewSubmission(id, reviewData);
    setSubmissions(prev => prev.map(s => s.id === id ? updated : s));
  };

  const handleDeleteSubmission = async (id) => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการส่งนี้?')) {
      await kpiService.deleteSubmission(id);
      setSubmissions(prev => prev.filter(s => s.id !== id));
      showToast('ลบรายการเรียบร้อยแล้ว', 'info');
    }
  };

  const handleResetData = () => {
    if (confirm('ต้องการรีเซ็ตข้อมูลทั้งหมดกลับสู่ค่าเริ่มต้นของระบบหรือไม่?')) {
      const initial = kpiService.resetMockData();
      setSubmissions(initial);
      showToast('รีเซ็ตข้อมูลตัวอย่างเรียบร้อยแล้ว', 'success');
    }
  };

  const handleSelectKpiToUpload = (kpi, domain) => {
    setSelectedKpiForUpload(kpi);
    setSelectedDomainForUpload(domain);
    setUploadModalOpen(true);
  };

  // If user is not logged in, show AuthPage (Login / Register)
  if (!currentUser) {
    return (
      <>
        <Toast />
        <AuthPage onOpenUseCaseModal={() => setUseCaseModalOpen(true)} />
        <UseCaseDiagramModal
          isOpen={useCaseModalOpen}
          onClose={() => setUseCaseModalOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-kanit">
      <Toast />

      {/* TV / Projector Display Presentation View */}
      {tvMode && (
        <TvProjectorView
          submissions={submissions}
          onClose={() => setTvMode(false)}
        />
      )}

      {/* Main Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenUseCaseModal={() => setUseCaseModalOpen(true)}
        onOpenUploadModal={() => {
          setSelectedKpiForUpload(null);
          setSelectedDomainForUpload(null);
          setUploadModalOpen(true);
        }}
        onOpenChangePassword={() => setChangePasswordModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && currentUser.role === 'executive' && (
          <ExecutiveDashboard
            submissions={submissions}
            onSelectDomain={(d) => setSelectedDomainForDetail(d)}
            onOpenExportModal={() => setExportModalOpen(true)}
            onOpenSubmissionDetail={(s) => setSelectedSubmissionForDetail(s)}
            onOpenUploadModal={() => setUploadModalOpen(true)}
          />
        )}

        {activeTab === 'domains' && (
          <DomainsOverview
            submissions={submissions}
            onSelectDomain={(d) => setSelectedDomainForDetail(d)}
            onSelectKpiToUpload={handleSelectKpiToUpload}
          />
        )}

        {activeTab === 'my_submissions' && (
          <SubmissionList
            submissions={submissions}
            onOpenUploadModal={() => {
              setSelectedKpiForUpload(null);
              setSelectedDomainForUpload(null);
              setUploadModalOpen(true);
            }}
            onOpenDetailModal={(s) => setSelectedSubmissionForDetail(s)}
            onDeleteSubmission={handleDeleteSubmission}
          />
        )}

        {activeTab === 'review_table' && (
          <ReviewTable
            submissions={submissions}
            onReviewSubmission={handleReviewSubmission}
            onOpenDetailModal={(s) => setSelectedSubmissionForDetail(s)}
          />
        )}

        {activeTab === 'missing_tracker' && (
          <MissingSubmissionsTracker
            submissions={submissions}
          />
        )}

        {activeTab === 'kpi_manager' && (
          <KpiManager />
        )}

        {activeTab === 'executive_pdca' && (
          <ExecutivePDCAView
            submissions={submissions}
            onOpenDetailModal={(s) => setSelectedSubmissionForDetail(s)}
          />
        )}

        {activeTab === 'awards_mou' && (
          <AwardsAndMOUShowcase
            submissions={submissions}
            onOpenDetailModal={(s) => setSelectedSubmissionForDetail(s)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/logotl.png"
              alt="วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์"
              onError={(e) => { e.target.onerror = null; e.target.src = '/favicon.svg'; }}
              className="w-10 h-10 object-contain rounded-full"
            />
            <div>
              <span className="font-bold text-slate-800">ฝ่ายยุทธศาสตร์และแผนงาน วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์</span>
              <p className="text-[11px] text-slate-400">ระบบติดตามและประเมินผลตัวชี้วัด 6 ด้านหลัก (TTC Planning KPI System)</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-slate-400">พัฒนาสำหรับสำนักงานคณะกรรมการการอาชีวศึกษา (สอศ.)</span>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600">
              <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              <span>{isSupabaseConfigured ? 'Supabase Database Connected' : 'LocalStorage & Supabase Ready'}</span>
            </div>
            <button
              onClick={handleResetData}
              className="flex items-center gap-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>รีเซ็ตข้อมูลตัวอย่าง</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedDomainForDetail && (
        <DomainDetailModal
          domain={selectedDomainForDetail}
          submissions={submissions}
          isOpen={Boolean(selectedDomainForDetail)}
          onClose={() => setSelectedDomainForDetail(null)}
          onSelectKpiForUpload={(kpi) => {
            setSelectedKpiForUpload(kpi);
            setSelectedDomainForUpload(selectedDomainForDetail);
            setSelectedDomainForDetail(null);
            setUploadModalOpen(true);
          }}
          onOpenDetailModal={(s) => setSelectedSubmissionForDetail(s)}
        />
      )}

      {uploadModalOpen && (
        <SubmissionUploadModal
          isOpen={uploadModalOpen}
          onClose={() => {
            setUploadModalOpen(false);
            setSelectedKpiForUpload(null);
            setSelectedDomainForUpload(null);
          }}
          onSubmit={handleCreateSubmission}
          initialKpi={selectedKpiForUpload}
          initialDomain={selectedDomainForUpload}
        />
      )}

      {selectedSubmissionForDetail && (
        <SubmissionDetailModal
          submission={selectedSubmissionForDetail}
          isOpen={Boolean(selectedSubmissionForDetail)}
          onClose={() => setSelectedSubmissionForDetail(null)}
          onReviewSubmission={handleReviewSubmission}
        />
      )}

      {exportModalOpen && (
        <ExportReportModal
          isOpen={exportModalOpen}
          onClose={() => setExportModalOpen(false)}
          submissions={submissions}
        />
      )}

      {useCaseModalOpen && (
        <UseCaseDiagramModal
          isOpen={useCaseModalOpen}
          onClose={() => setUseCaseModalOpen(false)}
        />
      )}

      {changePasswordModalOpen && (
        <ChangePasswordModal
          isOpen={changePasswordModalOpen}
          onClose={() => setChangePasswordModalOpen(false)}
        />
      )}
    </div>
  );
}
