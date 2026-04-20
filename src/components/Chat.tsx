import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Loader2, User, Bot, Sun, FileText, Zap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { Message, SolarData, Language } from '@/types';
import { chatWithSolarIQ } from '@/services/geminiService';

interface ChatProps {
  onDataUpdate: (data: SolarData | null) => void;
  language: Language;
  unitRate: number;
}

export default function Chat({ onDataUpdate, language, unitRate }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Assalam-o-Alaikum! I am SolarIQ, your personal solar advisor. To get started, please either **upload your electricity bill photo** or tell me how many **units** you consume on average per month. Providing your **city** will also help me find current local prices.\n\nآپ اپنے بجلی کے بل کی تصویر اپ لوڈ کر سکتے ہیں یا ماہانہ یونٹس بتا سکتے ہیں۔',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');

  const quickActions = [
    { label: "2x AC (1.5T)", prompt: "I have two 1.5-ton Inverter ACs. How does this affect my system sizing?" },
    { label: "Water Pump", prompt: "I have a 1HP water pump. What inverter capacity is required?" },
    { label: "Current Rates?", prompt: "What are the current per-unit solar buyback rates in my city?" },
  ];
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; type: string; data: string }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if ((!input.trim() && attachedFiles.length === 0) || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    const currentFiles = [...attachedFiles];
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setAttachedFiles([]);
    setIsLoading(true);

    try {
      const chatHistory = messages.map(m => ({ role: m.role, content: m.content }));
      chatHistory.push({ role: 'user', content: input });

      const filesForGemini = currentFiles.map(f => ({
        mimeType: f.type,
        data: f.data.split(',')[1] // Extract base64
      }));

      const response = await chatWithSolarIQ(chatHistory, filesForGemini, language, unitRate);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.text.replace(/<solar_data>[\s\S]*?<\/solar_data>/, ''),
        data: response.data,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
      if (response.data) {
        onDataUpdate(response.data);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again or check your internet connection.',
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachedFiles(prev => [...prev, {
          name: file.name,
          type: file.type,
          data: event.target?.result as string
        }]);
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <div className="flex flex-col h-full bg-white/40 backdrop-blur-md border-r border-black/5">
      <div className="p-6 border-b border-black/5 bg-white/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sage flex items-center justify-center shadow-lg shadow-sage/20">
            <Sun className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-earth text-lg font-serif">SolarIQ Advisor</h2>
            <p className="text-[10px] text-sage font-bold uppercase tracking-widest">Active Consultation</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={cn(
            "flex gap-3",
            m.role === 'user' ? "flex-row-reverse" : "flex-row"
          )}>
            <div className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-1 shadow-sm",
              m.role === 'user' ? "bg-clay text-white" : "bg-ai-bubble text-earth"
            )}>
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={cn(
              "max-w-[85%] rounded-[24px] p-4 shadow-sm leading-relaxed",
              m.role === 'user' 
                ? "bg-sage text-white rounded-tr-none" 
                : "bg-ai-bubble text-earth rounded-tl-none border border-sage/10"
            )}>
              <div className={cn(
                "prose prose-sm max-w-none",
                m.role === 'user' ? "prose-invert prose-white" : "prose-slate"
              )}>
                <ReactMarkdown>
                  {m.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-ai-bubble text-earth flex items-center justify-center shrink-0 shadow-sm border border-sage/10">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-ai-bubble/50 border border-sage/10 rounded-[24px] rounded-tl-none p-4 shadow-sm">
              <Loader2 className="w-5 h-5 animate-spin text-sage" />
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t border-black/5 bg-white/60">
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide no-scrollbar">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => { setInput(action.prompt); }}
              className="whitespace-nowrap px-4 py-2 bg-ai-bubble/50 border border-sage/10 text-earth rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-sage hover:text-white transition-all shadow-sm"
            >
              {action.label}
            </button>
          ))}
        </div>
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {attachedFiles.map((f, i) => (
              <div key={i} className="flex items-center gap-1 bg-[#FAFAF5] px-3 py-1.5 rounded-xl text-xs text-earth font-medium border border-sage/20">
                <FileText className="w-3 h-3 text-sage" />
                <span className="truncate max-w-[120px]">{f.name}</span>
                <button onClick={() => setAttachedFiles(prev => prev.filter((_, idx) => idx !== i))} className="hover:text-red-500 ml-1 font-bold">×</button>
              </div>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2.5 text-sage hover:bg-sage/10 rounded-xl transition-all"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
            multiple
          />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Analysis request or bill upload..."
            className="flex-1 bg-white border border-sage/20 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-sage focus:border-transparent outline-none shadow-inner"
          />
          <button
            disabled={isLoading || (!input.trim() && attachedFiles.length === 0)}
            className="p-3 bg-earth text-white rounded-2xl hover:bg-sage disabled:opacity-30 transition-all shadow-lg active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
