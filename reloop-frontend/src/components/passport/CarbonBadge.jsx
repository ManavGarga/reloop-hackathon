import React from "react";
import { Leaf } from "lucide-react";

export default function CarbonBadge({ carbon_kg, context_string, source, size = "md" }) {
  // Determine sizing styles
  const sizeStyles = {
    sm: {
      card: "p-3 rounded-xl gap-2",
      icon: 14,
      title: "text-[10px] uppercase tracking-wider",
      value: "text-lg",
      desc: "text-[11px]",
      eq: "text-[10px] mt-1.5 pt-1.5",
      src: "text-[9px] mt-1",
    },
    md: {
      card: "p-5 rounded-2xl gap-3",
      icon: 20,
      title: "text-xs uppercase tracking-wider",
      value: "text-2xl",
      desc: "text-xs",
      eq: "text-xs mt-2.5 pt-2.5",
      src: "text-[10px] mt-1.5",
    },
    lg: {
      card: "p-7 rounded-3xl gap-4",
      icon: 26,
      title: "text-sm uppercase tracking-wider font-semibold",
      value: "text-4xl",
      desc: "text-sm",
      eq: "text-sm mt-3 pt-3",
      src: "text-xs mt-2",
    },
  };

  const current = sizeStyles[size] || sizeStyles.md;

  // Let's compute some funny/insightful equivalences for the carbon value:
  // 1 kg CO2 is roughly equal to driving 4 km in a standard car, or charging 120 smartphones, or 12 hours of laptop use.
  // Let's use charging smartphones: 1 kg CO2 = ~120 smartphone charges.
  const smartphoneCharges = Math.round(carbon_kg * 122);
  const carKm = Math.round(carbon_kg * 4.1);

  return (
    <div className={`flex flex-col bg-emerald-950/25 border border-emerald-800/40 text-emerald-100 ${current.card} shadow-lg shadow-emerald-950/10`}>
      <div className="flex items-center gap-2">
        <span className="p-1.5 bg-emerald-900/40 text-emerald-400 rounded-lg border border-emerald-800/30">
          <Leaf size={current.icon} />
        </span>
        <span className={`${current.title} text-emerald-400 font-bold`}>
          Carbon Footprint
        </span>
      </div>

      <div className="mt-1">
        <span className={`${current.value} font-extrabold text-slate-100 tracking-tight`}>
          {carbon_kg} kg <span className="text-emerald-400 font-medium text-sm">CO₂e</span>
        </span>
      </div>

      {context_string && (
        <p className={`${current.desc} text-slate-300 font-normal mt-1 leading-relaxed`}>
          {context_string}
        </p>
      )}

      <div className={`border-t border-emerald-800/30 text-emerald-300/80 ${current.eq} flex flex-col gap-1`}>
        <div className="flex items-center gap-1.5">
          <span>⚡ Equivalent to charging <strong>{smartphoneCharges.toLocaleString()}</strong> smartphones</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>🚗 Equivalent to driving <strong>{carKm.toLocaleString()} km</strong> in a petrol car</span>
        </div>
      </div>

      {source && (
        <div className={`${current.src} text-emerald-500 italic font-medium`}>
          Source: {source}
        </div>
      )}
    </div>
  );
}
