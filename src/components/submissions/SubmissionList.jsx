import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  FileUp, 
  Download, 
  Eye,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { KPI_DOMAINS, DEPARTMENTS } from '../../data/kpiStructure';

export default function SubmissionList({ 
  submissions, 
  onOpenUploadModal, 
  onOpenDetailModal,
  onDeleteSubmission 
}) {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [domainFilter, setDomainFilter] = useState('all');

  const filtered = submissions.filter(sub => {
    const matchSearch = (sub.projectName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (sub.kpiTitle || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (sub.departmentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (sub.kpiCode || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'all' || sub.status === statusFilter;
    const matchDomain = domainFilter === 'all' || sub.domainId === domainFilter;
    return matchSearch && matchStatus && matchDomain;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand-600" />
            สถานะการส่งรายงานตัวชี้วัด
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ติดตามและตรวจสอบประวัติการส่งเอกสารตามตัวชี้วัดยุทธศาสตร์ทั้ง 5 ด้าน
          </p>
        </div>

        <button
          onClick={onOpenUploadModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ ส่งรายงานตัวชี้วัดใหม่</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาชื่อโครงการ, รหัสตัวชี้วัด, แผนกวิชา..."
            className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full md:w-40"
          >
            <option value="all">ทุกสถานะ ({submissions.length})</option>
            <option value="approved">อนุมัติแล้ว ({submissions.filter(s => s.status === 'approved').length})</option>
            <option value="pending">รอตรวจสอบ ({submissions.filter(s => s.status === 'pending').length})</option>
            <option value="revision">ส่งกลับแก้ไข ({submissions.filter(s => s.status === 'revision').length})</option>
          </select>

          {/* Domain Filter */}
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full md:w-48"
          >
            <option value="all">ทุกหมวดงาน 5 ด้าน</option>
            {KPI_DOMAINS.map(d => (
              <option key={d.id} value={d.id}>{d.shortName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Submissions List / Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <FileText className="w-12 h-12 mx-auto text-slate-300" />
            <p className="text-base font-semibold text-slate-600">ไม่พบรายการส่งรายงานที่ตรงกับเงื่อนไข</p>
            <p className="text-xs text-slate-400">ลองเปลี่ยนคำค้นหา หรือกดปุ่มส่งรายงานตัวชี้วัดด้านบน</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-3.5 px-4">รหัส / ตัวชี้วัด</th>
                  <th className="py-3.5 px-4">ชื่อโครงการ / เอกสาร</th>
                  <th className="py-3.5 px-4">แผนก / ผู้ส่ง</th>
                  <th className="py-3.5 px-4">งบประมาณ</th>
                  <th className="py-3.5 px-4">PDCA</th>
                  <th className="py-3.5 px-4 text-center">สถานะ</th>
                  <th className="py-3.5 px-4 text-center">คะแนน</th>
                  <th className="py-3.5 px-4 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 font-medium text-slate-800">
                      <div className="inline-block px-2 py-0.5 rounded bg-brand-50 text-brand-700 text-xs font-mono font-bold border border-brand-200 mb-1">
                        {sub.kpiCode}
                      </div>
                      <div className="text-xs text-slate-500 font-normal truncate max-w-[200px]" title={sub.kpiTitle}>
                        {sub.kpiTitle}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-800 truncate max-w-[240px]" title={sub.projectName}>
                        {sub.projectName}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {sub.documents?.length || 0} ไฟล์แนบ • ส่งเมื่อ {new Date(sub.submittedAt).toLocaleDateString('th-TH')}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800">{sub.departmentName}</div>
                      <div className="text-xs text-slate-400">{sub.submittedBy}</div>
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-700">
                      {sub.budgetPlanned ? `${Number(sub.budgetPlanned).toLocaleString()} ฿` : '-'}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                        {sub.pdcaStage || 'Plan'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {sub.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> อนุมัติ
                        </span>
                      )}
                      {sub.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3.5 h-3.5" /> รอตรวจ
                        </span>
                      )}
                      {sub.status === 'revision' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertCircle className="w-3.5 h-3.5" /> ให้แก้ไข
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center font-mono font-bold text-slate-700">
                      {sub.score !== null && sub.score !== undefined ? `${sub.score}/100` : '-'}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenDetailModal(sub)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 text-xs transition-colors"
                          title="ดูรายละเอียด"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {currentUser.role === 'admin' && (
                          <button
                            onClick={() => onDeleteSubmission(sub.id)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-400 text-xs transition-colors"
                            title="ลบรายการ"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
