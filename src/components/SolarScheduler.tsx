import { useMemo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Clock, Zap, Sun, Info } from 'lucide-react';
import { SolarData, Language } from '@/types';
import { cn } from '@/lib/utils';

interface SolarSchedulerProps {
  data: SolarData;
  language: Language;
}

const translations = {
  en: {
    title: "Daily Yield & Load Scheduler",
    subtitle: "Coordinate heavy appliances with the sun's peak hours",
    solarProduction: "Solar Production",
    householdLoad: "Typicall Load",
    goldenHours: "Golden Hours (Launch Heavy Loads)",
    morning: "Early Sun",
    evening: "Low Production",
    smartSchedule: "Smart Usage Schedule",
    acLabel: "Inverter ACs (1.5T)",
    pumpLabel: "Water Pump / Iron",
    evLabel: "EV / Battery Charge",
    timeBlock: "Peak Utility",
    usageAdvice: "Run high-wattage appliances between 10 AM and 3 PM to maximize free solar consumption and protect your batteries/grid quota."
  },
  ur: {
    title: "سورج کے مطابق بجلی کا استعمال",
    subtitle: "بھاری چیزیں چلانے کا بہترین وقت پہچانیں",
    solarProduction: "سولر بجلی (پیداوار)",
    householdLoad: "گھر کا خرچ (لوڈ)",
    goldenHours: "گولڈن آورز (بھاری چیزیں چلائیں)",
    morning: "صبح کی روشنی",
    evening: "آخری سورج",
    smartSchedule: "استعمال کا سمارٹ شیڈول",
    acLabel: "انورٹر اے سی",
    pumpLabel: "پمپ / استری",
    evLabel: "گاڑی / بیٹری چارج",
    timeBlock: "بہترین وقت",
    usageAdvice: "ماہرین کے مطابق، صبح ۱۰ بجے سے دوپہر ۳ بجے کے درمیان استری اور موٹر جیسی چیزیں چلائیں تاکہ سولر کا زیادہ سے زیادہ فائدہ اٹھایا جا سکے۔"
  }
};

export default function SolarScheduler({ data, language }: SolarSchedulerProps) {
  const t = translations[language];
  const systemKW = data.systemSize;

  const chartData = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      // Simple Bell Curve for Solar: peaks at 13:00 (1PM)
      const hour = i;
      const sigma = 3; // spread
      const peakHour = 13;
      const solarYield = hour >= 6 && hour <= 19 
        ? systemKW * Math.exp(-Math.pow(hour - peakHour, 2) / (2 * Math.pow(sigma, 2)))
        : 0;

      // Simple Load Profile: Peaks in evening and morning
      let load = systemKW * 0.2; // base load
      if (hour >= 8 && hour <= 10) load = systemKW * 0.4;
      if (hour >= 18 && hour <= 22) load = systemKW * 0.6;
      if (hour >= 11 && hour <= 16) load = systemKW * 0.3; // laundry/routine or ac

      return {
        time: `${hour}:00`,
        solar: Number(solarYield.toFixed(2)),
        load: Number(load.toFixed(2)),
        hour
      };
    });
  }, [systemKW]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-sage/20 rounded-2xl shadow-xl backdrop-blur-md">
          <p className="text-xs font-black text-clay mb-2 uppercase tracking-widest">{label}</p>
          <div className="space-y-1">
            <p className="text-sm font-bold text-sage flex items-center gap-2">
              <Sun className="w-3 h-3" /> {payload[0].value} kW
            </p>
            <p className="text-sm font-bold text-earth flex items-center gap-2">
              <Zap className="w-3 h-3" /> {payload[1].value} kW
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-sm space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-sage/10 pb-6">
        <div>
          <h3 className="text-2xl font-bold text-earth font-serif flex items-center gap-3">
            <Clock className="w-6 h-6 text-sage" />
            {t.title}
          </h3>
          <p className="text-xs text-sage font-bold mt-1 uppercase tracking-widest">{t.subtitle}</p>
        </div>
        
        <div className="flex items-center gap-2 px-4 py-2 bg-sun/10 text-sun rounded-full text-[10px] font-black uppercase tracking-widest">
           <Sun className="w-3 h-3" />
           {t.goldenHours}: 10am — 3pm
        </div>
      </div>

      <div className="h-[300px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4A373" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#D4A373" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#606C38" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#606C38" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 10, fontWeight: 700, fill: '#A98467' }}
              interval={3}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="solar" 
              stroke="#D4A373" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorSolar)" 
              name={t.solarProduction}
            />
            <Area 
              type="monotone" 
              dataKey="load" 
              stroke="#606C38" 
              strokeWidth={2}
              strokeDasharray="5 5"
              fillOpacity={1} 
              fill="url(#colorLoad)" 
              name={t.householdLoad}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
           <h4 className="text-[10px] font-black uppercase tracking-widest text-clay">{t.smartSchedule}</h4>
           <div className="space-y-2">
              {[
                { label: t.pumpLabel, time: "10:30 AM", status: "peak" as const },
                { label: t.acLabel, time: "11:00 AM - 4:00 PM", status: "peak" as const },
                { label: t.evLabel, time: "01:00 PM", status: "peak" as const }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-bg-natural rounded-2xl border border-black/5">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-sage">
                         <Zap className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-earth">{item.label}</span>
                   </div>
                   <div className="px-3 py-1 bg-sage/10 text-sage text-[9px] font-black rounded-full uppercase">
                      {item.time}
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-earth p-6 rounded-3xl text-white relative overflow-hidden group">
           <div className="relative z-10 flex items-start gap-4">
              <Info className="w-5 h-5 text-sun shrink-0" />
              <p className="text-[11px] leading-relaxed opacity-90 font-medium">
                {t.usageAdvice}
              </p>
           </div>
           <Sun className="absolute -right-8 -bottom-8 w-32 h-32 text-white/5 group-hover:scale-110 transition-transform duration-700" />
        </div>
      </div>
    </div>
  );
}
