import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import type { GradientConfig } from "@/pages/Index";

interface PresetSelectorProps {
  onSelect: (gradient: GradientConfig) => void;
}

const presets: GradientConfig[] = [
  // Atmospheric presets matching the reference image style
  {
    type: "atmospheric",
    angle: 135,
    blur: 40,
    noise: 15,
    stops: [
      { color: "#2563eb", position: 0, x: 10, y: 10 },
      { color: "#3b82f6", position: 30, x: 40, y: 20 },
      { color: "#8b5cf6", position: 70, x: 60, y: 80 },
      { color: "#a855f7", position: 100, x: 90, y: 90 },
    ],
  },
  {
    type: "atmospheric",
    angle: 90,
    blur: 60,
    noise: 25,
    stops: [
      { color: "#1e40af", position: 0, x: 0, y: 0 },
      { color: "#6366f1", position: 40, x: 30, y: 60 },
      { color: "#ec4899", position: 80, x: 70, y: 30 },
      { color: "#f59e0b", position: 100, x: 100, y: 100 },
    ],
  },
  {
    type: "atmospheric",
    angle: 45,
    blur: 50,
    noise: 20,
    stops: [
      { color: "#0ea5e9", position: 0, x: 20, y: 80 },
      { color: "#3b82f6", position: 35, x: 50, y: 50 },
      { color: "#8b5cf6", position: 65, x: 80, y: 20 },
      { color: "#ec4899", position: 100, x: 100, y: 0 },
    ],
  },
  // Some geometric ones for variety
  {
    type: "linear",
    angle: 135,
    stops: [
      { color: "#3b82f6", position: 0 },
      { color: "#8b5cf6", position: 100 },
    ],
  },
  {
    type: "radial",
    angle: 0,
    stops: [
      { color: "#f59e0b", position: 0 },
      { color: "#ef4444", position: 100 },
    ],
  },
  {
    type: "linear",
    angle: 90,
    stops: [
      { color: "#0ea5e9", position: 0 },
      { color: "#6366f1", position: 100 },
    ],
  },
];

export const PresetSelector = ({ onSelect }: PresetSelectorProps) => {
  const generatePreviewGradient = (preset: GradientConfig): string => {
    const colors = preset.stops
      .sort((a, b) => a.position - b.position)
      .map(stop => `${stop.color} ${stop.position}%`)
      .join(", ");

    if (preset.type === "atmospheric" || preset.type === "mesh") {
      const baseGradient = `linear-gradient(${preset.angle}deg, ${colors})`;
      const overlayGradient = `radial-gradient(ellipse at 30% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)`;
      return `${overlayGradient}, ${baseGradient}`;
    }

    switch (preset.type) {
      case "linear":
        return `linear-gradient(${preset.angle}deg, ${colors})`;
      case "radial":
        return `radial-gradient(circle, ${colors})`;
      case "conic":
        return `conic-gradient(from ${preset.angle}deg, ${colors})`;
      default:
        return `linear-gradient(${preset.angle}deg, ${colors})`;
    }
  };

  return (
    <Card className="p-4 space-y-3">
      <Label>Presets</Label>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-2">
          {presets.map((preset, index) => (
            <button
              key={index}
              onClick={() => onSelect(preset)}
              className="h-24 w-24 flex-shrink-0 rounded-lg border-2 border-transparent hover:border-primary transition-all cursor-pointer active:scale-95 relative overflow-hidden"
              style={{ 
                background: generatePreviewGradient(preset),
                filter: `blur(${(preset.blur || 0) / 8}px)`
              }}
              aria-label={`Preset gradient ${index + 1}`}
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </Card>
  );
};
