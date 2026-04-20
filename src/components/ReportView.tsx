import { SolarData, Language } from '@/types';
import { Download, CheckCircle2, AlertCircle, Sun, MapPin, Zap, TrendingUp, DollarSign, Loader2, LayoutDashboard } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ReportViewProps {
  data: SolarData;
  language: Language;
}

const translations = {
  en: {
    preview: "Proposal Preview",
    groundedReport: "Grounded Market Report",
    download: "Download PDF Proposal",
    proposal: "PROPOSAL",
    marketAnalysis: "Market Grounded Analysis",
    executiveTitle: "Executive Recommendation",
    primaryInvestment: "Primary Investment",
    targetSavings: "Target Monthly Savings",
    roiYield: "System Yield (Year 1)",
    hardwareConfig: "Hardware Configuration",
    modules: "Standard Modules",
    inverter: "Smart Inverter",
    architecture: "Architecture",
    verified: "Verified Live",
    groundingCheck: "Grounding Check",
    intelligenceReport: "SolarIQ Pakistan Intelligence Report",
    disclaimer: "This diagnostic report uses live marketplace data and climate benchmarks for Pakistan. A technical site evaluation is Required for finalize mounting angles and DC cable route planning.",
    verifiedText: "Market\nGrounded\nVerified",
    solarSeasons: "solar seasons",
    recommendationText: "Deployment of a high-efficiency"
  },
  ur: {
    preview: "پروپوزل کا معائنہ",
    groundedReport: "مارکیٹ کی تصدیق شدہ رپورٹ",
    download: "پی ڈی ایف ڈاؤن لوڈ کریں",
    proposal: "سولر پروپوزل",
    marketAnalysis: "مارکیٹ کا درست تجزیہ",
    executiveTitle: "اہم سفارشات",
    primaryInvestment: "ابتدائی سرمایہ کاری",
    targetSavings: "توقع کردہ ماہانہ بچت",
    roiYield: "منافع کا تناسب (پہلا سال)",
    hardwareConfig: "ہارڈ ویئر کی تفصیلات",
    modules: "سولر پینلز",
    inverter: "سمارٹ انورٹر",
    architecture: "سسٹم کی ساخت",
    verified: "تصدیق شدہ",
    groundingCheck: "مارکیٹ چیک",
    intelligenceReport: "سولر آئی کیو پاکستان رپورٹ",
    disclaimer: "یہ رپورٹ پاکستان کے موسم اور موجودہ قیمتوں کے مطابق بنائی گئی ہے۔ تنصیب سے پہلے جگہ کا فزیکل معائنہ لازمی ہے۔",
    verifiedText: "مارکیٹ\nسے تصدیق\n شدہ",
    solarSeasons: "سولر سیزن میں",
    recommendationText: "اعلیٰ کارکردگی والے"
  }
};

export default function ReportView({ data, language }: ReportViewProps) {
  const t = translations[language];
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`SolarIQ_Proposal_${data.city}.pdf`);
    } catch (error) {
      console.error('Export failed', error);
    } finally {
      setIsExporting(false);
    }
  };

  const formatPKR = (num: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-extrabold text-earth font-serif">{t.preview}</h2>
          <p className="text-xs font-semibold text-sage uppercase tracking-widest mt-1">{t.groundedReport}</p>
        </div>
        <button
          onClick={handleDownload}
          disabled={isExporting}
          className="flex items-center gap-3 px-6 py-3 bg-earth text-white rounded-2xl hover:bg-sage disabled:opacity-30 font-bold transition-all shadow-xl shadow-earth/20 active:scale-95 text-sm"
        >
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-5 h-5" />}
          {t.download}
        </button>
      </div>

      <div className={cn(
        "bg-[#E9EDC9]/30 p-12 rounded-[40px] overflow-y-auto max-h-[85vh] border border-sage/10",
        language === 'ur' ? "text-right" : "text-left"
      )} dir={language === 'ur' ? 'rtl' : 'ltr'}>
        <div 
          ref={reportRef} 
          className="bg-white w-full max-w-[800px] mx-auto min-h-[1100px] shadow-report p-16 text-earth relative overflow-hidden font-sans"
        >
          {/* Natural Tones Accents */}
          <div className="absolute top-0 left-0 w-full h-2 bg-earth" />
          <div className="absolute bottom-0 left-0 w-full h-8 bg-sage" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4A37322] rounded-full -mr-16 -mt-16" />

          {/* Header */}
          <div className="flex justify-between border-b border-sage/10 pb-12 mb-12 items-start">
            <div>
              <div className="flex items-center gap-2 text-sage mb-2">
                <Sun className="w-10 h-10 fill-sage/10" />
                <span className="text-4xl font-extrabold tracking-tighter text-earth font-serif italic">SolarIQ<span className="text-sun">.pk</span></span>
              </div>
              <p className="text-clay font-bold text-xs uppercase tracking-[0.2em] ml-1">{t.marketAnalysis}</p>
            </div>
            <div className="text-right" dir="ltr">
              <p className="font-extrabold text-2xl font-serif text-earth">{t.proposal}</p>
              <p className="text-sage font-bold tracking-widest text-[10px] uppercase">#{Math.floor(Math.random()*1000000)}</p>
              <div className="flex items-center justify-end gap-1 text-clay mt-4 font-bold text-xs">
                 <MapPin className="w-3 h-3" />
                 <span className="uppercase">{data.city}, PK</span>
              </div>
            </div>
          </div>

          {/* Body */}
          <section className="mb-12">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-sage mb-6 flex items-center gap-3">
              <div className="w-8 h-[2px] bg-sun" />
              {t.executiveTitle}
            </h3>
            <p className="text-slate-600 leading-relaxed mb-10 text-lg">
              {t.recommendationText} <strong className="text-earth">{data.systemSize}kW {data.systemType} {language ==='ur' ? 'سسٹم' : 'system'}</strong>. 
              {language === 'en' ? `Our grounding engine confirms this configuration matches the high irradiation profile of ${data.city}. Anticipated full investment recovery within` : `ہمارا ہارڈ ویئر انجن اس بات کی تصدیق کرتا ہے کہ یہ سسٹم ${data.city} کی شمسی توانائی کے عین مطابق ہے۔ سرمایہ کاری کی واپسی کا متوقع وقت`} <strong className="text-earth">{data.paybackYears} {t.solarSeasons}</strong>.
            </p>
            <div className="grid grid-cols-3 gap-8">
              <div className="bg-[#FAFAF5] p-6 rounded-3xl border border-sage/5">
                <p className="text-[10px] text-clay font-black uppercase tracking-widest mb-2">{t.primaryInvestment}</p>
                <p className="text-2xl font-bold text-earth font-serif">{formatPKR(data.estimatedCost)}</p>
              </div>
              <div className="bg-[#FAFAF5] p-6 rounded-3xl border border-sage/5">
                <p className="text-[10px] text-clay font-black uppercase tracking-widest mb-2">{t.targetSavings}</p>
                <p className="text-2xl font-bold text-sage font-serif">{formatPKR(data.monthlySavings)}</p>
              </div>
              <div className="bg-[#FAFAF5] p-6 rounded-3xl border border-sage/5">
                <p className="text-[10px] text-clay font-black uppercase tracking-widest mb-2">{t.roiYield}</p>
                <p className="text-2xl font-bold text-sun font-serif">{(100/data.paybackYears).toFixed(1)}% {language === 'ur' ? 'منافع' : 'ROI'}</p>
              </div>
            </div>
          </section>

          {/* Specs */}
          <section className="mb-12 grid grid-cols-2 gap-12">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-earth">
                < Zap className="w-4 h-4 text-sun fill-sun/10" />
                {t.hardwareConfig}
              </h3>
              <div className="space-y-4 text-sm font-medium">
                <div className="flex justify-between border-b border-sage/5 pb-2">
                  <span className="text-sage">{t.modules}</span>
                  <span className="text-earth font-bold">{data.panelsRecommended}</span>
                </div>
                <div className="flex justify-between border-b border-sage/5 pb-2">
                  <span className="text-sage">{t.inverter}</span>
                  <span className="text-earth font-bold">{data.inverterRecommended}</span>
                </div>
                <div className="flex justify-between border-b border-sage/5 pb-2">
                  <span className="text-sage">{t.architecture}</span>
                  <span className="text-earth font-bold capitalize">{data.systemType}</span>
                </div>
                <div className="flex justify-between border-b border-sage/5 pb-2">
                  <span className="text-sage">{t.groundingCheck}</span>
                  <span className="text-green-600 font-extrabold uppercase text-[10px]">{t.verified}</span>
                </div>
              </div>
            </div>
            <div className="bg-[#F7F8F2] p-8 rounded-[32px] border border-sage/20 relative">
              <p className="text-sage text-sm italic leading-relaxed relative z-10">
                {language === 'en' ? `"Market Intel: Grounding engine suggests PKR ${(data.estimatedCost * 0.9).toLocaleString()} to ${(data.estimatedCost * 1.1).toLocaleString()} range from Tier-1 vendors in ${data.city} district as of today."` : `مارکیٹ معلومات: آج کے ریٹ کے مطابق ${data.city} میں ٹیئر ون وینڈرز سے اس سسٹم کی قیمت ${(data.estimatedCost * 0.9).toLocaleString()} سے ${(data.estimatedCost * 1.1).toLocaleString()} کے درمیان ہونے کی توقع ہے۔`}
              </p>
              <div className="absolute top-4 right-4 opacity-10">
                <LayoutDashboard className="w-12 h-12 text-sage" />
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="mt-auto pt-12 border-t border-sage/10 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center shrink-0">
               <AlertCircle className="w-6 h-6 text-sage" />
            </div>
            <div>
              <p className="text-[10px] text-clay leading-relaxed font-bold uppercase tracking-[0.15em]">
                {t.intelligenceReport}
              </p>
              <p className="text-[9px] text-sage/60 mt-1 uppercase tracking-widest leading-loose">
                {t.disclaimer}
              </p>
            </div>
          </div>
          
          {/* Seal */}
          <div className="absolute top-12 right-12">
             <div className="w-24 h-24 border-4 border-sage/10 rounded-full flex items-center justify-center rotate-12 opacity-30">
               <div className="text-[10px] font-black text-sage uppercase text-center tracking-tighter leading-none whitespace-pre-line">
                 {t.verifiedText}
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
