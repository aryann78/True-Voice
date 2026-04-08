
import React, { useEffect, useRef } from 'react';

interface SpectrogramViewProps {
  buffer: AudioBuffer;
  isPlaying?: boolean;
}

const SpectrogramView: React.FC<SpectrogramViewProps> = ({ buffer, isPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const data = buffer.getChannelData(0);
      const step = Math.ceil(data.length / width);
      const midY = height / 2;
      
      const time = isPlaying ? Date.now() * 0.002 : 0;

      ctx.strokeStyle = isPlaying ? '#b68a73' : 'rgba(45, 27, 16, 0.4)';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(0, midY);

      for (let i = 0; i < width; i++) {
        let max = 0;
        for (let j = 0; j < step; j++) {
          const val = data[i * step + j] || 0;
          if (Math.abs(val) > Math.abs(max)) max = val;
        }

        let h = max * (height * 0.4);
        
        if (isPlaying) {
          // Add subtle dynamic jitter that feels "forensic"
          const jitter = Math.sin(time * 2 + i * 0.05) * 5;
          h += jitter * Math.abs(max);
        }

        ctx.lineTo(i, midY - h);
      }
      ctx.stroke();

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    draw();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [buffer, isPlaying]);

  return (
    <canvas 
      ref={canvasRef} 
      width={1200} 
      height={300} 
      className="w-full h-32 opacity-80"
    />
  );
};

export default SpectrogramView;
