import React, { useState, useEffect } from "react";
import { useReturn } from "../../context/ReturnContext";
import { useUser } from "../../context/UserContext";
import { initiateReturn, getProduct } from "../../api/reloop";
import { ArrowRight, ArrowLeft, Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";

export default function Step2ConditionCheck({ onNext, onBack }) {
  const { returnDetails, updateReturn } = useReturn();
  const { user } = useUser();
  const [product, setProduct] = useState(null);
  const [fetchingProduct, setFetchingProduct] = useState(true);

  const [reason, setReason] = useState(returnDetails.reason || "size mismatch");
  const [comment, setComment] = useState(returnDetails.comment || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (returnDetails.productId) {
      setFetchingProduct(true);
      getProduct(returnDetails.productId).then((res) => {
        if (res && res.status === "ok") {
          setProduct(res);
          // Set default reason if not already set
          if (!returnDetails.reason && res.common_return_reasons?.length) {
            setReason(res.common_return_reasons[0]);
          }
        }
      }).finally(() => setFetchingProduct(false));
    }
  }, [returnDetails.productId]);

  if (fetchingProduct || !product) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-3">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-400">Loading product details...</p>
      </div>
    );
  }


  // Mock upload files state
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);

  const handleFakeUpload = (side) => {
    // Generate a mock filename and state when clicked
    if (side === "front") {
      setFrontImage({ name: "front_scan.jpg", size: "1.4 MB" });
    } else {
      setBackImage({ name: "back_scan.jpg", size: "1.8 MB" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!frontImage || !backImage) {
      setError("Please simulate uploading both front and back scan images for AI assessment.");
      return;
    }
    if (!product || !user) return;

    setLoading(true);
    setError("");

    try {
      const payload = {
        user_id: user.user_id || "user_priya_001",
        product_id: product.product_id,
        product_name: product.name,
        return_reason: reason,
        reason_detail: comment,
        item_condition: "good",
        image_url: product.image_url,
      };

      const res = await initiateReturn(payload);
      if (res && res.status === "ok" && res.return_id) {
        updateReturn({
          reason,
          comment,
          returnId: res.return_id,
          conditionImages: ["front_scan.jpg", "back_scan.jpg"],
        });
        onNext();
      } else {
        throw new Error(res.detail || "Initiation failed");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to initiate return. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-xl font-bold text-slate-100">Describe the return reason & inspect condition</h2>
        <p className="text-xs text-slate-400">Tell us what went wrong and upload front & back scans for visual AI assessment.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Left: Input details */}
        <div className="md:col-span-6 bg-slate-900/40 border border-slate-850 p-5 rounded-2xl space-y-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Reason Details</span>
          
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 block">Select Primary Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {(product.common_return_reasons || []).map((r, idx) => (
                <option key={idx} value={r}>{r}</option>
              ))}
              <option value="other">Other issues / defect</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 block">Describe the issue in detail</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="E.g. Screen works but battery drops from 100% to 50% within 2 hours of normal usage..."
              className="w-full h-28 bg-slate-950 text-slate-200 border border-slate-800 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-normal"
              required
            />
          </div>
        </div>

        {/* Right: Upload Images Mock */}
        <div className="md:col-span-6 bg-slate-900/40 border border-slate-850 p-5 rounded-2xl flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Visual Scan Uploads</span>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Front Scan Box */}
              <div 
                onClick={() => handleFakeUpload("front")}
                className={`border-2 border-dashed p-4 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  frontImage 
                    ? "border-emerald-600/50 bg-emerald-950/5 text-slate-300" 
                    : "border-slate-800 hover:border-indigo-500/50 text-slate-500"
                }`}
              >
                {frontImage ? (
                  <>
                    <CheckCircle className="text-emerald-400 mb-1.5" size={24} />
                    <span className="text-[10px] font-bold text-slate-200 truncate max-w-full">{frontImage.name}</span>
                    <span className="text-[9px] text-slate-500 mt-0.5">{frontImage.size}</span>
                  </>
                ) : (
                  <>
                    <Upload className="mb-1.5 text-slate-500" size={24} />
                    <span className="text-[10px] font-bold text-slate-300">Front Scan</span>
                    <span className="text-[9px] text-slate-500 mt-0.5">Click to simulate upload</span>
                  </>
                )}
              </div>

              {/* Back Scan Box */}
              <div 
                onClick={() => handleFakeUpload("back")}
                className={`border-2 border-dashed p-4 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  backImage 
                    ? "border-emerald-600/50 bg-emerald-950/5 text-slate-300" 
                    : "border-slate-800 hover:border-indigo-500/50 text-slate-500"
                }`}
              >
                {backImage ? (
                  <>
                    <CheckCircle className="text-emerald-400 mb-1.5" size={24} />
                    <span className="text-[10px] font-bold text-slate-200 truncate max-w-full">{backImage.name}</span>
                    <span className="text-[9px] text-slate-500 mt-0.5">{backImage.size}</span>
                  </>
                ) : (
                  <>
                    <Upload className="mb-1.5 text-slate-500" size={24} />
                    <span className="text-[10px] font-bold text-slate-300">Back Scan</span>
                    <span className="text-[9px] text-slate-500 mt-0.5">Click to simulate upload</span>
                  </>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-950/30 border border-red-900/40 text-red-400 p-2.5 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{error}</span>
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
              disabled={loading}
              className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer active:scale-98"
            >
              <span>{loading ? "Registering return..." : "Submit Scans & Assess"}</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
