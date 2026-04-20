import { useState, useMemo } from 'react';
import { SolarData, Language } from './types';
import Chat from './components/Chat';
import Dashboard from './components/Dashboard';
import ReportView from './components/ReportView';
import { Sun, LayoutDashboard, FileText, Menu, X, Globe } from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [solarData, setSolarData] = useState<SolarData | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'report'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [customUnitRate, setCustomUnitRate] = useState<number>(45);

  const adjustedData = useMemo(() => {
    if (!solarData) return null;
    const rate = customUnitRate || 40;
    // Recalculate savings based on unit rate
    const monthlySavings = solarData.monthlyUnits * rate;
    const paybackYears = Number((solarData.estimatedCost / (monthlySavings * 12)).toFixed(1));
    return {
      ...solarData,
      monthlySavings,
      paybackYears,
      unitRate: rate
    };
  }, [solarData, customUnitRate]);

  return (
    <div className={cn(
      "flex flex-col lg:flex-row h-screen bg-bg-natural overflow-hidden",
      language === 'ur' ? "font-urdu text-right" : "font-sans"
    )} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      {/* Sidebar - Chat (Always visible on large screens) */}
      <aside className={cn(
        "w-full lg:w-[400px] xl:w-[450px] flex-shrink-0 z-40 transition-transform duration-300",
        isMobileMenuOpen ? "translate-x-0" : (language === 'ur' ? "translate-x-full" : "-translate-x-full") + " lg:translate-x-0",
        "fixed lg:relative inset-0 lg:inset-auto h-full shadow-2xl lg:shadow-none"
      )}>
        <Chat 
          onDataUpdate={setSolarData} 
          language={language}
          unitRate={customUnitRate}
        />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative h-full">
        {/* Navigation Header */}
        <header className="h-[72px] bg-white/80 backdrop-blur-md border-b border-black/5 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-sage/10 rounded-lg text-sage"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sage flex items-center justify-center lg:hidden shadow-sm">
                <Sun className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-earth tracking-tight hidden sm:block font-serif">
                SolarIQ<span className="text-sun">.pk</span>
              </h1>
            </div>
          </div>

          <nav className="flex items-center bg-[#E9EDC9]/30 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={cn(
                "flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold transition-all",
                activeTab === 'dashboard' ? "bg-white text-earth shadow-sm" : "text-sage hover:text-earth"
              )}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{language === 'ur' ? 'ڈیش بورڈ' : 'Dashboard'}</span>
            </button>
            <button
              onClick={() => setActiveTab('report')}
              disabled={!solarData}
              className={cn(
                "flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold transition-all",
                activeTab === 'report' ? "bg-white text-earth shadow-sm" : "text-sage hover:text-earth disabled:opacity-30"
              )}
            >
              <FileText className="w-4 h-4" />
              <span>{language === 'ur' ? 'پروپوزل' : 'Proposal'}</span>
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLanguage(lang => lang === 'en' ? 'ur' : 'en')}
              className="px-3 py-1.5 bg-earth shadow-lg shadow-earth/20 text-white rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-sage transition-all"
            >
              <Globe className="w-3.5 h-3.5" />
              {language === 'en' ? 'Urdu' : 'English'}
            </button>
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] font-bold text-sage uppercase tracking-widest">Market Feed</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-sage animate-pulse" />
                <span className="text-xs text-clay font-bold tracking-tighter">Verified Daily</span>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' ? (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="h-full"
              >
                <Dashboard 
                  data={adjustedData} 
                  language={language}
                  onRateChange={setCustomUnitRate}
                />
              </motion.div>
            ) : adjustedData && (
              <motion.div
                key="report"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="h-full overflow-y-auto"
              >
                <ReportView data={adjustedData} language={language} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Background Decorative Element */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden opacity-30">
          <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-sun/10 rounded-full blur-[140px] -mr-[300px]" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-sage/10 rounded-full blur-[120px]" />
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-earth/20 backdrop-blur-sm z-30 lg:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
