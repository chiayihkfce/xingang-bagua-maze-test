import React, { useEffect, useRef } from 'react';

const BaguaParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 768);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', checkMobile);
    checkMobile();

    if (isMobile) return () => window.removeEventListener('resize', checkMobile);

    const canvas = canvasRef.current;
    if (!canvas) return () => window.removeEventListener('resize', checkMobile);
    const ctx = canvas.getContext('2d');
    if (!ctx) return () => window.removeEventListener('resize', checkMobile);

    let clouds: Cloud[] = [];
    const cloudCount = 10; // 稍微增加雲量補償粒子移除後的空缺

    class Cloud {
      x: number;
      y: number;
      speedX: number;
      offscreenCanvas: HTMLCanvasElement | null;

      constructor(w: number, h: number) {
        this.speedX = Math.random() * 0.08 + 0.02;
        this.offscreenCanvas = document.createElement('canvas');
        this.x = 0; this.y = 0;
        this.preRender();
        this.resetPosition(w, h);
      }

      preRender() {
        if (!this.offscreenCanvas) return;
        const baseRadius = Math.random() * 120 + 100;
        this.offscreenCanvas.width = baseRadius * 4;
        this.offscreenCanvas.height = baseRadius * 4;
        const octx = this.offscreenCanvas.getContext('2d');
        if (!octx) return;

        const centerX = this.offscreenCanvas.width / 2;
        const centerY = this.offscreenCanvas.height / 2;

        Array.from({ length: 10 }).forEach(() => {
          const r = baseRadius * (Math.random() * 0.8 + 0.5);
          const ox = centerX + (Math.random() * baseRadius - baseRadius / 2);
          const oy = centerY + (Math.random() * baseRadius / 3 - baseRadius / 6);
          const o = Math.random() * 0.04 + 0.02;

          const gradient = octx.createRadialGradient(ox, oy, 0, ox, oy, r);
          gradient.addColorStop(0, `rgba(255, 255, 255, ${o})`);
          gradient.addColorStop(0.6, `rgba(200, 200, 200, ${o * 0.4})`);
          gradient.addColorStop(1, 'transparent');
          octx.fillStyle = gradient;
          octx.beginPath();
          octx.arc(ox, oy, r, 0, Math.PI * 2);
          octx.fill();
        });
      }

      resetPosition(w: number, h: number) {
        const centerX = w / 2;
        const centerY = h / 2;
        let valid = false;
        while (!valid) {
          this.x = Math.random() * w;
          this.y = Math.random() * h;
          const dist = Math.hypot(this.x - centerX, this.y - centerY);
          if (dist > 350) valid = true;
        }
      }

      update(w: number, h: number) {
        this.x += this.speedX;
        if (this.x - 400 > w) {
          this.x = -400;
          this.resetPosition(w, h);
        }
        const centerX = w / 2;
        const centerY = h / 2;
        const dist = Math.hypot(this.x - centerX, this.y - centerY);
        if (dist < 300) this.y += (this.y > centerY ? 1 : -1);
      }

      draw() {
        if (!ctx || !this.offscreenCanvas) return;
        ctx.drawImage(this.offscreenCanvas, this.x - this.offscreenCanvas.width / 2, this.y - this.offscreenCanvas.height / 2);
      }
    }

    const init = () => {
      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) return;
      clouds = [];
      for (let i = 0; i < cloudCount; i++) clouds.push(new Cloud(w, h));
    };

    const animate = () => {
      if (!ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      clouds.forEach(c => { c.update(w, h); c.draw(); });
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
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobile]);

  return (
    <>
      {!isMobile && (
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
      )}
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
