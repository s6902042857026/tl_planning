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
  Bell,
  KeyRound,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { FISCAL_YEARS, DEPARTMENTS } from '../../data/kpiStructure';
import { isSupabaseConfigured } from '../../lib/supabase';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  onOpenUseCaseModal, 
  onOpenUploadModal,
  onOpenChangePassword
}) {
  const { 
    currentUser, 
    logout,
    tvMode, 
    toggleTvMode, 
    activeFiscalYear, 
    setActiveFiscalYear 
  } = useAuth();

  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getNavLinks = () => {
    if (currentUser.role === 'user') {
      return [
        { id: 'my_submissions', label: 'สถานะการส่งงานของฉัน', icon: FileText },
        { id: 'domains', label: 'ตัวชี้วัด 6 ด้าน', icon: SlidersHorizontal }
      ];
    }

    if (currentUser.role === 'admin') {
      return [
        { id: 'review_table', label: 'ตรวจสอบและอนุมัติเอกสาร', icon: CheckCircle2 },
        { id: 'missing_tracker', label: 'ติดตามผู้ยังไม่ส่งงาน', icon: Bell },
        { id: 'domains', label: 'ตัวชี้วัด 6 ด้าน', icon: SlidersHorizontal },
        { id: 'kpi_manager', label: 'จัดการหมวดหมู่ตัวชี้วัด', icon: SlidersHorizontal }
      ];
    }

    if (currentUser.role === 'executive') {
      return [
        { id: 'dashboard', label: 'แดชบอร์ดภาพรวม', icon: BarChart3 },
        { id: 'domains', label: 'ตัวชี้วัด 6 ด้าน', icon: SlidersHorizontal },
        { id: 'executive_pdca', label: 'สรุปผลสัมฤทธิ์ PDCA & งบประมาณ', icon: BarChart3 },
        { id: 'awards_mou', label: 'ผลงาน รางวัล & MOU', icon: Award }
      ];
    }

    return [
      { id: 'domains', label: 'ตัวชี้วัด 6 ด้าน', icon: SlidersHorizontal }
    ];
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-amber-500 p-0.5 shadow-md flex items-center justify-center flex-shrink-0">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center overflow-hidden">
                <img 
                  src="/logotl.png" 
                  alt="วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์" 
                  onError={(e) => { e.target.onerror = null; e.target.src = '/favicon.svg'; }}
                  className="w-10 h-10 object-contain" 
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-slate-900 text-base sm:text-lg leading-tight tracking-tight">
                  ระบบติดตามตัวชี้วัด ฝ่ายยุทธศาสตร์และแผนงาน
                </h1>
              </div>
              <p className="text-xs text-brand-700 font-medium">
                วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์ (สอศ.)
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

            {/* User Profile Menu */}
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
                    {currentUser.role === 'admin' ? 'ฝ่ายแผนงาน (Admin)' :
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
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        currentUser.role === 'admin' ? 'bg-emerald-100 text-emerald-800' :
                        currentUser.role === 'executive' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {currentUser.role === 'admin' ? 'สิทธิ์: เจ้าหน้าที่ฝ่ายแผนฯ (Admin)' :
                         currentUser.role === 'executive' ? 'สิทธิ์: ผู้บริหารสถานศึกษา (Executive)' :
                         'สิทธิ์: ผู้ใช้งานทั่วไป (User)'}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                    <div className="mt-1 text-[11px] text-slate-600 font-medium">
                      <span>สังกัด: </span>
                      <span className="text-slate-800 font-semibold">{currentUser.departmentName || 'วิทยาลัยเทคนิคท่าหลวงฯ'}</span>
                    </div>
                    {currentUser.position && (
                      <div className="text-[10px] text-slate-500">
                        <span>ตำแหน่ง: </span>
                        <span>{currentUser.position}</span>
                      </div>
                    )}
                  </div>

                  {/* Account Actions */}
                  <div className="p-2 space-y-1">
                    {onOpenChangePassword && (
                      <button
                        onClick={() => {
                          setRoleDropdownOpen(false);
                          onOpenChangePassword();
                        }}
                        className="w-full flex items-center gap-2.5 p-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 text-left transition-colors"
                      >
                        <KeyRound className="w-4 h-4 text-brand-600" />
                        <span>เปลี่ยนรหัสผ่าน (Change Password)</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setRoleDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 p-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 text-left transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      <span>ออกจากระบบ (Sign Out)</span>
                    </button>
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
            <div className="bg-slate-50 rounded-xl p-3 mb-2">
              <div className="text-xs font-bold text-slate-800">{currentUser.name}</div>
              <div className="text-[11px] text-slate-500">{currentUser.email}</div>
              <div className="text-[11px] text-brand-700 mt-0.5 font-semibold">
                {currentUser.role === 'admin' ? 'เจ้าหน้าที่ฝ่ายแผนฯ (Admin)' :
                 currentUser.role === 'executive' ? 'ผู้บริหารสถานศึกษา (Executive)' :
                 'ผู้ใช้งานทั่วไป (User)'} • {currentUser.departmentName}
              </div>
            </div>

            {/* Mobile Account Actions */}
            <div className="flex items-center justify-between gap-2">
              {onOpenChangePassword && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenChangePassword();
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50"
                >
                  <KeyRound className="w-3.5 h-3.5 text-brand-600" />
                  <span>เปลี่ยนรหัสผ่าน</span>
                </button>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-rose-200 text-xs font-semibold text-rose-600 bg-rose-50"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
