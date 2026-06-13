import React, { useEffect, useState } from "react";
import { useReturn } from "../../context/ReturnContext";
import { completeReturn } from "../../api/reloop";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ChevronRight, Award, Compass, RefreshCw, AlertCircle } from "lucide-react";

export default function Step6Confirmation() {
  const { returnDetails, updateReturn, resetReturn } = useReturn();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [completeData, setCompleteData] = useState(null);

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
    { label: "Completed", done: !loading && !error },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4 max-w-sm mx-auto text-center">
        <RefreshCw className="animate-spin text-indigo-500" size={36} />
        <h3 className="text-sm font-bold text-slate-200">Completing circular return...</h3>
        <p className="text-[10px] text-slate-550 leading-normal">Writing transactions to the green credits ledger and generating your product passport.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4 max-w-sm mx-auto text-center animate-fade-in">
        <AlertCircle className="text-red-500" size={36} />
        <h3 className="text-sm font-bold text-slate-200">Something went wrong</h3>
        <p className="text-[10px] text-slate-400 leading-normal">{error}</p>
        <button onClick={handleFinish} className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-200">
          Go to Dashboard
        </button>
      </div>
    );
  }

  const creditsAwarded = completeData?.credits_awarded || returnDetails.disposeResult?.green_credits_awarded || 30;

  return (
    <div className="space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <CheckCircle2 className="text-emerald-500 mx-auto" size={48} />
        <h2 className="text-xl font-bold text-slate-100">Return request completed successfully!</h2>
        <p className="text-xs text-slate-400">Thank you for making a sustainable choice. Your green credits have been credited.</p>
      </div>

      {/* Visual Flow Chart Progression Diagram */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Lifecycle Flow Diagram</span>
        <div className="flex items-center justify-between max-w-lg mx-auto py-2">
          {flowStages.map((stage, idx) => (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center space-y-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border font-extrabold text-xs transition-all ${
                  stage.done
                    ? "bg-emerald-950 border-emerald-500 text-emerald-400 shadow-md shadow-emerald-950/20"
                    : "bg-slate-950 border-slate-800 text-slate-600"
                }`}>
                  {idx + 1}
                </div>
                <span className={`text-[10px] font-bold ${stage.done ? "text-slate-200" : "text-slate-600"}`}>
                  {stage.label}
                </span>
              </div>
              {idx < flowStages.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 transition-all ${stage.done ? "bg-emerald-800/80" : "bg-slate-850"}`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Settlement Summary */}
        <div className="md:col-span-6 bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Wallet Settlement Summary</span>
          
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-3 bg-emerald-950/20 border border-emerald-900/40 p-4 rounded-xl">
              <Award className="text-emerald-400 flex-shrink-0" size={24} />
              <div>
                <span className="text-[9px] uppercase tracking-wide text-emerald-400 font-bold">Green Credits Awarded</span>
                <span className="text-2xl font-black text-slate-100 block mt-0.5">+{creditsAwarded} points</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Total Refund Approved</span>
              <span className="font-bold text-slate-200">₹{returnDetails.disposeResult?.refund_amount?.toLocaleString() || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Settlement Method</span>
              <span className="font-semibold text-indigo-400 capitalize">{returnDetails.creditOption.replace("_", " ")}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => navigate(`/passport/${returnDetails.productId}`)}
              className="flex-1 py-3 bg-slate-950 hover:bg-slate-900 text-teal-400 border border-teal-900/50 hover:border-teal-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-all shadow cursor-pointer active:scale-98"
            >
              <Compass size={14} />
              <span>Inspect Passport</span>
            </button>
            <button
              onClick={handleFinish}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-all shadow cursor-pointer active:scale-98"
            >
              <span>Go to Dashboard</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Right Column: Renewed Listing Details if Refurbished */}
        <div className="md:col-span-6 bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Circular Routing Outcome</span>
          
          {completeData?.renewed_listing ? (
            <div className="space-y-3 animate-fade-in">
              <span className="text-[9px] bg-orange-500/10 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded font-extrabold tracking-wide uppercase inline-block">
                Amazon Renewed Listing Generated
              </span>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-200">{completeData.renewed_listing.title}</h4>
                <p className="text-[10px] text-slate-450">ASIN: {completeData.renewed_listing.asin}</p>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Listed Resale Price</span>
                <span className="font-bold text-slate-200">₹{completeData.renewed_listing.price.toLocaleString()}</span>
              </div>
              <button
                onClick={() => navigate("/amazon-renewed")}
                className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-slate-200 border border-slate-850 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Preview Listing Page</span>
                <ChevronRight size={12} />
              </button>
            </div>
          ) : (
            <div className="text-xs text-slate-450 leading-relaxed space-y-2 py-4">
              <p>Your item has been routed for circular processing:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Estimated processing duration: 3-5 business days.</li>
                <li>Carbon footprint saved: <strong>{returnDetails.disposeResult?.carbon?.co2_saved_kg || 0} kg</strong>.</li>
                <li>Green credits immediately reflected in your circular dashboard wallet.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
