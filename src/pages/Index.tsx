import { useState } from "react";
import { GradientCanvas } from "@/components/GradientCanvas";
import { GradientControls } from "@/components/GradientControls";
import { Header } from "@/components/Header";
import { PresetSelector } from "@/components/PresetSelector";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { PanelRightOpen } from "lucide-react";

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

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex flex-col w-full">
        <Header />
        
        <div className="flex-1 flex w-full relative">
          {/* Full-screen gradient canvas */}
          <main className="flex-1 relative">
            <GradientCanvas gradient={gradient} />
            
            {/* Floating sidebar trigger */}
            <SidebarTrigger className="fixed top-1/2 right-4 -translate-y-1/2 z-50 glass-dark rounded-full h-12 w-12 flex items-center justify-center hover:scale-110 transition-transform shadow-lg">
              <PanelRightOpen className="h-5 w-5 text-white" />
            </SidebarTrigger>
          </main>

          {/* Collapsible sidebar with controls */}
          <Sidebar side="right" className="border-l-0" collapsible="offcanvas">
            <SidebarContent className="p-6 space-y-6 overflow-y-auto">
              <div>
                <h2 className="text-xl font-bold mb-1">Controls</h2>
                <p className="text-sm text-muted-foreground">
                  Customize your gradient
                </p>
              </div>
              <PresetSelector onSelect={setGradient} />
              <GradientControls gradient={gradient} onChange={setGradient} />
            </SidebarContent>
          </Sidebar>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
