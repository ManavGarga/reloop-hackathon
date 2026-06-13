import React from "react";

export default function Spinner({ message }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      {/* Animated Spinner ring */}
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
        <div className="absolute inset-0 rounded-full border-4 border-t-green-primary border-r-teal-500 animate-spin" />
      </div>

      {message && (
        <p className="text-slate-400 text-sm font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
}
