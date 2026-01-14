
import React, { useState, useEffect, useRef } from 'react';
import { SkipForward, Play, Loader2 } from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";
import { cacheHelper } from '../utils/cacheHelper';

const LivingDeepSea = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        class Particle {
            x: number; y: number; size: number; opacity: number; speed: number;
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 1.8;
                this.opacity = 0.05 + Math.random() * 0.4;
                this.speed = 0.05 + Math.random() * 0.15;
            }
            update() {
                this.y -= this.speed;
                this.x += Math.sin(this.y * 0.005) * 0.15;
                if (this.y < -10) this.y = height + 10;
            }
            draw() {
                ctx!.fillStyle = `rgba(217, 182, 92, ${this.opacity})`;
                ctx!.beginPath();
                ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx!.fill();
            }
        }

        const marineSnow = Array.from({ length: 300 }, () => new Particle());

        let animationFrame: number;
        const render = () => {
            ctx.clearRect(0, 0, width, height);
            
            const grad = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width);
            grad.addColorStop(0, '#0a0514');
            grad.addColorStop(0.6, '#030208');
            grad.addColorStop(1, '#000000');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);

            marineSnow.forEach(p => { p.update(); p.draw(); });

            animationFrame = requestAnimationFrame(render);
        };
        render();

        const handleResize = () => {
            width = window.innerWidth; height = window.innerHeight;
            canvas.width = width; canvas.height = height;
        };
        window.addEventListener('resize', handleResize);
        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
};

interface AppIntroProps {
  onComplete: () => void;
}

const AppIntro: React.FC<AppIntroProps> = ({ onComplete }) => {
  const [step, setStep] = useState(-1);
  const [isExiting, setIsExiting] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentRequestRef = useRef<string | null>(null);

  const script = [
      { text: "To the untrained eye...", duration: 2800 },
      { text: "It is just noise.", duration: 3200 },
      { text: "But you see the unseen.", duration: 3200 },
      { text: "You turn echoes into answers.", duration: 3800 },
      { text: "I am Harvey. Precision is our language.", duration: 4200 },
  ];

  const playHarveyVoiceWithRetry = async (text: string, retries = 2, delay = 1500) => {
    if (currentRequestRef.current === text) return;
    currentRequestRef.current = text;
    
    const cacheKey = `intro-audio-${btoa(text).substring(0, 16)}`;
    
    try {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') await ctx.resume();

        let audioData = await cacheHelper.getBlob(cacheKey);

        if (!audioData) {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            try {
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash-preview-tts',
                    contents: [{ parts: [{ text }] }],
                    config: {
                        responseModalities: [Modality.AUDIO],
                        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Charon' } } },
                    },
                });

                const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
                if (!base64Audio) throw new Error("No audio data returned");

                const binaryString = atob(base64Audio);
                audioData = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) audioData[i] = binaryString.charCodeAt(i);
                
                await cacheHelper.putBlob(cacheKey, audioData, 'audio/pcm');
                setIsRetrying(false);
            } catch (apiError: any) {
                if (retries > 0) {
                    setIsRetrying(true);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    return playHarveyVoiceWithRetry(text, retries - 1, delay * 1.5);
                }
                throw apiError;
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
            source.start();
            setIsRetrying(false);
        }
    } catch (e) {
        console.error("Intro Voice Error", e);
        setIsRetrying(false);
    }
  };

  useEffect(() => {
      if (step === -1) return;
      let timeout: number;

      if (step < script.length) {
          playHarveyVoiceWithRetry(script[step].text);
          timeout = window.setTimeout(() => {
              setStep(s => s + 1);
          }, script[step].duration);
      } else if (step === script.length) {
          setShowLogo(true);
          timeout = window.setTimeout(() => {
              setIsExiting(true);
              setTimeout(onComplete, 1000);
          }, 3500);
      }

      return () => clearTimeout(timeout);
  }, [step, onComplete]);

  const handleStart = () => {
    setStep(0);
  };

  const handleSkip = () => {
      setIsExiting(true);
      setTimeout(onComplete, 800);
  };

  if (step === -1) {
    return (
        <div className="fixed inset-0 z-[100] bg-dark-primary flex flex-col items-center justify-center overflow-hidden px-6">
            <LivingDeepSea />
            <div className="relative z-10 flex flex-col items-center gap-12 text-center max-w-2xl">
                <div className="space-y-4 animate-slide-up">
                    <h1 className="text-4xl md:text-8xl font-display font-black text-white uppercase tracking-tighter luxury-text drop-shadow-2xl">EchoMasters</h1>
                    <p className="text-xs md:text-sm text-gold-main/80 uppercase tracking-[0.7em] font-black">Diagnostic Navigation Protocol</p>
                </div>
                <button onClick={handleStart} className="group relative px-12 md:px-20 py-6 md:py-10 bg-gold-main text-dark-primary font-black rounded-[3rem] shadow-gold-bright hover:scale-105 active:scale-95 transition-all flex items-center gap-6 uppercase tracking-[0.5em] font-sans text-sm md:text-2xl overflow-hidden border-2 border-white/20">
                    <Play className="w-8 h-8 md:w-10 md:h-10 fill-current" /> Commence Navigation
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-[100] bg-dark-primary flex flex-col items-center justify-center transition-all duration-1000 ease-in-out overflow-hidden ${isExiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'}`}>
        <LivingDeepSea />
        
        {isRetrying && (
            <div className="absolute top-20 flex items-center gap-3 bg-black/40 border border-gold-main/20 px-6 py-2 rounded-full animate-pulse z-50">
                <Loader2 className="w-4 h-4 text-gold-main animate-spin" />
                <span className="text-[10px] font-black text-gold-main uppercase tracking-widest">Recalibrating Neural Link...</span>
            </div>
        )}

        <button onClick={handleSkip} className="absolute top-6 right-6 z-50 flex items-center gap-2 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted hover:text-white border border-white/5 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-black/20 backdrop-blur-md">
            Skip <SkipForward className="w-2.5 h-2.5 md:w-3 md:h-3 ml-1" />
        </button>
        
        <div className="relative z-10 max-w-4xl px-8 text-center">
            {!showLogo && step < script.length && (
                <div key={step} className="animate-slide-up">
                    <h1 className="text-3xl md:text-7xl font-display font-bold text-white leading-tight drop-shadow-2xl italic tracking-tight">{script[step].text}</h1>
                </div>
            )}
            {showLogo && (
                <div className="flex flex-col items-center animate-slide-up">
                    <h1 className="text-5xl md:text-9xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-text-main via-white to-text-main tracking-tighter mb-4 md:mb-6">
                        Echo<span className="text-gold-main">Masters</span>
                    </h1>
                    <p className="text-[10px] md:text-xl text-gold-main uppercase tracking-[0.6em] font-sans font-bold opacity-90">Academic Monograph</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default AppIntro;
