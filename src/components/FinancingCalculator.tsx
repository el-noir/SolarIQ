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
    <div className="p-8 space-y-8 h-full bg-bg-natural/30 overflow-y-auto">
      <div className="flex items-center justify-between border-b border-sage/10 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-earth font-serif">
            {t.title}
          </h2>
          <p className="text-sm text-sage font-medium mt-1">{t.subtitle}</p>
        </div>
        <Landmark className="w-10 h-10 text-sage/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-[32px] shadow-sm border border-black/5 space-y-6">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-clay mb-3 block">{t.bank}</label>
              <div className="space-y-2">
                {DEFAULT_BANKS.map((bank, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSelectedBank(bank);
                      setCustomTenure(bank.tenureYears);
                      setCustomDownPayment(bank.downPaymentPercent);
                    }}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border text-left text-sm font-bold flex items-center justify-between transition-all",
                      selectedBank.bankName === bank.bankName 
                        ? "bg-sage border-sage text-white shadow-md shadow-sage/20" 
                        : "bg-bg-natural border-black/5 text-earth hover:border-sage/30"
                    )}
                  >
                    <span className="truncate">{bank.bankName}</span>
                    <span className="text-[10px] opacity-80">{bank.markupRate}%</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-clay">{t.tenure}</label>
                <span className="text-sm font-bold text-earth">{customTenure} Y</span>
              </div>
              <input 
                type="range" min="1" max="10" step="1" 
                value={customTenure}
                onChange={(e) => setCustomTenure(Number(e.target.value))}
                className="w-full h-1.5 bg-bg-natural rounded-lg appearance-none cursor-pointer accent-sage"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-clay">{t.downPayment}</label>
                <span className="text-sm font-bold text-earth">{customDownPayment}%</span>
              </div>
              <input 
                type="range" min="10" max="50" step="5" 
                value={customDownPayment}
                onChange={(e) => setCustomDownPayment(Number(e.target.value))}
                className="w-full h-1.5 bg-bg-natural rounded-lg appearance-none cursor-pointer accent-sun"
              />
            </div>
          </div>

          <div className="bg-earth p-6 rounded-[32px] text-white flex items-start gap-4">
            <Info className="w-5 h-5 text-sun shrink-0" />
            <p className="text-[10px] font-medium leading-relaxed opacity-80 italic">
              {t.emiHelp}
            </p>
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 rounded-[40px] border border-black/5 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-6 text-clay">
                <CreditCard className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">{t.monthlyInstallment}</span>
              </div>
              <p className="text-4xl font-extrabold text-earth font-serif">
                {formatPKR(stats.emi)}
              </p>
              <div className="mt-4 p-3 bg-bg-natural rounded-xl flex items-center justify-between text-xs font-bold text-sage">
                <span>{t.totalLoan}:</span>
                <span>{formatPKR(stats.loanAmount)}</span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-ai-bubble/40 p-8 rounded-[40px] border border-sage/10 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-6 text-sage">
                <TrendingDown className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">{t.monthlySavings}</span>
              </div>
              <p className="text-4xl font-extrabold text-earth font-serif">
                {formatPKR(data.monthlySavings)}
              </p>
              <div className="mt-4 p-3 bg-white/50 rounded-xl flex items-center justify-between text-xs font-bold text-earth/60">
                <span>Monthly Bill Units:</span>
                <span>{data.monthlyUnits}</span>
              </div>
            </motion.div>
          </div>

          {/* Comparison Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-8 rounded-[40px] relative overflow-hidden transition-colors border",
              stats.isProfitable 
                ? "bg-sage text-white border-white/10" 
                : "bg-clay/10 text-earth border-clay/20"
            )}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
              <div className="space-y-2">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] opacity-80">{t.netMonthly}</h3>
                <p className="text-5xl font-black font-serif">
                  {stats.isProfitable ? "+" : ""}{formatPKR(stats.netImpact)}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold pt-2">
                   <div className={cn("w-2 h-2 rounded-full", stats.isProfitable ? "bg-ai-bubble" : "bg-red-500")} />
                   {stats.isProfitable ? t.isProfitable : t.notProfitable}
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                 <div className="bg-black/20 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{t.outOfPocket}</p>
                    <p className="text-xl font-bold">{formatPKR(stats.downPayment)}</p>
                 </div>
              </div>
            </div>
            
            <ArrowRightLeft className={cn(
              "absolute -right-8 -bottom-8 w-48 h-48 opacity-10 rotate-12",
              stats.isProfitable ? "text-white" : "text-clay"
            )} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
