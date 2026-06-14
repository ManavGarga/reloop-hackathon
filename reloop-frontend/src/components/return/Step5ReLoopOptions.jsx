import React, { useState, useEffect } from "react";
import { useReturn } from "../../context/ReturnContext";
import { ArrowRight, ArrowLeft, ArrowLeftRight, Heart, Sparkles, Check, Bell, Users } from "lucide-react";
import { getBuyerDemand } from "../../api/reloop";

export default function Step5ReLoopOptions({ onNext, onBack }) {
  const { returnDetails, updateReturn } = useReturn();
  const dispose = returnDetails.disposeResult || {};
  const route = dispose.disposition || "recycle";

  const [selectedRoute, setSelectedRoute] = useState("circular");
  const [askingPrice, setAskingPrice] = useState(
    dispose.p2p_offer_price || Math.round(dispose.estimated_resale_value * 0.9) || 12000
  );
  const [buyerDemand, setBuyerDemand] = useState(null);

  // Fetch buyer demand signals for P2P route
  useEffect(() => {
    if (route === "p2p" && returnDetails.productId) {
      getBuyerDemand(returnDetails.productId).then((res) => {
        if (res && res.status === "ok") setBuyerDemand(res);
      });
    }
  }, [route, returnDetails.productId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateReturn({
      creditOption: selectedRoute === "circular" ? route : "store_credit",
      estimatedValue: askingPrice,
    });
    onNext();
  };

  const getRouteBadge = () => {
    switch (route) {
      case "refurbish":
        return { label: "Refurbish & Amazon Renewed", icon: "♻️", desc: "Professionally refurbished and listed with 1-Year warranty." };
      case "p2p":
        return { label: "Peer-to-Peer Resale", icon: "📱", desc: "Listed directly on ReLoop's marketplace for another customer to buy." };
      case "ngo_donate":
        return { label: "NGO Donation", icon: "🤝", desc: "Donated to verified partner NGOs to benefit families in need." };
      default:
        return { label: "Material Recycling", icon: "♻️", desc: "Safe material recovery and components disassembly." };
    }
  };

  const activeRoute = getRouteBadge();

  return (
    <div className="space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-xl font-bold text-slate-100">Configure circular recommerce options</h2>
        <p className="text-xs text-slate-400">Review the AI recommended route or opt for a traditional store refund.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Route selection */}
        <div className="md:col-span-7 bg-slate-900/40 border border-slate-850 p-5 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Select Settlement Option</span>
            
            <div className="space-y-3">
              {/* Option 1: AI Circular Route */}
              <div
                onClick={() => setSelectedRoute("circular")}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  selectedRoute === "circular"
                    ? "bg-emerald-950/10 border-emerald-500/80 text-emerald-100"
                    : "bg-slate-950/40 border-slate-850 text-slate-400 hover:border-slate-800"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-emerald-400">
                    <Sparkles size={18} />
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-slate-200">AI Circular Route: {activeRoute.label}</h4>
                      <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-extrabold tracking-wide uppercase">
                        Recommended
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-450 mt-1 leading-relaxed">{activeRoute.desc}</p>
                  </div>
                </div>
                {selectedRoute === "circular" && (
                  <span className="w-4 h-4 bg-emerald-600 rounded-full flex items-center justify-center text-white border border-emerald-400">
                    <Check size={10} strokeWidth={3} />
                  </span>
                )}
              </div>

              {/* Option 2: Store Refund */}
              <div
                onClick={() => setSelectedRoute("traditional")}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  selectedRoute === "traditional"
                    ? "bg-indigo-950/20 border-indigo-500 text-indigo-200"
                    : "bg-slate-950/40 border-slate-850 text-slate-400 hover:border-slate-800"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-400">
                    💵
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Traditional Refund / Store Credit</h4>
                    <p className="text-[10px] text-slate-450 mt-1 leading-relaxed">Standard refund credited back to original payment method or wallet.</p>
                  </div>
                </div>
                {selectedRoute === "traditional" && (
                  <span className="w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center text-white border border-indigo-400">
                    <Check size={10} strokeWidth={3} />
                  </span>
                )}
              </div>
            </div>

            {/* Buyer Demand Notification Banner for P2P */}
            {route === "p2p" && selectedRoute === "circular" && buyerDemand && (
              <div className="bg-indigo-950/30 border border-indigo-800/50 p-3 rounded-xl animate-fade-in">
                <div className="flex items-start gap-2.5">
                  <span className="p-1.5 bg-indigo-900/50 rounded-lg text-indigo-400 flex-shrink-0">
                    <Bell size={14} />
                  </span>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-wide">Live Demand Signal</span>
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping" />
                    </div>
                    <p className="text-[11px] text-slate-200 leading-relaxed">
                      <strong className="text-indigo-300">{buyerDemand.signals.matched_buyers} buyers</strong> on Amazon are actively looking for a certified refurbished version of this product. They will receive a notification the moment your listing goes live.
                    </p>
                    <div className="flex gap-3 text-[10px] text-slate-400">
                      <span>🔖 {buyerDemand.signals.wishlist_count} wishlisted</span>
                      <span>🛒 {buyerDemand.signals.cart_count} in cart</span>
                      <span>🔍 {buyerDemand.signals.recent_search_count} recent searches</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* P2P Listing Pricing Controls if P2P */}
            {route === "p2p" && selectedRoute === "circular" && (
              <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-850 space-y-3 animate-fade-in">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Configure P2P Asking Price</span>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] text-slate-400">Your Asking Price (INR)</label>
                    <input
                      type="number"
                      value={askingPrice}
                      onChange={(e) => setAskingPrice(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-3 py-2 text-xs"
                      min={0}
                      step="any"
                    />
                  </div>
                  <div className="text-xs text-slate-400">
                    <p>Estimated Sale Value:</p>
                    <p className="font-bold text-slate-200">₹{dispose.estimated_resale_value?.toLocaleString() || "N/A"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all active:scale-98"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer active:scale-98"
            >
              <span>Continue to Confirmation</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Right Column: Reward breakdown summary */}
        <div className="md:col-span-5 bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Credits & Refund Breakdown</span>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Assessed Value Refund</span>
                <span className="font-bold text-slate-200">₹{(selectedRoute === "circular" ? (dispose.refund_amount || 0) : (dispose.estimated_resale_value || 0)).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Green Credits Earned</span>
                <span className="font-extrabold text-emerald-400">+{selectedRoute === "circular" ? (dispose.green_credits_awarded || 0) : 0} pts</span>
              </div>
              
              {returnDetails.dropoffMethod === "dropoff" && selectedRoute === "circular" && (
                <div className="flex justify-between items-center text-xs text-emerald-400 bg-emerald-950/15 border border-emerald-900/30 p-2 rounded-lg">
                  <span>Locker Dropoff Bonus</span>
                  <span className="font-extrabold">+10 pts</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-950/50 p-4 border border-slate-850 rounded-xl space-y-1.5 text-xs text-slate-400 leading-normal">
            <span className="font-bold text-slate-300">Sustainability Reason</span>
            <p className="italic font-medium">{dispose.reasoning}</p>
          </div>
        </div>
      </form>
    </div>
  );
}
