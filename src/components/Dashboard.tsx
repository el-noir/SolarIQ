import { useMemo, useState } from 'react';
import { Zap, TrendingUp, DollarSign, Calculator, Battery, Sun, MapPin, SlidersHorizontal, Clock, Settings2, ShieldCheck, Gem, Info, ArrowUpRight, BarChart3, Search } from 'lucide-react';
import { SolarData, Language, SystemTier } from '@/types';
import { motion, AnimatePresence } from 'motion/react';
import SolarScheduler from './SolarScheduler';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface DashboardProps {
  data: SolarData | null;
  language: Language;
  onRateChange: (rate: number) => void;
  onTierChange: (tier: SystemTier) => void;
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
    systemConfig: "System Build Tier",
    economy: "Economy Build",
    premium: "Premium Build",
    economyDesc: "Standard Tier-1 P-Type panels + String Inverter. Best for quick ROI.",
    premiumDesc: "N-Type Bifacial panels + Global Top-Tier Inverter. 10% more yield.",
    panels: "Solar Panels",
    inverter: "Inverter Core",
    dailyYield: "Based on local irradiation levels, this system will generate roughly",
    carbonText: "units daily. Reducing grid dependence saves up to",
    treesText: "carbon-equivalent trees monthly.",
    onGrid: "On-Grid",
    hybrid: "Hybrid",
    offGrid: "Off-Grid",
    savingsProjection: "25-Year Savings Projection",
    cumulativeSavings: "Cumulative Savings",
    futureValue: "25Y Potential Value",
    whyPremium: "Why Premium?",
    biFacialAdvantage: "Bifacial panels capture energy from both sides, increasing output by ~12% in Pakistan's dusty conditions.",
    netMeteringTarget: "Net-Metering Ready"
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
    systemConfig: "سسٹم کوالٹی انتخاب",
    economy: "اکانومی بلڈ",
    premium: "پریمیم بلڈ",
    economyDesc: "معیاری ٹیئر ۱ پینلز اور انورٹر۔ کم قیمت میں بہترین بچت۔",
    premiumDesc: "بائی فیشل پینلز اور برانڈڈ انورٹر۔ ۱۰٪ زیادہ بجلی کی پیداوار۔",
    panels: "سولر پینلز",
    inverter: "انورٹر",
    dailyYield: "مقامی روشنی کی سطح کے مطابق، یہ سسٹم روزانہ تقریباً",
    carbonText: "یونٹس بنائے گا۔ گرڈ پر انحصار کم کرنے سے ہر ماہ",
    treesText: "درختوں کے برابر کاربن کی بچت ہوگی۔",
    onGrid: "آن گرڈ",
    hybrid: "ہائبرڈ",
    offGrid: "آف گرڈ",
    savingsProjection: "۲۵ سالہ بچت کا تخمینہ",
    cumulativeSavings: "کل بچت",
    futureValue: "۲۵ سالہ ممکنہ بچت",
    whyPremium: "پریمیم کیوں؟",
    biFacialAdvantage: "بائی فیشل پینلز دونوں طرف سے بجلی بناتے ہیں، جس سے پاکستان کے گرد آلود ماحول میں پیداوار ۱۲ فیصد بڑھ جاتی ہے۔",
    netMeteringTarget: "نیٹ میٹرنگ کے لیے تیار"
  }
};

export default function Dashboard({ data, language, onRateChange, onTierChange }: DashboardProps) {
  const t = translations[language];

  if (!data) {
    return (
      <div className="h-full overflow-hidden p-6 sm:p-12 bg-bg-natural/50 relative">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header Skeleton */}
          <div className="flex justify-between items-end">
             <div className="space-y-4">
               <div className="h-8 w-64 shimmer rounded-full" />
               <div className="h-4 w-48 shimmer rounded-full opacity-50" />
             </div>
             <div className="h-10 w-32 shimmer rounded-2xl" />
          </div>

          {/* Metric Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
             {[1,2,3,4].map(i => (
               <div key={i} className="h-48 shimmer rounded-[40px]" />
             ))}
          </div>

          {/* Large Body Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 h-[450px] shimmer rounded-[48px]" />
             <div className="h-[450px] shimmer rounded-[48px]" />
          </div>
        </div>

        {/* Floating Modal Overlay - The actual CTA */}
        <div className="absolute inset-0 flex items-center justify-center bg-bg-natural/40 backdrop-blur-[2px] z-20 p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="card-premium max-w-md w-full text-center space-y-8"
          >
            <div className="w-24 h-24 bg-[#FAFAF5] rounded-full mx-auto flex items-center justify-center animate-float">
               <Sun className="w-12 h-12 text-sun" />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-serif text-earth">{t.analysisPending}</h3>
              <p className="text-sm text-sage font-medium leading-relaxed">
                {t.uploadBill}
              </p>
            </div>
            
            <div className="pt-4 grid grid-cols-2 gap-4">
               <div className="p-4 bg-bg-natural rounded-2xl border border-sage/5">
                  <p className="text-micro mb-2">{language === 'ur' ? 'سٹیپ ۱' : 'Step 1'}</p>
                  <p className="text-[10px] font-bold">{language === 'ur' ? 'بل اپ لوڈ کریں' : 'Upload Bill'}</p>
               </div>
               <div className="p-4 bg-bg-natural rounded-2xl border border-sage/5">
                  <p className="text-micro mb-2">{language === 'ur' ? 'سٹیپ ۲' : 'Step 2'}</p>
                  <p className="text-[10px] font-bold">{language === 'ur' ? 'سولر پلان دیکھیں' : 'Get Proposal'}</p>
               </div>
            </div>
          </motion.div>
        </div>
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

  const savingsData = useMemo(() => {
    const years = [1, 5, 10, 15, 20, 25];
    const annualSavings = data.monthlySavings * 12;
    // Assume 5% electricity cost inflation annually
    return years.map(year => {
      const inflationFactor = Math.pow(1.05, year);
      const cumulative = annualSavings * ((Math.pow(1.05, year) - 1) / 0.05);
      return {
        year: `Year ${year}`,
        savings: Math.round(cumulative),
      };
    });
  }, [data.monthlySavings]);

  const [showVibeModal, setShowVibeModal] = useState(false);

  return (
    <div className="p-6 sm:p-12 space-y-12 overflow-y-auto h-full bg-bg-natural/50 max-w-7xl mx-auto no-scrollbar relative">
      
      {/* Hackathon Vibe Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowVibeModal(true)}
        className="fixed bottom-24 right-6 sm:bottom-12 sm:right-12 z-50 px-6 py-3 bg-earth text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl flex items-center gap-3 border border-sun/30"
      >
        <div className="w-2 h-2 rounded-full bg-sun animate-pulse" />
        #VibeKaregaPakistan
      </motion.button>

      <AnimatePresence>
        {showVibeModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-earth/40 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-sun/20 flex flex-col max-h-[80vh]"
            >
              <div className="p-8 border-b border-sage/10 bg-bg-natural/50 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black font-serif text-earth">The Mind of SolarIQ</h3>
                  <p className="text-[10px] font-black text-sage uppercase tracking-widest mt-1">#AISeekho2026 Technical Specs</p>
                </div>
                <button onClick={() => setShowVibeModal(false)} className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center text-earth font-bold hover:bg-sage/20 transition-all">×</button>
              </div>
              <div className="p-8 overflow-y-auto space-y-8 no-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div className="p-6 rounded-3xl bg-bg-natural border border-sage/5">
                      <div className="flex items-center gap-3 mb-4">
                         <div className="w-10 h-10 rounded-2xl bg-sun/10 flex items-center justify-center">
                            <Zap className="w-5 h-5 text-sun fill-sun/20" />
                         </div>
                         <h4 className="font-bold text-earth">Gemini 3 Flash</h4>
                      </div>
                      <p className="text-xs text-sage font-medium leading-relaxed">Multimodal execution using <b>Gemini 3 Flash</b> for high-speed analysis of electricity bills and roof geometry.</p>
                   </div>
                   <div className="p-6 rounded-3xl bg-bg-natural border border-sage/5">
                      <div className="flex items-center gap-3 mb-4">
                         <div className="w-10 h-10 rounded-2xl bg-earth flex items-center justify-center">
                            <Search className="w-5 h-5 text-sun" />
                         </div>
                         <h4 className="font-bold text-earth">Search Grounding</h4>
                      </div>
                      <p className="text-xs text-sage font-medium leading-relaxed">Integrated <b>Google Search grounding</b> to fetch live PKR rates for Tier-1 hardware (Longi/Jinko) and current NEPRA policies.</p>
                   </div>
                </div>

                <div className="space-y-4">
                   <h4 className="text-micro text-clay uppercase tracking-widest font-black">Vibe Engineering Features</h4>
                   <div className="space-y-3">
                      {[
                        { title: "Smog Yield Engine", desc: "Accounts for 30% production drop in Punjab during winter (Nov-Jan)." },
                        { title: "Bilingual Prompt Logic", desc: "Optimized prompt engineering for technical Urdu terms using Noto Nastaliq." },
                        { title: "ROI Sensitivity", desc: "Live recalculation of payback periods based on utility rate spikes up to PKR 85/unit." }
                      ].map((feat, i) => (
                        <div key={i} className="flex gap-4 p-4 bg-bg-natural/50 rounded-2xl border border-black/5">
                           <ShieldCheck className="w-5 h-5 text-sage shrink-0" />
                           <div>
                              <p className="text-xs font-bold text-earth mb-1">{feat.title}</p>
                              <p className="text-[10px] text-sage font-medium font-bold opacity-60 uppercase">{feat.desc}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
              <div className="p-6 bg-earth text-white flex items-center justify-between">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Status: App Banaao Track Entry</p>
                 <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-sun animate-ping" />
                    <span className="text-[10px] font-bold">Cloud Run Deployed</span>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-sage/10 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-sun rounded-full" />
            <h2 className="text-4xl sm:text-5xl font-extrabold text-earth leading-none">{t.overview}</h2>
          </div>
          <div className="flex items-center gap-3 text-sage font-bold">
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm border border-black/5">
              <MapPin className={cn("w-4 h-4 text-sun", language === 'ur' && "ml-1")} />
              <span className="text-xs uppercase tracking-widest">{data.city}, Pakistan</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-sage/30" />
            <span className="text-xs opacity-60 uppercase tracking-tighter">{t.cityAnalysis}</span>
          </div>
        </div>
        <div className="w-fit px-6 py-2 bg-earth text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-earth/10">
          {data.systemType === 'on-grid' ? t.onGrid : data.systemType === 'hybrid' ? t.hybrid : t.offGrid}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <MetricCard
          icon={<Zap className="text-earth w-6 h-6" />}
          label={t.proposedSize}
          value={`${data.systemSize} kW`}
          subValue={t.peakGen}
          delay={0}
        />
        <MetricCard
          icon={<DollarSign className="text-earth w-6 h-6" />}
          label={t.investment}
          value={formatPKR(data.estimatedCost)}
          subValue={t.marketAvg}
          delay={0.1}
        />
        <MetricCard
          icon={<TrendingUp className="text-earth w-6 h-6" />}
          label={t.annualSavings}
          value={formatPKR(data.monthlySavings * 12)}
          subValue={`${formatPKR(data.monthlySavings)} ${t.savedMonthly}`}
          delay={0.2}
        />
        <MetricCard
          icon={<Calculator className="text-earth w-6 h-6" />}
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
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Tier Selector */}
        <div className="bg-white p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] border border-sage/10 shadow-sm space-y-4 sm:space-y-6">
           <div className="flex items-center gap-2 mb-2 sm:mb-4">
              <Settings2 className="w-4 h-4 sm:w-5 h-5 text-sun" />
              <h3 className="font-bold text-base sm:text-lg font-serif text-earth">{t.systemConfig}</h3>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <button 
                onClick={() => onTierChange('economy')}
                className={cn(
                  "p-4 sm:p-5 rounded-2xl border-2 text-right flex flex-col transition-all",
                  data.tier === 'economy' || !data.tier 
                    ? "border-sage bg-sage/5" 
                    : "border-transparent bg-bg-natural hover:bg-sage/5"
                )}
              >
                <div className="flex items-center justify-between mb-2 w-full">
                  <ShieldCheck className={cn("w-4 h-4 sm:w-5 h-5", data.tier === 'economy' || !data.tier ? "text-sage" : "text-sage/30")} />
                  <span className="font-black text-earth text-[10px] sm:text-xs uppercase tracking-widest">{t.economy}</span>
                </div>
                <p className="text-[9px] sm:text-[10px] text-left sm:text-right text-sage font-medium leading-relaxed opacity-60">
                  {t.economyDesc}
                </p>
              </button>

              <button 
                onClick={() => onTierChange('premium')}
                className={cn(
                  "p-4 sm:p-5 rounded-2xl border-2 text-right flex flex-col transition-all",
                  data.tier === 'premium' 
                    ? "border-earth bg-earth text-white" 
                    : "border-transparent bg-bg-natural hover:bg-earth/5"
                )}
              >
                <div className="flex items-center justify-between mb-2 w-full">
                  <Gem className={cn("w-4 h-4 sm:w-5 h-5", data.tier === 'premium' ? "text-sun" : "text-earth/30")} />
                  <span className={cn("font-black text-[10px] sm:text-xs uppercase tracking-widest", data.tier === 'premium' ? "text-white" : "text-earth")}>{t.premium}</span>
                </div>
                <p className={cn("text-[9px] sm:text-[10px] text-left sm:text-right font-medium leading-relaxed", data.tier === 'premium' ? "text-white/70" : "text-earth/60")}>
                  {t.premiumDesc}
                </p>
              </button>
           </div>
        </div>

        {/* Rate Slider */}
        <div className="bg-ai-bubble/30 p-5 sm:p-8 rounded-[24px] sm:rounded-[32px] border border-sage/10 flex flex-col justify-center">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mb-2 sm:mb-4">
               <SlidersHorizontal className="w-4 h-4 sm:w-5 h-5 text-sun" />
               <h3 className="font-bold text-base sm:text-lg font-serif text-earth">{t.roiSensitivity}</h3>
            </div>
            <p className="text-[10px] sm:text-xs text-sage font-medium opacity-80 mb-2 sm:mb-4">{t.impactText}</p>
            
            <div className="flex justify-between items-end mb-1">
               <span className="text-[10px] sm:text-xs font-bold text-earth">{t.adjustRate}</span>
               <span className="text-base sm:text-lg font-black text-earth">PKR {data.unitRate}<span className="text-[10px] sm:text-xs font-normal opacity-60 ml-1">/ unit</span></span>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.4 }}
           className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-[32px] border border-sage/10 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-2xl bg-sun/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-sun" />
               </div>
               <h3 className="font-bold text-earth text-lg font-serif">{t.savingsProjection}</h3>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={savingsData}>
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#606C38" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#606C38" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis 
                  dataKey="year" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#606C38' }}
                />
                <YAxis 
                  hide 
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    backgroundColor: '#fff'
                  }}
                  formatter={(val: number) => [formatPKR(val), t.cumulativeSavings]}
                />
                <Area 
                  type="monotone" 
                  dataKey="savings" 
                  stroke="#606C38" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorSavings)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.45 }}
           className="bg-white p-8 rounded-[32px] border border-sage/10 shadow-sm flex flex-col"
        >
           <div className="flex items-center gap-2 mb-6">
              <Info className="w-5 h-5 text-sun" />
              <h3 className="font-bold text-earth text-lg font-serif">{t.localizedIntel}</h3>
           </div>
           
           <div className="space-y-6 flex-1">
              <div className="p-5 bg-ai-bubble/20 rounded-2xl border border-sage/5">
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-clay">{t.whyPremium}</span>
                    <Gem className="w-4 h-4 text-sun" />
                 </div>
                 <p className="text-xs text-earth font-medium leading-relaxed">
                    {t.biFacialAdvantage}
                 </p>
              </div>

              <div className="p-5 bg-bg-natural rounded-2xl border border-sage/5">
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-clay">Policy Note</span>
                    <ShieldCheck className="w-4 h-4 text-sage" />
                 </div>
                 <p className="text-xs text-earth font-medium leading-relaxed">
                    {t.netMeteringTarget} - Optimized for AEDB Phase-2 Net-Metering compliance in {data.city}.
                 </p>
              </div>
           </div>

           <div className="mt-8 p-6 bg-earth text-white rounded-3xl overflow-hidden relative group cursor-pointer">
              <div className="relative z-10">
                 <p className="text-[9px] font-black uppercase tracking-widest text-ai-bubble/60 mb-1">{t.futureValue}</p>
                 <p className="text-xl font-bold font-serif">{formatPKR(savingsData[savingsData.length-1].savings)}</p>
                 <p className="text-[10px] mt-2 opacity-60">Over 25 year lifecycle at 5% infl.</p>
              </div>
              <ArrowUpRight className="absolute top-4 right-4 w-6 h-6 text-ai-bubble opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all" />
           </div>
        </motion.div>
      </div>

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
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="card-premium group relative overflow-hidden"
    >
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-bg-natural flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-700 ease-out-expo">
          {icon}
        </div>
        <div className="space-y-1">
          <p className="text-micro">{label}</p>
          <p className="text-3xl font-bold text-earth font-serif tracking-tight">{value}</p>
          <p className="text-xs text-sage font-bold opacity-40 uppercase tracking-widest">{subValue}</p>
        </div>
      </div>
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-bg-natural rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl" />
    </motion.div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

