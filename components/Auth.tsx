import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, Lock, Shield, ArrowRight, Loader2, Sparkles, Terminal, AlertTriangle, CheckCircle2, Circle } from 'lucide-react';
import UniversalHost from './UniversalHost';
import { GoogleGenAI, Modality } from "@google/genai";
import { cacheHelper } from '../utils/cacheHelper';

interface AuthProps {
  onSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [harveyStatus, setHarveyStatus] = useState<'idle' | 'speaking' | 'thinking'>('idle');
  const [harveyMsg, setHarveyMsg] = useState('Initialize diagnostic handshake. Provide credentials for synchronization.');
  const audioContextRef = useRef<AudioContext | null>(null);

  const isAttemptingAdmin = email.trim().toLowerCase() === 'admin@echomasters.io';

  useEffect(() => {
    const cachedEmail = localStorage.getItem('em_cached_identity');
    if (cachedEmail) {
      setEmail(cachedEmail);
      setHarveyMsg('Identity fragment detected. Complete the handshake to restore link.');
    }
  }, []);

  const playHarveyVoice = async (text: string) => {
    const cacheKey = `harvey-auth-voice-${btoa(text).substring(0, 24)}`;
    try {
      setHarveyStatus('speaking');
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
            contents: [{ parts: [{ text }] }],
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
        source.onended = () => setHarveyStatus('idle');
        source.start();
      }
    } catch (e) {
      setHarveyStatus('idle');
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    setLoading(true);
    setError(null);
    setHarveyStatus('thinking');

    if (rememberMe) {
      localStorage.setItem('em_cached_identity', cleanEmail);
    } else {
      localStorage.removeItem('em_cached_identity');
    }

    if (cleanEmail === 'admin@echomasters.io' && cleanPass === 'ROOT_ACCESS_2026') {
        setHarveyMsg('ROOT_IDENTITY_CONFIRMED. Escalating privileges...');
        localStorage.setItem('em_admin_bypass', 'true');
        await playHarveyVoice('Hypervisor recognized. Protocol bypass active. Welcome, commander.');
        setTimeout(onSuccess, 1200);
        return;
    }

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({ email: cleanEmail, password: cleanPass });
        if (signUpError) throw signUpError;
        setHarveyMsg('Identity broadcasted. Please check your email for verification.');
        playHarveyVoice('Identity broadcasted. Verification required.');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email: cleanEmail, password: cleanPass });
        if (signInError) throw signInError;
        
        setHarveyMsg('Authentication successful. Neural link established.');
        playHarveyVoice('Link established. Welcome back.');
        setTimeout(onSuccess, 1000);
      }
    } catch (err: any) {
      setError(err.message);
      setHarveyMsg('Signal rejected. Re-calibrate your credentials.');
      playHarveyVoice('Signal rejected. Access denied.');
      setHarveyStatus('idle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 overflow-hidden transition-all duration-1000 ${isAttemptingAdmin ? 'bg-red-950/40' : 'bg-dark-primary'}`}>
      <div className={`absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none ${isAttemptingAdmin ? 'text-red-500' : ''}`} />
      
      <div className="max-w-4xl w-full flex flex-col lg:grid lg:grid-cols-2 gap-8 md:gap-12 items-center overflow-y-auto max-h-full py-10 custom-scrollbar">
        <div className="flex flex-col items-center justify-center space-y-6 md:space-y-12">
           <UniversalHost status={harveyStatus} message={harveyMsg} className="scale-75 md:scale-125" accentColor={isAttemptingAdmin ? '#ef4444' : '#D9B65C'} />
        </div>

        <div className={`w-full glass-panel p-6 md:p-14 rounded-[2rem] md:rounded-[3rem] tactical-border relative overflow-hidden transition-all duration-700 ${isAttemptingAdmin ? 'border-red-500/50 bg-red-950/40 shadow-[0_0_50px_rgba(239,68,68,0.3)]' : 'border-accent-blue/30 bg-midnight/80 shadow-blue-bright'}`}>
           <div className="absolute top-0 right-0 p-6 md:p-8 opacity-[0.05]">
               {isAttemptingAdmin ? <AlertTriangle className="w-20 h-20 md:w-40 md:h-40 text-red-500" /> : <Terminal className="w-20 h-20 md:w-40 md:h-40 text-accent-blue" />}
           </div>
           
           <div className="space-y-6 md:space-y-8 relative z-10">
              <div>
                 <div className={`flex items-center gap-2 mb-2 md:mb-4 ${isAttemptingAdmin ? 'text-red-500' : 'text-accent-blue'}`}>
                    <Shield className="w-4 h-4 md:w-6 md:h-6 animate-pulse" />
                    <span className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.5em]">{isAttemptingAdmin ? 'ROOT_OVERRIDE_ACTIVE' : 'Identity Sync'}</span>
                 </div>
                 <h2 className="text-2xl md:text-5xl font-display font-black text-white uppercase tracking-tighter mb-1 md:mb-2 leading-none">
                    {isAttemptingAdmin ? 'Hypervisor Login' : 'Protocol Access'}
                 </h2>
                 <p className="text-[10px] md:text-sm text-text-muted font-serif italic">
                    "{isAttemptingAdmin ? 'Bypassing central node security...' : 'Secure your diagnostic data in the Supabase Cloud.'}"
                 </p>
              </div>

              <form onSubmit={handleAuth} className="space-y-4 md:space-y-6">
                 <div className="space-y-3 md:space-y-4">
                    <div className="relative group">
                       <Mail className={`absolute left-4 md:left-5 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 transition-colors ${isAttemptingAdmin ? 'text-red-500/40 group-focus-within:text-red-500' : 'text-accent-blue/40 group-focus-within:text-accent-blue'}`} />
                       <input 
                          type="email" 
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Personnel Email" 
                          className={`w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3.5 md:py-5 pl-11 md:pl-14 pr-4 md:pr-6 text-white text-xs md:text-sm outline-none transition-all placeholder:text-text-muted/30 ${isAttemptingAdmin ? 'focus:border-red-500' : 'focus:border-accent-blue'}`}
                       />
                    </div>
                    <div className="relative group">
                       <Lock className={`absolute left-4 md:left-5 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 transition-colors ${isAttemptingAdmin ? 'text-red-500/40 group-focus-within:text-red-500' : 'text-accent-blue/40 group-focus-within:text-accent-blue'}`} />
                       <input 
                          type="password" 
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Neural Passkey" 
                          className={`w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl py-3.5 md:py-5 pl-11 md:pl-14 pr-4 md:pr-6 text-white text-xs md:text-sm outline-none transition-all placeholder:text-text-muted/30 ${isAttemptingAdmin ? 'focus:border-red-500' : 'focus:border-accent-blue'}`}
                       />
                    </div>

                    <div className="flex items-center justify-between px-1 md:px-2 pt-1">
                      <button 
                        type="button"
                        onClick={() => setRememberMe(!rememberMe)}
                        className="flex items-center gap-2 group/check transition-all"
                      >
                        <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all ${rememberMe ? 'bg-accent-blue border-accent-blue shadow-[0_0_10px_rgba(0,229,255,0.4)]' : 'border-white/10 group-hover/check:border-white/30'}`}>
                          {rememberMe && <CheckCircle2 className="w-3.5 h-3.5 text-dark-primary" />}
                        </div>
                        <span className={`text-[7px] md:text-[9px] font-black uppercase tracking-widest ${rememberMe ? 'text-accent-blue' : 'text-text-muted opacity-50'}`}>Neural Auto-Sync</span>
                      </button>
                    </div>
                 </div>

                 {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-[8px] md:text-[10px] font-black uppercase tracking-widest text-center">
                       {error}
                    </div>
                 )}

                 <button 
                    disabled={loading}
                    className={`w-full py-4 md:py-6 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.4em] md:tracking-[0.5em] text-[10px] md:text-xs flex items-center justify-center gap-3 md:gap-4 transition-all active:scale-95 disabled:opacity-50 ${isAttemptingAdmin ? 'bg-red-500 text-white shadow-[0_0_30px_rgba(239,68,68,0.4)]' : 'btn-blue shadow-blue-bright'}`}
                 >
                    {loading ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : (
                       <>
                          {isSignUp ? 'Broadcast Identity' : 'Establish Link'}
                          <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                       </>
                    )}
                 </button>
              </form>

              <div className="pt-4 md:pt-6 border-t border-white/5 flex items-center justify-between">
                 <button 
                    onClick={() => setIsSignUp(!isSignUp)}
                    className={`text-[8px] md:text-[10px] font-black transition-colors uppercase tracking-[0.2em] md:tracking-[0.3em] ${isAttemptingAdmin ? 'text-red-400 hover:text-red-300' : 'text-text-muted hover:text-accent-blue'}`}
                 >
                    {isSignUp ? 'Returning Scholar?' : 'Register Instance'}
                 </button>
                 <div className="flex items-center gap-1.5 opacity-20">
                    <Sparkles className={`w-2.5 h-2.5 md:w-3 md:h-3 ${isAttemptingAdmin ? 'text-red-500' : 'text-accent-blue'}`} />
                    <span className="text-[6px] md:text-[8px] font-mono text-white">v4.5.2 Secure</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
