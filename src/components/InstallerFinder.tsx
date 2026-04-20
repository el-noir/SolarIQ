import { useState } from 'react';
import { Search, ShieldCheck, Phone, MapPin, Star, ExternalLink, Award, Info, MessageCircle, Loader2 } from 'lucide-react';
import { SolarData, Language, Installer } from '@/types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface InstallerFinderProps {
  data: SolarData | null;
  language: Language;
  onSearch: (city: string) => void;
  isSearching: boolean;
}

const translations = {
  en: {
    title: "AEDB Certified Installers",
    subtitle: "Find verified solar companies in your district",
    searchPlaceholder: "Enter city (e.g., Lahore, Karachi)...",
    findPros: "Find Local Pros",
    aedbBadge: "AEDB Certified",
    verifiedTitle: "Verification Layer",
    verifiedText: "We only list companies with valid AEDB (Alternative Energy Development Board) licenses to ensure your net-metering application is successful.",
    noInstallers: "No installers listed yet. Search for your city above.",
    contact: "Contact",
    viewProfile: "View Results",
    topRated: "Top Rated",
    safetyWarning: "Always verify the original AEDB license before making any payments.",
    waConsult: "Consult on WhatsApp",
    waConsultMsg: "Assalam-o-Alaikum! I found your solar services on SolarIQ.pk. I am interested in a certified installation for my property in {city}. Please share your current rates."
  },
  ur: {
    title: "رجسٹرڈ سولر کمپنیاں (AEDB)",
    subtitle: "اپنے شہر میں تصدیق شدہ سولر ماہرین تلاش کریں",
    searchPlaceholder: "اپنے شہر کا نام لکھیں (مثلاً لاہور، کراچی)...",
    findPros: "کمپنیاں تلاش کریں",
    aedbBadge: "حکومت سے منظور شدہ",
    verifiedTitle: "تصدیق کی اہمیت",
    verifiedText: "ہم صرف ان کمپنیوں کی فہرست دکھاتے ہیں جن کے پاس AEDB کا لائسنس ہے تاکہ آپ کا نیٹ میٹرنگ کا عمل محفوظ رہے۔",
    noInstallers: "ابھی کوئی فہرست موجود نہیں ہے۔ اوپر اپنا شہر تلاش کریں۔",
    contact: "رابطہ کریں",
    viewProfile: "تفصیلات دیکھیں",
    topRated: "اعلیٰ درجہ بند",
    safetyWarning: "کوئی بھی ادائیگی کرنے سے پہلے اصل لائسنس خود چیک کریں۔",
    waConsult: "واٹس ایپ مشاورت",
    waConsultMsg: "السلام علیکم! میں نے آپ کی سولر سروسز SolarIQ.pk پر دیکھیں۔ میں {city} میں اپنے گھر کے لیے سولر انسٹالیشن کروانا چاہتا ہوں۔ براہ کرم تفصیلات شیئر کریں۔"
  }
};

export default function InstallerFinder({ data, language, onSearch, isSearching }: InstallerFinderProps) {
  const t = translations[language];
  const [cityInput, setCityInput] = useState(data?.city || '');

  const handleSearch = () => {
    if (cityInput.trim()) {
      onSearch(cityInput);
    }
  };

  const consultExpertOnWA = () => {
    const city = cityInput || "my city";
    const message = encodeURIComponent(t.waConsultMsg.replace('{city}', city));
    // Representative AEDB Support Channel placeholder (generic for demo, or real if any)
    window.open(`https://wa.me/923000000000?text=${message}`, '_blank');
  };

  return (
    <div className="p-6 sm:p-12 space-y-12 h-full bg-bg-natural/30 overflow-y-auto no-scrollbar max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-sage/10 pb-12">
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-earth leading-none">
            {t.title}
          </h2>
          <div className="flex items-center gap-2 text-sage font-bold">
             <ShieldCheck className="w-4 h-4 text-sun" />
             <p className="text-xs uppercase tracking-widest leading-none">{t.subtitle}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-3 rounded-3xl shadow-xl shadow-earth/5 border border-black/5 w-full lg:w-96">
          <div className="flex-1 flex items-center gap-3 px-4">
             <Search className="w-5 h-5 text-sage" />
             <input 
               type="text" 
               value={cityInput}
               onChange={(e) => setCityInput(e.target.value)}
               placeholder={t.searchPlaceholder}
               className="bg-transparent border-none outline-none text-sm font-bold text-earth w-full placeholder:text-sage/40"
             />
          </div>
          <button 
            disabled={isSearching}
            onClick={handleSearch}
            className="btn-primary px-8"
          >
            {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : t.findPros}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Info Column */}
        <div className="lg:col-span-1 space-y-8">
          <div className="card-premium bg-earth text-white space-y-6">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                   <ShieldCheck className="w-7 h-7 text-sun" />
                </div>
                <h3 className="font-bold text-xl leading-tight">{t.verifiedTitle}</h3>
             </div>
             <p className="text-sm leading-relaxed opacity-70 font-medium">
               {t.verifiedText}
             </p>
             <div className="pt-4 border-t border-white/10">
                <p className="text-micro text-sun mb-2">AEDB Certification Check</p>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-[10px] font-black uppercase tracking-widest">{language === 'ur' ? 'لائیو تصدیق جاری ہے' : 'Live Verification Active'}</span>
                </div>
             </div>
          </div>

          <div className="bg-sun/10 p-6 rounded-[32px] border border-sun/20 flex items-start gap-4">
             <div className="w-10 h-10 rounded-2xl bg-sun flex items-center justify-center shrink-0">
                <Info className="w-5 h-5 text-white" />
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-earth/60 leading-normal">
               {t.safetyWarning}
             </p>
          </div>

          <button 
            onClick={consultExpertOnWA}
            className="w-full bg-[#25D366] text-white p-6 rounded-[32px] flex items-center justify-center gap-3 font-bold hover:bg-[#128C7E] transition-all shadow-xl shadow-green-500/10 text-sm"
          >
            <MessageCircle className="w-6 h-6 fill-white" />
            {t.waConsult}
          </button>
        </div>

        {/* Results Column (Visual Placeholder/Instructions) */}
        <div className="lg:col-span-2">
           <div className="bg-white/50 border-2 border-dashed border-sage/20 rounded-[40px] p-12 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mb-6">
                 <Award className="w-10 h-10 text-sage/20" />
              </div>
              <h3 className="text-lg font-bold text-earth/60 font-serif italic mb-4">
                {language === 'ur' ? 'تجزیہ کار آپ کے شہر میں بہترین کمپنیاں تلاش کر رہا ہے۔ چیسٹ میں رزلٹ دیکھیں۔' : 'I am searching for verified AEDB companies in your district. Check Chat for details.'}
              </h3>
              <p className="text-xs text-sage font-medium max-w-sm">
                {language === 'ur' 
                  ? 'سولر آئی کیو گوگل سرچ کے ذریعے ان کمپنیوں کے ریٹس اور سرٹیفیکیشن چیک کرتا ہے۔' 
                  : 'SolarIQ uses live search to verify AEDB licenses and current market ratings for you.'}
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
