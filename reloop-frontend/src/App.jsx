import { useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { Package, RotateCcw, BarChart2, Sparkles, ShoppingBag, User, ShoppingCart, MapPin, Search, Coins, Award, X, Trash2 } from 'lucide-react'
import './index.css'

// Import actual page components
import ProductPage from './pages/ProductPage'
import ReturnFlow from './pages/ReturnFlow'
import Dashboard from './pages/Dashboard'
import PassportPage from './pages/PassportPage'
import AmazonRenewedPage from './pages/AmazonRenewedPage'
import Home from './pages/Home'
import Recommendations from './pages/Recommendations'
import Profile from './pages/Profile'

import { CartProvider, useCart } from './context/CartContext'

const navItems = [
  { to: '/',               label: 'Home'            },
  { to: '/products',       label: 'Marketplace'     },
  { to: '/returns',        label: 'Returns'         },
  { to: '/dashboard',      label: 'Eco Dashboard'   },
  { to: '/recommendations',label: 'For You'         },
  { to: '/profile',        label: 'Profile'         },
]

function Navbar() {
  const { totalItems, cartItems, removeFromCart } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/products');
    }
  };

  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 100, display: 'flex', flexDirection: 'column' }}>
        {/* Top Main Nav Belt */}
        <div style={{
          background: '#131921',
          height: '60px',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          color: 'white'
        }}>
          {/* Left: Logo and Address */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <NavLink to="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 800, fontSize: 20, color: 'white', letterSpacing: '-0.5px' }}>
                amazon<span style={{ color: '#4ade80', fontWeight: '800' }}>reloop</span>
              </span>
              <div style={{ height: '3px', width: '100%', background: 'linear-gradient(90deg, #febd69, #4ade80)', borderRadius: '2px', marginTop: '-2px' }} />
            </NavLink>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
              <MapPin size={16} style={{ color: '#cccccc', marginTop: '6px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', fontSize: '11px', lineHeight: '1.2' }}>
                <span style={{ color: '#cccccc' }}>Deliver to Priya</span>
                <span style={{ fontWeight: '700', color: 'white' }}>Bengaluru 560001</span>
              </div>
            </div>
          </div>

          {/* Middle: Custom Search bar */}
          <div style={{ display: 'flex', flex: 1, flexDirection: 'column', position: 'relative' }}>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', height: '40px', borderRadius: '4px', overflow: 'hidden', background: 'white' }}>
              <select 
                style={{
                  background: '#f3f3f3',
                  color: '#555555',
                  padding: '0 12px',
                  fontSize: '12px',
                  border: 'none',
                  borderRight: '1px solid #cccccc',
                  cursor: 'pointer',
                  fontWeight: '500',
                  outline: 'none'
                }}
              >
                <option>All Departments</option>
                <option>Amazon Fashion</option>
                <option>Electronics</option>
                <option>Books</option>
                <option>Appliances</option>
              </select>
              <input 
                type="text" 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => document.getElementById('search-suggestions').style.display = 'block'}
                onBlur={() => setTimeout(() => {
                  const el = document.getElementById('search-suggestions');
                  if (el) el.style.display = 'none';
                }, 200)}
                placeholder="Search Amazon ReLoop for sustainable products..." 
                style={{
                  flex: 1,
                  border: 'none',
                  padding: '0 12px',
                  fontSize: '14px',
                  color: '#111111',
                  outline: 'none'
                }}
              />
              <button 
                type="submit"
                style={{
                  background: '#febd69',
                  border: 'none',
                  width: '45px',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.background = '#f3a847'}
                onMouseOut={e => e.currentTarget.style.background = '#febd69'}
              >
                <Search size={18} style={{ color: '#131921' }} />
              </button>
            </form>

            {/* Realtime Autocomplete Suggestions (Matches uploaded design) */}
            <div 
              id="search-suggestions"
              style={{
                display: 'none',
                position: 'absolute',
                top: '42px',
                left: 0,
                right: 0,
                background: 'white',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 1000,
                color: '#111',
                maxHeight: '320px',
                overflowY: 'auto'
              }}
            >
              {[
                { primary: "bata", secondary: " women foot wear" },
                { primary: "bata", secondary: " shoes for man" },
                { primary: "bathroom", secondary: " organiser without drill" },
                { primary: "bata", secondary: " sandals for man" },
                { primary: "batting", secondary: " gloves" },
                { primary: "bata", secondary: " slippers for men offer" },
                { primary: "bathrobe", secondary: " for women" },
                { primary: "bath", secondary: " towel" },
                { primary: "bata", secondary: " slippers for man" },
                { primary: "bathrobe", secondary: "" }
              ].filter(item => {
                if (!searchQuery) return true;
                const fullText = item.primary + item.secondary;
                return fullText.toLowerCase().includes(searchQuery.toLowerCase());
              }).map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    setSearchQuery(item.primary + item.secondary);
                    navigate(`/products?q=${encodeURIComponent(item.primary + item.secondary)}`);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 16px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    borderBottom: '1px solid #f5f5f5'
                  }}
                  onMouseOver={e => e.currentTarget.style.background = '#f5f5f5'}
                  onMouseOut={e => e.currentTarget.style.background = 'white'}
                >
                  <Search size={14} style={{ color: '#888' }} />
                  <div>
                    <strong>{item.primary}</strong>
                    <span style={{ color: '#555' }}>{item.secondary}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

            {/* Right: User accounts, Returns, Eco Credits & Cart */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              
              {/* Account Dropdown Container with Hover behavior */}
              <div 
                style={{ position: 'relative', display: 'inline-block', cursor: 'pointer' }}
                onMouseEnter={() => document.getElementById('account-dropdown').style.display = 'block'}
                onMouseLeave={() => document.getElementById('account-dropdown').style.display = 'none'}
              >
                <div style={{ display: 'flex', flexDirection: 'column', fontSize: '12px' }}>
                  <span style={{ color: '#cccccc' }}>{isLoggedIn ? "Hello, Nikita" : "Hello, Priya"}</span>
                  <span style={{ fontWeight: '700', color: 'white', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    Account & Lists <span style={{ fontSize: '10px' }}>▼</span>
                  </span>
                </div>

                {/* Account & Lists Hover Dropdown Menu */}
                <div 
                  id="account-dropdown"
                  style={{
                    display: 'none',
                    position: 'absolute',
                    top: '40px',
                    right: '-60px',
                    width: '320px',
                    background: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    padding: '16px',
                    zIndex: 500,
                    color: '#111'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '12px' }}>
                    <button 
                      onClick={() => setIsLoggedIn(!isLoggedIn)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        background: 'linear-gradient(to bottom, #f7dfa5, #f0c14b)',
                        border: '1px solid #a88734',
                        borderRadius: '3px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      {isLoggedIn ? "Sign Out" : "Sign In"}
                    </button>
                    <span style={{ fontSize: '11px', marginTop: '6px', color: '#565959' }}>New customer? <strong style={{ color: '#007185', cursor: 'pointer' }}>Start here.</strong></span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '12px', textAlign: 'left' }}>
                    <div>
                      <h4 style={{ fontWeight: '700', color: '#111', marginBottom: '8px' }}>Your Lists</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#565959' }}>
                        <span>Create a Wish List</span>
                        <span>Wish From Any Website</span>
                        <span>Baby Wishlist</span>
                      </div>
                    </div>
                    <div>
                      <h4 style={{ fontWeight: '700', color: '#111', marginBottom: '8px' }}>Your Account</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#565959' }}>
                        <NavLink to="/profile" style={{ textDecoration: 'none', color: '#565959' }}>Your Account</NavLink>
                        <NavLink to="/returns" style={{ textDecoration: 'none', color: '#565959' }}>Your Orders</NavLink>
                        <NavLink to="/dashboard" style={{ textDecoration: 'none', color: '#565959' }}>Eco Dashboard</NavLink>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <NavLink to="/returns" style={{ textDecoration: 'none', color: 'white', display: 'flex', flexDirection: 'column', fontSize: '12px' }}>
                <span style={{ color: '#cccccc' }}>Returns</span>
                <span style={{ fontWeight: '700' }}>& Smart ReLoop</span>
              </NavLink>

            {/* Green Credits Coin */}
            <NavLink to="/profile" style={{
              textDecoration: 'none',
              color: '#131921',
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
              padding: '4px 12px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: '800',
              fontSize: '13px',
              boxShadow: '0 2px 6px rgba(245, 158, 11, 0.3)'
            }}>
              <Coins size={15} />
              <span>240 Credits</span>
            </NavLink>

            {/* Cart Button */}
            <div 
              onClick={() => setCartOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', position: 'relative' }}
            >
              <div style={{ position: 'relative' }}>
                <ShoppingCart size={22} style={{ color: '#ffffff' }} />
                {totalItems > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: '#f08804',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: '700',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {totalItems}
                  </span>
                )}
              </div>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'white', marginTop: '6px' }}>Cart</span>
            </div>
          </div>
        </div>

        {/* Sub-Nav Belt */}
        <div style={{
          background: '#232f3e',
          height: '38px',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: 'white',
          fontSize: '13px',
          borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to} to={to} end={to === '/'}
                style={({ isActive }) => ({
                  textDecoration: 'none',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '14px',
                  padding: '6px 10px',
                  border: isActive ? '1px solid #ffffff' : '1px solid transparent',
                  borderRadius: '2px',
                  display: 'inline-flex',
                  alignItems: 'center'
                })}
                onMouseOver={e => {
                  if (e.currentTarget.style.borderColor !== 'rgb(255, 255, 255)') {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                  }
                }}
                onMouseOut={e => {
                  if (e.currentTarget.style.borderColor !== 'rgb(255, 255, 255)') {
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right side Highlight */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4ade80', fontWeight: '600', fontSize: '12px' }}>
            <Award size={14} />
            <span>Sustainability Score: Eco Advocate (Level 4)</span>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      {cartOpen && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
          onClick={() => setCartOpen(false)}
        >
          <div 
            style={{
              width: '100%',
              maxWidth: '450px',
              height: '100%',
              background: '#0f172a',
              borderLeft: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-4px 0 24px rgba(0,0,0,0.5)',
              padding: '24px'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShoppingCart size={22} style={{ color: '#febd69' }} /> Shopping Cart
              </h2>
              <button 
                onClick={() => setCartOpen(false)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                  <ShoppingCart size={48} style={{ color: '#1e293b', marginBottom: '16px', marginInline: 'auto' }} />
                  <p style={{ fontSize: '15px', fontWeight: '600' }}>Your Cart is empty</p>
                  <p style={{ fontSize: '13px', marginTop: '4px' }}>Add items from Marketplace or Amazon Renewed!</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.product_id} style={{ display: 'flex', gap: '14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
                    <div style={{ width: '80px', height: '80px', background: 'white', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={item.image_url} alt={item.name} style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifySelf: 'stretch', justifyContent: 'space-between' }}>
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'white', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.name}</h4>
                        <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Qty: {item.quantity}</p>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                        <span style={{ fontSize: '15px', fontWeight: '800', color: '#4ade80' }}>₹{item.price_new.toLocaleString()}</span>
                        <button 
                          onClick={() => removeFromCart(item.product_id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '600' }}
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', marginTop: '20px', spaceY: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '500' }}>Subtotal ({totalItems} items):</span>
                  <span style={{ fontSize: '20px', fontWeight: '800', color: 'white' }}>
                    ₹{cartItems.reduce((acc, item) => acc + (item.price_new * item.quantity), 0).toLocaleString()}
                  </span>
                </div>
                <button 
                  onClick={() => {
                    setCartOpen(false);
                    alert("Checkout processed successfully (Demo mock)!");
                  }}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'linear-gradient(180deg, #fad961 0%, #f76b1c 100%)',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#0f172a',
                    fontWeight: '800',
                    fontSize: '14px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(247, 107, 28, 0.2)',
                    transition: 'transform 0.1s'
                  }}
                  onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                  onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  Proceed to Buy
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <main style={{ width: '100%', padding: '24px' }}>
          <Routes>
            <Route path="/"                element={<Home />}            />
            <Route path="/products"        element={<ProductPage />}          />
            <Route path="/returns"         element={<ReturnFlow />}           />
            <Route path="/return/:productId" element={<ReturnFlow />}         />
            <Route path="/dashboard"       element={<Dashboard />}            />
            <Route path="/passport/:productId" element={<PassportPage />}     />
            <Route path="/amazon-renewed"  element={<AmazonRenewedPage />}    />
            <Route path="/renewed/:productId" element={<AmazonRenewedPage />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/profile"         element={<Profile />}         />
          </Routes>
        </main>
      </BrowserRouter>
    </CartProvider>
  )
}
