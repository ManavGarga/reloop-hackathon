import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Brain, Lightbulb, Send, Leaf, ChevronRight, Recycle, ShieldCheck, Zap, TrendingUp, AlertTriangle } from 'lucide-react'
import { getPersonalisedFeed, sendChat } from '../api/reloop'
import { useUser } from '../context/UserContext'

// ── Eco Rank Config ────────────────────────────────────────────────
const ECO_RANKS = [
  { name: 'Seedling',      icon: '🌱', min: 0,    max: 200,  color: '#6B7280', bg: '#F9FAFB', ring: '#9CA3AF' },
  { name: 'Green',         icon: '🍃', min: 200,  max: 500,  color: '#16a34a', bg: '#F0FDF4', ring: '#4ade80' },
  { name: 'Eco Hero',      icon: '🏆', min: 500,  max: 1000, color: '#D97706', bg: '#FFFBEB', ring: '#F59E0B' },
  { name: 'Planet Saver',  icon: '🌍', min: 1000, max: 9999, color: '#14532D', bg: '#DCFCE7', ring: '#22c55e' },
]

function getRank(credits) {
  return ECO_RANKS.find(r => credits >= r.min && credits < r.max) || ECO_RANKS[ECO_RANKS.length - 1]
}

// ── Typewriter Hook ────────────────────────────────────────────────
function useTypewriter(text, speed = 18, enabled = true) {
  const [displayed, setDisplayed] = useState(enabled ? '' : text)
  const [done, setDone] = useState(!enabled)

  useEffect(() => {
    if (!enabled) { setDisplayed(text); setDone(true); return }
    setDisplayed('')
    setDone(false)
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.substring(0, i))
      if (i >= text.length) {
        clearInterval(interval)
        setDone(true)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed, enabled])

  return { displayed, done }
}

// ── Message Component ──────────────────────────────────────────────
function ChatMessage({ msg, isLast, onQuickReply }) {
  const isBot = msg.role === 'assistant'
  const { displayed, done } = useTypewriter(msg.content, 14, isBot && isLast)

  const quickReplies = isBot && isLast && done ? [
    'How do I earn credits?',
    'Best eco practices?',
    'Return my device',
  ] : []

  return (
    <div className={`flex gap-2.5 ${isBot ? 'items-start' : 'items-end flex-row-reverse animate-fade-in'}`}>
      {/* Bot avatar */}
      {isBot && (
        <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold text-white bg-[#232F3E] shadow-sm animate-glow">
          🤖
        </div>
      )}

      <div className="max-w-[82%] space-y-2 text-left">
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-xs ${
          isBot
            ? 'bg-white border border-[#E7E7E7] text-[#111111] shadow-sm rounded-tl-none rounded-xl'
            : 'bg-[#F0F2F2] border border-[#D5D9D9] text-[#111111] rounded-tr-none rounded-xl'
        }`}
        >
          {isBot ? displayed : msg.content}
          {isBot && isLast && !done && (
            <span className="ml-0.5 text-slate-400 animate-blink">|</span>
          )}
        </div>

        {/* Quick reply chips */}
        {quickReplies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 justify-start">
            {quickReplies.map((q, i) => (
              <button
                key={i}
                onClick={() => onQuickReply(q)}
                className="text-[13px] font-semibold text-[#111111] bg-white border border-[#E7E7E7] hover:bg-gray-50 px-4 py-2 rounded-full transition-all cursor-pointer shadow-sm active:scale-98"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Eco Rank Ring Widget ───────────────────────────────────────────
function EcoRankWidget({ credits = 1720 }) {
  const rank = getRank(credits)
  const nextRank = ECO_RANKS[ECO_RANKS.indexOf(rank) + 1]
  const progress = nextRank
    ? Math.min(100, ((credits - rank.min) / (nextRank.min - rank.min)) * 100)
    : 100

  const size = 96
  const strokeW = 8
  const r = (size - strokeW) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - progress / 100)

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E5E7EB" strokeWidth={strokeW} />
          <circle
            cx={size/2} cy={size/2} r={r}
            fill="none"
            stroke={rank.ring}
            strokeWidth={strokeW}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ 
              transition: 'stroke-dashoffset 1.5s cubic-bezier(0.34,1.56,0.64,1)',
              filter: `drop-shadow(0 0 4px ${rank.ring})`
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl">{rank.icon}</span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm font-black" style={{ color: rank.color }}>{rank.name}</p>
        <p className="text-[10px] text-slate-500 mt-0.5">{credits} credits</p>
      </div>

      {/* Rank levels row */}
      <div className="flex gap-1 flex-wrap justify-center">
        {ECO_RANKS.map((r, i) => {
          const active = rank.name === r.name
          return (
            <span key={i}
              className={`text-[9px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                active 
                  ? 'text-white border-transparent shadow-[0_0_8px_rgba(22,163,74,0.4)] animate-pulse' 
                  : 'text-slate-400 bg-white border-slate-200'
              }`}
              style={active ? { background: rank.color, borderColor: rank.color } : {}}
            >
              {r.icon} {r.name}
            </span>
          )
        })}
      </div>

      {nextRank && (
        <p className="text-[10px] text-slate-400 text-center leading-relaxed">
          {nextRank.min - credits} pts to reach <strong className="text-slate-650">{nextRank.name}</strong> {nextRank.icon}
        </p>
      )}
    </div>
  )
}

// ── Sustainability Tip Card (Collapsible Accordion) ───────────────
const IMPACT_CONFIGS = {
  HIGH: { color: '#EF4444', bg: '#FEF2F2', border: '#FEE2E2', icon: '🔥' },
  MEDIUM: { color: '#D97706', bg: '#FFFBEB', border: '#FEF3C7', icon: '⚡' },
  LOW: { color: '#067D62', bg: '#F0FFF4', border: '#D1FAE5', icon: '🌱' },
}

function TipCard({ title, desc, impact }) {
  const [isOpen, setIsOpen] = useState(false)
  const cfg = IMPACT_CONFIGS[impact] || IMPACT_CONFIGS.LOW

  return (
    <div 
      className="border border-[#E7E7E7] rounded-xl transition-all duration-200 overflow-hidden bg-white hover:shadow-xs cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="h-[48px] px-3.5 flex items-center justify-between select-none">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Left colored dot */}
          <span className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.color }} />
          <h4 className="text-xs font-bold text-slate-800 truncate">{title}</h4>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Right badge pill */}
          <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide text-white"
            style={{ background: cfg.color }}>
            {impact}
          </span>
          <ChevronRight 
            size={14} 
            className="text-slate-400 transition-transform duration-200" 
            style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }} 
          />
        </div>
      </div>
      
      {isOpen && (
        <div className="px-3.5 pb-3.5 pt-2 text-[11px] text-slate-500 leading-relaxed border-t border-slate-100 animate-fade-in text-left">
          {desc}
        </div>
      )}
    </div>
  )
}

// ── Product Card ───────────────────────────────────────────────────
function RecommendedCard({ p, navigate }) {
  const [showTooltip, setShowTooltip] = useState(false)
  return (
    <div className="eco-hover bg-white border border-[#E7E7E7] rounded-2xl p-4 flex flex-col gap-3 relative group">
      <div className="relative bg-[#F7F8FA] rounded-xl p-2 border border-slate-100 flex items-center justify-center overflow-hidden h-40">
        <img src={p.image_url} alt={p.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" />
        <span className="absolute top-2 left-2 bg-[#D13212] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          -{p.discount_pct}% OFF
        </span>
        {/* Why recommended tooltip */}
        <button
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="absolute top-2 right-2 w-5 h-5 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 flex items-center justify-center hover:bg-[#F7F8FA] hover:text-[#FF9900] transition-colors"
        >?</button>
        {showTooltip && (
          <div className="absolute top-9 right-2 bg-white border border-[#E7E7E7] rounded-xl p-3 shadow-xl z-10 w-48 text-[11px] text-slate-700 leading-relaxed animate-fade-in">
            <strong className="text-[#067D62]">Why recommended:</strong><br />{p.match_reason}
          </div>
        )}
      </div>
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold">{p.brand}</span>
          <span className="inline-flex items-center gap-1 text-[10px] bg-[#F7F8FA] text-[#067D62] border border-[#E7E7E7] px-2 py-0.5 rounded-full font-bold">
            <ShieldCheck size={9} /> Renewed
          </span>
        </div>
        <h3 className="text-sm font-semibold text-slate-900 h-10 overflow-hidden leading-tight">{p.name}</h3>
        <p className="text-[10px] text-indigo-600 font-semibold mt-1 flex items-center gap-1">
          <Sparkles size={9} /> {p.match_reason}
        </p>
      </div>
      <div className="flex justify-between items-center mt-auto pt-2 border-t border-slate-100">
        <div>
          <span className="text-base font-bold text-[#B12704]">₹{Math.round(p.price_renewed).toLocaleString('en-IN')}</span>
          <span className="text-xs text-slate-400 line-through ml-2">₹{p.price_new.toLocaleString('en-IN')}</span>
        </div>
        <span className="text-xs text-[#067D62] font-bold flex items-center gap-1">
          <Leaf size={10} /> -{p.carbon_saved} kg
        </span>
      </div>
      <button
        onClick={() => navigate(`/renewed/${p.product_id}`)}
        className="btn-primary w-full text-xs"
      >
        View Renewed Listing →
      </button>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────
export default function Recommendations() {
  const navigate  = useNavigate()
  const { user }  = useUser()
  const [feedProducts, setFeedProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const chatEndRef = useRef(null)

  const [messages, setMessages] = useState([])
  const [input, setInput]       = useState('')
  const [sending, setSending]   = useState(false)

  useEffect(() => {
    if (user) {
      setMessages([{
        role: 'assistant',
        content: `Hello ${user.name.split(' ')[0]}! 👋 I'm your ReLoop AI advisor. I can help you find eco-friendly products, explain how to earn more Green Credits, or suggest the best return options for your items. What's on your mind?`
      }])
    }
  }, [user])

  useEffect(() => {
    if (user?.user_id) {
      setLoading(true)
      getPersonalisedFeed(user.user_id)
        .then(res => { if (res?.status === 'ok' && res.feed?.length) setFeedProducts(res.feed) })
        .finally(() => setLoading(false))
    }
  }, [user])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    if (!text.trim() || sending || !user) return
    const userMessage = { role: 'user', content: text }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setSending(true)
    try {
      const res = await sendChat({ message: text, history: messages.slice(-5), user_id: user.user_id })
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res?.status === 'ok' ? res.reply : "I'm having trouble connecting right now. Try returning products via ReLoop to save carbon and earn credits!"
      }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I hit an error. Try asking about Green Credits or eco tips!" }])
    } finally {
      setSending(false)
    }
  }

  const handleSend = (e) => { e.preventDefault(); sendMessage(input) }

  const tips = [
    { title: "Check Sizing Charts Carefully",         desc: "Clothing size mismatches cause 25% of all returns. Checking brand-specific measurements saves carbon shipping waste.", impact: "HIGH"   },
    { title: "Opt for Certified Renewed Electronics", desc: "Renewed products use up to 85% less mineral resources vs. new manufacturing.",                                     impact: "HIGH"   },
    { title: "Earn 1.5× Credits on Local Drop-off",   desc: "Selecting a local drop-off center instead of home pick-up earns 50% extra Green Credits.",                        impact: "MEDIUM" },
    { title: "Donate Instead of Return",               desc: "Verified NGO donations earn 2× credits and reduce landfill waste by keeping items in use longer.",                  impact: "LOW"    },
  ]

  return (
    <div className="bg-[#F7F8FA] min-h-screen" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
      <div className="w-full px-6 py-8 space-y-6">

        {/* Title */}
        <div className="flex items-center gap-2 animate-fade-in">
          <Sparkles className="text-[#FF9900]" size={22} />
          <h1 className="text-2xl font-black text-slate-900">For You</h1>
          <span className="text-xs text-[#565959] font-medium ml-1">AI-Personalised Picks</span>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* Left: AI Chat */}
          <div className="flex-1 w-full">
            <div className="bg-white border border-[#E7E7E7] rounded-xl overflow-hidden shadow-sm flex flex-col" style={{ minHeight: '520px' }}>
              {/* Chat header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-[#131921]">
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-base animate-glow text-white font-bold">♻</div>
                <div>
                  <h2 className="text-sm font-bold text-white">ReLoop AI Advisor</h2>
                  <p className="text-[10px] text-white/70">Sustainability intelligence · Always on</p>
                </div>
                <span className="ml-auto flex items-center gap-1 text-[10px] text-white/80 font-semibold">
                  <span className="w-1.5 h-1.5 bg-[#067D62] rounded-full animate-pulse" /> Online
                </span>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto flex flex-col gap-4 p-5 bg-[#F7F8FA]" style={{ height: '340px' }}>
                {messages.map((m, i) => (
                  <ChatMessage
                    key={i}
                    msg={m}
                    isLast={i === messages.length - 1}
                    onQuickReply={sendMessage}
                  />
                ))}
                {sending && (
                  <div className="flex gap-2.5 items-start">
                    <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold text-white bg-[#232F3E] shadow-sm animate-glow">🤖</div>
                    <div className="bg-white border border-[#E7E7E7] px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                      <div className="flex gap-1 items-center h-4">
                        {[0,1,2].map(i => (
                          <span key={i} className="w-1.5 h-1.5 bg-slate-450 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-[#E7E7E7] bg-white">
                <form onSubmit={handleSend} className="flex items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask about credits, eco tips, returns..."
                    className="flex-1 h-[48px] px-4 bg-white border-[1.5px] border-[#D5D9D9] rounded-[24px] text-sm text-[#111111] outline-none focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF9900]/15 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-10 h-10 flex items-center justify-center rounded-full text-white bg-[#FF9900] hover:bg-[#F08804] transition-all disabled:opacity-50 cursor-pointer active:scale-95 shadow-sm ml-2 self-center"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Right: Tips + Eco Rank */}
          <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-4">

            {/* Eco Rank Widget */}
            <div className="bg-white border border-[#E7E7E7] rounded-xl p-6 shadow-sm">
              <h2 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-slate-100 pb-2 text-left">
                <Leaf className="text-[#067D62]" size={16} /> Your Eco Rank
              </h2>
              <EcoRankWidget credits={1720} />
            </div>

            {/* Sustainability Tips */}
            <div className="bg-white border border-[#E7E7E7] rounded-xl p-5 shadow-sm">
              <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2 border-b border-slate-100 pb-2 text-left">
                <Lightbulb className="text-[#FF9900]" size={16} /> AI Sustainability Tips
              </h2>
              <div className="flex flex-col gap-2.5">
                {tips.map((t, idx) => <TipCard key={idx} {...t} />)}
              </div>
            </div>

          </div>
        </div>

        {/* Personalised Picks */}
        <div className="bg-white border border-[#E7E7E7] rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5 text-left">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles size={16} className="text-[#FF9900]" /> Personalised Refurbished Picks
              </h2>
              <p className="text-xs text-slate-450 mt-0.5">Based on your return history and purchase patterns</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {loading ? (
              [1,2,3].map(i => (
                <div key={i} className="h-72 rounded-xl skeleton-green border border-green-150" />
              ))
            ) : feedProducts.length > 0 ? (
              feedProducts.map(p => <RecommendedCard key={p.product_id} p={p} navigate={navigate} />)
            ) : (
              <div className="col-span-3 py-16 flex flex-col items-center text-center">
                <Recycle className="text-slate-350 mb-3" size={48} />
                <p className="text-sm font-bold text-slate-700">Complete a return to get personalised recommendations!</p>
                <p className="text-xs text-slate-450 mt-1">Your AI picks will appear after your first ReLoop return.</p>
                <button
                  onClick={() => navigate('/returns')}
                  className="btn-primary mt-4 min-w-[180px]"
                >
                  Start a Return
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
