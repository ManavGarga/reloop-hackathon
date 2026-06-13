import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ReferenceLine } from "recharts";
import { Leaf, Award, Recycle, Gift, Users, ChevronRight, ChevronDown, CheckCircle, ShieldAlert, Sparkles, X, Heart, CreditCard, TreePine } from "lucide-react";
import { getUserDashboard, getCredits } from "../api/reloop";
import Spinner from "../components/shared/Spinner";
import GradeTag from "../components/shared/GradeTag";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [creditsData, setCreditsData] = useState(null);
  
  // Ledger collapse state
  const [ledgerOpen, setLedgerOpen] = useState(false);
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [redeemedStatus, setRedeemedStatus] = useState(false);

  const userId = "user_priya_001";

  // Fetch Dashboard and Credits
  useEffect(() => {
    let active = true;
    setLoading(true);
    
    Promise.all([getUserDashboard(userId), getCredits(userId)])
      .then(([dashRes, credsRes]) => {
        if (!active) return;
        
        // Setup dashboard data
        if (dashRes && dashRes.status === "ok" && !dashRes.mock) {
          setDashboardData(dashRes);
        } else {
          // Fallback Dashboard Mock
          setDashboardData({
            user: { name: "Priya Sharma", member_since: "2024-04-14" },
            impact: {
              co2_saved_kg: 28.4,
              trees_equivalent: 1.4,
              returns_avoided: 1,
              items_refurbished: 1,
              items_donated: 1,
              items_p2p: 1,
            },
            green_credits: { balance: 240.0, total_earned: 340.0, total_spent: 100.0 },
            recent_returns: [
              {
                return_id: "RET-20240613-0001",
                product_id: "prod_samsung_m34_001",
                product_name: "Samsung Galaxy M34 5G",
                status: "disposed",
                route: "refurbish",
                grade: "Good",
                credits_earned: 120.0,
                co2_saved: 59.5,
                date: "2024-06-13",
              },
              {
                return_id: "RET-20240530-0005",
                product_id: "prod_levis_jacket_001",
                product_name: "Levi's Trucker Denim Jacket",
                status: "completed",
                route: "ngo_donate",
                grade: "Fair",
                credits_earned: 80.0,
                co2_saved: 8.5,
                date: "2024-05-30",
              },
            ],
            leaderboard_rank: 42,
            sustainability_score: 84,
          });
        }

        // Setup credits data
        if (credsRes && credsRes.status === "ok" && !credsRes.mock) {
          setCreditsData(credsRes);
        } else {
          // Fallback Credits Mock
          setCreditsData({
            balance: 240.0,
            transactions: [
              { amount: 120.0, transaction_type: "earned_return", notes: "Refurbished Samsung Galaxy M34 5G", timestamp: "2024-06-13T11:30:00" },
              { amount: -100.0, transaction_type: "spent_discount", notes: "₹100 discount on next order", timestamp: "2024-06-10T09:00:00" },
              { amount: 220.0, transaction_type: "earned_return", notes: "Donated Zara shirt to Clothes Forward NGO", timestamp: "2024-05-30T14:00:00" },
            ],
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard fetch error", err);
        setLoading(false);
      });

    return () => { active = false; };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
        <Spinner message="Compiling sustainability report..." />
      </div>
    );
  }

  // Recharts Monthly Saved CO2 mock (last 6 months)
  const co2TrendData = [
    { month: "Jan", co2: 5.2 },
    { month: "Feb", co2: 8.4 },
    { month: "Mar", co2: 12.1 },
    { month: "Apr", co2: 18.0 },
    { month: "May", co2: 24.3 },
    { month: "Jun", co2: 28.4 },
  ];

  const averageCo2 = 16.1; // Monthly average

  // Tier setup
  const currentCredits = dashboardData.green_credits.total_earned;
  const tiers = [
    { name: "Bronze", limit: 100, benefit: "Basic entry, ReLoop packaging choice" },
    { name: "Silver", limit: 300, benefit: "10% off circular items, Priority P2P matching" },
    { name: "Green Champion", limit: 500, benefit: "Free circular pickup, Double Green Credits" },
  ];

  // Determine user current tier
  let activeTier = tiers[0];
  let nextTier = tiers[1];
  let progressPercent = 0;

  if (currentCredits >= 500) {
    activeTier = tiers[2];
    nextTier = null;
    progressPercent = 100;
  } else if (currentCredits >= 300) {
    activeTier = tiers[1];
    nextTier = tiers[2];
    progressPercent = ((currentCredits - 300) / 200) * 100;
  } else {
    activeTier = tiers[0];
    nextTier = tiers[1];
    progressPercent = (currentCredits / 300) * 100;
  }

  const redeemOptions = [
    { id: "amazon", title: "Amazon Gift Voucher", credits: 150, desc: "Get a ₹150 Amazon Gift Voucher", icon: <CreditCard className="text-orange-400" /> },
    { id: "ngo", title: "NGO Cash Donation", credits: 100, desc: "Donate ₹100 to rural education initiatives", icon: <Heart className="text-rose-400" /> },
    { id: "tree", title: "Plant a Tree", credits: 50, desc: "Plant a tree in the ReLoop Himalayan Forest", icon: <TreePine className="text-emerald-400" /> },
  ];

  const handleRedeem = (option) => {
    setSelectedReward(option);
    setRedeemedStatus(false);
  };

  const handleConfirmRedeem = () => {
    // Deduct credits visually for prototype
    setCreditsData(prev => ({
      ...prev,
      balance: prev.balance - selectedReward.credits,
      transactions: [
        {
          amount: -selectedReward.credits,
          transaction_type: "redeemed_reward",
          notes: `Redeemed: ${selectedReward.title}`,
          timestamp: new Date().toISOString()
        },
        ...prev.transactions
      ]
    }));
    
    // Update dashboard data credit balance
    setDashboardData(prev => ({
      ...prev,
      green_credits: {
        ...prev.green_credits,
        balance: prev.green_credits.balance - selectedReward.credits
      }
    }));

    setRedeemedStatus(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setSelectedReward(null);
    }, 2000);
  };

  // Route labels & icons helper
  const getRouteDetails = (route) => {
    switch (route) {
      case "refurbish":
        return { label: "Refurbish", color: "text-emerald-400", icon: "♻️" };
      case "ngo_donate":
        return { label: "NGO Donate", color: "text-indigo-400", icon: "🤝" };
      case "p2p":
        return { label: "P2P Resale", color: "text-teal-400", icon: "📱" };
      default:
        return { label: "Returned", color: "text-slate-400", icon: "📦" };
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen p-4 md:p-6 space-y-8 max-w-5xl mx-auto">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 p-6 border border-slate-800/80 rounded-3xl">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Welcome back, {dashboardData.user.name}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Circular Member since {new Date(dashboardData.user.member_since).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-950/30 border border-indigo-900/40 px-4 py-2.5 rounded-2xl">
          <Sparkles className="text-indigo-400 text-sm animate-pulse" size={16} />
          <span className="text-xs font-semibold text-slate-300">
            Sustainability Rank: <strong>#{dashboardData.leaderboard_rank}</strong> in India
          </span>
        </div>
      </div>

      {/* STATS GRID (3x2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Stat 1: Green Credits */}
        <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:border-slate-700 transition-colors">
          <span className="p-3 bg-emerald-950/60 text-emerald-400 rounded-xl border border-emerald-900/40">
            <Gift size={24} />
          </span>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Green Credits</span>
            <span className="text-2xl font-black text-slate-100 mt-0.5 block">
              {dashboardData.green_credits.balance}
            </span>
            <span className="text-[10px] text-emerald-500 font-semibold block">
              Total earned: {dashboardData.green_credits.total_earned}
            </span>
          </div>
        </div>

        {/* Stat 2: CO2 Saved */}
        <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:border-slate-700 transition-colors">
          <span className="p-3 bg-emerald-950/60 text-emerald-400 rounded-xl border border-emerald-900/40">
            <Leaf size={24} />
          </span>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">CO₂ Saved</span>
            <span className="text-2xl font-black text-slate-100 mt-0.5 block">
              {dashboardData.impact.co2_saved_kg} kg
            </span>
            <span className="text-[10px] text-slate-400 font-semibold block">
              🌳 Offset equivalent: {dashboardData.impact.trees_equivalent} trees
            </span>
          </div>
        </div>

        {/* Stat 3: Items Diverted */}
        <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:border-slate-700 transition-colors">
          <span className="p-3 bg-emerald-950/60 text-emerald-400 rounded-xl border border-emerald-900/40">
            <Recycle size={24} />
          </span>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Items Diverted</span>
            <span className="text-2xl font-black text-slate-100 mt-0.5 block">
              {dashboardData.impact.items_refurbished + dashboardData.impact.items_donated + dashboardData.impact.items_p2p}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold block">
              {dashboardData.impact.items_refurbished} refurb • {dashboardData.impact.items_donated} NGO
            </span>
          </div>
        </div>

        {/* Stat 4: Families Benefited */}
        <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:border-slate-700 transition-colors">
          <span className="p-3 bg-indigo-950/60 text-indigo-400 rounded-xl border border-indigo-900/40">
            <Users size={24} />
          </span>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Families Benefited</span>
            <span className="text-2xl font-black text-slate-100 mt-0.5 block">
              {dashboardData.impact.items_donated} Families
            </span>
            <span className="text-[10px] text-indigo-400 font-semibold block">
              via NGO donation channels
            </span>
          </div>
        </div>

        {/* Stat 5: Current Tier */}
        <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:border-slate-700 transition-colors">
          <span className="p-3 bg-indigo-950/60 text-indigo-400 rounded-xl border border-indigo-900/40">
            <Award size={24} />
          </span>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Current Tier</span>
            <span className="text-2xl font-black text-slate-100 mt-0.5 block">
              {activeTier.name}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold block">
              Total Points: {currentCredits}
            </span>
          </div>
        </div>

        {/* Stat 6: Next Reward */}
        <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:border-slate-700 transition-colors">
          <span className="p-3 bg-indigo-950/60 text-indigo-400 rounded-xl border border-indigo-900/40">
            🎁
          </span>
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block">Next Reward Milestone</span>
            <span className="text-base font-bold text-slate-100 mt-0.5 block leading-tight">
              {nextTier ? `${nextTier.name} (${nextTier.limit} pts)` : "Max Tier Reached!"}
            </span>
            <span className="text-[10px] text-slate-400 font-semibold block">
              {nextTier ? `${nextTier.limit - currentCredits} points to unlock` : "All rewards unlocked"}
            </span>
          </div>
        </div>

      </div>

      {/* LINE CHART: CO2 Saved Monthly */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-200">CO₂ Saved Per Month (Last 6 Months)</h2>
          <p className="text-xs text-slate-400">Monthly cumulative emissions offset tracking</p>
        </div>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={co2TrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} unit="kg" />
              <ChartTooltip 
                contentStyle={{ bg: "#0f172a", border: "1px solid #1e293b", borderRadius: "12px", color: "#f8fafc" }}
                itemStyle={{ color: "#10b981" }}
              />
              <ReferenceLine y={averageCo2} stroke="#3b82f6" strokeDasharray="3 3" label={{ value: `Avg (${averageCo2}kg)`, fill: '#60a5fa', fontSize: 10, position: 'top' }} />
              <Line 
                type="monotone" 
                dataKey="co2" 
                stroke="#16a34a" 
                strokeWidth={3} 
                dot={{ fill: "#16a34a", r: 4 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* TIER PROGRESS BAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
        <div>
          <h2 className="text-base font-bold text-slate-200">Circularity Tier Roadmap</h2>
          <p className="text-xs text-slate-400">Unlock reward multipliers and circular features</p>
        </div>

        {/* Graphic roadmap bar */}
        <div className="space-y-4">
          <div className="relative pt-2">
            <div className="h-2 bg-slate-800 rounded-full w-full">
              <div 
                className="h-full bg-gradient-to-r from-emerald-600 to-indigo-500 rounded-full transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {/* Markers */}
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-2">
              <div className="flex flex-col items-start">
                <span className={currentCredits >= 0 ? "text-emerald-400" : ""}>🥉 Bronze</span>
                <span>0 pts</span>
              </div>
              <div className="flex flex-col items-center">
                <span className={currentCredits >= 300 ? "text-indigo-400" : ""}>🥈 Silver</span>
                <span>300 pts</span>
              </div>
              <div className="flex flex-col items-end">
                <span className={currentCredits >= 500 ? "text-teal-400" : ""}>🏆 Green Champion</span>
                <span>500 pts</span>
              </div>
            </div>
          </div>

          <hr className="border-slate-800/80 my-3" />

          {/* Benefits list */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">Milestone Benefits Status</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {tiers.map((t, idx) => {
                const isUnlocked = currentCredits >= (idx === 0 ? 0 : idx === 1 ? 300 : 500);
                return (
                  <div key={idx} className={`p-4 rounded-xl border flex flex-col justify-between ${
                    isUnlocked 
                      ? "bg-slate-950/40 border-slate-800 text-slate-300" 
                      : "bg-slate-950/10 border-slate-900/40 text-slate-600"
                  }`}>
                    <div>
                      <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border inline-block mb-2 ${
                        isUnlocked 
                          ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/30" 
                          : "bg-slate-950/60 text-slate-600 border-slate-850"
                      }`}>
                        {isUnlocked ? "✓ Unlocked" : "🔒 Locked"}
                      </span>
                      <h5 className="text-xs font-bold text-slate-200">{t.name} Reward</h5>
                      <p className="text-[11px] mt-1 leading-relaxed">{t.benefit}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* RETURNS HISTORY TABLE */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-200">ReLoop Returns & Recycling History</h2>
        
        <div className="overflow-x-auto rounded-2xl border border-slate-850">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-850 text-slate-400 font-semibold">
                <th className="p-4">Product</th>
                <th className="p-4">Grade</th>
                <th className="p-4">Disposition</th>
                <th className="p-4">CO₂ Saved</th>
                <th className="p-4">Credits</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Verification</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recent_returns.map((item, idx) => {
                const routeInfo = getRouteDetails(item.route);
                return (
                  <tr key={idx} className="border-b border-slate-850/50 hover:bg-slate-900/40">
                    <td className="p-4 font-bold text-slate-200">{item.product_name}</td>
                    <td className="p-4"><GradeTag grade={item.grade} /></td>
                    <td className="p-4">
                      <span className={`flex items-center gap-1.5 font-medium ${routeInfo.color}`}>
                        <span>{routeInfo.icon}</span>
                        <span>{routeInfo.label}</span>
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-emerald-400">+{item.co2_saved} kg</td>
                    <td className="p-4 font-bold text-slate-300">+{item.credits_earned} pts</td>
                    <td className="p-4 text-slate-400 font-mono">{item.date}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => navigate(`/passport/${item.product_id}`)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline inline-flex items-center gap-0.5 cursor-pointer font-semibold"
                      >
                        <span>View Passport</span>
                        <ChevronRight size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREDITS LEDGER (COLLAPSIBLE) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        
        {/* Toggle bar */}
        <div 
          onClick={() => setLedgerOpen(!ledgerOpen)}
          className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-950/15 transition-all select-none"
        >
          <div className="flex items-center gap-2">
            <span>💰</span>
            <div>
              <h3 className="text-sm font-bold text-slate-200">Green Credits Transaction Ledger</h3>
              <p className="text-[11px] text-slate-400">View detailed points statements and redemptions</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all shadow cursor-pointer active:scale-95"
            >
              Redeem Credits
            </button>
            <span className="text-slate-400">
              {ledgerOpen ? <ChevronDown size={18} className="rotate-180 transition-transform" /> : <ChevronDown size={18} className="transition-transform" />}
            </span>
          </div>
        </div>

        {/* Collapsible Ledger table */}
        {ledgerOpen && (
          <div className="border-t border-slate-800 p-5 bg-slate-950/20 animate-slide-in">
            <div className="overflow-x-auto rounded-xl border border-slate-850">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-950 border-b border-slate-850 text-slate-400 font-semibold">
                    <th className="p-3">Reference / Purpose</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {creditsData.transactions.map((tx, idx) => (
                    <tr key={idx} className="border-b border-slate-850/50 hover:bg-slate-900/40">
                      <td className="p-3 font-semibold text-slate-200">{tx.notes}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${
                          tx.amount > 0 
                            ? "bg-green-950/30 text-green-400 border-green-900/40" 
                            : "bg-slate-900 text-slate-400 border-slate-800"
                        }`}>
                          {tx.transaction_type.replace("_", " ")}
                        </span>
                      </td>
                      <td className={`p-3 font-extrabold ${tx.amount > 0 ? "text-green-400" : "text-slate-400"}`}>
                        {tx.amount > 0 ? `+${tx.amount}` : tx.amount} pts
                      </td>
                      <td className="p-3 text-slate-500 font-mono">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* REDEEM CREDITS MODAL POPUP */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-850 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-5 relative animate-scale-in">
            
            {/* Close button */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                setSelectedReward(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1.5 hover:bg-slate-800 rounded-full transition-all"
            >
              <X size={16} />
            </button>

            {/* Modal Header */}
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-1.5">
                🎁 Redeem Green Credits
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Your Balance: <strong className="text-emerald-400 font-semibold">{dashboardData.green_credits.balance} pts</strong>
              </p>
            </div>

            {/* Modal Content */}
            {selectedReward ? (
              /* Reward confirmation layout */
              <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-2xl space-y-4 text-center">
                {redeemedStatus ? (
                  <div className="space-y-2 py-4">
                    <span className="inline-block p-3 bg-emerald-950/60 text-emerald-400 rounded-full border border-emerald-900/40 animate-bounce">
                      <CheckCircle size={32} />
                    </span>
                    <h4 className="text-sm font-bold text-emerald-400">Redeemed Successfully!</h4>
                    <p className="text-xs text-slate-300">
                      We deducted {selectedReward.credits} points from your ledger. Check your email for access.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-center">{selectedReward.icon}</div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-200">{selectedReward.title}</h4>
                      <p className="text-xs text-slate-400">{selectedReward.desc}</p>
                    </div>
                    
                    <div className="text-xs text-slate-300 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                      Cost: <strong>{selectedReward.credits} credits</strong>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedReward(null)}
                        className="flex-1 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmRedeem}
                        disabled={dashboardData.green_credits.balance < selectedReward.credits}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold text-white transition-all ${
                          dashboardData.green_credits.balance >= selectedReward.credits
                            ? "bg-emerald-600 hover:bg-emerald-500 cursor-pointer"
                            : "bg-slate-800 text-slate-500 border border-slate-850 cursor-not-allowed"
                        }`}
                      >
                        {dashboardData.green_credits.balance >= selectedReward.credits ? "Confirm" : "Insufficient Balance"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Reward list selection layout */
              <div className="space-y-3">
                {redeemOptions.map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => handleRedeem(opt)}
                    className="p-3.5 bg-slate-950/40 border border-slate-850 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-slate-950 hover:border-slate-750 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-2 bg-slate-900 border border-slate-850 rounded-lg group-hover:scale-105 transition-transform">
                        {opt.icon}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                          {opt.title}
                        </h4>
                        <p className="text-[10px] text-slate-450 mt-0.5">{opt.desc}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-extrabold text-slate-300 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                      {opt.credits} pts
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
