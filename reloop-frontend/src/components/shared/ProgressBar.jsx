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
    <div className="w-full max-w-3xl mx-auto py-6 pl-[40px] pr-4">
      <div className="relative flex items-center justify-between">
        {/* Connecting Line background */}
        <div className="absolute top-5 left-6 right-6 h-[2px] bg-slate-200 z-0" />

        {/* Active Line Fill */}
        <div
          className={`absolute top-5 left-6 h-[2px] bg-[#16A34A] transition-all duration-500 ease-in-out z-0 ${
            currentStep === 6 ? "right-6" : ""
          }`}
          style={{
            width: currentStep === 6 ? "auto" : `${((currentStep - 1) / (totalSteps - 1)) * 92}%`,
          }}
        />

        {steps.map((step) => {
          const isCompleted = step.number < currentStep || (currentStep === 6 && step.number === 6);
          const isActive = step.number === currentStep && currentStep !== 6;

          return (
            <div key={step.number} className="flex flex-col items-center group relative">
              {/* Dot */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold relative z-10 transition-all duration-300 ${
                  isCompleted
                    ? "bg-[#16A34A] text-white border-2 border-[#16A34A]"
                    : isActive
                    ? "bg-white text-[#16A34A] border-2 border-[#16A34A] shadow-[0_0_8px_rgba(22,163,74,0.4)] animate-pulse"
                    : "bg-white text-slate-400 border-2 border-slate-300"
                }`}
              >
                {isCompleted ? <Check size={16} strokeWidth={3} /> : step.number}
              </div>

              {/* Label */}
              <span
                className={`absolute top-12 text-[12px] tracking-wide whitespace-nowrap transition-colors duration-300 left-1/2 -translate-x-1/2 text-center ${
                  isActive || isCompleted
                    ? "text-[#16A34A] font-medium"
                    : "text-slate-400 font-normal"
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
