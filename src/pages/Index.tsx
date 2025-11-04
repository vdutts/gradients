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
          <Sidebar side="right" className="border-l-0 w-[360px]" collapsible="offcanvas" style={{ background: 'rgba(255, 255, 255, 0.06)', backdropFilter: 'blur(24px)', borderLeft: '1px solid rgba(255, 255, 255, 0.10)' }}>
            <SidebarContent className="p-8 space-y-8 overflow-y-auto bg-transparent">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Controls</h2>
                <SidebarTrigger className="rounded-full h-9 w-9 flex items-center justify-center hover:bg-white/10 transition-all bg-white/5">
                  <ChevronRight className="h-4 w-4 text-white/70" />
                </SidebarTrigger>
              </div>
              <PresetSelector onSelect={setGradient} />
              <GradientControls gradient={gradient} onChange={setGradient} />
            </SidebarContent>
          </Sidebar>
          
          {/* Floating sidebar trigger when closed */}
          <SidebarTrigger 
            className="fixed top-1/2 right-6 -translate-y-1/2 z-40 rounded-full h-12 w-12 flex items-center justify-center hover:scale-105 transition-all data-[state=open]:hidden"
            style={{ background: 'rgba(255, 255, 255, 0.08)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
          >
            <ChevronLeft className="h-4 w-4 text-white/90" />
          </SidebarTrigger>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
