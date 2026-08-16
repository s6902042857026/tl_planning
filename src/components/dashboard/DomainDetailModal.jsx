import React, { useState } from 'react';
import { X, FileUp, CheckCircle, FileText, Download, Users, Calendar, ArrowRight, ShieldCheck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function DomainDetailModal({ domain, isOpen, onClose, onSelectKpiToUpload, submissions, onOpenSubmissionDetail }) {
  const { currentUser } = useAuth();
  const [selectedCatId, setSelectedCatId] = useState(domain?.categories[0]?.id || null);

  if (!isOpen || !domain) return null;

  const currentCat = domain.categories.find(c => c.id === selectedCatId) || domain.categories[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className={`px-6 py-5 bg-gradient-to-r ${domain.color} text-white flex items-center justify-between`}>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-white/20 text-white text-xs font-mono font-bold">
                {domain.code}
              </span>
              <h2 className="text-xl font-bold">{domain.name}</h2>
            </div>
            <p className="text-xs text-white/80 mt-1 max-w-2xl">{domain.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="bg-slate-100 px-6 py-2 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
          {domain.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCatId(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCatId === cat.id
                  ? 'bg-white text-brand-700 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {cat.name} ({cat.kpis.length} ตัวชี้วัด)
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50">
          <div className="grid grid-cols-1 gap-4">
            {currentCat?.kpis.map((kpi) => {
              const kpiSubmissions = submissions.filter(s => s.kpiId === kpi.id);
              const approvedSub = kpiSubmissions.find(s => s.status === 'approved');

              return (
                <div
                  key={kpi.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:border-brand-300 transition-all"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-brand-50 text-brand-700 text-xs font-mono font-bold border border-brand-200">
                          {kpi.code}
                        </span>
                        <h4 className="font-bold text-slate-800 text-base">
                          {kpi.title}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {kpi.description}
                      </p>

                      {/* KPI Meta Badges */}
                      <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded">
                          <Users className="w-3 h-3 text-slate-400" />
                          ผู้รับผิดชอบ: <strong className="text-slate-700 font-medium">{kpi.responsibleRoles?.join(', ')}</strong>
                        </span>
                        <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          ความถี่: <strong className="text-slate-700 font-medium">{kpi.frequency}</strong>
                        </span>
                        <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded">
                          <FileText className="w-3 h-3 text-slate-400" />
                          เป้าหมาย: <strong className="text-brand-700 font-bold">{kpi.targetValue} {kpi.targetUnit}</strong>
                        </span>
                        <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded border border-amber-200">
                          สกุลไฟล์: {kpi.requiredFileTypes?.join(', ').toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Actions & Status */}
                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 flex-shrink-0">
                      {approvedSub ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>ผ่านเกณฑ์ประเมินแล้ว</span>
                        </div>
                      ) : kpiSubmissions.length > 0 ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>รอตรวจสอบ ({kpiSubmissions.length} รายการ)</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                          <span>ยังไม่มีรายงาน</span>
                        </div>
                      )}

                      <button
                        onClick={() => {
                          onClose();
                          onSelectKpiToUpload(kpi, domain);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-all"
                      >
                        <FileUp className="w-3.5 h-3.5" />
                        <span>ส่งรายงาน / อัปโหลด</span>
                      </button>
                    </div>
                  </div>

                  {/* Submissions List for this KPI */}
                  {kpiSubmissions.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50/70 p-3 rounded-xl">
                      <div className="text-xs font-bold text-slate-700 mb-2">ประวัติการส่งรายงานของตัวชี้วัดนี้ ({kpiSubmissions.length} รายการ):</div>
                      <div className="space-y-1.5">
                        {kpiSubmissions.map(sub => (
                          <div key={sub.id} className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-slate-200">
                            <div className="flex items-center gap-2 truncate">
                              <span className="font-semibold text-slate-800">{sub.departmentName}:</span>
                              <span className="text-slate-600 truncate">{sub.projectName}</span>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                                sub.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                                sub.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                'bg-rose-100 text-rose-800'
                              }`}>
                                {sub.status === 'approved' ? 'อนุมัติ' : sub.status === 'pending' ? 'รอตรวจ' : 'แก้ไข'}
                              </span>
                              <button
                                onClick={() => {
                                  onClose();
                                  onOpenSubmissionDetail(sub);
                                }}
                                className="text-brand-600 hover:underline font-medium"
                              >
                                รายละเอียด
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            จำนวนตัวชี้วัดทั้งหมดในหมวดนี้: <strong>{domain.categories.reduce((a, b) => a + b.kpis.length, 0)} ตัวชี้วัด</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-700 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}
