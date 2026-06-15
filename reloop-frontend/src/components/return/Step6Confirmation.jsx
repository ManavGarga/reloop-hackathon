import React, { useEffect, useState } from "react";
import { useReturn } from "../../context/ReturnContext";
import { useUser } from "../../context/UserContext";
import { completeReturn } from "../../api/reloop";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ChevronRight, Award, Compass, RefreshCw, AlertCircle, Leaf, Recycle, Search, Tag, History } from "lucide-react";

const NGO_MAP = {
  general: { name: "GiveIndia", logo: "🌿" },
  clothing: { name: "Goonj", logo: "👕" },
  electronics: { name: "E-Waste Eco Foundation", logo: "🔌" }
};

export default function Step6Confirmation() {
  const { returnDetails, updateReturn, resetReturn } = useReturn();
  const { user } = useUser();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completeData, setCompleteData] = useState(null);

  const isSamsung = returnDetails.productId === "B09X7KQMGN" || returnDetails.productId === "prod_samsung_m34_001";

  const data = isSamsung ? {
    refund: "₹17,099",
    refund_label: "Refund in 3–5 days",
    credits: "+100 pts",
    credits_label: "Added to your account",
    co2: "59.5 kg",
    co2_label: "= 283 km not driven",
    productId: "B09X7KQMGN"
  } : {
    refund: "₹4,499",
    refund_label: "Refund in 3–5 days",
    credits: "+50 pts",
    credits_label: "Added to your account",
    co2: "22 kg",
    co2_label: "= 105 km not driven",
    productId: "JACKET_001"
  };

  useEffect(() => {
    let active = true;

    const finalizeReturn = async () => {
      try {
        const res = await completeReturn(returnDetails.returnId, {
          notes: "Customer confirmed return flow through wizard.",
        });
        if (active) {
          if (res && res.status === "ok") {
            setCompleteData(res);
            updateReturn({ completeResult: res });
          } else {
            throw new Error(res.detail || "Completion failed");
          }
        }
      } catch (err) {
        console.error(err);
        if (active) {
          setError("Failed to finalize return. Please verify backend connection.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    if (returnDetails.returnId) {
      finalizeReturn();
    } else {
      setLoading(false);
    }

    return () => { active = false; };
  }, [returnDetails.returnId, updateReturn]);

  const handleFinish = () => {
    resetReturn();
    navigate("/dashboard");
  };

  // Progression flow chart statuses
  const flowStages = [
    { label: "Initiated", done: true },
    { label: "Graded", done: true },
    { label: "Disposed", done: true },
    { label: "Completed", done: !loading && !error }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4 max-w-sm mx-auto text-center animate-fade-in">
        <RefreshCw className="animate-spin text-[#FF9900]" size={36} />
        <h3 className="text-sm font-bold text-slate-800">Completing circular return...</h3>
        <p className="text-[10px] text-slate-500 leading-normal font-medium">
          Writing transactions to the green credits ledger and generating your product passport.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4 max-w-sm mx-auto text-center animate-fade-in">
        <AlertCircle className="text-[#D13212]" size={36} />
        <h3 className="text-sm font-bold text-slate-800">Something went wrong</h3>
        <p className="text-xs text-slate-500 leading-normal bg-red-50 border border-red-200 px-4 py-3 rounded-xl">{error}</p>
        <button onClick={handleFinish} className="px-6 h-[44px] bg-[#FF9900] hover:bg-[#F08804] text-[#111111] rounded-lg text-sm font-bold transition-all active:scale-[0.98] cursor-pointer border border-transparent flex items-center justify-center shadow-sm">
          Go to Dashboard
        </button>
      </div>
    );
  }

  const creditsAwarded = completeData?.credits_awarded || returnDetails.disposeResult?.green_credits_awarded || 30;
  const disposition = completeData?.disposition || returnDetails.disposeResult?.disposition || "recycle";
  const isNGODonation = disposition === "ngo_donate";
  const isP2P = disposition === "p2p";

  // Determine NGO for donation
  const productCategory = returnDetails.disposeResult?.category || "general";
  const ngo = NGO_MAP[productCategory] || NGO_MAP.general;
  const donationDate = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const certId = `RLP-CERT-${Date.now().toString(36).toUpperCase().slice(-8)}`;

  return (
    <div className="space-y-8 max-w-2xl mx-auto py-4 animate-fade-in text-left">
      {/* 1. Big green checkmark & Heading */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-[#067D62]/10 border border-[#067D62]/20 rounded-full flex items-center justify-center text-[#067D62] text-3xl mx-auto shadow-sm animate-scale-up">
          ✓
        </div>
        <h2 className="text-[28px] font-bold text-[#067D62] tracking-tight text-center">Return Initiated Successfully!</h2>
        <p className="text-[15px] text-[#565959] text-center font-medium">Thank you for making a sustainable choice and participating in circular recommerce.</p>
      </div>

      {/* 2. Three Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Refund Card */}
        <div className="bg-white border border-[#E7E7E7] p-5 rounded-lg flex flex-col items-center justify-between space-y-3 shadow-sm text-center">
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-lg font-extrabold shadow-sm">
            ₹
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-black text-slate-900 block">{data.refund}</span>
            <p className="text-xs text-[#565959] font-semibold">{data.refund_label}</p>
          </div>
        </div>

        {/* Green Credits Card */}
        <div className="bg-white border border-[#E7E7E7] p-5 rounded-lg flex flex-col items-center justify-between space-y-3 shadow-sm text-center">
          <div className="w-10 h-10 rounded-full bg-[#067D62]/10 text-[#067D62] flex items-center justify-center shadow-sm">
            <Leaf size={20} className="text-[#067D62]" />
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-black text-[#067D62] block">{data.credits}</span>
            <p className="text-xs text-[#565959] font-semibold">{data.credits_label}</p>
          </div>
        </div>

        {/* CO2 Saved Card */}
        <div className="bg-white border border-[#E7E7E7] p-5 rounded-lg flex flex-col items-center justify-between space-y-3 shadow-sm text-center">
          <div className="w-10 h-10 rounded-full bg-[#067D62]/10 text-[#067D62] flex items-center justify-center shadow-sm">
            <Recycle size={20} className="text-[#067D62]" />
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-black text-[#067D62] block">{data.co2}</span>
            <p className="text-xs text-[#565959] font-semibold">{data.co2_label}</p>
          </div>
        </div>
      </div>

      {/* 3. Passport Link */}
      <div className="text-center">
        <button
          onClick={() => navigate(`/passport/${data.productId}`)}
          className="text-[14px] font-semibold text-[#007185] hover:text-[#C7511F] hover:underline inline-flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>View your item's Lifecycle Passport →</span>
        </button>
      </div>

      {/* 4. Ecosystem Flow Diagram */}
      <div className="bg-white border border-[#E7E7E7] rounded-lg p-6 shadow-sm space-y-5">
        <span className="text-[11px] font-bold text-[#565959] uppercase tracking-wider block text-left">
          What happens next
        </span>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-2">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center space-y-2 flex-1 px-4">
            <div className="w-10 h-10 rounded-full bg-[#067D62]/10 text-[#067D62] flex items-center justify-center shadow-xs">
              <Search size={20} className="text-[#067D62]" />
            </div>
            <span className="text-xs font-bold text-slate-800">Your item graded</span>
            <span className="text-[11px] text-slate-505 font-semibold">AI vision inspection within 24 hrs</span>
          </div>

          {/* Arrow 1 */}
          <span className="text-[#D5D9D9] font-bold hidden md:inline text-lg select-none">→</span>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center space-y-2 flex-1 px-4 border-t border-slate-100 pt-4 md:border-t-0 md:pt-0">
            <div className="w-10 h-10 rounded-full bg-[#FF9900]/10 text-[#FF9900] flex items-center justify-center shadow-xs">
              <Tag size={20} className="text-[#FF9900]" />
            </div>
            <span className="text-xs font-bold text-slate-800">Listed on Amazon Renewed</span>
            <span className="text-[11px] text-slate-550 font-semibold">Certified listing goes live</span>
          </div>

          {/* Arrow 2 */}
          <span className="text-[#D5D9D9] font-bold hidden md:inline text-lg select-none">→</span>

          {/* Step 3 */}
          <div className="flex flex-col items-center text-center space-y-2 flex-1 px-4 border-t border-slate-100 pt-4 md:border-t-0 md:pt-0">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
              <History size={20} className="text-blue-600" />
            </div>
            <span className="text-xs font-bold text-slate-800">Next buyer sees history</span>
            <span className="text-[11px] text-slate-500 font-semibold">Full lifecycle passport attached</span>
          </div>
        </div>

        <p className="text-[10px] text-[#565959] font-semibold italic text-center leading-normal pt-4 border-t border-slate-100">
          ReLoop integrates with Amazon Renewed via SP-API — your item's passport travels with it to the next owner.
        </p>
      </div>

      {/* 5. Two CTA buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={handleFinish}
          className="flex-1 max-w-xs h-[44px] bg-white border border-[#D5D9D9] text-[#111111] hover:bg-gray-50 font-bold rounded-lg text-sm flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer shadow-sm"
        >
          <span>Go to Dashboard</span>
        </button>
        <button
          onClick={() => navigate(`/passport/${data.productId}`)}
          className="flex-1 max-w-xs h-[44px] bg-[#FF9900] hover:bg-[#F08804] text-[#111111] font-bold rounded-lg text-sm flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer border border-transparent shadow-sm"
        >
          <span>View Passport</span>
        </button>
      </div>
    </div>
  );
}
