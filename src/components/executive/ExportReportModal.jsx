import React, { useState } from 'react';
import { X, Download, FileSpreadsheet, FileText, Printer, CheckCircle2, Sliders } from 'lucide-react';
import { exportService } from '../../services/exportService';
import { KPI_DOMAINS, FISCAL_YEARS } from '../../data/kpiStructure';
import { useAuth } from '../../context/AuthContext';

export default function ExportReportModal({ isOpen, onClose, submissions }) {
  const { activeFiscalYear, showToast } = useAuth();
  const [selectedFormat, setSelectedFormat] = useState('pdf'); // 'pdf' | 'excel' | 'csv'
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [reportTitle, setReportTitle] = useState('รายงานสรุปผลการติดตามตัวชี้วัด ฝ่ายยุทธศาสตร์และแผนงาน');

  if (!isOpen) return null;

  const filteredSubmissions = submissions.filter(s => {
    const matchDomain = selectedDomain === 'all' || s.domainId === selectedDomain;
    const matchStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchDomain && matchStatus;
  });

  const handleExport = () => {
    try {
      const stats = {
        fiscalYear: activeFiscalYear,
        overallCompletionRate: 78.3,
        budgetExecutionRate: 84.9
      };

      if (selectedFormat === 'excel') {
        exportService.exportToExcel(filteredSubmissions, KPI_DOMAINS, `รายงานตัวชี้วัด_ฝ่ายยุทธศาสตร์_${activeFiscalYear}.xlsx`);
        showToast('ส่งออกไฟล์ Excel สำเร็จเรียบร้อย', 'success');
      } else if (selectedFormat === 'csv') {
        exportService.exportToCSV(filteredSubmissions, KPI_DOMAINS, `รายงานตัวชี้วัด_${activeFiscalYear}.csv`);
        showToast('ส่งออกไฟล์ CSV สำเร็จเรียบร้อย', 'success');
      } else if (selectedFormat === 'pdf') {
        exportService.exportToPDF(stats, KPI_DOMAINS, filteredSubmissions, `รายงานสรุปตัวชี้วัด_${activeFiscalYear}.pdf`);
        showToast('สร้างเอกสาร PDF สรุปผลเรียบร้อย', 'success');
      }

      onClose();
    } catch (err) {
      showToast('เกิดข้อผิดพลาดในการส่งออก: ' + err.message, 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-brand-500/20 text-brand-300">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">ศูนย์ส่งออกรายงานราชการ (Export Center)</h3>
              <p className="text-xs text-slate-300">สร้างรายงานตัวชี้วัดมาตรฐาน สอศ. รูปแบบ PDF และ Excel</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm bg-slate-50">
          
          {/* Format Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">เลือกรูปแบบเอกสารที่ต้องการส่งออก *</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSelectedFormat('pdf')}
                className={`p-3.5 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-2 transition-all ${
                  selectedFormat === 'pdf'
                    ? 'bg-rose-50 border-rose-500 text-rose-800 ring-2 ring-rose-400/30'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-6 h-6 text-rose-600" />
                <span>PDF เอกสารราชการ</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFormat('excel')}
                className={`p-3.5 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-2 transition-all ${
                  selectedFormat === 'excel'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-400/30'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
                <span>Excel Spreadsheet (.xlsx)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFormat('csv')}
                className={`p-3.5 rounded-xl border text-center font-bold text-xs flex flex-col items-center gap-2 transition-all ${
                  selectedFormat === 'csv'
                    ? 'bg-blue-50 border-blue-500 text-blue-800 ring-2 ring-blue-400/30'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Sliders className="w-6 h-6 text-blue-600" />
                <span>CSV ข้อมูลดิบ</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">หัวข้อรายงาน</label>
            <input
              type="text"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">หมวดงานยุทธศาสตร์</label>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="all">รวมทั้งหมด 5 หมวดงาน</option>
                {KPI_DOMAINS.map(d => (
                  <option key={d.id} value={d.id}>{d.code}: {d.shortName}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">สถานะการประเมิน</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="all">ทุกสถานะ ({submissions.length} รายการ)</option>
                <option value="approved">เฉพาะที่อนุมัติแล้ว</option>
                <option value="pending">เฉพาะที่รอตรวจ</option>
              </select>
            </div>
          </div>

          {/* Preview Info */}
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-slate-600 flex items-center justify-between">
            <span>จำนวนรายการที่จะส่งออก:</span>
            <strong className="text-brand-700 font-bold">{filteredSubmissions.length} รายการ</strong>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>สั่งพิมพ์เอกสาร</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>ดาวน์โหลดเอกสาร</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
