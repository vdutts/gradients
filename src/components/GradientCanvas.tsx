import { useRef } from "react";
import { Download, Copy } from "lucide-react";
import { toast } from "sonner";
import type { GradientConfig } from "@/pages/Index";

interface GradientCanvasProps {
  gradient: GradientConfig;
}

export const GradientCanvas = ({ gradient }: GradientCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const generateGradientCSS = (): string => {
    const colors = gradient.stops
      .sort((a, b) => a.position - b.position)
      .map(stop => `${stop.color} ${stop.position}%`)
      .join(", ");

    if (gradient.type === "atmospheric" || gradient.type === "mesh") {
      // Create organic, atmospheric gradient using multiple layers
      const baseGradient = `linear-gradient(${gradient.angle}deg, ${colors})`;
      const overlayGradient = `radial-gradient(ellipse at 30% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)`;
      return `${overlayGradient}, ${baseGradient}`;
    }

    switch (gradient.type) {
      case "linear":
        return `linear-gradient(${gradient.angle}deg, ${colors})`;
      case "radial":
        return `radial-gradient(circle, ${colors})`;
      case "conic":
        return `conic-gradient(from ${gradient.angle}deg, ${colors})`;
      default:
        return `linear-gradient(${gradient.angle}deg, ${colors})`;
    }
  };

  const handleCopyCSS = () => {
    const css = `background: ${generateGradientCSS()};\nfilter: blur(${gradient.blur || 0}px);`;
    navigator.clipboard.writeText(css);
    toast.success("CSS copied to clipboard!");
  };

  const handleDownload = async () => {
    if (!canvasRef.current) return;

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1920;
      canvas.height = 1080;
      const ctx = canvas.getContext("2d");
      
      if (!ctx) return;

      // Create gradient based on type
      let grd;
      const sortedStops = [...gradient.stops].sort((a, b) => a.position - b.position);
      
      if (gradient.type === "linear" || gradient.type === "atmospheric") {
        const angleRad = (gradient.angle - 90) * (Math.PI / 180);
        const x1 = canvas.width / 2 + Math.cos(angleRad) * canvas.width;
        const y1 = canvas.height / 2 + Math.sin(angleRad) * canvas.height;
        const x2 = canvas.width / 2 - Math.cos(angleRad) * canvas.width;
        const y2 = canvas.height / 2 - Math.sin(angleRad) * canvas.height;
        grd = ctx.createLinearGradient(x1, y1, x2, y2);
      } else if (gradient.type === "radial") {
        grd = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
        );
      } else {
        // Conic gradient approximation
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const segments = 360;
        
        for (let i = 0; i < segments; i++) {
          const angle = (i + gradient.angle) % 360;
          const nextAngle = ((i + 1) + gradient.angle) % 360;
          const percent = (angle / 360) * 100;
          
          let color = sortedStops[0].color;
          for (let j = 0; j < sortedStops.length - 1; j++) {
            if (percent >= sortedStops[j].position && percent <= sortedStops[j + 1].position) {
              const range = sortedStops[j + 1].position - sortedStops[j].position;
              const localPercent = (percent - sortedStops[j].position) / range;
              color = interpolateColor(sortedStops[j].color, sortedStops[j + 1].color, localPercent);
              break;
            }
          }
          
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          const rad1 = angle * (Math.PI / 180);
          const rad2 = nextAngle * (Math.PI / 180);
          ctx.arc(centerX, centerY, Math.max(canvas.width, canvas.height), rad1, rad2);
          ctx.closePath();
          ctx.fill();
        }
        
        const link = document.createElement("a");
        link.download = "gradient.png";
        link.href = canvas.toDataURL();
        link.click();
        toast.success("Gradient downloaded!");
        return;
      }

      if (grd) {
        sortedStops.forEach(stop => {
          grd.addColorStop(stop.position / 100, stop.color);
        });

        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const link = document.createElement("a");
      link.download = "gradient.png";
      link.href = canvas.toDataURL();
      link.click();
      toast.success("Gradient downloaded!");
    } catch (error) {
      toast.error("Failed to download gradient");
    }
  };

  const interpolateColor = (color1: string, color2: string, factor: number): string => {
    const c1 = hexToRgb(color1);
    const c2 = hexToRgb(color2);
    if (!c1 || !c2) return color1;
    
    const r = Math.round(c1.r + (c2.r - c1.r) * factor);
    const g = Math.round(c1.g + (c2.g - c1.g) * factor);
    const b = Math.round(c1.b + (c2.b - c1.b) * factor);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const canvasStyle: React.CSSProperties = {
    background: generateGradientCSS(),
    filter: `blur(${(gradient.blur || 0) / 4}px)`,
    transition: "all 0.3s ease-in-out",
  };

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Full-screen gradient */}
      <div
        ref={canvasRef}
        className="flex-1 relative overflow-hidden"
        style={canvasStyle}
      >
        {gradient.noise && (
          <div 
            className="absolute inset-0 opacity-20 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        )}
      </div>
      
      {/* Glassy action buttons - aligned to right */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        <button
          onClick={handleCopyCSS}
          className="glass-dark rounded-full h-14 w-14 flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
          aria-label="Copy CSS"
        >
          <Copy className="h-5 w-5 text-white" />
        </button>
        <button
          onClick={handleDownload}
          className="glass-dark rounded-full h-14 w-14 flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
          aria-label="Download gradient"
        >
          <Download className="h-5 w-5 text-white" />
        </button>
      </div>
    </div>
  );
};
