import { Card } from "./ui/card";
import { Label } from "./ui/label";
import type { GradientConfig } from "@/pages/Index";

interface PresetSelectorProps {
  onSelect: (gradient: GradientConfig) => void;
}

const presets: GradientConfig[] = [
  {
    type: "linear",
    angle: 135,
    stops: [
      { color: "#3b82f6", position: 0 },
      { color: "#8b5cf6", position: 100 },
    ],
  },
  {
    type: "linear",
    angle: 45,
    stops: [
      { color: "#ec4899", position: 0 },
      { color: "#f59e0b", position: 100 },
    ],
  },
  {
    type: "linear",
    angle: 180,
    stops: [
      { color: "#10b981", position: 0 },
      { color: "#3b82f6", position: 50 },
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
    type: "conic",
    angle: 0,
    stops: [
      { color: "#ec4899", position: 0 },
      { color: "#8b5cf6", position: 33 },
      { color: "#3b82f6", position: 66 },
      { color: "#ec4899", position: 100 },
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

    switch (preset.type) {
      case "linear":
        return `linear-gradient(${preset.angle}deg, ${colors})`;
      case "radial":
        return `radial-gradient(circle, ${colors})`;
      case "conic":
        return `conic-gradient(from ${preset.angle}deg, ${colors})`;
    }
  };

  return (
    <Card className="p-6 space-y-3">
      <Label>Presets</Label>
      <div className="grid grid-cols-3 gap-2">
        {presets.map((preset, index) => (
          <button
            key={index}
            onClick={() => onSelect(preset)}
            className="aspect-square rounded-lg border-2 border-transparent hover:border-primary transition-all cursor-pointer active:scale-95"
            style={{ background: generatePreviewGradient(preset) }}
            aria-label={`Preset gradient ${index + 1}`}
          />
        ))}
      </div>
    </Card>
  );
};
