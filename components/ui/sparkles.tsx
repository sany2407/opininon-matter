"use client";
import React, { useId, useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion, useAnimation } from "motion/react";

type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  particleSize?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};

export const SparklesCore = (props: ParticlesProps) => {
  const {
    className,
    background,
    minSize,
    maxSize,
    speed,
    particleColor,
    particleDensity,
  } = props;

  const controls = useAnimation();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<Array<{x: number; y: number; vx: number; vy: number; size: number; opacity: number; opacitySpeed: number}>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();

    const count = particleDensity || 120;
    const minS = minSize || 0.5;
    const maxS = maxSize || 2;
    const newParticles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * (maxS - minS) + minS,
      opacity: Math.random(),
      opacitySpeed: (Math.random() * (speed || 4) + 1) * 0.01,
    }));
    setParticles(newParticles);

    controls.start({ opacity: 1, transition: { duration: 1 } });

    let animationId: number;
    const color = particleColor || "#ffffff";

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (background && background !== "transparent") {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      for (const p of newParticles) {
        p.x += p.vx;
        p.y += p.vy;
        p.opacity += p.opacitySpeed;

        if (p.opacity > 1 || p.opacity < 0.1) p.opacitySpeed *= -1;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = Math.max(0, Math.min(1, p.opacity));
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const observer = new ResizeObserver(resizeCanvas);
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, [background, minSize, maxSize, speed, particleColor, particleDensity, controls]);

  return (
    <motion.div animate={controls} className={cn("opacity-0 h-full w-full", className)}>
      <canvas ref={canvasRef} className="h-full w-full" />
    </motion.div>
  );
};
