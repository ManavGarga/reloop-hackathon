import React, { useState, useEffect } from "react";
import { useReturn } from "../../context/ReturnContext";
import { useUser } from "../../context/UserContext";
import { initiateReturn, getProduct } from "../../api/reloop";
import { ArrowRight, ArrowLeft, Upload, FileText, CheckCircle, AlertCircle, X } from "lucide-react";

export default function Step2ConditionCheck({ onNext, onBack }) {
  const { returnDetails, updateReturn } = useReturn();
  const { user } = useUser();
  const [product, setProduct] = useState(null);
  const [fetchingProduct, setFetchingProduct] = useState(true);

  const [reason, setReason] = useState(returnDetails.reason || "size mismatch");
  const [comment, setComment] = useState(returnDetails.comment || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Mock upload files state
  const [photos, setPhotos] = useState([]);

  const handleAddPhoto = () => {
    if (photos.length >= 3) return;
    const names = ["front_view.jpg", "back_view.jpg", "side_view.jpg"];
    const sizes = ["1.2 MB", "1.5 MB", "1.1 MB"];
    const nextIdx = photos.length;
    const newPhoto = {
      id: Date.now(),
      name: names[nextIdx] || `photo_${nextIdx + 1}.jpg`,
      size: sizes[nextIdx] || "1.0 MB"
    };
    setPhotos([...photos, newPhoto]);
  };

  const handleRemovePhoto = (id) => {
    setPhotos(photos.filter(p => p.id !== id));
  };

  useEffect(() => {
    if (returnDetails.productId) {
      setFetchingProduct(true);
      getProduct(returnDetails.productId).then((res) => {
        if (res && res.status === "ok") {
          const prodObj = res.product || res;
          setProduct(prodObj);
          // Set default reason if not already set
          if (!returnDetails.reason && prodObj.common_return_reasons?.length) {
            setReason(prodObj.common_return_reasons[0]);
          }
        }
      }).finally(() => setFetchingProduct(false));
    }
  }, [returnDetails.productId]);

  if (fetchingProduct || !product) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-3">
        <div className="w-8 h-8 border-4 border-[#16A34A] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-500">Loading product details...</p>
      </div>
    );
  }



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (photos.length === 0) {
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
          conditionImages: photos.map(p => p.name),
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
    <div className="space-y-6 text-slate-900">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-xl font-bold text-slate-900">Describe the return reason & inspect condition</h2>
        <p className="text-xs text-slate-500">Upload 2–3 clear photos of your item and select return reason details.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Return Reasons */}
        <div className="md:col-span-6 bg-white border border-[#D1FAE5] p-6 rounded-2xl space-y-4 shadow-sm text-left">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Reason Details</span>
          
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 block">Select Primary Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-[#F0FDF4] text-slate-800 border border-[#D1FAE5] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#16A34A]"
            >
              {(product.common_return_reasons || []).map((r, idx) => (
                <option key={idx} value={r}>{r}</option>
              ))}
              <option value="other">Other issues / defect</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 block">Describe the issue in detail</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="E.g. Screen works but battery drops from 100% to 50% within 2 hours of normal usage..."
              className="w-full h-28 bg-[#F0FDF4] text-slate-800 border border-[#D1FAE5] rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#16A34A] leading-normal"
              required
            />
          </div>
        </div>

        {/* Right Column: Photo Upload Drag-and-Drop */}
        <div className="md:col-span-6 bg-white border border-[#D1FAE5] p-6 rounded-2xl flex flex-col justify-between space-y-4 shadow-sm text-left">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Upload 2–3 clear photos of your item</span>
              <span className="text-[10px] font-bold text-slate-500 font-mono">{photos.length}/3</span>
            </div>
            
            {/* Drag-and-Drop Mock Zone */}
            <div 
              onClick={handleAddPhoto}
              className="border-2 border-dashed border-[#D1FAE5] hover:border-[#16A34A]/50 rounded-2xl p-6 text-center cursor-pointer transition-all bg-[#F0FDF4]/30 text-slate-500 flex flex-col items-center justify-center space-y-2 active:scale-98"
            >
              <Upload className="text-[#16A34A]" size={32} />
              <span className="text-xs font-bold text-slate-700">Drag and drop images here, or click to browse</span>
            </div>
            {/* Mock Thumbnail List */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 gap-3 animate-fade-in">
                {photos.map((photo) => (
                  <div key={photo.id} className="relative p-2 bg-[#F0FDF4] border border-[#D1FAE5] rounded-xl flex flex-col items-center space-y-1">
                    {/* Grey thumbnail box */}
                    <div className="w-full h-12 bg-white rounded-lg flex items-center justify-center text-slate-500 text-xl border border-slate-100">
                      📸
                    </div>
                    <span className="text-[9px] font-bold text-slate-600 truncate w-full text-center">{photo.name}</span>
                    <span className="text-[8px] text-slate-400">{photo.size}</span>
                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemovePhoto(photo.id);
                      }}
                      className="absolute top-1 right-1 p-1 bg-white hover:bg-slate-50 rounded-full text-slate-400 hover:text-red-500 transition-colors shadow-sm border border-slate-100"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-2.5 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle size={16} className="flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all active:scale-98"
            >
              <ArrowLeft size={14} /> Back
            </button>
            <button
              type="submit"
              disabled={loading || photos.length === 0}
              className="flex-1 py-3 bg-[#16A34A] hover:bg-[#15803D] disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer active:scale-98"
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
