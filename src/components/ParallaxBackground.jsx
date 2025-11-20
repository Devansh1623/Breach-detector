import React, { useEffect, useRef } from "react";

/**
 * ParallaxBackground
 * - uses a large background image as base
 * - paints an animated grid + subtle particles canvas on top
 * - responds to pointer movement for parallax
 *
 * Note: image path used below is the uploaded image path.
 * If you move the file into public/assets/bg.jpg, replace the URL accordingly.
 */
export default function ParallaxBackground() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const imgUrl = "/mnt/data/c6c5a39f-09b8-4cea-95a4-ae19361e6d0f.jpg";
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // size canvas
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // particles for subtle movement
    const particles = [];
    const PARTICLE_COUNT = Math.max(40, Math.round((window.innerWidth * window.innerHeight) / 200000));
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 0.6 + Math.random() * 1.8,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.1,
        alpha: 0.06 + Math.random() * 0.28
      });
    }

    let raf = null;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // draw subtle grid lines (neon)
      const spacing = 120;
      ctx.save();
      ctx.globalAlpha = 0.07;
      for (let x = -spacing; x < canvas.width + spacing; x += spacing) {
        ctx.strokeStyle = "rgba(60,140,200,0.12)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + (Math.sin(Date.now() / 4500 + x / 300) * 6), 0);
        ctx.lineTo(x + (Math.sin(Date.now() / 4500 + x / 300) * 6), canvas.height);
        ctx.stroke();
      }
      for (let y = -spacing; y < canvas.height + spacing; y += spacing) {
        ctx.strokeStyle = "rgba(100,60,200,0.07)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y + (Math.cos(Date.now() / 4500 + y / 300) * 6));
        ctx.lineTo(canvas.width, y + (Math.cos(Date.now() / 4500 + y / 300) * 6));
        ctx.stroke();
      }
      ctx.restore();

      // particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        ctx.beginPath();
        ctx.fillStyle = `rgba(170,220,255,${p.alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    }
    draw();

    // pointer parallax
    function onMove(e) {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      // translate container background slightly
      container.style.transform = `translate3d(${x * 8}px, ${y * 6}px, 0) scale(1.02)`;
      canvas.style.transform = `translate3d(${x * -4}px, ${y * -3}px, 0)`;
    }
    window.addEventListener("mousemove", onMove);

    // initial style
    container.style.backgroundImage = `url("${imgUrl}")`;
    container.style.backgroundSize = "cover";
    container.style.backgroundPosition = "center center";

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        aria-hidden
        className="fixed inset-0 z-[-2] transition-transform duration-300 will-change-transform"
        style={{
          backgroundRepeat: "no-repeat",
          filter: "saturate(1.06) contrast(1.02) brightness(0.95)"
        }}
      />
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[-1] pointer-events-none"
        style={{ mixBlendMode: "screen" }}
      />
      {/* top-layer subtle gradient overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none" style={{
        background: "linear-gradient(180deg, rgba(2,5,12,0.35), rgba(2,2,8,0.6))"
      }} />
    </>
  );
}
