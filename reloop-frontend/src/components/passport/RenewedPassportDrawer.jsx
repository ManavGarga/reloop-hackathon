import React from "react";
import { X, Leaf, ShieldCheck, Heart, User, Milestone } from "lucide-react";
import GradeTag from "../shared/GradeTag";
import CarbonBadge from "./CarbonBadge";

export default function RenewedPassportDrawer({ productId, isOpen, onClose }) {
  if (!isOpen) return null;

  // Mock passport data for prod_samsung_m34_001
  const passport = {
    product_name: "Samsung Galaxy M34 5G",
    category: "electronics",
    total_co2_kg: 70.0,
    current_owner: "Priya Sharma (user_priya_001)",
    current_condition: "Good",
    events: [
      {
        event_type: "manufactured",
        title: "Manufactured",
        date: "Dec 15, 2025",
        actor: "Samsung Electronics",
        notes: "Manufactured at Samsung Noida plant, India",
        location: "Noida, UP",
        co2_delta_kg: 70.0,
        condition_at_event: "Like New",
      },
      {
        event_type: "sold",
        title: "Purchased (First Owner)",
        date: "Mar 15, 2026",
        actor: "Priya Sharma",
        notes: "Original purchase via Amazon India",
        location: "Bengaluru, KA",
        co2_delta_kg: 0.0,
        condition_at_event: "Like New",
      },
    ],
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer content */}
      <div className="relative w-full max-w-lg h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col z-10 animate-slide-in">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-teal-950 rounded-lg text-teal-400">
              <ShieldCheck size={24} />
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-100">ReLoop Product Passport</h2>
              <p className="text-xs text-teal-400 font-medium">Verified Circular History</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
          {/* Product basic details */}
          <div className="p-5 bg-slate-950/40 rounded-2xl border border-slate-800/80 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-200">{passport.product_name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">ID: {productId}</p>
              </div>
              <GradeTag grade={passport.current_condition} />
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800/40">
              <User size={16} className="text-teal-500" />
              <span>Current Owner: <span className="font-semibold text-slate-200">{passport.current_owner}</span></span>
            </div>
          </div>

          {/* Carbon Badge */}
          <div>
            <h4 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-1.5">
              <Leaf size={16} className="text-green-500" /> Sustainability Profile
            </h4>
            <CarbonBadge
              carbon_kg={passport.total_co2_kg}
              context_string="Produced during manufacturing. Buy refurbished next time to save up to 88% of this!"
              source="GHG Protocol & Samsung Sustainability Report 2025"
              size="md"
            />
          </div>

          {/* Timeline / Events */}
          <div>
            <h4 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-1.5">
              <Milestone size={16} className="text-indigo-400" /> Lifecycle Timeline
            </h4>
            <div className="relative border-l border-slate-800 ml-3 pl-6 space-y-6">
              {passport.events.map((event, index) => (
                <div key={index} className="relative">
                  {/* Circle Indicator */}
                  <span className="absolute -left-[31px] top-1 bg-slate-900 border border-slate-700 w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
                  </span>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {event.date}
                    </span>
                    <h5 className="text-sm font-bold text-slate-200 mt-2">{event.title}</h5>
                    <p className="text-xs text-slate-400 mt-1">{event.notes}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-400">
                      <span className="bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
                        📍 {event.location}
                      </span>
                      <span className="bg-slate-900/80 px-2 py-1 rounded border border-slate-800">
                        👤 {event.actor}
                      </span>
                      <span className="bg-slate-900/80 px-2 py-1 rounded border border-slate-800 flex items-center gap-1">
                        Condition: <span className="text-green-400 font-medium">{event.condition_at_event}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 bg-slate-950/30 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-700/80 text-sm font-semibold text-slate-300 hover:text-slate-100 hover:bg-slate-800/60 transition-all text-center"
          >
            Close Passport
          </button>
          <a
            href={`/passport/${productId}`}
            className="flex-1 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-sm font-semibold text-white transition-all text-center"
          >
            View Full Passport
          </a>
        </div>
      </div>
    </div>
  );
}
