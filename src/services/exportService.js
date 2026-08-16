import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportService = {
  // Export Submissions to Excel
  exportToExcel(submissions, domains, filename = 'รายงานติดตามตัวชี้วัด_ฝ่ายยุทธศาสตร์.xlsx') {
    const data = submissions.map((sub, index) => {
      const domain = domains.find(d => d.id === sub.domainId);
      const statusMap = {
        approved: 'อนุมัติแล้ว',
        pending: 'รอตรวจสอบ',
        revision: 'ส่งกลับแก้ไข',
        rejected: 'ไม่อนุมัติ'
      };

      return {
        'ลำดับ': index + 1,
        'รหัสตัวชี้วัด': sub.kpiCode || sub.kpiId,
        'ชื่อตัวชี้วัด / หัวข้อ': sub.kpiTitle,
        'หมวดงานยุทธศาสตร์': domain ? domain.name : sub.domainName,
        'แผนก / หน่วยงาน': sub.departmentName,
        'ชื่อโครงการ / งาน': sub.projectName,
        'ผู้รายงาน': sub.submittedBy,
        'ปีงบประมาณ': sub.fiscalYear,
        'งบประมาณตามแผน (บาท)': sub.budgetPlanned || 0,
        'งบประมาณใช้จริง (บาท)': sub.budgetSpent || 0,
        'ขั้นตอน PDCA': sub.pdcaStage || '-',
        'สถานะการตรวจสอบ': statusMap[sub.status] || sub.status,
        'คะแนนประเมิน': sub.score || '-',
        'ข้อเสนอแนะ': sub.reviewComment || '-',
        'ผู้ตรวจสอบ': sub.reviewerName || '-',
        'วันที่ส่งเอกสาร': new Date(sub.submittedAt).toLocaleDateString('th-TH')
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'สรุปตัวชี้วัด');

    // Auto-fit column widths
    const max_width = data.reduce((w, r) => Math.max(w, Object.keys(r).length), 10);
    worksheet['!cols'] = Array(max_width).fill({ wch: 22 });

    XLSX.writeFile(workbook, filename);
  },

  // Export to CSV
  exportToCSV(submissions, domains, filename = 'kpi_tracking_report.csv') {
    const headers = [
      'ลำดับ',
      'รหัสตัวชี้วัด',
      'ชื่อตัวชี้วัด',
      'หมวดงาน',
      'แผนกวิชา',
      'ชื่อโครงการ',
      'ผู้รายงาน',
      'ปีงบประมาณ',
      'งบประมาณตามแผน',
      'งบประมาณใช้จริง',
      'สถานะ',
      'คะแนน',
      'วันที่ส่ง'
    ];

    const rows = submissions.map((sub, index) => [
      index + 1,
      `"${sub.kpiCode || sub.kpiId}"`,
      `"${sub.kpiTitle || ''}"`,
      `"${sub.domainName || ''}"`,
      `"${sub.departmentName || ''}"`,
      `"${sub.projectName || ''}"`,
      `"${sub.submittedBy || ''}"`,
      sub.fiscalYear || '2568',
      sub.budgetPlanned || 0,
      sub.budgetSpent || 0,
      `"${sub.status}"`,
      sub.score || 0,
      `"${new Date(sub.submittedAt).toLocaleDateString('th-TH')}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Export Executive Summary PDF
  exportToPDF(stats, domains, submissions, filename = 'รายงานสรุปผลการดำเนินงาน_ฝ่ายยุทธศาสตร์.pdf') {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Background header bar
    doc.setFillColor(3, 88, 161); // brand-700
    doc.rect(0, 0, 297, 26, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text('รายงานสรุปผลการติดตามตัวชี้วัด ฝ่ายยุทธศาสตร์และแผนงาน', 14, 12);
    doc.setFontSize(10);
    doc.text('สำนักงานคณะกรรมการการอาชีวศึกษา (สอศ.) | ประจำปีงบประมาณ ' + (stats.fiscalYear || '2568'), 14, 20);

    // Summary Metric Cards
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);

    const summaryCards = [
      { label: 'ความสำเร็จรวม', val: `${stats.overallCompletionRate || 78.3}%` },
      { label: 'โครงการทั้งหมด', val: `${submissions.length} รายการ` },
      { label: 'อนุมัติแล้ว', val: `${submissions.filter(s => s.status === 'approved').length} รายการ` },
      { label: 'การเบิกจ่ายงบประมาณ', val: `${stats.budgetExecutionRate || 84.9}%` }
    ];

    let startX = 14;
    summaryCards.forEach((card, i) => {
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(startX + (i * 68), 32, 64, 20, 2, 2, 'FD');
      
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(card.label, startX + (i * 68) + 4, 38);
      
      doc.setFontSize(13);
      doc.setTextColor(3, 88, 161);
      doc.text(card.val, startX + (i * 68) + 4, 47);
    });

    // Table Data
    const tableData = submissions.map((sub, idx) => [
      idx + 1,
      sub.kpiCode || sub.kpiId,
      sub.departmentName,
      sub.projectName.length > 35 ? sub.projectName.substring(0, 32) + '...' : sub.projectName,
      (sub.budgetPlanned || 0).toLocaleString() + ' บาท',
      sub.pdcaStage || 'Plan',
      sub.status === 'approved' ? 'อนุมัติแล้ว' : sub.status === 'pending' ? 'รอตรวจ' : 'แก้ไข',
      sub.score ? `${sub.score}/100` : '-'
    ]);

    doc.autoTable({
      startY: 58,
      head: [['#', 'รหัส', 'แผนก/งาน', 'ชื่อโครงการ/งาน', 'งบประมาณ', 'PDCA', 'สถานะ', 'คะแนน']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [7, 75, 132],
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9
      },
      styles: {
        fontSize: 8,
        cellPadding: 2.5
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 24 },
        2: { cellWidth: 40 },
        3: { cellWidth: 90 },
        4: { cellWidth: 35 },
        5: { cellWidth: 18 },
        6: { cellWidth: 26 },
        7: { cellWidth: 20 }
      }
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `เอกสารสรุปผลงานฝ่ายยุทธศาสตร์และแผนงาน - พิมพ์เมื่อ ${new Date().toLocaleDateString('th-TH')} | หน้า ${i} จาก ${pageCount}`,
        14,
        202
      );
    }

    doc.save(filename);
  }
};
