import React, { useState, useEffect } from "react";
import { useReturn } from "../../context/ReturnContext";
import { ArrowLeft, Sparkles, Heart, Recycle } from "lucide-react";
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
        creditOption: route,
        settlementMethod: route
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
  }, [route, returnDetails.productId]);  if (animating) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 max-w-sm mx-auto text-center animate-fade-in text-slate-900">
        {accepted ? (
          <>
            <div className="w-16 h-16 bg-[#067D62]/10 border-2 border-[#067D62] rounded-full flex items-center justify-center text-[#067D62] text-3xl shadow-sm animate-bounce">
              ✓
            </div>
            <h3 className="text-base font-bold text-[#067D62] mt-2">
              {route === "p2p" ? "P2P Offer Accepted!" : route === "ngo_donate" ? "Donation Route Confirmed!" : "Recycling Confirmed!"}
            </h3>
            <p className="text-xs text-[#565959] leading-normal">
              {route === "p2p" 
                ? "Someone in Bengaluru is purchasing this item. Your refund is processing..." 
                : route === "ngo_donate" 
                ? "Your item has been routed to Goonj NGO Bengaluru Center. Thank you!" 
                : "Your item is routed to responsible components recycling."}
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-[#067D62]/10 border-2 border-[#067D62] rounded-full flex items-center justify-center text-[#067D62] text-2xl shadow-sm animate-spin">
              ♻️
            </div>
            <h3 className="text-base font-bold text-[#067D62] mt-2">Processing refund...</h3>
            <p className="text-xs text-[#565959] leading-normal">
              Processing standard store credit refund to your account...
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#111111] flex flex-col items-center w-full">
      {route === "p2p" || route === "refurbish" ? (
        <>
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-xl font-bold text-[#111111] flex items-center justify-center gap-1.5">
              <Sparkles className="text-[#FF9900]" size={20} /> Peer-to-Peer Resale Offer
            </h2>
            <p className="text-xs text-[#565959]">Review the instant P2P purchase request matched for your product.</p>
          </div>

          <div className="w-full max-w-md mx-auto bg-white border border-[#E7E7E7] rounded-xl p-6 shadow-sm space-y-6 text-left">
            {/* P2P Offer details card */}
            <div className="bg-gray-50 border border-[#E7E7E7] border-t-4 border-t-[#FF9900] p-5 rounded-lg text-center space-y-4 relative overflow-hidden">
              <span className="text-[10px] font-bold text-[#565959] uppercase tracking-widest block">Live Match Signal</span>
              
              <p className="text-sm font-semibold text-[#111111]">
                Someone in Bengaluru is interested in this {data.itemType}
              </p>

              <div className="space-y-1">
                <span className="text-[10px] text-[#565959] uppercase font-bold block">Offer Price Match</span>
                <span className="text-3xl font-bold text-[#B12704] block">{data.p2pOffer}</span>
              </div>

              <p className="text-[10px] text-[#565959] max-w-xs mx-auto leading-relaxed">
                A buyer in your city matches this condition profile and has committed to purchase.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleAccept}
                className="w-full h-[44px] bg-[#FF9900] hover:bg-[#F08804] text-[#111111] font-bold rounded-lg text-sm flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-[0.98] border border-transparent"
              >
                <span>Accept P2P Offer</span>
              </button>
              
              <button
                onClick={handleDecline}
                className="w-full h-[44px] bg-white hover:bg-gray-50 text-[#111111] border border-[#D5D9D9] font-bold rounded-lg text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.98] shadow-sm"
              >
                <span>Decline — get standard refund</span>
              </button>
            </div>

            <div className="text-[10px] text-[#565959] text-center leading-normal">
              <p>🌱 P2P sale completes in 48h. Your refund is processed immediately.</p>
            </div>
          </div>
        </>
      ) : route === "ngo_donate" ? (
        <>
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-xl font-bold text-[#111111] flex items-center justify-center gap-1.5">
              <Heart className="text-[#067D62] animate-pulse" size={20} /> Circular NGO Donation Match
            </h2>
            <p className="text-xs text-[#565959]">Donate this item to help families in need and earn double Green Credits.</p>
          </div>

          <div className="w-full max-w-md mx-auto bg-white border border-[#E7E7E7] rounded-xl p-6 shadow-sm space-y-6 text-left">
            {/* NGO Donation Card */}
            <div className="bg-gray-50 border border-[#E7E7E7] border-t-4 border-t-[#067D62] p-5 rounded-lg text-center space-y-4 relative overflow-hidden">
              <span className="text-[10px] font-bold text-[#565959] uppercase tracking-widest block">Live Route Match</span>
              
              <p className="text-sm font-semibold text-[#111111]">
                Goonj Bengaluru Center has immediate demand for this {data.itemType}
              </p>

              <div className="space-y-1">
                <span className="text-[10px] text-[#565959] uppercase font-bold block">Credits Awarded (2× Multiplier)</span>
                <span className="text-3xl font-bold text-[#067D62] block">+{dispose.green_credits_awarded || 80} pts</span>
              </div>

              <p className="text-[10px] text-[#565959] max-w-xs mx-auto leading-relaxed">
                Your donation directly helps families in need while preventing landfills and saving environmental carbon.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleAccept}
                className="w-full h-[44px] bg-[#FF9900] hover:bg-[#F08804] text-[#111111] font-bold rounded-lg text-sm flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-[0.98] border border-transparent"
              >
                <span>Confirm NGO Donation</span>
              </button>
              
              <button
                onClick={handleDecline}
                className="w-full h-[44px] bg-white hover:bg-gray-50 text-[#111111] border border-[#D5D9D9] font-bold rounded-lg text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.98] shadow-sm"
              >
                <span>Decline — get standard store refund</span>
              </button>
            </div>

            <div className="text-[10px] text-[#565959] text-center leading-normal">
              <p>🤝 We route this directly to Goonj NGO. Your standard store credit refund is still issued.</p>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-xl font-bold text-[#111111] flex items-center justify-center gap-1.5">
              <Recycle className="text-[#067D62]" size={20} /> Material Recycling Route
            </h2>
            <p className="text-xs text-[#565959]">Recycle this item responsibly to recover valuable materials.</p>
          </div>

          <div className="w-full max-w-md mx-auto bg-white border border-[#E7E7E7] rounded-xl p-6 shadow-sm space-y-6 text-left">
            {/* Recycling Card */}
            <div className="bg-gray-50 border border-[#E7E7E7] border-t-4 border-t-[#565959] p-5 rounded-lg text-center space-y-4 relative overflow-hidden">
              <span className="text-[10px] font-bold text-[#565959] uppercase tracking-widest block">Recycling Route</span>
              
              <p className="text-sm font-semibold text-[#111111]">
                Routed to E-Waste Eco Foundation for components recovery
              </p>

              <div className="space-y-1">
                <span className="text-[10px] text-[#565959] uppercase font-bold block">Credits Awarded</span>
                <span className="text-3xl font-bold text-[#067D62] block">+{dispose.green_credits_awarded || 30} pts</span>
              </div>

              <p className="text-[10px] text-[#565959] max-w-xs mx-auto leading-relaxed">
                This item is assessed as too worn for donation or resale. Disassembly recovers metals and keeps waste out of land dump sites.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleAccept}
                className="w-full h-[44px] bg-[#FF9900] hover:bg-[#F08804] text-[#111111] font-bold rounded-lg text-sm flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-[0.98] border border-transparent"
              >
                <span>Confirm Material Recycling</span>
              </button>
              
              <button
                onClick={handleDecline}
                className="w-full h-[44px] bg-white hover:bg-gray-50 text-[#111111] border border-[#D5D9D9] font-bold rounded-lg text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.98] shadow-sm"
              >
                <span>Decline — get standard store refund</span>
              </button>
            </div>

            <div className="text-[10px] text-[#565959] text-center leading-normal">
              <p>♻️ Full dismantling certification will be attached to your lifecycle passport.</p>
            </div>
          </div>
        </>
      )}

      <div className="flex justify-center">
        <button
          onClick={onBack}
          className="h-[44px] px-6 bg-white hover:bg-gray-50 text-[#111111] border border-[#D5D9D9] rounded-lg text-sm font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer shadow-sm"
        >
          <ArrowLeft size={14} /> Back to Routing
        </button>
      </div>
    </div>
  );
}
