import { useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles, Lock } from "lucide-react";
import { REALMS } from "@/lib/realms";
import { CarouselCanvas } from "./CarouselCanvas";
import { Link, useNavigate } from "@tanstack/react-router";

export function WorldGateways() {
  const displayRealms = REALMS.filter((r) => r.id !== "hub");
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const activeRealm = displayRealms[activeIndex];

  const handleNext = () => setActiveIndex((prev) => Math.min(prev + 1, displayRealms.length - 1));
  const handlePrev = () => setActiveIndex((prev) => Math.max(prev - 1, 0));

  // Safe navigation fallback that works with your current routing profile
  const handleEnterRealm = () => {
    // If your actual socratic workspace route is called something else (e.g., "/engine"),
    // change the target destination here. For now, we fall back to a dynamic native window search parameter
    // or routing to the known gateways path safely.
    window.location.href = `/explore?realm=${activeRealm.id}`;
  };

  return (
    <div className="relative h-screen w-full overflow-hidden text-white selection:bg-white/10">
      {/* 1. The 3D Spatial Track */}
      <CarouselCanvas key={`carousel-viewport-id-${activeIndex}`} activeIndex={activeIndex} />
      {/* 2. The UI Layer */}
      <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-16 z-10 pointer-events-none">
        {/* Header */}
        <header className="flex items-center justify-between pointer-events-auto">
          <div className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">
            Lumira Realms
          </div>
          <Link
            to="/skill-passport"
            className="text-xs font-medium uppercase tracking-widest hover:text-white/70 transition-colors pointer-events-auto"
          >
            View Constellation
          </Link>
        </header>

        {/* Main Interface */}
        <main className="flex w-full items-end justify-between">
          {/* Realm Typography & Details */}
          <div className="max-w-xl pointer-events-auto transition-all duration-700">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{activeRealm.emoji}</span>
              {!activeRealm.unlocked && (
                <span className="flex items-center gap-1 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-[10px] uppercase tracking-widest text-white/50 backdrop-blur-md">
                  <Lock className="h-3 w-3" /> Locked
                </span>
              )}
            </div>

            <h1
              className="font-display text-5xl md:text-7xl font-semibold tracking-tight text-transparent bg-clip-text select-none"
              style={{ backgroundImage: `linear-gradient(to right, #FFF, ${activeRealm.accent})` }}
            >
              {activeRealm.name}
            </h1>

            <p className="mt-4 text-lg md:text-xl font-display italic text-white/60 select-none">
              "{activeRealm.tagline}"
            </p>
            <p className="mt-2 text-sm text-white/40 max-w-md select-none">
              {activeRealm.description}
            </p>

            {/* Action Button */}
            <div className="mt-8">
              {activeRealm.unlocked ? (
                <button
                  onClick={handleEnterRealm}
                  className="group flex w-fit items-center gap-3 rounded-full px-8 py-4 transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: activeRealm.accent,
                    color: "#000",
                    boxShadow: `0 0 30px ${activeRealm.accent}40`,
                  }}
                >
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-bold uppercase tracking-widest">Enter Realm</span>
                </button>
              ) : (
                <div className="text-xs uppercase tracking-widest text-white/30 border-l border-white/10 pl-4 select-none">
                  Prerequisite: {activeRealm.prerequisite}
                </div>
              )}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex gap-4 pointer-events-auto">
            <button
              onClick={handlePrev}
              disabled={activeIndex === 0}
              className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-xl transition-all hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-black/40"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={activeIndex === displayRealms.length - 1}
              className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-black/40 backdrop-blur-xl transition-all hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-black/40"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
