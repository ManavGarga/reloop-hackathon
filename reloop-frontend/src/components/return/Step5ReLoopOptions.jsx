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

  const [animating, setAnimating] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const isSamsung = returnDetails.productId === "B09X7KQMGN" || returnDetails.productId === "prod_samsung_m34_001";
  const data = {
    itemType: isSamsung ? "Samsung Galaxy M34" : "Levi's Jacket",
    p2pOffer: isSamsung ? "₹17,099" : "₹4,499"
  };

  const handleAccept = () => {
    setAccepted(true);
    setAnimating(true);
    setTimeout(() => {
      updateReturn({
        creditOption: "p2p",
        settlementMethod: "p2p"
      });
      onNext();
    }, 1500);
  };

  const handleDecline = () => {
    setAccepted(false);
    setAnimating(true);
    setTimeout(() => {
      updateReturn({
        creditOption: "store_credit",
        settlementMethod: "store_credit"
      });
      onNext();
    }, 1500);
  };

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

  if (animating) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 max-w-sm mx-auto text-center animate-fade-in text-slate-900">
        {accepted ? (
          <>
            <div className="w-16 h-16 bg-[#F0FDF4] border-2 border-[#16A34A] rounded-full flex items-center justify-center text-[#16A34A] text-3xl shadow-lg shadow-emerald-100 animate-bounce">
              ✓
            </div>
            <h3 className="text-base font-bold text-[#14532D] mt-2">P2P Offer Accepted!</h3>
            <p className="text-xs text-slate-500 leading-normal">
              Someone in Bengaluru is purchasing this item. Your refund is processing...
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-[#F0FDF4] border-2 border-[#16A34A] rounded-full flex items-center justify-center text-[#16A34A] text-2xl shadow-lg animate-spin">
              ♻️
            </div>
            <h3 className="text-base font-bold text-[#14532D] mt-2">Listing on Amazon Renewed...</h3>
            <p className="text-xs text-slate-500 leading-normal">
              Creating a certified renewed product listing with your item's passport...
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-900">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-xl font-bold text-slate-900 flex items-center justify-center gap-1.5">
          <Sparkles className="text-[#16A34A] animate-glow" size={20} /> Peer-to-Peer Resale Offer
        </h2>
        <p className="text-xs text-slate-500">Review the instant P2P purchase request matched for your product.</p>
      </div>

      <div className="max-w-md mx-auto bg-white border border-[#D1FAE5] rounded-3xl p-6 shadow-sm space-y-6 text-left">
        {/* P2P Offer details card */}
        <div className="bg-[#F0FDF4] border border-[#D1FAE5] p-5 rounded-2xl text-center space-y-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Live Match Signal</span>
          
          <p className="text-sm font-semibold text-[#14532D]">
            Someone in Bengaluru is interested in this {data.itemType}
          </p>

          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Offer Price Match</span>
            <span className="text-3xl font-black text-[#16A34A] block">{data.p2pOffer}</span>
          </div>

          <p className="text-[10px] text-slate-500 max-w-xs mx-auto leading-relaxed">
            A buyer in your city matches this condition profile and has committed to purchase.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleAccept}
            className="w-full py-3 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer active:scale-98"
          >
            <span>Accept P2P Offer</span>
          </button>
          
          <button
            onClick={handleDecline}
            className="w-full py-3 bg-white hover:bg-[#F0FDF4] text-[#16A34A] border border-[#D1FAE5] font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98"
          >
            <span>Decline — list on Amazon Renewed</span>
          </button>
        </div>

        <div className="text-[10px] text-slate-400 text-center leading-normal">
          <p>🌱 P2P sale completes in 48h. Your refund is processed immediately.</p>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onBack}
          className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all active:scale-98"
        >
          <ArrowLeft size={12} /> Back to Routing
        </button>
      </div>
    </div>
  );
}
