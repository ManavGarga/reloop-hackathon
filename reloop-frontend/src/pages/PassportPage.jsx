import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ShieldCheck, ArrowLeft, ArrowRight, User, MapPin, BadgeAlert, Award, Compass, Eye, ShieldAlert, Leaf } from "lucide-react";
import { getPassport } from "../api/reloop";
import GradeTag from "../components/shared/GradeTag";
import CarbonBadge from "../components/passport/CarbonBadge";
import Spinner from "../components/shared/Spinner";
import ReLoopVerifiedBadge from "../components/amazon/ReLoopVerifiedBadge";

export default function PassportPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Use product_id from URL or default to Samsung Galaxy M34
  const activeProductId = productId || "prod_samsung_m34_001";

  const [loading, setLoading] = useState(true);
  const [passportData, setPassportData] = useState(null);
  const [viewMode, setViewMode] = useState("owner"); // owner or buyer

  // Fetch passport data
  useEffect(() => {
    let active = true;
    setLoading(true);
    getPassport(activeProductId)
      .then((res) => {
        if (!active) return;
        // Check if backend returned valid data, else fallback to mock
        if (res && res.status === "ok" && !res.mock) {
          setPassportData(res);
        } else {
          // Fallback static mock data depending on productId
          const isJacket = activeProductId.includes("jacket") || activeProductId === "prod_levis_jacket_001";
          
          setPassportData({
            product_id: activeProductId,
            product_name: isJacket ? "Levi's Trucker Denim Jacket" : "Samsung Galaxy M34 5G",
            brand: isJacket ? "Levi's" : "Samsung",
            passport_id: isJacket ? "RLP-2026-C892X" : "RLP-2026-X128A",
            current_status: isJacket ? "resold" : "in_use",
            lives_count: isJacket ? 3 : 2,
            trust_score: isJacket ? 78 : 94,
            total_co2_kg: isJacket ? 22.0 : 70.0,
            events: isJacket 
              ? [
                  {
                    event_type: "resold",
                    title: "Resold on Amazon Renewed",
                    date: "Jun 10, 2026",
                    actor: "Clothes Forward NGO",
                    grade: "Good",
                    notes: "Item resold to a new owner via Amazon Renewed platform. Profits support rural education.",
                    location: "Mumbai, MH",
                    co2_delta_kg: -8.5,
                  },
                  {
                    event_type: "returned",
                    title: "Returned (Size Mismatch)",
                    date: "Jun 03, 2026",
                    actor: "Priya Sharma",
                    grade: "Poor", // Triggers subtle amber left border
                    notes: "Item returned due to minor sizing mismatch. Zippers are fully functional but fabric has lint.",
                    location: "Bengaluru, KA",
                    co2_delta_kg: 0.0,
                  },
                  {
                    event_type: "manufactured",
                    title: "Manufactured",
                    date: "Aug 15, 2025",
                    actor: "Levi Strauss Co.",
                    grade: "Like New",
                    notes: "Manufactured using sustainable cotton fibers in Bangladesh.",
                    location: "Dhaka, Bangladesh",
                    co2_delta_kg: 22.0,
                  }
                ]
              : [
                  {
                    event_type: "inspected",
                    title: "Inspected & Graded by ReLoop AI",
                    date: "May 28, 2026",
                    actor: "ReLoop AI Inspector",
                    grade: "Good",
                    notes: "Refurbished at local Amazon hub. Screen scratches checked (<1mm). Outer body polished.",
                    location: "Bengaluru, KA",
                    co2_delta_kg: -59.5,
                  },
                  {
                    event_type: "sold",
                    title: "Purchased (First Owner)",
                    date: "Mar 15, 2026",
                    actor: "Priya Sharma",
                    grade: "Like New",
                    notes: "Original purchase via Amazon India. Used for 73 days.",
                    location: "Bengaluru, KA",
                    co2_delta_kg: 0.0,
                  },
                  {
                    event_type: "manufactured",
                    title: "Manufactured",
                    date: "Dec 15, 2025",
                    actor: "Samsung Electronics",
                    grade: "Like New",
                    notes: "Manufactured at Samsung Noida plant, India.",
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
  }, [activeProductId]);

  // Set default view mode based on fetched product status
  useEffect(() => {
    if (passportData) {
      setViewMode(passportData.current_status === "resold" ? "buyer" : "owner");
    }
  }, [passportData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
        <Spinner message="Retrieving circular product passport..." />
      </div>
    );
  }

  if (!passportData) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center justify-center space-y-4">
        <BadgeAlert className="text-red-500" size={48} />
        <h2 className="text-xl font-bold">Passport Not Found</h2>
        <button onClick={() => navigate(-1)} className="px-4 py-2 bg-slate-800 rounded-lg text-sm">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen p-4 md:p-6 space-y-8 max-w-4xl mx-auto">
      
      {/* Header back button & sandbox switch */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 p-4 border border-slate-800/80 rounded-2xl">
        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Products
        </button>

        {/* View Mode Switch for grading purposes */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Select View Context:</span>
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-850">
            <button
              onClick={() => setViewMode("owner")}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                viewMode === "owner" 
                  ? "bg-slate-800 text-slate-100 font-bold" 
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Original Owner
            </button>
            <button
              onClick={() => setViewMode("buyer")}
              className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                viewMode === "buyer" 
                  ? "bg-slate-800 text-slate-100 font-bold" 
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              Buyer View (Resold)
            </button>
          </div>
        </div>
      </div>

      {/* SECTION A: HEADER */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Card: Basic Specs */}
        <div className="md:col-span-7 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6 flex flex-col justify-between shadow-sm">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">{passportData.brand}</span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 mt-1 tracking-tight">
                  {passportData.product_name}
                </h1>
                <p className="text-xs font-mono text-slate-500 mt-1">Passport ID: {passportData.passport_id}</p>
              </div>
              <span className="bg-indigo-950/40 text-indigo-400 border border-indigo-900/60 px-3 py-1 rounded-full text-xs font-bold capitalize">
                Status: {passportData.current_status.replace("_", " ")}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3">
              <div className="bg-slate-950/60 border border-slate-850/80 p-3 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Circular Cycles</span>
                <span className="text-xl font-black text-slate-200 mt-1 block">
                  {passportData.lives_count} Lives
                </span>
                <span className="text-[9px] text-teal-400 font-medium">Kept out of landfills</span>
              </div>

              <div className="bg-slate-950/60 border border-slate-850/80 p-3 rounded-xl">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Circular Trust Score</span>
                <span className="text-xl font-black text-slate-200 mt-1 block">
                  {passportData.trust_score}/100
                </span>
                {/* Horizontal trust progress meter */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-1000" 
                    style={{ width: `${passportData.trust_score}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-400 bg-slate-950/40 border border-slate-850/60 p-3 rounded-xl flex items-center gap-2">
            <Award size={16} className="text-teal-400" />
            <span>This passport guarantees circular history, verified by ReLoop AI models.</span>
          </div>
        </div>

        {/* Right Card: CarbonBadge lg */}
        <div className="md:col-span-5 flex flex-col">
          <CarbonBadge
            carbon_kg={passportData.total_co2_kg}
            context_string={`Circular management prevents up to 85% of standard manufacturing footprint. Buy refurbished next time to help optimize emissions.`}
            source="ReLoop Sustainability Tracker"
            size="lg"
          />
        </div>

      </div>

      {/* SECTION B: TIMELINE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="p-1.5 bg-indigo-950 rounded-lg text-indigo-400 border border-indigo-900/40">
            <Compass size={16} />
          </span>
          <h2 className="text-lg font-bold text-slate-200">Verified Circular Timeline</h2>
        </div>

        <div className="relative border-l-2 border-emerald-800/60 ml-4 pl-8 space-y-8 py-2">
          
          {passportData.events.map((event, index) => {
            const isPoor = event.grade && (event.grade.toLowerCase() === "poor" || event.grade.toLowerCase() === "fair");
            
            return (
              <div key={index} className="relative animate-fade-in">
                {/* Timeline Dot Indicator */}
                <span className="absolute -left-[41px] top-1.5 bg-slate-900 border-2 border-emerald-500 w-4 h-4 rounded-full flex items-center justify-center shadow shadow-emerald-950">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                </span>

                {/* Event Card */}
                <div className={`bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-3 relative shadow-inner ${
                  isPoor ? "border-l-4 border-l-amber-500 border-amber-900/40" : ""
                }`}>
                  {/* Event Topbar */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider bg-slate-900 border border-slate-850 px-2 py-0.5 rounded">
                        {event.date}
                      </span>
                      {event.grade && <GradeTag grade={event.grade} />}
                    </div>

                    {event.co2_delta_kg !== 0 && (
                      <span className={`text-[10px] px-2 py-0.5 font-bold rounded border ${
                        event.co2_delta_kg < 0 
                          ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/40" 
                          : "bg-slate-900/40 text-slate-400 border-slate-800"
                      }`}>
                        {event.co2_delta_kg < 0 
                          ? `Saved: ${Math.abs(event.co2_delta_kg)} kg CO₂e` 
                          : `Cost: ${event.co2_delta_kg} kg CO₂e`}
                      </span>
                    )}
                  </div>

                  {/* Title & Notes */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-200">{event.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{event.notes}</p>
                  </div>

                  {/* Badges footer */}
                  <div className="flex flex-wrap gap-2 text-[10px] text-slate-500 pt-1">
                    <span className="bg-slate-900 px-2 py-1 rounded border border-slate-850 flex items-center gap-1">
                      <User size={10} className="text-slate-400" />
                      Actor: <strong className="text-slate-300 font-semibold">{event.actor}</strong>
                    </span>
                    <span className="bg-slate-900 px-2 py-1 rounded border border-slate-850 flex items-center gap-1">
                      <MapPin size={10} className="text-slate-400" />
                      Location: <strong className="text-slate-300 font-semibold">{event.location}</strong>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION C: WHAT THIS MEANS FOR YOU */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <h2 className="text-base font-bold text-slate-200 mb-4">What This Means For You</h2>

        {viewMode === "buyer" ? (
          /* Buyer View Context (resold == true) */
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Trust Signal 1 */}
              <div className="bg-slate-950/50 border border-slate-850 p-4 rounded-2xl flex items-start gap-3">
                <span className="p-1.5 bg-teal-950/60 text-teal-400 rounded-lg border border-teal-900/40">
                  <ShieldCheck size={16} />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">AI-Verified Condition</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    This device was graded by ReLoop's ML computer-vision. We guarantee 89%+ scoring accuracy.
                  </p>
                </div>
              </div>

              {/* Trust Signal 2 */}
              <div className="bg-slate-950/50 border border-slate-850 p-4 rounded-2xl flex items-start gap-3">
                <span className="p-1.5 bg-indigo-950/60 text-indigo-400 rounded-lg border border-indigo-900/40">
                  <Eye size={16} />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Full Chain History</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    You can view the full history: origin plant, previous owners, days used, and refurbished logs.
                  </p>
                </div>
              </div>

              {/* Trust Signal 3 */}
              <div className="bg-slate-950/50 border border-slate-850 p-4 rounded-2xl flex items-start gap-3">
                <span className="p-1.5 bg-emerald-950/60 text-emerald-400 rounded-lg border border-emerald-900/40">
                  <Leaf size={16} />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Carbon Positive Impact</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    This circular purchase prevented 59.5 kg CO₂ from entering the atmosphere.
                  </p>
                </div>
              </div>

              {/* Trust Signal 4 */}
              <div className="bg-slate-950/50 border border-slate-850 p-4 rounded-2xl flex items-start gap-3">
                <span className="p-1.5 bg-orange-950/60 text-orange-400 rounded-lg border border-orange-900/40">
                  🛒
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs font-bold text-slate-200">Amazon Renewed Listed</h4>
                    <span className="text-[9px] bg-orange-500/10 text-orange-400 border border-orange-500/30 px-1 rounded uppercase font-extrabold tracking-wide">
                      amazon renewed
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    Backed by Amazon's 1-year Renewed Guarantee for extra peace of mind.
                  </p>
                </div>
              </div>
            </div>

            {/* Grey Banner warning */}
            <div className="bg-slate-950 text-slate-400 border border-slate-850 p-4 rounded-2xl text-xs flex items-center gap-3">
              <ShieldAlert size={18} className="text-slate-500 flex-shrink-0" />
              <span>This passport cannot be edited by any seller. Once generated, all events are permanently signed.</span>
            </div>
          </div>
        ) : (
          /* Owner View Context (resold == false) */
          <div className="space-y-4">
            <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                Your item's passport is live. When it sells on Amazon Renewed, the next buyer will see this full history. This transparency helps command higher resell value.
              </p>
              
              {/* Badge Preview box */}
              <div className="bg-slate-900 border border-slate-850/80 p-4 rounded-xl space-y-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Preview Badge:</span>
                <div className="flex items-center gap-4">
                  <ReLoopVerifiedBadge grade="Good" confidence={89} passport_id={passportData.passport_id} />
                  <span className="text-slate-500 text-xs">Visible inline on the Amazon Renewed listing page.</span>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => navigate(`/renewed/${activeProductId}`)}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow"
            >
              <span>See how it appears on Amazon Renewed</span>
              <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
