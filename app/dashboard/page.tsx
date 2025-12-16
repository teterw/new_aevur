'use client';

import { useState, useEffect, type KeyboardEvent } from 'react';
import Header from '../components/Header';

const SENSOR_MODE: 'mock' | 'real' = 'mock';

// change to 'real' when Arduino API is ready

export default function AevurAnalysis() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [sensorData, setSensorData] = useState<{
    readings: { 'MQ-135': number; 'MQ-138': number };
    baseline: number[];
    alert_status: { 'MQ-135': boolean; 'MQ-138': boolean };
    alerts: string[];
    history: { 'MQ-135': number; 'MQ-138': number }[];
  }>({
    readings: { 'MQ-135': 0, 'MQ-138': 0 },
    baseline: [0, 0],
    alert_status: { 'MQ-135': false, 'MQ-138': false },
    alerts: [],
    history: []
  });
  const [aiInput, setAiInput] = useState('');
  const [aiOutput, setAiOutput] = useState('คำตอบจาก AI จะแสดงที่นี่...');
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch data periodically
  useEffect(() => {
    const updateData = async () => {
      // 🟡 MOCK MODE (no hardware)
      if (SENSOR_MODE === 'mock') {
        setSensorData(prev => generateMockData());
        return;
      }

      // 🟢 REAL SENSOR MODE
      try {
        const response = await fetch('/api/data');
        if (!response.ok) throw new Error('Sensor offline');
        const data = await response.json();
        setSensorData(data);
      } catch (e) {
        console.warn('Sensor API unavailable, switching to safe state');
      }
    };

    updateData();
    const interval = setInterval(updateData, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const sendAI = async () => {
    const text = aiInput.trim();
    
    if (!text) {
      setAiOutput("โปรดพิมพ์คำถามของคุณ");
      return;
    }
    
    setIsProcessing(true);
    setAiOutput("กำลังประมวลผล...");
    
    try {
      const res = await fetch("/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text })
      });
      const data = await res.json();
      setAiOutput(data.answer || "ไม่ได้รับคำตอบจาก AI");
    } catch (err) {
      setAiOutput("เกิดข้อผิดพลาดในการติดต่อ AI");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendAI();
    }
  };

  const generateMockData = () => {
    const mq135 = Math.random() * 0.8 + 0.2;
    const mq138 = Math.random() * 0.6 + 0.1;

    return {
      readings: {
        'MQ-135': mq135,
        'MQ-138': mq138
      },
      baseline: [0.3, 0.25],
      alert_status: {
        'MQ-135': mq135 > 0.75,
        'MQ-138': mq138 > 0.6
      },
      alerts: [
        ...(mq135 > 0.75 ? ['High acetone detected (MQ-135)'] : []),
        ...(mq138 > 0.6 ? ['Abnormal gas pattern (MQ-138)'] : [])
      ],
      history: [
        ...sensorData.history.slice(-29),
        { 'MQ-135': mq135, 'MQ-138': mq138 }
      ]
    };
  };

  const diseaseCards: { id: string; disease: string; img: string; sensor: 'MQ-135' | 'MQ-138' }[] = [
    {
      id: "mq138",
      disease: "ความเสี่ยงเบาหวานจาก MQ-138",
      img: "https://bz49dmux6d.ufs.sh/f/1Q7cAF0oN6JTLqYK7j5kX0SfouG3gHjNi7P1CsqceVOvn68A",
      sensor: "MQ-138",
    },
    {
      id: "mq135",
      disease: "ความเสี่ยงเบาหวาน on Mq-135",
      img: "https://bz49dmux6d.ufs.sh/f/1Q7cAF0oN6JTml6DJ2HxG6E3TILBoXrtsVONDbQPY0Kinl1F",
      sensor: "MQ-135",
    }
  ];

  return (
    <div className={`min-h-screen font-sans transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white' 
        : 'bg-gradient-to-br from-blue-50 to-blue-200 text-gray-800'
    }`}>
      <div className="max-w-[1400px] mx-auto p-5">
        {/* Header */}
        <Header theme={theme} toggleTheme={toggleTheme} />

        {/* ✅ STATUS / WARNING BANNER */}
        {SENSOR_MODE === 'mock' && (
          <div className="max-w-[1400px] mx-auto mb-4 p-4 rounded-xl bg-yellow-500/20 border border-yellow-500 text-yellow-300 font-bold">
            ⚠️ Sensor not connected — running in simulation mode
          </div>
        )}

        {/* Hero Section */}
        <div className={`rounded-2xl p-10 mb-8 text-center ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-gray-800 to-gray-700 border-2 border-green-500'
            : 'bg-gradient-to-br from-white to-gray-50 border-2 border-blue-600 shadow-lg'
        }`}>
          <h1 className="text-3xl font-medium mb-4">
            เช็กสุขภาพล่วงหน้า เพื่อชีวิตที่ยืนยาว
          </h1>
          <p className="text-lg opacity-80">
            Aevur วิเคราะห์ความเสี่ยงของโรคจากข้อมูลสุขภาพของคุณ เพื่อช่วยป้องกันก่อนสายเกินไป
          </p>
        </div>

        {/* Results Section */}
        <div className={`rounded-2xl p-8 mb-8 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600'
            : 'bg-gradient-to-br from-white to-gray-50 border border-gray-300 shadow-lg'
        }`}>
          <div className="text-2xl font-bold mb-2 text-center">
            ผลการวิเคราะห์สำหรับคุณ
          </div>
          <div className="text-center opacity-70 mb-6">
            Health insights
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {diseaseCards.map((card) => {
              const isDanger = sensorData.alert_status[card.sensor];
              const value = sensorData.readings[card.sensor] || 0;
              
              return (
                <div 
                  key={card.id}
                  className={`rounded-2xl p-5 flex gap-5 items-center transition-all duration-300 hover:-translate-y-1 ${
                    isDanger
                      ? 'bg-red-500/10 border-2 border-red-500'
                      : 'bg-green-500/10 border-2 border-green-500'
                  }`}
                >
                  <img 
                    src={card.img} 
                    alt={card.disease}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl mb-2">{card.disease}</h3>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold mb-2 ${
                      isDanger
                        ? 'bg-red-500 text-white'
                        : 'bg-green-500 text-white'
                    }`}>
                      {isDanger ? 'มีความเสี่ยง' : 'ไม่มีความเสี่ยง'}
                    </div>
                    <div className="opacity-90">
                      ค่า : {value.toFixed(3)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Alerts */}
          {sensorData.alerts && sensorData.alerts.length > 0 && (
            <div className="mt-5">
              {sensorData.alerts.map((alert, index) => (
                <div 
                  key={index}
                  className="p-4 my-2 rounded-xl bg-red-500/10 border border-red-500 text-red-500 font-bold"
                >
                  {alert}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Suggestions Section */}
        <div className={`rounded-2xl p-8 mb-8 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600'
            : 'bg-gradient-to-br from-white to-gray-50 border border-gray-300 shadow-lg'
        }`}>
          <div className="text-2xl font-bold mb-2 text-center">
            คำแนะนำสำหรับคุณ
          </div>
          <div className="text-center opacity-70 mb-6">
            Health insights for You
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className={`rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 ${
              theme === 'dark'
                ? 'bg-gray-700 border border-gray-600'
                : 'bg-gray-50 border border-gray-300'
            }`}>
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span>คำแนะนำเพื่อสุขภาพ :</span>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  ทั่วไป
                </span>
              </div>
              <div className="opacity-90 leading-relaxed">
                ดื่มน้ำให้เพียงพอ อย่างน้อย 8-10 แก้วต่อวัน เพื่อช่วยในการขับถ่าย และรักษาสมดุลของร่างกาย
              </div>
            </div>

            <div className={`rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 ${
              theme === 'dark'
                ? 'bg-gray-700 border border-gray-600'
                : 'bg-gray-50 border border-gray-300'
            }`}>
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span>คำแนะนำเพื่อสุขภาพ :</span>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  โภชนาการ
                </span>
              </div>
              <div className="opacity-90 leading-relaxed">
                ลดการบริโภคอาหารที่มีน้ำตาลสูง และเพิ่มผักผลไม้ในมื้ออาหาร เพื่อควบคุมระดับน้ำตาลในเลือด
              </div>
            </div>

            <div className={`rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 ${
              theme === 'dark'
                ? 'bg-gray-700 border border-gray-600'
                : 'bg-gray-50 border border-gray-300'
            }`}>
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span>คำแนะนำเพื่อสุขภาพ :</span>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  การออกกำลังกาย
                </span>
              </div>
              <div className="opacity-90 leading-relaxed">
                ออกกำลังกายสม่ำเสมออย่างน้อยสัปดาห์ละ 3-5 ครั้ง ครั้งละ 30 นาที เพื่อสุขภาพหัวใจที่แข็งแรง
              </div>
            </div>
          </div>
        </div>

        {/* AI Section */}
        <div className={`rounded-2xl p-8 mb-8 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600'
            : 'bg-gradient-to-br from-white to-gray-50 border border-gray-300 shadow-lg'
        }`}>
          <div className="text-xl font-bold mb-5">
            Aevur.AI ช่วยตอบคำถามที่คุณสงสัย
          </div>
          
          <textarea
            className={`w-full min-h-[150px] p-4 rounded-2xl mb-4 resize-y border-none outline-none ${
              theme === 'dark'
                ? 'bg-gray-900 text-white border border-gray-600'
                : 'bg-gray-50 text-gray-800 border border-gray-300'
            }`}
            value={aiOutput}
            readOnly
            placeholder="คำตอบจาก AI จะแสดงที่นี่..."
          />
          
          <div className="flex gap-4 flex-col sm:flex-row">
            <input
              type="text"
              className={`flex-1 px-5 py-3 rounded-full outline-none ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white border border-gray-500'
                  : 'bg-white text-gray-800 border border-gray-300'
              }`}
              placeholder="พิมพ์คำถามของคุณ..."
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isProcessing}
            />
            <button 
              onClick={sendAI}
              disabled={isProcessing}
              className={`px-8 py-3 rounded-full font-medium transition-all duration-300 hover:-translate-y-0.5 ${
                theme === 'dark'
                  ? 'bg-gradient-to-br from-green-600 to-green-700 text-white'
                  : 'bg-gradient-to-br from-blue-600 to-blue-800 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isProcessing ? 'กำลังประมวลผล...' : 'ส่ง'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}