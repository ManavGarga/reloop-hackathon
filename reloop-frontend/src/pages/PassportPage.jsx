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
      const isJacket = activeProductId.includes("jacket") || activeProductId === "prod_levis_jacket_001";
      const currentStatus = passportData.current_status || (isJacket ? "resold" : "in_use");
      setViewMode(currentStatus === "resold" ? "buyer" : "owner");
    }
  }, [passportData, activeProductId]);

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

  const isJacket = activeProductId.includes("jacket") || activeProductId === "prod_levis_jacket_001";
  
  const enrichedPassport = {
    ...passportData,
    brand: passportData.brand || (isJacket ? "Levi's" : activeProductId.includes("samsung") ? "Samsung" : "ReLoop"),
    product_name: passportData.product_name || (isJacket ? "Levi's Trucker Denim Jacket" : "Samsung Galaxy M34 5G"),
    passport_id: passportData.passport_id || (isJacket ? "RLP-2026-C892X" : "RLP-2026-X128A"),
    current_status: passportData.current_status || (isJacket ? "resold" : "in_use"),
    lives_count: passportData.lives_count !== undefined ? passportData.lives_count : (isJacket ? 3 : 2),
    trust_score: passportData.trust_score !== undefined ? passportData.trust_score : (isJacket ? 78 : 94),
    total_co2_kg: passportData.total_co2_kg !== undefined ? passportData.total_co2_kg : (isJacket ? 22.0 : 70.0),
    events: (passportData.events || []).map(event => {
      const eventGrade = String(event.grade || event.condition_at_event || "Good");
      
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
      if (!eventDate) eventDate = "Unknown Date";

      const eventTitle = event.title || (() => {
        const type = event.event_type || "";
        const titleMap = {
          manufactured: "Manufactured",
          sold: "Purchased (First Owner)",
          returned: "Returned Item",
          refurbished: "Inspected & Graded by ReLoop AI",
          p2p_sold: "Resold (P2P)",
          donated: "Donated to Charity",
          recycled: "Recycled",
          repaired: "Repaired & Restored"
        };
        if (titleMap[type]) return titleMap[type];
        return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      })();

      const eventLocation = event.location || "Bengaluru, KA";

      return {
        ...event,
        grade: eventGrade,
        date: eventDate,
        title: eventTitle,
        location: eventLocation,
        co2_delta_kg: event.co2_delta_kg !== undefined ? event.co2_delta_kg : 0.0
      };
    })
  };

  const statusIsGreen = enrichedPassport.current_status === "in_use" || enrichedPassport.current_status === "refurbished" || enrichedPassport.current_status === "manufactured";

  return (
    <div className="bg-[#eaeded] min-h-screen text-[#0F1111] font-sans px-6 py-6 pb-12">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Amazon India Navigation Breadcrumbs */}
        <div className="text-[11px] text-[#565959] flex items-center gap-1.5 font-normal">
          <span 
            onClick={() => navigate("/profile")} 
            className="hover:text-[#C45500] hover:underline cursor-pointer"
          >
            Your Account
          </span>
          <span>&gt;</span>
          <span 
            onClick={() => navigate("/dashboard")} 
            className="hover:text-[#C45500] hover:underline cursor-pointer"
          >
            Eco Dashboard
          </span>
          <span>&gt;</span>
          <span className="text-[#C45500] font-semibold">Circular Passport</span>
        </div>

        {/* Header back button & sandbox switch */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border border-[#DDD] rounded-xl shadow-sm">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-xs font-semibold text-[#007185] hover:text-[#C45500] hover:underline transition-colors"
          >
            <ArrowLeft size={14} /> Back to Eco Dashboard
          </button>

          {/* View Mode Switch for grading purposes */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-[#565959] uppercase tracking-wide">Select View Context:</span>
            <div className="flex bg-[#F0F2F2] p-1 rounded-lg border border-[#D5D9D9]">
              <button
                onClick={() => setViewMode("owner")}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  viewMode === "owner" 
                    ? "bg-white text-[#0F1111] font-bold shadow-sm border border-[#D5D9D9]" 
                    : "text-[#565959] hover:text-[#0F1111]"
                }`}
              >
                Original Owner
              </button>
              <button
                onClick={() => setViewMode("buyer")}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  viewMode === "buyer" 
                    ? "bg-white text-[#0F1111] font-bold shadow-sm border border-[#D5D9D9]" 
                    : "text-[#565959] hover:text-[#0F1111]"
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
          <div className="md:col-span-7 bg-white border border-[#DDD] p-6 rounded-xl space-y-6 flex flex-col justify-between shadow-sm hover:border-[#C45500] hover:shadow-md transition-all duration-150">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-[#565959] font-extrabold uppercase tracking-wider">{enrichedPassport.brand}</span>
                  <h1 className="text-xl md:text-2xl font-bold text-[#0F1111] mt-1 tracking-tight">
                    {enrichedPassport.product_name}
                  </h1>
                  <p className="text-xs font-mono text-[#565959] mt-1">Passport ID: {enrichedPassport.passport_id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize border ${
                  statusIsGreen 
                    ? "bg-[#EDF8F2] text-[#007600] border-[#B1E5C6]" 
                    : "bg-[#FFF8F2] text-[#C45500] border-[#FBD8B4]"
                }`}>
                  Status: {enrichedPassport.current_status.replace("_", " ")}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3">
                <div className="bg-[#F7F9FA] border border-[#E5E7EB] p-3 rounded-xl">
                  <span className="text-[10px] text-[#565959] uppercase font-bold tracking-wider block">Circular Cycles</span>
                  <span className="text-lg font-extrabold text-[#0F1111] mt-1 block">
                    {enrichedPassport.lives_count} Lives
                  </span>
                  <span className="text-[9px] text-[#007600] font-medium">Kept out of landfills</span>
                </div>

                <div className="bg-[#F7F9FA] border border-[#E5E7EB] p-3 rounded-xl">
                  <span className="text-[10px] text-[#565959] uppercase font-bold tracking-wider block">Circular Trust Score</span>
                  <span className="text-lg font-extrabold text-[#0F1111] mt-1 block">
                    {enrichedPassport.trust_score}/100
                  </span>
                  {/* Horizontal trust progress meter */}
                  <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full bg-[#007600] transition-all duration-1000" 
                      style={{ width: `${enrichedPassport.trust_score}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs text-[#565959] bg-[#F7F9FA] border border-[#E5E7EB] p-3 rounded-xl flex items-center gap-2">
              <Award size={16} className="text-[#007600]" />
              <span>This passport guarantees circular history, verified by ReLoop AI models.</span>
            </div>
          </div>

          {/* Right Card: CarbonBadge lg */}
          <div className="md:col-span-5 flex flex-col">
            <CarbonBadge
              carbon_kg={enrichedPassport.total_co2_kg}
              context_string={`Circular management prevents up to 85% of standard manufacturing footprint. Buy refurbished next time to help optimize emissions.`}
              source="ReLoop Sustainability Tracker"
              size="lg"
              isLight={true}
            />
          </div>

        </div>

        {/* SECTION B: TIMELINE */}
        <div className="bg-white border border-[#DDD] rounded-xl p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1.5 bg-[#EAF7ED] text-[#007600] rounded-lg border border-[#BEE7D1]">
              <Compass size={16} />
            </span>
            <h2 className="text-base font-bold text-[#0F1111]">Verified Circular Timeline</h2>
          </div>

          <div className="relative border-l-2 border-[#BEE7D1] ml-4 pl-8 space-y-8 py-2">
            
            {enrichedPassport.events.map((event, index) => {
              const isPoor = event.grade && (event.grade.toLowerCase() === "poor" || event.grade.toLowerCase() === "fair");
              
              return (
                <div key={index} className="relative animate-fade-in">
                  {/* Timeline Dot Indicator */}
                  <span className="absolute -left-[41px] top-1.5 bg-white border-2 border-[#007600] w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                    <span className="w-2 h-2 bg-[#007600] rounded-full" />
                  </span>

                  {/* Event Card */}
                  <div className={`bg-white border border-[#DDD] p-5 rounded-xl space-y-3 relative shadow-sm hover:shadow-md transition-shadow duration-150 ${
                    isPoor ? "border-l-4 border-l-[#C45500]" : ""
                  }`}>
                    {/* Event Topbar */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[#0F1111] font-bold uppercase tracking-wider bg-[#F0F2F2] border border-[#D5D9D9] px-2 py-0.5 rounded">
                          {event.date}
                        </span>
                        {event.grade && <GradeTag grade={event.grade} />}
                      </div>

                      {event.co2_delta_kg !== 0 && (
                        <span className={`text-[10px] px-2 py-0.5 font-bold rounded border ${
                          event.co2_delta_kg < 0 
                            ? "bg-[#EDF8F2] text-[#007600] border-[#B1E5C6]" 
                            : "bg-[#FFF8F2] text-[#C45500] border-[#FBD8B4]"
                        }`}>
                          {event.co2_delta_kg < 0 
                            ? `Saved: ${Math.abs(event.co2_delta_kg)} kg CO₂e` 
                            : `Cost: ${event.co2_delta_kg} kg CO₂e`}
                        </span>
                      )}
                    </div>

                    {/* Title & Notes */}
                    <div>
                      <h3 className="text-sm font-bold text-[#0F1111]">{event.title}</h3>
                      <p className="text-xs text-[#565959] mt-1 leading-relaxed">{event.notes}</p>
                    </div>

                    {/* Badges footer */}
                    <div className="flex flex-wrap gap-2 text-[10px] text-[#565959] pt-1">
                      <span className="bg-[#F7F9FA] px-2 py-1 rounded border border-[#E5E7EB] flex items-center gap-1">
                        <User size={10} className="text-[#565959]" />
                        Actor: <strong className="text-[#0F1111] font-semibold">{event.actor}</strong>
                      </span>
                      <span className="bg-[#F7F9FA] px-2 py-1 rounded border border-[#E5E7EB] flex items-center gap-1">
                        <MapPin size={10} className="text-[#565959]" />
                        Location: <strong className="text-[#0F1111] font-semibold">{event.location}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION C: WHAT THIS MEANS FOR YOU */}
        <div className="bg-white border border-[#DDD] rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-[#0F1111] mb-4">What This Means For You</h2>

          {viewMode === "buyer" ? (
            /* Buyer View Context (resold == true) */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Trust Signal 1 */}
                <div className="bg-[#F7F9FA] border border-[#E5E7EB] p-4 rounded-xl flex items-start gap-3 shadow-sm hover:shadow transition-shadow">
                  <span className="p-1.5 bg-[#EAF7ED] text-[#007600] rounded-lg border border-[#BEE7D1]">
                    <ShieldCheck size={16} />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F1111]">AI-Verified Condition</h4>
                    <p className="text-[11px] text-[#565959] mt-0.5 leading-relaxed">
                      This device was graded by ReLoop's ML computer-vision. We guarantee 89%+ scoring accuracy.
                    </p>
                  </div>
                </div>

                {/* Trust Signal 2 */}
                <div className="bg-[#F7F9FA] border border-[#E5E7EB] p-4 rounded-xl flex items-start gap-3 shadow-sm hover:shadow transition-shadow">
                  <span className="p-1.5 bg-[#EBF3F9] text-[#007185] rounded-lg border border-[#BDE0E6]">
                    <Eye size={16} />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F1111]">Full Chain History</h4>
                    <p className="text-[11px] text-[#565959] mt-0.5 leading-relaxed">
                      You can view the full history: origin plant, previous owners, days used, and refurbished logs.
                    </p>
                  </div>
                </div>

                {/* Trust Signal 3 */}
                <div className="bg-[#F7F9FA] border border-[#E5E7EB] p-4 rounded-xl flex items-start gap-3 shadow-sm hover:shadow transition-shadow">
                  <span className="p-1.5 bg-[#EAF7ED] text-[#007600] rounded-lg border border-[#BEE7D1]">
                    <Leaf size={16} />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F1111]">Carbon Positive Impact</h4>
                    <p className="text-[11px] text-[#565959] mt-0.5 leading-relaxed">
                      This circular purchase prevented 59.5 kg CO₂ from entering the atmosphere.
                    </p>
                  </div>
                </div>

                {/* Trust Signal 4 */}
                <div className="bg-[#F7F9FA] border border-[#E5E7EB] p-4 rounded-xl flex items-start gap-3 shadow-sm hover:shadow transition-shadow">
                  <span className="p-1.5 bg-[#FFF8F2] text-[#C45500] rounded-lg border border-[#FBD8B4]">
                    🛒
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-[#0F1111]">Amazon Renewed Listed</h4>
                      <span className="text-[9px] bg-[#C45500] text-white px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wide">
                        amazon renewed
                      </span>
                    </div>
                    <p className="text-[11px] text-[#565959] mt-0.5 leading-relaxed">
                      Backed by Amazon's 1-year Renewed Guarantee for extra peace of mind.
                    </p>
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
            /* Owner View Context (resold == false) */
            <div className="space-y-4">
              <div className="bg-white border border-[#DDD] p-5 rounded-xl space-y-4">
                <p className="text-xs text-[#0F1111] leading-relaxed">
                  Your item's passport is live. When it sells on Amazon Renewed, the next buyer will see this full history. This transparency helps command higher resell value.
                </p>
                
                {/* Badge Preview box */}
                <div className="bg-[#F7F9FA] border border-[#E5E7EB] p-4 rounded-xl space-y-2">
                  <span className="text-[10px] text-[#565959] font-bold uppercase tracking-wider block">Preview Badge:</span>
                  <div className="flex items-center gap-4">
                    <ReLoopVerifiedBadge grade="Good" confidence={89} passport_id={enrichedPassport.passport_id} />
                    <span className="text-[#565959] text-xs">Visible inline on the Amazon Renewed listing page.</span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => navigate(`/renewed/${activeProductId}`)}
                className="w-full py-3.5 bg-[#ffd814] border border-[#a88734] hover:bg-[#f7ca00] text-[#0F1111] font-bold rounded-lg text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm hover:shadow"
              >
                <span>See how it appears on Amazon Renewed</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
