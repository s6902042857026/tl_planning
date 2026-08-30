import React, { useState } from 'react';
import { X, User, ShieldCheck, Award, FileText, CheckCircle, Search, Settings, PieChart, Download, ArrowRight, Layers } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function UseCaseDiagramModal({ isOpen, onClose }) {
  const { switchRole, currentUser } = useAuth();
  const [hoveredActor, setHoveredActor] = useState(null);
  const [selectedActor, setSelectedActor] = useState(currentUser?.role || 'user');

  if (!isOpen) return null;

  const actors = [
    {
      id: 'user',
      title: 'ผู้ใช้งานทั่วไป',
      subtitle: '(ครู / แผนก / นักเรียน / บุคลากร)',
      icon: User,
      color: 'border-indigo-500 text-indigo-700 bg-indigo-50/50',
      activeColor: 'bg-indigo-600 text-white shadow-indigo-200',
      lineColor: '#6366f1',
      useCases: ['login', 'upload', 'track_status']
    },
    {
      id: 'admin',
      title: 'เจ้าหน้าที่ฝ่ายยุทธศาสตร์ฯ',
      subtitle: '(Admin Process / งานแผนงาน)',
      icon: ShieldCheck,
      color: 'border-emerald-500 text-emerald-700 bg-emerald-50/50',
      activeColor: 'bg-emerald-600 text-white shadow-emerald-200',
      lineColor: '#10b981',
      useCases: ['login', 'review_approve', 'track_missing', 'manage_kpi']
    },
    {
      id: 'executive',
      title: 'ผู้บริหาร',
      subtitle: '(Executive / ผู้อำนวยการ / รอง ผอ.)',
      icon: Award,
      color: 'border-amber-500 text-amber-700 bg-amber-50/50',
      activeColor: 'bg-amber-600 text-white shadow-amber-200',
      lineColor: '#f59e0b',
      useCases: ['login', 'view_dashboard', 'view_reports', 'export_reports']
    }
  ];

  const useCasesList = [
    {
      id: 'login',
      title: 'เข้าสู่ระบบ (Login)',
      section: 'System Core',
      desc: 'ยืนยันตัวตนและเข้าใช้งานตามระดับสิทธิ์',
      roles: ['user', 'admin', 'executive'],
      badge: 'Core «include»'
    },
    {
      id: 'upload',
      title: 'อัพโหลดเอกสาร / รายงานตัวชี้วัด',
      section: 'User Functions',
      desc: 'กรอกข้อมูลโครงการ แนบไฟล์ PDF/Docs ระบุงบประมาณและ PDCA',
      roles: ['user'],
      badge: 'ผู้ใช้งาน'
    },
    {
      id: 'track_status',
      title: 'ตรวจสอบสถานะการส่งงาน',
      section: 'User Functions',
      desc: 'ติดตามสถานะการอนุมัติ คะแนน และข้อคิดเห็นแก้ไข',
      roles: ['user'],
      badge: 'ผู้ใช้งาน'
    },
    {
      id: 'review_approve',
      title: 'ตรวจสอบและอนุมัติเอกสาร',
      section: 'Admin Functions',
      desc: 'ตรวจประเมิน ให้คะแนน อนุมัติ หรือส่งกลับแก้ไข',
      roles: ['admin'],
      badge: 'เจ้าหน้าที่แผนฯ'
    },
    {
      id: 'track_missing',
      title: 'ติดตามและคัดกรองผู้ยังไม่ส่งงาน',
      section: 'Admin Functions',
      desc: 'คัดกรองแผนกที่ยังไม่ส่งงาน และส่งข้อความแจ้งเตือน',
      roles: ['admin'],
      badge: 'เจ้าหน้าที่แผนฯ'
    },
    {
      id: 'manage_kpi',
      title: 'จัดการหมวดหมู่ตัวชี้วัด',
      section: 'Admin Functions',
      desc: 'ปรับปรุงเกณฑ์ ตัวชี้วัด ค่าน้ำหนัก และกำหนดการ',
      roles: ['admin'],
      badge: 'เจ้าหน้าที่แผนฯ'
    },
    {
      id: 'view_dashboard',
      title: 'ดูแดชบอร์ดภาพรวม (% Completion)',
      section: 'Executive Functions',
      desc: 'ติดตามความก้าวหน้า 5 ด้านหลัก การเบิกจ่ายงบประมาณ',
      roles: ['executive'],
      badge: 'ผู้บริหาร'
    },
    {
      id: 'view_reports',
      title: 'ดูรายงานสรุปผลงาน / รางวัล / PDCA',
      section: 'Executive Functions',
      desc: 'รายงานผลสัมฤทธิ์ สถิตินวัตกรรม สิทธิบัตร และ MOU',
      roles: ['executive'],
      badge: 'ผู้บริหาร'
    },
    {
      id: 'export_reports',
      title: 'ส่งออกรายงาน (Export PDF / Excel)',
      section: 'Executive Functions',
      desc: 'สร้างรายงานสรุปราชการ PDF ตามแบบ สอศ. และไฟล์ Excel',
      roles: ['executive'],
      badge: 'ผู้บริหาร'
    }
  ];

  const activeActorId = hoveredActor || selectedActor;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-brand-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-400/30 flex items-center justify-center text-brand-300">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">แผนผัง Use Case Diagram ระบบติดตามตัวชี้วัด</h2>
              <p className="text-xs text-slate-300 font-light">Hover หรือคลิกเลือก Actor เพื่อจำลองสิทธิ์และ Highlight ฟังก์ชันที่เกี่ยวข้อง</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50">
          
          {/* Quick Switch Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {actors.map(actor => {
              const Icon = actor.icon;
              const isSelected = selectedActor === actor.id;
              const isHovered = hoveredActor === actor.id;
              
              return (
                <div
                  key={actor.id}
                  onMouseEnter={() => setHoveredActor(actor.id)}
                  onMouseLeave={() => setHoveredActor(null)}
                  onClick={() => {
                    setSelectedActor(actor.id);
                    switchRole(actor.id);
                  }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? `${actor.activeColor} shadow-md scale-[1.02]`
                      : `bg-white ${isHovered ? 'border-brand-400 shadow-sm' : 'border-slate-200'} text-slate-700`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-white/20' : 'bg-slate-100 text-slate-700'}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm leading-tight">{actor.title}</h4>
                      <p className={`text-xs mt-0.5 ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>{actor.subtitle}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-current/10 flex items-center justify-between text-xs font-medium">
                    <span>{isSelected ? '✓ สิทธิ์ที่ใช้งานอยู่ขณะนี้' : 'คลิกเพื่อสลับบทบาทนี้'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Use Cases Container */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 text-base">
                <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                รายการ Use Cases ของระบบ (แยกตามขอบเขตการทำงาน)
              </h3>
              <span className="text-xs text-slate-500">
                ไฮไลต์ความสัมพันธ์สำหรับ: <strong className="text-brand-600 font-bold">{actors.find(a => a.id === activeActorId)?.title}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {useCasesList.map((uc) => {
                const isRelevant = uc.roles.includes(activeActorId);
                const isUserRole = uc.roles.includes('user');
                const isAdminRole = uc.roles.includes('admin');
                const isExecRole = uc.roles.includes('executive');

                return (
                  <div
                    key={uc.id}
                    className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                      isRelevant
                        ? 'bg-blue-50/70 border-brand-300 ring-2 ring-brand-400/30 shadow-sm'
                        : 'bg-slate-50/60 border-slate-200 opacity-40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                          {uc.section}
                        </span>
                        <div className="flex gap-1">
                          {isUserRole && <span className="w-2 h-2 rounded-full bg-indigo-500" title="ผู้ใช้งานทั่วไป" />}
                          {isAdminRole && <span className="w-2 h-2 rounded-full bg-emerald-500" title="เจ้าหน้าที่ฝ่ายยุทธศาสตร์ฯ" />}
                          {isExecRole && <span className="w-2 h-2 rounded-full bg-amber-500" title="ผู้บริหาร" />}
                        </div>
                      </div>
                      <h4 className={`font-bold text-sm ${isRelevant ? 'text-brand-900' : 'text-slate-700'}`}>
                        {uc.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {uc.desc}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className={`font-medium ${isRelevant ? 'text-brand-600 font-semibold' : 'text-slate-400'}`}>
                        {isRelevant ? '● รองรับในบทบาทนี้' : '○ ไม่เกี่ยวข้อง'}
                      </span>
                      <span className="text-slate-400">{uc.badge}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> ผู้ใช้งานทั่วไป</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> เจ้าหน้าที่ฝ่ายยุทธศาสตร์ฯ</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> ผู้บริหาร</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors"
          >
            เข้าใจและปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
}
