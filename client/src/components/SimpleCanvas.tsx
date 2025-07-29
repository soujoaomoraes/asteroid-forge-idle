import React, { useEffect, useRef } from 'react';

export function SimpleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameCount = 0;
    let lastTime = Date.now();

    const render = () => {
      try {
        frameCount++;
        const currentTime = Date.now();
        const fps = Math.round(1000 / (currentTime - lastTime));
        lastTime = currentTime;

        // Limpar canvas
        ctx.clearRect(0, 0, 800, 600);

        // Desenhar fundo
        ctx.fillStyle = '#000814';
        ctx.fillRect(0, 0, 800, 600);

        // Desenhar círculo animado
        const x = 400 + Math.sin(frameCount * 0.02) * 200;
        const y = 300 + Math.cos(frameCount * 0.03) * 150;
        
        ctx.fillStyle = '#00ff00';
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();

        // Desenhar texto com FPS
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.fillText(`Frame: ${frameCount}`, 10, 30);
        ctx.fillText(`FPS: ${fps}`, 10, 60);
        ctx.fillText(`Time: ${new Date().toLocaleTimeString()}`, 10, 90);

        // Continuar animação
        requestAnimationFrame(render);
      } catch (error) {
        console.error('❌ Error in SimpleCanvas render:', error);
      }
    };

    render();

    return () => {
      console.log('🎨 SimpleCanvas cleanup');
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <h1 className="text-white mb-4">🧪 Simple Canvas Test</h1>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="border border-white"
      />
      <p className="text-white mt-4">Se este canvas parar de animar, há um problema no sistema de renderização</p>
    </div>
  );
} 