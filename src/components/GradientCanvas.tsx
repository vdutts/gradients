import { useRef } from "react";
import { Download, Copy } from "lucide-react";
import { Button } from "./ui/button";
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

    switch (gradient.type) {
      case "linear":
        return `linear-gradient(${gradient.angle}deg, ${colors})`;
      case "radial":
        return `radial-gradient(circle, ${colors})`;
      case "conic":
        return `conic-gradient(from ${gradient.angle}deg, ${colors})`;
    }
  };

  const handleCopyCSS = () => {
    const css = `background: ${generateGradientCSS()};`;
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
      
      if (gradient.type === "linear") {
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
        // Conic gradient - approximate with multiple linear gradients
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

      sortedStops.forEach(stop => {
        grd.addColorStop(stop.position / 100, stop.color);
      });

      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const link = document.createElement("a");
      link.download = "gradient.png";
      link.href = canvas.toDataURL();
      link.click();
      toast.success("Gradient downloaded!");
    } catch (error) {
      toast.error("Failed to download gradient");
    }
  };

  // Helper function to interpolate between colors
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

  return (
    <div className="h-full flex flex-col gap-4">
      <div
        ref={canvasRef}
        className="flex-1 rounded-xl shadow-lg transition-all duration-300 min-h-[300px]"
        style={{ background: generateGradientCSS() }}
      />
      
      <div className="flex gap-2">
        <Button
          onClick={handleCopyCSS}
          variant="outline"
          className="flex-1"
          aria-label="Copy CSS"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copy CSS
        </Button>
        <Button
          onClick={handleDownload}
          className="flex-1"
          aria-label="Download gradient"
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </div>
    </div>
  );
};
