import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip,
} from "recharts";
import {
  Leaf, Award, Recycle, Gift, ChevronRight,
  CheckCircle, Sparkles, X, CreditCard, Zap,
  ShieldCheck, Star, Trophy, Users
} from "lucide-react";
import { getUserDashboard, getCredits, redeemCredits } from "../api/reloop";

// ── Reward Catalogue (mirrors backend) ───────────────────────────────────────
const REWARDS = [
  { reward_id: "amazon_50",    title: "₹50 Amazon Discount",   credits: 100, value: "₹50 off",  icon: "🏷️",  type: "discount" },
  { reward_id: "amazon_100",   title: "₹100 Amazon Discount",  credits: 200, value: "₹100 off", icon: "🎫",  type: "discount" },
  { reward_id: "amazon_250",   title: "₹250 Amazon Discount",  credits: 500, value: "₹250 off", icon: "💎",  type: "discount" },
  { reward_id: "ngo_plant",    title: "Plant a Tree via NGO",  credits:  50, value: "1 tree 🌱", icon: "🌳",  type: "ngo"      },
  { reward_id: "priority_access", title: "Priority Renewed Access", credits: 150, value: "VIP 🔓", icon: "⭐", type: "tier"   },
];

// ── Tier definitions ──────────────────────────────────────────────────────────
const TIERS = [
  { name: "Seedling",    min: 0,    max: 200,  color: "#6ee7b7", icon: "🌱", desc: "Just getting started" },
  { name: "Green",       min: 200,  max: 500,  color: "#34d399", icon: "🍃", desc: "Building good habits" },
  { name: "Eco Hero",    min: 500,  max: 1000, color: "#10b981", icon: "🏆", desc: "Certified sustainability champion" },
  { name: "Planet Saver",min: 1000, max: Infinity, color: "#059669", icon: "🌍", desc: "Top 5% of ReLoop users" },
];

function getTier(credits) {
  return TIERS.find(t => credits >= t.min && credits < t.max) || TIERS[0];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [creditsData, setCreditsData] = useState(null);
  const [ledgerOpen, setLedgerOpen] = useState(false);
  const [redeemModal, setRedeemModal] = useState(null); // { reward }
  const [redeemStatus, setRedeemStatus] = useState(null); // null | "loading" | "success" | "error"
  const [couponCode, setCouponCode] = useState("");
  const [redeemError, setRedeemError] = useState("");

  const userId = "user_priya_001";

  useEffect(() => {
    let active = true;
    setLoading(true);

    Promise.all([getUserDashboard(userId), getCredits(userId)])
      .then(([dashRes, credsRes]) => {
        if (!active) return;

        // Use real API data if available, fall back to seed-based defaults
        const balance   = credsRes?.balance      ?? 240.0;
        const earned    = credsRes?.total_earned  ?? 340.0;
        const spent     = credsRes?.total_spent   ?? 100.0;
        const co2       = dashRes?.impact?.co2_saved_kg ?? 28.4;
        const trees     = dashRes?.impact?.trees_equivalent ?? 1.4;
        const refurbished = dashRes?.impact?.items_refurbished ?? 1;
        const donated   = dashRes?.impact?.items_donated    ?? 1;
        const p2p       = dashRes?.impact?.items_p2p        ?? 1;
        const totalRet  = dashRes?.impact?.total_returns    ?? 3;

        setDashboardData({
          user:  { name: dashRes?.user?.name || "Priya Sharma", member_since: dashRes?.user?.member_since || "2024-04-14" },
          impact: { co2_saved_kg: co2, trees_equivalent: trees, returns_avoided: dashRes?.impact?.returns_avoided ?? 1, items_refurbished: refurbished, items_donated: donated, items_p2p: p2p, total_returns: totalRet },
          green_credits: { balance, total_earned: earned, total_spent: spent },
          recent_returns: dashRes?.recent_returns?.length ? dashRes.recent_returns : [
            { return_id: "RET-20260613-0001", product_id: "prod_samsung_m34_001", product_name: "Samsung Galaxy M34 5G", status: "completed", route: "refurbish", grade: "Good", credits_earned: 150.0, co2_saved: 49.0, date: "2026-06-13" },
            { return_id: "RET-20260530-0005", product_id: "prod_levis_jacket_001", product_name: "Levi's Trucker Denim Jacket", status: "completed", route: "ngo_donate", grade: "Fair", credits_earned: 80.0, co2_saved: 8.5, date: "2026-05-30" },
          ],
          leaderboard_rank: dashRes?.leaderboard_rank ?? 42,
          sustainability_score: dashRes?.sustainability_score ?? 84,
        });

        setCreditsData({
          balance,
          transactions: credsRes?.transactions?.length ? credsRes.transactions : [
            { amount: 150.0,  transaction_type: "earned_return",    notes: "Refurbished Samsung Galaxy M34 5G",       timestamp: "2026-06-13T11:30:00" },
            { amount: -100.0, transaction_type: "spent_discount",   notes: "₹100 discount on next order",             timestamp: "2026-06-10T09:00:00" },
            { amount: 80.0,   transaction_type: "earned_return",    notes: "Donated Levi's Jacket to Clothes Forward", timestamp: "2026-05-30T14:00:00" },
            { amount: 50.0,   transaction_type: "earned_purchase",  notes: "Bought Amazon Renewed — Boat Airdopes",    timestamp: "2026-05-10T12:00:00" },
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

  if (loading || !dashboardData) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <Recycle className="animate-spin text-indigo-500" size={32} />
          <span className="text-sm font-medium">Loading Eco Dashboard...</span>
        </div>
      </div>
    );
  }

  const balance = creditsData?.balance ?? dashboardData.green_credits.balance;
  const tier = getTier(balance);
  const nextTier = TIERS[TIERS.indexOf(tier) + 1];
  const tierProgress = nextTier ? Math.round(((balance - tier.min) / (nextTier.min - tier.min)) * 100) : 100;

  const co2TrendData = [
    { month: "Jan", co2: 5.2 },
    { month: "Feb", co2: 8.4 },
    { month: "Mar", co2: 12.1 },
    { month: "Apr", co2: 18.0 },
    { month: "May", co2: 24.3 },
    { month: "Jun", co2: dashboardData.impact.co2_saved_kg },
  ];

  const routeLabel = { refurbish: "Refurbished", p2p: "P2P Resale", ngo_donate: "Donated", recycle: "Recycled", landfill: "Disposed" };
  const routeColor = { refurbish: "text-orange-400", p2p: "text-indigo-400", ngo_donate: "text-emerald-400", recycle: "text-teal-400", landfill: "text-slate-400" };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 px-4 py-6 space-y-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-100">
              Eco Dashboard <span className="text-indigo-400">✦</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Welcome back, {dashboardData.user.name} · Member since {dashboardData.user.member_since}</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs font-bold">
            <Trophy size={14} className="text-amber-400" />
            <span className="text-slate-300">Rank <span className="text-amber-400">#{dashboardData.leaderboard_rank}</span> in India</span>
          </div>
        </div>

        {/* ── Tier Card + Progress ── */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/30 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl flex-shrink-0">
              {tier.icon}
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-widest" style={{ color: tier.color }}>{tier.name} Tier</span>
                <ShieldCheck size={13} style={{ color: tier.color }} />
              </div>
              <p className="text-[11px] text-slate-400">{tier.desc}</p>
              {nextTier && (
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>{balance} pts</span>
                    <span>{nextTier.min} pts → {nextTier.name} {nextTier.icon}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${tierProgress}%`, background: tier.color }} />
                  </div>
                </div>
              )}
              {!nextTier && <p className="text-[10px] text-emerald-400 font-bold">🎉 Maximum tier achieved!</p>}
            </div>
          </div>

          {/* Credits badge */}
          <div className="text-center sm:text-right">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Balance</span>
            <span className="text-3xl font-black text-slate-100">{balance.toLocaleString()}</span>
            <span className="text-xs text-indigo-400 font-bold block">Green Credits</span>
            <span className="text-[10px] text-slate-500">Total earned: {dashboardData.green_credits.total_earned}</span>
          </div>
        </div>

        {/* ── 4 Impact Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "CO₂ Saved",    value: `${dashboardData.impact.co2_saved_kg} kg`, icon: "🍃", color: "text-emerald-400" },
            { label: "Trees Equiv.", value: `${dashboardData.impact.trees_equivalent} 🌳`, icon: "🌲", color: "text-green-400" },
            { label: "Items Recirculated", value: dashboardData.impact.items_refurbished + dashboardData.impact.items_donated + dashboardData.impact.items_p2p, icon: "♻️", color: "text-teal-400" },
            { label: "Returns Avoided", value: dashboardData.impact.returns_avoided, icon: "🛡️", color: "text-indigo-400" },
          ].map(({ label, value, icon, color }, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
              <span className="text-lg">{icon}</span>
              <p className={`text-xl font-black ${color}`}>{value}</p>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">{label}</p>
            </div>
          ))}
        </div>

        {/* ── Rewards Redemption Section ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Gift size={16} className="text-amber-400" />
            <h3 className="text-sm font-bold text-slate-100">Redeem Green Credits</h3>
            <span className="text-[10px] text-slate-500 ml-auto">Balance: <strong className="text-slate-200">{balance} pts</strong></span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {REWARDS.map((reward) => {
              const canAfford = balance >= reward.credits;
              return (
                <div
                  key={reward.reward_id}
                  className={`relative p-4 rounded-xl border transition-all space-y-2 ${
                    canAfford
                      ? "border-slate-700 bg-slate-950/50 hover:border-amber-600/60 hover:bg-amber-950/10 cursor-pointer"
                      : "border-slate-800 bg-slate-950/30 opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() => canAfford && (setRedeemModal(reward), setRedeemStatus(null), setCouponCode(""), setRedeemError(""))}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-2xl">{reward.icon}</span>
                    {canAfford && <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded font-extrabold uppercase">Available</span>}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-200">{reward.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Value: <strong className="text-amber-400">{reward.value}</strong></p>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                    <span className="text-[10px] font-bold text-indigo-400">{reward.credits} credits</span>
                    {canAfford && <span className="text-[10px] text-slate-400">Tap to redeem →</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── CO₂ Trend Chart ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-100">CO₂ Savings Trend</h3>
          <p className="text-[11px] text-slate-400">Cumulative carbon offset (kg) across your returns</p>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={co2TrendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#475569" fontSize={11} />
                <YAxis stroke="#475569" fontSize={11} unit="kg" />
                <ChartTooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', color: '#e2e8f0', fontSize: 11 }} />
                <Line type="monotone" dataKey="co2" stroke="#6366f1" strokeWidth={2.5} dot={{ fill: '#6366f1', r: 4, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Recent Returns Table ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-100">Recent Circular Returns</h3>
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-bold">
                  {["Product", "Grade", "Disposition", "CO₂ Saved", "Credits", "Date"].map(h => (
                    <th key={h} className="p-3 text-[10px] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dashboardData.recent_returns.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-850 hover:bg-slate-800/30 transition-colors">
                    <td className="p-3 font-semibold text-slate-200">{item.product_name}</td>
                    <td className="p-3 capitalize text-slate-300">{item.grade || "—"}</td>
                    <td className={`p-3 font-semibold capitalize ${routeColor[item.route] || "text-slate-400"}`}>{routeLabel[item.route] || item.route || "—"}</td>
                    <td className="p-3 font-bold text-emerald-400">+{item.co2_saved || 0} kg</td>
                    <td className="p-3 font-bold text-indigo-400">+{item.credits_earned || 0} pts</td>
                    <td className="p-3 text-slate-500">{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Transaction Ledger (collapsible) ── */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <button
            onClick={() => setLedgerOpen(v => !v)}
            className="w-full flex items-center justify-between p-5 text-sm font-bold text-slate-100 hover:bg-slate-800/30 transition-colors"
          >
            <span className="flex items-center gap-2"><CreditCard size={15} className="text-indigo-400" /> Credit Transaction Ledger</span>
            <span className={`transition-transform ${ledgerOpen ? "rotate-180" : ""}`}>▾</span>
          </button>
          {ledgerOpen && (
            <div className="px-5 pb-5 space-y-2">
              {(creditsData?.transactions || []).map((t, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs bg-slate-950/50 border border-slate-850 p-3 rounded-xl">
                  <div>
                    <p className="font-semibold text-slate-200">{t.notes}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{(t.timestamp || "").slice(0, 10)}</p>
                  </div>
                  <span className={`font-black text-sm ${t.amount > 0 ? "text-emerald-400" : "text-rose-400"}`}>
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
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl animate-fade-in">

            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Confirm Redemption</span>
                <h3 className="text-lg font-extrabold text-slate-100 mt-0.5">{redeemModal.title}</h3>
              </div>
              <button onClick={() => setRedeemModal(null)} className="text-slate-500 hover:text-slate-300 transition-colors p-1">
                <X size={18} />
              </button>
            </div>

            <div className="flex items-center gap-4 bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
              <span className="text-3xl">{redeemModal.icon}</span>
              <div>
                <p className="text-xs text-slate-400">You will spend</p>
                <p className="text-2xl font-black text-amber-400">{redeemModal.credits} credits</p>
                <p className="text-[11px] text-slate-400">Current balance: <strong className="text-slate-200">{balance}</strong> → <strong className="text-slate-200">{balance - redeemModal.credits}</strong></p>
              </div>
            </div>

            {redeemStatus === "success" ? (
              <div className="space-y-3 text-center animate-fade-in">
                <CheckCircle className="text-emerald-400 mx-auto" size={40} />
                <p className="text-sm font-bold text-emerald-300">Redemption Successful!</p>
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
                  <p className="text-[10px] text-slate-400 mb-1">Your coupon code:</p>
                  <p className="text-base font-black text-amber-400 font-mono tracking-widest">{couponCode}</p>
                </div>
                <button onClick={() => setRedeemModal(null)} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition-all">Close</button>
              </div>
            ) : redeemStatus === "error" ? (
              <div className="space-y-3">
                <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/40 p-3 rounded-xl">{redeemError || "An error occurred."}</p>
                <button onClick={() => setRedeemModal(null)} className="w-full py-2.5 bg-slate-800 text-slate-200 font-bold rounded-xl text-xs">Dismiss</button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  A coupon code will be generated instantly. Use it at checkout on any Amazon order.
                </p>
                {redeemError && <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/40 p-2 rounded-lg">{redeemError}</p>}
                <div className="flex gap-3">
                  <button
                    onClick={() => setRedeemModal(null)}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRedeem}
                    disabled={redeemStatus === "loading"}
                    className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold rounded-xl text-xs transition-all"
                  >
                    {redeemStatus === "loading" ? "Processing..." : "Confirm Redeem"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
