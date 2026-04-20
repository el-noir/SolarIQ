import { Zap, TrendingUp, DollarSign, Calculator, Battery, Sun, MapPin } from 'lucide-react';
import { SolarData } from '@/types';
import { motion } from 'motion/react';

interface DashboardProps {
  data: SolarData | null;
}

export default function Dashboard({ data }: DashboardProps) {
  if (!data) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-bg-natural/50">
        <Sun className="w-16 h-16 text-sage/20 mb-6 animate-pulse" />
        <h3 className="text-2xl font-bold text-earth/40 font-serif italic">Analysis Pending</h3>
        <p className="max-w-xs mt-3 text-sm text-sage/60 font-medium">
          Upload your electricity bill or tell me your monthly unit consumption to see your solar potential here.
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
          <h2 className="text-3xl font-extrabold text-earth font-serif">System Overview</h2>
          <div className="flex items-center gap-2 text-sage text-sm mt-2 font-medium">
            <MapPin className="w-4 h-4 text-sun" />
            <span>{data.city}, Pakistan • Market Analysis Grounded</span>
          </div>
        </div>
        <div className="px-5 py-2 bg-ai-bubble text-earth rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border border-sage/10">
          {data.systemType} Solution
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={<Zap className="text-sage" />}
          label="Proposed Size"
          value={`${data.systemSize} kW`}
          subValue="Peak Generation"
          delay={0}
        />
        <MetricCard
          icon={<DollarSign className="text-clay" />}
          label="Total Investment"
          value={formatPKR(data.estimatedCost)}
          subValue="Current Market Avg"
          delay={0.1}
        />
        <MetricCard
          icon={<TrendingUp className="text-sage" />}
          label="Annual Savings"
          value={formatPKR(data.monthlySavings * 12)}
          subValue={formatPKR(data.monthlySavings) + " saved monthly"}
          delay={0.2}
        />
        <MetricCard
          icon={<Calculator className="text-sun" />}
          label="Payback Period"
          value={`${data.paybackYears} Years`}
          subValue="Return on Investment"
          delay={0.3}
        />
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
            <h3 className="font-bold text-earth text-lg font-serif">Hardware Profile</h3>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-center group">
              <div>
                <p className="text-[10px] text-sage font-black uppercase tracking-[0.1em] mb-1">Solar Panels</p>
                <p className="text-earth font-bold text-lg">{data.panelsRecommended}</p>
              </div>
              <span className="text-[10px] px-3 py-1 bg-sage/10 text-sage rounded-xl font-bold border border-sage/10">Tier 1</span>
            </div>
            <div className="flex justify-between items-center group">
              <div>
                <p className="text-[10px] text-sage font-black uppercase tracking-[0.1em] mb-1">Inverter Core</p>
                <p className="text-earth font-bold text-lg">{data.inverterRecommended}</p>
              </div>
              <span className="text-[10px] px-3 py-1 bg-sun/10 text-sun rounded-xl font-bold border border-sun/10">Smart Hybrid</span>
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
               Localized Intelligence
            </div>
            <h3 className="text-2xl font-bold font-serif mb-3 leading-tight">Environmental Impact in {data.city}</h3>
            <p className="text-sm opacity-80 leading-relaxed font-medium">
              Based on local irradiation levels, this {data.systemSize}kW system will generate roughly {(data.systemSize * 4.2).toFixed(1)} units daily. 
              Reducing your dependence on the grid can save up to {(data.monthlySavings/35).toFixed(0)} carbon-equivalent trees monthly.
            </p>
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3 text-xs font-bold uppercase tracking-widest cursor-pointer group">
              <span className="group-hover:translate-x-1 transition-transform">Download Technical Analysis</span>
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
