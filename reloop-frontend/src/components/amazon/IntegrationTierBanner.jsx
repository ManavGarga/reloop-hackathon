import React, { useState } from "react";
import { X, Calendar, Server, Zap, Milestone } from "lucide-react";

export default function IntegrationTierBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative animate-fade-in shadow-lg">
      {/* Dismiss button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1 hover:bg-slate-800 rounded-full transition-colors"
      >
        <X size={16} />
      </button>

      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="p-1.5 bg-indigo-950 rounded-lg text-indigo-400 border border-indigo-900/40">
          <Milestone size={16} />
        </span>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">ReLoop SP-API Integration roadmap</h4>
          <h3 className="text-sm font-bold text-slate-200">Renewed Ecosystem Integration Tiers</h3>
        </div>
      </div>

      {/* 3 Horizontal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Tier 1: Standalone Demo */}
        <div className="bg-slate-950/40 border border-indigo-500/30 p-4 rounded-xl flex flex-col justify-between space-y-3 relative shadow-inner">
          <div className="absolute top-3 right-3 bg-indigo-500/10 text-indigo-400 text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wide border border-indigo-500/20">
            Active
          </div>
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Tier 1 • Phase 1</span>
            <h5 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              <Zap size={14} className="text-indigo-400" /> Standalone Demo
            </h5>
            <p className="text-xs text-slate-300 leading-relaxed">
              Proof-of-Concept app representing seller passport creation and mock renewed listings without direct Amazon store sync.
            </p>
          </div>
          <span className="text-[10px] text-indigo-300 font-semibold flex items-center gap-1">
            <Calendar size={10} /> Today
          </span>
        </div>

        {/* Tier 2: 6mo SP-API Integration */}
        <div className="bg-slate-950/20 border border-dashed border-slate-700/80 p-4 rounded-xl flex flex-col justify-between space-y-3">
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Tier 2 • Integration</span>
            <h5 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
              <Server size={14} className="text-indigo-400" /> SP-API Integration
            </h5>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bi-directional sync with Amazon's Selling Partner API. Auto-pulls customer returns and pushes graded listings.
            </p>
            <div className="bg-slate-950/80 p-1.5 rounded border border-slate-800 mt-2">
              <code className="text-[9px] text-emerald-400 block font-mono">
                SP-API: Returns + Listings API
              </code>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
            <Calendar size={10} /> 6 Months Out
          </span>
        </div>

        {/* Tier 3: Future Amazon Renewed */}
        <div className="bg-slate-950/20 border border-dashed border-slate-700/80 p-4 rounded-xl flex flex-col justify-between space-y-3">
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Tier 3 • Native Ecosystem</span>
            <h5 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
              ♻️ Native Ecosystem
            </h5>
            <p className="text-xs text-slate-300 leading-relaxed">
              Full circular marketplace logic running natively in the Amazon store, complete with auto-generated carbon certificates.
            </p>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
            <Calendar size={10} /> Future Release
          </span>
        </div>

      </div>
    </div>
  );
}
