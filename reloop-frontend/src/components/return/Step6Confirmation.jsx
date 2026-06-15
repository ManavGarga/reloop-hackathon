import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Recycle, Leaf, Search, Tag, History } from "lucide-react";
import { useCircularReturn } from "../../hooks/useCircularReturn";
import { Button, Card, LoadingScreen, ErrorState } from "../ui";

const NGO_MAP = {
  general: { name: "GiveIndia", logo: "🌿" },
  clothing: { name: "Goonj", logo: "👕" },
  electronics: { name: "E-Waste Eco Foundation", logo: "🔌" }
};

export default function Step6Confirmation() {
  const navigate = useNavigate();
  const {
    returnDetails,
    loading,
    error,
    completeReturnFlow,
    resetReturn
  } = useCircularReturn();

  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState("");
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

    const finalize = async () => {
      try {
        const res = await completeReturnFlow(
          returnDetails.productId,
          data.refund,
          data.credits,
          data.co2
        );
        if (active && res) {
          setCompleteData(res);
        }
      } catch (err) {
        setLocalError(err.message || "Failed to finalize return.");
      } finally {
        if (active) {
          setLocalLoading(false);
        }
      }
    };

    if (returnDetails.returnId) {
      finalize();
    } else {
      setLocalLoading(false);
    }

    return () => { active = false; };
  }, [returnDetails.returnId, returnDetails.productId, completeReturnFlow]);

  const handleFinish = () => {
    resetReturn();
    navigate("/dashboard");
  };

  if (localLoading || loading) {
    return <LoadingScreen message="Completing circular return..." />;
  }

  if (localError || error) {
    return (
      <ErrorState
        title="Something went wrong"
        message={localError || error}
        onRetry={handleFinish}
      />
    );
  }

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
        <Card className="flex flex-col items-center justify-between space-y-3 text-center p-5 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-lg font-extrabold shadow-sm">
            ₹
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-black text-slate-900 block">{data.refund}</span>
            <p className="text-xs text-[#565959] font-semibold">{data.refund_label}</p>
          </div>
        </Card>

        {/* Green Credits Card */}
        <Card className="flex flex-col items-center justify-between space-y-3 text-center p-5 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-[#067D62]/10 text-[#067D62] flex items-center justify-center shadow-sm">
            <Leaf size={20} className="text-[#067D62]" />
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-black text-[#067D62] block">{data.credits}</span>
            <p className="text-xs text-[#565959] font-semibold">{data.credits_label}</p>
          </div>
        </Card>

        {/* CO2 Saved Card */}
        <Card className="flex flex-col items-center justify-between space-y-3 text-center p-5 shadow-sm">
          <div className="w-10 h-10 rounded-full bg-[#067D62]/10 text-[#067D62] flex items-center justify-center shadow-sm">
            <Recycle size={20} className="text-[#067D62]" />
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-black text-[#067D62] block">{data.co2}</span>
            <p className="text-xs text-[#565959] font-semibold">{data.co2_label}</p>
          </div>
        </Card>
      </div>

      {/* 3. Passport Link */}
      <div className="text-center">
        <Button
          variant="link"
          onClick={() => navigate(`/passport/${data.productId}`)}
        >
          View your item's Lifecycle Passport →
        </Button>
      </div>

      {/* 4. Ecosystem Flow Diagram */}
      <Card className="p-6 shadow-sm space-y-5">
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
            <span className="text-[11px] text-slate-500 font-semibold">AI vision inspection within 24 hrs</span>
          </div>

          {/* Arrow 1 */}
          <span className="text-[#D5D9D9] font-bold hidden md:inline text-lg select-none">→</span>

          {/* Step 2 */}
          <div className="flex flex-col items-center text-center space-y-2 flex-1 px-4 border-t border-slate-100 pt-4 md:border-t-0 md:pt-0">
            <div className="w-10 h-10 rounded-full bg-[#FF9900]/10 text-[#FF9900] flex items-center justify-center shadow-xs">
              <Tag size={20} className="text-[#FF9900]" />
            </div>
            <span className="text-xs font-bold text-slate-800">Listed on Amazon Renewed</span>
            <span className="text-[11px] text-slate-500 font-semibold">Certified listing goes live</span>
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
      </Card>

      {/* 5. Two CTA buttons */}
      <div className="flex gap-4 justify-center">
        <Button
          onClick={handleFinish}
          variant="secondary"
          className="flex-1 max-w-xs"
        >
          Go to Dashboard
        </Button>
        <Button
          onClick={() => navigate(`/passport/${data.productId}`)}
          variant="primary"
          className="flex-1 max-w-xs"
        >
          View Passport
        </Button>
      </div>
    </div>
  );
}
