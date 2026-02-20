export type Language = 'en' | 'th';

export const translations: Record<Language, any> = {
  en: {
    nav: { dashboard: 'Dashboard', doctor: 'Doctor', profile: 'Profile' },
    theme: { dark: '🌙 Dark', light: '☀️ Light' },
    languageToggle: 'ไทย',
    simulation: {
      active: '⚠️ Simulation Mode Active',
      real: '✅ Real Sensor Mode Active',
      switchToReal: 'Switch to Real',
      switchToSimulation: 'Switch to Simulation',
    },
    baseline: {
      title: 'Baseline System',
      setInfo: (mq135: number, mq138: number) =>
        `Baseline Set - MQ135: ${mq135.toFixed(3)}, MQ138: ${mq138.toFixed(3)}`,
      noSet: 'No baseline set. Click "Set Baseline" to begin monitoring.',
      setBtn: 'Set Baseline',
      updateBtn: 'Update Baseline',
      resetBtn: 'Reset Baseline',
    },
    ai: {
      placeholder: 'AI response will appear here...',
      processing: 'Processing...',
      noQuestion: 'Please enter your question',
      error: 'Error contacting AI',
      systemWelcome: 'AI Assistant ready to help with health analysis...',
    },
    profile: {
      patientCard: {
        id: 'ID',
        edit: '✏️ Confirm Info',
        name: 'Name',
        englishName: 'English Name',
        nickname: 'Nickname',
        age: 'Age',
        blood: 'Blood Type',
        phone: 'Phone',
        address: 'Address',
      },
      recordsTitle: 'Medical History',
    },
    hero: {
      title: 'Check your health ahead of time for a long life',
      subtitle: 'Aevur analyzes your health data to help prevent issues before they arise',
    },
    results: {
      title: 'Analysis results for you',
      subtitle: 'Health insights',
    },
    disease: {
      mq138: 'Diabetes risk from MQ-138',
      mq135: 'Diabetes risk on MQ-135',
    },
    main: {
      dashboardTitle: 'Aevur Dashboard',
      sensorDiabetes: 'Diabetes',
      sensorKidney: 'Kidney failure',
    },
  },

  th: {
    nav: { dashboard: 'แดชบอร์ด', doctor: 'หมอ', profile: 'โปรไฟล์' },
    theme: { dark: '🌙 Dark', light: '☀️ Light' },
    languageToggle: 'EN',
    simulation: {
      active: '⚠️ โหมดจำลองใช้งาน',
      real: '✅ โหมดเซ็นเซอร์จริง',
      switchToReal: 'เปลี่ยนเป็นโหมดจริง',
      switchToSimulation: 'เปลี่ยนเป็นโหมดจำลอง',
    },
    baseline: {
      title: 'ระบบเบสไลน์',
      setInfo: (mq135: number, mq138: number) =>
        `ตั้งค่าเบสไลน์เรียบร้อย - MQ135: ${mq135.toFixed(3)}, MQ138: ${mq138.toFixed(3)}`,
      noSet: 'ยังไม่ได้ตั้งค่าเบสไลน์ คลิก "ตั้งค่าเบสไลน์" เพื่อเริ่ม',
      setBtn: 'ตั้งค่าเบสไลน์',
      updateBtn: 'อัปเดตเบสไลน์',
      resetBtn: 'รีเซ็ตเบสไลน์',
    },
    ai: {
      placeholder: 'คำตอบจาก AI จะแสดงที่นี่...',
      processing: 'กำลังประมวลผล...',
      noQuestion: 'โปรดพิมพ์คำถามของคุณ',
      error: 'เกิดข้อผิดพลาดในการติดต่อ AI',
      systemWelcome: 'AI Assistant พร้อมช่วยวิเคราะห์สุขภาพของคุณ...',
    },
    profile: {
      patientCard: {
        id: 'รหัสประจำตัว',
        edit: '✏️ ยืนยันข้อมูลส่วนตัว',
        name: 'ชื่อ',
        englishName: 'ชื่อภาษาอังกฤษ',
        nickname: 'ชื่อเล่น',
        age: 'อายุ',
        blood: 'กลุ่มเลือด',
        phone: 'เบอร์โทรศัพท์',
        address: 'ที่อยู่',
      },
      recordsTitle: 'ประวัติการรักษา',
    },
    hero: {
      title: 'เช็กสุขภาพล่วงหน้า เพื่อชีวิตที่ยืนยาว',
      subtitle: 'Aevur วิเคราะห์ความเสี่ยงของโรคจากข้อมูลสุขภาพของคุณ เพื่อช่วยป้องกันก่อนสายเกินไป',
    },
    results: {
      title: 'ผลการวิเคราะห์สำหรับคุณ',
      subtitle: 'ข้อมูลเชิงลึกด้านสุขภาพ',
    },
    disease: {
      mq138: 'ความเสี่ยงเบาหวานจาก MQ-138',
      mq135: 'ความเสี่ยงเบาหวาน on Mq-135',
    },
    main: {
      dashboardTitle: 'แดชบอร์ด Aevur',
      sensorDiabetes: 'โรคเบาหวาน',
      sensorKidney: 'โรคไตวาย',
    },
  },
};

export function t(lang: Language, path: string, ...args: any[]): any {
  const parts = path.split('.');
  let cur: any = translations[lang] as any;
  for (const p of parts) {
    if (cur && typeof cur === 'object' && p in cur) {
      cur = cur[p];
    } else {
      return path;
    }
  }

  if (typeof cur === 'function') {
    return cur(...args);
  }
  return cur;
}
