import React, { useEffect, useRef } from 'react';

const BaguaParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let clouds: Cloud[] = [];
    const cloudCount = 10; // 稍微增加雲量補償粒子移除後的空缺

    class Cloud {
      x: number;
      y: number;
      baseRadius: number;
      blobs: { ox: number, oy: number, r: number, o: number }[];
      speedX: number;

      constructor() {
        this.baseRadius = Math.random() * 120 + 100;
        this.speedX = Math.random() * 0.08 + 0.02;
        this.blobs = Array.from({ length: 12 }).map(() => ({
          ox: Math.random() * 200 - 100,
          oy: Math.random() * 80 - 40,
          r: Math.random() * 0.9 + 0.6,
          o: Math.random() * 0.05 + 0.02
        }));
        this.x = 0; this.y = 0;
        this.resetPosition();
      }

      resetPosition() {
        const centerX = canvas!.width / 2;
        const centerY = canvas!.height / 2;
        let valid = false;
        while (!valid) {
          this.x = Math.random() * canvas!.width;
          this.y = Math.random() * canvas!.height;
          const dist = Math.hypot(this.x - centerX, this.y - centerY);
          if (dist > 350) valid = true;
        }
      }

      update() {
        this.x += this.speedX;
        if (this.x - 400 > canvas!.width) {
          this.x = -400;
          this.resetPosition();
        }
        const centerX = canvas!.width / 2;
        const centerY = canvas!.height / 2;
        const dist = Math.hypot(this.x - centerX, this.y - centerY);
        if (dist < 300) this.y += (this.y > centerY ? 1 : -1);
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        this.blobs.forEach(b => {
          const r = this.baseRadius * b.r;
          const gx = this.x + b.ox;
          const gy = this.y + b.oy;
          const gradient = ctx.createRadialGradient(gx, gy, 0, gx, gy, r);
          gradient.addColorStop(0, `rgba(255, 255, 255, ${b.o})`);
          gradient.addColorStop(0.6, `rgba(200, 200, 200, ${b.o * 0.5})`);
          gradient.addColorStop(1, 'transparent');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(gx, gy, r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }
    }

    const init = () => {
      clouds = [];
      for (let i = 0; i < cloudCount; i++) clouds.push(new Cloud());
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      clouds.forEach(c => { c.update(); c.draw(); });
      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    handleResize();
    animate();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: -2,
          opacity: 0.6
        }}
      />
      {/* 背景中央太極基座 */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: -3,
        pointerEvents: 'none'
      }}>
        <div style={{
          width: 'min(80vw, 80vh)',
          height: 'min(80vw, 80vh)',
          opacity: 0.03,
          borderRadius: '50%',
          overflow: 'hidden',
          border: '2px solid var(--primary-gold)',
          animation: 'taijiRotate 60s linear infinite',
          position: 'relative'
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to right, #fff 50%, #000 50%)',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute', top: 0, left: '25%', width: '50%', height: '50%',
              background: '#fff', borderRadius: '50%',
              display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}>
              <div style={{ width: '20%', height: '20%', background: '#000', borderRadius: '50%' }}></div>
            </div>
            <div style={{
              position: 'absolute', bottom: 0, left: '25%', width: '50%', height: '50%',
              background: '#000', borderRadius: '50%',
              display: 'flex', justifyContent: 'center', alignItems: 'center'
            }}>
              <div style={{ width: '20%', height: '20%', background: '#fff', borderRadius: '50%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BaguaParticles;
