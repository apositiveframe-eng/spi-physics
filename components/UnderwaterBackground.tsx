
import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const UnderwaterBackground: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const ambientGainRef = useRef<GainNode | null>(null);
    const sonarTimeoutRef = useRef<number | null>(null);
    const [isPinging, setIsPinging] = useState(false);
    const isPingingRef = useRef(false);
    
    const triggerWaveRef = useRef<((x: number, y: number) => void) | null>(null);

    const initAudio = () => {
        if (audioContextRef.current) return;
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 44100 });
        audioContextRef.current = ctx;

        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) { output[i] = Math.random() * 2 - 1; }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 120; 

        const ambientGain = ctx.createGain();
        ambientGain.gain.value = 0; 
        ambientGainRef.current = ambientGain;

        whiteNoise.connect(filter);
        filter.connect(ambientGain);
        ambientGain.connect(ctx.destination);
        whiteNoise.start();

        scheduleNextPing();
    };

    const playSonarPing = () => {
        const ctx = audioContextRef.current;
        if (!ctx || !audioEnabled) return;

        setIsPinging(true);
        isPingingRef.current = true;
        setTimeout(() => {
            setIsPinging(false);
            isPingingRef.current = false;
        }, 3000);

        if (triggerWaveRef.current) { 
            triggerWaveRef.current(window.innerWidth / 2, window.innerHeight / 2); 
        }

        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(700, t + 0.8);

        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.08, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + 2.5);

        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 3.0);
    };

    const scheduleNextPing = () => {
        if (sonarTimeoutRef.current) clearTimeout(sonarTimeoutRef.current);
        sonarTimeoutRef.current = window.setTimeout(() => {
            playSonarPing();
            scheduleNextPing();
        }, 15000 + Math.random() * 10000);
    };

    const toggleAudio = () => {
        if (!audioContextRef.current) initAudio();
        const ctx = audioContextRef.current;
        if (!ctx) return;
        if (ctx.state === 'suspended') ctx.resume();
        const newEnabled = !audioEnabled;
        setAudioEnabled(newEnabled);
        if (ambientGainRef.current) { ambientGainRef.current.gain.setTargetAtTime(newEnabled ? 0.08 : 0, ctx.currentTime, 1); }
        if (newEnabled) playSonarPing();
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        class Atlantis {
            glowPulse: number;

            constructor() {
                this.glowPulse = 0;
            }

            draw(frame: number) {
                this.glowPulse += 0.015;
                const isPinging = isPingingRef.current;
                const pulse = (Math.sin(this.glowPulse) + 1) / 2;
                const intensity = isPinging ? 1.0 : 0.4 + pulse * 0.4;
                const glowColor = isPinging ? '#00E5FF' : '#D9B65C';

                ctx!.save();
                ctx!.translate(width / 2, height * 0.95);

                const drawCrystallineDome = (x: number, y: number, scale: number) => {
                    ctx!.save();
                    ctx!.translate(x, y);
                    ctx!.scale(scale, scale);

                    // Glowing Foundation Ring
                    ctx!.strokeStyle = glowColor;
                    ctx!.lineWidth = 4;
                    ctx!.globalAlpha = intensity * 0.4;
                    ctx!.beginPath();
                    ctx!.ellipse(0, 0, 180, 40, 0, 0, Math.PI * 2);
                    ctx!.stroke();

                    // Main Glass Dome
                    const domeGrad = ctx!.createRadialGradient(0, -100, 0, 0, -100, 150);
                    domeGrad.addColorStop(0, `rgba(0, 229, 255, ${0.1 * intensity})`);
                    domeGrad.addColorStop(1, 'rgba(1, 2, 4, 0.8)');
                    ctx!.fillStyle = domeGrad;
                    ctx!.beginPath();
                    ctx!.arc(0, 0, 150, Math.PI, 0);
                    ctx!.fill();
                    
                    // Dome Surface Lines (Crystalline structure)
                    ctx!.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                    ctx!.lineWidth = 1;
                    ctx!.beginPath();
                    for(let i=0; i<8; i++) {
                        const angle = Math.PI + (i / 7) * Math.PI;
                        ctx!.moveTo(Math.cos(angle)*150, Math.sin(angle)*150);
                        ctx!.lineTo(0, -220);
                    }
                    ctx!.stroke();

                    // Internal Spires
                    ctx!.fillStyle = '#1e293b';
                    ctx!.fillRect(-15, -120, 30, 120);
                    
                    // Energy Core
                    ctx!.save();
                    ctx!.shadowBlur = 40;
                    ctx!.shadowColor = glowColor;
                    ctx!.fillStyle = glowColor;
                    ctx!.globalAlpha = intensity;
                    ctx!.beginPath();
                    ctx!.arc(0, -130, 12, 0, Math.PI * 2);
                    ctx!.fill();
                    ctx!.restore();

                    // High-Tech Columns
                    const cols = 6;
                    for(let i=0; i<cols; i++) {
                        const cx = -120 + (i * 48);
                        ctx!.fillStyle = '#0f172a';
                        ctx!.fillRect(cx, -60, 12, 60);
                        // Column Cap Glow
                        ctx!.fillStyle = glowColor;
                        ctx!.globalAlpha = intensity * 0.6;
                        ctx!.fillRect(cx - 2, -65, 16, 4);
                    }

                    ctx!.restore();
                };

                const drawObsidianNeedle = (x: number, y: number, scale: number) => {
                    ctx!.save();
                    ctx!.translate(x, y);
                    ctx!.scale(scale, scale);
                    
                    // Main Needle Body
                    ctx!.fillStyle = '#010204';
                    ctx!.beginPath();
                    ctx!.moveTo(-20, 0);
                    ctx!.lineTo(20, 0);
                    ctx!.lineTo(2, -450);
                    ctx!.lineTo(-2, -450);
                    ctx!.closePath();
                    ctx!.fill();
                    ctx!.strokeStyle = 'rgba(255, 255, 255, 0.05)';
                    ctx!.stroke();

                    // Floating Kinetic Rings
                    ctx!.strokeStyle = glowColor;
                    ctx!.lineWidth = 2;
                    for(let i=0; i<5; i++) {
                        ctx!.save();
                        ctx!.globalAlpha = intensity * (0.8 - (i * 0.1));
                        const ringY = -80 - i * 70;
                        const ringW = 60 - i * 8;
                        const floatPulse = Math.sin(frame * 0.03 + i) * 10;
                        ctx!.beginPath();
                        ctx!.ellipse(0, ringY + floatPulse, ringW, 10, 0, 0, Math.PI * 2);
                        ctx!.stroke();
                        
                        // Particle nodes on rings
                        ctx!.fillStyle = glowColor;
                        const nodeAngle = frame * 0.02 + i;
                        ctx!.beginPath();
                        ctx!.arc(Math.cos(nodeAngle)*ringW, ringY + floatPulse + Math.sin(nodeAngle)*10, 3, 0, Math.PI*2);
                        ctx!.fill();
                        ctx!.restore();
                    }

                    // Vertical Light Core
                    const coreGrad = ctx!.createLinearGradient(0, 0, 0, -450);
                    coreGrad.addColorStop(0, 'transparent');
                    coreGrad.addColorStop(0.5, glowColor);
                    coreGrad.addColorStop(1, 'white');
                    ctx!.save();
                    ctx!.globalAlpha = intensity * 0.3;
                    ctx!.fillStyle = coreGrad;
                    ctx!.fillRect(-1, -450, 2, 450);
                    ctx!.restore();

                    ctx!.restore();
                };

                // Composition of a High-Tech City
                ctx!.globalAlpha = 0.2;
                
                // Distant Layer
                ctx!.save();
                ctx!.globalAlpha = 0.05;
                drawObsidianNeedle(-900, 20, 0.8);
                drawObsidianNeedle(900, 20, 0.8);
                ctx!.restore();

                // Middle Layer
                drawCrystallineDome(-450, 0, 0.7);
                drawCrystallineDome(450, 0, 0.7);
                drawObsidianNeedle(-650, 40, 1.1);
                drawObsidianNeedle(650, 40, 1.1);

                // Foreground Main Spire
                ctx!.globalAlpha = 0.25;
                drawObsidianNeedle(0, 50, 1.5);
                drawCrystallineDome(0, 50, 1.0);

                ctx!.restore();
            }
        }

        class GodRay {
            x: number; width: number; opacity: number; speed: number; angle: number;
            constructor() {
                this.x = Math.random() * width;
                this.width = 150 + Math.random() * 400;
                this.opacity = 0.01 + Math.random() * 0.05;
                this.speed = 0.001 + Math.random() * 0.002;
                this.angle = (Math.random() - 0.5) * 0.2;
            }
            update(t: number) {
                this.x += Math.sin(t * this.speed) * 0.6;
            }
            draw() {
                ctx!.save();
                ctx!.translate(this.x, -200);
                ctx!.rotate(this.angle);
                const grad = ctx!.createLinearGradient(0, 0, 0, height * 1.5);
                grad.addColorStop(0, `rgba(0, 229, 255, ${this.opacity})`);
                grad.addColorStop(0.5, `rgba(0, 229, 255, ${this.opacity * 0.5})`);
                grad.addColorStop(1, 'rgba(0, 229, 255, 0)');
                ctx!.fillStyle = grad;
                ctx!.fillRect(-this.width/2, 0, this.width, height * 1.5);
                ctx!.restore();
            }
        }

        class FloridaPompano {
            x: number; y: number; speed: number; scale: number; opacity: number;
            angle: number; direction: number; offset: number; tailAngle: number;
            schoolOffset: { x: number, y: number };

            constructor(schoolX: number, schoolY: number) {
                this.direction = 1;
                this.scale = 0.2 + Math.random() * 0.15;
                this.opacity = 0.2 + Math.random() * 0.3;
                this.angle = Math.random() * Math.PI * 2;
                this.offset = Math.random() * 100;
                this.tailAngle = 0;
                this.schoolOffset = { 
                    x: (Math.random() - 0.5) * 300, 
                    y: (Math.random() - 0.5) * 150 
                };
                this.x = schoolX + this.schoolOffset.x;
                this.y = schoolY + this.schoolOffset.y;
                this.speed = 1.5 + Math.random();
            }

            update(targetX: number, targetY: number) {
                const isStartled = isPingingRef.current;
                const spd = isStartled ? this.speed * 4.0 : this.speed;
                
                const dx = (targetX + this.schoolOffset.x) - this.x;
                const dy = (targetY + this.schoolOffset.y) - this.y;
                
                this.x += dx * 0.01 * spd;
                this.y += dy * 0.01 * spd;
                
                this.angle += isStartled ? 0.4 : 0.1;
                this.tailAngle = Math.sin(this.angle * 3.0) * 30;
                this.y += Math.sin(this.angle * 0.5 + this.offset) * 0.5;
            }

            draw() {
                ctx!.save();
                ctx!.translate(this.x, this.y);
                ctx!.scale(this.direction * this.scale, this.scale);
                ctx!.globalAlpha = this.opacity;

                const grad = ctx!.createLinearGradient(0, -10, 0, 10);
                grad.addColorStop(0, '#f8fafc');
                grad.addColorStop(0.5, '#94a3b8');
                grad.addColorStop(1, '#1e293b');

                ctx!.fillStyle = grad;
                ctx!.beginPath();
                ctx!.moveTo(35, 0);
                ctx!.quadraticCurveTo(0, -30, -35, 0);
                ctx!.quadraticCurveTo(0, 30, 35, 0);
                ctx!.fill();

                ctx!.fillStyle = '#475569';
                ctx!.save();
                ctx!.translate(-35, 0);
                ctx!.rotate((this.tailAngle * Math.PI) / 180);
                ctx!.beginPath();
                ctx!.moveTo(0, 0);
                ctx!.lineTo(-30, -30);
                ctx!.lineTo(-15, 0);
                ctx!.lineTo(-30, 30);
                ctx!.closePath();
                ctx!.fill();
                ctx!.restore();

                ctx!.restore();
            }
        }

        class GoliathGrouper {
            x: number; y: number; speed: number; scale: number; opacity: number;
            angle: number; tailAngle: number; direction: number; drift: number;

            constructor() { this.reset(true); }
            reset(fullRandom = false) {
                this.direction = Math.random() > 0.5 ? 1 : -1;
                this.x = this.direction === 1 ? -600 : width + 600;
                if (fullRandom) this.x = Math.random() * width;
                this.y = height * 0.2 + Math.random() * (height * 0.6);
                this.speed = (0.1 + Math.random() * 0.1) * this.direction;
                this.scale = 1.5 + Math.random() * 1.0;
                this.opacity = 0.3 + Math.random() * 0.2;
                this.angle = Math.random() * Math.PI * 2;
                this.tailAngle = 0;
                this.drift = Math.random() * 100;
            }
            update() {
                this.x += this.speed;
                this.angle += 0.005;
                this.tailAngle = Math.sin(this.angle * 1.2) * 5;
                this.y += Math.sin(this.angle * 0.2 + this.drift) * 0.1;
                if (this.direction === 1 && this.x > width + 800) this.reset();
                if (this.direction === -1 && this.x < -800) this.reset();
            }
            draw() {
                ctx!.save();
                ctx!.translate(this.x, this.y);
                ctx!.scale(this.direction * this.scale, this.scale);
                ctx!.globalAlpha = this.opacity;
                const bodyGrad = ctx!.createRadialGradient(0, 0, 0, 0, 0, 100);
                bodyGrad.addColorStop(0, '#1e293b');
                bodyGrad.addColorStop(1, '#020617');
                ctx!.fillStyle = bodyGrad;
                ctx!.beginPath();
                ctx!.moveTo(120, 0);
                ctx!.quadraticCurveTo(60, -70, -100, -50);
                ctx!.quadraticCurveTo(-140, 0, -100, 50);
                ctx!.quadraticCurveTo(60, 70, 120, 0);
                ctx!.fill();
                ctx!.restore();
            }
        }

        class Jellyfish {
            x: number; y: number; scale: number; opacity: number;
            pulse: number; pulseSpeed: number; color: string;
            layer: number;

            constructor(layer: number) {
                this.layer = layer;
                this.reset(true);
                this.opacity = (0.1 + Math.random() * 0.2) * (layer + 1);
                this.scale = (0.3 + Math.random() * 0.4) * (0.8 + layer * 0.3);
                this.pulse = Math.random() * Math.PI * 2;
                this.pulseSpeed = 0.01 + Math.random() * 0.01;
                const colors = ['#00E5FF', '#D9B65C', '#3B82F6', '#6366f1'];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }
            reset(fullRandom = false) {
                this.x = Math.random() * width;
                this.y = fullRandom ? Math.random() * height : height + 200;
            }
            update() {
                const isStartled = isPingingRef.current;
                const mult = isStartled ? 6.0 : 1.0;
                this.pulse += this.pulseSpeed * mult;
                const contraction = (Math.sin(this.pulse) + 1) / 2;
                this.y -= (0.2 + contraction * 1.2) * mult * (0.5 + this.layer * 0.4);
                this.x += Math.cos(this.pulse * 0.5) * 0.3;
                if (this.y < -400) this.reset();
            }
            draw() {
                ctx!.save();
                ctx!.translate(this.x, this.y);
                ctx!.scale(this.scale, this.scale);
                ctx!.globalAlpha = this.opacity;
                const contraction = (Math.sin(this.pulse) + 1) / 2;
                const bW = 50 - contraction * 15;
                const bH = 40 + contraction * 15;
                
                const isStartled = isPingingRef.current;
                if (isStartled) {
                    ctx!.shadowBlur = 40;
                    ctx!.shadowColor = this.color;
                }

                const grad = ctx!.createRadialGradient(0, 0, 0, 0, 0, bW * 1.5);
                grad.addColorStop(0, this.color);
                grad.addColorStop(0.8, 'transparent');
                ctx!.fillStyle = grad;
                ctx!.beginPath();
                ctx!.moveTo(-bW, 0);
                ctx!.bezierCurveTo(-bW, -bH, bW, -bH, bW, 0);
                ctx!.quadraticCurveTo(0, 20, -bW, 0);
                ctx!.fill();
                
                // Tentacles
                ctx!.strokeStyle = this.color;
                ctx!.lineWidth = 1;
                ctx!.globalAlpha = this.opacity * 0.5;
                for(let i=0; i<5; i++) {
                    ctx!.beginPath();
                    ctx!.moveTo(-30 + i * 15, 0);
                    ctx!.bezierCurveTo(
                        -30 + i * 15 + Math.sin(frame * 0.05 + i) * 10, 40,
                        -30 + i * 15 + Math.cos(frame * 0.05 + i) * 20, 80,
                        -30 + i * 15, 120
                    );
                    ctx!.stroke();
                }

                ctx!.restore();
            }
        }

        class SonarWave {
            x: number; y: number; radius: number; opacity: number;
            constructor(x: number, y: number) { this.x = x; this.y = y; this.radius = 0; this.opacity = 1.0; }
            update() { this.radius += 5; this.opacity -= 0.005; }
            draw() {
                if (this.opacity <= 0) return;
                ctx!.beginPath();
                ctx!.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx!.strokeStyle = `rgba(0, 229, 255, ${this.opacity})`;
                ctx!.lineWidth = 2.5;
                ctx!.stroke();
            }
        }

        const sonarWaves: SonarWave[] = [];
        const rays = Array.from({ length: 8 }, () => new GodRay());
        const atlantis = new Atlantis();
        const groupers = [new GoliathGrouper(), new GoliathGrouper()];
        const jellies = [
            ...Array.from({ length: 5 }, () => new Jellyfish(0)),
            ...Array.from({ length: 5 }, () => new Jellyfish(1)),
            ...Array.from({ length: 5 }, () => new Jellyfish(2)),
        ];
        const pSchoolX = width/2;
        const pSchoolY = height/2;
        const pompanos = Array.from({ length: 20 }, () => new FloridaPompano(pSchoolX, pSchoolY));

        triggerWaveRef.current = (x, y) => sonarWaves.push(new SonarWave(x, y));

        let frame = 0;
        let animationFrame: number;
        let schoolTarget = { x: pSchoolX, y: pSchoolY, angle: 0 };
        
        const render = () => {
            frame++;
            ctx.fillStyle = '#010204';
            ctx.fillRect(0, 0, width, height);

            const depthGrad = ctx.createLinearGradient(0, 0, 0, height);
            depthGrad.addColorStop(0, 'rgba(1, 15, 30, 0.8)');
            depthGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = depthGrad;
            ctx.fillRect(0, 0, width, height);

            rays.forEach(r => { r.update(frame); r.draw(); });
            atlantis.draw(frame);

            schoolTarget.angle += 0.003;
            schoolTarget.x = width/2 + Math.cos(schoolTarget.angle) * (width/2.5);
            schoolTarget.y = height/2 + Math.sin(schoolTarget.angle * 1.8) * (height/3);

            jellies.filter(j => j.layer === 0).forEach(j => { j.update(); j.draw(); });
            groupers.forEach(g => { g.update(); g.draw(); });
            jellies.filter(j => j.layer === 1).forEach(j => { j.update(); j.draw(); });
            pompanos.forEach(p => { p.update(schoolTarget.x, schoolTarget.y); p.draw(); });

            sonarWaves.forEach((wave, i) => {
                wave.update(); wave.draw(); if (wave.opacity <= 0) sonarWaves.splice(i, 1);
            });

            jellies.filter(j => j.layer === 2).forEach(j => { j.update(); j.draw(); });

            // Sonar Distortion Mask
            if (isPingingRef.current) {
                ctx.save();
                ctx.globalAlpha = 0.15 * Math.sin(frame * 0.4);
                ctx.fillStyle = '#00E5FF';
                for(let i=0; i<height; i+=6) {
                    ctx.fillRect(0, i, width, 1);
                }
                ctx.restore();
            }

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

    return (
        <>
            <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
            <div className="fixed bottom-10 left-10 z-[100] flex items-center gap-6">
                <button 
                    onClick={toggleAudio}
                    className={`p-6 rounded-[2.5rem] backdrop-blur-3xl border-2 transition-all duration-700 shadow-blue-bright tactical-border ${audioEnabled ? 'bg-accent-blue/30 border-accent-blue/50 text-accent-blue' : 'bg-dark-secondary/80 border-white/20 text-text-muted hover:border-white/40'}`}
                >
                    {audioEnabled ? <Volume2 className="w-8 h-8 animate-pulse" /> : <VolumeX className="w-8 h-8" />}
                </button>
                <div className={`text-[12px] uppercase tracking-[0.8em] font-black transition-all duration-1000 ${audioEnabled ? 'opacity-100 text-accent-blue drop-shadow-blue' : 'opacity-0 text-text-muted'}`}>
                    Acoustic Sync Active
                </div>
            </div>
        </>
    );
};

export default UnderwaterBackground;
