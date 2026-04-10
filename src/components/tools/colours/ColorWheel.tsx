import { useRef, useCallback, useEffect, useState } from 'react';
import { hexToRgb, rgbToHsl, hslToRgb, rgbToHex } from '@/lib/colorUtils';

interface Props {
  color: string;
  onChange: (hex: string) => void;
}

export default function ColorWheel({ color, onChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dragging, setDragging] = useState(false);
  const size = 280;
  const radius = size / 2 - 10;

  // Draw the wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const cx = size / 2, cy = size / 2;

    // Clear
    ctx.clearRect(0, 0, size, size);

    // Draw hue ring
    for (let angle = 0; angle < 360; angle += 1) {
      const startAngle = ((angle - 1) * Math.PI) / 180;
      const endAngle = ((angle + 1) * Math.PI) / 180;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, startAngle, endAngle);
      ctx.arc(cx, cy, radius - 30, endAngle, startAngle, true);
      ctx.closePath();
      ctx.fillStyle = `hsl(${angle}, 100%, 50%)`;
      ctx.fill();
    }

    // Draw center saturation/lightness square
    const sqSize = (radius - 30) * 1.2;
    const sqHalf = sqSize / 2;
    const [, , ] = rgbToHsl(...hexToRgb(color));
    const [h] = rgbToHsl(...hexToRgb(color));

    for (let x = 0; x < sqSize; x++) {
      for (let y = 0; y < sqSize; y++) {
        const s = (x / sqSize) * 100;
        const l = 100 - (y / sqSize) * 100;
        const [r, g, b] = hslToRgb(h, s, l);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.fillRect(cx - sqHalf + x, cy - sqHalf + y, 1, 1);
      }
    }

    // Draw indicator on hue ring
    const hRad = (h * Math.PI) / 180;
    const ix = cx + Math.cos(hRad) * (radius - 15);
    const iy = cy + Math.sin(hRad) * (radius - 15);
    ctx.beginPath();
    ctx.arc(ix, iy, 8, 0, Math.PI * 2);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fill();
  }, [color, size, radius]);

  const pickColor = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = size / 2, cy = size / 2;
      const dx = x - cx, dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const [, currentS, currentL] = rgbToHsl(...hexToRgb(color));

      if (dist > radius - 30 && dist < radius + 5) {
        // Hue ring
        let angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        if (angle < 0) angle += 360;
        const [r, g, b] = hslToRgb(Math.round(angle), currentS, currentL);
        onChange(rgbToHex(r, g, b));
      } else {
        // Center square
        const sqSize = (radius - 30) * 1.2;
        const sqHalf = sqSize / 2;
        const sx = x - (cx - sqHalf);
        const sy = y - (cy - sqHalf);
        if (sx >= 0 && sx <= sqSize && sy >= 0 && sy <= sqSize) {
          const [h] = rgbToHsl(...hexToRgb(color));
          const s = Math.round((sx / sqSize) * 100);
          const l = Math.round(100 - (sy / sqSize) * 100);
          const [r, g, b] = hslToRgb(h, s, l);
          onChange(rgbToHex(r, g, b));
        }
      }
    },
    [color, onChange, radius, size]
  );

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (dragging) pickColor(e);
    };
    const handleUp = () => setDragging(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [dragging, pickColor]);

  return (
    <div className="bg-card rounded-lg border border-border p-4 flex flex-col items-center">
      <h2 className="font-display text-lg font-semibold mb-3 text-foreground self-start">Color Wheel</h2>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="cursor-crosshair rounded-lg"
        onMouseDown={(e) => {
          setDragging(true);
          pickColor(e);
        }}
      />
      <div className="mt-3 flex items-center gap-3 w-full">
        <div
          className="w-10 h-10 rounded-md border border-border shadow-sm flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-10 rounded cursor-pointer bg-transparent"
        />
      </div>
    </div>
  );
}
