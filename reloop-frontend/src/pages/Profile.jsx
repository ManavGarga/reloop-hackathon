import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { getCredits, convertCredits } from '../api/reloop';

const IconOrders = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 flex-shrink-0">
    <rect x="15" y="35" width="70" height="45" rx="3" fill="#D3A26A" />
    <path d="M15 35 L35 15 L65 15 L85 35 Z" fill="#E5B884" />
    <path d="M35 15 L35 35 M65 15 L65 35" stroke="#B88A53" strokeWidth="2" />
    <rect x="44" y="15" width="12" height="65" fill="#C5965E" opacity="0.6" />
    <line x1="50" y1="15" x2="50" y2="80" stroke="#9E7340" strokeWidth="1" />
  </svg>
);

const IconSecurity = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 flex-shrink-0">
    <circle cx="50" cy="50" r="42" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="2" />
    <rect x="30" y="42" width="40" height="32" rx="4" fill="#BDC3C7" stroke="#95A5A6" strokeWidth="2" />
    <path d="M38 42 V30 A12 12 0 0 1 62 30 V42" stroke="#BDC3C7" strokeWidth="8" fill="none" />
    <path d="M38 42 V30 A12 12 0 0 1 62 30 V42" stroke="#7F8C8D" strokeWidth="4" fill="none" />
    <circle cx="50" cy="54" r="4" fill="#2C3E50" />
    <polygon points="48,56 52,56 53,66 47,66" fill="#2C3E50" />
  </svg>
);

const IconPrime = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 flex-shrink-0">
    <rect x="15" y="32" width="70" height="48" rx="4" fill="#00A8E1" />
    <polygon points="15,32 32,15 68,15 85,32" fill="#00BAF2" />
    <text x="50" y="58" fill="white" fontSize="16" fontWeight="900" textAnchor="middle" fontFamily="Arial Black, Arial, sans-serif" letterSpacing="-0.5px">prime</text>
    <path d="M 50 15 L 50 80 M 15 32 L 85 32" stroke="#0090C2" strokeWidth="2" />
  </svg>
);

const IconAddresses = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 flex-shrink-0">
    <path d="M50 12 C30 12 18 26 18 45 C18 68 50 88 50 88 C50 88 82 68 82 45 C82 26 70 12 50 12 Z" fill="#16A34A" />
    <circle cx="50" cy="40" r="12" fill="white" />
    <circle cx="50" cy="40" r="6" fill="#16A34A" />
  </svg>
);

const IconBusiness = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 flex-shrink-0">
    <rect x="10" y="22" width="80" height="56" rx="6" fill="#252F3D" />
    <rect x="10" y="22" width="80" height="18" rx="2" fill="#131921" />
    <text x="50" y="35" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">amazon</text>
    <text x="50" y="58" fill="#D97706" fontSize="12" fontWeight="black" textAnchor="middle" fontFamily="sans-serif">business</text>
    <path d="M35 70 L45 78 L65 64" fill="none" stroke="#D97706" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconPayment = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 flex-shrink-0">
    <rect x="12" y="24" width="76" height="52" rx="6" fill="#007185" />
    <rect x="12" y="34" width="76" height="12" fill="#111" />
    <rect x="22" y="54" width="12" height="10" rx="1" fill="#F1C40F" />
    <line x1="42" y1="58" x2="66" y2="58" stroke="white" strokeWidth="2" opacity="0.6" />
    <line x1="42" y1="64" x2="58" y2="64" stroke="white" strokeWidth="2" opacity="0.6" />
  </svg>
);

const IconAmazonPay = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 flex-shrink-0">
    <rect x="10" y="22" width="80" height="56" rx="6" fill="#D97706" />
    <circle cx="70" cy="50" r="14" fill="#B45309" opacity="0.3" />
    <text x="32" y="60" fill="white" fontSize="38" fontWeight="bold" fontFamily="Arial, sans-serif">₹</text>
  </svg>
);

const IconContact = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 flex-shrink-0">
    <circle cx="50" cy="50" r="42" fill="#E0F2F1" />
    <path d="M 30 55 A 24 24 0 0 1 70 55" fill="none" stroke="#00796B" strokeWidth="6" strokeLinecap="round" />
    <rect x="24" y="48" width="8" height="16" rx="2" fill="#00796B" />
    <rect x="68" y="48" width="8" height="16" rx="2" fill="#00796B" />
    <path d="M 68 56 Q 68 70 54 70" fill="none" stroke="#00796B" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// Reusable card component
const AccountCard = ({ icon, iconBg, title, desc, badge, onClick, id }) => (
  <div
    id={id}
    onClick={onClick}
    className="bg-white border border-[#E7E7E7] rounded-lg h-[64px] px-4 flex items-center justify-between gap-3 hover:shadow-sm hover:border-[#FF9900]/30 transition-all cursor-pointer group"
  >
    <div className="flex items-center gap-3 min-w-0 flex-1">
      <div className="w-[20px] h-[20px] flex-shrink-0 flex items-center justify-center [&_svg]:w-5 [&_svg]:h-5 [&_svg]:flex-shrink-0">
        {icon}
      </div>
      <div className="flex flex-col min-w-0 text-left">
        <div className="flex items-center gap-1.5">
          <h4 className="text-[15px] font-bold text-[#111111] group-hover:text-[#FF9900] leading-none transition-colors">
            {title}
          </h4>
          {badge && (
            <span className="bg-[#FF9900] text-[#111111] text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] whitespace-nowrap">
              {badge}
            </span>
          )}
        </div>
        <p className="text-[13px] text-[#565959] truncate mt-0.5">{desc}</p>
      </div>
    </div>
    <ChevronRight size={16} className="text-slate-400 group-hover:text-[#FF9900] transition-colors flex-shrink-0" />
  </div>
);

// Reusable edit row component
const EditRow = ({ label, value, hint, hintColor = "#565959", fieldKey, isEditing, editValue, onStart, onChange, onSave, onCancel, inputType = "text" }) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-5 px-6 gap-4">
    <div className="flex-1">
      <span className="text-xs font-bold text-[#0F1111] block">{label}</span>
      {isEditing ? (
        <div className="flex flex-wrap gap-2 mt-2">
          <input
            id={`edit-${fieldKey}-input`}
            type={inputType}
            value={editValue}
            onChange={e => onChange(e.target.value)}
            className="border border-slate-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF9900]/20 font-semibold text-[#111] min-w-[200px] transition-all"
          />
          <button id={`save-${fieldKey}-btn`} onClick={onSave} className="btn-primary text-xs h-9 px-4 py-1.5">Save</button>
          <button onClick={onCancel} className="btn-secondary text-xs h-9 px-4 py-1.5">Cancel</button>
        </div>
      ) : (
        <>
          <p className="text-sm text-[#333] mt-1">{value}</p>
          {hint && <p className="text-[11px] mt-0.5" style={{ color: hintColor }}>{hint}</p>}
        </>
      )}
    </div>
    {!isEditing && (
      <button id={`edit-${fieldKey}-trigger`} onClick={onStart} className="btn-secondary text-xs h-9 px-4 py-1.5">
        Edit
      </button>
    )}
  </div>
);


// Subpage shell - defined outside Profile to avoid re-mount on state changes
const SubpageShell = ({ title, breadcrumb, children, onBack, toastMessage }) => (
  <div className="bg-[#F7F8FA] min-h-screen px-6 py-8" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
    <div className="w-full bg-white border border-[#E7E7E7] rounded-xl shadow-sm">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-[11px] text-[#565959] px-6 pt-5 pb-0">
        <span className="hover:text-[#C7511F] cursor-pointer hover:underline" onClick={onBack}>Your Account</span>
        <ChevronRight size={10} />
        <span className="text-[#007185] font-medium">{breadcrumb}</span>
      </div>
      {/* Header */}
      <div className="flex items-center gap-3 px-6 pt-4 pb-5 border-b border-slate-100">
        <button id="back-to-menu-btn" onClick={onBack} className="p-1.5 bg-white border border-slate-200 rounded-lg text-[#555] hover:bg-slate-50 transition-colors cursor-pointer">
          <ChevronLeft size={14} />
        </button>
        <h1 className="text-xl font-normal text-[#0F1111]">{title}</h1>
      </div>
      <div className="p-6 space-y-6">{children}</div>
    </div>
    {toastMessage && (
      <div className="fixed bottom-5 right-5 bg-white border border-[#E7E7E7] text-[#111] px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 z-50 animate-fade-in">
        <Sparkles size={15} className="text-[#FF9900] flex-shrink-0 animate-pulse" />
        <span className="text-xs font-semibold">{toastMessage}</span>
      </div>
    )}
  </div>
);

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();
  const [profileView, setProfileView] = useState("menu");

  const [balance, setBalance] = useState(240);
  const [co2Saved] = useState(28.4);
  const [payWalletBalance, setPayWalletBalance] = useState(240.0);
  const [toastMessage, setToastMessage] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingCity, setIsEditingCity] = useState(false);

  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editCity, setEditCity] = useState("");

  const [convertAmount, setConvertAmount] = useState("");
  const [convertError, setConvertError] = useState("");
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    let active = true;
    getCredits("user_priya_001").then(res => {
      if (!active) return;
      if (res && res.status === "ok") {
        setBalance(res.balance);
        const savedWallet = localStorage.getItem("amazon_pay_balance");
        setPayWalletBalance(savedWallet ? parseFloat(savedWallet) : res.balance);
        setIsLoaded(true);
      }
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(""), 3000);
    return () => clearTimeout(t);
  }, [toastMessage]);

  const goBackToMenu = () => setProfileView("menu");

  const startEdit = (field) => {
    const map = { name: [setEditName, user.name, setIsEditingName], phone: [setEditPhone, user.phone, setIsEditingPhone], email: [setEditEmail, user.email, setIsEditingEmail], city: [setEditCity, user.city || "Bengaluru", setIsEditingCity] };
    const [setter, val, toggle] = map[field];
    setter(val);
    toggle(true);
  };

  const saveEdit = (field) => {
    const map = { name: [editName, setIsEditingName], phone: [editPhone, setIsEditingPhone], email: [editEmail, setIsEditingEmail], city: [editCity, setIsEditingCity] };
    const [val, toggle] = map[field];
    updateUser({ [field]: val });
    toggle(false);
    setToastMessage(`Saved details for ${field} successfully!`);
  };

  const cancelEdit = (field) => {
    const map = { name: setIsEditingName, phone: setIsEditingPhone, email: setIsEditingEmail, city: setIsEditingCity };
    map[field](false);
  };

  const handleConvert = async () => {
    const amt = parseFloat(convertAmount);
    if (isNaN(amt) || amt <= 0) { setConvertError("Please enter a valid positive number."); return; }
    if (amt > balance) { setConvertError(`Insufficient credits. You only have ${balance} credits.`); return; }
    setIsConverting(true);
    setConvertError("");
    try {
      const res = await convertCredits("user_priya_001", amt);
      if (res && res.status === "ok") {
        setBalance(res.new_balance);
        const newWallet = payWalletBalance + amt;
        setPayWalletBalance(newWallet);
        localStorage.setItem("amazon_pay_balance", newWallet.toString());
        setConvertAmount("");
        setToastMessage(`Converted ${amt} credits to Amazon Pay wallet balance successfully!`);
      } else {
        setConvertError(res?.detail || "Failed to convert. Server error.");
      }
    } catch {
      setConvertError("Error connecting to conversion server.");
    } finally {
      setIsConverting(false);
    }
  };

  // ── Login & Security ────────────────────────────────────────────────────────
  if (profileView === "login-security") {
    return (
      <SubpageShell title="Login & Security" breadcrumb="Login & Security" onBack={goBackToMenu} toastMessage={toastMessage}>
        <div className="border border-[#DDD] rounded divide-y divide-[#EEE]">
          <EditRow label="Name" value={user.name} fieldKey="name" isEditing={isEditingName} editValue={editName} onStart={() => startEdit("name")} onChange={setEditName} onSave={() => saveEdit("name")} onCancel={() => cancelEdit("name")} />
          <EditRow label="Primary mobile number" value={user.phone} hint="Quickly sign in, recover password, and receive notifications." fieldKey="phone" isEditing={isEditingPhone} editValue={editPhone} onStart={() => startEdit("phone")} onChange={setEditPhone} onSave={() => saveEdit("phone")} onCancel={() => cancelEdit("phone")} inputType="tel" />
          <EditRow label="E-mail" value={user.email} hint="⚠️ Add email verification to increase account protection." hintColor="#D13212" fieldKey="email" isEditing={isEditingEmail} editValue={editEmail} onStart={() => startEdit("email")} onChange={setEditEmail} onSave={() => saveEdit("email")} onCancel={() => cancelEdit("email")} inputType="email" />
          <EditRow label="Primary delivery city" value={user.city || "Bengaluru"} hint="Used for local NGO donations and peer-to-peer recommendation sorting." fieldKey="city" isEditing={isEditingCity} editValue={editCity} onStart={() => startEdit("city")} onChange={setEditCity} onSave={() => saveEdit("city")} onCancel={() => cancelEdit("city")} />
          <div className="flex justify-between items-center py-5 px-6">
            <div>
              <span className="text-xs font-bold text-[#0F1111] block">Passkey</span>
              <p className="text-[11px] text-[#565959] mt-1">Sign in with face, fingerprint, or PIN.</p>
            </div>
            <button className="btn-secondary text-xs h-9 px-4 py-1.5">Set up</button>
          </div>
          <div className="flex justify-between items-center py-5 px-6">
            <div>
              <span className="text-xs font-bold text-[#0F1111] block">Password</span>
              <p className="text-sm text-[#333] mt-1 tracking-widest">••••••••</p>
            </div>
            <button className="btn-secondary text-xs h-9 px-4 py-1.5">Edit</button>
          </div>
        </div>
      </SubpageShell>
    );
  }

  // ── Prime ───────────────────────────────────────────────────────────────────
  if (profileView === "prime") {
    return (
      <SubpageShell title="Your Prime Membership" breadcrumb="Prime Membership" onBack={goBackToMenu} toastMessage={toastMessage} maxWidth="max-w-6xl">
        {/* Prime Card with shimmer */}
        <div className="relative bg-gradient-to-br from-[#0f1e3d] to-[#1e3563] text-white rounded-2xl p-6 max-w-sm mx-auto shadow-lg border border-slate-700/30 overflow-hidden">
          {/* Shimmer overlay */}
          <div className="prime-shimmer absolute inset-0 pointer-events-none z-0" />
          <div className="relative z-10 flex justify-between items-start mb-4">
            <div>
              <span className="text-[9px] bg-[#FF9900] text-[#111111] rounded-[4px] px-2 py-0.5 font-bold uppercase tracking-wider">
                CIRCULAR PRIME PASS
              </span>
              <h2 className="text-base font-black tracking-tight mt-2">
                amazon<span className="text-[#FF9900]">reloop</span> prime
              </h2>
            </div>
            <span className="text-2xl">👑</span>
          </div>
          <div className="mb-4">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Member ID</p>
            <p className="text-xs font-mono font-bold text-slate-200 tracking-widest mt-0.5">RP-9821-PYA-001</p>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-slate-700/50">
            <div>
              <p className="text-[9px] text-slate-400 uppercase font-bold">Status</p>
              <p className="text-xs text-[#067D62] font-black mt-0.5">ACTIVE MEMBER ✓</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-slate-400 uppercase font-bold">Valid Until</p>
              <p className="text-xs text-slate-200 font-semibold mt-0.5">04/2027</p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div>
          <h3 className="text-sm font-bold text-[#0F1111] mb-3">Circular Prime Benefits</h3>
          <div className="border border-[#DDD] rounded divide-y divide-[#EEE]">
            {[
              { title: "Free AI-Doorstep Pickups", desc: "A ReLoop courier collects returns at your doorstep, grades on the spot, and credits you immediately." },
              { title: "1.5× Credits Multiplier", desc: "Earn 50% more Green Credits for every P2P exchange or verified NGO donation." },
              { title: "Refurbished Priority Access", desc: "24-hour early booking on high-demand Certified Renewed product listings." },
            ].map((b, i) => (
              <div key={i} className="flex gap-4 px-5 py-4">
                <span className="text-lg flex-shrink-0 mt-0.5">👑</span>
                <div>
                  <h4 className="text-xs font-bold text-[#0F1111]">{b.title}</h4>
                  <p className="text-[11px] text-[#565959] mt-1 leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SubpageShell>
    );
  }

  // ── Payment ─────────────────────────────────────────────────────────────────
  if (profileView === "payment") {
    return (
      <SubpageShell title="Your Wallet & Cards" breadcrumb="Payment Options" onBack={goBackToMenu} toastMessage={toastMessage}>
        {/* Wallet cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#1e3a8a] text-white p-5 rounded-lg flex flex-col justify-between h-32">
            <div>
              <span className="text-[9px] text-indigo-200 font-bold uppercase tracking-wider block">Amazon Pay Wallet</span>
              <h3 className="text-2xl font-black mt-1">₹{Math.round(payWalletBalance).toLocaleString('en-IN')}</h3>
            </div>
            <div className="flex justify-between items-center text-[10px] text-indigo-100">
              <span>Verified Wallet</span>
              <span className="bg-white/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Active</span>
            </div>
          </div>
          <div className="bg-[#064e3b] text-white p-5 rounded-lg flex flex-col justify-between h-32">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] text-emerald-200 font-bold uppercase tracking-wider block">ReLoop Co-Branded Card</span>
                <h3 className="text-sm font-bold mt-2 font-mono">•••• •••• •••• 8921</h3>
              </div>
              <span className="text-lg">🌱</span>
            </div>
            <div className="flex justify-between items-center text-[10px] text-emerald-100">
              <span>{user.name}</span>
              <span>Exp: 08/29</span>
            </div>
          </div>
        </div>

        {/* Conversion panel */}
        <div className="border border-[#DDD] rounded p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#0F1111]">🪙 Convert Green Credits to Pay Balance</h3>
          <div className="bg-[#F7F9FA] border border-[#EEE] rounded p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div>
              <p className="text-[11px] text-[#565959]">Conversion rate</p>
              <p className="text-xs font-bold text-[#0F1111] mt-0.5">1 Green Credit = ₹1.00 Amazon Pay Wallet</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-[#565959] uppercase font-bold">Convertible Credits</p>
              <p id="profile-green-credits-bal" data-loaded={isLoaded} className="text-xl font-black text-[#067D62]">{balance} pts</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Amount to Convert</label>
              <div className="flex gap-2">
                <input
                  id="convert-credits-input"
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 100"
                  value={convertAmount}
                  onChange={e => {
                    const v = e.target.value;
                    if (v === "" || /^[0-9]+$/.test(v)) { setConvertAmount(v); setConvertError(""); }
                  }}
                  className="border border-slate-300 text-xs rounded-lg px-3.5 py-2.5 w-full focus:outline-none focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF9900]/20 font-semibold text-slate-800 transition-all"
                />
                <button id="convert-max-btn" onClick={() => setConvertAmount(balance.toString())} className="btn-secondary text-xs h-9 px-4 py-1.5">Max</button>
              </div>
            </div>
            {convertError && <p className="text-xs text-red-700 bg-red-50 border border-red-200 p-3 rounded-lg font-medium">{convertError}</p>}
            {convertAmount && !isNaN(convertAmount) && parseFloat(convertAmount) > 0 && (
              <div style={{ background: '#FFF8F0', border: '1.5px solid #FF9900', color: '#111111' }} className="p-3 rounded-lg text-center text-xs font-semibold">
                🎉 You will receive ₹{Math.round(parseFloat(convertAmount)).toLocaleString('en-IN')} Amazon Pay Balance
              </div>
            )}
            <button
              id="execute-convert-btn"
              onClick={handleConvert}
              disabled={isConverting || !convertAmount || isNaN(convertAmount) || parseFloat(convertAmount) <= 0}
              className="btn-primary w-full py-3 text-sm font-bold"
            >
              {isConverting ? "Converting..." : "Convert to Wallet Balance"}
            </button>
          </div>
        </div>
      </SubpageShell>
    );
  }

  // ── Contact ─────────────────────────────────────────────────────────────────
  if (profileView === "contact") {
    return (
      <SubpageShell title="Contact Customer Support" breadcrumb="Contact Us" onBack={goBackToMenu} toastMessage={toastMessage}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div onClick={() => navigate('/recommendations')} className="p-6 bg-white border border-slate-200 rounded-xl text-center cursor-pointer hover:border-[#FF9900] hover:shadow-md transition-all group">
            <span className="text-3xl block mb-3">💬</span>
            <h3 className="text-sm font-bold text-slate-800 group-hover:text-[#FF9900] transition-colors">Chat with ReLoop AI</h3>
            <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">Talk instantly to our sustainability advisor chatbot to ask about credits, returns, or checkups.</p>
          </div>
          <div className="p-6 bg-white border border-[#DDD] rounded text-center">
            <span className="text-3xl block mb-3">🎧</span>
            <h3 className="text-sm font-bold text-[#0F1111]">Standard Call Support</h3>
            <p className="text-[11px] text-[#565959] mt-2 leading-relaxed">Call our 24/7 support line at <strong className="text-[#0F1111]">1800-103-8921</strong> for questions regarding refunds or pick-up issues.</p>
          </div>
        </div>
      </SubpageShell>
    );
  }

  // ── Main Menu ───────────────────────────────────────────────────────────────
  return (
    <div className="bg-[#F7F8FA] min-h-screen px-6 py-8" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
      <div className="w-full space-y-6">

        {/* Page header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E7E7E7]">
          <h1 className="text-2xl font-black text-slate-800">Your Account</h1>
          <span className="text-xs text-slate-400 font-medium">{user?.name || 'Priya Sharma'}</span>
        </div>

        {/* Hero Stat Rings (Separate cards in a grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              id: 'profile-green-credits-bal',
              label: 'Green Credits',
              value: balance,
              unit: 'pts',
              max: 2000,
              color: '#FF9900',
              track: '#F5F5F5',
              icon: '🌿',
              loaded: isLoaded
            },
            {
              label: 'CO₂ Saved',
              value: co2Saved,
              unit: 'kg',
              max: 100,
              color: '#FF9900',
              track: '#F5F5F5',
              icon: '🌍'
            },
            {
              label: 'Amazon Pay',
              value: payWalletBalance.toFixed(0),
              unit: '₹',
              max: 2000,
              color: '#D97706',
              track: '#FEF3C7',
              icon: '💰'
            }
          ].map((stat, i) => {
            const size = 80, sw = 8, r = (size - sw) / 2
            const circ = 2 * Math.PI * r
            const pct = Math.min(100, (parseFloat(stat.value) / stat.max) * 100)
            const offset = circ * (1 - pct / 100)
            return (
              <div key={i} className="bg-white border border-[#E7E7E7] rounded-xl p-5 shadow-sm flex items-center justify-between gap-4">
                <div className="text-left">
                  <p className="text-xs text-[#565959] font-bold uppercase tracking-wider">{stat.label}</p>
                  <p
                    id={stat.id}
                    data-loaded={stat.loaded}
                    className="text-2xl font-black mt-2 text-[#111111]"
                  >
                    {stat.unit === '₹' ? '₹' : ''}{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}{stat.unit !== '₹' ? ` ${stat.unit}` : ''}
                  </p>
                </div>
                <div className="relative" style={{ width: size, height: size }}>
                  <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={stat.track} strokeWidth={sw} />
                    <circle
                      cx={size/2} cy={size/2} r={r}
                      fill="none" stroke={stat.color} strokeWidth={sw}
                      strokeLinecap="round"
                      strokeDasharray={circ}
                      strokeDashoffset={offset}
                      style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.34,1.56,0.64,1)' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl">{stat.icon}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {!isLoaded ? (
            [1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-white border border-[#E7E7E7] rounded-xl p-5 flex gap-4 h-24 items-center animate-pulse shadow-xs">
                <div className="w-14 h-14 bg-slate-100 rounded-lg flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-100 rounded w-2/3" />
                  <div className="h-3 bg-slate-100 rounded w-5/6" />
                </div>
              </div>
            ))
          ) : (
            <>
              <AccountCard icon={<IconOrders />} iconBg="bg-[#F7F8FA]" title="Your Orders" desc="Track, return, or buy circular items again." onClick={() => navigate('/returns')} />
              <AccountCard id="login-security-card" icon={<IconSecurity />} iconBg="bg-[#F3F4F6]" title="Login & Security" desc="Edit login, name, city, and mobile settings." onClick={() => setProfileView("login-security")} />
              <AccountCard id="prime-card" icon={<IconPrime />} iconBg="bg-[#E0F2FE]" title="Prime" desc="View circular prime benefits and membership." badge="CIRCULAR PRIME" onClick={() => setProfileView("prime")} />
              <AccountCard icon={<IconAddresses />} iconBg="bg-[#F7F8FA]" title="Your Addresses" desc="Edit shipping locations for doorstep returns." onClick={() => setProfileView("login-security")} />
              <AccountCard icon={<IconBusiness />} iconBg="bg-[#F3F4F6]" title="Your Business Account" desc="Save up to 18% with GST invoice and bulk discounts." onClick={() => setToastMessage("Amazon Business ReLoop benefits activated!")} />
              <AccountCard id="payment-options-card" icon={<IconPayment />} iconBg="bg-[#F0FDFA]" title="Payment Options" desc="Convert credits to Pay balance and view cards." onClick={() => setProfileView("payment")} />
              <AccountCard icon={<IconAmazonPay />} iconBg="bg-[#FFFBEB]" title="Amazon Pay Balance" desc="Add money or convert green credits to balance." onClick={() => setProfileView("payment")} />
              <AccountCard icon={<IconContact />} iconBg="bg-[#ECFDF5]" title="Contact Us" desc="Get 24/7 help from ReLoop support or AI chat." onClick={() => setProfileView("contact")} />
            </>
          )}
        </div>

        <hr className="border-[#DDD]" />

        {/* Footer links */}
        <div className="bg-white border border-[#E7E7E7] rounded-xl p-6 md:p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Digital content and devices",
                links: ["Apps and more", "Content and devices", "Digital gifts you've received", "Digital and device forum"],
              },
              {
                title: "Email alerts, messages, and ads",
                links: ["Advertising preferences", "Communication preferences", "SMS alert preferences", "Message Centre", "Alexa shopping notifications"],
              },
              {
                title: "More ways to pay",
                links: ["Default Purchase Settings", "Amazon Pay", "Coupons"],
              },
            ].map((col) => (
              <div key={col.title} className="space-y-2">
                <h3 style={{ fontSize: '12px', textTransform: 'uppercase', fontWeight: 'bold', color: '#565959', padding: '16px 0 8px' }} className="border-b border-[#E7E7E7] mb-3">{col.title}</h3>
                <ul className="space-y-1">
                  {col.links.map(link => (
                    <li key={link}>
                      <span className="text-[13px] text-[#007185] hover:text-[#C7511F] hover:underline mb-1.5 block cursor-pointer transition-colors duration-150">
                        {link}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-white border border-[#E7E7E7] text-[#111] px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 z-50 animate-fade-in">
          <Sparkles size={15} className="text-[#FF9900] flex-shrink-0 animate-pulse" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}