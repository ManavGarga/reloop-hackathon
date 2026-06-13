import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { Package, RotateCcw, BarChart2, Sparkles, ShoppingBag, User } from 'lucide-react'
import './index.css'

// ─── Page Placeholders (Person 2 will flesh these out) ───
const pages = {
  Home:            () => <PlaceholderPage title="Home" subtitle="Sustainable Returns & Recommerce" />,
  Products:        () => <PlaceholderPage title="Marketplace" subtitle="Browse refurbished & returned items" />,
  Returns:         () => <PlaceholderPage title="Initiate Return" subtitle="Smart return decision engine" />,
  Dashboard:       () => <PlaceholderPage title="Analytics Dashboard" subtitle="Sustainability impact & trends" />,
  Recommendations: () => <PlaceholderPage title="For You" subtitle="AI-powered personalized picks" />,
  Profile:         () => <PlaceholderPage title="My Profile" subtitle="Account & return history" />,
}

function PlaceholderPage({ title, subtitle }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', gap: '12px', textAlign: 'center'
    }}>
      <div style={{ fontSize: 48 }}>🔄</div>
      <h1 style={{ fontSize: 28, fontWeight: 700 }} className="gradient-text">{title}</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>{subtitle}</p>
      <span style={{
        background: 'rgba(99,102,241,0.15)', color: 'var(--primary)',
        padding: '6px 16px', borderRadius: 999, fontSize: 13, fontWeight: 600
      }}>Page coming soon</span>
    </div>
  )
}

const navItems = [
  { to: '/',               icon: <ShoppingBag size={18} />, label: 'Home'            },
  { to: '/products',       icon: <Package size={18} />,     label: 'Marketplace'     },
  { to: '/returns',        icon: <RotateCcw size={18} />,   label: 'Returns'         },
  { to: '/dashboard',      icon: <BarChart2 size={18} />,   label: 'Dashboard'       },
  { to: '/recommendations',icon: <Sparkles size={18} />,    label: 'For You'         },
  { to: '/profile',        icon: <User size={18} />,        label: 'Profile'         },
]

function Navbar() {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px',
      display: 'flex', alignItems: 'center', gap: 8, height: 60
    }}>
      <span style={{ fontWeight: 800, fontSize: 22, marginRight: 24 }} className="gradient-text">
        Re<span style={{ color: 'var(--accent)' }}>Loop</span>
      </span>
      {navItems.map(({ to, icon, label }) => (
        <NavLink
          key={to} to={to} end={to === '/'}
          style={({ isActive }) => ({
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: 8,
            fontSize: 14, fontWeight: 500, textDecoration: 'none',
            color: isActive ? 'white' : 'var(--text-muted)',
            background: isActive ? 'rgba(99,102,241,0.2)' : 'transparent',
            transition: 'all 0.2s ease',
          })}
        >
          {icon} {label}
        </NavLink>
      ))}
    </nav>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <Routes>
          <Route path="/"                element={<pages.Home />}            />
          <Route path="/products"        element={<pages.Products />}        />
          <Route path="/returns"         element={<pages.Returns />}         />
          <Route path="/dashboard"       element={<pages.Dashboard />}       />
          <Route path="/recommendations" element={<pages.Recommendations />} />
          <Route path="/profile"         element={<pages.Profile />}         />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
