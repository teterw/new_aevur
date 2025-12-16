"use client";

import { useState } from 'react';
import Header from '../components/Header';

export default function PatientProfile() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const patientInfo = {
    id: 'PT-27194',
    photo: 'https://cdn.discordapp.com/attachments/1349282839966777376/1423955588513267874/show_img.png?ex=68e2317c&is=68e0dffc&hm=1815ac9810d23a9d29dc3aa624ce6364f20f60acedd91d9f466766bd71132fbc&',
    name: 'นายณัฐสิทธิ์ มานะปิยะวงศ์',
    englishName: 'Nattasit Manapiyawong',
    nickname: '-',
    age: '27 ปี',
    bloodType: 'O+',
    phone: '081-234-5678',
    address: '123 ถนนพระราม 4 แขวงสีลม เขตบางรัก กรุงเทพฯ 10500'
  };

  const medicalRecords = [
    {
      date: '15 ธันวาคม 2567',
      title: 'การตรวจสุขภาพประจำปี - แพทย์: นพ.สมชาย ใจดี',
      details: 'ผลการตรวจ: สุขภาพแข็งแรงดี แนะนำออกกำลังกายสม่ำเสมอ'
    },
    {
      date: '03 พฤศจิกายน 2567',
      title: 'ตรวจรักษา - อาการไข้หวัด',
      details: 'การรักษา: ให้ยาลดไข้ และยาแก้หวัด พักผ่อนเพียงพอ'
    },
    {
      date: '22 กันยายน 2567',
      title: 'การตรวจเลือด - ตรวจสุขภาพทั่วไป',
      details: 'ผลเลือด: ระดับน้ำตาลและคอเลสเตอรอลอยู่ในเกณฑ์ปกติ'
    }
  ];

  return (
    <div className={`min-h-screen font-sans transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' 
        : 'bg-gradient-to-br from-blue-50 to-blue-200 text-gray-800'
    }`}>
      <div className="max-w-[800px] mx-auto p-5">
        <Header theme={theme} toggleTheme={toggleTheme} />
        

        {/* Patient Card */}
        <div className={`rounded-2xl p-8 mb-5 text-center ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600'
            : 'bg-gradient-to-br from-white to-gray-50 border border-gray-300 shadow-lg'
        }`}>
          {/* Patient Photo */}
          <div className={`w-[200px] h-[250px] mx-auto mb-5 rounded-2xl overflow-hidden border-[3px] ${
            theme === 'dark'
              ? 'border-gray-600 bg-gray-700'
              : 'border-blue-600 bg-gray-200'
          }`}>
            <img 
              src={patientInfo.photo}
              alt="Patient"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Patient ID */}
          <div className={`text-lg font-bold mb-5 ${
            theme === 'dark' ? 'text-green-500' : 'text-blue-600'
          }`}>
            รหัสประจำตัว : {patientInfo.id}
          </div>

          {/* Edit Button */}
          <button className={`px-8 py-3 rounded-full font-medium transition-all duration-300 hover:-translate-y-0.5 mb-5 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-teal-700 to-teal-600 text-white'
              : 'bg-gradient-to-br from-blue-600 to-blue-800 text-white'
          }`}>
            ✏️ ยืนยันข้อมูลส่วนตัว
          </button>

          {/* Patient Information */}
          <div className="text-left mt-5">
            <div className="mb-4">
              <div className={`font-bold mb-1 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`}>
                ชื่อ :
              </div>
              <div className="pl-2.5">{patientInfo.name}</div>
            </div>

            <div className="mb-4">
              <div className={`font-bold mb-1 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`}>
                ชื่อภาษาอังกฤษ :
              </div>
              <div className="pl-2.5">{patientInfo.englishName}</div>
            </div>

            <div className="mb-4">
              <div className={`font-bold mb-1 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`}>
                ชื่อเล่น :
              </div>
              <div className="pl-2.5">{patientInfo.nickname}</div>
            </div>

            <div className="mb-4">
              <div className={`font-bold mb-1 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`}>
                อายุ :
              </div>
              <div className="pl-2.5">{patientInfo.age}</div>
            </div>

            <div className="mb-4">
              <div className={`font-bold mb-1 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`}>
                กลุ่มเลือด :
              </div>
              <div className="pl-2.5">{patientInfo.bloodType}</div>
            </div>

            <div className="mb-4">
              <div className={`font-bold mb-1 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`}>
                เบอร์โทรศัพท์ :
              </div>
              <div className="pl-2.5">{patientInfo.phone}</div>
            </div>

            <div className="mb-4">
              <div className={`font-bold mb-1 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`}>
                ที่อยู่ :
              </div>
              <div className="pl-2.5">{patientInfo.address}</div>
            </div>
          </div>
        </div>

        {/* Medical Records Section */}
        <div className={`rounded-2xl p-6 mt-5 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600'
            : 'bg-gradient-to-br from-white to-gray-50 border border-gray-300 shadow-lg'
        }`}>
          <div className="text-xl font-bold mb-5 text-center">
            ประวัติการรักษา
          </div>

          {medicalRecords.map((record, index) => (
            <div 
              key={index}
              className={`p-4 rounded-xl mb-2.5 transition-all duration-300 hover:translate-x-1 ${
                theme === 'dark'
                  ? 'bg-gray-700 border border-gray-600'
                  : 'bg-gray-50 border border-gray-300'
              }`}
            >
              <div className={`font-bold mb-1 ${
                theme === 'dark' ? 'text-green-500' : 'text-blue-600'
              }`}>
                📅 {record.date}
              </div>
              <div className="text-sm opacity-90 mb-1">
                {record.title}
              </div>
              <div className="text-sm opacity-90">
                {record.details}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}