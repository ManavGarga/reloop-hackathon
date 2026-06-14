import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Link as LinkIcon, Shield, Milestone, Calendar, User, MapPin, Leaf, Eye, Sparkles, AlertCircle, Factory, ShoppingCart, Recycle, Tag, Share2, ExternalLink, ShieldAlert, Award } from "lucide-react";
import { getPassport } from "../api/reloop";
import ReLoopVerifiedBadge from "../components/amazon/ReLoopVerifiedBadge";

const EVENT_ICONS = {
  "Manufactured": Factory,
  "Purchased": ShoppingCart,
  "Returned & Graded": Recycle,
  "Listed on Amazon Renewed": Tag
};

export default function PassportPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const activeProductId = productId || "prod_samsung_m34_001";
  const isJacket = activeProductId.includes("jacket") || activeProductId === "prod_levis_jacket_001" || activeProductId === "JACKET_001";

  const [loading, setLoading] = useState(true);
  const [passportData, setPassportData] = useState(null);
  const [viewMode, setViewMode] = useState("owner"); // owner or buyer
  const [toastMessage, setToastMessage] = useState("");
  const [animateBars, setAnimateBars] = useState(false);

  // Fetch passport data
  useEffect(() => {
    let active = true;
    setLoading(true);
    getPassport(activeProductId)
      .then((res) => {
        if (!active) return;
        if (res && res.status === "ok" && !res.mock) {
          setPassportData(res);
        } else {
          // Fallback static mock data depending on productId
          setPassportData({
            product_id: activeProductId,
            product_name: isJacket ? "Levi's Trucker Denim Jacket" : "Samsung Galaxy M34 5G",
            brand: isJacket ? "Levi's" : "Samsung",
            passport_id: isJacket ? "RLP-2026-C892X" : "RLP-2026-X128A",
            current_status: isJacket ? "resold" : "in_use",
            lives_count: isJacket ? 3 : 2,
            trust_score: isJacket ? 78 : 90,
            total_co2_kg: isJacket ? 22.0 : 70.0,
            events: isJacket 
              ? [
                  {
                    event_type: "resold",
                    title: "Listed on Amazon Renewed",
                    date: "14 June 2026",
                    actor: "ReLoop System",
                    grade: "Good",
                    notes: "Listed as Amazon Renewed Certified — Grade: Good.",
                    location: "Bengaluru, KA",
                    co2_delta_kg: 0.0,
                  },
                  {
                    event_type: "returned",
                    title: "Returned & Graded",
                    date: "14 June 2026",
                    actor: "ReLoop AI",
                    grade: "Good",
                    notes: "Returned via ReLoop. AI grading: Good (89% confidence). Flaws detected: Lint on fabric (Low severity).",
                    location: "Bengaluru, KA",
                    co2_delta_kg: -18.5,
                  },
                  {
                    event_type: "sold",
                    title: "Purchased",
                    date: "10 April 2026",
                    actor: "Priya Sharma (original owner)",
                    grade: "New",
                    notes: "Purchased new on Amazon.in. Grade at purchase: New.",
                    location: "Bengaluru, KA",
                    co2_delta_kg: 0.0,
                  },
                  {
                    event_type: "manufactured",
                    title: "Manufactured",
                    date: "August 2025",
                    actor: "System",
                    grade: "New",
                    notes: "Levi's Trucker Denim Jacket manufactured at Dhaka facility.",
                    location: "Dhaka, Bangladesh",
                    co2_delta_kg: 22.0,
                  }
                ]
              : [
                  {
                    event_type: "resold",
                    title: "Listed on Amazon Renewed",
                    date: "14 June 2026",
                    actor: "ReLoop System",
                    grade: "Good",
                    notes: "Listed as Amazon Renewed Certified — Grade: Good.",
                    location: "Bengaluru, KA",
                    co2_delta_kg: 0.0,
                  },
                  {
                    event_type: "returned",
                    title: "Returned & Graded",
                    date: "14 June 2026",
                    actor: "ReLoop AI",
                    grade: "Good",
                    notes: "Returned via ReLoop. AI grading: Good (89% confidence). Flaws detected: Back panel scuff (Low severity).",
                    location: "Bengaluru, KA",
                    co2_delta_kg: -59.5,
                  },
                  {
                    event_type: "sold",
                    title: "Purchased",
                    date: "15 March 2026",
                    actor: "Priya Sharma (original owner)",
                    grade: "New",
                    notes: "Purchased new on Amazon.in. Grade at purchase: New.",
                    location: "Bengaluru, KA",
                    co2_delta_kg: 0.0,
                  },
                  {
                    event_type: "manufactured",
                    title: "Manufactured",
                    date: "January 2026",
                    actor: "System",
                    grade: "New",
                    notes: "Samsung Galaxy M34 manufactured at Noida facility.",
                    location: "Noida, UP",
                    co2_delta_kg: 70.0,
                  }
                ]
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading passport", err);
        setLoading(false);
      });
    return () => { active = false; };
  }, [activeProductId, isJacket]);

  // Set default view mode based on fetched product status
  useEffect(() => {
    if (passportData) {
      const currentStatus = passportData.current_status || (isJacket ? "resold" : "in_use");
      setViewMode(currentStatus === "resold" ? "buyer" : "owner");
    }
  }, [passportData, isJacket]);

  useEffect(() => {
    const t = setTimeout(() => setAnimateBars(true), 150);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(""), 3000);
    return () => clearTimeout(t);
  }, [toastMessage]);

  if (loading || !passportData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold">Retrieving circular product passport...</p>
        </div>
      </div>
    );
  }

  // Enrich passport events formatting
  const enrichedEvents = (passportData.events || []).map(event => {
    let eventDate = event.date;
    if (!eventDate && event.timestamp) {
      try {
        const d = new Date(event.timestamp);
        if (!isNaN(d.getTime())) {
          eventDate = d.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric"
          });
        } else {
          eventDate = event.timestamp;
        }
      } catch (e) {
        eventDate = event.timestamp;
      }
    }
    if (!eventDate) eventDate = "14 June 2026";

    const eventTitle = event.title || (() => {
      const type = event.event_type || "";
      const titleMap = {
        manufactured: "Manufactured",
        sold: "Purchased",
        returned: "Returned & Graded",
        refurbished: "Inspected & Graded by ReLoop AI",
        resold: "Listed on Amazon Renewed",
        p2p_sold: "Resold (P2P)",
        donated: "Donated to Charity",
        recycled: "Recycled",
        repaired: "Repaired & Restored"
      };
      if (titleMap[type]) return titleMap[type];
      return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    })();

    return {
      ...event,
      title: eventTitle,
      date: eventDate,
      actor: event.actor || "System",
      location: event.location || "Bengaluru, KA",
      co2_delta_kg: event.co2_delta_kg !== undefined ? event.co2_delta_kg : 0.0
    };
  });

  const enrichedPassport = {
    ...passportData,
    brand: passportData.brand || (isJacket ? "Levi's" : "Samsung"),
    product_name: passportData.product_name || (isJacket ? "Levi's Trucker Denim Jacket" : "Samsung Galaxy M34 5G"),
    passport_id: passportData.passport_id || (isJacket ? "RLP-2026-C892X" : "RLP-2026-X128A"),
    current_status: passportData.current_status || (isJacket ? "resold" : "in_use"),
    lives_count: passportData.lives_count !== undefined ? passportData.lives_count : (isJacket ? 3 : 2),
    trust_score: passportData.trust_score !== undefined ? passportData.trust_score : (isJacket ? 78 : 90),
    total_co2_kg: passportData.total_co2_kg !== undefined ? passportData.total_co2_kg : (isJacket ? 22.0 : 70.0),
    events: enrichedEvents
  };

  const product = {
    name: enrichedPassport.product_name,
    brand: enrichedPassport.brand,
    category: isJacket ? "Clothing" : "Electronics",
    passportId: enrichedPassport.passport_id,
    grade: enrichedPassport.events?.find(e => e.grade)?.grade || "Good",
    confidence: 89,
    lives: `${enrichedPassport.lives_count} owners`,
    trustScore: String(enrichedPassport.trust_score),
    carbonMfg: isJacket ? 22.0 : 70.0,
    carbonSaved: isJacket ? 18.5 : 59.5,
    carbonNet: isJacket ? 3.5 : 10.5,
    equivalence: isJacket
      ? "Equivalent to 88 km not driven in a petrol car"
      : "Equivalent to 283 km not driven in a petrol car",
    source: isJacket
      ? "Source: Ellen MacArthur Foundation, ReLoop clothing database"
      : "Source: Dell lifecycle analysis, Ellen MacArthur Foundation"
  };

  const timelineEvents = enrichedPassport.events.map(event => {
    const isPositive = event.co2_delta_kg <= 0;
    return {
      title: event.title,
      notes: event.notes || (event.event_type === "returned" ? "Returned via ReLoop. AI grading: Good." : `${event.title} at local facility.`),
      carbon: event.co2_delta_kg !== 0 
        ? `${isPositive ? "+" : ""}${Math.abs(event.co2_delta_kg).toFixed(1)} kg CO₂e` 
        : "0.0 kg CO₂e",
      isPositive: isPositive,
      date: event.date,
      actor: event.actor,
      location: event.location,
      showBadge: event.event_type === "resold"
    };
  });

  return (
    <div className="bg-[#F0FDF4] min-h-screen w-full py-6 flex justify-center items-start" style={{ color: "#111111", fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }}>
      <div className="w-full max-w-4xl bg-white min-h-[90vh] shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-[#D1FAE5] rounded-3xl px-6 py-8 space-y-8 text-left relative">
      
        {/* Header back button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-slate-100">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-xs font-semibold text-[#16A34A] hover:text-[#14532D] transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Eco Dashboard
          </button>
        </div>

        {/* SECTION 1 — PASSPORT HERO HEADER */}
        <div 
          className="text-white rounded-3xl p-6 md:p-8 space-y-5 shadow-lg relative overflow-hidden"
          style={{
            background: "linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), linear-gradient(135deg, #14532D, #16A34A)"
          }}
        >
          <div className="space-y-2 relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-200 block">
              🛂 Product Lifecycle Passport
            </span>
            <h2 className="text-3xl md:text-[32px] font-black tracking-tight leading-tight text-white">{product.name}</h2>
          </div>

          {/* Pill Tags Row */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1 relative z-10">
            <span className="bg-white/95 text-[#14532D] text-[11px] font-bold px-3 py-1 rounded-[6px] shadow-xs">
              ID: {product.passportId}
            </span>
            <span className="bg-white/95 text-[#14532D] text-[11px] font-bold px-3 py-1 rounded-[6px] shadow-xs">
              Brand: {product.brand}
            </span>
            <span className="bg-white/95 text-[#14532D] text-[11px] font-bold px-3 py-1 rounded-[6px] shadow-xs">
              Category: {product.category}
            </span>
          </div>

          {/* Status Badges Rounded Pills Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-white/10 relative z-10">
            <span className="bg-[#16A34A] text-white text-[11px] font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wide shadow-xs border border-[#16A34A]">
              {product.grade}
            </span>
            <span className="bg-white border-2 border-[#D97706] text-[#D97706] text-[11px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wide shadow-xs">
              {viewMode === "buyer" ? "resold" : "returned"}
            </span>
            
            <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100 px-3.5 py-1.5 rounded-full shadow-xs font-bold">
              <LinkIcon size={12} className="text-slate-500" />
              <span>Lives: {product.lives}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-100 px-3.5 py-1.5 rounded-full shadow-xs font-bold">
              <span>Trust Score:</span>
              <div className="w-14 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#16A34A] rounded-full transition-all duration-1000" style={{ width: `${parseFloat(product.trustScore)}%` }} />
              </div>
              <span>{product.trustScore}/100</span>
            </div>
          </div>
        </div>

        {/* SECTION 2 — LIFECYCLE TIMELINE CONTAINER */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Milestone size={18} className="text-[#16A34A]" />
            <span>Circular Lifecycle History</span>
          </h3>

          {/* Stepper track */}
          <div className="relative border-l-2 border-[#D1FAE5] ml-5 pl-8 space-y-8 py-2">
            {timelineEvents.map((event, idx) => {
              const IconComponent = EVENT_ICONS[event.title] || Milestone;
              return (
                <div key={idx} className="relative">
                  {/* Event Marker Node */}
                  <div className="absolute -left-[51px] top-0 bg-[#16A34A] text-white border-2 border-white w-10 h-10 rounded-full flex items-center justify-center shadow-md z-10">
                    <IconComponent size={16} />
                  </div>

                  {/* Event Card */}
                  <div className="bg-white border border-slate-150 p-4 rounded-xl space-y-2 shadow-xs hover:shadow-sm transition-all duration-200">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 leading-snug">{event.title}</h4>
                        <p className="text-[13px] text-slate-650 leading-relaxed mt-1">
                          {event.notes}
                        </p>
                      </div>
                      
                      {event.carbon && event.carbon !== "0.0 kg CO₂e" && (
                        <span className={`text-[10px] px-2.5 py-0.5 rounded font-bold border flex-shrink-0 ${
                          event.isPositive 
                            ? "bg-green-50 text-[#16A34A] border-green-200" 
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}>
                          {event.carbon}
                        </span>
                      )}
                    </div>

                    {event.showBadge && (
                      <div className="pt-1">
                        <ReLoopVerifiedBadge grade={product.grade} confidence={product.confidence} passport_id={activeProductId} size="inline" />
                      </div>
                    )}

                    <div className="text-xs text-slate-400 font-semibold pt-2 border-t border-slate-50 flex flex-wrap gap-2.5">
                      <span>Date: {event.date}</span>
                      <span>•</span>
                      <span>By: {event.actor}</span>
                      <span>•</span>
                      <span>At: {event.location}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 3 — CARBON BADGE */}
        <div className="bg-[#F0FDF4] border border-[#D1FAE5] p-6 rounded-3xl space-y-5 shadow-sm text-left">
          <h4 className="text-sm font-bold text-[#14532D] flex items-center gap-1.5">
            <Leaf size={16} className="text-[#16A34A]" />
            <span>Total Carbon Impact of This Item's Journey</span>
          </h4>

          <div className="space-y-4 bg-white border border-[#D1FAE5] rounded-2xl p-5 shadow-xs">
            {/* Bar 1: Manufacturing */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-650">Manufacturing Emissions (New Product)</span>
                <span className="text-red-600 font-bold">-{product.carbonMfg} kg CO₂</span>
              </div>
              <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#EF4444] rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: animateBars ? "100%" : "0%" }} 
                />
              </div>
            </div>

            {/* Bar 2: Saved by Returning */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-650">Emissions Prevented (ReLoop Resale)</span>
                <span className="text-emerald-600 font-bold">+{product.carbonSaved} kg CO₂</span>
              </div>
              <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#16A34A] rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: animateBars ? `${(product.carbonSaved / product.carbonMfg) * 100}%` : "0%" }} 
                />
              </div>
            </div>

            {/* Bar 3: Net Footprint */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-650">Net Circular Footprint</span>
                <span className="text-[#0D9488] font-bold">{product.carbonNet} kg CO₂</span>
              </div>
              <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#0D9488] rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: animateBars ? `${(product.carbonNet / product.carbonMfg) * 100}%` : "0%" }} 
                />
              </div>
            </div>
          </div>

          {/* Green highlight callout box */}
          <div className="bg-white border border-[#D1FAE5] rounded-xl p-4 flex items-center gap-3.5 shadow-xs">
            <span className="text-3xl flex-shrink-0">🚗</span>
            <div>
              <p className="text-sm font-bold text-[#14532D] leading-snug">{product.equivalence}</p>
              <p className="text-[10px] text-slate-500 italic mt-0.5">{product.source}</p>
            </div>
          </div>
        </div>

        {/* SECTION 4 — WHAT THIS MEANS FOR YOU */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">What This Means For You</h3>
            
            {/* Segmented Control (Pill tabs) */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">👤 Viewing as:</span>
              <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setViewMode("owner")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                    viewMode === "owner" 
                      ? "bg-white text-[#16A34A] shadow-xs" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Original Owner
                </button>
                <button
                  onClick={() => setViewMode("buyer")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                    viewMode === "buyer" 
                      ? "bg-white text-[#16A34A] shadow-xs" 
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Buyer View (Resold)
                </button>
              </div>
            </div>
          </div>

          {viewMode === "buyer" ? (
            /* Buyer View Context (resold == true) */
            <div className="space-y-6 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Card 1 */}
                <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-1">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>🤖</span> AI-Verified Condition
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Grade confirmed by ReLoop's vision AI — not self-reported by seller.
                  </p>
                </div>

                {/* Card 2 */}
                <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-1">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>📋</span> Full History Disclosed
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Every event since manufacturing is recorded and tamper-proof.
                  </p>
                </div>

                {/* Card 3 */}
                <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-1">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>🌱</span> Carbon Positive Purchase
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Buying this saves {product.carbonSaved}kg CO₂ vs buying new.
                  </p>
                </div>

                {/* Card 4 */}
                <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-2">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>🛒</span> Amazon Renewed Listed
                    </h4>
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider">
                      amazon renewed
                    </span>
                  </div>
                </div>
              </div>

              {/* Grey Banner warning */}
              <div className="bg-[#FDF8E2] text-[#565959] border border-[#F5D8A0] p-4 rounded-xl text-xs flex items-center gap-3 shadow-sm">
                <ShieldAlert size={18} className="text-[#a88734] flex-shrink-0" />
                <span>This passport cannot be edited by any seller. Once generated, all events are permanently signed.</span>
              </div>
            </div>
          ) : (
            /* STATE B (current_status != "resold") — original owner context */
            <div className="space-y-6 text-left">
              <p className="text-xs text-slate-650 leading-relaxed font-semibold">
                Your item's passport is live. When it sells on Amazon Renewed, the next buyer will see this full history.
              </p>

              {/* Preview Card with realistic product card shadow and product thumbnail image */}
              <div className="bg-white border border-slate-200/85 rounded-2xl p-5 shadow-lg flex gap-4 items-center max-w-lg">
                {/* Product Thumbnail Image Placeholder */}
                <div className="w-24 h-24 rounded-xl bg-slate-50 border border-slate-100 p-1.5 flex items-center justify-center flex-shrink-0">
                  <img 
                    src={isJacket ? "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=300&q=80" : "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=300&q=80"} 
                    alt={product.name} 
                    className="max-h-full max-w-full object-contain rounded-lg" 
                  />
                </div>
                <div className="space-y-2 min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Listing Preview for Buyers
                  </span>
                  <ReLoopVerifiedBadge grade={product.grade} confidence={product.confidence} passport_id={activeProductId} size="card" />
                </div>
              </div>

              {/* CTA Buttons Row */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => navigate(`/renewed/${activeProductId}`)}
                  className="flex-1 h-12 flex items-center justify-center gap-2 bg-[#16A34A] hover:bg-[#14532D] text-white font-extrabold rounded-xl text-xs transition-all shadow-xs cursor-pointer border border-transparent"
                >
                  See how your item appears on Amazon Renewed
                  <ExternalLink size={16} />
                </button>
                <button
                  onClick={() => setToastMessage("Passport link copied to clipboard!")}
                  className="h-12 px-6 flex items-center justify-center gap-2 bg-white border border-[#16A34A] text-[#16A34A] hover:bg-[#F0FDF4] font-extrabold rounded-xl text-xs transition-all cursor-pointer shadow-xs"
                >
                  <Share2 size={16} />
                  Share Passport
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-white border border-slate-200 text-[#111] px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 z-50 animate-fade-in">
          <Sparkles size={15} className="text-[#16A34A] flex-shrink-0 animate-pulse" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
