import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Search, 
  FileText, 
  Sliders, 
  MessageSquare, 
  Download, 
  Send,
  Eye
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ReviewTable({ submissions, onReviewSubmission, onOpenDetailModal }) {
  const { currentUser, showToast } = useAuth();
  
  const [selectedSub, setSelectedSub] = useState(null);
  const [statusAction, setStatusAction] = useState('approved');
  const [score, setScore] = useState('90');
  const [reviewComment, setReviewComment] = useState('');
  const [filterTab, setFilterTab] = useState('pending'); // 'pending' | 'all' | 'approved' | 'revision'
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = submissions.filter(s => {
    const matchSearch = (s.projectName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (s.departmentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (s.kpiTitle || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchTab = filterTab === 'all' || s.status === filterTab;
    return matchSearch && matchTab;
  });

  const handleOpenReviewModal = (sub) => {
    setSelectedSub(sub);
    setStatusAction(sub.status === 'pending' ? 'approved' : sub.status);
    setScore(sub.score ? String(sub.score) : '90');
    setReviewComment(sub.reviewComment || '');
  };

  const handleSaveReview = async (e) => {
    e.preventDefault();
    if (!selectedSub) return;

    try {
      await onReviewSubmission(selectedSub.id, {
        status: statusAction,
        score: Number(score),
        reviewComment,
        reviewerName: currentUser.name
      });
      showToast(`บันทึกผลการตรวจสอบสำหรับ ${selectedSub.projectName} เรียบร้อยแล้ว`, 'success');
      setSelectedSub(null);
    } catch (err) {
      showToast('เกิดข้อผิดพลาดในการบันทึก: ' + err.message, 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            ตรวจสอบและอนุมัติรายงานตัวชี้วัด (Admin Review)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            พิจารณาหลักฐาน ให้คะแนนประเมิน และอนุมัติหรือส่งกลับแก้ไขสำหรับรายงานที่ส่งเข้ามา
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setFilterTab('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterTab === 'pending' ? 'bg-white text-amber-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            รอตรวจสอบ ({submissions.filter(s => s.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilterTab('approved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterTab === 'approved' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            อนุมัติแล้ว ({submissions.filter(s => s.status === 'approved').length})
          </button>
          <button
            onClick={() => setFilterTab('revision')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterTab === 'revision' ? 'bg-white text-rose-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ส่งกลับแก้ไข ({submissions.filter(s => s.status === 'revision').length})
          </button>
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterTab === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ทั้งหมด ({submissions.length})
          </button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="ค้นหาตามชื่อโครงการ, แผนกวิชา หรือรหัสตัวชี้วัด..."
          className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white shadow-soft focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <CheckCircle2 className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-600">ไม่มีรายการในสถานะนี้</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-3.5 px-4">รหัส / หมวดงาน</th>
                  <th className="py-3.5 px-4">ชื่อโครงการ / ผลงาน</th>
                  <th className="py-3.5 px-4">แผนกวิชา / ผู้ส่ง</th>
                  <th className="py-3.5 px-4">เอกสารแนบ</th>
                  <th className="py-3.5 px-4 text-center">สถานะ</th>
                  <th className="py-3.5 px-4 text-center">คะแนน</th>
                  <th className="py-3.5 px-4 text-right">ดำเนินการตรวจ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-4 font-medium text-slate-800">
                      <div className="inline-block px-2 py-0.5 rounded bg-brand-50 text-brand-700 text-xs font-mono font-bold border border-brand-200">
                        {sub.kpiCode}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 truncate max-w-[180px]">{sub.domainName}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 truncate max-w-[240px]">{sub.projectName}</div>
                      <div className="text-xs text-slate-400">{sub.kpiTitle}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800">{sub.departmentName}</div>
                      <div className="text-xs text-slate-400">{sub.submittedBy}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-slate-600 text-xs">
                        <FileText className="w-3.5 h-3.5 text-brand-600" />
                        <span>{sub.documents?.length || 0} ไฟล์</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        sub.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        sub.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {sub.status === 'approved' ? 'อนุมัติแล้ว' : sub.status === 'pending' ? 'รอตรวจ' : 'ให้แก้ไข'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center font-mono font-bold text-slate-700">
                      {sub.score ? `${sub.score}/100` : '-'}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onOpenDetailModal(sub)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenReviewModal(sub)}
                          className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition-all"
                        >
                          ตรวจประเมิน
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Review Modal Dialog */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">ตรวจประเมินและอนุมัติเอกสาร</h3>
              <button onClick={() => setSelectedSub(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveReview} className="p-6 space-y-4 overflow-y-auto bg-slate-50 text-xs sm:text-sm">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">[{selectedSub.kpiCode}] {selectedSub.projectName}</div>
                <div className="text-slate-500 text-xs">แผนก: {selectedSub.departmentName} • ผู้ส่ง: {selectedSub.submittedBy}</div>
              </div>

              {/* Status Action Radio */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">ผลการพิจารณา *</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setStatusAction('approved')}
                    className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                      statusAction === 'approved'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                    }`}
                  >
                    ✓ อนุมัติ (Approved)
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusAction('revision')}
                    className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                      statusAction === 'revision'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-amber-50'
                    }`}
                  >
                    ⚠️ ส่งกลับแก้ไข
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusAction('rejected')}
                    className={`p-3 rounded-xl border text-center font-bold text-xs transition-all ${
                      statusAction === 'rejected'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                    }`}
                  >
                    ✕ ไม่อนุมัติ
                  </button>
                </div>
              </div>

              {/* Score Input */}
              {statusAction === 'approved' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    คะแนนประเมิน (0 - 100 คะแนน)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    className="w-full text-sm p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 font-mono"
                  />
                </div>
              )}

              {/* Comment */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ข้อเสนอแนะ / เหตุผลการพิจารณา
                </label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="ระบุข้อคิดเห็น เช่น เอกสารครบถ้วนสมบูรณ์ หรือ กรุณาแนบภาพถ่ายเพิ่มเติม..."
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSub(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md"
                >
                  บันทึกผลการตรวจสอบ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
