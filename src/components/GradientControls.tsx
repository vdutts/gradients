import { Card } from "./ui/card";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import type { GradientConfig } from "@/pages/Index";

interface GradientControlsProps {
  gradient: GradientConfig;
  onChange: (gradient: GradientConfig) => void;
}

export const GradientControls = ({ gradient, onChange }: GradientControlsProps) => {
  const updateType = (type: "linear" | "radial" | "conic" | "mesh" | "atmospheric") => {
    onChange({ ...gradient, type });
  };

  const updateAngle = (angle: number) => {
    onChange({ ...gradient, angle });
  };

  const updateStop = (index: number, color?: string, position?: number, x?: number, y?: number) => {
    const newStops = [...gradient.stops];
    if (color !== undefined) newStops[index].color = color;
    if (position !== undefined) newStops[index].position = position;
    if (x !== undefined) newStops[index].x = x;
    if (y !== undefined) newStops[index].y = y;
    onChange({ ...gradient, stops: newStops });
  };

  const addStop = () => {
    const newPosition = gradient.stops.length > 0 
      ? Math.min(100, Math.max(...gradient.stops.map(s => s.position)) + 10)
      : 50;
    onChange({
      ...gradient,
      stops: [...gradient.stops, { 
        color: "#6366f1", 
        position: newPosition,
        x: Math.random() * 100,
        y: Math.random() * 100
      }],
    });
  };

  const removeStop = (index: number) => {
    if (gradient.stops.length <= 2) return;
    onChange({
      ...gradient,
      stops: gradient.stops.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* Gradient Type */}
      <div className="space-y-3">
        <Label className="text-white text-xs uppercase tracking-wider opacity-70">Type</Label>
        <Tabs value={gradient.type} onValueChange={(v) => updateType(v as any)}>
          <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/10">
            <TabsTrigger value="atmospheric" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60">Organic</TabsTrigger>
            <TabsTrigger value="linear" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60">Linear</TabsTrigger>
            <TabsTrigger value="radial" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-white/60">Radial</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Angle Control */}
      {(gradient.type === "linear" || gradient.type === "conic" || gradient.type === "atmospheric") && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-white text-xs uppercase tracking-wider opacity-70">Angle</Label>
            <span className="text-sm text-white font-medium">{gradient.angle}°</span>
          </div>
          <Slider
            value={[gradient.angle]}
            onValueChange={([value]) => updateAngle(value)}
            min={0}
            max={360}
            step={1}
            className="py-2"
          />
        </div>
      )}

      {/* Atmospheric Effects */}
      {(gradient.type === "atmospheric" || gradient.type === "mesh") && (
        <>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-white text-xs uppercase tracking-wider opacity-70">Blur</Label>
              <span className="text-sm text-white font-medium">{gradient.blur || 0}px</span>
            </div>
            <Slider
              value={[gradient.blur || 0]}
              onValueChange={([value]) => onChange({ ...gradient, blur: value })}
              min={0}
              max={100}
              step={1}
              className="py-2"
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-white text-xs uppercase tracking-wider opacity-70">Noise</Label>
              <span className="text-sm text-white font-medium">{gradient.noise || 0}%</span>
            </div>
            <Slider
              value={[gradient.noise || 0]}
              onValueChange={([value]) => onChange({ ...gradient, noise: value })}
              min={0}
              max={100}
              step={1}
              className="py-2"
            />
          </div>
        </>
      )}

      {/* Color Stops */}
      <div className="space-y-4 pt-2">
        <div className="flex justify-between items-center">
          <Label className="text-white text-xs uppercase tracking-wider opacity-70">Colors</Label>
          <Button
            size="sm"
            variant="ghost"
            onClick={addStop}
            aria-label="Add color stop"
            className="h-8 text-xs text-white/60 hover:text-white hover:bg-white/5"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        </div>

        <ScrollArea className="h-[300px] pr-2">
          <div className="space-y-5">
            {gradient.stops.map((stop, index) => (
              <div key={index} className="space-y-3">
                <div className="flex gap-2 items-center">
                  <div className="flex-1 flex gap-2">
                    <input
                      type="color"
                      value={stop.color}
                      onChange={(e) => updateStop(index, e.target.value)}
                      className="h-10 w-12 rounded-lg border border-white/20 cursor-pointer bg-transparent"
                      aria-label={`Color ${index + 1}`}
                    />
                    <input
                      type="text"
                      value={stop.color}
                      onChange={(e) => updateStop(index, e.target.value)}
                      className="flex-1 h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white placeholder:text-white/40"
                      aria-label={`Color hex ${index + 1}`}
                    />
                  </div>
                  {gradient.stops.length > 2 && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeStop(index)}
                      aria-label="Remove color stop"
                      className="h-10 w-10 text-white/40 hover:text-white hover:bg-white/5"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/50">Position</span>
                    <span className="text-white/90">{stop.position}%</span>
                  </div>
                  <Slider
                    value={[stop.position]}
                    onValueChange={([value]) => updateStop(index, undefined, value)}
                    min={0}
                    max={100}
                    step={1}
                    className="py-1"
                  />
                </div>
                
                {/* Mesh positioning for atmospheric gradients */}
                {(gradient.type === "atmospheric" || gradient.type === "mesh") && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/50">X</span>
                        <span className="text-white/90">{Math.round(stop.x || 0)}%</span>
                      </div>
                      <Slider
                        value={[stop.x || 0]}
                        onValueChange={([value]) => updateStop(index, undefined, undefined, value)}
                        min={0}
                        max={100}
                        step={1}
                        className="py-1"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/50">Y</span>
                        <span className="text-white/90">{Math.round(stop.y || 0)}%</span>
                      </div>
                      <Slider
                        value={[stop.y || 0]}
                        onValueChange={([value]) => updateStop(index, undefined, undefined, undefined, value)}
                        min={0}
                        max={100}
                        step={1}
                        className="py-1"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
