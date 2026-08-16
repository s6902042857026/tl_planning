import React, { useState, useEffect } from 'react';
import { X, Upload, FileText, CheckCircle2, DollarSign, Link as LinkIcon, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { KPI_DOMAINS, DEPARTMENTS, FISCAL_YEARS } from '../../data/kpiStructure';

export default function SubmissionUploadModal({ 
  isOpen, 
  onClose, 
  onSubmitSuccess, 
  initialKpi = null, 
  initialDomain = null 
}) {
  const { currentUser, showToast } = useAuth();

  const [selectedDomainId, setSelectedDomainId] = useState(initialDomain?.id || KPI_DOMAINS[0].id);
  const [selectedKpiId, setSelectedKpiId] = useState(initialKpi?.id || '');
  const [departmentId, setDepartmentId] = useState(currentUser.departmentId || 'dept_elec');
  const [projectName, setProjectName] = useState('');
  const [fiscalYear, setFiscalYear] = useState('2568');
  const [academicYear, setAcademicYear] = useState('2567');
  const [budgetPlanned, setBudgetPlanned] = useState('');
  const [budgetSpent, setBudgetSpent] = useState('');
  const [pdcaStage, setPdcaStage] = useState('Plan');
  const [notes, setNotes] = useState('');
  const [externalLink, setExternalLink] = useState('');
  
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state when initial props change
  useEffect(() => {
    if (initialDomain) {
      setSelectedDomainId(initialDomain.id);
    }
    if (initialKpi) {
      setSelectedKpiId(initialKpi.id);
      setProjectName(initialKpi.title);
    }
  }, [initialDomain, initialKpi]);

  if (!isOpen) return null;

  const currentDomain = KPI_DOMAINS.find(d => d.id === selectedDomainId) || KPI_DOMAINS[0];
  const allKpisInDomain = currentDomain.categories.flatMap(c => c.kpis);

  // Automatically select first KPI if none selected
  const activeKpiId = selectedKpiId || (allKpisInDomain[0]?.id || '');
  const currentKpi = allKpisInDomain.find(k => k.id === activeKpiId) || allKpisInDomain[0];

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (filesList) => {
    const newFiles = Array.from(filesList).map(file => ({
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      type: file.type || 'application/octet-stream',
      url: '#'
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) {
      showToast('กรุณาระบุชื่อโครงการ หรือหัวข้อเอกสารที่รายงาน', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const deptObj = DEPARTMENTS.find(d => d.id === departmentId);
      
      const payload = {
        kpiId: currentKpi.id,
        kpiCode: currentKpi.code,
        kpiTitle: currentKpi.title,
        domainId: currentDomain.id,
        domainName: currentDomain.name,
        departmentId: deptObj?.id || departmentId,
        departmentName: deptObj?.name || 'แผนกวิชาทั่วไป',
        submittedBy: currentUser.name,
        submittedById: currentUser.id,
        fiscalYear,
        academicYear,
        projectName,
        budgetPlanned: Number(budgetPlanned) || 0,
        budgetSpent: Number(budgetSpent) || 0,
        pdcaStage,
        notes: notes + (externalLink ? `\nลิงก์เอกสารออนไลน์: ${externalLink}` : ''),
        documents: uploadedFiles.length > 0 ? uploadedFiles : [
          { name: `${projectName.substring(0, 20)}_เอกสารรายงาน.pdf`, size: '2.5 MB', type: 'application/pdf', url: '#' }
        ]
      };

      await onSubmitSuccess(payload);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      showToast('ส่งรายงานตัวชี้วัดสำเร็จเรียบร้อยแล้ว!', 'success');
      onClose();
    } catch (err) {
      showToast('เกิดข้อผิดพลาดในการส่งข้อมูล: ' + err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-brand-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/10">
              <Upload className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">แบบฟอร์มส่งรายงานตัวชี้วัด / อัปโหลดเอกสาร</h2>
              <p className="text-xs text-brand-100 font-light">
                ฝ่ายยุทธศาสตร์และแผนงาน สำนักงานคณะกรรมการการอาชีวศึกษา
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 bg-slate-50">
          
          {/* Domain & KPI Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                1. หมวดงานยุทธศาสตร์ (Strategic Domain) *
              </label>
              <select
                value={selectedDomainId}
                onChange={(e) => {
                  setSelectedDomainId(e.target.value);
                  const firstKpi = KPI_DOMAINS.find(d => d.id === e.target.value)?.categories[0]?.kpis[0];
                  if (firstKpi) setSelectedKpiId(firstKpi.id);
                }}
                className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                {KPI_DOMAINS.map(d => (
                  <option key={d.id} value={d.id}>{d.code}: {d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                2. เลือกตัวชี้วัดที่ต้องการรายงาน (KPI Indicator) *
              </label>
              <select
                value={activeKpiId}
                onChange={(e) => setSelectedKpiId(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                {allKpisInDomain.map(kpi => (
                  <option key={kpi.id} value={kpi.id}>
                    [{kpi.code}] {kpi.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Current KPI Info Box */}
          {currentKpi && (
            <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-slate-700 space-y-1">
              <div className="font-bold text-brand-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-brand-600" />
                <span>เกณฑ์ตัวชี้วัด: {currentKpi.title}</span>
              </div>
              <p className="text-slate-600">{currentKpi.description}</p>
              <div className="flex flex-wrap gap-3 pt-1 text-[11px] text-slate-500">
                <span>หน่วยนับ: <strong>{currentKpi.targetUnit}</strong></span>
                <span>•</span>
                <span>เป้าหมาย: <strong>{currentKpi.targetValue}</strong></span>
                <span>•</span>
                <span>ความถี่: <strong>{currentKpi.frequency}</strong></span>
              </div>
            </div>
          )}

          {/* Project Details */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ชื่อโครงการ / ผลงาน / ชื่อเอกสารรายงาน *
              </label>
              <input
                type="text"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="เช่น โครงการพัฒนาทักษะวิชาชีพ หรือ เล่มรายงาน SAR แผนกวิชา..."
                className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  แผนกวิชา / หน่วยงาน *
                </label>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  {DEPARTMENTS.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ปีงบประมาณ
                </label>
                <select
                  value={fiscalYear}
                  onChange={(e) => setFiscalYear(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  {FISCAL_YEARS.map(y => (
                    <option key={y} value={y}>พ.ศ. {y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ขั้นตอน PDCA
                </label>
                <select
                  value={pdcaStage}
                  onChange={(e) => setPdcaStage(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:outline-none font-semibold text-brand-700"
                >
                  <option value="Plan">1. Plan (วางแผน/ขออนุมัติ)</option>
                  <option value="Do">2. Do (ดำเนินการ/จัดกิจกรรม)</option>
                  <option value="Check">3. Check (ประเมินผล/สรุป)</option>
                  <option value="Action">4. Action (ปรับปรุง/ขยายผล)</option>
                </select>
              </div>
            </div>

            {/* Budget Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  งบประมาณตามแผนที่ได้รับจัดสรร (บาท)
                </label>
                <input
                  type="number"
                  value={budgetPlanned}
                  onChange={(e) => setBudgetPlanned(e.target.value)}
                  placeholder="0.00"
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  งบประมาณที่ใช้จ่ายจริง / เบิกจ่าย (บาท)
                </label>
                <input
                  type="number"
                  value={budgetSpent}
                  onChange={(e) => setBudgetSpent(e.target.value)}
                  placeholder="0.00"
                  className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:outline-none font-mono text-emerald-700"
                />
              </div>
            </div>
          </div>

          {/* File Upload Dropzone */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
            <label className="block text-xs font-bold text-slate-700">
              เอกสารหลักฐาน / ไฟล์แนบ (รองรับ PDF, Docx, Xlsx, รูปภาพ, Zip)
            </label>

            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleFileDrop}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                isDragging ? 'border-brand-500 bg-brand-50/50' : 'border-slate-300 hover:border-brand-400 bg-slate-50'
              }`}
            >
              <Upload className="w-8 h-8 text-brand-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">
                ลากไฟล์มาวางที่นี่ หรือ <label className="text-brand-600 cursor-pointer underline hover:text-brand-800">เลือกไฟล์จากเครื่อง<input type="file" multiple onChange={handleFileInput} className="hidden" /></label>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                ขนาดไฟล์ไม่เกิน 50 MB ต่อไฟล์
              </p>
            </div>

            {/* Uploaded File List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="text-xs font-semibold text-slate-700">ไฟล์ที่เลือก ({uploadedFiles.length} ไฟล์):</div>
                {uploadedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 text-brand-600 flex-shrink-0" />
                      <span className="font-medium text-slate-800 truncate">{file.name}</span>
                      <span className="text-slate-400">({file.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* External Cloud Link */}
            <div className="pt-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">
                หรือแนบลิงก์ Google Drive / Web SAR / OneDrive (ทางเลือก)
              </label>
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-slate-400" />
                <input
                  type="url"
                  value={externalLink}
                  onChange={(e) => setExternalLink(e.target.value)}
                  placeholder="https://drive.google.com/drive/folders/..."
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:ring-1 focus:ring-brand-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Notes & Summary */}
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              หมายเหตุ / สรุปผลการดำเนินงานเบื้องต้น
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="ระบุผลสัมฤทธิ์ กลุ่มเป้าหมาย หรือประเด็นสำคัญที่ต้องการแจ้งเจ้าหน้าที่ฝ่ายแผนงาน..."
              className="w-full text-xs sm:text-sm p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'กำลังบันทึกข้อมูล...' : 'ยืนยันการส่งรายงานตัวชี้วัด'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
