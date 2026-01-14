
import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, Globe, Command, Activity, Sparkles, Terminal, Info, CloudUpload, CloudCheck, Shield, Zap, RefreshCw, Trash2, ChevronDown, Timestamp, CheckCircle2 } from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";
import UniversalHost from './UniversalHost';
import { cacheHelper } from '../utils/cacheHelper';
import { supabase } from '../lib/supabase';

interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

interface PulseChatProps {
  isOpen: boolean;
  onClose: () => void;
  context?: string;
  onVaultScript?: (text: string) => void;
  theme?: 'dark' | 'light';
}

const PulseChat: React.FC<PulseChatProps> = ({ isOpen, onClose, context, onVaultScript, theme = 'dark' }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [autoVoice, setAutoVoice] = useState(true);
  const [hostStatus, setHostStatus] = useState<'idle' | 'speaking' | 'thinking'>('idle');
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('offline');
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const isLight = theme === 'light';

  useEffect(() => {
    const loadChat = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('user_profiles')
          .select('chat_history')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (data?.chat_history && data.chat_history.length > 0) {
          setMessages(data.chat_history);
          setSyncStatus('synced');
          return;
        }
      }
      
      const saved = localStorage.getItem('em-chat-history');
      setMessages(saved ? JSON.parse(saved) : [
        { role: 'model', text: "Welcome back, scholar. Diagnostic sensors are online. How can we optimize your ultrasound physics intuition today?", timestamp: Date.now() }
      ]);
    };
    loadChat();
  }, []);

  const syncMessages = async (newMessages: Message[]) => {
    const { data: { user } } = await supabase.auth.getUser();
    localStorage.setItem('em-chat-history', JSON.stringify(newMessages));
    
    if (user) {
      setSyncStatus('syncing');
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          chat_history: newMessages,
          updated_at: new Date()
        });
      if (!error) setSyncStatus('synced');
    }
  };

  const clearChat = () => {
    if (confirm("Terminate and purge current session history?")) {
        const resetMsg: Message[] = [{ role: 'model', text: "Session history purged. Neural pathways cleared for new input.", timestamp: Date.now() }];
        setMessages(resetMsg);
        syncMessages(resetMsg);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const playVoice = async (text: string) => {
    const cleanText = text.replace(/\[\d+\]/g, '').substring(0, 800); 
    const cacheKey = `v-cache-${btoa(cleanText).substring(0, 32)}`;
    
    try {
      setHostStatus('speaking');
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') await ctx.resume();

      let audioData = await cacheHelper.getBlob(cacheKey);

      if (!audioData) {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-preview-tts',
          contents: [{ parts: [{ text: cleanText }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } } },
          },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
            const binaryString = atob(base64Audio);
            audioData = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) audioData[i] = binaryString.charCodeAt(i);
            await cacheHelper.putBlob(cacheKey, audioData, 'audio/pcm');
        }
      }

      if (audioData) {
          const dataInt16 = new Int16Array(audioData.buffer);
          const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
          const channelData = buffer.getChannelData(0);
          for (let i = 0; i < dataInt16.length; i++) channelData[i] = dataInt16[i] / 32768.0;

          const source = ctx.createBufferSource();
          source.buffer = buffer;
          source.connect(ctx.destination);
          source.onended = () => setHostStatus('idle');
          source.start();
      }
    } catch (e) {
      setHostStatus('idle');
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg = input.trim();
    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', text: userMsg, timestamp: Date.now() }];
    setMessages(newMessages);
    setIsTyping(true);
    setHostStatus('thinking');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: userMsg,
        config: {
          systemInstruction: `You are HARVEY, the ultimate diagnostic sonography intelligence. Style: technical, direct, encouraging, luxury-focused. Use physics analogies for complex terms. Focus: ARDMS SPI content outline. Always speak with professional gravitas. Never refer to yourself as 'Professor'.`,
          tools: [{ googleSearch: {} }]
        }
      });

      const reply = response.text || "Interference detected in neural link. Please repeat the query.";
      const finalMessages: Message[] = [...newMessages, { role: 'model', text: reply, timestamp: Date.now() }];
      setMessages(finalMessages);
      syncMessages(finalMessages);

      if (autoVoice) playVoice(reply);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Signal dropped. Recalibrating central diagnostic node...", timestamp: Date.now() }]);
    } finally {
      setIsTyping(false);
      setHostStatus('idle');
    }
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-full sm:w-[580px] md:w-[750px] z-[150] transition-all duration-1000 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className={`h-full border-l flex flex-col transition-all duration-1000 relative overflow-hidden ${isOpen ? 'shadow-[-60px_0_120px_rgba(0,0,0,0.4)]' : ''} ${isLight ? 'bg-slate-50/98 backdrop-blur-3xl border-slate-200' : 'bg-midnight/98 backdrop-blur-3xl border-white/10'}`}>
        
        {/* Decorative Grid Overlay */}
        <div className={`absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none ${isLight ? 'text-blue-500' : ''}`} />
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent-blue to-transparent opacity-60 shadow-[0_0_25px_#00E5FF]" />

        {/* Tactical Interaction Header */}
        <div className={`p-10 md:p-14 border-b flex items-center justify-between relative z-10 shrink-0 ${isLight ? 'bg-white/80 border-slate-200' : 'bg-black/70 border-white/5'}`}>
          <div className="flex items-center gap-10">
             <div className="relative group/host cursor-pointer">
                <UniversalHost status={hostStatus} theme={theme} className="!w-28 !h-28 md:!w-32 md:!h-32" />
                <div className="absolute -inset-2 rounded-full border border-accent-blue/10 scale-125 opacity-0 group-hover/host:opacity-100 transition-all duration-700 animate-pulse" />
             </div>
             <div className="space-y-3 text-left">
                <h3 className={`font-display font-black uppercase tracking-[0.6em] text-lg leading-none ${isLight ? 'text-slate-900' : 'text-white'}`}>Harvey</h3>
                <div className="flex items-center gap-6">
                   <div className={`flex items-center gap-2.5 text-[10px] font-black tracking-widest opacity-80 ${isLight ? 'text-blue-700' : 'text-accent-blue'}`}>
                      {syncStatus === 'syncing' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CloudCheck className="w-4 h-4" />}
                      {syncStatus.toUpperCase()}
                   </div>
                   <div className={`w-[1.5px] h-4 ${isLight ? 'bg-slate-200' : 'bg-white/10'}`} />
                   <div className={`flex items-center gap-2.5 text-[10px] font-black tracking-widest opacity-80 ${isLight ? 'text-amber-700' : 'text-accent-gold'}`}>
                      <Shield className="w-4 h-4" /> ENCRYPTED_LINK
                   </div>
                </div>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={clearChat} title="Reset Node" className={`p-5 rounded-2xl border transition-all active:scale-90 ${isLight ? 'bg-slate-100 border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50' : 'bg-white/5 border-white/10 text-text-muted hover:text-red-500 hover:bg-red-500/10'}`}>
                <Trash2 className="w-6 h-6" />
             </button>
             <button onClick={onClose} className={`p-5 rounded-2xl border transition-all active:scale-90 ${isLight ? 'bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-900' : 'bg-white/5 border-white/10 text-text-muted hover:text-white'}`}>
                <X className="w-7 h-7" />
             </button>
          </div>
        </div>

        {/* Message Stream */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 md:p-16 space-y-16 custom-scrollbar relative z-10 scroll-smooth">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up group/item`}>
              <div className={`max-w-[92%] flex gap-8 ${msg.role === 'user' ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
                
                {/* Visual Avatar Link */}
                <div className={`mt-4 shrink-0 w-12 h-12 rounded-3xl border-2 flex items-center justify-center transition-all duration-700 ${msg.role === 'user' ? 'bg-accent-gold/10 border-accent-gold/30 text-accent-gold group-hover/item:scale-110 shadow-gold' : 'bg-accent-blue/10 border-accent-blue/30 text-accent-blue group-hover/item:scale-110 shadow-blue'}`}>
                    {msg.role === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                </div>

                {/* Response Engine */}
                <div className="space-y-4">
                    <div className={`relative p-10 md:p-12 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] tactical-border transition-all duration-1000 ${msg.role === 'user' ? (isLight ? 'bg-blue-600 text-white border-blue-400' : 'bg-accent-gold/15 text-white border-accent-gold/30') : (isLight ? 'bg-white text-slate-900 font-serif italic border-slate-200 shadow-xl' : 'bg-black/60 text-text-main font-serif italic border-white/10 backdrop-blur-xl group-hover/item:bg-black/80')}`}>
                       <p className={`text-lg md:text-2xl leading-relaxed tracking-tight font-medium text-left ${msg.role === 'model' ? (isLight ? 'text-slate-800' : 'luxury-text !filter-none opacity-95') : ''}`}>
                         {msg.text}
                       </p>
                       
                       {/* Meta Indicators */}
                       <div className={`absolute -bottom-8 ${msg.role === 'user' ? 'right-8' : 'left-8'} flex items-center gap-4 opacity-0 group-hover/item:opacity-100 transition-opacity duration-500`}>
                          <span className={`text-[9px] font-black uppercase tracking-[0.5em] ${msg.role === 'user' ? (isLight ? 'text-blue-600' : 'text-accent-gold') : (isLight ? 'text-slate-500' : 'text-accent-blue')}`}>
                             {msg.role === 'user' ? ' Personnel_Entry' : ' Mentor_Resolution'}
                          </span>
                          <div className={`w-1.5 h-1.5 rounded-full ${msg.role === 'user' ? 'bg-accent-gold/40' : 'bg-accent-blue/40'}`} />
                          <span className="text-[9px] font-mono text-text-muted/40 uppercase tracking-widest">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                       </div>
                    </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-center gap-8 px-16 py-8 animate-pulse">
                <div className="flex gap-2.5">
                    <div className="w-2.5 h-2.5 bg-accent-blue rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2.5 h-2.5 bg-accent-blue rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2.5 h-2.5 bg-accent-blue rounded-full animate-bounce" />
                </div>
                <span className={`text-[11px] font-black uppercase tracking-[0.8em] ${isLight ? 'text-slate-400' : 'text-accent-blue/40'}`}>Processing_Diagnostic_Vectors...</span>
            </div>
          )}
        </div>

        {/* Tactical Command Console */}
        <div className={`p-12 md:p-16 border-t relative z-10 shrink-0 ${isLight ? 'bg-white border-slate-200' : 'bg-black/90 border-white/10'}`}>
           <div className="relative group/console">
              {/* Radial Aura: Focus Reactive */}
              <div className={`absolute -inset-4 rounded-[4rem] blur-3xl opacity-0 group-focus-within/console:opacity-100 transition-opacity duration-1000 ${isLight ? 'bg-blue-600/5' : 'bg-gradient-to-r from-accent-blue/20 via-accent-gold/10 to-accent-blue/20'}`} />
              
              <div className={`relative flex items-center border-2 rounded-[4rem] transition-all duration-700 focus-within:border-accent-blue shadow-inner group/field ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-midnight/90 border-white/10'}`}>
                  <div className={`pl-10 transition-colors ${isLight ? 'text-slate-300 group-focus-within/field:text-blue-600' : 'text-white/20 group-focus-within/field:text-accent-blue'}`}>
                     <Terminal className="w-7 h-7" />
                  </div>
                  
                  <input 
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
                    placeholder="Command diagnostic inquiry..." 
                    className={`w-full bg-transparent py-10 md:py-12 pl-8 pr-28 text-xl md:text-2xl outline-none font-mono tracking-tighter ${isLight ? 'text-slate-900 placeholder:text-slate-300' : 'text-white placeholder:text-white/10'}`} 
                  />
                  
                  <div className="absolute right-8 flex items-center gap-5">
                      <button 
                        onClick={handleSend} 
                        disabled={isTyping || !input.trim()} 
                        className={`p-6 md:p-7 rounded-[2.5rem] active:scale-90 transition-all duration-500 disabled:opacity-20 disabled:scale-100 shadow-blue-bright hover:shadow-blue group/sendBtn ${isLight ? 'bg-blue-600 text-white shadow-xl' : 'bg-accent-blue text-dark-primary'}`}
                      >
                        <Send className="w-7 h-7 md:w-8 md:h-8 group-hover/sendBtn:translate-x-1.5 group-hover/sendBtn:-translate-y-1.5 transition-transform" />
                      </button>
                  </div>
              </div>
           </div>
           
           {/* Telemetry Status Grid */}
           <div className="mt-12 flex justify-between items-center px-6">
                <div className="flex gap-14">
                    {[
                        { label: 'Neural_Engine', icon: Activity, color: isLight ? 'text-blue-600' : 'text-accent-blue' },
                        { label: 'Logic_Vault', icon: Shield, color: isLight ? 'text-amber-600' : 'text-accent-gold' },
                    ].map((stat, idx) => (
                        <div key={idx} className="flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity cursor-default group/stat">
                            <stat.icon className={`w-4 h-4 ${stat.color} group-hover/stat:animate-pulse`} />
                            <span className={`text-[10px] font-black uppercase tracking-[0.6em] ${isLight ? 'text-slate-500' : 'text-white/60'}`}>{stat.label}</span>
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
                   <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${isLight ? 'text-slate-400' : 'text-white/30'}`}>Link_Secure</span>
                </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PulseChat;
