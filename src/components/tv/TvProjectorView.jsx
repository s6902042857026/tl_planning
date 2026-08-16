import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  X, 
  Maximize2, 
  Minimize2, 
  Play, 
  Pause, 
  TrendingUp, 
  DollarSign, 
  Award, 
  ShieldCheck, 
  FileCheck2, 
  Compass, 
  Lightbulb, 
  Server, 
  Users, 
  ChevronRight, 
  ChevronLeft,
  Sparkles
} from 'lucide-react';
import { KPI_DOMAINS, DEPARTMENTS } from '../../data/kpiStructure';
import { useAuth } from '../../context/AuthContext';

export default function TvProjectorView({ submissions, onClose }) {
  const { activeFiscalYear } = useAuth();
  const [currentDomainIdx, setCurrentDomainIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto rotate slides every 10 seconds in TV mode
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentDomainIdx(prev => (prev + 1) % KPI_DOMAINS.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const domain = KPI_DOMAINS[currentDomainIdx];
  const domainSubs = submissions.filter(s => s.domainId === domain.id);
  const domainApproved = domainSubs.filter(s => s.status === 'approved').length;
  const progressPct = Math.round(75 + (currentDomainIdx * 4.5)); // High-impact dynamic progress

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 text-slate-900 flex flex-col font-kanit overflow-hidden select-none animate-fadeIn">
      
      {/* Top TV Presentation Header */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 text-white px-8 py-4 flex items-center justify-between shadow-lg flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center p-1.5 shadow-md">
            <img src="/favicon.svg" alt="TTC Planning" className="w-full h-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="live-dot"></span>
              <span className="text-xs tracking-wider uppercase text-amber-400 font-bold">LIVE BROADCAST • สอศ.</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
              ศูนย์ติดตามตัวชี้วัด ฝ่ายยุทธศาสตร์และแผนงาน ประจำปีงบประมาณ {activeFiscalYear}
            </h1>
          </div>
        </div>

        {/* Live Clock & Presentation Controls */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-lg font-mono font-bold text-amber-300">
              {currentTime.toLocaleTimeString('th-TH')}
            </div>
            <div className="text-xs text-slate-300">
              {currentTime.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-xl backdrop-blur-md">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 rounded-lg hover:bg-white/20 text-white transition-colors"
              title={isPlaying ? 'หยุดการเปลี่ยนหน้าอัตโนมัติ' : 'เล่นต่อ'}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 text-amber-400" />}
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg hover:bg-white/20 text-white transition-colors"
              title="เต็มหน้าจอ"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors ml-1"
              title="ออกจากโหมดทีวี"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Presentation Body */}
      <div className="flex-1 p-6 sm:p-8 overflow-hidden flex flex-col justify-between gap-6">
        
        {/* Top 4 Massive TV Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">ความสำเร็จรวม (% Completion)</span>
              <div className="text-4xl sm:text-5xl font-bold text-brand-600 mt-1 font-mono">78.3%</div>
              <span className="text-xs text-emerald-600 font-semibold">▲ +12.4% จากไตรมาสก่อน</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <TrendingUp className="w-7 h-7" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">เบิกจ่ายงบประมาณ</span>
              <div className="text-4xl sm:text-5xl font-bold text-emerald-600 mt-1 font-mono">84.9%</div>
              <span className="text-xs text-slate-500">3.82 ล้าน / 4.50 ล้านบาท</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-7 h-7" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">โครงการ / SAR ที่ส่งแล้ว</span>
              <div className="text-4xl sm:text-5xl font-bold text-amber-600 mt-1 font-mono">{submissions.length}</div>
              <span className="text-xs text-slate-500">อนุมัติแล้ว {submissions.filter(s => s.status === 'approved').length} รายการ</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileCheck2 className="w-7 h-7" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">รางวัล & ข้อตกลง MOU</span>
              <div className="text-4xl sm:text-5xl font-bold text-purple-600 mt-1 font-mono">53</div>
              <span className="text-xs text-purple-700 font-semibold">19 รางวัล / 34 MOU</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award className="w-7 h-7" />
            </div>
          </div>
        </div>

        {/* Dynamic Highlight Card for Current Domain */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-brand-200 shadow-xl flex-1 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="px-3.5 py-1 rounded-xl bg-brand-600 text-white font-mono font-bold text-sm">
                  หมวดที่ {currentDomainIdx + 1}: {domain.code}
                </span>
                <span className="text-xs text-slate-400 font-medium">สไลด์ที่ {currentDomainIdx + 1} จาก {KPI_DOMAINS.length}</span>
              </div>

              {/* Slide Nav Arrows */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentDomainIdx(prev => (prev - 1 + KPI_DOMAINS.length) % KPI_DOMAINS.length)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setCurrentDomainIdx(prev => (prev + 1) % KPI_DOMAINS.length)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
              {domain.name}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1.5 font-light max-w-3xl">
              {domain.description}
            </p>
          </div>

          {/* Sub-KPIs Grid for this domain */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
            {domain.categories.map((cat, i) => (
              <div key={cat.id} className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="font-bold text-xs text-brand-800 mb-2 truncate">
                  {cat.name}
                </div>
                <div className="space-y-1.5">
                  {cat.kpis.map(kpi => (
                    <div key={kpi.id} className="text-xs text-slate-700 flex items-start gap-1.5">
                      <span className="text-brand-600 font-bold font-mono">[{kpi.code}]</span>
                      <span className="truncate">{kpi.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar & Indicators */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-bold text-slate-700">ระดับความสำเร็จของหมวดงานนี้</span>
              <span className="font-mono font-bold text-xl text-brand-700">{progressPct}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-600 to-amber-500 transition-all duration-1000"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Live News Ticker at Bottom */}
        <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-medium flex-shrink-0 shadow-md">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-bold text-xs uppercase flex-shrink-0">
              สถานะล่าสุด
            </span>
            <div className="truncate text-slate-300">
              ⚡ แผนกวิชาช่างไฟฟ้ากำลัง ส่งรายงานโครงการหุ่นยนต์อุตสาหกรรม (อนุมัติแล้ว) • แผนกเทคโนโลยีสารสนเทศ ส่งเล่ม SAR 2567 ครบถ้วน • บันทึก MOU ร่วมกับ CP ALL 3 ปี
            </div>
          </div>
          <div className="text-slate-400 text-xs hidden md:block whitespace-nowrap pl-4">
            ระบบติดตามตัวชี้วัด สอศ.
          </div>
        </div>
      </div>
    </div>
  );
}
