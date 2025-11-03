import { useState } from "react";
import { GradientCanvas } from "@/components/GradientCanvas";
import { GradientControls } from "@/components/GradientControls";
import { Header } from "@/components/Header";
import { PresetSelector } from "@/components/PresetSelector";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export interface ColorStop {
  color: string;
  position: number;
  x?: number; // For mesh gradients
  y?: number; // For mesh gradients
}

export interface GradientConfig {
  type: "linear" | "radial" | "conic" | "mesh" | "atmospheric";
  angle: number;
  stops: ColorStop[];
  blur?: number;
  noise?: number;
  layers?: number;
}

const defaultGradient: GradientConfig = {
  type: "atmospheric",
  angle: 135,
  blur: 60,
  noise: 20,
  layers: 3,
  stops: [
    { color: "#3b82f6", position: 0, x: 0, y: 0 },
    { color: "#8b5cf6", position: 50, x: 50, y: 30 },
    { color: "#a855f7", position: 100, x: 100, y: 100 },
  ],
};

const Index = () => {
  const [gradient, setGradient] = useState<GradientConfig>(defaultGradient);
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Full-screen gradient canvas */}
      <main className="flex-1 relative">
        <GradientCanvas gradient={gradient} />
        
        {/* Floating controls button - mobile & desktop */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="fixed bottom-6 right-6 z-50 rounded-full shadow-2xl h-14 w-14 md:h-16 md:w-16"
              aria-label="Open controls"
            >
              <Settings className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          
          <SheetContent 
            side="right" 
            className="w-full sm:max-w-lg overflow-y-auto p-0"
          >
            <div className="p-6 space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Gradient Controls</h2>
                <p className="text-sm text-muted-foreground">
                  Customize your atmospheric gradient
                </p>
              </div>
              
              <PresetSelector onSelect={setGradient} />
              <GradientControls gradient={gradient} onChange={setGradient} />
            </div>
          </SheetContent>
        </Sheet>
      </main>
    </div>
  );
};

export default Index;
