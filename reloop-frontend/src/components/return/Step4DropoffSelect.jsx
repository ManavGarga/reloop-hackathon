import React, { useState } from "react";
import { useReturn } from "../../context/ReturnContext";
import { ArrowRight, ArrowLeft, Truck, Landmark, Leaf, Check } from "lucide-react";

export default function Step4DropoffSelect({ onNext, onBack }) {
  const { returnDetails, updateReturn } = useReturn();
  const carbon = returnDetails.disposeResult?.carbon || {};

  const [method, setMethod] = useState(returnDetails.dropoffMethod || "pickup");
  const [date, setDate] = useState("2026-06-15");
  const [timeSlot, setTimeSlot] = useState("10:00 AM - 01:00 PM");

  const handleSubmit = (e) => {
    e.preventDefault();
    updateReturn({
      dropoffMethod: method,
      dropoffLocation: { date, timeSlot },
    });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-xl font-bold text-[#111111]">Select drop-off or pickup method</h2>
        <p className="text-xs text-[#565959]">Choose how you'll return the item and review the carbon offsets achieved.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Dropoff Selection */}
        <div className="md:col-span-7 bg-white border border-[#E7E7E7] p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm text-left">
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-[#565959] uppercase tracking-wide block">Return Method</span>
            
            <div className="space-y-3">
              {/* Doorstep Pickup */}
              <div
                onClick={() => setMethod("pickup")}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  method === "pickup"
                    ? "bg-[#FFF8F0] border-2 border-[#FF9900] text-[#111111]"
                    : "bg-white border-[#D5D9D9] text-slate-700 hover:bg-[#F7F8FA]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="p-2 bg-gray-50 border border-[#E7E7E7] rounded-lg text-[#FF9900]">
                    <Truck size={18} />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-[#111111]">Home Doorstep Pickup</h4>
                    <p className="text-[10px] text-[#565959] mt-0.5">An Amazon ReLoop agent will inspect and collect the item. (₹50 fee)</p>
                  </div>
                </div>
                {method === "pickup" && (
                  <span className="w-5 h-5 bg-[#FF9900] rounded-full flex items-center justify-center text-[#111111] border border-[#FF9900]">
                    <Check size={10} strokeWidth={3} />
                  </span>
                )}
              </div>

              {/* Self Drop-off */}
              <div
                onClick={() => setMethod("dropoff")}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  method === "dropoff"
                    ? "bg-[#FFF8F0] border-2 border-[#FF9900] text-[#111111]"
                    : "bg-white border-[#D5D9D9] text-slate-700 hover:bg-[#F7F8FA]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="p-2 bg-gray-50 border border-[#E7E7E7] rounded-lg text-[#FF9900]">
                    <Landmark size={18} />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-[#111111]">Drop-off at nearest Amazon Locker</h4>
                    <p className="text-[10px] text-[#565959] mt-0.5">Drop off yourself within 5 days. (Free + 10 Green Credits bonus!)</p>
                  </div>
                </div>
                {method === "dropoff" && (
                  <span className="w-5 h-5 bg-[#FF9900] rounded-full flex items-center justify-center text-[#111111] border border-[#FF9900]">
                    <Check size={10} strokeWidth={3} />
                  </span>
                )}
              </div>
            </div>

            {/* Date Picker Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#565959] uppercase">Select Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-white border border-[#D5D9D9] text-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#FF9900]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#565959] uppercase">Select Time Slot</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full bg-white border border-[#D5D9D9] text-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#FF9900]"
                >
                  <option value="09:00 AM - 12:00 PM">09:00 AM - 12:00 PM</option>
                  <option value="12:00 PM - 03:00 PM">12:00 PM - 03:00 PM</option>
                  <option value="03:00 PM - 06:00 PM">03:00 PM - 06:00 PM</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onBack}
              className="h-[44px] px-6 bg-white hover:bg-gray-50 text-[#111111] border border-[#D5D9D9] rounded-lg text-sm font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-[0.98]"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <button
              type="submit"
              className="flex-1 h-[44px] bg-[#FF9900] hover:bg-[#F08804] text-[#111111] font-bold rounded-lg text-sm flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-[0.98] border border-transparent"
            >
              <span>Continue to Choices</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Right Column: Carbon Badge showing Real Data */}
        <div className="md:col-span-5 flex flex-col justify-between bg-[#067D62]/10 border border-[#067D62]/20 p-5 rounded-2xl space-y-4 text-left">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-[#067D62]/20 text-[#067D62] rounded-lg border border-[#067D62]/30">
                <Leaf size={18} />
              </span>
              <span className="text-[10px] font-bold text-[#067D62] uppercase tracking-wide">Environmental Impact Card</span>
            </div>

            <div className="space-y-1">
              <span className="text-3xl font-extrabold text-[#111111] tracking-tight block">
                {carbon.co2_saved_kg} kg <span className="text-[#067D62] text-xs font-bold">CO₂e Saved</span>
              </span>
              <p className="text-[11px] text-slate-700 leading-relaxed pt-1">
                Routing this return via circular paths saves <strong>{carbon.co2_saved_kg} kg</strong> of carbon dioxide equivalents compared to landfill dumping.
              </p>
            </div>

            {carbon.equivalence && (
              <div className="border-t border-[#067D62]/20 pt-3 text-[10px] text-[#067D62]/90 space-y-2">
                <div className="flex items-center gap-1.5">
                  <span>🚗 Equivalent to <strong>{carbon.equivalence.value} km</strong> of {carbon.equivalence.label}.</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>🌳 Equivalent to planting <strong>{(carbon.co2_saved_kg / 21).toFixed(1)}</strong> urban tree offsets.</span>
                </div>
              </div>
            )}
          </div>

          {carbon.source_citation && (
            <div className="text-[9px] text-[#067D62]/80 italic font-semibold leading-relaxed border-t border-[#067D62]/20 pt-2.5">
              {carbon.source_citation}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
