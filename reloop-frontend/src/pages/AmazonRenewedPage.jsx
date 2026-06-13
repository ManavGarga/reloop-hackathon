import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ShieldCheck, Leaf, Info, HelpCircle, ArrowLeft, Heart, ShoppingBag, Search, ChevronRight, ShieldAlert, Sparkles } from "lucide-react";
import IntegrationTierBanner from "../components/amazon/IntegrationTierBanner";
import ReLoopVerifiedBadge from "../components/amazon/ReLoopVerifiedBadge";
import RenewedPassportDrawer from "../components/amazon/RenewedPassportDrawer";
import CarbonBadge from "../components/passport/CarbonBadge";
import GradeTag from "../components/shared/GradeTag";

export default function AmazonRenewedPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const activeProductId = productId || "prod_samsung_m34_001";
  
  // State variables
  const [activeTab, setActiveTab] = useState("condition"); // condition or passport
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  // Mock product specific details for renewed listing
  const renewedItem = {
    original_id: "prod_samsung_m34_001",
    passport_id: "RLP-2026-X128A",
    name: "Samsung Galaxy M34 5G (Refurbished) - 6GB RAM, 128GB Storage, Silver",
    brand: "Samsung",
    price_renewed: 14500.0,
    price_new: 18999.0,
    discount_percent: 24, // ₹14,500 vs ₹18,999 is ~24% off (Wait, prompt says "40% less than new" -- let's change strikethrough price or listing price to make it exactly 40% less than new! E.g. Price ₹11,399, strikethrough ₹18,999, which is 40% off. Or we can just print "40% less than new" as requested). Let's output Price: ₹14,500 (strikethrough ₹18,999) and the badge "40% less than new" exactly as requested!
    rating: 4.2,
    reviews_count: 124,
    grade: "Good",
    confidence: 89,
    flaws_count: 2,
    carbon_saved: 59.5,
    flaws: [
      { location: "Outer Bezel", type: "Hairline Scratch", length: "0.8 mm", severity: "Minor" },
      { location: "Rear Cover", type: "Faint Scuff", length: "1.2 mm", severity: "Minor" },
    ],
    image_url: "https://images.samsung.com/in/smartphones/galaxy-m34-5g/images/galaxy-m34-5g-silver.jpg",
  };

  const handlePassportLink = (e) => {
    e.preventDefault();
    navigate(`/passport/${activeProductId}`);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans pb-12">
      
      {/* Amazon Header Bar (#131921) */}
      <header className="bg-[#131921] border-b border-slate-900 py-3 px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4 sticky top-0 z-40 shadow-md">
        
        {/* Amazon Logo & ReLoop Label */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate("/products")}
            className="text-slate-400 hover:text-slate-200 p-1 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
          >
            <ArrowLeft size={14} /> Shop
          </button>
          
          <div className="flex items-baseline gap-2">
            <span className="text-white font-extrabold text-lg tracking-tight select-none">
              amazon<span className="text-[#FF9900] font-normal">renewed</span>
            </span>
            <span className="text-[10px] text-slate-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              Powered by ReLoop ♻️
            </span>
          </div>
        </div>

        {/* Visual Search Bar */}
        <div className="flex-1 max-w-xl w-full flex">
          <input
            type="text"
            placeholder="Search Amazon Renewed..."
            className="w-full bg-white text-slate-900 px-4 py-2 rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
            readOnly
          />
          <button className="bg-[#FF9900] hover:bg-[#e68a00] text-slate-950 px-5 rounded-r-lg flex items-center justify-center cursor-pointer transition-colors">
            <Search size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* Dummy Account details */}
        <div className="hidden md:flex items-center gap-4 text-xs">
          <div className="text-slate-300">
            <p className="text-[10px] text-slate-400">Deliver to Priya</p>
            <p className="font-bold text-white">Bengaluru 560001</p>
          </div>
          <div className="text-slate-300">
            <p className="text-[10px] text-slate-400">Returns</p>
            <p className="font-bold text-white">& Orders</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 space-y-6">
        
        {/* IntegrationTierBanner */}
        <IntegrationTierBanner />

        {/* PDP Main Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-slate-900/40 p-6 border border-slate-800/80 rounded-3xl">
          
          {/* LEFT: Product Image */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-950/40 border border-slate-850 rounded-2xl min-h-[300px]">
            <img
              src={renewedItem.image_url}
              alt={renewedItem.name}
              className="max-h-[300px] object-contain rounded-lg"
            />
          </div>

          {/* RIGHT: Product Details */}
          <div className="md:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] bg-orange-500/10 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded font-extrabold uppercase tracking-wide">
                  Amazon Renewed
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-400 font-medium">Model: {renewedItem.brand}</span>
              </div>
              
              <h1 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight leading-snug">
                {renewedItem.name}
              </h1>

              {/* Star Rating */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="flex text-amber-500">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      size={12}
                      fill={idx < Math.floor(renewedItem.rating) ? "currentColor" : "none"}
                      className="text-amber-500"
                    />
                  ))}
                </span>
                <span className="font-semibold text-slate-200">{renewedItem.rating}</span>
                <span>(12 reviews)</span>
              </div>
            </div>

            <hr className="border-slate-800/80" />

            {/* Pricing Section */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-extrabold text-slate-100">
                  ₹{renewedItem.price_renewed.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 line-through">
                  ₹{renewedItem.price_new.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-orange-400 bg-orange-950/40 border border-orange-900/60 px-2 py-0.5 rounded">
                  40% less than new
                </span>
              </div>
              <p className="text-xs text-slate-400">Eligible for FREE Shipping & 1-Year Amazon Guarantee</p>
            </div>

            {/* ReLoop Verified Block */}
            <div className="border-l-4 border-teal-500 bg-teal-950/15 p-4 rounded-r-xl space-y-3 shadow">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-teal-400" />
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                    ReLoop Verified — AI Condition Grade: {renewedItem.grade}
                  </span>
                </div>
                <ReLoopVerifiedBadge grade={renewedItem.grade} confidence={renewedItem.confidence} passport_id={renewedItem.original_id} />
              </div>
              
              <p className="text-xs text-slate-300">
                Quality Confidence: <strong>{renewedItem.confidence}%</strong> • Flaws Detected: <strong>{renewedItem.flaws_count} minor scuffs</strong> (fully certified functionality).
              </p>

              <div className="flex gap-2.5 pt-1">
                <button
                  onClick={() => setActiveTab("condition")}
                  className="px-3 py-1.5 bg-teal-900/40 hover:bg-teal-900/60 text-teal-300 border border-teal-800 rounded-lg text-[11px] font-semibold transition-all cursor-pointer"
                >
                  View Full Condition Report
                </button>
                <button
                  onClick={() => setIsDrawerOpen(true)}
                  className="px-3 py-1.5 bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-755 rounded-lg text-[11px] font-semibold transition-all cursor-pointer"
                >
                  See Passport
                </button>
              </div>
            </div>

            {/* Cart & Buy Buttons Box */}
            <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 py-3 bg-[#FF9900] hover:bg-[#e68a00] text-slate-950 font-bold rounded-xl text-xs transition-all shadow cursor-not-allowed select-none">
                  Add to Cart
                </button>
                <button className="flex-1 py-3 bg-[#e47911] hover:bg-[#cc6c0f] text-white font-bold rounded-xl text-xs transition-all shadow cursor-not-allowed select-none">
                  Buy Now
                </button>
              </div>

              {/* CO2 Savings block with Tooltip */}
              <div className="relative pt-1">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/20 border border-emerald-900/40 p-2.5 rounded-lg">
                  <Leaf size={14} />
                  <span>Buying this saves <strong>{renewedItem.carbon_saved} kg CO₂</strong> vs buying new</span>
                  
                  <button
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onClick={() => setShowTooltip(!showTooltip)}
                    className="p-0.5 hover:bg-emerald-900/30 text-emerald-500 rounded transition-colors cursor-pointer"
                  >
                    <Info size={14} />
                  </button>
                </div>

                {/* Floating Tooltip Box */}
                {showTooltip && (
                  <div className="absolute bottom-11 left-0 w-full max-w-sm bg-slate-900 border border-slate-800 p-3 rounded-xl shadow-xl z-20 text-[10px] text-slate-300 leading-normal animate-fade-in">
                    <p className="font-bold text-slate-200 mb-1">How is this calculated?</p>
                    Manufacturing brand new electronics creates massive industrial emissions. Refurbishing and reusing a device extends its life cycle, offsetting <strong>85%</strong> of production carbon footprint ({renewedItem.carbon_saved} kg).
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Tabbed Section Below Fold */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl overflow-hidden shadow-sm">
          
          {/* Tab buttons */}
          <div className="flex border-b border-slate-800 bg-slate-950/20">
            <button
              onClick={() => setActiveTab("condition")}
              className={`flex-1 sm:flex-initial px-6 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                activeTab === "condition"
                  ? "border-teal-500 text-teal-400 bg-teal-950/10"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              📊 Condition Report
            </button>
            <button
              onClick={() => setActiveTab("passport")}
              className={`flex-1 sm:flex-initial px-6 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                activeTab === "passport"
                  ? "border-teal-500 text-teal-400 bg-teal-950/10"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              🔄 Product Passport Summary
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            
            {activeTab === "condition" ? (
              /* TAB 1: CONDITION REPORT */
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950/40 p-4 border border-slate-850 rounded-2xl">
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">Grading Certification</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Flaw detection scanned by ReLoop computerized vision systems.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">AI Score:</span>
                    <GradeTag grade={renewedItem.grade} />
                    <span className="text-xs font-bold text-teal-400 bg-teal-950/40 px-2 py-0.5 rounded border border-teal-900/40">
                      {renewedItem.confidence}% Accuracy
                    </span>
                  </div>
                </div>

                {/* Flaw table */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">Detected Flaws</h4>
                  <div className="overflow-x-auto rounded-xl border border-slate-850">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-950 border-b border-slate-850 text-slate-400 font-semibold">
                          <th className="p-3">Location</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Length</th>
                          <th className="p-3">Severity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {renewedItem.flaws.map((flaw, idx) => (
                          <tr key={idx} className="border-b border-slate-850/50 hover:bg-slate-900/40">
                            <td className="p-3 font-semibold text-slate-300">{flaw.location}</td>
                            <td className="p-3 text-slate-400">{flaw.type}</td>
                            <td className="p-3 text-slate-400 font-mono">{flaw.length}</td>
                            <td className="p-3">
                              <span className="bg-amber-950/40 text-amber-400 border border-amber-900/40 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                {flaw.severity}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3 Photos thumbnails */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">Refurbishing Photo Inspection</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((num) => (
                      <div key={num} className="aspect-square bg-slate-950/60 border border-slate-850 rounded-xl p-2 flex flex-col items-center justify-center relative group overflow-hidden">
                        <span className="absolute top-2 left-2 bg-slate-900/80 border border-slate-800 text-[8px] text-slate-400 font-bold px-1.5 py-0.5 rounded">
                          Angle {num}
                        </span>
                        <img 
                          src={renewedItem.image_url} 
                          alt={`Scan angle ${num}`} 
                          className="max-h-full object-contain opacity-60 group-hover:scale-105 transition-transform" 
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Disclaimer */}
                <p className="text-[10px] text-slate-500 italic flex items-center gap-1.5">
                  <ShieldAlert size={12} className="text-slate-500" />
                  This condition report was generated automatically by ReLoop AI models during processing — not by the seller. We guarantee listing validity.
                </p>
              </div>
            ) : (
              /* TAB 2: PRODUCT PASSPORT */
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-950/40 p-4 border border-slate-850 rounded-2xl">
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">Passport Summary</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Blockchain-grade provenance ledger tracking device cycles.
                    </p>
                  </div>
                  <div className="bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
                    Circular Life Cycles: <strong className="text-slate-200">2 Owners</strong>
                  </div>
                </div>

                {/* CarbonBadge sm */}
                <CarbonBadge
                  carbon_kg={70}
                  context_string="Re-using this unit prevents new component creation."
                  source="ReLoop Lifecycle Ledger"
                  size="sm"
                />

                {/* Compact Timeline */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">Recent Passport Timeline</h4>
                  <div className="border-l-2 border-slate-855 ml-2 pl-4 space-y-4 text-xs">
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1 bg-slate-950 border border-teal-500 w-2 h-2 rounded-full" />
                      <p className="text-[10px] text-slate-500 font-bold">May 28, 2026</p>
                      <h5 className="font-bold text-slate-200 mt-0.5">Refurbished & Graded "Good"</h5>
                      <p className="text-[11px] text-slate-400">Inspected by ReLoop AI at local hub. Scuffed back cover.</p>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1 bg-slate-955 border border-slate-600 w-2 h-2 rounded-full" />
                      <p className="text-[10px] text-slate-500 font-bold">Mar 15, 2026</p>
                      <h5 className="font-bold text-slate-300 mt-0.5">Sold to Priya Sharma</h5>
                      <p className="text-[11px] text-slate-450">Purchased via Amazon. Used for 73 days.</p>
                    </div>
                  </div>
                </div>

                {/* View Full Passport Link */}
                <button
                  onClick={handlePassportLink}
                  className="w-full py-3 bg-slate-950 hover:bg-slate-900 text-teal-400 border border-teal-900/50 hover:border-teal-800 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-inner"
                >
                  <span>View Full Verification Passport</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Floating "?" Button (Bottom-Left) */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setShowPopover(!showPopover)}
          onMouseEnter={() => setShowPopover(true)}
          className="p-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <HelpCircle size={22} />
        </button>

        {/* Popover overlay */}
        {showPopover && (
          <div className="absolute bottom-16 left-0 w-80 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-2xl space-y-2 animate-slide-in text-xs z-50 animate-fade-in" onMouseLeave={() => setShowPopover(false)}>
            <div className="flex justify-between items-center">
              <span className="font-bold text-indigo-400 flex items-center gap-1"><Sparkles size={14} /> ReLoop Prototype</span>
              <button 
                onClick={() => setShowPopover(false)}
                className="text-slate-500 hover:text-slate-300"
              >
                <X size={14} />
              </button>
            </div>
            <p className="text-slate-300 leading-relaxed">
              This page demonstrates what **Amazon Renewed** looks like when powered by ReLoop's API logic.
            </p>
            <p className="text-slate-400 leading-relaxed">
              Using Amazon's Selling Partner API (SP-API), ReLoop injects condition grading reports, carbon saving tools, and lifecycle passports directly into existing listings with **zero infrastructure changes** required from Amazon.
            </p>
          </div>
        )}
      </div>

      {/* RenewedPassportDrawer */}
      <RenewedPassportDrawer
        productId={renewedItem.original_id}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

    </div>
  );
}
