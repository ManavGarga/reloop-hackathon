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
    <path d="M50 12 C30 12 18 26 18 45 C18 68 50 88 50 88 C50 88 82 68 82 45 C82 26 70 12 50 12 Z" fill="#FF9900" />
    <circle cx="50" cy="40" r="12" fill="white" />
    <circle cx="50" cy="40" r="6" fill="#FF9900" />
  </svg>
);

const IconBusiness = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 flex-shrink-0">
    <rect x="10" y="22" width="80" height="56" rx="6" fill="#252F3D" />
    <rect x="10" y="22" width="80" height="18" rx="2" fill="#131921" />
    <text x="50" y="35" fill="white" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">amazon</text>
    <text x="50" y="58" fill="#FF9900" fontSize="12" fontWeight="black" textAnchor="middle" fontFamily="sans-serif">business</text>
    <path d="M35 70 L45 78 L65 64" fill="none" stroke="#FF9900" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
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
    <rect x="10" y="22" width="80" height="56" rx="6" fill="#FF9900" />
    <circle cx="70" cy="50" r="14" fill="#D35400" opacity="0.3" />
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
    className="flex gap-4 bg-white border border-[#DDD] rounded cursor-pointer group transition-all duration-150 hover:border-[#C45500] hover:shadow-md p-5"
  >
    <div className={`w-14 h-14 flex-shrink-0 rounded flex items-center justify-center ${iconBg}`}>
      {icon}
    </div>
    <div className="space-y-1 min-w-0">
      {badge && (
        <span className="inline-block bg-[#0e2255] text-[#00A8E1] text-[9px] font-black tracking-wider px-1.5 py-0.5 rounded-sm uppercase">
          {badge}
        </span>
      )}
      <h4 className="text-[14px] font-bold text-[#0F1111] group-hover:text-[#C45500] group-hover:underline leading-snug">
        {title}
      </h4>
      <p className="text-[11px] text-[#565959] leading-relaxed">{desc}</p>
    </div>
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
            className="border border-[#aaa] text-xs rounded px-3 py-1.5 focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_0_3px_rgba(231,118,0,0.15)] font-semibold text-[#111] min-w-[200px]"
          />
          <button id={`save-${fieldKey}-btn`} onClick={onSave} className="px-4 py-1.5 bg-[#ffd814] border border-[#fcd200] hover:bg-[#f7ca00] text-black font-semibold text-xs rounded transition-all">Save</button>
          <button onClick={onCancel} className="px-4 py-1.5 bg-[#f0f2f2] border border-[#d5d9d9] hover:bg-[#e7e9ec] text-black font-semibold text-xs rounded transition-all">Cancel</button>
        </div>
      ) : (
        <>
          <p className="text-sm text-[#333] mt-1">{value}</p>
          {hint && <p className="text-[11px] mt-0.5" style={{ color: hintColor }}>{hint}</p>}
        </>
      )}
    </div>
    {!isEditing && (
      <button id={`edit-${fieldKey}-trigger`} onClick={onStart} className="px-4 py-1.5 bg-white hover:bg-[#f7f9fa] border border-[#D5D9D9] text-xs font-semibold rounded shadow-sm text-[#0F1111] transition-all whitespace-nowrap">
        Edit
      </button>
    )}
  </div>
);


// Subpage shell - defined outside Profile to avoid re-mount on state changes
const SubpageShell = ({ title, breadcrumb, children, onBack, toastMessage }) => (
  <div className="bg-[#EAEDED] min-h-screen px-6 py-8 font-sans">
    <div className="max-w-3xl mx-auto bg-white border border-[#DDD] rounded shadow-sm">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 text-[11px] text-[#565959] px-6 pt-5 pb-0">
        <span className="hover:text-[#C45500] cursor-pointer hover:underline" onClick={onBack}>Your Account</span>
        <ChevronRight size={10} />
        <span className="text-[#C45500]">{breadcrumb}</span>
      </div>
      {/* Header */}
      <div className="flex items-center gap-3 px-6 pt-4 pb-5 border-b border-[#EEE]">
        <button id="back-to-menu-btn" onClick={onBack} className="p-1.5 bg-white border border-[#D5D9D9] rounded text-[#555] hover:bg-[#f7f9fa] transition-colors">
          <ChevronLeft size={14} />
        </button>
        <h1 className="text-xl font-normal text-[#0F1111]">{title}</h1>
      </div>
      <div className="p-6 space-y-6">{children}</div>
    </div>
    {toastMessage && (
      <div className="fixed bottom-5 right-5 bg-white border border-[#DDD] text-[#111] px-4 py-3 rounded shadow-xl flex items-center gap-2 z-50">
        <Sparkles size={15} className="text-amber-500 flex-shrink-0" />
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
          <EditRow label="E-mail" value={user.email} hint="⚠️ Add email verification to increase account protection." hintColor="#C7511F" fieldKey="email" isEditing={isEditingEmail} editValue={editEmail} onStart={() => startEdit("email")} onChange={setEditEmail} onSave={() => saveEdit("email")} onCancel={() => cancelEdit("email")} inputType="email" />
          <EditRow label="Primary delivery city" value={user.city || "Bengaluru"} hint="Used for local NGO donations and peer-to-peer recommendation sorting." fieldKey="city" isEditing={isEditingCity} editValue={editCity} onStart={() => startEdit("city")} onChange={setEditCity} onSave={() => saveEdit("city")} onCancel={() => cancelEdit("city")} />
          <div className="flex justify-between items-center py-5 px-6">
            <div>
              <span className="text-xs font-bold text-[#0F1111] block">Passkey</span>
              <p className="text-[11px] text-[#565959] mt-1">Sign in with face, fingerprint, or PIN.</p>
            </div>
            <button className="px-4 py-1.5 bg-white hover:bg-[#f7f9fa] border border-[#D5D9D9] text-xs font-semibold rounded shadow-sm text-[#0F1111] transition-all">Set up</button>
          </div>
          <div className="flex justify-between items-center py-5 px-6">
            <div>
              <span className="text-xs font-bold text-[#0F1111] block">Password</span>
              <p className="text-sm text-[#333] mt-1 tracking-widest">••••••••</p>
            </div>
            <button className="px-4 py-1.5 bg-white hover:bg-[#f7f9fa] border border-[#D5D9D9] text-xs font-semibold rounded shadow-sm text-[#0F1111] transition-all">Edit</button>
          </div>
        </div>
      </SubpageShell>
    );
  }

  // ── Prime ───────────────────────────────────────────────────────────────────
  if (profileView === "prime") {
    return (
      <SubpageShell title="Your Prime Membership" breadcrumb="Prime Membership" onBack={goBackToMenu} toastMessage={toastMessage}>
        {/* Prime Card */}
        <div className="bg-[#0f1e3d] text-white rounded-lg p-6 max-w-sm mx-auto">
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-[9px] bg-[#00A8E1]/20 text-[#00A8E1] border border-[#00A8E1]/30 px-2 py-0.5 rounded font-extrabold uppercase tracking-wider">
                CIRCULAR PRIME PASS
              </span>
              <h2 className="text-base font-black tracking-tight mt-2">
                amazon<span className="text-[#4ade80]">reloop</span> prime
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
              <p className="text-xs text-[#4ade80] font-black mt-0.5">ACTIVE MEMBER ✓</p>
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
              <h3 className="text-2xl font-black mt-1">₹{payWalletBalance.toFixed(2)}</h3>
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
              <p id="profile-green-credits-bal" data-loaded={isLoaded} className="text-xl font-black text-emerald-600">{balance} pts</p>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] text-[#565959] font-bold uppercase tracking-wider block">Amount to Convert</label>
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
                className="border border-[#aaa] text-xs rounded px-3 py-2 w-full focus:outline-none focus:border-[#e77600] focus:shadow-[0_0_0_3px_rgba(231,118,0,0.15)] font-semibold text-[#111]"
              />
              <button id="convert-max-btn" onClick={() => setConvertAmount(balance.toString())} className="px-4 bg-[#f0f2f2] border border-[#D5D9D9] hover:bg-[#e7e9ec] text-black font-semibold text-xs rounded transition-all whitespace-nowrap">Max</button>
            </div>
            {convertError && <p className="text-xs text-[#C7511F] font-semibold bg-orange-50 border border-orange-200 p-2.5 rounded">{convertError}</p>}
            {convertAmount && !isNaN(convertAmount) && parseFloat(convertAmount) > 0 && (
              <div className="bg-emerald-50 border border-emerald-100 p-3 rounded text-center text-xs text-emerald-700 font-semibold">
                🎉 You will receive ₹{parseFloat(convertAmount).toFixed(2)} Amazon Pay Balance
              </div>
            )}
            <button
              id="execute-convert-btn"
              onClick={handleConvert}
              disabled={isConverting || !convertAmount || isNaN(convertAmount) || parseFloat(convertAmount) <= 0}
              className="w-full py-2.5 bg-[#FFD814] hover:bg-[#F7CA00] disabled:bg-[#F3F3F3] disabled:text-[#AAA] disabled:border-[#EEE] border border-[#A88734] text-black font-semibold rounded text-xs transition-all"
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
          <div onClick={() => navigate('/recommendations')} className="p-6 bg-white border border-[#DDD] rounded text-center cursor-pointer hover:border-[#C45500] hover:shadow-md transition-all group">
            <span className="text-3xl block mb-3">💬</span>
            <h3 className="text-sm font-bold text-[#0F1111] group-hover:text-[#C45500]">Chat with ReLoop AI</h3>
            <p className="text-[11px] text-[#565959] mt-2 leading-relaxed">Talk instantly to our sustainability advisor chatbot to ask about credits, returns, or checkups.</p>
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
    <div className="bg-[#EAEDED] min-h-screen px-6 py-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDD]">
          <h1 className="text-[26px] font-normal text-[#0F1111]">Your Account</h1>
          <div className="flex items-stretch bg-white border border-[#DDD] rounded overflow-hidden divide-x divide-[#EEE]">
            <div className="px-4 py-2 flex flex-col justify-center">
              <span className="text-[9px] text-[#565959] font-bold uppercase tracking-wider">Credits Balance</span>
              <span id="profile-green-credits-bal" data-loaded={isLoaded} className="text-sm font-bold text-[#007600] mt-0.5">{balance} pts</span>
            </div>
            <div className="px-4 py-2 flex flex-col justify-center">
              <span className="text-[9px] text-[#565959] font-bold uppercase tracking-wider">CO₂ Saved</span>
              <span className="text-sm font-bold text-[#C7511F] mt-0.5">{co2Saved} kg</span>
            </div>
            <div className="px-4 py-2 flex flex-col justify-center">
              <span className="text-[9px] text-[#565959] font-bold uppercase tracking-wider">Amazon Pay</span>
              <span className="text-sm font-bold text-[#007185] mt-0.5">₹{payWalletBalance.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <AccountCard icon={<IconOrders />} iconBg="bg-[#FEF0E0]" title="Your Orders" desc="Track, return, or buy circular items again." onClick={() => navigate('/returns')} />
          <AccountCard id="login-security-card" icon={<IconSecurity />} iconBg="bg-[#F0F2F2]" title="Login & Security" desc="Edit login, name, city, and mobile settings." onClick={() => setProfileView("login-security")} />
          <AccountCard id="prime-card" icon={<IconPrime />} iconBg="bg-[#E6F4FF]" title="Prime" desc="View circular prime benefits and membership." badge="CIRCULAR PRIME" onClick={() => setProfileView("prime")} />
          <AccountCard icon={<IconAddresses />} iconBg="bg-[#FFF3E0]" title="Your Addresses" desc="Edit shipping locations for doorstep returns." onClick={() => setProfileView("login-security")} />
          <AccountCard icon={<IconBusiness />} iconBg="bg-[#F0F2F2]" title="Your Business Account" desc="Save up to 18% with GST invoice and bulk discounts." onClick={() => setToastMessage("Amazon Business ReLoop benefits activated!")} />
          <AccountCard id="payment-options-card" icon={<IconPayment />} iconBg="bg-[#E6F2F8]" title="Payment Options" desc="Convert credits to Pay balance and view cards." onClick={() => setProfileView("payment")} />
          <AccountCard icon={<IconAmazonPay />} iconBg="bg-[#FFF3E0]" title="Amazon Pay Balance" desc="Add money or convert green credits to balance." onClick={() => setProfileView("payment")} />
          <AccountCard icon={<IconContact />} iconBg="bg-[#E6F4EF]" title="Contact Us" desc="Get 24/7 help from ReLoop support or AI chat." onClick={() => setProfileView("contact")} />
        </div>

        <hr className="border-[#DDD]" />

        {/* Footer links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 px-1">
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
            <div key={col.title} className="space-y-3">
              <h3 className="text-[13px] font-bold text-[#0F1111]">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link}>
                    <span className="text-[12px] text-[#007185] hover:text-[#C45500] hover:underline cursor-pointer block py-0.5">{link}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-white border border-[#DDD] text-[#111] px-4 py-3 rounded shadow-xl flex items-center gap-2 z-50">
          <Sparkles size={15} className="text-amber-500 flex-shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}