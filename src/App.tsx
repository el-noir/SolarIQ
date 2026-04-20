import { useState } from 'react';
import { SolarData } from './types';
import Chat from './components/Chat';
import Dashboard from './components/Dashboard';
import ReportView from './components/ReportView';
import { Sun, LayoutDashboard, FileText, Menu, X } from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [solarData, setSolarData] = useState<SolarData | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'report'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-bg-natural font-sans overflow-hidden">
      {/* Sidebar - Chat (Always visible on large screens) */}
      <aside className={cn(
        "w-full lg:w-[400px] xl:w-[450px] flex-shrink-0 z-40 transition-transform duration-300",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        "fixed lg:relative inset-0 lg:inset-auto h-full shadow-2xl lg:shadow-none"
      )}>
        <Chat onDataUpdate={setSolarData} />
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
              <span>Dashboard</span>
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
              <span>Proposal</span>
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-[10px] font-bold text-sage uppercase tracking-widest">Market Feed</span>
              <span className="text-xs text-clay font-medium">Real-time Grounding</span>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-sage shadow-[0_0_8px_rgba(96,108,56,0.6)]" />
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
                <Dashboard data={solarData} />
              </motion.div>
            ) : solarData && (
              <motion.div
                key="report"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="h-full overflow-y-auto"
              >
                <ReportView data={solarData} />
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
