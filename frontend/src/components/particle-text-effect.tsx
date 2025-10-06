/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef } from "react";

interface Vector2D {
  x: number;
  y: number;
}

class Particle {
  pos: Vector2D = { x: 0, y: 0 };
  vel: Vector2D = { x: 0, y: 0 };
  acc: Vector2D = { x: 0, y: 0 };
  target: Vector2D = { x: 0, y: 0 };

  closeEnoughTarget = 100;
  maxSpeed = 1.0;
  maxForce = 0.1;
  particleSize = 10;
  isKilled = false;

  startColor = { r: 0, g: 0, b: 0 };
  targetColor = { r: 0, g: 0, b: 0 };
  colorWeight = 0;
  colorBlendRate = 0.01;

  move() {
    let proximityMult = 1;
    const distance = Math.sqrt(
      Math.pow(this.pos.x - this.target.x, 2) +
        Math.pow(this.pos.y - this.target.y, 2)
    );

    if (distance < this.closeEnoughTarget) {
      proximityMult = distance / this.closeEnoughTarget;
    }

    const towardsTarget = {
      x: this.target.x - this.pos.x,
      y: this.target.y - this.pos.y,
    };

    const magnitude = Math.sqrt(
      towardsTarget.x * towardsTarget.x + towardsTarget.y * towardsTarget.y
    );
    if (magnitude > 0) {
      towardsTarget.x =
        (towardsTarget.x / magnitude) * this.maxSpeed * proximityMult;
      towardsTarget.y =
        (towardsTarget.y / magnitude) * this.maxSpeed * proximityMult;
    }

    const steer = {
      x: towardsTarget.x - this.vel.x,
      y: towardsTarget.y - this.vel.y,
    };

    const steerMagnitude = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
    if (steerMagnitude > 0) {
      steer.x = (steer.x / steerMagnitude) * this.maxForce;
      steer.y = (steer.y / steerMagnitude) * this.maxForce;
    }

    this.acc.x += steer.x;
    this.acc.y += steer.y;

    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.acc.x = 0;
    this.acc.y = 0;
  }

  draw(ctx: CanvasRenderingContext2D, drawAsPoints: boolean) {
    if (this.colorWeight < 1.0) {
      this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0);
    }

    const currentColor = {
      r: Math.round(
        this.startColor.r +
          (this.targetColor.r - this.startColor.r) * this.colorWeight
      ),
      g: Math.round(
        this.startColor.g +
          (this.targetColor.g - this.startColor.g) * this.colorWeight
      ),
      b: Math.round(
        this.startColor.b +
          (this.targetColor.b - this.startColor.b) * this.colorWeight
      ),
    };

    if (drawAsPoints) {
      ctx.fillStyle = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;
      ctx.fillRect(this.pos.x, this.pos.y, 2, 2);
    } else {
      ctx.fillStyle = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`;
      ctx.beginPath();
      ctx.arc(this.pos.x, this.pos.y, this.particleSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  kill(width: number, height: number) {
    if (!this.isKilled) {
      const angle = Math.random() * Math.PI * 2;
      const mag = (width + height) / 2;
      const centerX = width / 2;
      const centerY = height / 2;
      const exitX = centerX + Math.cos(angle) * mag;
      const exitY = centerY + Math.sin(angle) * mag;

      this.target.x = exitX;
      this.target.y = exitY;

      this.startColor = {
        r:
          this.startColor.r +
          (this.targetColor.r - this.startColor.r) * this.colorWeight,
        g:
          this.startColor.g +
          (this.targetColor.g - this.startColor.g) * this.colorWeight,
        b:
          this.startColor.b +
          (this.targetColor.b - this.startColor.b) * this.colorWeight,
      };
      this.targetColor = { r: 0, g: 0, b: 0 };
      this.colorWeight = 0;

      this.isKilled = true;
    }
  }
}

interface ParticleTextEffectProps {
  words?: string[];
}

const DEFAULT_WORDS = ["EYES OF GOD"];

export function ParticleTextEffect({
  words = DEFAULT_WORDS,
}: ParticleTextEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const frameCountRef = useRef(0);
  const wordIndexRef = useRef(0);
  const mouseRef = useRef({
    x: 0,
    y: 0,
    isPressed: false,
    isRightClick: false,
  });

  const pixelSteps = 6;
  const drawAsPoints = true;

  const generateRandomPos = (x: number, y: number, mag: number): Vector2D => {
    const angle = Math.random() * Math.PI * 2;

    const startX = x + Math.cos(angle) * mag;
    const startY = y + Math.sin(angle) * mag;

    return {
      x: startX,
      y: startY,
    };
  };

  const nextWord = (word: string, canvas: HTMLCanvasElement) => {
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    const offscreenCtx = offscreenCanvas.getContext("2d")!;

    const isMobile = window.innerWidth < 640;
    const fontSize = isMobile ? Math.min(60, canvas.width / 8) : Math.min(100, canvas.width / 6);
    offscreenCtx.fillStyle = "white";
    offscreenCtx.font = `bold ${fontSize}px Arial`;
    offscreenCtx.textAlign = "center";
    offscreenCtx.textBaseline = "middle";

    const verticalCenter = isMobile ? canvas.height * 0.4 : canvas.height / 2;
    const wordParts = word.split(" ");
    const lineHeight = fontSize * 1.2;
    if (isMobile && wordParts.length > 1) {
      const startY =
        verticalCenter - ((wordParts.length - 1) * lineHeight) / 2;
      wordParts.forEach((part, i) => {
        offscreenCtx.fillText(part, canvas.width / 2, startY + i * lineHeight);
      });
    } else {
      offscreenCtx.fillText(word, canvas.width / 2, verticalCenter);
    }

    const imageData = offscreenCtx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );
    const pixels = imageData.data;

    const newColor = {
      r: 255,
      g: 255,
      b: 255,
    };

    const particles = particlesRef.current;
    let particleIndex = 0;

    const coordsIndexes: number[] = [];
    for (let i = 0; i < pixels.length; i += pixelSteps * 4) {
      coordsIndexes.push(i);
    }

    for (let i = coordsIndexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [coordsIndexes[i], coordsIndexes[j]] = [
        coordsIndexes[j],
        coordsIndexes[i],
      ];
    }

    for (const coordIndex of coordsIndexes) {
      const pixelIndex = coordIndex;
      const alpha = pixels[pixelIndex + 3];

      if (alpha > 0) {
        const x = (pixelIndex / 4) % canvas.width;
        const y = Math.floor(pixelIndex / 4 / canvas.width);

        let particle: Particle;

        if (particleIndex < particles.length) {
          particle = particles[particleIndex];
          particle.isKilled = false;
          particleIndex++;
        } else {
          particle = new Particle();

          const randomPos = generateRandomPos(
            canvas.width / 2,
            canvas.height / 2,
            (canvas.width + canvas.height) / 2
          );
          particle.pos.x = randomPos.x;
          particle.pos.y = randomPos.y;

          particle.maxSpeed = Math.random() * 6 + 4;
          particle.maxForce = particle.maxSpeed * 0.05;
          particle.particleSize = Math.random() * 6 + 6;
          particle.colorBlendRate = Math.random() * 0.0275 + 0.0025;

          particles.push(particle);
        }

        particle.startColor = {
          r:
            particle.startColor.r +
            (particle.targetColor.r - particle.startColor.r) *
              particle.colorWeight,
          g:
            particle.startColor.g +
            (particle.targetColor.g - particle.startColor.g) *
              particle.colorWeight,
          b:
            particle.startColor.b +
            (particle.targetColor.b - particle.startColor.b) *
              particle.colorWeight,
        };
        particle.targetColor = newColor;
        particle.colorWeight = 0;

        particle.target.x = x;
        particle.target.y = y;
      }
    }

    for (let i = particleIndex; i < particles.length; i++) {
      particles[i].kill(canvas.width, canvas.height);
    }
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    const particles = particlesRef.current;
    ctx.fillStyle = "rgba(0, 0, 20, 1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const numStars = Math.max(20, Math.min(100, (canvas.width * canvas.height) / 100000));
    if (!(window as any)._stars || (window as any)._stars.length !== numStars) {
      (window as any)._stars = Array.from({ length: numStars }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.2 + 0.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.015,
      }));
    }

    const stars = (window as any)._stars as {
      x: number;
      y: number;
      radius: number;
      phase: number;
      speed: number;
    }[];

    for (const star of stars) {
      star.phase += star.speed;
      const alpha = 0.3 + 0.7 * Math.abs(Math.sin(star.phase));
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    }

    const isMobile = window.innerWidth < 640;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const centerX = (rect.width / 2) * scaleX;
    const centerY = (rect.height / 2) * scaleY;

    const blackHoleRadius =
      Math.min(canvas.width, canvas.height) * (isMobile ? 0.22 : 0.25);

    const accretionGradient = ctx.createRadialGradient(
      centerX,
      centerY,
      blackHoleRadius * 0.9,
      centerX,
      centerY,
      blackHoleRadius * 1.8
    );
    accretionGradient.addColorStop(0.0, "rgba(0, 0, 0, 0)");
    accretionGradient.addColorStop(0.4, "rgba(60, 100, 180, 0.08)");
    accretionGradient.addColorStop(0.7, "rgba(100, 150, 255, 0.15)");
    accretionGradient.addColorStop(1.0, "rgba(0, 0, 0, 0)");

    ctx.beginPath();
    ctx.arc(centerX, centerY, blackHoleRadius * 1.8, 0, Math.PI * 2);
    ctx.fillStyle = accretionGradient;
    ctx.fill();

    const outerGlow = ctx.createRadialGradient(
      centerX,
      centerY,
      blackHoleRadius * 1.2,
      centerX,
      centerY,
      blackHoleRadius * 2.5
    );
    outerGlow.addColorStop(0, "rgba(80, 120, 255, 0.07)");
    outerGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.beginPath();
    ctx.arc(centerX, centerY, blackHoleRadius * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = outerGlow;
    ctx.fill();

    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i];
      particle.move();
      particle.draw(ctx, drawAsPoints);

      if (particle.isKilled) {
        if (
          particle.pos.x < 0 ||
          particle.pos.x > canvas.width ||
          particle.pos.y < 0 ||
          particle.pos.y > canvas.height
        ) {
          particles.splice(i, 1);
        }
      }
    }

    if (mouseRef.current.isPressed && mouseRef.current.isRightClick) {
      particles.forEach((particle) => {
        const distance = Math.sqrt(
          Math.pow(particle.pos.x - mouseRef.current.x, 2) +
            Math.pow(particle.pos.y - mouseRef.current.y, 2)
        );
        if (distance < 50) {
          particle.kill(canvas.width, canvas.height);
        }
      });
    }

    frameCountRef.current++;
    if (frameCountRef.current % 240 === 0) {
      wordIndexRef.current = (wordIndexRef.current + 1) % words.length;
      nextWord(words[wordIndexRef.current], canvas);
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };

    resizeCanvas();
    nextWord(words[0], canvas);
    animate();

    const handleMouseDown = (e: MouseEvent) => {
      mouseRef.current.isPressed = true;
      mouseRef.current.isRightClick = e.button === 2;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) * (canvas.width / rect.width);
      mouseRef.current.y = (e.clientY - rect.top) * (canvas.height / rect.height);
    };

    const handleMouseUp = () => {
      mouseRef.current.isPressed = false;
      mouseRef.current.isRightClick = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) * (canvas.width / rect.width);
      mouseRef.current.y = (e.clientY - rect.top) * (canvas.height / rect.height);
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleResize = () => {
      resizeCanvas();
      nextWord(words[wordIndexRef.current], canvas);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("resize", handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("resize", handleResize);
    };
  }, [words]);

  return (
    <div className="w-full h-full absolute inset-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: "black", zIndex: 10 }}
      />
    </div>
  );
}