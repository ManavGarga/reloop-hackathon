import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts } from '../api/reloop'
import { Leaf, Recycle, ArrowRight, ShieldCheck, Zap } from 'lucide-react'

// Floating leaf particle component
function LeafParticle({ style }) {
  return (
    <span
      className="animate-leaf absolute select-none pointer-events-none"
      style={{ fontSize: '20px', ...style }}
      aria-hidden="true"
    >🌿</span>
  )
}

// Eco product card with badges
function EcoProductCard({ name, emoji, price, co2, credits, condition, link, delay = 0 }) {
  const navigate = useNavigate()
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.15 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  const conditionColor = {
    'Like New': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Good':     'bg-blue-100 text-blue-800 border-blue-200',
    'Fair':     'bg-amber-100 text-amber-800 border-amber-200',
  }[condition] || 'bg-gray-100 text-gray-700'

  return (
    <div
      ref={ref}
      onClick={() => navigate(link)}
      className={`relative flex flex-col bg-white border border-[#D1FAE5] rounded-xl p-5 cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group ${visible ? 'animate-card-reveal opacity-100' : 'opacity-0'}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Condition Ribbon Overlay */}
      <div className="absolute top-3 right-3 z-10">
        <span className={`text-[10px] font-bold border px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wider ${conditionColor}`}>
          {condition}
        </span>
      </div>

      {/* Product image placeholder */}
      <div className="flex items-center justify-center h-28 text-6xl mb-4 bg-[#F0FDF4] rounded-xl group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
        {emoji}
        {/* Certification badge watermark */}
        <span className="absolute bottom-1 left-2 text-[9px] font-bold text-emerald-700 bg-white/95 px-1.5 py-0.5 rounded shadow-sm border border-emerald-100 flex items-center gap-0.5">
          <ShieldCheck size={9} /> ReLoop Graded
        </span>
      </div>

      {/* Name & price */}
      <h3 className="text-sm font-semibold text-slate-800 leading-snug mb-1 line-clamp-2 group-hover:text-[#16A34A] transition-colors">{name}</h3>
      <p className="text-lg font-bold text-[#16A34A] mb-3">{price}</p>

      {/* Eco stats */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100">
        <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
          <Leaf size={11} /> −{co2} kg CO₂
        </span>
        <span className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold">
          <Zap size={11} /> +{credits} Credits
        </span>
      </div>
    </div>
  )
}

// Skeleton card loader
function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white border border-[#D1FAE5] rounded-xl p-5 gap-3">
      <div className="skeleton-green h-4 w-28 rounded-full" />
      <div className="skeleton-green h-28 rounded-xl" />
      <div className="skeleton-green h-4 w-3/4" />
      <div className="skeleton-green h-4 w-1/2" />
      <div className="flex justify-between mt-2">
        <div className="skeleton-green h-3 w-20 rounded-full" />
        <div className="skeleton-green h-3 w-16 rounded-full" />
      </div>
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [heroVisible, setHeroVisible] = useState(false)
  const [co2Saved, setCo2Saved] = useState(420.245)

  useEffect(() => {
    // Hero entrance animation
    const t = setTimeout(() => setHeroVisible(true), 100)
    // Simulate product load
    getProducts().finally(() => setLoading(false))

    // Real-time ticking CO2 counter
    const interval = setInterval(() => {
      setCo2Saved(prev => prev + (Math.random() * 0.003 + 0.001))
    }, 300)

    return () => {
      clearTimeout(t)
      clearInterval(interval)
    }
  }, [])

  const categories = [
    {
      title: "Appliances for your home | Up to 55% off",
      items: [
        { name: "Air conditioners", img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=300&auto=format&fit=crop" },
        { name: "Refrigerators",    img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=300&auto=format&fit=crop" },
        { name: "Microwaves",       img: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?q=80&w=300&auto=format&fit=crop" },
        { name: "Washing machines", img: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=300&auto=format&fit=crop" }
      ]
    },
    {
      title: "Revamp your home in style",
      items: [
        { name: "Cushions & sheets", img: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=300&auto=format&fit=crop" },
        { name: "Figurines, vases",  img: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=300&auto=format&fit=crop" },
        { name: "Home storage",      img: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=300&auto=format&fit=crop" },
        { name: "Lighting",          img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=300&auto=format&fit=crop" }
      ]
    },
    {
      title: "Starting ₹49 | Home essentials deals",
      items: [
        { name: "Cleaning",     img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=85&w=300&auto=format&fit=crop" },
        { name: "Bath accessories", img: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?q=85&w=300&auto=format&fit=crop" },
        { name: "Home tools",   img: "https://images.unsplash.com/photo-1416339134316-0e91dc9ded92?q=85&w=300&auto=format&fit=crop" },
        { name: "Wallpapers",   img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=85&w=300&auto=format&fit=crop" }
      ]
    },
    {
      title: "Up to 75% off | Deals on headphones",
      items: [
        { name: "Earbuds",       img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=300&auto=format&fit=crop" },
        { name: "Over-Ear ANC",  img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop" },
        { name: "Neckbands",     img: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?q=80&w=300&auto=format&fit=crop" },
        { name: "Gaming Headsets", img: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=300&auto=format&fit=crop" }
      ]
    }
  ]

  const ecoDeals = [
    { emoji: '📱', name: 'Samsung Galaxy M34 5G', price: '₹14,500', co2: '59.5', credits: 150, condition: 'Like New', link: '/product/B09X7KQMGN' },
    { emoji: '🧥', name: "Levi's Trucker Denim Jacket", price: '₹3,299', co2: '18.7', credits: 75, condition: 'Good', link: '/product/JACKET_001' },
    { emoji: '🎧', name: 'Sony WH-1000XM4 Headphones', price: '₹18,999', co2: '12.3', credits: 60, condition: 'Like New', link: '/products' },
    { emoji: '📦', name: 'Philips Hand Blender Pro', price: '₹2,499', co2: '4.8', credits: 30, condition: 'Good', link: '/products' },
  ]

  return (
    <div className="bg-[#F0FDF4] min-h-screen pb-12 text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif" }}>
      <div className="w-full px-6 pt-6 space-y-6">

        {/* ── Hero Banner ──────────────────────────────────────────── */}
        <div className="relative w-full overflow-hidden rounded-2xl shadow-lg" style={{ minHeight: '260px', background: 'linear-gradient(135deg, #14532D 0%, #16A34A 55%, #065F46 100%)' }}>

          {/* Leaf particles */}
          <LeafParticle style={{ bottom: '20px', left: '8%',  animationDuration: '5s',  animationDelay: '0s'   }} />
          <LeafParticle style={{ bottom: '10px', left: '22%', animationDuration: '6s',  animationDelay: '1.2s' }} />
          <LeafParticle style={{ bottom: '30px', left: '55%', animationDuration: '4.5s',animationDelay: '0.5s' }} />
          <LeafParticle style={{ bottom: '15px', right: '12%',animationDuration: '5.5s',animationDelay: '2s'   }} />
          <LeafParticle style={{ bottom: '25px', right: '28%',animationDuration: '7s',  animationDelay: '0.8s' }} />

          {/* Subtle radial glow */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.08) 0%, transparent 70%)' }} />

          {/* Hero content */}
          <div className={`relative z-10 px-10 py-12 transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                <Recycle size={12} /> Circular Commerce Platform
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-2" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.25)' }}>
              Shop Circular.{' '}
              <span style={{ borderBottom: '3px solid #86efac', paddingBottom: '2px' }}>Live Greener.</span>
            </h1>
            <p className="text-white/85 text-base mt-3 mb-6 max-w-md leading-relaxed font-medium">
              Return, refurbish, and recommerce — every purchase earns Green Credits and saves real CO₂.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/amazon-renewed')}
                className="flex items-center justify-center gap-2 bg-white text-[#14532D] hover:bg-[#F0FDF4] font-bold h-12 px-6 rounded-xl text-sm shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
              >
                Explore Renewed Deals <ArrowRight size={15} />
              </button>
              <button
                onClick={() => navigate('/returns')}
                className="flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 border-2 border-white/60 text-white font-bold h-12 px-6 rounded-xl text-sm transition-all duration-200"
              >
                <Recycle size={15} /> Start a Return
              </button>
            </div>
          </div>

          {/* CO2 ticker chip — top right */}
          <div className="absolute top-5 right-6 bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-3 shadow-md">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div className="flex flex-col items-center">
              <span className="text-lg font-black text-[#86efac] tracking-wide tabular-nums">{co2Saved.toFixed(3)} kg</span>
              <span className="text-[10px] text-white/70">CO₂ saved today</span>
            </div>
          </div>
        </div>

        {/* ── Category Grid ─────────────────────────────────────────── */}
        <div className="bg-white border border-[#D1FAE5] rounded-xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.08)]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {categories.map((cat, i) => (
              <div key={i} className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col h-full hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <h3 className="text-sm font-bold text-slate-800 mb-3 leading-snug line-clamp-2 h-10 overflow-hidden">{cat.title}</h3>
                <div className="grid grid-cols-2 gap-2 flex-1">
                  {cat.items.map((item, idx) => (
                    <div key={idx} onClick={() => navigate('/products')} className="cursor-pointer flex flex-col gap-1 group">
                      <div className="aspect-[4/3] bg-[#F0FDF4] rounded-xl overflow-hidden flex items-center justify-center p-2 border border-green-50 group-hover:scale-[1.03] transition-transform duration-200">
                        <img src={item.img} alt={item.name} className="max-h-full max-w-full object-contain" />
                      </div>
                      <span className="text-[11px] text-slate-500 mt-0.5 text-center truncate group-hover:text-[#16A34A] transition-colors">{item.name}</span>
                    </div>
                  ))}
                </div>
                <span onClick={() => navigate('/products')} className="mt-3 pt-3 border-t border-slate-100 text-sm text-[#16A34A] hover:text-[#14532D] hover:underline font-semibold cursor-pointer block">
                  See more →
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── ReLoop Certified Eco Deals ────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck size={20} className="text-[#16A34A]" />
                ReLoop Certified Deals
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">AI-graded, verified, and carbon-tracked</p>
            </div>
            <button onClick={() => navigate('/amazon-renewed')} className="text-sm text-[#16A34A] font-semibold hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ecoDeals.map((deal, i) => (
                <EcoProductCard key={i} {...deal} delay={i * 80} />
              ))}
            </div>
          )}
        </div>

        {/* ── Impact Banner ─────────────────────────────────────────── */}
        <div className="rounded-xl overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.08)] border border-[#D1FAE5]" style={{ background: 'linear-gradient(135deg, #14532D, #065F46)' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/20">
            {[
              { icon: '🌍', val: '420.25 kg', label: 'CO₂ Saved This Month' },
              { icon: '♻️', val: '1,200+', label: 'Items Recirculated' },
              { icon: '🌳', val: '38',     label: 'Trees Equivalent Saved' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center py-6 px-4 text-white text-center">
                <span className="text-3xl mb-2">{stat.icon}</span>
                <span className="text-2xl font-black">{stat.val}</span>
                <span className="text-xs text-white/70 mt-0.5 font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
