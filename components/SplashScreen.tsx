"use client";

import { useEffect, useState } from "react";

export default function SplashScreen({
  onFinish,
}: {
  onFinish: () => void;
}) {
  const [stage, setStage] = useState<"logo" | "text">("logo");

  useEffect(() => {
    const t1 = setTimeout(() => setStage("text"), 1200);
    const t2 = setTimeout(() => onFinish(), 2600);
    
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        {/* B Logo Flip */}
        <div className="logo-3d">
          <div className="logo-face">B</div>
        </div>

        {/* BitScope text appears after flip */}
        {stage === "text" && (
          <h1 className="text-5xl font-bold tracking-tight animate-textReveal">
            Bit<span className="text-primary">Scope</span>
          </h1>
        )}
      </div>
    </div>
  );
}