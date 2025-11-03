import { useState } from "react";
import { GradientCanvas } from "@/components/GradientCanvas";
import { GradientControls } from "@/components/GradientControls";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PresetSelector } from "@/components/PresetSelector";

export interface ColorStop {
  color: string;
  position: number;
}

export interface GradientConfig {
  type: "linear" | "radial" | "conic";
  angle: number;
  stops: ColorStop[];
}

const defaultGradient: GradientConfig = {
  type: "linear",
  angle: 135,
  stops: [
    { color: "#3b82f6", position: 0 },
    { color: "#8b5cf6", position: 100 },
  ],
};

const Index = () => {
  const [gradient, setGradient] = useState<GradientConfig>(defaultGradient);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
        <div className="grid lg:grid-cols-[1fr_400px] gap-6 h-[calc(100vh-200px)]">
          {/* Gradient Preview */}
          <div className="order-2 lg:order-1">
            <GradientCanvas gradient={gradient} />
          </div>

          {/* Controls */}
          <div className="order-1 lg:order-2 flex flex-col gap-6 overflow-y-auto">
            <PresetSelector onSelect={setGradient} />
            <GradientControls gradient={gradient} onChange={setGradient} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
