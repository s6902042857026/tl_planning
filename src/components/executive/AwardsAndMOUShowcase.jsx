import React from 'react';
import { Award, Lightbulb, Handshake, CheckCircle2, Star, Sparkles, Building, FileCheck } from 'lucide-react';

export default function AwardsAndMOUShowcase({ submissions, onOpenDetailModal }) {
  const awardSubs = submissions.filter(s => s.domainId === 'domain_3');
  const mouSubs = submissions.filter(s => s.domainId === 'domain_5');

  const highlightAwards = [
    {
      title: 'รางวัลชนะเลิศ อันดับ 1 การแข่งขันทักษะวิชาชีพระดับชาติ',
      category: 'ทักษะการเขียนโปรแกรมและระบบสมองกลฝังตัว (IoT)',
      level: 'ระดับชาติ (สอศ.)',
      department: 'แผนกวิชาเทคโนโลยีสารสนเทศ',
      year: '2567',
      gold: true
    },
    {
      title: 'รางวัลเหรียญทอง สิ่งประดิษฐ์คนรุ่นใหม่ ประเภทที่ 2',
      category: 'เครื่องคัดแยกและอบแห้งผลผลิตการเกษตรพลังงานแสงอาทิตย์อัจฉริยะ',
      level: 'ระดับภาคเหนือ',
      department: 'แผนกวิชาช่างไฟฟ้ากำลัง',
      year: '2567',
      gold: true
    },
    {
      title: 'อนุสิทธิบัตร: กรรมวิธีการผลิตอิฐมวลเบาผสมเถ้าแกลบรีไซเคิล',
      category: 'ทรัพย์สินทางปัญญา / นวัตกรรมสีเขียว',
      level: 'กรมทรัพย์สินทางปัญญา',
      department: 'แผนกวิชาช่างก่อสร้างและโยธา',
      year: '2567',
      gold: false
    }
  ];

  const highlightMous = [
    {
      company: 'บริษัท ซีพี ออลล์ จำกัด (มหาชน)',
      scope: 'ความร่วมมือจัดการศึกษาทวิภาคี รับนักศึกษาฝึกงานและทุนการศึกษา 30 ทุน/ปี',
      period: '2567 - 2570 (3 ปี)',
      type: 'ธุรกิจค้าปลีกและโลจิสติกส์'
    },
    {
      company: 'บริษัท โตโยต้า มอเตอร์ ประเทศไทย จำกัด',
      scope: 'สนับสนุนศูนย์การเรียนรู้ยานยนต์ไฟฟ้า (EV Academy) และครุภัณฑ์ฝึกทักษะ',
      period: '2566 - 2569 (3 ปี)',
      type: 'อุตสาหกรรมยานยนต์สมัยใหม่'
    },
    {
      company: 'การไฟฟ้าส่วนภูมิภาค (PEA)',
      scope: 'ฝึกอบรมความปลอดภัยและยกระดับมาตรฐานช่างไฟฟ้าภายในอาคาร',
      period: '2567 - 2569 (2 ปี)',
      type: 'พลังงานและสาธารณูปโภค'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold bg-white/20 px-3 py-1 rounded-full w-fit mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ผลงานความภาคภูมิใจและเกียรติยศสถานศึกษา</span>
          </div>
          <h2 className="text-2xl font-bold">คลังผลงาน นวัตกรรม สิ่งประดิษฐ์ และความร่วมมือ (MOU)</h2>
          <p className="text-xs text-white/90 mt-1 max-w-2xl font-light">
            รวบรวมหลักฐานผลงานวิจัย สิ่งประดิษฐ์ รางวัลเชิดชูเกียรติ และบันทึกข้อตกลงความร่วมมือกับสถานประกอบการ
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-center">
            <div className="text-xl font-bold">19</div>
            <div className="text-[10px] text-white/80">รางวัลเชิดชูเกียรติ</div>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-center">
            <div className="text-xl font-bold">34</div>
            <div className="text-[10px] text-white/80">บันทึก MOU</div>
          </div>
        </div>
      </div>

      {/* Awards Section */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-500" />
          รางวัลผลงานและสิ่งประดิษฐ์ดีเด่น (Outstanding Achievements)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {highlightAwards.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft hover:shadow-hover transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    item.gold ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {item.level}
                  </span>
                  <span className="text-xs text-slate-400">ปี {item.year}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm leading-snug mt-2">{item.title}</h4>
                <p className="text-xs text-slate-600 mt-1">{item.category}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
                <span>{item.department}</span>
                <span className="text-amber-600 font-bold">★ ผลงานเด่น</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MOU Section */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Handshake className="w-5 h-5 text-brand-600" />
          บันทึกความเข้าใจ (MOU) ความร่วมมือสถานประกอบการ
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {highlightMous.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft hover:shadow-hover transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {item.type}
                  </span>
                  <span className="text-xs text-slate-400">{item.period}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm leading-snug mt-2">{item.company}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.scope}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>สถานะมีผลบังคับใช้ (Active MOU)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
