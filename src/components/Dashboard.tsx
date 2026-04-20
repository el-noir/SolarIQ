import { Zap, TrendingUp, DollarSign, Calculator, Battery, Sun, MapPin, SlidersHorizontal, Clock } from 'lucide-react';
import { SolarData, Language } from '@/types';
import { motion } from 'motion/react';
import SolarScheduler from './SolarScheduler';

interface DashboardProps {
  data: SolarData | null;
  language: Language;
  onRateChange: (rate: number) => void;
}

const translations = {
  en: {
    overview: "System Overview",
    cityAnalysis: "Pakistan • Market Analysis Grounded",
    proposedSize: "Proposed Size",
    peakGen: "Peak Generation",
    investment: "Total Investment",
    marketAvg: "Current Market Avg",
    annualSavings: "Annual Savings",
    savedMonthly: "saved monthly",
    payback: "Payback Period",
    roi: "ROI",
    hardware: "Hardware Profile",
    roiSensitivity: "ROI Sensitivity Analysis",
    adjustRate: "Adjust PKR/Unit Rate",
    impactText: "Simulate savings at current/forecasted electricity prices",
    environmentalTitle: "Environmental Impact in",
    analysisPending: "Analysis Pending",
    uploadBill: "Upload your electricity bill or tell me your monthly unit consumption to see your solar potential here.",
    localizedIntel: "Localized Intelligence",
    downloadTechnical: "Download Technical Analysis",
    tier1: "Tier 1",
    smartHybrid: "Smart Hybrid",
    panels: "Solar Panels",
    inverter: "Inverter Core",
    dailyYield: "Based on local irradiation levels, this system will generate roughly",
    carbonText: "units daily. Reducing grid dependence saves up to",
    treesText: "carbon-equivalent trees monthly.",
    onGrid: "On-Grid",
    hybrid: "Hybrid",
    offGrid: "Off-Grid"
  },
  ur: {
    overview: "سسٹم کا جائزہ",
    cityAnalysis: "پاکستان • مارکیٹ کا درست تجزیہ",
    proposedSize: "مجوزہ سائز",
    peakGen: "پیک جنریشن",
    investment: "کل سرمایہ کاری",
    marketAvg: "موجودہ مارکیٹ اوسط",
    annualSavings: "سالانہ بچت",
    savedMonthly: "ماہانہ بچت",
    payback: "واپسی کی مدت",
    roi: "منافع",
    hardware: "ہارڈ ویئر کا پروفائل",
    roiSensitivity: "بچت کا موازنہ",
    adjustRate: "بجلی کی فی یونٹ قیمت منتخب کریں",
    impactText: "بجلی کی مختلف قیمتوں پر اپنی بچت کا حساب لگائیں",
    environmentalTitle: "ماحولیاتی اثرات برائے",
    analysisPending: "تجزیہ درکار ہے",
    uploadBill: "اپنا بجلی کا بل اپ لوڈ کریں یا یونٹس بتائیں تاکہ آپ کا سولر پلان تیار کیا جا سکے۔",
    localizedIntel: "مقامی معلومات",
    downloadTechnical: "ٹیکنیکل رپورٹ ڈاؤن لوڈ کریں",
    tier1: "ٹیئر ۱",
    smartHybrid: "سمارٹ ہائبرڈ",
    panels: "سولر پینلز",
    inverter: "انورٹر",
    dailyYield: "مقامی روشنی کی سطح کے مطابق، یہ سسٹم روزانہ تقریباً",
    carbonText: "یونٹس بنائے گا۔ گرڈ پر انحصار کم کرنے سے ہر ماہ",
    treesText: "درختوں کے برابر کاربن کی بچت ہوگی۔",
    onGrid: "آن گرڈ",
    hybrid: "ہائبرڈ",
    offGrid: "آف گرڈ"
  }
};

export default function Dashboard({ data, language, onRateChange }: DashboardProps) {
  const t = translations[language];

  if (!data) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-bg-natural/50">
        <Sun className="w-16 h-16 text-sage/20 mb-6 animate-pulse" />
        <h3 className="text-2xl font-bold text-earth/40 font-serif italic">{t.analysisPending}</h3>
        <p className="max-w-xs mt-3 text-sm text-sage/60 font-medium">
          {t.uploadBill}
        </p>
      </div>
    );
  }

  const formatPKR = (num: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="p-8 space-y-8 overflow-y-auto h-full bg-bg-natural/50">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-earth font-serif">{t.overview}</h2>
          <div className="flex items-center gap-2 text-sage text-sm mt-2 font-medium">
            <MapPin className={cn("w-4 h-4 text-sun", language === 'ur' && "ml-2")} />
            <span>{data.city}, {t.cityAnalysis}</span>
          </div>
        </div>
        <div className="px-5 py-2 bg-ai-bubble text-earth rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border border-sage/10">
          {data.systemType === 'on-grid' ? t.onGrid : data.systemType === 'hybrid' ? t.hybrid : t.offGrid}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={<Zap className="text-sage" />}
          label={t.proposedSize}
          value={`${data.systemSize} kW`}
          subValue={t.peakGen}
          delay={0}
        />
        <MetricCard
          icon={<DollarSign className="text-clay" />}
          label={t.investment}
          value={formatPKR(data.estimatedCost)}
          subValue={t.marketAvg}
          delay={0.1}
        />
        <MetricCard
          icon={<TrendingUp className="text-sage" />}
          label={t.annualSavings}
          value={formatPKR(data.monthlySavings * 12)}
          subValue={`${formatPKR(data.monthlySavings)} ${t.savedMonthly}`}
          delay={0.2}
        />
        <MetricCard
          icon={<Calculator className="text-sun" />}
          label={t.payback}
          value={`${data.paybackYears} ${language === 'ur' ? 'سال' : 'Years'}`}
          subValue={t.roi}
          delay={0.3}
        />
      </div>

      {/* ROI Sensitivity Slider Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-ai-bubble/30 p-8 rounded-[32px] border border-sage/10"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-sm">
             <div className="flex items-center gap-2 mb-2 text-earth">
               <SlidersHorizontal className="w-5 h-5 text-sun" />
               <h3 className="font-bold text-lg font-serif">{t.roiSensitivity}</h3>
             </div>
             <p className="text-xs text-sage font-medium opacity-80">{t.impactText}</p>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex justify-between items-end mb-1">
               <span className="text-xs font-bold text-earth">{t.adjustRate}</span>
               <span className="text-lg font-black text-earth">PKR {data.unitRate}<span className="text-xs font-normal opacity-60 ml-1">/ unit</span></span>
            </div>
            <input 
              type="range" 
              min="35" 
              max="85" 
              step="1"
              value={data.unitRate}
              onChange={(e) => onRateChange(Number(e.target.value))}
              className="w-full h-2 bg-sage/20 rounded-lg appearance-none cursor-pointer accent-earth transition-all"
            />
            <div className="flex justify-between text-[10px] font-black text-sage opacity-40 uppercase tracking-widest mt-1">
               <span>Base (Min)</span>
               <span>Extreme (Max)</span>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38 }}
      >
        <SolarScheduler data={data} language={language} />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4 }}
           className="bg-white p-8 rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-black/5"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-6 bg-sage rounded-full" />
            <h3 className="font-bold text-earth text-lg font-serif">{t.hardware}</h3>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-center group">
              <div>
                <p className="text-[10px] text-sage font-black uppercase tracking-[0.1em] mb-1">{t.panels}</p>
                <p className="text-earth font-bold text-lg">{data.panelsRecommended}</p>
              </div>
              <span className="text-[10px] px-3 py-1 bg-sage/10 text-sage rounded-xl font-bold border border-sage/10">{t.tier1}</span>
            </div>
            <div className="flex justify-between items-center group">
              <div>
                <p className="text-[10px] text-sage font-black uppercase tracking-[0.1em] mb-1">{t.inverter}</p>
                <p className="text-earth font-bold text-lg">{data.inverterRecommended}</p>
              </div>
              <span className="text-[10px] px-3 py-1 bg-sun/10 text-sun rounded-xl font-bold border border-sun/10">{t.smartHybrid}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.5 }}
           className="bg-earth p-8 rounded-[32px] shadow-2xl shadow-earth/20 text-white relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="status-badge flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#E9EDC9] mb-4">
               <div className="w-2 h-2 rounded-full bg-[#E9EDC9]" />
               {t.localizedIntel}
            </div>
            <h3 className="text-2xl font-bold font-serif mb-3 leading-tight">{t.environmentalTitle} {data.city}</h3>
            {['Lahore', 'Faisalabad', 'Gujranwala', 'Multan'].includes(data.city) && (
              <div className="mb-4 p-3 bg-white/10 rounded-2xl flex items-center gap-3 border border-white/20">
                <span className="text-sun animate-pulse">●</span>
                <span className="text-[10px] font-bold uppercase tracking-widest leading-normal">
                  {language === 'ur' ? 'سموگ الرٹ: موسم سرما میں پیداوار ۳۰٪ تک کم ہو سکتی ہے' : 'Smog Advisory: Winter yield may drop up to 30%'}
                </span>
              </div>
            )}
            <p className="text-sm opacity-80 leading-relaxed font-medium">
              {t.dailyYield} {(data.systemSize * 4.2).toFixed(1)} {t.carbonText} {(data.monthlySavings/35).toFixed(0)} {t.treesText}
            </p>
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3 text-xs font-bold uppercase tracking-widest cursor-pointer group">
              <span className="group-hover:translate-x-1 transition-transform">{t.downloadTechnical}</span>
              <span className="text-sun">→</span>
            </div>
          </div>
          <Sun className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5 rotate-12" />
        </motion.div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, subValue, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card-natural p-7 group hover:bg-ai-bubble/20 transition-all duration-500 cursor-default"
    >
      <div className="w-12 h-12 rounded-2xl bg-bg-natural flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-clay/60 mb-1">{label}</p>
        <p className="text-2xl font-bold text-earth my-1 font-serif">{value}</p>
        <p className="text-xs text-sage font-medium opacity-70">{subValue}</p>
      </div>
    </motion.div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

