import React from 'react';
import { 
  Compass, 
  ShieldCheck, 
  Lightbulb, 
  Server, 
  Users, 
  ArrowUpRight, 
  FileText, 
  CheckCircle2, 
  Clock, 
  FileUp 
} from 'lucide-react';
import { KPI_DOMAINS } from '../../data/kpiStructure';

export default function DomainsOverview({ submissions, onSelectDomain, onSelectKpiToUpload }) {
  const getDomainIcon = (iconName) => {
    switch (iconName) {
      case 'Compass': return Compass;
      case 'ShieldCheck': return ShieldCheck;
      case 'Lightbulb': return Lightbulb;
      case 'Server': return Server;
      case 'Users': return Users;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Compass className="w-6 h-6 text-brand-600" />
          โครงสร้างตัวชี้วัด 5 ด้านหลัก ฝ่ายยุทธศาสตร์และแผนงาน
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          มาตรฐานตัวชี้วัดตามกรอบการดำเนินงานสำนักงานคณะกรรมการการอาชีวศึกษา (สอศ.)
        </p>
      </div>

      {/* 5 Domains Detailed Accordion/Cards */}
      <div className="space-y-5">
        {KPI_DOMAINS.map((domain, index) => {
          const Icon = getDomainIcon(domain.icon);
          const domainSubs = submissions.filter(s => s.domainId === domain.id);
          const approvedSubs = domainSubs.filter(s => s.status === 'approved');
          const totalKpis = domain.categories.reduce((a, b) => a + b.kpis.length, 0);

          return (
            <div
              key={domain.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden hover:border-brand-300 transition-all"
            >
              {/* Domain Header Banner */}
              <div className={`p-5 bg-gradient-to-r ${domain.color} text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-white/20 text-xs font-mono font-bold">
                        {domain.code}
                      </span>
                      <h3 className="font-bold text-lg">{domain.name}</h3>
                    </div>
                    <p className="text-xs text-white/90 font-light mt-0.5 max-w-2xl">{domain.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => onSelectDomain(domain)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold shadow-md hover:bg-slate-50 transition-colors"
                  >
                    <span>ดูเกณฑ์ตัวชี้วัดทั้งหมด</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-slate-50/50">
                {domain.categories.map(cat => (
                  <div key={cat.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                    <h4 className="font-bold text-xs text-brand-900 pb-1.5 border-b border-slate-100">
                      {cat.name} ({cat.kpis.length} ตัวชี้วัด)
                    </h4>
                    <div className="space-y-1.5">
                      {cat.kpis.map(kpi => {
                        const hasApproved = submissions.some(s => s.kpiId === kpi.id && s.status === 'approved');
                        return (
                          <div
                            key={kpi.id}
                            onClick={() => onSelectKpiToUpload(kpi, domain)}
                            className="p-2 rounded-lg hover:bg-brand-50 border border-transparent hover:border-brand-200 cursor-pointer transition-all flex items-center justify-between text-xs group"
                          >
                            <div className="truncate pr-2">
                              <span className="font-mono font-bold text-slate-500 mr-1.5">[{kpi.code}]</span>
                              <span className="text-slate-800 font-medium group-hover:text-brand-700">{kpi.title}</span>
                            </div>
                            <span className="text-slate-400 group-hover:text-brand-600 flex-shrink-0 text-[11px]">
                              ส่งผลงาน →
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
