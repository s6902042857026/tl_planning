import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Filter, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  XCircle, 
  Building, 
  Calendar,
  FileText,
  Mail
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DEPARTMENTS, KPI_DOMAINS } from '../../data/kpiStructure';

export default function MissingSubmissionsTracker({ submissions }) {
  const { showToast } = useAuth();
  const [selectedDomainId, setSelectedDomainId] = useState('all');
  const [filterMissingOnly, setFilterMissingOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Build a department submission matrix
  const departmentRows = DEPARTMENTS.map(dept => {
    const deptSubs = submissions.filter(s => s.departmentId === dept.id);
    const domainFilteredSubs = selectedDomainId === 'all' 
      ? deptSubs 
      : deptSubs.filter(s => s.domainId === selectedDomainId);

    const approvedCount = domainFilteredSubs.filter(s => s.status === 'approved').length;
    const pendingCount = domainFilteredSubs.filter(s => s.status === 'pending').length;
    const revisionCount = domainFilteredSubs.filter(s => s.status === 'revision').length;
    const totalSent = domainFilteredSubs.length;

    // Determine status
    const isMissing = totalSent === 0;
    const isNeedsAttention = revisionCount > 0 || isMissing;

    return {
      ...dept,
      totalSent,
      approvedCount,
      pendingCount,
      revisionCount,
      isMissing,
      isNeedsAttention,
      submissions: domainFilteredSubs
    };
  });

  const filteredDepartments = departmentRows.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        d.head.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        d.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchMissing = filterMissingOnly ? d.isMissing : true;
    return matchSearch && matchMissing;
  });

  const totalMissing = departmentRows.filter(d => d.isMissing).length;

  const handleSendReminder = (deptName) => {
    showToast(`ส่งข้อความแจ้งเตือนเร่งรัดการส่งรายงานไปยัง "${deptName}" เรียบร้อยแล้ว`, 'success');
  };

  const handleSendAllReminders = () => {
    showToast(`ส่งหนังสือแจ้งเตือนเร่งรัดไปยัง ${totalMissing} แผนกที่ยังไม่ส่งงานเรียบร้อยแล้ว`, 'success');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-500" />
            ติดตามและคัดกรองผู้ยังไม่ส่งงาน (Missing Submissions Tracker)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ระบบตรวจสอบและเร่งรัดการส่งรายงานตัวชี้วัดรายแผนกวิชาและหน่วยงานภายในสถานศึกษา
          </p>
        </div>

        <button
          onClick={handleSendAllReminders}
          disabled={totalMissing === 0}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 text-xs sm:text-sm font-bold shadow-md transition-all"
        >
          <Mail className="w-4 h-4" />
          <span>แจ้งเตือนทุกแผนกที่ยังไม่ส่ง ({totalMissing} แผนก)</span>
        </button>
      </div>

      {/* Filter Matrix Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาชื่อแผนกวิชา, หัวหน้าแผนก หรือรหัสย่อ..."
            className="w-full text-xs sm:text-sm pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Domain Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedDomainId}
            onChange={(e) => setSelectedDomainId(e.target.value)}
            className="text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full md:w-56"
          >
            <option value="all">ทุกหมวดงานยุทธศาสตร์</option>
            {KPI_DOMAINS.map(d => (
              <option key={d.id} value={d.id}>{d.code}: {d.shortName}</option>
            ))}
          </select>

          {/* Toggle Missing Only */}
          <button
            onClick={() => setFilterMissingOnly(!filterMissingOnly)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              filterMissingOnly
                ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
          >
            {filterMissingOnly ? '✓ แสดงเฉพาะผู้ยังไม่ส่ง' : 'แสดงเฉพาะผู้ยังไม่ส่ง'}
          </button>
        </div>
      </div>

      {/* Grid of Departments Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDepartments.map((dept) => (
          <div
            key={dept.id}
            className={`bg-white rounded-2xl p-5 border transition-all duration-200 shadow-soft flex flex-col justify-between ${
              dept.isMissing
                ? 'border-rose-200 hover:border-rose-300 bg-rose-50/20'
                : dept.revisionCount > 0
                ? 'border-amber-200 hover:border-amber-300 bg-amber-50/20'
                : 'border-slate-200 hover:border-brand-300'
            }`}
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    dept.isMissing ? 'bg-rose-100 text-rose-700' : 'bg-brand-100 text-brand-700'
                  }`}>
                    {dept.code}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm leading-snug">{dept.name}</h4>
                    <span className="text-[11px] text-slate-400">{dept.category}</span>
                  </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                  dept.isMissing
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : dept.revisionCount > 0
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {dept.isMissing ? 'ยังไม่ส่งงาน' : dept.revisionCount > 0 ? 'มีงานต้องแก้' : 'ส่งแล้ว'}
                </span>
              </div>

              {/* Head Name */}
              <div className="text-xs text-slate-500 mt-2 mb-3">
                หัวหน้างาน: <strong className="text-slate-700">{dept.head}</strong>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-400">อนุมัติแล้ว</div>
                  <div className="font-bold text-emerald-600 text-sm">{dept.approvedCount}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">รอตรวจ</div>
                  <div className="font-bold text-amber-600 text-sm">{dept.pendingCount}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">ต้องแก้</div>
                  <div className="font-bold text-rose-600 text-sm">{dept.revisionCount}</div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                รวม {dept.totalSent} รายการ
              </span>

              {dept.isMissing ? (
                <button
                  onClick={() => handleSendReminder(dept.name)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors"
                >
                  <Bell className="w-3 h-3" />
                  <span>ส่งข้อความเตือน</span>
                </button>
              ) : (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> ส่งเรียบร้อย
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
