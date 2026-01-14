import React, { useState, useEffect, useRef, useLayoutEffect, useMemo } from 'react';
import { Play, Pause, Activity, Radio, Target, Waves, Zap, Box, ArrowRight, Layers, MoveRight, Beaker, Info, Sparkles, Sliders, Thermometer, Maximize2, ShieldAlert, ZapOff, Scan } from 'lucide-react';

interface SimulationProps {
  type: string;
  isLabMode?: boolean;
}

const Simulations: React.FC<SimulationProps> = ({ type, isLabMode = false }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [param1, setParam1] = useState(50);
  const [param2, setParam2] = useState(50);
  const [probePos, setProbePos] = useState({ x: 150, y: 150 });
  const [targetFound, setTargetFound] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const [size, setSize] = useState({ width: 0, height: 400 });

  const themeColors = useMemo(() => ({
    blue: '#00E5FF',
    gold: '#D9B65C',
    midnight: '#010204',
    danger: '#ef4444',
    success: '#22c55e',
    purple: '#A855F7'
  }), []);

  const labInsight = useMemo(() => {
    if (type === 'InteractivePhantomScan') {
        return targetFound ? "NODE_SYNC: Calculus identified." : "SCAN_MODE: Move probe to localize anomaly.";
    }
    switch (type) {
      case 'LongitudinalWaveVisual': return "Energy propagates via particle handshake.";
      case 'TransducerAnatomyVisual': return "Damping reduces Q-Factor. Higher Axial Res.";
      case 'PulsedWaveVisual': return "PRP = Talking + Listening Time.";
      case 'DopplerPrincipleVisual': return "Cosine θ gatekeeper. 90° = Data Void.";
      case 'PhysicalPrinciplesVisual': return "Bernoulli: Velocity ∝ 1/Pressure.";
      default: return "Diagnostic telemetry synchronized.";
    }
  }, [type, targetFound]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
        if (containerRef.current) {
            const h = window.innerWidth < 768 ? (isLabMode ? 400 : 300) : (isLabMode ? 500 : 380);
            setSize({ width: containerRef.current.clientWidth, height: h });
        }
    };
    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);
    updateSize();
    return () => observer.disconnect();
  }, [isLabMode]);

  const render = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      ctx.fillStyle = '#010204';
      ctx.fillRect(0, 0, w, h);
      
      ctx.strokeStyle = themeColors.blue;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.1;
      const step = w < 500 ? 30 : 40;
      for(let i=0; i<w; i+=step) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
      for(let i=0; i<h; i+=step) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }
      ctx.globalAlpha = 1.0;

      if (type === 'PulsedWaveVisual') {
          const prp = 100 - (param1 / 2);
          const pd = w < 500 ? 6 : 10;
          ctx.strokeStyle = themeColors.blue;
          ctx.lineWidth = 2;
          ctx.beginPath();
          for(let x=0; x<w; x++) {
              const inPulse = (x + t) % prp < pd;
              const y = h/2 + (inPulse ? Math.sin(x * 0.5) * (w < 500 ? 25 : 40) : 0);
              if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
          }
          ctx.stroke();
          
          ctx.fillStyle = themeColors.gold;
          ctx.font = w < 500 ? '8px monospace' : '10px monospace';
          ctx.fillText("PD", 20, h/2 - (w < 500 ? 30 : 50));
          ctx.fillText(`PRP: ${Math.round(prp)}μs`, 20, h/2 + (w < 500 ? 50 : 70));
      } else if (type === 'InteractivePhantomScan') {
          const targetX = w * 0.7;
          const targetY = h * 0.6;
          const dist = Math.hypot(probePos.x - targetX, probePos.y - targetY);
          const visibility = Math.max(0, 1 - dist/(w < 500 ? 100 : 150)) * (param1 / 80);
          
          if (dist < (w < 500 ? 100 : 150)) {
              ctx.shadowBlur = (w < 500 ? 15 : 30) * visibility;
              ctx.shadowColor = themeColors.blue;
              ctx.fillStyle = `rgba(0, 229, 255, ${visibility * 0.4})`;
              ctx.beginPath(); ctx.arc(targetX, targetY, (w < 500 ? 25 : 40), 0, Math.PI * 2); ctx.fill();
              if (visibility > 0.6) setTargetFound(true); else setTargetFound(false);
          }
          ctx.fillStyle = themeColors.gold;
          ctx.beginPath(); ctx.arc(probePos.x, probePos.y, (w < 500 ? 3 : 4), 0, Math.PI * 2); ctx.fill();
      } else {
          ctx.strokeStyle = themeColors.blue;
          ctx.lineWidth = 2;
          ctx.beginPath();
          for(let x=0; x<w; x++) {
              const y = h/2 + Math.sin(x*0.05 + t*0.1) * (param1/(w < 500 ? 4 : 3));
              if(x===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
          }
          ctx.stroke();
      }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || size.width === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const loop = () => {
      render(ctx, size.width, size.height, animationRef.current++);
      if (isPlaying) animationRef.current = requestAnimationFrame(loop);
    };
    if (isPlaying) loop();
    return () => cancelAnimationFrame(animationRef.current);
  }, [type, isPlaying, param1, param2, size, probePos]);

  const handlePointer = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setProbePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div className="glass-panel p-0.5 rounded-[1.5rem] md:rounded-[3rem] overflow-hidden bg-black/95 flex flex-col h-full tactical-border group/sim">
      <div className="p-4 md:p-8 bg-midnight-light/80 flex justify-between items-center border-b border-white/5 relative z-20">
        <div className="flex items-center gap-3 md:gap-6">
            <div className={`w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-full ${isPlaying ? 'bg-accent-blue animate-pulse' : 'bg-red-500'} shadow-[0_0_15px_currentColor]`} />
            <div className="flex flex-col">
                <span className="text-[7px] md:text-[10px] text-white uppercase font-black tracking-[0.3em] md:tracking-[0.4em] leading-none">{type.replace('Visual', '').toUpperCase()}</span>
                <span className="text-[6px] md:text-[8px] text-text-muted uppercase tracking-[0.2em] mt-1 md:mt-1.5 font-mono opacity-40">{isPlaying ? 'Active' : 'Standby'}</span>
            </div>
        </div>
        <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 md:p-3.5 rounded-lg md:rounded-xl bg-white/5 text-accent-blue hover:bg-accent-blue hover:text-black transition-all active:scale-90 shadow-glass border border-white/10">
            {isPlaying ? <Pause className="w-4 h-4 md:w-5 md:h-5" /> : <Play className="w-4 h-4 md:w-5 md:h-5" />}
        </button>
      </div>

      <div 
        ref={containerRef} 
        onPointerMove={handlePointer}
        className={`relative flex-1 bg-dark-primary overflow-hidden min-h-[300px] md:min-h-[400px] ${type === 'InteractivePhantomScan' ? 'cursor-none touch-none' : 'cursor-crosshair'}`}
      >
         <canvas ref={canvasRef} width={size.width} height={size.height} className="block w-full h-full" />
         <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 right-4 md:right-8 p-3 md:p-6 rounded-xl md:rounded-[2.5rem] bg-midnight/90 backdrop-blur-3xl border border-accent-blue/20 animate-fade-in shadow-blue flex items-center gap-3 md:gap-6 z-10">
            <div className={`p-2 md:p-4 rounded-xl shrink-0 tactical-border ${targetFound ? 'bg-green-500/20 text-green-400' : 'bg-accent-blue/10 text-accent-blue'}`}>
                {targetFound ? <ShieldAlert className="w-4 h-4 md:w-5 md:h-5 animate-pulse" /> : <Scan className="w-4 h-4 md:w-5 md:h-5" />}
            </div>
            <div className="space-y-0.5 md:space-y-1.5 flex-1 overflow-hidden">
                <h5 className={`text-[7px] md:text-[9px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] ${targetFound ? 'text-green-400' : 'text-accent-blue'}`}>Telemetry</h5>
                <p className="text-[10px] md:text-sm text-white/90 font-serif italic leading-snug truncate md:whitespace-normal">"{labInsight}"</p>
            </div>
         </div>
      </div>

      <div className="p-6 md:p-12 bg-midnight-light/60 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 relative z-20">
          <div className="space-y-2 md:space-y-4">
            <div className="flex justify-between text-[7px] md:text-[9px] font-black text-accent-blue/60 uppercase tracking-[0.3em] md:tracking-[0.4em]"><span>Calibration_A</span><span className="text-white font-mono">{param1}</span></div>
            <input type="range" value={param1} onChange={e => setParam1(parseInt(e.target.value))} className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-accent-blue cursor-pointer" />
          </div>
          <div className="space-y-2 md:space-y-4">
            <div className="flex justify-between text-[7px] md:text-[9px] font-black text-accent-blue/60 uppercase tracking-[0.3em] md:tracking-[0.4em]"><span>Calibration_B</span><span className="text-white font-mono">{param2}</span></div>
            <input type="range" value={param2} onChange={e => setParam2(parseInt(e.target.value))} className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-accent-blue cursor-pointer" />
          </div>
      </div>
    </div>
  );
};

export default Simulations;
