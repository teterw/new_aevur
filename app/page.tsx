'use client';

import { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import Header from './components/Header';


const SENSOR_MODE: 'mock' | 'real' = 'mock';

// change to 'real' when Arduino API is ready


// Register Chart.js components
if (typeof window !== 'undefined') {
  Chart.register(...registerables);
}

type SensorData = {
  readings: { 'MQ-135': number; 'MQ-138': number };
  baseline: number[];
  alert_status: { 'MQ-135': boolean; 'MQ-138': boolean };
  alerts: string[];
  history: { 'MQ-135': number; 'MQ-138': number }[];
};

export default function AevurDashboard() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [monitoringActive, setMonitoringActive] = useState(true);
  const [sensorData, setSensorData] = useState<SensorData>({
    readings: { 'MQ-135': 0, 'MQ-138': 0 },
    baseline: [0, 0],
    alert_status: { 'MQ-135': false, 'MQ-138': false },
    alerts: [],
    history: []
  });
  const [messages, setMessages] = useState([
    { text: 'AI Assistant ready to help with health analysis...', type: 'system' }
  ]);
  const [inputValue, setInputValue] = useState('');
  
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart<'line'> | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Initialize chart
  useEffect(() => {
    if (chartRef.current && !chartInstance.current) {
      const isDark = theme === 'dark';

      chartInstance.current = new Chart(chartRef.current, {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              label: 'MQ-135',
              data: [],
              borderColor: '#4CAF50',
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              borderWidth: 2,
              fill: false,
              tension: 0.1
            },
            {
              label: 'MQ-138',
              data: [],
              borderColor: '#ff6b6b',
              backgroundColor: 'rgba(255, 107, 107, 0.1)',
              borderWidth: 2,
              fill: false,
              tension: 0.1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: { top: 20, right: 20, bottom: 20, left: 20 }
          },
          scales: {
            y: {
              beginAtZero: false,
              grid: { color: isDark ? '#444' : '#ddd' },
              ticks: {
                color: isDark ? '#fff' : '#333',
                maxTicksLimit: 8,
                callback: (value) => Number(value).toFixed(3)
              }
            },
            x: {
              grid: { color: isDark ? '#444' : '#ddd' },
              ticks: {
                color: isDark ? '#fff' : '#333',
                maxTicksLimit: 10
              }
            }
          },
          plugins: {
            legend: {
              labels: { color: isDark ? '#fff' : '#333' }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [theme]);

  // Update chart when data changes
  useEffect(() => {
    if (chartInstance.current && sensorData.history.length > 0) {
      const labels = sensorData.history.map((_, index) => `${index + 1}`);
      const mq135Data = sensorData.history.map(item => item['MQ-135']);
      const mq138Data = sensorData.history.map(item => item['MQ-138']);

      const allValues = [...mq135Data, ...mq138Data];
      const minVal = Math.min(...allValues);
      const maxVal = Math.max(...allValues);
      const range = maxVal - minVal;
      const padding = range * 0.1;

      if (chartInstance.current.options.scales?.y) {
        chartInstance.current.options.scales.y.min = Math.max(0, minVal - padding);
        chartInstance.current.options.scales.y.max = maxVal + padding;
      }

      chartInstance.current.data.labels = labels;
      chartInstance.current.data.datasets[0].data = mq135Data;
      chartInstance.current.data.datasets[1].data = mq138Data;
      chartInstance.current.update();
    }
  }, [sensorData.history]);

  // Fetch data periodically
useEffect(() => {
  const updateData = async () => {
    if (!monitoringActive) return;

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
}, [monitoringActive]);


  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const sendMessage = () => {
    if (inputValue.trim()) {
      setMessages(prev => [...prev, { text: inputValue, type: 'user' }]);
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          text: 'Based on your sensor data, I recommend monitoring the detected gas levels and ensuring proper ventilation.',
          type: 'ai'
        }]);
      }, 1000);

      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const startMonitoring = () => {
    setMonitoringActive(true);
    console.log('Monitoring started');
  };

  const stopMonitoring = () => {
    setMonitoringActive(false);
    console.log('Monitoring stopped');
  };

  const resetBaseline = async () => {
    try {
      const response = await fetch('/api/reset_baseline', { method: 'POST' });
      const data = await response.json();
      console.log('Baseline reset:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const refreshData = async () => {
    try {
      const response = await fetch('/api/clear_history', { method: 'POST' });
      const data = await response.json();
      console.log('History cleared:', data);
      
      if (chartInstance.current) {
        chartInstance.current.data.labels = [];
        chartInstance.current.data.datasets[0].data = [];
        chartInstance.current.data.datasets[1].data = [];
        chartInstance.current.update();
      }
    } catch (error) {
      console.error('Error:', error);
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


return (
  <div className={`min-h-screen font-sans transition-all duration-300 ${
    theme === 'dark'
      ? 'bg-linear-to-br from-gray-900 to-gray-800 text-white'
      : 'bg-linear-to-br from-blue-50 to-blue-200 text-gray-800'
  }`}>

    {/* ✅ HEADER COMPONENT */}
    <Header theme={theme} toggleTheme={toggleTheme} />

    {/* ✅ STATUS / WARNING BANNER */}
    {SENSOR_MODE === 'mock' && (
      <div className="max-w-[1400px] mx-auto mb-4 p-4 rounded-xl bg-yellow-500/20 border border-yellow-500 text-yellow-300 font-bold">
        ⚠️ Sensor not connected — running in simulation mode
      </div>
    )}

    {/* 🔽 EVERYTHING ELSE CONTINUES BELOW */}


      {/* Main Container */}
      <div className="max-w-[1400px] mx-auto p-5 grid grid-cols-[280px_1fr_320px] grid-rows-[auto_1fr] gap-5">
        {/* Logo Section */}
        <div className="col-start-1 row-start-1 flex items-center gap-4">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl ${
            theme === 'dark'
              ? 'bg-linear-to-br from-gray-600 to-gray-500 border-2 border-gray-500'
              : 'bg-linear-to-br from-white to-gray-200 border-2 border-gray-300 shadow-lg'
          }`}>
            🔬
          </div>
          <div className="text-2xl font-bold">Aevur Dashboard</div>
        </div>

        {/* Sensor Section */}
        <div className="col-start-2 row-start-1 flex gap-5 items-center justify-center">
          {/* Diabetes Sensor */}
          <div className={`w-[200px] h-[200px] flex-shrink-0 rounded-2xl flex flex-col items-center justify-center text-center p-5 transition-all duration-300 hover:-translate-y-1 ${
            theme === 'dark'
              ? 'bg-linear-to-br from-gray-700 to-gray-600 border border-gray-500'
              : 'bg-linear-to-br from-white to-gray-50 border border-gray-300 shadow-lg'
          } ${sensorData.alert_status['MQ-135'] ? 'border-red-500 shadow-red-500/30 shadow-xl' : ''}`}>
            <div className="text-lg font-bold mb-2">โรคเบาหวาน</div>
            <div className={`text-2xl font-bold mb-1 ${
              sensorData.alert_status['MQ-135'] ? 'text-red-500' : 'text-green-500'
            }`}>
              {sensorData.readings['MQ-135'].toFixed(3)}
            </div>
            <div className="text-xs opacity-70">
              Baseline: {sensorData.baseline[0].toFixed(3)}
            </div>
          </div>

          {/* Kidney Sensor */}
          <div className={`w-[200px] h-[200px] flex-shrink-0 rounded-2xl flex flex-col items-center justify-center text-center p-5 transition-all duration-300 hover:-translate-y-1 ${
            theme === 'dark'
              ? 'bg-linear-to-br from-gray-700 to-gray-600 border border-gray-500'
              : 'bg-linear-to-br from-white to-gray-50 border border-gray-300 shadow-lg'
          } ${sensorData.alert_status['MQ-138'] ? 'border-red-500 shadow-red-500/30 shadow-xl' : ''}`}>
            <div className="text-lg font-bold mb-2">โรคไตวาย</div>
            <div className={`text-2xl font-bold mb-1 ${
              sensorData.alert_status['MQ-138'] ? 'text-red-500' : 'text-green-500'
            }`}>
              {sensorData.readings['MQ-138'].toFixed(3)}
            </div>
            <div className="text-xs opacity-70">
              Baseline: {sensorData.baseline[1].toFixed(3)}
            </div>
          </div>

          {/* Queue Card */}
          <div className={`w-[200px] h-[200px] flex-shrink-0 rounded-2xl flex flex-col items-center justify-center text-center p-5 transition-all duration-300 hover:-translate-y-1 ${
            theme === 'dark'
              ? 'bg-linear-to-br from-gray-700 to-gray-600 border border-gray-500'
              : 'bg-linear-to-br from-white to-gray-50 border border-gray-300 shadow-lg'
          }`}>
            <div className="text-lg font-bold mb-2">Doctor Queue</div>
            <div className="flex flex-col gap-2 w-full mt-2">
              <div className={`flex justify-between items-center px-3 py-2 rounded text-sm ${
                theme === 'dark'
                  ? 'bg-green-500/15 border border-green-500/30'
                  : 'bg-green-500/20 border border-green-500/50'
              }`}>
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Now Serving:</span>
                <span className={`font-semibold ${theme === 'dark' ? 'text-green-400' : 'text-green-700'}`}>
                  Patient #07
                </span>
              </div>
              <div className={`flex justify-between items-center px-3 py-2 rounded text-sm ${
                theme === 'dark' ? 'bg-white/5' : 'bg-black/5'
              }`}>
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Next:</span>
                <span className="font-semibold">Patient #08</span>
              </div>
              <div className={`flex justify-between items-center px-3 py-2 rounded text-sm ${
                theme === 'dark' ? 'bg-white/5' : 'bg-black/5'
              }`}>
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>Waiting:</span>
                <span className="font-semibold">Patient #09</span>
              </div>
            </div>
          </div>
        </div>

        {/* Graph Section */}
        <div className={`col-start-2 row-start-2 rounded-2xl p-8 flex flex-col min-h-[400px] ${
          theme === 'dark'
            ? 'bg-linear-to-br from-gray-800 to-gray-700 border border-gray-600'
            : 'bg-linear-to-br from-white to-gray-50 border border-gray-300 shadow-lg'
        }`}>
          <div className="text-2xl font-bold mb-5 text-center">Graph</div>
          <div className={`flex-1 rounded-xl flex flex-col relative ${
            theme === 'dark'
              ? 'bg-gray-900 border border-gray-700'
              : 'bg-gray-50 border border-gray-300'
          }`}>
            <canvas ref={chartRef} className="flex-1 min-h-[300px] max-h-[350px] w-full" />
            <div className="mt-5">
              {sensorData.alerts.map((alert, index) => (
                <div key={index} className="p-2.5 my-1 rounded bg-red-500/10 border border-red-500 text-red-500 font-bold">
                  🚨 {alert}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="col-start-3 row-start-1 row-end-3 flex flex-col gap-4">
          <div className="text-2xl font-bold mb-2">Control Panel</div>
          
          <button 
            onClick={startMonitoring}
            className={`px-5 py-4 rounded-full font-medium transition-all duration-300 hover:-translate-y-0.5 ${
              theme === 'dark'
                ? 'bg-linear-to-br from-gray-600 to-gray-500 text-white'
                : 'bg-linear-to-br from-white to-gray-200 text-gray-800 shadow-md'
            }`}
          >
            เริ่มการตรวจ
          </button>
          
          <button 
            onClick={stopMonitoring}
            className={`px-5 py-4 rounded-full font-medium transition-all duration-300 hover:-translate-y-0.5 ${
              theme === 'dark'
                ? 'bg-linear-to-br from-gray-600 to-gray-500 text-white'
                : 'bg-linear-to-br from-white to-gray-200 text-gray-800 shadow-md'
            }`}
          >
            หยุดการตรวจ
          </button>
          
          <button 
            onClick={resetBaseline}
            className={`px-5 py-4 rounded-full font-medium transition-all duration-300 hover:-translate-y-0.5 ${
              theme === 'dark'
                ? 'bg-linear-to-br from-gray-600 to-gray-500 text-white'
                : 'bg-linear-to-br from-white to-gray-200 text-gray-800 shadow-md'
            }`}
          >
            รีเซ็ตค่าพื้นฐาน
          </button>
          
          <button 
            onClick={refreshData}
            className={`px-5 py-4 rounded-full font-medium transition-all duration-300 hover:-translate-y-0.5 ${
              theme === 'dark'
                ? 'bg-linear-to-br from-gray-600 to-gray-500 text-white'
                : 'bg-linear-to-br from-white to-gray-200 text-gray-800 shadow-md'
            }`}
          >
            โหลดข้อมูลใหม่
          </button>

          {/* AI Assistant */}
          <div className="mt-8 flex-1 flex flex-col">
            <div className="text-xl font-bold mb-4">AI Assistant</div>
            
            <div className={`flex-1 rounded-2xl min-h-[200px] max-h-[400px] p-5 mb-4 overflow-y-auto ${
              theme === 'dark'
                ? 'bg-linear-to-br from-gray-800 to-gray-700 border border-gray-600'
                : 'bg-linear-to-br from-white to-gray-50 border border-gray-300 shadow-md'
            }`}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2.5 px-3 py-2 rounded-2xl ${
                    msg.type === 'system' 
                      ? 'bg-transparent opacity-60'
                      : msg.type === 'user'
                      ? (theme === 'dark' ? 'bg-gray-600' : 'bg-blue-100')
                      : (theme === 'dark' ? 'bg-green-900/40' : 'bg-green-100')
                  }`}
                >
                  {msg.type === 'user' ? '👤 ' : msg.type === 'ai' ? '🤖 ' : ''}
                  {msg.text}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            
            <div className="flex gap-2.5">
              <input
                type="text"
                className={`flex-1 px-5 py-3 rounded-full outline-none ${
                  theme === 'dark'
                    ? 'bg-gray-700 text-white border border-gray-500'
                    : 'bg-white text-gray-800 border border-gray-300'
                }`}
                placeholder="Ask about your health data..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button 
                onClick={sendMessage}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-linear-to-br from-gray-600 to-gray-500 text-white'
                    : 'bg-linear-to-br from-blue-600 to-blue-800 text-white'
                }`}
              >
                ▶
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}