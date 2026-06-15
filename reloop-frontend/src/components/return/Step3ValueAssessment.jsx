import React, { useEffect, useState } from "react";
import { useReturn } from "../../context/ReturnContext";
import { gradeReturn, disposeReturn } from "../../api/reloop";
import { ArrowRight, Sparkles, Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";
import GradeTag from "../shared/GradeTag";

export default function Step3ValueAssessment({ onNext }) {
  const { returnDetails, updateReturn } = useReturn();
  const [grading, setGrading] = useState(true);
  const [loadingDispose, setLoadingDispose] = useState(false);
  const [error, setError] = useState("");

  const [scanState, setScanState] = useState("Analyzing upload scans...");
  const [dots, setDots] = useState("");

  // Handle dots animation
  useEffect(() => {
    if (!grading) return;
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, [grading]);

  // Execute AI Grading with a minimum 2.5-second animation lock
  useEffect(() => {
    let active = true;
    const startTime = Date.now();

    const runGrading = async () => {
      setScanState("Running edge-detection models");
      try {
        const payload = {
          return_id: returnDetails.returnId,
          image_url: "https://example.com/item.jpg",
          description: returnDetails.comment || "Returned item",
        };

        const res = await gradeReturn(payload);
        
        // Ensure the grading scan animation lasts at least 2.5 seconds (2500ms)
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 2500 - elapsedTime);

        if (remainingTime > 0) {
          setScanState("Generating condition report");
          await new Promise((resolve) => setTimeout(resolve, remainingTime));
        }

        if (active) {
          if (res && res.status === "ok") {
            updateReturn({ gradeResult: res });
            setGrading(false);
          } else {
            throw new Error(res.detail || "Grading failed");
          }
        }
      } catch (err) {
        console.error(err);
        if (active) {
          setError("AI Grading failed. Please check backend server connection.");
          setGrading(false);
        }
      }
    };

    runGrading();
    return () => { active = false; };
  }, [returnDetails.returnId, returnDetails.comment, updateReturn]);

  const handleProceedToChoices = async () => {
    setLoadingDispose(true);
    setError("");

    try {
      const payload = {
        return_id: returnDetails.returnId,
        disposal_route: null,
        ngo_id: null,
        p2p_price: null,
      };

      const res = await disposeReturn(payload);
      if (res && res.status === "ok") {
        updateReturn({
          disposeResult: {
            ...res,
            // inject category so Step6 can resolve correct NGO
            category: returnDetails.category || returnDetails.productCategory || "general",
          },
        });
        onNext();
      } else {
        throw new Error(res.detail || "Disposition failed");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to retrieve circular dispositions. Check backend.");
    } finally {
      setLoadingDispose(false);
    }
  };

  if (grading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6 max-w-md mx-auto text-center">
        {/* Computer Vision Scanner Graphic */}
        <div className="relative w-32 h-32 bg-gray-50 border border-[#E7E7E7] rounded-2xl flex items-center justify-center overflow-hidden shadow-inner">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-[#FF9900] to-transparent animate-bounce" />
          <Loader2 className="animate-spin text-[#FF9900]" size={36} />
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-[#111111]">ReLoop AI Vision Inspecting{dots}</h3>
          <p className="text-[11px] font-semibold text-[#FF9900] capitalize tracking-wide">{scanState}</p>
          <p className="text-[10px] text-[#565959] max-w-xs leading-normal">
            Scanning front & back images for scratch depths, discoloration, and structural defects.
          </p>
        </div>
      </div>
    );
  }

  const { grade_score, condition, confidence, flaw_breakdown } = returnDetails.gradeResult || {};

  return (
    <div className="space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-xl font-bold text-[#111111] flex items-center justify-center gap-1.5">
          <Sparkles className="text-[#FF9900]" size={20} /> AI Grading Assessment Complete
        </h2>
        <p className="text-xs text-[#565959]">Our machine learning models have graded your item's condition.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Grade Card */}
        <div className="md:col-span-5 bg-white border border-[#E7E7E7] p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm">
          <span className="text-[10px] font-bold text-[#565959] uppercase tracking-wide block text-left">Grading Summary</span>
          
          <div className="space-y-3 py-2 text-center">
            <span className="text-[10px] text-[#565959] uppercase font-bold tracking-wider">AI Quality Score</span>
            <div className="text-[48px] font-bold text-[#111111] leading-none mt-1 block">
              {grade_score}<span className="text-[#565959] font-normal text-lg">/100</span>
            </div>
            <div className="flex justify-center mt-2">
              <span className="bg-[#067D62] text-white text-xs font-bold px-[12px] py-[6px] rounded-full uppercase tracking-wider">
                {condition || "GOOD"}
              </span>
            </div>
            <p className="text-[10px] text-[#565959] mt-2 font-medium">
              AI Confidence: <strong>{(confidence * 100).toFixed(0)}%</strong> (Verified Scan)
            </p>
          </div>

          <div className="bg-gray-50 border border-[#E7E7E7] p-3 rounded-xl flex items-start gap-2 text-[10px] text-[#565959] text-left">
            <ShieldCheck className="text-[#067D62] flex-shrink-0" size={16} />
            <span>This grade determines your green credits eligibility and recommerical resale multiplier.</span>
          </div>
        </div>

        {/* Right Column: Flaws Detected */}
        <div className="md:col-span-7 bg-white border border-[#E7E7E7] p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm text-left">
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-[#565959] uppercase tracking-wide block">Detected Flaws ({flaw_breakdown?.length || 0})</span>
            {flaw_breakdown && flaw_breakdown.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {flaw_breakdown.map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between bg-gray-50 border border-[#E7E7E7] p-3 rounded-xl text-xs">
                    <span className="text-[#111111] leading-tight pr-4">{item.flaw}</span>
                    <span className="bg-[#D13212]/15 text-[#D13212] border border-[#D13212]/20 px-2 py-0.5 rounded text-[10px] font-bold capitalize">
                      {item.severity}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-10 bg-[#067D62]/10 rounded-xl border border-[#067D62]/20 text-[#067D62] text-xs gap-1.5">
                <CheckCircle2 className="text-[#067D62]" size={16} />
                <span>No major cosmetic or functional flaws detected!</span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-2.5 rounded-lg text-xs">
                {error}
              </div>
            )}
          </div>

          <button
            onClick={handleProceedToChoices}
            disabled={loadingDispose}
            className="w-full h-[44px] bg-[#FF9900] hover:bg-[#F08804] disabled:bg-gray-100 disabled:text-gray-400 text-[#111111] font-bold rounded-lg text-sm flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-[0.98] border border-transparent"
          >
            <span>{loadingDispose ? "Evaluating..." : "Proceed to Circular Choices"}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
