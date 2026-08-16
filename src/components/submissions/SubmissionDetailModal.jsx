import React from 'react';
import { X, FileText, CheckCircle2, Clock, AlertCircle, Download, Calendar, DollarSign, User, Building, MessageSquare } from 'lucide-react';

export default function SubmissionDetailModal({ submission, isOpen, onClose, onReviewClick = null, isAdmin = false }) {
  if (!isOpen || !submission) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-brand-500 text-white text-xs font-mono font-bold">
              {submission.kpiCode}
            </span>
            <h3 className="text-base font-bold truncate max-w-md">{submission.projectName}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-slate-50 text-xs sm:text-sm">
          
          {/* Status Alert Banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            submission.status === 'approved' ? 'bg-emerald-50 text-emerald-900 border-emerald-200' :
            submission.status === 'pending' ? 'bg-amber-50 text-amber-900 border-amber-200' :
            'bg-rose-50 text-rose-900 border-rose-200'
          }`}>
            {submission.status === 'approved' && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />}
            {submission.status === 'pending' && <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />}
            {submission.status === 'revision' && <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />}
            <div>
              <div className="font-bold text-sm">
                สถานะ: {
                  submission.status === 'approved' ? 'ผ่านการอนุมัติและประเมินผลเรียบร้อยแล้ว' :
                  submission.status === 'pending' ? 'อยู่ระหว่างการรอตรวจสอบโดยฝ่ายยุทธศาสตร์และแผนงาน' :
                  'เจ้าหน้าที่ส่งกลับเพื่อขอให้แก้ไขเพิ่มเติม'
                }
                {submission.score && <span className="ml-2 font-mono text-emerald-700">({submission.score}/100 คะแนน)</span>}
              </div>
              {submission.reviewComment && (
                <p className="mt-1 text-xs opacity-90">
                  <strong>ข้อเสนอแนะจากผู้ตรวจ:</strong> "{submission.reviewComment}"
                  {submission.reviewerName && <span className="block mt-0.5 text-[11px] text-slate-500">— ตรวจสอบโดย {submission.reviewerName}</span>}
                </p>
              )}
            </div>
          </div>

          {/* Submission Info Grid */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block">หมวดงานยุทธศาสตร์:</span>
              <strong className="text-slate-800">{submission.domainName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">หัวข้อตัวชี้วัด:</span>
              <strong className="text-slate-800">[{submission.kpiCode}] {submission.kpiTitle}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">หน่วยงาน / แผนกวิชา:</span>
              <strong className="text-slate-800">{submission.departmentName}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">ผู้จัดทำรายงาน:</span>
              <strong className="text-slate-800">{submission.submittedBy}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">ปีงบประมาณ / ปีการศึกษา:</span>
              <strong className="text-slate-800">พ.ศ. {submission.fiscalYear} (ปีการศึกษา {submission.academicYear})</strong>
            </div>
            <div>
              <span className="text-slate-400 block">ขั้นตอน PDCA:</span>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">
                {submission.pdcaStage || 'Plan'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">งบประมาณตามแผน:</span>
              <strong className="text-slate-800 font-mono">{Number(submission.budgetPlanned || 0).toLocaleString()} บาท</strong>
            </div>
            <div>
              <span className="text-slate-400 block">งบประมาณใช้จริง:</span>
              <strong className="text-emerald-700 font-mono">{Number(submission.budgetSpent || 0).toLocaleString()} บาท</strong>
            </div>
          </div>

          {/* Operational Notes */}
          {submission.notes && (
            <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-1">
              <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-brand-600" />
                สรุปผลการดำเนินงาน / หมายเหตุ
              </h4>
              <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">
                {submission.notes}
              </p>
            </div>
          )}

          {/* Attached Files */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-brand-600" />
              เอกสารแนบและหลักฐาน ({submission.documents?.length || 0} ไฟล์)
            </h4>
            <div className="space-y-2">
              {submission.documents?.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-4 h-4 text-brand-600 flex-shrink-0" />
                    <span className="font-medium text-slate-800 truncate">{doc.name}</span>
                    <span className="text-slate-400">({doc.size})</span>
                  </div>
                  <button
                    onClick={() => alert(`ดาวน์โหลดไฟล์: ${doc.name} (ในโหมด Demo)`)}
                    className="flex items-center gap-1 px-3 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold"
                  >
                    <Download className="w-3 h-3" />
                    <span>ดาวน์โหลด</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            ส่งเมื่อ: {new Date(submission.submittedAt).toLocaleString('th-TH')}
          </span>

          <div className="flex items-center gap-2">
            {isAdmin && onReviewClick && (
              <button
                onClick={() => {
                  onClose();
                  onReviewClick(submission);
                }}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors"
              >
                ตรวจสอบ & ประเมินผล
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-800 text-white text-xs font-medium transition-colors"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
