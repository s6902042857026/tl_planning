import React, { useState } from 'react';
import { 
  Tv, 
  Layers, 
  User, 
  ShieldCheck, 
  Award, 
  Database, 
  Calendar, 
  ChevronDown, 
  CheckCircle2,
  Menu,
  X,
  FileUp,
  FileText,
  BarChart3,
  SlidersHorizontal,
  Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FISCAL_YEARS, DEPARTMENTS } from '../../data/kpiStructure';
import { isSupabaseConfigured } from '../../lib/supabase';

export default function Navbar({ activeTab, setActiveTab, onOpenUseCaseModal, onOpenUploadModal }) {
  const { 
    currentUser, 
    switchRole, 
    setDepartment,
    tvMode, 
    toggleTvMode, 
    activeFiscalYear, 
    setActiveFiscalYear 
  } = useAuth();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getNavLinks = () => {
    const base = [
      { id: 'dashboard', label: 'แดชบอร์ดภาพรวม', icon: BarChart3 },
      { id: 'domains', label: 'ตัวชี้วัด 5 ด้าน', icon: SlidersHorizontal }
    ];

    if (currentUser.role === 'user') {
      return [
        ...base,
        { id: 'my_submissions', label: 'สถานะการส่งงาน', icon: FileText }
      ];
    }

    if (currentUser.role === 'admin') {
      return [
        ...base,
        { id: 'review_table', label: 'ตรวจสอบและอนุมัติเอกสาร', icon: CheckCircle2 },
        { id: 'missing_tracker', label: 'ติดตามผู้ยังไม่ส่งงาน', icon: Bell },
        { id: 'kpi_manager', label: 'จัดการหมวดหมู่ตัวชี้วัด', icon: SlidersHorizontal }
      ];
    }

    if (currentUser.role === 'executive') {
      return [
        ...base,
        { id: 'executive_pdca', label: 'สรุปผลสัมฤทธิ์ PDCA & งบประมาณ', icon: BarChart3 },
        { id: 'awards_mou', label: 'ผลงาน รางวัล & MOU', icon: Award }
      ];
    }

    return base;
  };

  const navLinks = getNavLinks();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Utility Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            สำนักงานคณะกรรมการการอาชีวศึกษา (สอศ.)
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-400">ระบบติดตามและประเมินผลตัวชี้วัดตามมาตรฐาน สอศ.</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Database status */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <Database className="w-3.5 h-3.5 text-slate-400" />
            <span>DB:</span>
            <span className={`px-1.5 py-0.2 rounded font-medium ${
              isSupabaseConfigured ? 'bg-emerald-900/60 text-emerald-300' : 'bg-blue-900/60 text-blue-300'
            }`}>
              {isSupabaseConfigured ? 'Supabase Live' : 'LocalStorage Mode'}
            </span>
          </div>

          {/* Fiscal Year Picker */}
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>ปีงบประมาณ:</span>
            <select
              value={activeFiscalYear}
              onChange={(e) => setActiveFiscalYear(e.target.value)}
              className="bg-slate-800 text-white text-xs rounded px-1.5 py-0.5 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              {FISCAL_YEARS.map(yr => (
                <option key={yr} value={yr}>พ.ศ. {yr}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-amber-500 p-0.5 shadow-md flex items-center justify-center flex-shrink-0">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <img src="/favicon.svg" alt="TTC Planning Logo" className="w-8 h-8" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-900 text-base sm:text-lg leading-tight tracking-tight">
                  ระบบติดตามตัวชี้วัด ฝ่ายยุทธศาสตร์และแผนงาน
                </h1>
              </div>
              <p className="text-xs text-slate-500 font-normal">
                Vocational Strategic & KPI Tracking System (TTC Planning)
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 border border-brand-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools & Role Switcher */}
          <div className="hidden sm:flex items-center gap-2.5">
            
            {/* Upload Button for general user */}
            {currentUser.role === 'user' && (
              <button
                onClick={onOpenUploadModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-all hover:shadow"
              >
                <FileUp className="w-4 h-4" />
                <span>+ ส่งรายงานตัวชี้วัด</span>
              </button>
            )}

            {/* TV / Projector Mode Toggle */}
            <button
              onClick={toggleTvMode}
              title="เปิดโหมดฉายจอทีวี / โปรเจคเตอร์ สำหรับห้องประชุม"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                tvMode
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm animate-pulse'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>โหมดจอทีวี / Projector</span>
            </button>

            {/* Use Case Modal Trigger */}
            <button
              onClick={onOpenUseCaseModal}
              title="เปิดดูแผนผังสิทธิ์การใช้งาน (Use Case Diagram)"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold transition-all"
            >
              <Layers className="w-4 h-4 text-indigo-600" />
              <span className="hidden xl:inline">ผัง Use Case สิทธิ์</span>
            </button>

            {/* Role Switcher Menu */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-xs text-left"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${
                  currentUser.role === 'admin' ? 'bg-emerald-600' :
                  currentUser.role === 'executive' ? 'bg-amber-600' :
                  'bg-brand-600'
                }`}>
                  {currentUser.role === 'admin' ? <ShieldCheck className="w-5 h-5" /> :
                   currentUser.role === 'executive' ? <Award className="w-5 h-5" /> :
                   <User className="w-5 h-5" />}
                </div>
                <div className="text-left leading-tight hidden xl:block">
                  <div className="text-xs font-bold text-slate-800">{currentUser.name}</div>
                  <div className="text-[10px] text-slate-500">
                    {currentUser.role === 'admin' ? 'เจ้าหน้าที่แผนฯ (Admin)' :
                     currentUser.role === 'executive' ? 'ผู้บริหาร (Executive)' :
                     'ผู้ใช้งานทั่วไป (User)'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {roleDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn"
                  onMouseLeave={() => setRoleDropdownOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">สลับสิทธิ์การใช้งาน (Role Switcher)</p>
                    <p className="text-[11px] text-slate-500">ทดสอบฟังก์ชันตาม Use Case ได้ทันที</p>
                  </div>

                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => {
                        switchRole('user');
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 p-2 rounded-lg text-xs font-medium text-left transition-colors ${
                        currentUser.role === 'user' ? 'bg-blue-50 text-blue-800 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <User className="w-4 h-4 text-blue-600" />
                      <div>
                        <div>1. ผู้ใช้งานทั่วไป (User)</div>
                        <div className="text-[10px] font-normal text-slate-500">ครู / แผนก / บุคลากร (อัปโหลด & ตรวจสอบ)</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        switchRole('admin');
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 p-2 rounded-lg text-xs font-medium text-left transition-colors ${
                        currentUser.role === 'admin' ? 'bg-emerald-50 text-emerald-800 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div>2. เจ้าหน้าที่ฝ่ายแผนฯ (Admin)</div>
                        <div className="text-[10px] font-normal text-slate-500">อนุมัติ / ตีกลับ / คัดกรองผู้ยังไม่ส่ง / จัดการ KPI</div>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        switchRole('executive');
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 p-2 rounded-lg text-xs font-medium text-left transition-colors ${
                        currentUser.role === 'executive' ? 'bg-amber-50 text-amber-800 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Award className="w-4 h-4 text-amber-600" />
                      <div>
                        <div>3. ผู้บริหาร (Executive)</div>
                        <div className="text-[10px] font-normal text-slate-500">แดชบอร์ด % สำเร็จ / ผลงาน / Export PDF/Excel</div>
                      </div>
                    </button>
                  </div>

                  {/* Department Switcher */}
                  <div className="pt-2 px-3 border-t border-slate-100">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">สังกัดแผนก / งาน:</label>
                    <select
                      value={currentUser.departmentId}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full text-xs p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    >
                      {DEPARTMENTS.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleTvMode}
              className={`p-2 rounded-lg ${tvMode ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-700'}`}
            >
              <Tv className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveTab(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          {currentUser.role === 'user' && (
            <button
              onClick={() => {
                onOpenUploadModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-medium"
            >
              <FileUp className="w-4 h-4" />
              <span>+ ส่งรายงานตัวชี้วัด</span>
            </button>
          )}

          <div className="pt-3 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-500 mb-2">สิทธิ์การใช้งานปัจจุบัน:</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => switchRole('user')}
                className={`p-2 rounded-lg text-xs font-medium text-center border ${
                  currentUser.role === 'user' ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 text-slate-700'
                }`}
              >
                ผู้ใช้
              </button>
              <button
                onClick={() => switchRole('admin')}
                className={`p-2 rounded-lg text-xs font-medium text-center border ${
                  currentUser.role === 'admin' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700'
                }`}
              >
                แผนงาน/Admin
              </button>
              <button
                onClick={() => switchRole('executive')}
                className={`p-2 rounded-lg text-xs font-medium text-center border ${
                  currentUser.role === 'executive' ? 'bg-amber-600 text-white border-amber-600' : 'bg-slate-50 text-slate-700'
                }`}
              >
                ผู้บริหาร
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
