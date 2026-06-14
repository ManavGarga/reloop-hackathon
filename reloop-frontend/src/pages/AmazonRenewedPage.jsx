import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronRight, X, Info, Recycle, Star, Truck, ShoppingCart, Leaf, Search, Tag, History, ShieldCheck, ArrowLeft, Heart, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { getPassport } from "../api/reloop";

// ── Product Mockup SVG Component ───────────────────────────────────────────
function ProductMockup({ isJacket, angle }) {
  if (isJacket) {
    if (angle === 1) {
      // Denim Jacket Front
      return (
        <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20,30 L35,25 L50,35 L60,30 L70,35 L85,25 L100,30 L95,60 L85,60 L85,100 L35,100 L35,60 L25,60 Z" fill="#3B5998" stroke="#1E2F52" strokeWidth="2" />
          <path d="M20,30 L25,60 M100,30 L95,60" stroke="#1E2F52" strokeWidth="1.5" />
          <path d="M35,25 L50,35 L60,28 L70,35 L85,25" fill="#4B6CB7" stroke="#1E2F52" strokeWidth="2" />
          <rect x="40" y="45" width="12" height="12" rx="1" fill="#4B6CB7" stroke="#1E2F52" strokeWidth="1.5" />
          <rect x="68" y="45" width="12" height="12" rx="1" fill="#4B6CB7" stroke="#1E2F52" strokeWidth="1.5" />
          <circle cx="46" cy="48" r="1.5" fill="#F59E0B" />
          <circle cx="74" cy="48" r="1.5" fill="#F59E0B" />
          <line x1="60" y1="35" x2="60" y2="100" stroke="#1E2F52" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="60" cy="62" r="2" fill="#F59E0B" />
          <circle cx="60" cy="74" r="2" fill="#F59E0B" />
          <circle cx="60" cy="86" r="2" fill="#F59E0B" />
          <path d="M35,100 L85,100" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      );
    } else if (angle === 2) {
      // Denim Jacket Back
      return (
        <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20,30 L35,25 L50,35 L60,30 L70,35 L85,25 L100,30 L95,60 L85,60 L85,100 L35,100 L35,60 L25,60 Z" fill="#2B4C7E" stroke="#1E2F52" strokeWidth="2" />
          <path d="M30,38 L90,38" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="2 2" />
          <path d="M50,38 L50,100 M70,38 L70,100" stroke="#1E2F52" strokeWidth="1" strokeDasharray="2 1" />
          <path d="M35,25 L50,35 C55,32 65,32 70,35 L85,25 Z" fill="#3B5998" stroke="#1E2F52" strokeWidth="1.5" />
          <rect x="38" y="94" width="8" height="4" rx="0.5" fill="#1E2F52" />
          <rect x="74" y="94" width="8" height="4" rx="0.5" fill="#1E2F52" />
        </svg>
      );
    } else {
      // Denim Jacket Detail view / Leather tag
      return (
        <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <rect x="15" y="25" width="90" height="70" rx="4" fill="#C68B59" stroke="#8A5A36" strokeWidth="3" />
          <rect x="19" y="29" width="82" height="62" rx="2" stroke="#F59E0B" strokeWidth="1" strokeDasharray="3 2" />
          <text x="60" y="46" fill="#5D3A1A" fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">LEVI STRAUSS &amp; CO.</text>
          <text x="60" y="56" fill="#8A5A36" fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">ORIGINAL RIVETED</text>
          <text x="60" y="66" fill="#8A5A36" fontSize="5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">QUALITY CLOTHING</text>
          <text x="60" y="80" fill="#BE3A34" fontSize="8" fontWeight="black" textAnchor="middle" fontFamily="sans-serif">ReLoop Certified</text>
        </svg>
      );
    }
  } else {
    // Samsung Phone
    if (angle === 1) {
      // Phone Front (active screen)
      return (
        <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <rect x="32" y="10" width="56" height="100" rx="8" fill="#1E293B" stroke="#64748B" strokeWidth="2.5" />
          <rect x="35" y="13" width="50" height="94" rx="5" fill="url(#screenGrad)" />
          <path d="M54,13 C54,17 66,17 66,13 Z" fill="#1E293B" />
          <text x="60" y="34" fill="white" fontSize="9" fontWeight="black" textAnchor="middle" fontFamily="sans-serif">12:00</text>
          <text x="60" y="42" fill="white" fontSize="4.5" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif" opacity="0.8">SUNDAY, JUNE 14</text>
          
          <circle cx="47" cy="78" r="3" fill="#38BDF8" />
          <circle cx="56" cy="78" r="3" fill="#34D399" />
          <circle cx="65" cy="78" r="3" fill="#F472B6" />
          <circle cx="74" cy="78" r="3" fill="#FB7185" />
          
          <circle cx="47" cy="88" r="3" fill="#FBBF24" />
          <circle cx="56" cy="88" r="3" fill="#A78BFA" />
          <circle cx="65" cy="88" r="3" fill="#60A5FA" />
          <circle cx="74" cy="88" r="3" fill="#34D399" />
          <rect x="42" y="98" width="36" height="4" rx="1.5" fill="white" opacity="0.3" />
          
          <defs>
            <linearGradient id="screenGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
        </svg>
      );
    } else if (angle === 2) {
      // Phone Back (camera module)
      return (
        <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <rect x="32" y="10" width="56" height="100" rx="8" fill="url(#silverBack)" stroke="#94A3B8" strokeWidth="2.5" />
          <path d="M34,12 L34,108" stroke="white" strokeWidth="0.8" opacity="0.6" />
          <circle cx="43" cy="22" r="4" fill="#0F172A" stroke="#475569" strokeWidth="1" />
          <circle cx="43" cy="22" r="1.5" fill="#1E293B" />
          
          <circle cx="43" cy="32" r="4" fill="#0F172A" stroke="#475569" strokeWidth="1" />
          <circle cx="43" cy="32" r="1.5" fill="#1E293B" />
          
          <circle cx="43" cy="42" r="4" fill="#0F172A" stroke="#475569" strokeWidth="1" />
          <circle cx="43" cy="42" r="1.5" fill="#1E293B" />
          
          <rect x="39" y="17" width="8" height="30" rx="2" stroke="#475569" strokeWidth="1" strokeDasharray="1.5 1" />
          <rect x="73" y="24" width="4" height="6" rx="0.5" fill="#FBBF24" />
          
          <defs>
            <linearGradient id="silverBack" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="50%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
          </defs>
        </svg>
      );
    } else {
      // Phone side profile
      return (
        <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <rect x="56" y="10" width="8" height="100" rx="2" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="2" />
          <line x1="56" y1="12" x2="56" y2="108" stroke="white" strokeWidth="0.5" opacity="0.6" />
          <rect x="63" y="32" width="1.5" height="12" rx="0.5" fill="#475569" />
          <rect x="63" y="48" width="1.5" height="8" rx="0.5" fill="#475569" />
        </svg>
      );
    }
  }
}

export default function AmazonRenewedPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const activeProductId = productId || "prod_samsung_m34_001";
  const isJacket = activeProductId.includes("jacket") || activeProductId === "prod_levis_jacket_001" || activeProductId === "JACKET_001";
  const passportProductId = isJacket ? "prod_levis_jacket_001" : "prod_samsung_m34_001";
  const conditionReportRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState("condition");
  const [toastMessage, setToastMessage] = useState(null);
  const [passportLoading, setPassportLoading] = useState(true);
  const [showCarbonTooltip, setShowCarbonTooltip] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [activeThumb, setActiveThumb] = useState(1);

  // Static fallback (used if passport not found)
  const FALLBACK = {
    original_id: "prod_samsung_m34_001",
    passport_id: "RLP-2026-X128A",
    name: "Samsung Galaxy M34 5G (Refurbished) - 6GB RAM, 128GB Storage, Silver",
    brand: "Samsung",
    price_renewed: 14500.0,
    price_new: 18999.0,
    discount_percent: 24,
    rating: 4.2,
    reviews_count: 1247,
    grade: "Good",
    confidence: 89,
    flaws_count: 2,
    carbon_saved: 59.5,
    flaws: [
      { location: "Outer Bezel", type: "Hairline Scratch", length: "0.8 mm", severity: "Minor" },
      { location: "Rear Cover", type: "Faint Scuff", length: "1.2 mm", severity: "Minor" },
    ],
    image_url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop",
    lives_count: 2,
    trust_score: 94,
    events: [],
  };

  const [renewedItem, setRenewedItem] = useState(FALLBACK);

  useEffect(() => {
    setPassportLoading(true);
    getPassport(activeProductId)
      .then((res) => {
        if (res && res.status === "ok" && res.product_name) {
          const latestEvent = res.events?.[0] || {};
          const grade = latestEvent.condition_at_event || "Good";
          const priceNew = isJacket ? 8999 : 18999;
          const priceRenewed = isJacket ? 4499 : 14500;
          const co2Saved = Math.abs(
            res.events?.reduce((acc, e) => acc + (e.co2_delta_kg < 0 ? e.co2_delta_kg : 0), 0) || 59.5
          );

          // Map passport flaw_breakdown from grade events if present
          const flawEvent = res.events?.find((e) => e.flaw_breakdown);
          const flaws = flawEvent?.flaw_breakdown || FALLBACK.flaws;

          setRenewedItem({
            original_id: res.product_id,
            passport_id: res.passport_id || "RLP-LIVE",
            name: `${res.product_name} (Refurbished)`,
            brand: res.brand || "ReLoop Certified",
            price_renewed: priceRenewed,
            price_new: priceNew,
            discount_percent: Math.round((1 - priceRenewed / priceNew) * 100),
            rating: 4.2,
            reviews_count: 1247,
            grade,
            confidence: 89,
            flaws_count: flaws.length,
            carbon_saved: co2Saved,
            flaws,
            image_url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop",
            lives_count: res.lives_count || 2,
            trust_score: res.trust_score || 90,
            events: res.events || [],
          });
        }
      })
      .catch(() => {})
      .finally(() => setPassportLoading(false));
  }, [activeProductId, isJacket]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const scrollToConditionReport = (e) => {
    e.preventDefault();
    setActiveTab("condition");
    conditionReportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Compact timeline events for passport tab
  const timelineEvents = [
    {
      dotColor: "bg-teal-500",
      type: "Listed on Amazon Renewed",
      date: "14 June 2026",
      note: "Listed as Renewed Certified — Grade: Good",
    },
    {
      dotColor: "bg-yellow-500",
      type: "Returned & Graded",
      date: "14 June 2026",
      note: "AI grade: Good, 89% confidence",
    },
    {
      dotColor: "bg-blue-500",
      type: "Purchased",
      date: isJacket ? "10 April 2026" : "15 March 2026",
      note: "Purchased new on Amazon.in",
    },
  ];

  // Condition flaw rows (spec-defined)
  const conditionRows = isJacket ? [
    { location: "Fabric", description: "Faint lint on fabric, low severity", severity: "Low" },
    { location: "Buttons", description: "All original buttons intact", severity: "None" },
    { location: "Stitching", description: "No loose threads detected", severity: "None" },
  ] : [
    { location: "Back panel", description: "Minor scuff near camera", severity: "Low" },
    { location: "Screen", description: "No visible scratches", severity: "None" },
    { location: "Ports", description: "All functional", severity: "None" },
  ];

  const severityDots = {
    Low: (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-250/70">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> Low
      </span>
    ),
    None: (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-250/70">
        <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" /> None
      </span>
    ),
    High: (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-250/70">
        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" /> High
      </span>
    )
  };

  if (passportLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4 bg-[#F9FAFB]">
        <Loader2 className="w-10 h-10 animate-spin text-[#16A34A]" />
        <p className="text-sm font-semibold text-slate-600">Loading renewed item details...</p>
      </div>
    );
  }

  return (
    <div style={{ background: "#F9FAFB", minHeight: "100vh", fontFamily: "Arial, sans-serif", color: "#111" }}>
      {/* CSS Shimmer Animation */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      {/* ═══════════════════════════════════════════════
          CUSTOM AMAZON RENEWED HEADER (replaces Navbar)
      ═══════════════════════════════════════════════ */}
      <header style={{ background: "#131921", padding: "0 24px" }}>
        <div
          style={{
            maxWidth: "1152px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: "24px",
            height: "60px",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "baseline", gap: "2px", flexShrink: 0 }}>
            <span style={{ color: "white", fontWeight: "bold", fontSize: "22px", fontFamily: "Arial, sans-serif" }}>
              amazon
            </span>
            <span style={{ color: "#FF9900", fontWeight: "bold", fontSize: "13px", marginLeft: "2px", letterSpacing: "0.02em" }}>
              renewed
            </span>
          </div>

          {/* Search bar (non-functional) */}
          <div style={{ flex: 1, display: "flex", maxWidth: "600px" }}>
            <input
              type="text"
              placeholder="Search Amazon Renewed..."
              readOnly
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: "4px 0 0 4px",
                border: "none",
                outline: "none",
                background: "#f3f3f3",
                fontSize: "13px",
                color: "#555",
              }}
            />
            <button
              style={{
                background: "#FF9900",
                border: "none",
                borderRadius: "0 4px 4px 0",
                padding: "0 14px",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              🔍
            </button>
          </div>

          {/* Powered by ReLoop */}
          <span style={{ color: "#6b7280", fontSize: "11px", flexShrink: 0, marginLeft: "auto" }}>
            Powered by ReLoop ♻️
          </span>
        </div>
      </header>

      {/* ═══════════════════════════════════════
          SECONDARY NAV (Trust Bar)
      ═══════════════════════════════════════ */}
      <div className="w-full bg-[#F0FDF4] border-b border-[#86EFAC] py-2.5 px-4 flex justify-center items-center gap-4 flex-wrap text-xs text-[#14532D] font-semibold shadow-xs">
        <span className="bg-white px-3 py-1 rounded-full border border-[#86EFAC]">✓ All products AI-inspected</span>
        <span className="bg-white px-3 py-1 rounded-full border border-[#86EFAC]">✓ 1-Year Guarantee</span>
        <span className="bg-white px-3 py-1 rounded-full border border-[#86EFAC]">✓ Free Returns</span>
        <span className="bg-[#DCFCE7] px-3 py-1 rounded-full border border-[#86EFAC] text-[#16A34A] flex items-center gap-1 font-bold">
          ♻ ReLoop Certified
        </span>
      </div>

      {/* ═══════════════════════════════════════
          TOAST
      ═══════════════════════════════════════ */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: "80px",
            right: "24px",
            background: "#16A34A",
            color: "white",
            padding: "12px 24px",
            borderRadius: "4px",
            fontWeight: "bold",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 2000,
            fontSize: "13px",
          }}
        >
          {toastMessage}
        </div>
      )}

      <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px", padding: "24px 0" }}>
        
        {/* Navigation Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#565959", padding: "0 12px" }}>
          <button 
            onClick={() => navigate("/products")}
            style={{ background: "none", border: "none", color: "#16A34A", cursor: "pointer", fontSize: "13px", fontWeight: "bold" }}
          >
            ← Back to Marketplace
          </button>
          <ChevronRight size={12} />
          <span>Amazon Renewed</span>
          <ChevronRight size={12} />
          <span style={{ color: "#565959" }}>{renewedItem.name}</span>
        </div>

        {/* ═══════════════════════════════════════
            PRODUCT SECTION — TWO COLUMN
        ═══════════════════════════════════════ */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-8 shadow-sm">

          {/* LEFT: Image Gallery */}
          <div className="flex flex-col items-center gap-4">
            <div className="w-full max-w-[420px] h-[420px] bg-white rounded-lg border border-slate-200 relative overflow-hidden flex items-center justify-center p-6 group shadow-xs">
              <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 z-10 shadow-sm">
                🔄 360° View
              </span>
              <div className="w-full h-full flex items-center justify-center transform transition-transform duration-300 group-hover:scale-105">
                <ProductMockup isJacket={isJacket} angle={activeThumb} />
              </div>
            </div>

            <div className="flex gap-4">
              {[1, 2, 3].map((n) => {
                const angleLabel = n === 1 ? "Front View" : n === 2 ? "Back View" : isJacket ? "Detail Tag" : "Side View";
                return (
                  <div key={n} className="flex flex-col items-center gap-1.5">
                    <button
                      onClick={() => setActiveThumb(n)}
                      className={`w-20 h-20 bg-white rounded-lg border-2 flex items-center justify-center p-1.5 transition-all shadow-xs cursor-pointer ${
                        activeThumb === n ? "border-[#16A34A]" : "border-slate-200 hover:border-slate-300"
                      }`}
                      style={{ contentVisibility: "auto" }}
                    >
                      <div className="w-full h-full overflow-hidden flex items-center justify-center pointer-events-none">
                        <ProductMockup isJacket={isJacket} angle={n} />
                      </div>
                    </button>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{angleLabel}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Product details */}
          <div className="flex flex-col gap-4 text-left">

            {/* ROW 1: Badge + title */}
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 bg-[#16A34A] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                <Recycle size={11} className="text-white" />
                Amazon Renewed
              </span>
              <h1 className="text-2xl font-bold text-slate-900 leading-snug">
                {renewedItem.name}
              </h1>
            </div>

            {/* ROW 2: Rating */}
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= 4;
                  const isHalf = star === 5;
                  return (
                    <Star
                      key={star}
                      size={14}
                      className={isFilled ? "fill-[#F59E0B] text-[#F59E0B]" : isHalf ? "fill-[#F59E0B]/40 text-[#F59E0B]" : "text-slate-200 fill-none"}
                    />
                  );
                })}
              </div>
              <span>{renewedItem.rating}</span>
              <span className="text-slate-300">|</span>
              <span className="text-[#16A34A] hover:underline cursor-pointer font-medium">
                {renewedItem.reviews_count.toLocaleString()} ratings (Renewed)
              </span>
            </div>

            <hr className="border-slate-100" />

            {/* ROW 3: Price */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-[32px] font-black text-slate-900 leading-none">
                  ₹{renewedItem.price_renewed.toLocaleString()}
                </span>
                <span className="text-sm text-slate-400 line-through font-semibold">
                  ₹{renewedItem.price_new.toLocaleString()}
                </span>
                <span className="text-[11px] bg-[#DCFCE7] text-[#16A34A] border border-[#86EFAC] rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wide">
                  {renewedItem.discount_percent}% less than new
                </span>
              </div>
              <p className="text-[13px] text-[#16A34A] font-bold">
                Save ₹{(renewedItem.price_new - renewedItem.price_renewed).toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-[#16A34A] font-semibold pt-1">
                <Truck size={14} className="text-[#16A34A]" />
                <span>FREE Shipping &amp; 1-Year Amazon Guarantee</span>
              </div>
            </div>

            {/* ROW 4: ReLoop Verified Card */}
            <div className="border border-[#86EFAC] bg-[#F0FDF4] rounded-xl p-5 flex flex-col gap-4 shadow-xs">
              <div className="flex items-center gap-4">
                <div className="relative flex items-center justify-center w-16 h-16 flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="32" cy="32" r="28" stroke="#DCFCE7" strokeWidth="4" fill="transparent" />
                    <circle
                      cx="32" cy="32" r="28"
                      stroke="#16A34A" strokeWidth="4" fill="transparent"
                      strokeDasharray={2 * Math.PI * 28}
                      strokeDashoffset={2 * Math.PI * 28 * (1 - renewedItem.confidence / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-sm font-black text-[#14532D] leading-none">{renewedItem.grade}</span>
                    <span className="text-[9px] text-[#16A34A] font-bold mt-0.5">{renewedItem.confidence}%</span>
                  </div>
                </div>

                <div className="flex-1 text-left">
                  <h4 className="text-sm font-bold text-[#14532D]">ReLoop AI Verified</h4>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    {renewedItem.flaws_count} minor flaws detected · 100% functional
                  </p>
                </div>
              </div>

              {/* Refurbishment Lifecycle Mini-Stepper */}
              <div className="border-t border-[#86EFAC] pt-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-3 text-left">Refurbishment Lifecycle</p>
                <div className="flex items-center justify-between">
                  {[
                    { label: "Inspected", done: true },
                    { label: "Cleaned", done: true },
                    { label: "Graded", done: true },
                    { label: "Listed", done: false, active: true }
                  ].map((step, idx) => (
                    <div key={idx} className="flex items-center flex-1 last:flex-initial">
                      <div className="flex flex-col items-center relative z-10">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold relative transition-all duration-300 ${
                          step.done 
                            ? "bg-[#16A34A] text-white border-2 border-[#16A34A]" 
                            : step.active 
                              ? "bg-white border-2 border-[#16A34A] text-[#16A34A] shadow-[0_0_8px_rgba(22,163,74,0.5)] animate-pulse" 
                              : "bg-slate-200 text-slate-400"
                        }`}>
                          {step.done ? "✓" : "4"}
                          {step.active && (
                            <div className="absolute -inset-1 rounded-full border border-[#16A34A] animate-ping opacity-60" />
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 font-semibold mt-1.5">{step.label}</span>
                      </div>
                      {idx < 3 && (
                        <div className={`flex-1 h-[2px] mx-1 -mt-5 relative z-0 ${step.done ? "bg-[#16A34A]" : "bg-slate-200"}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-1 items-center">
                <button
                  onClick={scrollToConditionReport}
                  className="border border-[#16A34A] text-[#16A34A] hover:bg-[#DCFCE7]/30 text-[11px] font-bold px-3.5 py-1.5 rounded-lg cursor-pointer transition-all active:scale-98"
                >
                  View Condition Report
                </button>
                <button
                  onClick={() => navigate(`/passport/${passportProductId}`)}
                  className="text-[#16A34A] hover:text-[#14532D] hover:underline text-[11px] font-bold cursor-pointer flex items-center gap-0.5"
                >
                  See Passport →
                </button>
              </div>
            </div>

            {/* ROW 5: Purchase Action Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  addToCart(renewedItem);
                  showToast(`"${renewedItem.name}" added to cart!`);
                }}
                className="bg-[#16A34A] hover:bg-[#14532D] text-white font-bold w-full h-[52px] rounded-lg cursor-pointer transition-all text-[14px] flex items-center justify-center gap-2 shadow-xs active:scale-98"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
              <button 
                onClick={() => {
                  addToCart(renewedItem);
                  showToast(`Proceeding to checkout with "${renewedItem.name}"!`);
                }}
                className="bg-white border-2 border-[#16A34A] text-[#16A34A] hover:bg-[#DCFCE7]/20 font-bold w-full h-[52px] rounded-lg cursor-pointer transition-all text-[14px] flex items-center justify-center shadow-xs active:scale-98"
              >
                Buy Now
              </button>
            </div>

            {/* ROW 6: Carbon Pill Notice */}
            <div className="relative bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] text-xs font-bold py-2.5 px-4 rounded-full flex items-center justify-center gap-1.5 shadow-2xs">
              <Leaf size={14} className="text-[#16A34A]" />
              <span>♻ Buying this saves {renewedItem.carbon_saved} kg CO₂ vs buying new</span>
              <button
                onMouseEnter={() => setShowCarbonTooltip(true)}
                onMouseLeave={() => setShowCarbonTooltip(false)}
                onClick={() => setShowCarbonTooltip((v) => !v)}
                className="text-[#16A34A] hover:text-[#14532D] cursor-pointer flex-shrink-0"
                aria-label="Carbon info"
              >
                <Info size={14} />
              </button>
              {showCarbonTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 z-10 bg-slate-800 text-white text-xs rounded-lg p-3 w-64 shadow-xl leading-relaxed font-normal text-center">
                  Source: Dell lifecycle analysis, Ellen MacArthur Foundation, IPCC AR6. CO₂ calculation: 85% of manufacturing carbon saved via resale disposition.
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ═══════════════════════════════════════
            TABBED SECTION — CONDITION + PASSPORT
        ═══════════════════════════════════════ */}
        <div
          id="condition-report"
          ref={conditionReportRef}
          className="bg-white rounded-xl border border-slate-200 shadow-sm"
        >
          {/* Tab bar */}
          <div className="flex border-b border-slate-200 px-6">
            {[
              { id: "condition", label: "Condition Report" },
              { id: "passport", label: "Product Passport" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 mr-6 text-sm font-bold border-b-2 cursor-pointer transition-colors ${
                  activeTab === tab.id
                    ? "border-[#16A34A] text-[#16A34A]"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">

            {/* TAB 1: CONDITION REPORT */}
            {activeTab === "condition" && (
              <div className="space-y-6">
                {/* Grade + confidence */}
                <div className="flex items-center gap-6 mb-6">
                  <div>
                    <span className="bg-[#16A34A] text-white text-[14px] font-bold px-5 py-2 rounded-lg shadow-sm flex items-center justify-center w-fit">
                      {renewedItem.grade}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-black text-slate-800">
                      {renewedItem.confidence}% confidence
                    </p>
                    <p className="text-sm text-slate-500 font-semibold mt-1">
                      Our AI analyzed 3 photos to produce this grade
                    </p>
                  </div>
                </div>

                {/* Flaw table */}
                <table className="w-full mt-4 border-collapse text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      {["Location", "Description", "Severity"].map((h) => (
                        <th key={h} className="text-left text-xs font-bold text-slate-500 uppercase px-4 py-3 border-b border-slate-200">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {conditionRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#F0FDF4] transition-colors border-b border-slate-100">
                        <td className="px-4 py-3 text-sm text-slate-700 font-bold">{row.location}</td>
                        <td className="px-4 py-3 text-sm text-slate-700 font-medium">{row.description}</td>
                        <td className="px-4 py-3 text-sm">
                          {severityDots[row.severity] || row.severity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Photo Skeletons */}
                <div className="flex gap-4 mt-6 flex-wrap">
                  {[
                    { label: "Front view", icon: "📸" },
                    { label: "Back panel", icon: "🔍" },
                    { label: "Detail shot", icon: "🔎" }
                  ].map((photo, index) => (
                    <div
                      key={index}
                      className="w-36 h-36 bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer rounded-lg border border-slate-200 flex flex-col items-center justify-center gap-1.5 p-4 text-center shadow-xs"
                      style={{
                        animation: "shimmer 1.5s infinite linear"
                      }}
                    >
                      <span className="text-xl opacity-60">{photo.icon}</span>
                      <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{photo.label}</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <p className="text-xs italic text-slate-400 mt-6 pt-4 border-t border-slate-200 text-left">
                  This report was generated by ReLoop AI — not by the seller
                </p>
              </div>
            )}

            {/* TAB 2: PRODUCT PASSPORT */}
            {activeTab === "passport" && (
              <div className="text-left space-y-4">
                <h3 className="text-base font-bold text-slate-800">
                  Product Passport — Compact View
                </h3>

                {/* Compact timeline */}
                <div className="divide-y divide-slate-100">
                  {timelineEvents.map((event, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 py-3"
                    >
                      <span
                        className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${event.dotColor}`}
                      />
                      <div>
                        <p className="font-bold text-sm text-slate-800">{event.type}</p>
                        <p className="text-xs text-slate-400 font-semibold">{event.date}</p>
                        <p className="text-xs text-slate-650 mt-0.5 font-medium">{event.note}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex flex-col gap-3">
                  {/* View full passport link */}
                  <button
                    onClick={() => navigate(`/passport/${passportProductId}`)}
                    className="text-[#16A34A] hover:text-[#14532D] text-sm font-bold cursor-pointer w-fit"
                  >
                    View Full Passport →
                  </button>

                  {/* Lives count */}
                  <p className="text-xs text-slate-650 font-semibold mt-1">
                    👤 This product has had {renewedItem.lives_count} previous owner
                    {renewedItem.lives_count !== 1 ? "s" : ""}
                  </p>

                  {/* CO₂ badge */}
                  <div className="inline-flex items-center gap-2 bg-[#DCFCE7] border border-[#86EFAC] rounded-lg px-4 py-2 w-fit">
                    <span className="text-xs text-[#15803D] font-bold">
                      🌱 {renewedItem.carbon_saved} kg CO₂ saved by this item's journey
                    </span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          FLOATING HELP BUTTON (bottom-left)
      ═══════════════════════════════════════ */}
      <div className="fixed bottom-6 left-6 z-50">
        {helpOpen && (
          <div className="absolute bottom-14 left-0 bg-slate-800 text-white text-xs rounded-lg p-4 w-72 shadow-xl z-50 leading-relaxed text-left animate-fade-in">
            <button
              onClick={() => setHelpOpen(false)}
              className="absolute top-2 right-2 text-slate-400 hover:text-white text-sm cursor-pointer"
            >
              ×
            </button>
            <p className="font-semibold text-sm mb-2">About This Page</p>
            <p>
              This page shows what Amazon Renewed would look like powered by ReLoop.
            </p>
            <p className="mt-2">
              ReLoop integrates via Amazon SP-API as a Selling Partner App — no changes to Amazon's core infrastructure required.
            </p>
          </div>
        )}
        <button
          onClick={() => setHelpOpen((v) => !v)}
          className="w-10 h-10 rounded-full bg-white border-2 border-teal-500 shadow-lg text-teal-600 font-bold text-lg hover:bg-teal-50 cursor-pointer transition-colors flex items-center justify-center"
          aria-label="Help"
        >
          ?
        </button>
      </div>
    </div>
  );
}
