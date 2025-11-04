import { useState } from "react";
import { Button } from "./ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
import { Sparkles } from "lucide-react";
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
  const [open, setOpen] = useState(false);

  const generatePreviewGradient = (preset: GradientConfig): string => {
    const colors = preset.stops
      .sort((a, b) => a.position - b.position)
      .map(stop => `${stop.color} ${stop.position}%`)
      .join(", ");

    if (preset.type === "atmospheric" || preset.type === "mesh") {
      const baseGradient = `linear-gradient(${preset.angle}deg, ${colors})`;
      const overlayGradient = `radial-gradient(ellipse at 30% 20%, rgba(199, 184, 234, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(232, 197, 229, 0.3) 0%, transparent 50%)`;
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

  const handleSelect = (preset: GradientConfig) => {
    onSelect(preset);
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-full glass-dark border-white/10 text-white hover:bg-white/10">
          <Sparkles className="h-4 w-4 mr-2" />
          Presets
        </Button>
      </DrawerTrigger>
      <DrawerContent className="glass-dark border-white/10">
        <DrawerHeader>
          <DrawerTitle className="text-white">Choose a Preset</DrawerTitle>
          <DrawerDescription className="text-white/70">
            Select a gradient style to get started
          </DrawerDescription>
        </DrawerHeader>
        <div className="p-6 grid grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
          {presets.map((preset, index) => (
            <button
              key={index}
              onClick={() => handleSelect(preset)}
              className="h-32 rounded-2xl border-2 border-white/10 hover:border-white/30 transition-all cursor-pointer active:scale-95 relative overflow-hidden"
              style={{ 
                background: generatePreviewGradient(preset),
                filter: `blur(${(preset.blur || 0) / 8}px)`
              }}
              aria-label={`Preset gradient ${index + 1}`}
            />
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
