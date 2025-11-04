import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import type { GradientConfig } from "@/pages/Index";

interface PresetSelectorProps {
  onSelect: (gradient: GradientConfig) => void;
}

// Using consistent pastel colors to show shape/configuration differences, not color differences
const PRESET_COLORS = ["#c7b8ea", "#e8c5e5", "#d4b5e3", "#b5d4e1"];

const presets: GradientConfig[] = [
  // Atmospheric presets - focusing on shape/pattern variations
  {
    type: "atmospheric",
    angle: 135,
    blur: 40,
    noise: 15,
    stops: [
      { color: PRESET_COLORS[0], position: 0, x: 10, y: 10 },
      { color: PRESET_COLORS[1], position: 30, x: 40, y: 20 },
      { color: PRESET_COLORS[2], position: 70, x: 60, y: 80 },
      { color: PRESET_COLORS[3], position: 100, x: 90, y: 90 },
    ],
  },
  {
    type: "atmospheric",
    angle: 90,
    blur: 60,
    noise: 25,
    stops: [
      { color: PRESET_COLORS[0], position: 0, x: 0, y: 0 },
      { color: PRESET_COLORS[1], position: 40, x: 30, y: 60 },
      { color: PRESET_COLORS[2], position: 80, x: 70, y: 30 },
      { color: PRESET_COLORS[3], position: 100, x: 100, y: 100 },
    ],
  },
  {
    type: "atmospheric",
    angle: 45,
    blur: 50,
    noise: 20,
    stops: [
      { color: PRESET_COLORS[0], position: 0, x: 20, y: 80 },
      { color: PRESET_COLORS[1], position: 35, x: 50, y: 50 },
      { color: PRESET_COLORS[2], position: 65, x: 80, y: 20 },
      { color: PRESET_COLORS[3], position: 100, x: 100, y: 0 },
    ],
  },
  // Geometric presets showing different shapes
  {
    type: "linear",
    angle: 135,
    stops: [
      { color: PRESET_COLORS[0], position: 0 },
      { color: PRESET_COLORS[3], position: 100 },
    ],
  },
  {
    type: "radial",
    angle: 0,
    stops: [
      { color: PRESET_COLORS[1], position: 0 },
      { color: PRESET_COLORS[2], position: 100 },
    ],
  },
  {
    type: "linear",
    angle: 90,
    stops: [
      { color: PRESET_COLORS[0], position: 0 },
      { color: PRESET_COLORS[2], position: 100 },
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
