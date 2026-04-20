import { useState } from 'react';
import { Search, ShieldCheck, Phone, MapPin, Star, ExternalLink, Award, Info } from 'lucide-react';
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
    safetyWarning: "Always verify the original AEDB license before making any payments."
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
    safetyWarning: "کوئی بھی ادائیگی کرنے سے پہلے اصل لائسنس خود چیک کریں۔"
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

  return (
    <div className="p-8 space-y-8 h-full bg-bg-natural/30 overflow-y-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-sage/10 pb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-earth font-serif">
            {t.title}
          </h2>
          <p className="text-sm text-sage font-medium mt-1">{t.subtitle}</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-2 rounded-[24px] shadow-sm border border-black/5 w-full md:w-auto">
          <div className="flex-1 flex items-center gap-3 px-4">
             <Search className="w-5 h-5 text-sage" />
             <input 
               type="text" 
               value={cityInput}
               onChange={(e) => setCityInput(e.target.value)}
               placeholder={t.searchPlaceholder}
               className="bg-transparent border-none outline-none text-sm font-bold text-earth w-full"
             />
          </div>
          <button 
            disabled={isSearching}
            onClick={handleSearch}
            className="bg-earth text-white px-6 py-3 rounded-2xl font-bold text-xs hover:bg-sage transition-all disabled:opacity-50"
          >
            {t.findPros}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Info Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-sage p-8 rounded-[40px] text-white space-y-4">
             <div className="flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-white" />
                <h3 className="font-bold text-xl font-serif leading-tight">{t.verifiedTitle}</h3>
             </div>
             <p className="text-xs leading-relaxed opacity-90 font-medium">
               {t.verifiedText}
             </p>
          </div>

          <div className="bg-sun/10 p-6 rounded-[32px] border border-sun/20 flex items-start gap-4">
             <div className="w-10 h-10 rounded-2xl bg-sun flex items-center justify-center shrink-0">
                <Info className="w-5 h-5 text-white" />
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-earth/60 leading-normal">
               {t.safetyWarning}
             </p>
          </div>
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
