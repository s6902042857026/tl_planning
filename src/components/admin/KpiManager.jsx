import React, { useState } from 'react';
import { SlidersHorizontal, Plus, Edit2, Trash2, CheckCircle2, Save, X, FileText } from 'lucide-react';
import { KPI_DOMAINS } from '../../data/kpiStructure';
import { useAuth } from '../../context/AuthContext';

export default function KpiManager() {
  const { showToast } = useAuth();
  const [domains, setDomains] = useState(KPI_DOMAINS);
  const [selectedDomainId, setSelectedDomainId] = useState(KPI_DOMAINS[0].id);
  const [editingKpi, setEditingKpi] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New KPI Form State
  const [formCode, setFormCode] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formUnit, setFormUnit] = useState('เล่ม/ฉบับ');
  const [formTarget, setFormTarget] = useState('1');
  const [formRoles, setFormRoles] = useState('ทุกแผนกวิชา');

  const currentDomain = domains.find(d => d.id === selectedDomainId) || domains[0];

  const handleEditClick = (kpi) => {
    setEditingKpi(kpi);
    setFormCode(kpi.code);
    setFormTitle(kpi.title);
    setFormDesc(kpi.description);
    setFormUnit(kpi.targetUnit);
    setFormTarget(String(kpi.targetValue));
    setFormRoles(kpi.responsibleRoles?.join(', ') || '');
    setIsAddingNew(false);
  };

  const handleAddNewClick = () => {
    setEditingKpi(null);
    setIsAddingNew(true);
    setFormCode(`KPI-${currentDomain.code.replace('D', '')}.${currentDomain.categories[0]?.kpis.length + 1 || 1}`);
    setFormTitle('');
    setFormDesc('');
    setFormUnit('รายการ');
    setFormTarget('1');
    setFormRoles('ทุกแผนกวิชา');
  };

  const handleSaveKpi = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      showToast('กรุณาระบุชื่อตัวชี้วัด', 'error');
      return;
    }

    if (isAddingNew) {
      const newKpiObj = {
        id: `kpi_custom_${Date.now()}`,
        code: formCode,
        title: formTitle,
        description: formDesc,
        targetUnit: formUnit,
        targetValue: Number(formTarget) || 1,
        frequency: 'รายปีงบประมาณ',
        responsibleRoles: formRoles.split(',').map(r => r.trim()),
        requiredFileTypes: ['pdf', 'docx']
      };

      const updatedDomains = domains.map(d => {
        if (d.id === currentDomain.id) {
          const updatedCats = [...d.categories];
          updatedCats[0].kpis.push(newKpiObj);
          return { ...d, categories: updatedCats };
        }
        return d;
      });

      setDomains(updatedDomains);
      showToast(`เพิ่มตัวชี้วัด "${formTitle}" เรียบร้อยแล้ว`, 'success');
      setIsAddingNew(false);
    } else if (editingKpi) {
      const updatedDomains = domains.map(d => {
        if (d.id === currentDomain.id) {
          const updatedCats = d.categories.map(cat => ({
            ...cat,
            kpis: cat.kpis.map(k => {
              if (k.id === editingKpi.id) {
                return {
                  ...k,
                  code: formCode,
                  title: formTitle,
                  description: formDesc,
                  targetUnit: formUnit,
                  targetValue: Number(formTarget) || 1,
                  responsibleRoles: formRoles.split(',').map(r => r.trim())
                };
              }
              return k;
            })
          }));
          return { ...d, categories: updatedCats };
        }
        return d;
      });

      setDomains(updatedDomains);
      showToast(`ปรับปรุงตัวชี้วัด "${formTitle}" เรียบร้อยแล้ว`, 'success');
      setEditingKpi(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <SlidersHorizontal className="w-6 h-6 text-brand-600" />
            จัดการหมวดหมู่และเกณฑ์ตัวชี้วัด (KPI Master Data)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            กำหนดตัวชี้วัด ค่าน้ำหนัก เป้าหมาย และผู้รับผิดชอบสำหรับปีงบประมาณ
          </p>
        </div>

        <button
          onClick={handleAddNewClick}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold shadow-md transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>+ เพิ่มตัวชี้วัดใหม่</span>
        </button>
      </div>

      {/* Domain Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {domains.map(d => (
          <button
            key={d.id}
            onClick={() => {
              setSelectedDomainId(d.id);
              setEditingKpi(null);
              setIsAddingNew(false);
            }}
            className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
              selectedDomainId === d.id
                ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div>{d.code}</div>
            <div className="text-[11px] font-normal truncate mt-0.5">{d.shortName}</div>
          </button>
        ))}
      </div>

      {/* Main KPI Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">
            รายการตัวชี้วัดใน {currentDomain.name}
          </span>
          <span className="text-xs text-slate-500">
            ทั้งหมด {currentDomain.categories.reduce((a, b) => a + b.kpis.length, 0)} ตัวชี้วัด
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {currentDomain.categories.map(cat => (
            <div key={cat.id} className="p-4 space-y-3">
              <div className="font-bold text-xs text-brand-800 bg-brand-50/60 p-2 rounded-lg border border-brand-100">
                หมวด: {cat.name} ({cat.kpis.length} ตัวชี้วัด)
              </div>

              <div className="space-y-2">
                {cat.kpis.map(kpi => (
                  <div key={kpi.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs hover:bg-white hover:shadow-xs transition-all">
                    <div className="space-y-1 flex-1 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-brand-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {kpi.code}
                        </span>
                        <strong className="text-slate-800 text-sm">{kpi.title}</strong>
                      </div>
                      <p className="text-slate-500 text-xs">{kpi.description}</p>
                      <div className="text-[11px] text-slate-400">
                        เป้าหมาย: <strong className="text-slate-600">{kpi.targetValue} {kpi.targetUnit}</strong> • ผู้รับผิดชอบ: {kpi.responsibleRoles?.join(', ')}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEditClick(kpi)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-brand-500 hover:text-brand-600 text-slate-700 text-xs font-semibold shadow-2xs"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>แก้ไข</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit / Add KPI Modal Dialog */}
      {(editingKpi || isAddingNew) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {isAddingNew ? 'เพิ่มตัวชี้วัดใหม่' : `แก้ไขตัวชี้วัด ${editingKpi?.code}`}
              </h3>
              <button onClick={() => { setEditingKpi(null); setIsAddingNew(false); }} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSaveKpi} className="p-6 space-y-4 text-xs sm:text-sm bg-slate-50">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">รหัสตัวชี้วัด *</label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 font-mono"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">ชื่อตัวชี้วัด *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">คำอธิบายและแนวทางประเมิน</label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">หน่วยนับเป้าหมาย</label>
                  <input
                    type="text"
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">ค่าเป้าหมายเชิงตัวเลข</label>
                  <input
                    type="number"
                    value={formTarget}
                    onChange={(e) => setFormTarget(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">บทบาทผู้รับผิดชอบ (คั่นด้วยจุลภาค)</label>
                <input
                  type="text"
                  value={formRoles}
                  onChange={(e) => setFormRoles(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setEditingKpi(null); setIsAddingNew(false); }}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md"
                >
                  บันทึกข้อมูลตัวชี้วัด
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
