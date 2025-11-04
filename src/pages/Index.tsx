import { useState } from "react";
import { GradientCanvas } from "@/components/GradientCanvas";
import { GradientControls } from "@/components/GradientControls";
import { Header } from "@/components/Header";
import { PresetSelector } from "@/components/PresetSelector";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  blur: 50,
  noise: 20,
  layers: 3,
  stops: [
    { color: "#c7b8ea", position: 0, x: 10, y: 10 },
    { color: "#e8c5e5", position: 50, x: 50, y: 30 },
    { color: "#d4b5e3", position: 100, x: 90, y: 90 },
  ],
};

const Index = () => {
  const [gradient, setGradient] = useState<GradientConfig>(defaultGradient);

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full">
        <Header />
        
        <div className="flex-1 flex w-full relative pt-16">
          {/* Full-screen gradient canvas */}
          <main className="flex-1 relative">
            <GradientCanvas gradient={gradient} />
          </main>

          {/* Collapsible sidebar with controls */}
          <Sidebar side="right" className="border-l-0 glass-dark border-l border-white/5" collapsible="offcanvas">
            <SidebarContent className="p-6 space-y-6 overflow-y-auto bg-transparent">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Controls</h2>
                <SidebarTrigger className="glass-dark rounded-full h-10 w-10 flex items-center justify-center hover:scale-110 transition-transform">
                  <ChevronRight className="h-5 w-5 text-white" />
                </SidebarTrigger>
              </div>
              <PresetSelector onSelect={setGradient} />
              <GradientControls gradient={gradient} onChange={setGradient} />
            </SidebarContent>
          </Sidebar>
          
          {/* Floating sidebar trigger when closed */}
          <SidebarTrigger className="fixed top-1/2 right-4 -translate-y-1/2 z-40 glass-dark rounded-full h-12 w-12 flex items-center justify-center hover:scale-110 transition-transform shadow-lg data-[state=open]:hidden">
            <ChevronLeft className="h-5 w-5 text-white" />
          </SidebarTrigger>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
