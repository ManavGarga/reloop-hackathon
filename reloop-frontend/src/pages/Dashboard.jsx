import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip,
} from "recharts";
import {
  Leaf, Award, Recycle, Gift, ChevronRight,
  CheckCircle, Sparkles, X, CreditCard, Zap,
  ShieldCheck, Star, Trophy, Users, TrendingUp, TreePine, Shield, Package
} from "lucide-react";
import { getUserDashboard, getCredits, redeemCredits } from "../api/reloop";

// ── Reward Catalogue ──────────────────────────────────────────────────────────
const REWARDS = [
  { reward_id: "amazon_50", title: "₹50 Amazon Discount", credits: 100, value: "₹50 off", icon: "🏷️", type: "discount" },
  { reward_id: "amazon_100", title: "₹100 Amazon Discount", credits: 200, value: "₹100 off", icon: "🎫", type: "discount" },
  { reward_id: "amazon_250", title: "₹250 Amazon Discount", credits: 500, value: "₹250 off", icon: "💎", type: "discount" },
  { reward_id: "ngo_plant", title: "Plant a Tree via NGO", credits: 50, value: "1 tree 🌱", icon: "🌳", type: "ngo" },
  { reward_id: "priority_access", title: "Priority Renewed Access", credits: 150, value: "VIP 🔓", icon: "⭐", type: "tier" },
];

// ── Tier definitions ──────────────────────────────────────────────────────────
const TIERS = [
  { name: "Seedling", min: 0, max: 200, color: "#16a34a", icon: "🌱", desc: "Just getting started" },
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
  return TIERS.find(t => credits >= t.min && credits < t.max) || TIERS[0];
}

// Custom tooltip for chart
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3">
        <p className="text-xs font-semibold text-gray-800">{label}</p>
        <p className="text-sm font-bold text-emerald-600">{payload[0].value} kg CO₂</p>
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
  const [ledgerOpen, setLedgerOpen] = useState(false);
  const [redeemModal, setRedeemModal] = useState(null);
  const [redeemStatus, setRedeemStatus] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [redeemError, setRedeemError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);

  const chartRef = useRef(null);
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
          user: { name: dashRes?.user?.name || "Priya S. Sharma", member_since: dashRes?.user?.member_since || "2026-04-14" },
          impact: { co2_saved_kg: co2, trees_equivalent: trees, returns_avoided: dashRes?.impact?.returns_avoided ?? 0, items_refurbished: refurbished, items_donated: donated, items_p2p: p2p, total_returns: totalRet },
          green_credits: { balance, total_earned: earned, total_spent: spent },
          recent_returns: dashRes?.recent_returns?.length ? dashRes.recent_returns : [
            { return_id: "RET-20260613-0001", product_id: "prod_samsung_m34_001", product_name: "Samsung Galaxy M34 5G", status: "completed", route: "p2p", grade: "Good", credits_earned: 100.0, co2_saved: 42.0, date: "2026-06-14" },
            { return_id: "RET-20260612-0002", product_id: "prod_samsung_m34_002", product_name: "Samsung Galaxy M34 5G", status: "completed", route: "p2p", grade: "Good", credits_earned: 100.0, co2_saved: 42.0, date: "2026-06-14" },
            { return_id: "RET-20260530-0005", product_id: "prod_levis_jacket_001", product_name: "Levi's Trucker Denim Jacket", status: "completed", route: "ngo_donate", grade: "Fair", credits_earned: 80.0, co2_saved: 8.5, date: "2026-05-30" },
          ],
          leaderboard_rank: dashRes?.leaderboard_rank ?? 42,
          sustainability_score: dashRes?.sustainability_score ?? 84,
        });

        setCreditsData({
          balance,
          transactions: credsRes?.transactions?.length ? credsRes.transactions : [
            { amount: 100.0, transaction_type: "earned_return", notes: "P2P Resale — Samsung Galaxy M34 5G", timestamp: "2026-06-14T11:30:00" },
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

  const handleImpactClick = () => {
    chartRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  if (loading || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-[#ecfdf5] to-[#f0f9ff] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4 text-gray-500">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-500 rounded-full animate-spin"></div>
            <Leaf className="absolute inset-0 m-auto text-emerald-500" size={20} />
          </div>
          <span className="text-sm font-medium text-gray-600">Loading your Eco Dashboard...</span>
        </div>
      </div>
    );
  }

  const balance = creditsData?.balance ?? dashboardData.green_credits.balance;
  const tier = getTier(balance);
  const nextTier = TIERS[TIERS.indexOf(tier) + 1];
  const tierProgress = nextTier ? Math.round(((balance - tier.min) / (nextTier.min - tier.min)) * 100) : 100;

  const co2TrendData = [
    { month: "Jan", co2: 45 },
    { month: "Feb", co2: 98 },
    { month: "Mar", co2: 156 },
    { month: "Apr", co2: 230 },
    { month: "May", co2: 335 },
    { month: "Jun", co2: dashboardData.impact.co2_saved_kg },
  ];

  const routeLabel = { refurbish: "Refurbished", p2p: "P2P Resale", ngo_donate: "Donated", recycle: "Recycled", landfill: "Disposed" };
  const routeColor = { refurbish: "text-amber-600", p2p: "text-blue-600", ngo_donate: "text-emerald-600", recycle: "text-teal-600", landfill: "text-gray-400" };
  const routeBg = { refurbish: "bg-amber-50", p2p: "bg-blue-50", ngo_donate: "bg-emerald-50", recycle: "bg-teal-50", landfill: "bg-gray-50" };

  return (
    <div className="bg-gradient-to-br from-[#f8fffe] via-[#f0fdf4] to-[#f0f9ff] min-h-screen w-full text-gray-900 font-sans">
      <div className="max-w-[1200px] w-full mx-auto px-10 py-8 space-y-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400">
          <span className="hover:text-emerald-600 cursor-pointer transition-colors" onClick={() => navigate("/profile")}>Your Account</span>
          <ChevronRight size={12} />
          <span className="text-emerald-600 font-medium">Eco Dashboard</span>
        </nav>

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
              Eco Dashboard
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100">
                <Leaf size={16} className="text-emerald-600" />
              </span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back, <span className="font-medium text-gray-700">{dashboardData.user.name}</span> · Member since {dashboardData.user.member_since}
            </p>
          </div>
          <button
            onClick={() => setLeaderboardOpen(true)}
            className="flex items-center gap-2.5 bg-white hover:bg-amber-50 border border-gray-200 hover:border-amber-300 px-5 py-2.5 rounded-full text-sm font-semibold cursor-pointer text-gray-700 transition-all shadow-sm hover:shadow-md group"
          >
            <Trophy size={16} className="text-amber-500 group-hover:scale-110 transition-transform" />
            <span>Rank <span className="text-amber-600 font-bold">#{dashboardData.leaderboard_rank}</span> in India</span>
          </button>
        </div>

        {/* ── Tier + Credits Hero Section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tier Card */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center text-3xl flex-shrink-0 shadow-sm">
                {tier.icon}
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                      {tier.name} Tier
                    </span>
                    <ShieldCheck size={14} className="text-emerald-500" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">{tier.desc}</p>
                </div>
                {nextTier && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span className="font-semibold text-gray-700">{balance.toLocaleString()} pts</span>
                      <span>{nextTier.min.toLocaleString()} pts → {nextTier.name} {nextTier.icon}</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500 shadow-sm"
                        style={{ width: `${tierProgress}%` }}
                      />
                    </div>
                  </div>
                )}
                {!nextTier && (
                  <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-lg">
                    <Sparkles size={14} className="text-emerald-500" />
                    <p className="text-xs text-emerald-700 font-semibold">Maximum tier achieved!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Credits Balance Card */}
          <div
            onClick={handleCreditsClick}
            className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white cursor-pointer hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] group"
            title="Click to view transaction ledger"
          >
            <div className="flex flex-col h-full justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-emerald-100 uppercase tracking-wider">Credits Balance</span>
                <CreditCard size={18} className="text-emerald-200 group-hover:rotate-12 transition-transform" />
              </div>
              <div className="mt-3">
                <span className="text-4xl font-black tracking-tight">{balance.toLocaleString()}</span>
                <p className="text-emerald-100 text-sm font-medium mt-1">Green Credits</p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
                <span className="text-xs text-emerald-200">Total earned: {dashboardData.green_credits.total_earned.toLocaleString()}</span>
                <ChevronRight size={14} className="text-emerald-200 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* ── 4 Impact Stats ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "CO₂ Saved", value: `${dashboardData.impact.co2_saved_kg}`, unit: "kg", icon: <Leaf size={20} />, gradient: "from-emerald-500 to-green-500", bg: "bg-emerald-50", iconColor: "text-emerald-600", clickable: true, onClick: handleImpactClick },
            { label: "Trees Equiv.", value: `${dashboardData.impact.trees_equivalent}`, unit: "🌳", icon: <TreePine size={20} />, gradient: "from-green-500 to-emerald-600", bg: "bg-green-50", iconColor: "text-green-600", clickable: true, onClick: handleImpactClick },
            { label: "Items Recirculated", value: `${dashboardData.impact.items_refurbished + dashboardData.impact.items_donated + dashboardData.impact.items_p2p}`, unit: "", icon: <Recycle size={20} />, gradient: "from-teal-500 to-cyan-500", bg: "bg-teal-50", iconColor: "text-teal-600", clickable: false },
            { label: "Returns Avoided", value: `${dashboardData.impact.returns_avoided}`, unit: "", icon: <Shield size={20} />, gradient: "from-indigo-500 to-purple-500", bg: "bg-indigo-50", iconColor: "text-indigo-600", clickable: false },
          ].map(({ label, value, unit, icon, gradient, bg, iconColor, clickable, onClick }, idx) => (
            <div
              key={idx}
              onClick={clickable ? onClick : undefined}
              className={`bg-white rounded-2xl border border-gray-100 p-5 transition-all shadow-sm ${clickable
                ? "cursor-pointer hover:shadow-md hover:border-emerald-200 hover:scale-[1.02] group"
                : ""
                }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center ${iconColor}`}>
                  {icon}
                </div>
                {clickable && (
                  <TrendingUp size={14} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
                )}
              </div>
              <p className="text-2xl font-black text-gray-900">{value}<span className="text-lg ml-1">{unit}</span></p>
              <p className="text-xs text-gray-500 mt-1 font-medium">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Rewards Section ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                <Gift size={18} className="text-amber-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Redeem Green Credits</h3>
                <p className="text-xs text-gray-500">Your Balance: <span className="font-bold text-emerald-600">{balance.toLocaleString()} pts</span></p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {REWARDS.map((reward) => {
              const canAfford = balance >= reward.credits;
              return (
                <div
                  key={reward.reward_id}
                  className={`relative rounded-xl border p-5 transition-all ${canAfford
                    ? "border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md cursor-pointer group"
                    : "border-gray-100 bg-gray-50/50 opacity-60 cursor-not-allowed"
                    }`}
                  onClick={() => canAfford && (setRedeemModal(reward), setRedeemStatus(null), setCouponCode(""), setRedeemError(""))}
                >
                  {canAfford && (
                    <span className="absolute top-3 right-3 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                      Available
                    </span>
                  )}
                  <span className="text-2xl block mb-3">{reward.icon}</span>
                  <p className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">{reward.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Value: <strong className="text-emerald-600">{reward.value}</strong>
                  </p>
                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-600">{reward.credits} credits</span>
                    {canAfford ? (
                      <span className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-[10px] rounded-lg shadow-sm transition-all uppercase tracking-wide">
                        Redeem
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-400 font-medium">Need {reward.credits - balance} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── CO₂ Trend Chart ── */}
        <div ref={chartRef} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900">CO₂ Savings Trend</h3>
              <p className="text-xs text-gray-500 mt-0.5">Cumulative carbon offset (kg) across your returns</p>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full">
              <TrendingUp size={14} className="text-emerald-600" />
              <span className="text-xs font-bold text-emerald-700">+{dashboardData.impact.co2_saved_kg} kg total</span>
            </div>
          </div>
          <div className="h-56 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={co2TrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="co2Gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} unit="kg" />
                <ChartTooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="co2"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#co2Gradient)"
                  dot={{ fill: '#10b981', r: 5, strokeWidth: 3, stroke: '#fff' }}
                  activeDot={{ r: 7, strokeWidth: 3, stroke: '#10b981', fill: '#fff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Recent Returns ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 pb-4">
            <h3 className="text-base font-bold text-gray-900">Recent Circular Returns</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-gray-50 border-y border-gray-100">
                  {["Product", "Grade", "Disposition", "CO₂ Saved", "Credits", "Date"].map(h => (
                    <th key={h} className="px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {dashboardData.recent_returns.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span
                          onClick={() => navigate(`/passport/${item.product_id}`)}
                          className="text-sm font-semibold text-gray-900 hover:text-emerald-600 cursor-pointer transition-colors"
                        >
                          {item.product_name}
                        </span>
                        {(item.route === 'refurbish' || item.route === 'p2p') && (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/renewed/${item.product_id}`);
                            }}
                            className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium cursor-pointer transition-all w-fit"
                          >
                            View Listing <ChevronRight size={12} />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 capitalize">
                        {item.grade || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${routeColor[item.route] || "text-gray-400"} ${routeBg[item.route] || "bg-gray-50"}`}>
                        {routeLabel[item.route] || item.route || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-600 text-sm">+{item.co2_saved || 0} kg</td>
                    <td className="px-6 py-4 font-bold text-emerald-700 text-sm">+{item.credits_earned || 0} pts</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Transaction Ledger (collapsible) ── */}
        <div ref={ledgerRef} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button
            onClick={() => setLedgerOpen(v => !v)}
            className="w-full flex items-center justify-between p-6 text-base font-bold text-gray-900 hover:bg-gray-50 transition-colors focus:outline-none"
          >
            <span className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                <CreditCard size={18} className="text-emerald-600" />
              </div>
              Credit Transaction Ledger
            </span>
            <ChevronRight size={18} className={`text-gray-400 transition-transform duration-200 ${ledgerOpen ? "rotate-90" : ""}`} />
          </button>
          {ledgerOpen && (
            <div className="px-6 pb-6 space-y-3 animate-fade-in">
              {(creditsData?.transactions || []).map((t, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-50 border border-gray-100 p-4 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{t.notes}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{(t.timestamp || "").slice(0, 10)}</p>
                  </div>
                  <span className={`font-bold text-base ${t.amount > 0 ? "text-emerald-600" : "text-rose-500"}`}>
                    {t.amount > 0 ? "+" : ""}{t.amount} pts
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ── Redeem Modal ── */}
      {redeemModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-7 max-w-md w-full space-y-5 shadow-2xl animate-fade-in">

            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Confirm Redemption</span>
                <h3 className="text-lg font-bold text-gray-900 mt-1">{redeemModal.title}</h3>
              </div>
              <button onClick={() => setRedeemModal(null)} className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-gray-100 focus:outline-none">
                <X size={18} />
              </button>
            </div>

            <div className="flex items-center gap-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 p-5 rounded-xl">
              <span className="text-4xl">{redeemModal.icon}</span>
              <div>
                <p className="text-xs text-gray-500">You will spend</p>
                <p className="text-3xl font-black text-emerald-700">{redeemModal.credits} <span className="text-base font-semibold">credits</span></p>
                <p className="text-xs text-gray-500 mt-1">Balance: <strong className="text-gray-800">{balance.toLocaleString()}</strong> → <strong className="text-gray-800">{(balance - redeemModal.credits).toLocaleString()}</strong></p>
              </div>
            </div>

            {redeemStatus === "success" ? (
              <div className="space-y-4 text-center animate-fade-in">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 flex items-center justify-center">
                  <CheckCircle className="text-emerald-500" size={36} />
                </div>
                <p className="text-base font-bold text-emerald-700">Redemption Successful!</p>
                <div
                  onClick={() => handleCopyCode(couponCode)}
                  className="bg-gray-50 border border-gray-200 hover:border-emerald-300 p-4 rounded-xl cursor-pointer transition-all group"
                  title="Click to copy voucher code"
                >
                  <p className="text-xs text-gray-500 mb-1.5">Your coupon code (tap to copy):</p>
                  <p className="text-lg font-black text-emerald-700 font-mono tracking-widest group-hover:scale-105 transition-transform">{couponCode}</p>
                </div>
                <button onClick={() => setRedeemModal(null)} className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl text-sm transition-all shadow-sm">Done</button>
              </div>
            ) : redeemStatus === "error" ? (
              <div className="space-y-4">
                <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 p-4 rounded-xl font-medium">{redeemError || "An error occurred."}</p>
                <button onClick={() => setRedeemModal(null)} className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl text-sm transition-all">Dismiss</button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 leading-relaxed">
                  A coupon code will be generated instantly. Use it at checkout on any Amazon order.
                </p>
                {redeemError && <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl font-medium">{redeemError}</p>}
                <div className="flex gap-3">
                  <button
                    onClick={() => setRedeemModal(null)}
                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl text-sm transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRedeem}
                    disabled={redeemStatus === "loading"}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-bold rounded-xl text-sm transition-all shadow-sm disabled:opacity-60"
                  >
                    {redeemStatus === "loading" ? "Processing..." : "Confirm Redeem"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Leaderboard Modal ── */}
      {leaderboardOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-7 max-w-md w-full space-y-5 shadow-2xl animate-fade-in">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Trophy className="text-amber-500" size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">National Leaderboard</h3>
                  <p className="text-xs text-gray-500">Green shoppers across India</p>
                </div>
              </div>
              <button onClick={() => setLeaderboardOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-1.5 rounded-lg hover:bg-gray-100 focus:outline-none">
                <X size={18} />
              </button>
            </div>

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

            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 p-4 rounded-xl text-center">
              <p className="text-xs text-emerald-700 font-medium leading-relaxed">
                🚀 Earn more Green Credits by returning items and buying Renewed products. Level up your tier!
              </p>
            </div>

            <button
              onClick={() => setLeaderboardOpen(false)}
              className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl text-sm transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── Toast Message ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-white border border-gray-200 text-gray-800 px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-slide-up">
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
            <CheckCircle size={16} className="text-emerald-500" />
          </div>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
