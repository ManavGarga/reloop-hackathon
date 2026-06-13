import React from "react";
import { Check } from "lucide-react";

export default function ProgressBar({ currentStep, totalSteps = 6 }) {
  const steps = [
    { number: 1, label: "Item Select" },
    { number: 2, label: "Condition" },
    { number: 3, label: "Valuation" },
    { number: 4, label: "Drop-off" },
    { number: 5, label: "ReLoop Choices" },
    { number: 6, label: "Confirm" },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-4">
      <div className="relative flex items-center justify-between">
        {/* Connecting Line background */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 -z-10" />

        {/* Active Line Fill */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-green-primary transition-all duration-500 ease-in-out -z-10"
          style={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
          }}
        />

        {steps.map((step) => {
          const isCompleted = step.number < currentStep;
          const isActive = step.number === currentStep;

          return (
            <div key={step.number} className="flex flex-col items-center group relative">
              {/* Dot */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 text-sm font-bold transition-all duration-300 ${
                  isCompleted
                    ? "bg-green-primary border-green-primary text-white shadow-md shadow-green-900/30"
                    : isActive
                    ? "bg-slate-900 border-green-primary text-green-primary scale-110 shadow-lg shadow-green-950/20"
                    : "bg-slate-950 border-slate-800 text-slate-500"
                }`}
              >
                {isCompleted ? <Check size={16} strokeWidth={3} /> : step.number}
              </div>

              {/* Label */}
              <span
                className={`absolute top-11 text-[11px] font-medium tracking-wide whitespace-nowrap transition-colors duration-300 ${
                  isActive
                    ? "text-green-primary font-semibold"
                    : isCompleted
                    ? "text-slate-300"
                    : "text-slate-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="h-6" /> {/* spacer for absolute labels */}
    </div>
  );
}
