import React, { useMemo } from 'react';
import { Target, Zap, Activity, Waves, Cpu, ZapOff, ShieldCheck, RefreshCw } from 'lucide-react';

interface UniversalHostProps {
  status: 'idle' | 'thinking' | 'speaking' | 'pinging' | 'syncing' | 'listening' | 'error';
  message?: string;
  audioLevel?: number; // 0 to 1
  accentColor?: string; 
  baseColor?: string;
  className?: string;
  theme?: 'dark' | 'light';
  variant?: 'compact' | 'featured';
}

const VoiceWave: React.FC<{ active: boolean, color: string, level?: number }> = ({ active, color, level = 0 }) => {
    const bars = 24;
    return (
        <div className="flex items-center justify-center gap-0.5 h-8 overflow-hidden relative group">
            {Array.from({ length: bars }).map((_, i) => {
                const randomLevel = active ? (0.2 + Math.random() * 0.8) : 0.1;
                const finalLevel = level > 0 ? (level * (0.5 + Math.random() * 0.5)) : randomLevel;
                return (
                    <div 
                        key={i}
                        className="w-0.5 rounded-full transition-all duration-150"
                        style={{ 
                            backgroundColor: color,
                            height: `${finalLevel * 100}%`,
                            opacity: active || level > 0 ? 0.4 + finalLevel * 0.6 : 0.1,
                            boxShadow: (active || level > 0) ? `0 0 10px ${color}` : 'none'
                        }}
                    />
                );
            })}
        </div>
    );
};

const UniversalHost: React.FC<UniversalHostProps> = ({ 
  status, 
  message, 
  audioLevel = 0,
  accentColor = "#D9B65C", 
  className = "",
  theme = 'dark',
  variant = 'compact'
}) => {
  const isSpeaking = status === 'speaking';
  const isThinking = status === 'thinking';
  const isSyncing = status === 'syncing';
  const isListening = status === 'listening';
  const blueAccent = "#00E5FF";
  const isLight = theme === 'light';

  const sizeClasses = variant === 'featured' ? 'w-80 h-80 md:w-[450px] md:h-[450px]' : 'w-48 h-48 md:w-64 md:h-64';

  const highlightedMessage = useMemo(() => {
    if (!message) return null;
    const keyTerms = [
      'physics', 'frequency', 'wavelength', 'echo', 'precision', 
      'doppler', 'ultrasound', 'instrumentation', 'transducer', 
      'safety', 'resolution', 'impedance', 'artifact', 'calibrat', 'sync',
      'vector', 'matrix', 'diagnostic', 'calibration', 'resonance', 'encod', 'synapse'
    ];
    
    let processed = message;
    keyTerms.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi');
      processed = processed.replace(regex, `<span class="${isLight ? 'text-blue-600' : 'text-accent-blue'} font-black border-b border-accent-blue/40 tracking-tight transition-all cursor-default">${term}</span>`);
    });
    
    return processed;
  }, [message, isLight]);

  return (
    <div className={`relative flex flex-col items-center justify-center pointer-events-none transition-all duration-1000 ${className}`}>
      {/* Dynamic Pulse Auras */}
      <div 
        className={`absolute inset-0 rounded-full blur-[150px] transition-all duration-[2000ms] ${isSpeaking || isSyncing || isListening ? 'opacity-50 scale-150' : 'opacity-20 scale-100'}`}
        style={{ 
            backgroundColor: (isThinking || isSyncing || isListening) ? blueAccent : accentColor,
            transform: `scale(${variant === 'featured' ? 1.5 + audioLevel : 1 + audioLevel * 0.5})`
        }}
      />
      
      {/* Body Chassis */}
      <div className={`relative ${sizeClasses} flex items-center justify-center animate-float`} style={{ transform: `scale(${1 + audioLevel * 0.1})` }}>
        <div className={`absolute inset-0 border-[3px] rounded-full border-dashed transition-all duration-1000 animate-spin-slow opacity-20 ${isThinking || isSyncing || isListening ? 'border-accent-blue scale-110' : 'border-accent-gold scale-100'}`} />

        <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 overflow-visible drop-shadow-[0_40px_70px_rgba(0,0,0,0.95)]">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id="hostBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isLight ? "#e2e8f0" : "#1e293b"} />
              <stop offset="100%" stopColor={isLight ? "#f8fafc" : "#020617"} />
            </linearGradient>
            <clipPath id="visorClip">
               <rect x="22" y="24" width="56" height="28" rx="12" />
            </clipPath>
          </defs>

          {/* Main Tactical Chassis */}
          <rect 
            x="12" y="10" width="76" height="65" rx="22" 
            fill="url(#hostBodyGrad)" 
            stroke={isThinking || isSyncing || isListening ? blueAccent : accentColor} 
            strokeWidth={variant === 'featured' ? "1.5" : "0.8"}
            strokeOpacity={isLight ? "0.8" : "0.4"}
          />
          
          <path d="M 12 40 L 88 40" stroke={isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"} strokeWidth="0.5" />
          <path d="M 12 55 L 88 55" stroke={isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)"} strokeWidth="0.5" />

          {/* Featured variant adds extra mechanical details */}
          {variant === 'featured' && (
            <>
               <circle cx="20" cy="20" r="2" fill={accentColor} opacity="0.4" />
               <circle cx="80" cy="20" r="2" fill={accentColor} opacity="0.4" />
               <circle cx="20" cy="65" r="2" fill={accentColor} opacity="0.4" />
               <circle cx="80" cy="65" r="2" fill={accentColor} opacity="0.4" />
            </>
          )}

          {/* Core Light Ring */}
          <rect 
             x="22" y="24" width="56" height="28" rx="12" 
             fill="none" 
             stroke={isThinking || isSyncing || isListening ? blueAccent : accentColor} 
             strokeWidth="2" 
             strokeOpacity={isSpeaking || isSyncing || isListening ? "0.8" : "0.2"}
             filter="url(#glow)"
          >
             {(isSpeaking || isSyncing || isListening) && <animate attributeName="stroke-opacity" values="0.8;0.3;0.8" dur="0.5s" repeatCount="indefinite" />}
          </rect>

          {/* Visor Area */}
          <rect x="24" y="26" width="52" height="24" rx="10" fill={isLight ? "#1e293b" : "#000"} />
          
          <g clipPath="url(#visorClip)">
             {isThinking || isSyncing ? (
                <g filter="url(#glow)">
                   <circle cx="50" cy="38" r="8" fill="none" stroke={blueAccent} strokeWidth="1.5" strokeDasharray="3,3">
                      <animateTransform attributeName="transform" type="rotate" from="0 50 38" to="360 50 38" dur={isSyncing ? "1s" : "3s"} repeatCount="indefinite" />
                   </circle>
                </g>
             ) : (isSpeaking || audioLevel > 0) ? (
                <g filter="url(#glow)">
                   {Array.from({length: 10}).map((_, i) => {
                      const h = 4 + (audioLevel * 14 * Math.random());
                      return (
                        <rect key={i} x={28 + i*4.5} y={38 - h/2} width="2.5" height={h} rx="1" fill={isListening ? blueAccent : isLight ? blueAccent : accentColor}>
                           {!audioLevel && <animate attributeName="height" values="4;14;4" dur={`${0.2 + i*0.05}s`} repeatCount="indefinite" />}
                           {!audioLevel && <animate attributeName="y" values="36;31;36" dur={`${0.2 + i*0.05}s`} repeatCount="indefinite" />}
                        </rect>
                      );
                   })}
                </g>
             ) : (
                <g filter="url(#glow)">
                   <rect x="34" y="36" width="10" height="4" rx="2" fill={isLight ? blueAccent : accentColor} fillOpacity="0.8">
                      <animate attributeName="height" values="4;4;0.5;4;4" dur="5s" repeatCount="indefinite" keyTimes="0;0.45;0.5;0.55;1" />
                   </rect>
                   <rect x="56" y="36" width="10" height="4" rx="2" fill={isLight ? blueAccent : accentColor} fillOpacity="0.8">
                      <animate attributeName="height" values="4;4;0.5;4;4" dur="5s" repeatCount="indefinite" keyTimes="0;0.45;0.5;0.55;1" />
                   </rect>
                </g>
             )}
          </g>

          <path d="M 42 75 L 45 88 L 55 88 L 58 75" fill={isLight ? "#94a3b8" : "#0f172a"} />
        </svg>
      </div>

      {/* Dynamic Interface Panel */}
      {message && (
        <div className={`mt-10 px-12 py-10 rounded-[3.5rem] backdrop-blur-3xl border text-center animate-slide-up max-w-md shadow-2xl relative group/msg tactical-border overflow-hidden ${isLight ? 'bg-white/95 border-accent-blue/10' : 'bg-midnight/90 border-white/10'}`}>
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-center gap-3 mb-2">
                 <div className={`w-1.5 h-1.5 rounded-full ${isThinking || isSyncing || isListening ? 'bg-accent-blue' : 'bg-accent-gold'} animate-pulse`} />
                 <span className={`text-[9px] font-black uppercase tracking-[0.5em] ${isLight ? 'text-slate-400' : 'text-white/40'}`}>
                    {isSyncing ? 'Neural_Sync_Active' : isListening ? 'Listening_Mode' : 'Harvey_Transmission'}
                 </span>
              </div>
              
              <p 
                className={`text-lg md:text-xl font-serif italic leading-relaxed tracking-tight ${isLight ? 'text-slate-800' : 'text-white/95'}`}
                dangerouslySetInnerHTML={{ __html: highlightedMessage || '' }}
              />

              <div className={`pt-6 border-t flex flex-col gap-5 ${isLight ? 'border-slate-100' : 'border-white/5'}`}>
                <VoiceWave active={isSpeaking} level={audioLevel} color={isThinking || isListening ? blueAccent : isLight ? blueAccent : accentColor} />
                <div className={`flex items-center justify-between text-[8px] font-black uppercase tracking-[0.4em] ${isLight ? 'text-slate-300' : 'text-white/20'}`}>
                   <span className="flex items-center gap-2"><ShieldCheck className="w-3 h-3 opacity-40" /> Secure_Link</span>
                   <span className="flex items-center gap-2">{isSyncing ? 'BUFFER_WRITING' : isListening ? 'SIGNAL_IN' : 'SIGNAL_ALPHA'} <Activity className="w-3 h-3 opacity-40" /></span>
                </div>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversalHost;