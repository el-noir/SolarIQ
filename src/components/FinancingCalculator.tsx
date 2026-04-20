import { useState, useMemo } from 'react';
import { SolarData, Language, FinancingOption } from '@/types';
import { motion } from 'motion/react';
import { Landmark, CreditCard, Calendar, Percent, ArrowRightLeft, Info, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FinancingCalculatorProps {
  data: SolarData;
  language: Language;
}

const DEFAULT_BANKS: FinancingOption[] = [
  { bankName: "Meezan Bank (Solar)", markupRate: 21, tenureYears: 5, downPaymentPercent: 20 },
  { bankName: "Bank Alfalah", markupRate: 22.5, tenureYears: 3, downPaymentPercent: 25 },
  { bankName: "SBP Green Scheme", markupRate: 6, tenureYears: 10, downPaymentPercent: 15 },
];

const translations = {
  en: {
    title: "Financing & Installments",
    subtitle: "Compare monthly EMIs with electricity savings",
    calculate: "Calculator",
    bank: "Preferred Bank",
    tenure: "Tenure (Years)",
    downPayment: "Down Payment (%)",
    summary: "Financial Summary",
    monthlyInstallment: "Monthly Installment (EMI)",
    monthlySavings: "Monthly Savings (Solar)",
    netMonthly: "Net Monthly Impact",
    isProfitable: "System pays for its own installment!",
    notProfitable: "Installment slightly higher than savings.",
    outOfPocket: "Total Out of Pocket",
    totalLoan: "Total Loan Amount",
    emiHelp: "Calculated using current market markup rates for 2026.",
    compareLabel: "Savings vs Installment"
  },
  ur: {
    title: "قسطوں پر سولر (فنانسنگ)",
    subtitle: "ماہانہ قسط اور بجلی کی بچت کا موازنہ کریں",
    calculate: "کیلکولیٹر",
    bank: "بینک کا انتخاب",
    tenure: "مدت (سال)",
    downPayment: "ایڈوانس ادائیگی (%)",
    summary: "مالی خلاصہ",
    monthlyInstallment: "ماہانہ قسط",
    monthlySavings: "سولر سے بچت",
    netMonthly: "ماہانہ فرق",
    isProfitable: "سولر اپنی قسط خود اتار رہا ہے!",
    notProfitable: "قسط بچت سے تھوڑی زیادہ ہے۔",
    outOfPocket: "شروع میں ادائیگی (ایڈوانس)",
    totalLoan: "کل قرضہ",
    emiHelp: "ماہانہ قسط کا حساب ۲۰۲۶ کے ریٹ کے مطابق لگایا گیا ہے۔",
    compareLabel: "بچت بمقابلہ قسط"
  }
};

export default function FinancingCalculator({ data, language }: FinancingCalculatorProps) {
  const t = translations[language];
  const [selectedBank, setSelectedBank] = useState(DEFAULT_BANKS[0]);
  const [customTenure, setCustomTenure] = useState(selectedBank.tenureYears);
  const [customDownPayment, setCustomDownPayment] = useState(selectedBank.downPaymentPercent);

  const stats = useMemo(() => {
    const totalCost = data.estimatedCost;
    const downPayment = (customDownPayment / 100) * totalCost;
    const loanAmount = totalCost - downPayment;
    const monthlyRate = (selectedBank.markupRate / 100) / 12;
    const totalMonths = customTenure * 12;

    // EMI Formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
    const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
    
    const netImpact = data.monthlySavings - emi;

    return {
      downPayment,
      loanAmount,
      emi,
      netImpact,
      isProfitable: netImpact > 0
    };
  }, [data, selectedBank, customTenure, customDownPayment]);

  const formatPKR = (num: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="p-6 sm:p-12 space-y-12 h-full bg-bg-natural/30 overflow-y-auto no-scrollbar max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-sage/10 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-8 bg-sun rounded-full" />
             <h2 className="text-4xl sm:text-5xl font-extrabold text-earth leading-none">
               {t.title}
             </h2>
          </div>
          <p className="text-xs font-bold text-sage uppercase tracking-[0.2em]">{t.subtitle}</p>
        </div>
        <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center shadow-xl shadow-earth/5 border border-black/5 shrink-0">
          <Landmark className="w-8 h-8 text-sun" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Input Controls */}
        <div className="lg:col-span-1 space-y-8">
          <div className="card-premium space-y-8">
            <div>
              <label className="text-micro mb-4 block text-clay">{t.bank}</label>
              <div className="space-y-3">
                {DEFAULT_BANKS.map((bank, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedBank(bank);
                      setCustomTenure(bank.tenureYears);
                      setCustomDownPayment(bank.downPaymentPercent);
                    }}
                    className={cn(
                      "w-full px-5 py-4 rounded-2xl border text-left text-sm font-bold flex items-center justify-between transition-all duration-300",
                      selectedBank.bankName === bank.bankName 
                        ? "bg-earth border-earth text-white shadow-xl shadow-earth/20 -translate-y-1" 
                        : "bg-bg-natural border-transparent text-earth hover:border-sage/30"
                    )}
                  >
                    <span className="truncate">{bank.bankName}</span>
                    <span className={cn("text-[10px] font-black tracking-widest", selectedBank.bankName === bank.bankName ? "text-sun" : "text-clay")}>{bank.markupRate}%</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-micro text-clay">{t.tenure}</label>
                <span className="text-sm font-black text-earth bg-bg-natural px-3 py-1 rounded-lg">{customTenure} Y</span>
              </div>
              <input 
                type="range" min="1" max="10" step="1" 
                value={customTenure}
                onChange={(e) => setCustomTenure(Number(e.target.value))}
                className="w-full h-2 bg-bg-natural rounded-lg appearance-none cursor-pointer accent-earth transition-all"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-micro text-clay">{t.downPayment}</label>
                <span className="text-sm font-black text-earth bg-bg-natural px-3 py-1 rounded-lg">{customDownPayment}%</span>
              </div>
              <input 
                type="range" min="10" max="50" step="5" 
                value={customDownPayment}
                onChange={(e) => setCustomDownPayment(Number(e.target.value))}
                className="w-full h-2 bg-bg-natural rounded-lg appearance-none cursor-pointer accent-sun transition-all"
              />
            </div>
          </div>

          <div className="card-glass flex items-start gap-4">
            <Info className="w-5 h-5 text-sun shrink-0" />
            <p className="text-[10px] font-bold leading-relaxed text-earth opacity-60 uppercase tracking-widest">
              {t.emiHelp}
            </p>
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-2 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <MetricCard
              icon={<CreditCard className="text-earth" />}
              label={t.monthlyInstallment}
              value={formatPKR(stats.emi)}
              subValue={`${t.totalLoan}: ${formatPKR(stats.loanAmount)}`}
              delay={0}
            />

            <MetricCard
              icon={<TrendingDown className="text-earth" />}
              label={t.monthlySavings}
              value={formatPKR(data.monthlySavings)}
              subValue={`Impact on monthly bill units: ${data.monthlyUnits}`}
              delay={0.1}
            />
          </div>

          {/* Comparison Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className={cn(
              "card-premium p-10 relative overflow-hidden transition-all duration-700",
              stats.isProfitable 
                ? "bg-sage text-white border-none shadow-2xl shadow-sage/40" 
                : "bg-ai-bubble/20 text-earth border-sage/10 shadow-xl"
            )}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 relative z-10 text-right md:text-left">
              <div className="space-y-4">
                <h3 className="text-micro opacity-80" style={{ color: stats.isProfitable ? 'white' : 'inherit' }}>{t.netMonthly}</h3>
                <p className="text-6xl font-black font-serif leading-none">
                  {stats.isProfitable ? "+" : ""}{formatPKR(stats.netImpact)}
                </p>
                <div className="flex items-center gap-3 text-xs font-bold pt-2 justify-end md:justify-start">
                   <div className={cn("w-2.5 h-2.5 rounded-full", stats.isProfitable ? "bg-ai-bubble animate-pulse" : "bg-red-500")} />
                   <span className="uppercase tracking-widest leading-none">{stats.isProfitable ? t.isProfitable : t.notProfitable}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 justify-end md:justify-start">
                 <div className="bg-white/10 backdrop-blur-3xl px-8 py-6 rounded-[32px] border border-white/10 text-center">
                    <p className="text-micro mb-2 opacity-60" style={{ color: stats.isProfitable ? 'white' : 'inherit' }}>{t.outOfPocket}</p>
                    <p className="text-2xl font-bold font-serif">{formatPKR(stats.downPayment)}</p>
                 </div>
              </div>
            </div>
            
            <ArrowRightLeft className={cn(
              "absolute -right-8 -bottom-8 w-64 h-64 opacity-5 rotate-12 transition-transform duration-1000 group-hover:scale-110",
              stats.isProfitable ? "text-white" : "text-clay"
            )} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Reuse MetricCard or import it - since it is simple let's keep a consistent copy here for independent components if needed
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
