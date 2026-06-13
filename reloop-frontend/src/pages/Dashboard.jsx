import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ReferenceLine } from "recharts";
import { Leaf, Award, Recycle, Gift, Users, ChevronRight, ChevronDown, CheckCircle, Sparkles, X, Heart, CreditCard, TreePine } from "lucide-react";
import { getUserDashboard, getCredits } from "../api/reloop";

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

        // Setup credits data
        setCreditsData({
          balance: 240.0,
          transactions: [
            { amount: 120.0, transaction_type: "earned_return", notes: "Refurbished Samsung Galaxy M34 5G", timestamp: "2024-06-13T11:30:00" },
            { amount: -100.0, transaction_type: "spent_discount", notes: "₹100 discount on next order", timestamp: "2024-06-10T09:00:00" },
            { amount: 220.0, transaction_type: "earned_return", notes: "Donated Zara shirt to Clothes Forward NGO", timestamp: "2024-05-30T14:00:00" },
          ],
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard fetch error", err);
        setLoading(false);
      });

    return () => { active = false; };
  }, []);

  if (loading || !dashboardData) {
    return (
      <div style={{ background: '#eaeded', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span>Loading Eco Dashboard...</span>
      </div>
    );
  }

  // Trend data
  const co2TrendData = [
    { month: "Jan", co2: 5.2 },
    { month: "Feb", co2: 8.4 },
    { month: "Mar", co2: 12.1 },
    { month: "Apr", co2: 18.0 },
    { month: "May", co2: 24.3 },
    { month: "Jun", co2: 28.4 },
  ];

  const averageCo2 = 16.1;

  const handleConfirmRedeem = () => {
    // Deduct credits visually for prototype without window alerts
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

  return (
    <div style={{ background: '#eaeded', minHeight: '100vh', padding: '24px', color: '#111111', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Header Summary */}
        <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '500', color: '#111' }}>Welcome to your Eco Dashboard, {dashboardData.user.name}</h1>
            <p style={{ fontSize: '13px', color: '#565959', marginTop: '4px' }}>Track circular carbon offset savings and points statement ledgers</p>
          </div>
          <div style={{ background: '#f0f2f2', padding: '10px 16px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '13px', fontWeight: '700' }}>
            🏆 Rank: #{dashboardData.leaderboard_rank} in India
          </div>
        </div>

        {/* 3 Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '32px' }}>🌱</span>
            <div>
              <span style={{ fontSize: '12px', color: '#565959', fontWeight: 'bold' }}>GREEN CREDITS BALANCE</span>
              <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#B12704', marginTop: '2px' }}>{dashboardData.green_credits.balance}</h2>
              <span style={{ fontSize: '11px', color: '#007185' }}>Total earned: {dashboardData.green_credits.total_earned}</span>
            </div>
          </div>

          <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '32px' }}>🍃</span>
            <div>
              <span style={{ fontSize: '12px', color: '#565959', fontWeight: 'bold' }}>CO₂ SAVED OVERALL</span>
              <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#111', marginTop: '2px' }}>{dashboardData.impact.co2_saved_kg} kg</h2>
              <span style={{ fontSize: '11px', color: '#565959' }}>Offset equivalent: {dashboardData.impact.trees_equivalent} trees</span>
            </div>
          </div>

          <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '32px' }}>🔄</span>
            <div>
              <span style={{ fontSize: '12px', color: '#565959', fontWeight: 'bold' }}>ITEMS RECIRCULATED</span>
              <h2 style={{ fontSize: '28px', fontWeight: '800', color: '#111', marginTop: '2px' }}>{dashboardData.impact.items_refurbished + dashboardData.impact.items_donated}</h2>
              <span style={{ fontSize: '11px', color: '#565959' }}>{dashboardData.impact.items_refurbished} refurbished • {dashboardData.impact.items_donated} donated</span>
            </div>
          </div>
        </div>

        {/* Charts & Trends Panel */}
        <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>CO₂ Saved Trend</h3>
          <p style={{ fontSize: '12px', color: '#565959', marginBottom: '20px' }}>Monthly cumulative emissions offset tracking</p>
          <div style={{ height: '240px', width: '100%' }}>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={co2TrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
                <XAxis dataKey="month" stroke="#565959" fontSize={11} />
                <YAxis stroke="#565959" fontSize={11} unit="kg" />
                <ChartTooltip contentStyle={{ background: 'white', border: '1px solid #ddd' }} />
                <Line type="monotone" dataKey="co2" stroke="#ff9900" strokeWidth={3} dot={{ fill: '#ff9900', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Returns & Recycling Ledger Table */}
        <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>ReLoop Recycling Log</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f0f2f2', borderBottom: '1px solid #ddd', color: '#565959', fontWeight: '700' }}>
                  <th style={{ padding: '12px 16px' }}>Product</th>
                  <th style={{ padding: '12px 16px' }}>Grade</th>
                  <th style={{ padding: '12px 16px' }}>Disposition</th>
                  <th style={{ padding: '12px 16px' }}>CO₂ Saved</th>
                  <th style={{ padding: '12px 16px' }}>Credits</th>
                  <th style={{ padding: '12px 16px' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recent_returns.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>{item.product_name}</td>
                    <td style={{ padding: '12px 16px' }}>{item.grade}</td>
                    <td style={{ padding: '12px 16px', color: '#007185' }}>{item.route}</td>
                    <td style={{ padding: '12px 16px', color: '#137333', fontWeight: 'bold' }}>+{item.co2_saved} kg</td>
                    <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>+{item.credits_earned} pts</td>
                    <td style={{ padding: '12px 16px', color: '#565959' }}>{item.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
