import React from "react";
import { X, ShieldCheck, Milestone, Leaf, Calendar, ArrowRight } from "lucide-react";
import CarbonBadge from "../passport/CarbonBadge";
import GradeTag from "../shared/GradeTag";

export default function RenewedPassportDrawer({ productId, isOpen, onClose }) {
  if (!isOpen) return null;

  // Mock timeline events for Amazon Renewed view (typically 3 recent events)
  const recentEvents = [
    {
      event_type: "returned",
      title: "Returned & Inspected by ReLoop",
      date: "May 28, 2026",
      actor: "ReLoop AI Inspector",
      notes: "Device returned by previous buyer. Screen has minor scratch (<1mm). Refurbishing complete.",
      location: "Bengaluru, KA",
      co2_delta_kg: -59.5, // Carbon saved by refurbishing/reselling
      condition_at_event: "Good",
    },
    {
      event_type: "sold",
      title: "Purchased (First Owner)",
      date: "Mar 15, 2026",
      actor: "Priya Sharma",
      notes: "Original purchase via Amazon India. Used for 73 days.",
      location: "Bengaluru, KA",
      co2_delta_kg: 0.0,
      condition_at_event: "Like New",
    },
    {
      event_type: "manufactured",
      title: "Manufactured",
      date: "Dec 15, 2025",
      actor: "Samsung Electronics",
      notes: "Manufactured at Samsung Noida plant. Emissions footprint certified.",
      location: "Noida, UP",
      co2_delta_kg: 70.0,
      condition_at_event: "Like New",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      {/* Overlay Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container (420px wide) */}
      <div className="relative w-full max-w-[420px] h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col z-10 animate-slide-in">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/20">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-teal-950/80 rounded-lg text-teal-400 border border-teal-900/40">
              <ShieldCheck size={20} />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-100">Product Passport</h3>
              <p className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">RLP-2026-X128A</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
          
          {/* CarbonBadge md */}
          <div>
            <CarbonBadge
              carbon_kg={70}
              context_string="Circular purchase saves 59.5 kg CO₂ (85% of total carbon footprint) compared to buying brand new."
              source="GHG Protocol Lifecycle Estimates"
              size="md"
            />
          </div>

          {/* 3 Recent Events */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Milestone size={14} className="text-indigo-400" /> Recent Lifecycle History
            </h4>
            <div className="relative border-l border-slate-800 ml-2.5 pl-5 space-y-5">
              {recentEvents.map((event, idx) => (
                <div key={idx} className="relative">
                  {/* Event Marker Dot */}
                  <span className="absolute -left-[27px] top-1 bg-slate-900 border border-slate-700 w-2.5 h-2.5 rounded-full flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                        <Calendar size={10} /> {event.date}
                      </span>
                      <GradeTag grade={event.condition_at_event} />
                    </div>
                    <h5 className="text-xs font-bold text-slate-200">{event.title}</h5>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{event.notes}</p>
                    
                    {event.co2_delta_kg !== 0 && (
                      <span className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded font-bold border ${
                        event.co2_delta_kg < 0 
                          ? "bg-green-950/40 text-green-400 border-green-900/50" 
                          : "bg-slate-950/40 text-slate-400 border-slate-800"
                      }`}>
                        {event.co2_delta_kg < 0 
                          ? `Saved: ${Math.abs(event.co2_delta_kg)} kg CO₂e` 
                          : `Cost: ${event.co2_delta_kg} kg CO₂e`}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="p-5 border-t border-slate-800 bg-slate-950/40 flex flex-col gap-2">
          <a
            href={`/passport/${productId}`}
            className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow"
          >
            <span>View Full Verification Passport</span>
            <ArrowRight size={14} />
          </a>
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700/80 text-slate-300 font-semibold rounded-xl text-xs transition-all"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
}
