
import React, { useEffect, useRef } from 'react';

const LightLiveBackground: React.FC = () => {
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
      x: number; y: number; size: number; speedX: number; speedY: number; 
      opacity: number; color: string; t: number;

      constructor() {
        this.reset();
        this.x = Math.random() * width;
        this.y = Math.random() * height;
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + 20;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = -(Math.random() * 0.5 + 0.2);
        this.opacity = Math.random() * 0.3 + 0.1;
        this.color = Math.random() > 0.5 ? '#D9B65C' : '#FFFFFF';
        this.t = Math.random() * Math.PI * 2;
      }

      update() {
        this.t += 0.01;
        this.x += this.speedX + Math.sin(this.t) * 0.2;
        this.y += this.speedY;

        if (this.y < -20) this.reset();
        if (this.x < -20) this.x = width + 20;
        if (this.x > width + 20) this.x = -20;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    class SunRay {
      angle: number; width: number; opacity: number; speed: number;

      constructor() {
        this.angle = (Math.random() - 0.5) * 0.4;
        this.width = 100 + Math.random() * 300;
        this.opacity = 0.02 + Math.random() * 0.05;
        this.speed = 0.001 + Math.random() * 0.002;
      }

      update(t: number) {
        this.angle += Math.sin(t * this.speed) * 0.0005;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(width * 0.8, -100);
        ctx.rotate(this.angle);
        const grad = ctx.createLinearGradient(0, 0, 0, height * 1.5);
        grad.addColorStop(0, `rgba(217, 182, 92, ${this.opacity})`);
        grad.addColorStop(0.5, `rgba(217, 182, 92, ${this.opacity * 0.2})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(-this.width / 2, 0, this.width, height * 1.5);
        ctx.restore();
      }
    }

    const particles = Array.from({ length: 150 }, () => new Particle());
    const rays = Array.from({ length: 5 }, () => new SunRay());

    let frame = 0;
    let animationId: number;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Background Base
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#FFFFFF');
      bgGrad.addColorStop(1, '#F8F1E1');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Soft Glow
      const glowGrad = ctx.createRadialGradient(width * 0.8, 0, 0, width * 0.8, 0, width);
      glowGrad.addColorStop(0, 'rgba(217, 182, 92, 0.08)');
      glowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      rays.forEach(r => {
        r.update(frame);
        r.draw();
      });

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      // Subtle Scanlines for texture
      ctx.save();
      ctx.globalAlpha = 0.02;
      ctx.strokeStyle = '#D9B65C';
      ctx.lineWidth = 1;
      for (let i = 0; i < height; i += 4) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }
      ctx.restore();

      animationId = requestAnimationFrame(render);
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
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000"
    />
  );
};

export default LightLiveBackground;
