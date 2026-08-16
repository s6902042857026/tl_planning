import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { kpiService } from './services/kpiService';
import Navbar from './components/common/Navbar';
import Toast from './components/common/Toast';
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
  const { currentUser, tvMode, setTvMode, showToast } = useAuth();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal States
  const [useCaseModalOpen, setUseCaseModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
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
    fetchSubmissions();
  }, []);

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
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
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
            <img src="/favicon.svg" alt="TTC Logo" className="w-6 h-6" />
            <div>
              <span className="font-bold text-slate-700">ฝ่ายยุทธศาสตร์และแผนงาน สังกัดสำนักงานคณะกรรมการการอาชีวศึกษา (สอศ.)</span>
              <p className="text-[11px] text-slate-400">ระบบติดตามและประเมินผลตัวชี้วัด 5 ด้านหลัก (TTC Planning KPI System)</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setUseCaseModalOpen(true)}
              className="hover:text-brand-600 font-medium"
            >
              แผนผังสิทธิ์ (Use Case)
            </button>
            <span>•</span>
            <button
              onClick={handleResetData}
              className="flex items-center gap-1 hover:text-amber-600 text-[11px]"
              title="รีเซ็ตข้อมูลตัวอย่าง"
            >
              <RefreshCw className="w-3 h-3" />
              <span>รีเซ็ตข้อมูลตัวอย่าง</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Modals Container */}
      <UseCaseDiagramModal
        isOpen={useCaseModalOpen}
        onClose={() => setUseCaseModalOpen(false)}
      />

      <SubmissionUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSubmitSuccess={handleCreateSubmission}
        initialKpi={selectedKpiForUpload}
        initialDomain={selectedDomainForUpload}
      />

      <DomainDetailModal
        domain={selectedDomainForDetail}
        isOpen={Boolean(selectedDomainForDetail)}
        onClose={() => setSelectedDomainForDetail(null)}
        onSelectKpiToUpload={handleSelectKpiToUpload}
        submissions={submissions}
        onOpenSubmissionDetail={(s) => setSelectedSubmissionForDetail(s)}
      />

      <SubmissionDetailModal
        submission={selectedSubmissionForDetail}
        isOpen={Boolean(selectedSubmissionForDetail)}
        onClose={() => setSelectedSubmissionForDetail(null)}
        isAdmin={currentUser.role === 'admin'}
        onReviewClick={(s) => {
          setSelectedSubmissionForDetail(null);
          setActiveTab('review_table');
        }}
      />

      <ExportReportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        submissions={submissions}
      />
    </div>
  );
}
