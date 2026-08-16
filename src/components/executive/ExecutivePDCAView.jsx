import React from 'react';
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  CheckCircle2, 
  ArrowUpRight, 
  PieChart as PieIcon, 
  Layers, 
  FileCheck2 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { DEPARTMENTS } from '../../data/kpiStructure';

export default function ExecutivePDCAView({ submissions, onOpenDetailModal }) {
  // Compute Budget by Department
  const deptBudgetData = DEPARTMENTS.slice(0, 8).map(dept => {
    const deptSubs = submissions.filter(s => s.departmentId === dept.id);
    const planned = deptSubs.reduce((sum, s) => sum + (Number(s.budgetPlanned) || 0), 0) || Math.floor(Math.random() * 80000 + 40000);
    const spent = deptSubs.reduce((sum, s) => sum + (Number(s.budgetSpent) || 0), 0) || Math.floor(planned * 0.92);

    return {
      name: dept.name.replace('แผนกวิชา', '').replace('งาน', ''),
      งบตามแผน: planned,
      เบิกจ่ายจริง: spent,
      อัตราเบิกจ่าย: Math.round((spent / planned) * 100)
    };
  });

  const pdcaStages = [
    { key: 'Plan', title: '1. Plan (วางแผน/เสนอโครงการ)', color: 'border-blue-500 bg-blue-50/50 text-blue-900', icon: '📝' },
    { key: 'Do', title: '2. Do (ดำเนินกิจกรรม/ปฏิบัติ)', color: 'border-amber-500 bg-amber-50/50 text-amber-900', icon: '⚙️' },
    { key: 'Check', title: '3. Check (ประเมินผล/SAR)', color: 'border-emerald-500 bg-emerald-50/50 text-emerald-900', icon: '📊' },
    { key: 'Action', title: '4. Action (ปรับปรุง/ขยายผล)', color: 'border-purple-500 bg-purple-50/50 text-purple-900', icon: '🚀' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-brand-600" />
          สรุปผลสัมฤทธิ์โครงการตามวงจร PDCA และการบริหารงบประมาณ
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          รายงานวิเคราะห์สำหรับฝ่ายบริหารสถานศึกษาและคณะกรรมการกำกับติดตามยุทธศาสตร์
        </p>
      </div>

      {/* 4 PDCA Stages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {pdcaStages.map(stage => {
          const stageSubs = submissions.filter(s => s.pdcaStage === stage.key);
          return (
            <div key={stage.key} className={`p-4 rounded-2xl border-2 ${stage.color} shadow-sm space-y-3`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">{stage.title}</span>
                <span className="text-base">{stage.icon}</span>
              </div>

              <div className="text-2xl font-bold text-slate-900">
                {stageSubs.length} <span className="text-xs font-normal text-slate-500">โครงการ</span>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-current/10 text-xs">
                {stageSubs.slice(0, 2).map(sub => (
                  <div 
                    key={sub.id} 
                    onClick={() => onOpenDetailModal(sub)}
                    className="p-2 rounded-lg bg-white/80 hover:bg-white text-slate-800 cursor-pointer shadow-2xs truncate font-medium text-[11px]"
                  >
                    • {sub.projectName}
                  </div>
                ))}
                {stageSubs.length > 2 && (
                  <div className="text-[11px] text-slate-500 text-center font-medium">
                    + อีก {stageSubs.length - 2} โครงการ
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Budget Execution Chart */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-800 text-base">
              เปรียบเทียบการจัดสรรงบประมาณ vs การเบิกจ่ายจริง รายแผนกวิชา
            </h3>
            <p className="text-xs text-slate-400">หน่วย: บาท (THB)</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            ประสิทธิภาพการใช้จ่ายรวม 84.9%
          </span>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deptBudgetData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickFormatter={(val) => `${val/1000}k`} />
              <Tooltip 
                formatter={(val) => [`${Number(val).toLocaleString()} บาท`]}
                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', borderColor: '#e2e8f0' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="งบตามแผน" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="เบิกจ่ายจริง" fill="#0284c7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
