import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Award, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Database,
  Layers,
  FileCheck2,
  Tv,
  Briefcase,
  HelpCircle,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DEPARTMENTS, KPI_DOMAINS } from '../../data/kpiStructure';

export default function AuthPage({ onOpenUseCaseModal }) {
  const { login, register, isSupabaseConfigured } = useAuth();

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showDefaultAccounts, setShowDefaultAccounts] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    departmentId: 'dept_elec',
    role: 'user',
    position: 'ครูผู้สอน / ผู้รับผิดชอบโครงการ'
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!loginForm.email || !loginForm.password) {
      setErrorMessage('กรุณากรอกอีเมล/ชื่อผู้ใช้ และรหัสผ่าน');
      return;
    }

    try {
      setLoading(true);
      await login(loginForm);
    } catch (err) {
      setErrorMessage(err.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!registerForm.fullName || !registerForm.email || !registerForm.password) {
      setErrorMessage('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน');
      return;
    }

    if (registerForm.password.length < 6) {
      setErrorMessage('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setErrorMessage('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    try {
      setLoading(true);
      await register({
        email: registerForm.email,
        password: registerForm.password,
        fullName: registerForm.fullName,
        role: registerForm.role,
        departmentId: registerForm.departmentId,
        position: registerForm.position
      });
    } catch (err) {
      setErrorMessage(err.message || 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
    } finally {
      setLoading(false);
    }
  };

  const fillLoginForm = (email, pwd = '••••••••') => {
    setLoginForm({ email, password: 'password123' });
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-kanit">
      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: College & Strategic System Branding */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white p-1.5 shadow-md border border-slate-200 flex-shrink-0 flex items-center justify-center">
              <img 
                src="/logotl.png" 
                alt="วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์" 
                onError={(e) => { e.target.onerror = null; e.target.src = '/favicon.svg'; }}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800 text-[11px] font-bold">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>สำนักงานคณะกรรมการการอาชีวศึกษา (สอศ.)</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight mt-1">
                วิทยาลัยเทคนิคท่าหลวงซิเมนต์ไทยอนุสรณ์
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                ฝ่ายยุทธศาสตร์และแผนงาน • ระบบติดตามตัวชี้วัด 6 ด้านหลัก
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-brand-300 font-semibold tracking-wide uppercase">
                TTC Planning KPI System
              </span>
              <div className="flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full bg-white/10 border border-white/15">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>{isSupabaseConfigured ? 'Supabase Database Connected' : 'LocalStorage Mode'}</span>
              </div>
            </div>

            <h2 className="text-lg sm:text-xl font-bold leading-snug">
              ระบบบริหารจัดการยุทธศาสตร์ แผนงาน และประเมินผลสัมฤทธิ์
            </h2>

            {/* 6 Domains Grid Overview */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {KPI_DOMAINS.map((domain) => (
                <div key={domain.id} className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-brand-500/30 text-amber-300 font-bold flex items-center justify-center text-[10px]">
                    {domain.code}
                  </span>
                  <span className="truncate text-slate-200 text-[11px]">{domain.shortName}</span>
                </div>
              ))}
            </div>

            {/* Highlights */}
            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-2">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>วงจรคุณภาพ PDCA</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5 text-amber-400" />
                <span>จอทีวี & โปรเจคเตอร์</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-blue-400" />
                <span>ออกรายงาน PDF/Excel</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Login / Register Form Card */}
        <div className="lg:col-span-6">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            
            {/* Tab Switcher Header */}
            <div className="flex border-b border-slate-200 bg-slate-50/80">
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setErrorMessage(''); }}
                className={`flex-1 py-4 text-center text-sm font-bold transition-all border-b-2 ${
                  activeTab === 'login'
                    ? 'border-brand-600 text-brand-700 bg-white shadow-xs'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
                }`}
              >
                เข้าสู่ระบบ (Sign In)
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('register'); setErrorMessage(''); }}
                className={`flex-1 py-4 text-center text-sm font-bold transition-all border-b-2 ${
                  activeTab === 'register'
                    ? 'border-brand-600 text-brand-700 bg-white shadow-xs'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
                }`}
              >
                ลงทะเบียนสมาชิก (Register)
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Error Message Alert */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                  <span className="font-bold flex-shrink-0">⚠️ แจ้งเตือน:</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. LOGIN TAB */}
              {activeTab === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      ชื่อผู้ใช้งาน หรือ อีเมล (Username / Email)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="กรอกชื่อผู้ใช้ หรือ somchai@ttc.ac.th"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white transition-all shadow-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700">
                        รหัสผ่าน (Password)
                      </label>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white transition-all shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                  >
                    {loading ? (
                      <span className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <span>เข้าสู่ระบบ</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Reference Info for initial accounts */}
                  <div className="pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setShowDefaultAccounts(!showDefaultAccounts)}
                      className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-800 transition-colors py-1"
                    >
                      <span className="flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-slate-400" />
                        <span>ตัวอย่างบัญชีตั้งต้นสำหรับทดสอบระบบ</span>
                      </span>
                      <span className="text-[11px] font-semibold text-brand-600">
                        {showDefaultAccounts ? 'ซ่อน' : 'แสดง'}
                      </span>
                    </button>

                    {showDefaultAccounts && (
                      <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2 animate-fadeIn">
                        <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                          <div>
                            <span className="font-bold text-slate-800">1. ผู้ใช้ทั่วไป (ครู/แผนก):</span>
                            <div className="text-[11px] text-slate-500">somkid@ttc.ac.th (รหัสผ่าน: password123)</div>
                          </div>
                          <button 
                            type="button"
                            onClick={() => fillLoginForm('somkid@ttc.ac.th')}
                            className="px-2 py-0.5 text-[10px] rounded bg-white border border-slate-300 hover:bg-slate-100 text-slate-700"
                          >
                            เลือก
                          </button>
                        </div>

                        <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                          <div>
                            <span className="font-bold text-slate-800">2. ฝ่ายแผนงาน / แอดมิน (Admin):</span>
                            <div className="text-[11px] text-slate-500">kanok@tl.ac.th หรือ admin.plan@ttc.ac.th (รหัส: password123)</div>
                          </div>
                          <div className="flex gap-1">
                            <button 
                              type="button"
                              onClick={() => fillLoginForm('kanok@tl.ac.th')}
                              className="px-2 py-0.5 text-[10px] rounded bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium"
                            >
                              kanok
                            </button>
                            <button 
                              type="button"
                              onClick={() => fillLoginForm('admin.plan@ttc.ac.th')}
                              className="px-2 py-0.5 text-[10px] rounded bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium"
                            >
                              admin
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between py-1">
                          <div>
                            <span className="font-bold text-slate-800">3. ผู้บริหาร (Executive):</span>
                            <div className="text-[11px] text-slate-500">director@ttc.ac.th (รหัสผ่าน: password123)</div>
                          </div>
                          <button 
                            type="button"
                            onClick={() => fillLoginForm('director@ttc.ac.th')}
                            className="px-2 py-0.5 text-[10px] rounded bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium"
                          >
                            เลือก
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </form>
              )}

              {/* 2. REGISTER TAB */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      ชื่อ-นามสกุล (Full Name) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="เช่น นายสมชาย สายใจดี"
                        value={registerForm.fullName}
                        onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                        className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      อีเมลสถานศึกษา (Email) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="somchai@ttc.ac.th"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        รหัสผ่าน (Password) *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="ขั้นต่ำ 6 ตัวอักษร"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        ยืนยันรหัสผ่าน *
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="ยืนยันรหัสผ่าน"
                        value={registerForm.confirmPassword}
                        onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        แผนกวิชา / ฝ่ายงาน *
                      </label>
                      <select
                        value={registerForm.departmentId}
                        onChange={(e) => setRegisterForm({ ...registerForm, departmentId: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
                      >
                        {DEPARTMENTS.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        สิทธิ์การใช้งาน (Role) *
                      </label>
                      <select
                        value={registerForm.role}
                        onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white font-semibold"
                      >
                        <option value="user">1. ผู้ใช้งานทั่วไป (ครู / แผนก)</option>
                        <option value="admin">2. เจ้าหน้าที่แผนงาน (Admin)</option>
                        <option value="executive">3. ผู้บริหารสถานศึกษา (Executive)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      ตำแหน่ง / หน้าที่รับผิดชอบ
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="เช่น ครูผู้สอน / หัวหน้าแผนก / เจ้าหน้าที่โครงการ"
                        value={registerForm.position}
                        onChange={(e) => setRegisterForm({ ...registerForm, position: e.target.value })}
                        className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-3"
                  >
                    {loading ? (
                      <span className="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <span>ลงทะเบียนสมาชิกใหม่</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
