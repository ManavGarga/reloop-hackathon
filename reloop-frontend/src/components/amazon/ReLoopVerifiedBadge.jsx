import React, { useState } from "react";
import { ShieldCheck, ArrowRight } from "lucide-react";
import RenewedPassportDrawer from "./RenewedPassportDrawer";

export default function ReLoopVerifiedBadge({ grade = "Good", confidence = 89, passport_id = "RLP-2026-X128A", variant = "inline" }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDrawerOpen(true);
  };

  if (variant === "card") {
    return (
      <>
        <div 
          onClick={handleClick}
          className="bg-teal-950/20 border border-teal-800/40 p-4 rounded-xl flex items-center justify-between gap-4 cursor-pointer hover:bg-teal-950/30 hover:border-teal-700/60 transition-all group shadow-sm"
        >
          <div className="flex items-center gap-3">
            <span className="p-2 bg-teal-900/40 text-teal-400 rounded-lg border border-teal-800/30 group-hover:scale-105 transition-transform">
              <ShieldCheck size={20} className="animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-wide">ReLoop Verified</span>
                <span className="text-[10px] bg-teal-900/60 text-teal-300 border border-teal-800 px-1.5 py-0.5 rounded font-bold uppercase">
                  {grade}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                AI Condition: <span className="font-semibold text-teal-300">{grade}</span> ({confidence}% confidence)
              </p>
            </div>
          </div>
          <span className="text-slate-400 group-hover:text-slate-200 group-hover:translate-x-1 transition-all">
            <ArrowRight size={16} />
          </span>
        </div>

        {/* Passport Drawer */}
        <RenewedPassportDrawer
          productId={passport_id}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      </>
    );
  }

  // Inline variant (default)
  return (
    <>
      <span
        onClick={handleClick}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-950/40 text-teal-400 border border-teal-800/80 hover:bg-teal-900/30 hover:border-teal-750 transition-all cursor-pointer shadow-sm active:scale-95 select-none"
      >
        <ShieldCheck size={14} className="text-teal-400" />
        <span>ReLoop Verified · {grade} · {confidence}%</span>
      </span>

      {/* Passport Drawer */}
      <RenewedPassportDrawer
        productId={passport_id}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}
