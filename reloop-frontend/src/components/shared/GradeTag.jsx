import React from "react";

export default function GradeTag({ grade }) {
  if (!grade) return null;

  const getColors = (val) => {
    const norm = val.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (norm === "likenew" || norm === "excellent" || norm === "new") {
      return {
        bg: "bg-emerald-950/40 text-emerald-400 border-emerald-800/80",
        label: "Like New",
      };
    } else if (norm === "good") {
      return {
        bg: "bg-teal-950/40 text-teal-400 border-teal-800/80",
        label: "Good",
      };
    } else if (norm === "fair") {
      return {
        bg: "bg-amber-950/40 text-amber-400 border-amber-800/80",
        label: "Fair",
      };
    } else if (norm === "poor") {
      return {
        bg: "bg-rose-950/40 text-rose-400 border-rose-800/80",
        label: "Poor",
      };
    }
    // Default fallback
    return {
      bg: "bg-slate-800 text-slate-300 border-slate-700",
      label: val,
    };
  };

  const { bg, label } = getColors(grade);

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${bg} transition-all`}>
      {label}
    </span>
  );
}
