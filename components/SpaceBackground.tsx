import React, { useEffect, useRef } from 'react';

const SpaceBackground: React.FC = () => {
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

        class Star {
            x: number; y: number; size: number; speed: number; opacity: number; t: number; color: string;
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 1.5;
                this.speed = Math.random() * 0.05 + 0.02;
                this.opacity = Math.random();
                this.t = Math.random() * Math.PI * 2;
                this.color = Math.random() > 0.8 ? '#D9B65C' : '#fff';
            }
            update() {
                this.t += 0.015;
                this.opacity = (Math.sin(this.t) + 1) / 2 * 0.6 + 0.4;
                this.x -= this.speed;
                if (this.x < 0) this.x = width;
            }
            draw() {
                ctx!.fillStyle = this.color;
                ctx!.globalAlpha = this.opacity;
                ctx!.beginPath();
                ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx!.fill();
                ctx!.globalAlpha = 1;
            }
        }

        class Galaxy {
            x: number; y: number; angle: number; particles: {r: number, a: number, s: number, sz: number, o: number}[];
            color: string;
            constructor(x: number, y: number, color: string) {
                this.x = x;
                this.y = y;
                this.angle = Math.random() * Math.PI * 2;
                this.color = color;
                this.particles = Array.from({ length: 150 }, () => ({
                    r: Math.random() * 120,
                    a: Math.random() * Math.PI * 2,
                    s: 0.002 + Math.random() * 0.005,
                    sz: 0.5 + Math.random() * 2,
                    o: 0.1 + Math.random() * 0.4
                }));
            }
            update() {
                this.particles.forEach(p => {
                    p.a += p.s;
                });
                this.x += 0.1;
                if (this.x > width + 200) this.x = -200;
            }
            draw() {
                ctx!.save();
                ctx!.translate(this.x, this.y);
                ctx!.rotate(this.angle);
                this.particles.forEach(p => {
                    const x = Math.cos(p.a) * p.r;
                    const y = Math.sin(p.a) * p.r * 0.6;
                    ctx!.fillStyle = this.color;
                    ctx!.globalAlpha = p.o;
                    ctx!.beginPath();
                    ctx!.arc(x, y, p.sz, 0, Math.PI * 2);
                    ctx!.fill();
                });
                const grad = ctx!.createRadialGradient(0, 0, 0, 0, 0, 40);
                grad.addColorStop(0, this.color);
                grad.addColorStop(1, 'transparent');
                ctx!.fillStyle = grad;
                ctx!.globalAlpha = 0.2;
                ctx!.beginPath();
                ctx!.arc(0, 0, 40, 0, Math.PI * 2);
                ctx!.fill();
                ctx!.restore();
            }
        }

        class CelestialWhale {
            x: number; y: number; speed: number; scale: number; t: number; 
            color: string; glow: number; tailAngle: number; direction: number;

            constructor() {
                this.reset();
                this.x = Math.random() * width;
            }

            reset() {
                this.direction = Math.random() > 0.5 ? 1 : -1;
                this.x = this.direction === 1 ? -400 : width + 400;
                this.y = 100 + Math.random() * (height - 200);
                this.speed = (0.2 + Math.random() * 0.3) * this.direction;
                this.scale = 0.4 + Math.random() * 0.6;
                this.t = Math.random() * Math.PI * 2;
                this.color = Math.random() > 0.5 ? '#00E5FF' : '#D9B65C';
                this.glow = 0;
                this.tailAngle = 0;
            }

            update(galaxies: Galaxy[]) {
                this.x += this.speed;
                this.t += 0.015;
                
                // Bobbing and movement physics
                this.y += Math.sin(this.t * 0.5) * 0.2;
                this.tailAngle = Math.sin(this.t * 1.5) * 15;

                // Interaction with Galaxies
                let minSubDist = 9999;
                galaxies.forEach(g => {
                    const dist = Math.hypot(this.x - g.x, this.y - g.y);
                    if (dist < minSubDist) minSubDist = dist;
                });
                
                // Pulse brighter when near a galaxy
                const targetGlow = minSubDist < 300 ? (1 - minSubDist / 300) : 0;
                this.glow += (targetGlow - this.glow) * 0.1;

                if (this.direction === 1 && this.x > width + 500) this.reset();
                if (this.direction === -1 && this.x < -500) this.reset();
            }

            draw() {
                ctx!.save();
                ctx!.translate(this.x, this.y);
                ctx!.scale(this.direction * this.scale, this.scale);
                ctx!.globalAlpha = 0.08 + this.glow * 0.15;
                
                // Whale Body
                ctx!.fillStyle = this.color;
                ctx!.beginPath();
                ctx!.moveTo(100, -10);
                ctx!.quadraticCurveTo(120, 0, 100, 10);
                ctx!.quadraticCurveTo(60, 25, 0, 30);
                ctx!.quadraticCurveTo(-80, 25, -120, 0);
                ctx!.quadraticCurveTo(-80, -25, 0, -30);
                ctx!.quadraticCurveTo(60, -25, 100, -10);
                ctx!.fill();

                // Fins
                ctx!.beginPath();
                ctx!.moveTo(20, 10);
                ctx!.lineTo(0, 50);
                ctx!.lineTo(-30, 10);
                ctx!.fill();

                // Tail (animated)
                ctx!.save();
                ctx!.translate(-120, 0);
                ctx!.rotate((this.tailAngle * Math.PI) / 180);
                ctx!.beginPath();
                ctx!.moveTo(0, 0);
                ctx!.lineTo(-60, -40);
                ctx!.lineTo(-40, 0);
                ctx!.lineTo(-60, 40);
                ctx!.closePath();
                ctx!.fill();
                ctx!.restore();

                // Glow Overlay
                if (this.glow > 0) {
                    ctx!.globalAlpha = this.glow * 0.3;
                    ctx!.shadowBlur = 20;
                    ctx!.shadowColor = this.color;
                    ctx!.strokeStyle = this.color;
                    ctx!.lineWidth = 2;
                    ctx!.stroke();
                }

                ctx!.restore();
            }
        }

        const stars = Array.from({ length: 250 }, () => new Star());
        const galaxies = [
            new Galaxy(width * 0.2, height * 0.3, '#D9B65C'),
            new Galaxy(width * 0.8, height * 0.7, '#634832'),
            new Galaxy(width * 0.5, height * 0.5, '#FAFAFA')
        ];
        const whales = Array.from({ length: 3 }, () => new CelestialWhale());

        let animationFrame: number;
        const render = () => {
            ctx.fillStyle = '#020408';
            ctx.fillRect(0, 0, width, height);

            const nebula1 = ctx.createRadialGradient(width * 0.8, height * 0.2, 0, width * 0.8, height * 0.2, width * 0.7);
            nebula1.addColorStop(0, 'rgba(217, 182, 92, 0.05)');
            nebula1.addColorStop(1, 'transparent');
            ctx.fillStyle = nebula1;
            ctx.fillRect(0, 0, width, height);

            stars.forEach(s => { s.update(); s.draw(); });
            galaxies.forEach(g => { g.update(); g.draw(); });
            whales.forEach(w => { w.update(galaxies); w.draw(); });

            ctx.fillStyle = 'rgba(0, 229, 255, 0.01)';
            for (let i = 0; i < height; i += 4) {
                ctx.fillRect(0, i, width, 1);
            }

            animationFrame = requestAnimationFrame(render);
        };

        render();

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', handleResize);
        return () => {
            cancelAnimationFrame(animationFrame);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <canvas 
            ref={canvasRef} 
            className="absolute inset-0 z-0 pointer-events-none"
            style={{ mixBlendMode: 'screen' }}
        />
    );
};

export default SpaceBackground;