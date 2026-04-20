import { useState, useMemo } from 'react';
import { SolarData, Language, SystemTier } from './types';
import Chat from './components/Chat';
import Dashboard from './components/Dashboard';
import ReportView from './components/ReportView';
import FinancingCalculator from './components/FinancingCalculator';
import InstallerFinder from './components/InstallerFinder';
import { Sun, LayoutDashboard, FileText, Menu, X, Globe, Landmark, ShieldCheck } from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [solarData, setSolarData] = useState<SolarData | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'report' | 'financing' | 'installers' | 'chat'>('dashboard');
  const [installerSearch, setInstallerSearch] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [customUnitRate, setCustomUnitRate] = useState<number>(45);
  const [systemTier, setSystemTier] = useState<SystemTier>('economy');

  const adjustedData = useMemo(() => {
    if (!solarData) return null;
    const rate = customUnitRate || 40;
    
    // Apply tier multipliers
    // Economy is the baseline provided by AI
    let cost = solarData.estimatedCost;
    let units = solarData.monthlyUnits;
    
    if (systemTier === 'premium') {
      cost = solarData.estimatedCost * 1.25; // 25% more expensive components
      units = solarData.monthlyUnits * 1.10; // 10% more yield from bifacial/premium panels
    }
    
    const monthlySavings = units * rate;
    const paybackYears = Number((cost / (monthlySavings * 12)).toFixed(1));
    
    return {
      ...solarData,
      estimatedCost: cost,
      monthlyUnits: units,
      monthlySavings,
      paybackYears,
      unitRate: rate,
      tier: systemTier
    };
  }, [solarData, customUnitRate, systemTier]);

  const navItems = [
    { id: 'dashboard', label: language === 'ur' ? 'ڈیش بورڈ' : 'Dashboard', icon: LayoutDashboard },
    { id: 'chat', label: language === 'ur' ? 'ایڈوائزر' : 'Advisor', icon: Sun, mobileOnly: true },
    { id: 'financing', label: language === 'ur' ? 'فنانسنگ' : 'Invest', icon: Landmark },
    { id: 'installers', label: language === 'ur' ? 'انسٹالرز' : 'Pros', icon: ShieldCheck },
    { id: 'report', label: language === 'ur' ? 'پروپوزل' : 'Proposal', icon: FileText, disabled: !solarData },
  ];

  return (
    <div className={cn(
      "flex flex-col lg:flex-row h-screen bg-bg-natural overflow-hidden",
      language === 'ur' ? "font-urdu text-right" : "font-sans"
    )} dir={language === 'ur' ? 'rtl' : 'ltr'}>
      {/* Sidebar - Chat (Visible only on large screens) */}
      <aside className={cn(
        "hidden lg:flex w-[400px] xl:w-[450px] flex-shrink-0 z-40 border-r border-black/5",
        "h-full"
      )}>
        <Chat 
          onDataUpdate={setSolarData} 
          language={language}
          unitRate={customUnitRate}
          externalInput={installerSearch}
          onExternalInputHandled={() => setInstallerSearch(null)}
        />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 relative h-full safe-bottom">
        {/* Navigation Header */}
        <header className="h-[64px] sm:h-[72px] bg-white/80 backdrop-blur-md border-b border-black/5 flex items-center justify-between px-4 sm:px-8 shrink-0 z-50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sage flex items-center justify-center shadow-lg shadow-sage/20">
                <Sun className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-earth tracking-tight font-serif">
                SolarIQ<span className="text-sun">.pk</span>
              </h1>
            </div>
          </div>

          <nav className="hidden lg:flex items-center bg-[#E9EDC9]/30 p-1 rounded-2xl">
            {navItems.filter(item => !item.mobileOnly).map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                disabled={item.disabled}
                className={cn(
                  "flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap",
                  activeTab === item.id ? "bg-white text-earth shadow-sm" : "text-sage hover:text-earth disabled:opacity-30"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
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
        <div className="flex-1 overflow-hidden pb-[80px] lg:pb-0">
          <AnimatePresence mode="wait">
            {activeTab === 'chat' ? (
              <motion.div
                key="chat-mobile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="h-full lg:hidden"
              >
                <Chat 
                  onDataUpdate={(data) => { setSolarData(data); setActiveTab('dashboard'); }} 
                  language={language}
                  unitRate={customUnitRate}
                  externalInput={installerSearch}
                  onExternalInputHandled={() => setInstallerSearch(null)}
                />
              </motion.div>
            ) : activeTab === 'dashboard' ? (
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
                  onTierChange={setSystemTier}
                />
              </motion.div>
            ) : activeTab === 'financing' ? (
              <motion.div
                key="financing"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                {adjustedData ? (
                  <FinancingCalculator data={adjustedData} language={language} />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-bg-natural/50">
                    <Sun className="w-16 h-16 text-sage/20 mb-6 animate-pulse" />
                    <h3 className="text-2xl font-bold text-earth/40 font-serif italic">
                      {language === 'ur' ? 'تجزیہ درکار ہے' : 'Analysis Pending'}
                    </h3>
                  </div>
                )}
              </motion.div>
            ) : activeTab === 'installers' ? (
              <motion.div
                key="installers"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="h-full"
              >
                <InstallerFinder 
                  data={adjustedData} 
                  language={language}
                  isSearching={!!installerSearch}
                  onSearch={(city) => {
                    setInstallerSearch(`Find me the top 3 AEDB certified solar installers specifically in ${city}, Pakistan. Please also check their Google ratings and provide their specialties if available.`);
                  }}
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

        {/* Mobile Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 h-[80px] bg-white/90 backdrop-blur-xl border-t border-black/5 lg:hidden flex items-center justify-around px-2 z-50 rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              disabled={item.disabled}
              className={cn(
                "flex flex-col items-center gap-1.5 px-3 py-2 rounded-2xl transition-all duration-300",
                activeTab === item.id 
                  ? "text-earth scale-110" 
                  : "text-sage/60 hover:text-earth disabled:opacity-20"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-all",
                activeTab === item.id ? "bg-earth text-white shadow-lg shadow-earth/20" : "bg-transparent"
              )}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                {item.label}
              </span>
            </button>
          ))}
        </nav>

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
