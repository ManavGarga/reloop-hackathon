import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip,
} from "recharts";
import {
  Leaf, Recycle, Gift, ChevronRight,
  CheckCircle, X, CreditCard, Zap,
  ShieldCheck, Trophy, TrendingUp, TreePine, Shield, AlertCircle
} from "lucide-react";
import { Button, Card, Badge, Spinner, LoadingScreen, Modal } from "../components/ui";
import { getUserDashboard, getCredits, redeemCredits } from "../api/reloop";

// ── Date Formatter ────────────────────────────────────────────────────────────
function formatDate(raw) {
  if (!raw) return "—";
  try {
    const d = new Date(raw.includes("T") ? raw : raw + "T00:00:00");
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  } catch { return raw; }
}

// ── Grade Color Config ────────────────────────────────────────────────────────
function gradeStyle(grade) {
  const g = (grade || "").toLowerCase();
  if (g === "excellent" || g === "like new") return "bg-emerald-100 text-emerald-800";
  if (g === "good")     return "bg-green-100 text-green-800";
  if (g === "fair")     return "bg-amber-100 text-amber-800";
  if (g === "poor")     return "bg-orange-100 text-orange-800";
  if (g === "damaged")  return "bg-red-100 text-red-800";
  return "bg-slate-100 text-slate-700";
}

// ── Reward Catalogue ──────────────────────────────────────────────────────────
const REWARDS = [
  { reward_id: "amazon_50", title: "₹50 Amazon Discount", credits: 100, value: "₹50 off", icon: "🏷️", type: "discount" },
  { reward_id: "amazon_100", title: "₹100 Amazon Discount", credits: 200, value: "₹100 off", icon: "🎫", type: "discount" },
  { reward_id: "amazon_250", title: "₹250 Amazon Discount", credits: 500, value: "₹250 off", icon: "💎", type: "discount" },
  { reward_id: "ngo_plant", title: "Plant a Tree via NGO", credits: 50, value: "1 tree 🌱", icon: "🌳", type: "ngo" },
  { reward_id: "priority_access", title: "Priority Renewed Access", credits: 150, value: "VIP 🔓", icon: "⭐", type: "tier" },
  { reward_id: "amazon_500", title: "₹500 Amazon Discount", credits: 1000, value: "₹500 off", icon: "🔥", type: "discount" },
];

// ── Tier definitions ──────────────────────────────────────────────────────────
const TIERS = [
  { name: "Seedling", min: 0, max: 200, color: "#067D62", icon: "🌱", desc: "Just getting started" },
  { name: "Green", min: 200, max: 500, color: "#059669", icon: "🍃", desc: "Building good habits" },
  { name: "Eco Hero", min: 500, max: 1000, color: "#047857", icon: "🏆", desc: "Certified sustainability champion" },
  { name: "Planet Saver", min: 1000, max: Infinity, color: "#065f46", icon: "🌍", desc: "Top 5% of ReLoop users" },
];

const LEADERBOARD_DATA = [
  { rank: 1, name: "Aarav Mehta", score: 980, badge: "🌍 Planet Saver", isMe: false },
  { rank: 2, name: "Diya Iyer", score: 910, badge: "🌍 Planet Saver", isMe: false },
  { rank: 3, name: "Kabir Sen", score: 855, badge: "🏆 Eco Hero", isMe: false },
  { rank: 41, name: "Rohan Das", score: 245, badge: "🍃 Green", isMe: false },
  { rank: 42, name: "Priya Sharma", score: 240, badge: "🍃 Green", isMe: true },
  { rank: 43, name: "Sneha Rao", score: 235, badge: "🌱 Seedling", isMe: false },
  { rank: 44, name: "Amit Patel", score: 220, badge: "🌱 Seedling", isMe: false },
];

function getTier(credits) {
  return TIERS.find(t => credits >= t.min && credits < t.max) || TIERS[TIERS.length - 1];
}

// Custom tooltip for chart
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const co2 = payload[0].value;
    const km = Math.round(co2 * 4.05);
    return (
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-lg px-4 py-3 text-left space-y-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label} 2026</p>
        <p className="text-sm font-black text-[#16A34A]">{co2} kg CO₂ Saved</p>
        <p className="text-[11px] text-slate-500 font-semibold border-t border-slate-100 pt-1 flex items-center gap-1">
          <span>🚗</span> Equivalent to {km} km not driven
        </p>
      </div>
    );
  }
  return null;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [creditsData, setCreditsData] = useState(null);
  const [ledgerOpen, setLedgerOpen] = useState(true);
  const [redeemModal, setRedeemModal] = useState(null);
  const [redeemStatus, setRedeemStatus] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [redeemError, setRedeemError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [hoveredSlice, setHoveredSlice] = useState(null);

  const ledgerRef = useRef(null);
  const userId = "user_priya_001";

  useEffect(() => {
    let active = true;
    setLoading(true);

    Promise.all([getUserDashboard(userId), getCredits(userId)])
      .then(([dashRes, credsRes]) => {
        if (!active) return;

        const balance = credsRes?.balance ?? 1720;
        const earned = credsRes?.total_earned ?? 3470;
        const spent = credsRes?.total_spent ?? 1750;
        const co2 = dashRes?.impact?.co2_saved_kg ?? 420;
        const trees = dashRes?.impact?.trees_equivalent ?? 20;
        const refurbished = dashRes?.impact?.items_refurbished ?? 4;
        const donated = dashRes?.impact?.items_donated ?? 3;
        const p2p = dashRes?.impact?.items_p2p ?? 3;
        const totalRet = dashRes?.impact?.total_returns ?? 10;

        setDashboardData({
          user: { name: dashRes?.user?.name || "Priya Sharma", member_since: dashRes?.user?.member_since || "2026-04-14" },
          impact: { co2_saved_kg: co2, trees_equivalent: trees, returns_avoided: dashRes?.impact?.returns_avoided ?? 0, items_refurbished: refurbished, items_donated: donated, items_p2p: p2p, total_returns: totalRet },
          green_credits: { balance, total_earned: earned, total_spent: spent },
          recent_returns: dashRes?.recent_returns?.length ? dashRes.recent_returns : [
            { return_id: "RET-20260613-0001", product_id: "prod_samsung_m34_001", product_name: "Samsung Galaxy M34 5G", status: "completed", route: "p2p", grade: "Good", credits_earned: 100.0, co2_saved: 42.0, date: "2026-06-14" },
            { return_id: "RET-20260612-0002", product_id: "prod_samsung_m34_002", product_name: "Samsung Galaxy M34 5G", status: "completed", route: "p2p", grade: "Good", credits_earned: 100.0, co2_saved: 42.0, date: "2026-06-14" },
            { return_id: "RET-20260530-0005", product_id: "prod_levis_jacket_001", product_name: "Levi's Trucker Denim Jacket", status: "completed", route: "ngo_donate", grade: "Fair", credits_earned: 80.0, co2_saved: 18.7, date: "2026-05-30" },
          ],
          leaderboard_rank: dashRes?.leaderboard_rank ?? 42,
          sustainability_score: dashRes?.sustainability_score ?? 84,
        });

        setCreditsData({
          balance,
          transactions: credsRes?.transactions?.length ? credsRes.transactions : [
            { amount: 100.0, transaction_type: "earned_return", notes: "Return completed: Refurbished Samsung Galaxy M34 5G", timestamp: "2026-06-14T11:30:00" },
            { amount: 100.0, transaction_type: "earned_return", notes: "P2P Resale — Samsung Galaxy M34 5G", timestamp: "2026-06-14T10:00:00" },
            { amount: -100.0, transaction_type: "spent_discount", notes: "₹100 discount on next order", timestamp: "2026-06-10T09:00:00" },
            { amount: 80.0, transaction_type: "earned_return", notes: "Donated Levi's Jacket to Clothes Forward", timestamp: "2026-05-30T14:00:00" },
            { amount: 50.0, transaction_type: "earned_purchase", notes: "Bought Amazon Renewed — Boat Airdopes", timestamp: "2026-05-10T12:00:00" },
          ],
        });

        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => { active = false; };
  }, []);

  const handleRedeem = async () => {
    if (!redeemModal) return;
    setRedeemStatus("loading");
    setRedeemError("");

    const res = await redeemCredits(userId, redeemModal.reward_id);

    if (res && res.status === "ok") {
      setCouponCode(res.coupon_code || "RELOOP-REWARD");
      setCreditsData(prev => ({
        ...prev,
        balance: res.new_balance,
        transactions: [
          { amount: -redeemModal.credits, transaction_type: "redeemed_reward", notes: `Redeemed: ${redeemModal.title}`, timestamp: new Date().toISOString() },
          ...(prev?.transactions || []),
        ],
      }));
      setDashboardData(prev => ({
        ...prev,
        green_credits: { ...prev.green_credits, balance: res.new_balance, total_spent: prev.green_credits.total_spent + redeemModal.credits },
      }));
      setRedeemStatus("success");
    } else {
      setRedeemError(res?.detail || "Not enough credits or server error.");
      setRedeemStatus("error");
    }
  };

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setToastMessage("Voucher code copied to clipboard!");
  };

  const handleCreditsClick = () => {
    setLedgerOpen(true);
    setTimeout(() => {
      ledgerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  if (loading || !dashboardData) {
    return <LoadingScreen message="Loading your Eco Dashboard..." />;
  }

  const balance = creditsData?.balance ?? dashboardData.green_credits.balance;
  const tier = getTier(balance);
  const nextTier = TIERS[TIERS.indexOf(tier) + 1];
  const overallProgress = Math.min(100, (balance / 1000) * 100);

  const co2TrendData = [
    { month: "Jan", co2: 45 },
    { month: "Feb", co2: 98 },
    { month: "Mar", co2: 156 },
    { month: "Apr", co2: 280 },
    { month: "May", co2: 450 },
    { month: "Jun", co2: dashboardData.impact.co2_saved_kg },
  ];

  const totalItems = (dashboardData.impact.items_p2p || 0) + (dashboardData.impact.items_donated || 0) + (dashboardData.impact.items_refurbished || 0);

  const p2pCount = dashboardData.impact.items_p2p || 0;
  const ngoCount = dashboardData.impact.items_donated || 0;
  const refurbishCount = dashboardData.impact.items_refurbished || 0;

  const p2pPct = totalItems > 0 ? Math.round((p2pCount / totalItems) * 100) : 0;
  const ngoPct = totalItems > 0 ? Math.round((ngoCount / totalItems) * 100) : 0;
  const refurbishPct = totalItems > 0 ? 100 - p2pPct - ngoPct : 0;

  let p2pCo2 = 0;
  let ngoCo2 = 0;
  let refurbishCo2 = 0;

  if (dashboardData.recent_returns) {
    dashboardData.recent_returns.forEach(r => {
      const route = r.route || r.disposal_route;
      const co2 = parseFloat(r.co2_saved) || 0;
      if (route === 'p2p') p2pCo2 += co2;
      else if (route === 'ngo_donate') ngoCo2 += co2;
      else if (route === 'refurbish') refurbishCo2 += co2;
    });
  }

  const slices = {
    p2p: { label: "P2P Resale", pct: p2pPct, val: `${p2pCount} Items`, co2: Math.round(p2pCo2), color: "#2563EB" },
    ngo: { label: "NGO Donation", pct: ngoPct, val: `${ngoCount} Items`, co2: Math.round(ngoCo2), color: "#067D62" },
    refurbish: { label: "Refurbished", pct: refurbishPct, val: `${refurbishCount} Items`, co2: Math.round(refurbishCo2), color: "#FF9900" }
  };

  const routeLabel = { refurbish: "Refurbished", p2p: "P2P Resale", ngo_donate: "Donated", recycle: "Recycled", landfill: "Disposed" };
  const routeColor = { refurbish: "text-amber-600", p2p: "text-blue-600", ngo_donate: "text-[#067D62]", recycle: "text-[#067D62]", landfill: "text-gray-400" };
  const routeBg = { refurbish: "bg-amber-50", p2p: "bg-blue-50", ngo_donate: "bg-emerald-50", recycle: "bg-emerald-50", landfill: "bg-gray-50" };

  return (
    <div className="bg-[#F7F8FA] min-h-screen w-full text-slate-900 font-sans pb-12">
      <div className="w-full px-6 py-8 space-y-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[13px] text-slate-500 font-medium">
          <span className="hover:text-[#C7511F] cursor-pointer transition-colors" onClick={() => navigate("/profile")}>Your Account</span>
          <span className="text-slate-400">›</span>
          <span className="text-[#067D62]">Eco Dashboard</span>
        </nav>

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              Eco Dashboard
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#067D62]/10 border border-[#067D62]/20">
                <Leaf size={16} className="text-[#067D62]" />
              </span>
            </h1>
            <div className="flex flex-wrap items-center gap-2.5 mt-1.5">
              <p className="text-xs text-slate-500">
                Welcome back, <span className="font-semibold text-slate-700">{dashboardData.user.name}</span> · Member since {formatDate(dashboardData.user.member_since)}
              </p>
              <span className="text-slate-300">|</span>
              <button
                id="rank-leaderboard-badge"
                onClick={() => setLeaderboardOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-full cursor-pointer transition-all shadow-xs"
              >
                <Trophy size={12} className="text-amber-600" />
                <span>Rank #{dashboardData.leaderboard_rank} in India</span>
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 1 — Hero (Tier + Credits) */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          {/* Tier Card */}
          <Card className="flex-1 p-6 flex flex-col justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 border border-[#E7E7E7] flex items-center justify-center text-3xl flex-shrink-0 shadow-xs">
                {tier.icon}
              </div>
              <div className="flex-1 text-left space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-[#067D62] text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-xs">
                    <CheckCircle size={14} className="text-white" />
                    {tier.name.toUpperCase()} TIER
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{tier.desc}</p>
              </div>
            </div>
            
            {/* 16px Milestone Progress Bar */}
            <div className="space-y-4 pt-4 relative">
              <div className="relative h-4 bg-slate-100 rounded-full border border-slate-200/80">
                {/* Active Fill Gradient */}
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#FFD814] to-[#FF9900] transition-all duration-1000 ease-out shadow-xs"
                  style={{ width: `${overallProgress}%` }}
                />

                {/* Vertical Tick Marks & Labelled Dots */}
                {[
                  { name: "Seedling", val: 0, pos: 0 },
                  { name: "Green", val: 200, pos: 20 },
                  { name: "Eco Hero", val: 500, pos: 50 },
                  { name: "Planet Saver", val: 1000, pos: 100 }
                ].map((ms, idx) => (
                  <div 
                    key={idx} 
                    className="absolute top-0 bottom-0 flex flex-col items-center justify-center z-10" 
                    style={{ left: `${ms.pos}%` }}
                  >
                    {/* Vertical Tick Mark */}
                    <div className="w-[2px] h-full bg-slate-300/60" />
                    {/* Dot */}
                    <div className={`w-3 h-3 rounded-full border border-white absolute top-1/2 -translate-y-1/2 -translate-x-1/2 shadow-xs ${
                      balance >= ms.val ? "bg-[#067D62]" : "bg-slate-300"
                    }`} />
                    {/* Label below dot */}
                    <span className="text-[10px] font-bold text-slate-400 absolute top-6 -translate-x-1/2 whitespace-nowrap">
                      {ms.name} ({ms.val} pts)
                    </span>
                  </div>
                ))}

                {/* Animated Glowing Dot Indicator at current position */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#FF9900] border-2 border-white shadow-[0_0_12px_rgba(255,153,0,0.5)] animate-pulse z-20"
                  style={{ left: `${overallProgress}%` }}
                />

                {/* Tooltip label above the glowing dot */}
                <div 
                  className="absolute -top-10 -translate-x-1/2 bg-[#131921] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-md whitespace-nowrap z-20 flex items-center gap-1 animate-bounce"
                  style={{ left: `${overallProgress}%` }}
                >
                  {nextTier ? `🔥 ${nextTier.min - balance} pts to next tier` : "🏆 Max Tier Achieved!"}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#131921] rotate-45" />
                </div>
              </div>
              <div className="h-6" /> {/* spacer for labels below */}
            </div>
          </Card>

          {/* Credits Balance Card Widget */}
          <Card
            id="credits-balance-card"
            onClick={handleCreditsClick}
            className="w-full lg:w-72 flex-shrink-0 border-l-4 border-l-[#FF9900] p-5 flex flex-col justify-between cursor-pointer"
            hover
            title="Click to view transaction ledger"
          >
            <div className="flex justify-between items-center w-full">
              <div>
                <p className="text-[13px] text-slate-500 font-bold uppercase tracking-wider">Green Credits</p>
                <h3 className="text-[48px] font-bold text-[#FF9900] leading-none mt-1">{balance.toLocaleString()}</h3>
              </div>
              {/* Circular donut ring */}
              <div className="relative w-16 h-16 flex-shrink-0">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle cx="32" cy="32" r="22" stroke="#F1F5F9" strokeWidth="4" fill="transparent" />
                  <circle
                    cx="32"
                    cy="32"
                    r="22"
                    stroke="#FF9900"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray="138.2"
                    strokeDashoffset={138.2 * (1 - (balance % 500) / 500)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#FF9900]">
                  {Math.round(((balance % 500) / 500) * 100)}%
                </div>
              </div>
            </div>

            <div className="mt-4 pt-2.5 border-t border-slate-100 flex flex-col gap-3">
              <p className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                <TrendingUp size={12} className="text-[#067D62]" />
                <span>Total earned: <strong>{dashboardData.green_credits.total_earned.toLocaleString()}</strong></span>
              </p>
              <Button
                variant="secondary"
                onClick={(e) => { e.stopPropagation(); navigate("/profile"); }}
                className="w-full"
                icon={<ChevronRight size={14} />}
              >
                Convert to Amazon Pay
              </Button>
            </div>
          </Card>
        </div>

        {/* Divider 1 */}
        <hr className="border-slate-200" />

        {/* SECTION 2 — Impact Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: "CO₂ Saved", value: `${dashboardData.impact.co2_saved_kg}`, unit: "kg", icon: <Leaf size={20} />, bg: "bg-emerald-50", text: "text-[#067D62]" },
            { label: "Trees Equiv.", value: `${dashboardData.impact.trees_equivalent}`, unit: "🌳", icon: <TreePine size={20} />, bg: "bg-teal-50", text: "text-[#067D62]" },
            { label: "Items Reused", value: `${dashboardData.impact.items_refurbished + dashboardData.impact.items_donated + dashboardData.impact.items_p2p}`, unit: "", icon: <Recycle size={20} />, bg: "bg-blue-50", text: "text-blue-600" },
            { label: "Returns Saved", value: `${dashboardData.impact.returns_avoided}`, unit: "", icon: <Shield size={20} />, bg: "bg-amber-50", text: "text-amber-605" },
          ].map((stat, idx) => (
            <Card
              key={idx}
              id={idx === 0 ? "co2-saved-card" : undefined}
              className="relative overflow-hidden flex flex-col justify-between h-[120px] text-left p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-[12px] font-medium text-[#565959] uppercase tracking-wider">{stat.label}</span>
              </div>

              <h3 className="text-[32px] font-bold text-[#111111] leading-none mt-2">
                {stat.value}
                {stat.unit && <span className="text-xs font-semibold text-slate-500 ml-1">{stat.unit}</span>}
              </h3>
            </Card>
          ))}
        </div>

        {/* Divider 2 */}
        <hr className="border-slate-200" />

        {/* SECTION 3 — Redeem Credits */}
        <Card className="p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5 text-left">
              <Gift className="text-[#FF9900]" size={20} />
              <h3 className="text-base font-extrabold text-slate-900">Redeem Green Credits</h3>
            </div>
            <span 
              onClick={handleCreditsClick}
              className="text-xs bg-white text-[#111111] border border-[#D5D9D9] hover:bg-gray-50 active:scale-[0.98] transition-all px-3.5 py-1.5 rounded-full font-bold cursor-pointer inline-flex items-center gap-1 shadow-xs"
            >
              Wallet Balance: <strong className="text-[#FF9900]">{balance.toLocaleString()} pts</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {REWARDS.map((reward) => {
              const canAfford = balance >= reward.credits;
              return (
                <Card
                  key={reward.reward_id}
                  id={`redeem-reward-${reward.reward_id}`}
                  onClick={() => canAfford && (setRedeemModal(reward), setRedeemStatus(null), setCouponCode(""), setRedeemError(""))}
                  hover={canAfford}
                  className={`relative flex flex-col justify-between p-[20px] ${!canAfford ? "opacity-70" : ""}`}
                >
                  {/* Top right badge if available */}
                  {canAfford && (
                    <span className="absolute top-3 right-3 text-[9px] bg-[#067D62]/10 text-[#067D62] border border-[#067D62]/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      Available
                    </span>
                  )}
                  
                  {/* Icon in grey circle */}
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg mb-3">
                    {reward.icon}
                  </div>

                  <div className="space-y-1 text-left">
                    <h4 className="text-sm font-bold text-slate-800 leading-snug">{reward.title}</h4>
                    <p className="text-xs text-slate-500">
                      Value: <span className="text-[#067D62] font-extrabold">{reward.value}</span>
                    </p>
                    <p className="text-xs text-slate-400 font-medium">{reward.credits} credits required</p>
                  </div>

                  {/* Bottom element */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                    {!canAfford && (
                      <div className="space-y-1.5 text-left">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400">
                          <span>Need {reward.credits - balance} more credits</span>
                          <span>{Math.round((balance / reward.credits) * 100)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#FF9900] rounded-full" style={{ width: `${(balance / reward.credits) * 100}%` }} />
                        </div>
                      </div>
                    )}

                    <Button
                      variant={canAfford ? "primary" : "secondary"}
                      disabled={!canAfford}
                      fullWidth
                      onClick={(e) => {
                        if (canAfford) {
                          setRedeemModal(reward);
                          setRedeemStatus(null);
                          setCouponCode("");
                          setRedeemError("");
                        } else {
                          e.stopPropagation();
                        }
                      }}
                    >
                      {canAfford ? "Redeem Reward" : "🔒 Locked"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </Card>

        {/* Divider 3 */}
        <hr className="border-slate-200" />

        {/* SECTION 4 — Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* CO2 Savings Trend line plot */}
          <Card className="lg:col-span-8 p-6 relative text-left">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">CO₂ Savings Trend</h3>
                <p className="text-xs text-slate-500 mt-0.5">Cumulative carbon offset (kg) across your returns</p>
              </div>
              <div className="flex items-center gap-2 bg-[#067D62]/10 border border-[#067D62]/20 px-3.5 py-1.5 rounded-full shadow-xs">
                <TrendingUp size={14} className="text-[#067D62]" />
                <span className="text-xs font-bold text-[#067D62]">+{dashboardData.impact.co2_saved_kg} kg total</span>
              </div>
            </div>

            {/* Annotation Tooltip flag */}
            <div className="absolute bottom-20 right-16 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-xs z-10">
              <AlertCircle size={10} className="text-amber-500" />
              <span>Fewer returns this month</span>
              <div className="absolute -bottom-1 right-8 w-1.5 h-1.5 bg-amber-50 border-r border-b border-amber-200 rotate-45" />
            </div>

            {/* Chart Area */}
            <div className="h-60 w-full mt-4 flex items-stretch">
              <div className="flex items-center justify-center w-6 text-slate-400 select-none">
                <span className="rotate-270 text-[10px] font-bold whitespace-nowrap tracking-wider">CO₂ OFFSET (KG)</span>
              </div>
              <div className="flex-1 min-w-0 pr-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={co2TrendData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="co2Gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#067D62" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#067D62" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={13} fontWeight="600" tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} unit="kg" />
                    <ChartTooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="co2"
                      stroke="#067D62"
                      strokeWidth={3}
                      fill="url(#co2Gradient)"
                      dot={{ fill: '#067D62', r: 5, strokeWidth: 3, stroke: '#fff' }}
                      activeDot={{ r: 7, strokeWidth: 3, stroke: '#067D62', fill: '#fff' }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>

          {/* Recirculation breakdown donut plot */}
          <Card className="lg:col-span-4 p-6 flex flex-col justify-between text-left min-h-[360px]">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recirculation Breakdown</h3>
              <p className="text-xs text-slate-500 mt-0.5">How your returned items were reused</p>
            </div>

            {/* SVG Donut Ring */}
            <div className="flex items-center justify-center py-6 relative">
              <svg className="w-36 h-36 transform -rotate-90">
                <circle cx="72" cy="72" r="48" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                <circle
                  cx="72" cy="72" r="48" stroke="#FF9900" strokeWidth="12" fill="transparent"
                  strokeDasharray="301.59" strokeDashoffset="0"
                  style={{ strokeDasharray: "301.59", strokeDashoffset: 301.59 * (1 - (refurbishPct / 100)) }}
                  strokeLinecap="round"
                  className="cursor-pointer transition-all hover:stroke-[14px]"
                  onMouseEnter={() => setHoveredSlice(slices.refurbish)}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
                <circle
                  cx="72" cy="72" r="48" stroke="#067D62" strokeWidth="12" fill="transparent"
                  strokeDasharray="301.59"
                  transform={`rotate(${refurbishPct * 3.6} 72 72)`}
                  style={{ strokeDasharray: "301.59", strokeDashoffset: 301.59 * (1 - (ngoPct / 100)) }}
                  className="cursor-pointer transition-all hover:stroke-[14px]"
                  strokeLinecap="round"
                  onMouseEnter={() => setHoveredSlice(slices.ngo)}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
                <circle
                  cx="72" cy="72" r="48" stroke="#2563EB" strokeWidth="12" fill="transparent"
                  strokeDasharray="301.59"
                  transform={`rotate(${(refurbishPct + ngoPct) * 3.6} 72 72)`}
                  style={{ strokeDasharray: "301.59", strokeDashoffset: 301.59 * (1 - (p2pPct / 100)) }}
                  className="cursor-pointer transition-all hover:stroke-[14px]"
                  strokeLinecap="round"
                  onMouseEnter={() => setHoveredSlice(slices.p2p)}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
              </svg>
              <div className="absolute flex flex-col items-center text-center px-4 select-none pointer-events-none">
                {hoveredSlice ? (
                  <>
                    <span className="text-xl font-black text-slate-800 leading-none">{hoveredSlice.val}</span>
                    <span className="text-[10px] font-extrabold uppercase mt-1" style={{ color: hoveredSlice.color }}>
                      {hoveredSlice.pct}% ({hoveredSlice.co2}kg Saved)
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-3xl font-black text-slate-900 leading-none">{totalItems}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">Items Total</span>
                  </>
                )}
              </div>
            </div>

            {/* Donut Legend */}
            <div className="flex flex-col gap-2 pt-4 border-t border-slate-50 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-semibold text-slate-600">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                  <span>P2P Resale ({p2pPct}%)</span>
                </div>
                <span className="font-bold text-slate-800">{p2pCount} items</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-semibold text-slate-600">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#067D62]" />
                  <span>NGO Donation ({ngoPct}%)</span>
                </div>
                <span className="font-bold text-slate-800">{ngoCount} items</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-semibold text-slate-600">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF9900]" />
                  <span>Recommerced ({refurbishPct}%)</span>
                </div>
                <span className="font-bold text-slate-800">{refurbishCount} items</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Divider 4 */}
        <hr className="border-slate-200" />

        {/* SECTION 5 — Recent Returns Table & Ledger */}
        <div className="grid grid-cols-1 gap-6">
          {/* Recent Returns */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-200 text-left">
              <h3 className="text-base font-bold text-slate-800">Recent Circular Returns</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">Product</th>
                    <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">Grade</th>
                    <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">Disposition</th>
                    <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">CO₂ Saved</th>
                    <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">Credits</th>
                    <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dashboardData.recent_returns.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/85 transition-colors">
                      <td className="px-5 py-4 text-sm text-slate-700 border-b border-slate-100">
                        <div className="flex flex-col gap-1 items-start">
                          <span
                            onClick={() => navigate(`/passport/${item.product_id}`)}
                            className="text-sm font-semibold text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer transition-colors"
                          >
                            {item.product_name}
                          </span>
                          {(item.route === 'refurbish' || item.route === 'p2p') && (
                            <span
                              onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/renewed/${item.product_id}`);
                              }}
                              className="text-xs text-[#007185] hover:text-[#C7511F] font-bold hover:underline block mt-0.5 cursor-pointer"
                            >
                              View Listing ➜
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-700 border-b border-slate-100">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${gradeStyle(item.grade)}`}>
                          {item.grade || "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-700 border-b border-slate-100">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${routeColor[item.route] || "text-slate-400"} ${routeBg[item.route] || "bg-slate-50"}`}>
                          {routeLabel[item.route] || item.route || "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-[#067D62] border-b border-slate-100 font-bold">+{item.co2_saved || 0} kg</td>
                      <td className="px-5 py-4 text-sm text-[#067D62] border-b border-slate-100 font-bold">+{item.credits_earned || 0} pts</td>
                      <td className="px-5 py-4 text-sm text-slate-700 border-b border-slate-100 text-slate-500 font-semibold">{formatDate(item.date)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transaction Ledger */}
          <div ref={ledgerRef} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <button
              onClick={() => setLedgerOpen(v => !v)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors focus:outline-none border-b border-slate-200 cursor-pointer"
            >
              <span className="flex items-center text-base font-semibold text-slate-800">
                <CreditCard size={18} className="text-[#FF9900] mr-2" />
                Credit Transaction Ledger
              </span>
              <ChevronRight size={18} className={`text-slate-400 transition-transform duration-200 ${ledgerOpen ? "rotate-90" : ""}`} />
            </button>
            {ledgerOpen && (
              <div className="px-6 pb-6 pt-4 space-y-3 animate-fade-in">
                {(creditsData?.transactions || []).map((t, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-slate-50 border border-slate-100 p-4 rounded-xl text-left">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{t.notes}</p>
                      <p className="text-xs text-slate-400 mt-0.5 font-semibold">{formatDate(t.timestamp)}</p>
                    </div>
                    <span className={`font-bold text-base ${t.amount > 0 ? "text-[#067D62]" : "text-[#D13212]"}`}>
                      {t.amount > 0 ? "+" : ""}{t.amount} pts
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* ── Redeem Modal ── */}
      {redeemModal && (
        <Modal
          open={!!redeemModal}
          onClose={() => setRedeemModal(null)}
          title="Confirm Redemption"
          maxWidth="450px"
        >
          <div className="space-y-5">
            <div className="flex items-center gap-4 bg-gray-50 border border-[#E7E7E7] p-5 rounded-xl">
              <span className="text-4xl">{redeemModal.icon}</span>
              <div>
                <p className="text-xs text-gray-500 font-medium">You will spend</p>
                <p className="text-3xl font-bold text-[#FF9900]">{redeemModal.credits} <span className="text-base font-semibold text-gray-600">credits</span></p>
                <p className="text-xs text-gray-500 mt-1">Balance: <strong className="text-gray-800">{balance.toLocaleString()}</strong> → <strong className="text-gray-800">{(balance - redeemModal.credits).toLocaleString()}</strong></p>
              </div>
            </div>

            {redeemStatus === "success" ? (
              <div className="space-y-4 text-center animate-fade-in">
                <div className="w-16 h-16 mx-auto rounded-full bg-[#067D62]/10 flex items-center justify-center">
                  <CheckCircle className="text-[#067D62]" size={36} />
                </div>
                <p className="text-base font-bold text-[#067D62]">Redemption Successful!</p>
                <div
                  onClick={() => handleCopyCode(couponCode)}
                  className="bg-gray-50 border border-gray-200 hover:border-[#FF9900] p-4 rounded-xl cursor-pointer transition-all group"
                  title="Click to copy voucher code"
                >
                  <p className="text-xs text-gray-500 mb-1.5">Your coupon code (tap to copy):</p>
                  <p className="text-lg font-bold text-[#067D62] font-mono tracking-widest group-hover:scale-105 transition-transform">{couponCode}</p>
                </div>
                <Button variant="primary" fullWidth onClick={() => setRedeemModal(null)}>Done</Button>
              </div>
            ) : redeemStatus === "error" ? (
              <div className="space-y-4">
                <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 p-4 rounded-xl font-medium">{redeemError || "An error occurred."}</p>
                <Button variant="secondary" fullWidth onClick={() => setRedeemModal(null)}>Dismiss</Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 leading-relaxed">
                  A coupon code will be generated instantly. Use it at checkout on any Amazon order.
                </p>
                {redeemError && <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl font-medium">{redeemError}</p>}
                <div className="flex gap-3">
                  <Button variant="secondary" fullWidth onClick={() => setRedeemModal(null)}>Cancel</Button>
                  <Button variant="primary" fullWidth loading={redeemStatus === "loading"} onClick={handleRedeem}>Confirm Redeem</Button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* ── Leaderboard Modal ── */}
      {leaderboardOpen && (
        <Modal
          open={leaderboardOpen}
          onClose={() => setLeaderboardOpen(false)}
          title="National Leaderboard"
          maxWidth="450px"
        >
          <div className="space-y-5">
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {LEADERBOARD_DATA.map((entry) => (
                <div
                  key={entry.rank}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${entry.isMe
                    ? "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-sm"
                    : "bg-gray-50 border-gray-100 hover:bg-gray-100"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 text-center text-sm font-black ${entry.rank === 1 ? "text-amber-500" :
                      entry.rank === 2 ? "text-gray-400" :
                        entry.rank === 3 ? "text-amber-700" : "text-gray-400"
                      }`}>
                      #{entry.rank}
                    </span>
                    <div>
                      <p className={`text-sm font-semibold ${entry.isMe ? "text-amber-700" : "text-gray-800"}`}>
                        {entry.name} {entry.isMe && <span className="text-amber-500">(You)</span>}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{entry.badge}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-700">{entry.score} pts</span>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 border border-[#E7E7E7] p-4 rounded-xl text-center">
              <p className="text-xs text-[#067D62] font-semibold leading-relaxed">
                🚀 Earn more Green Credits by returning items and buying Renewed products. Level up your tier!
              </p>
            </div>

            <Button variant="secondary" fullWidth onClick={() => setLeaderboardOpen(false)}>Close</Button>
          </div>
        </Modal>
      )}

      {/* ── Toast Message ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-white border border-gray-200 text-gray-850 px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-slide-up">
          <div className="w-8 h-8 rounded-full bg-[#067D62]/10 flex items-center justify-center flex-shrink-0">
            <CheckCircle size={16} className="text-[#067D62]" />
          </div>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
