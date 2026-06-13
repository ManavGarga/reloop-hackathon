import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, RotateCcw, ShieldCheck, Leaf, ArrowRight, Award, Zap, Heart } from 'lucide-react'
import { getUserDashboard, getProducts } from '../api/reloop'

export default function Home() {
  const navigate = useNavigate()
  const [dashboard, setDashboard] = useState(null)
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const dashData = await getUserDashboard('user_priya_001')
        const prodData = await getProducts()
        if (dashData && dashData.status === 'ok') setDashboard(dashData)
        if (prodData && prodData.status === 'ok') {
          setFeaturedProducts(prodData.products.slice(0, 3))
        }
      } catch (e) {
        console.error('Error loading home data:', e)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Premium Amazon Eco Hero Banner */}
      <div className="glass" style={{
        padding: '40px',
        background: 'linear-gradient(135deg, rgba(20, 83, 45, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(34, 197, 94, 0.2)',
        borderRadius: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative background glow */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '300px',
          height: '300px',
          background: 'rgba(34, 197, 94, 0.15)',
          filter: 'blur(80px)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            background: 'rgba(34, 197, 94, 0.2)',
            color: '#4ade80',
            fontSize: '12px',
            fontWeight: '700',
            padding: '4px 12px',
            borderRadius: '999px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Amazon ReLoop
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            • Customer Obsessed Sustainability
          </span>
        </div>

        <h1 style={{
          fontSize: '38px',
          fontWeight: '800',
          lineHeight: '1.2',
          background: 'linear-gradient(135deg, #ffffff 40%, #a7f3d0 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Give Your Returns a Second Life.<br />
          Earn Green Credits Instantly.
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '16px', maxWidth: '600px', lineHeight: '1.6' }}>
          ReLoop turns returns into sustainable actions. Choose Peer-to-Peer Recommerce, Refurbishing, or Local NGO Donation instead of standard refunds. Track your carbon savings and redeem credits on Amazon.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginTop: '10px' }}>
          <button 
            onClick={() => navigate('/returns')}
            className="btn-primary" 
            style={{ 
              background: 'linear-gradient(135deg, #eab308, #ca8a04)',
              color: '#0f172a',
              border: 'none',
              padding: '12px 28px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(234, 179, 8, 0.2)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(234, 179, 8, 0.3)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(234, 179, 8, 0.2)'
            }}
          >
            <RotateCcw size={18} />
            Start a Smart Return
          </button>
          <button 
            onClick={() => navigate('/products')}
            style={{ 
              background: 'transparent',
              color: '#ffffff',
              border: '1px solid var(--border)',
              padding: '12px 28px',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.borderColor = 'var(--border)'
            }}
          >
            Explore Recommerce Marketplace
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Sustainability Metrics Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px'
      }}>
        <div className="glass" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'rgba(34, 197, 94, 0.15)',
            color: '#22c55e',
            padding: '12px',
            borderRadius: '12px'
          }}>
            <Leaf size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '500' }}>Carbon Dioxide Saved</div>
            <div style={{ fontSize: '24px', fontWeight: '800', marginTop: '2px' }}>
              {dashboard ? `${dashboard.impact.co2_saved_kg} kg` : '28.4 kg'}
            </div>
          </div>
        </div>

        <div className="glass" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'rgba(99, 102, 241, 0.15)',
            color: '#6366f1',
            padding: '12px',
            borderRadius: '12px'
          }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '500' }}>Green Credits Balance</div>
            <div style={{ fontSize: '24px', fontWeight: '800', marginTop: '2px', color: '#fbbf24' }}>
              {dashboard ? `${dashboard.green_credits.balance}` : '240'}
            </div>
          </div>
        </div>

        <div className="glass" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'rgba(6, 182, 212, 0.15)',
            color: '#06b6d4',
            padding: '12px',
            borderRadius: '12px'
          }}>
            <Zap size={24} />
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '500' }}>Trees Saved Equivalent</div>
            <div style={{ fontSize: '24px', fontWeight: '800', marginTop: '2px' }}>
              {dashboard ? `${dashboard.impact.trees_equivalent}` : '1.4'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Features and Dashboard Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '24px'
      }}>
        {/* Amazon Renewed Spotlight */}
        <div className="glass" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={22} style={{ color: '#fbbf24' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Amazon Renewed</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5' }}>
            Buy with confidence. Every refurbished or open-box product bought on ReLoop is fully certified, tested to work and look like new, and comes with a 1-year brand warranty.
          </p>
          <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
            <button 
              onClick={() => navigate('/amazon-renewed')}
              style={{
                background: 'none',
                border: 'none',
                color: '#4ade80',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                padding: '0'
              }}
            >
              Learn more about Renewed Standard <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Local Community NGO Donation */}
        <div className="glass" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Heart size={22} style={{ color: '#ef4444' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Donate to Local NGOs</h2>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5' }}>
            No longer need it? Donate electronics, formal clothing, or school books directly to our partner NGOs. We'll handle the logistics and reward you with sustainability badges and Green Credits.
          </p>
          <div style={{ marginTop: 'auto', paddingTop: '10px' }}>
            <button 
              onClick={() => navigate('/returns')}
              style={{
                background: 'none',
                border: 'none',
                color: '#6366f1',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                padding: '0'
              }}
            >
              Start Donation Return <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Featured Recommerce Products */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Featured Sustainability Deals</h2>
          <button 
            onClick={() => navigate('/products')}
            style={{
              background: 'none',
              border: 'none',
              color: '#22d3ee',
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            See all deals
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {featuredProducts.length > 0 ? (
            featuredProducts.map((p) => (
              <div 
                key={p.product_id}
                className="glass" 
                style={{ 
                  padding: '20px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '12px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease'
                }}
                onClick={() => navigate(`/return/${p.product_id}`)}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ 
                  height: '160px', 
                  borderRadius: '8px', 
                  background: 'rgba(255,255,255,0.02)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={p.image_url} 
                    alt={p.name} 
                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', padding: '10px' }} 
                  />
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>
                    {p.brand} • {p.category}
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: '600', marginTop: '4px', height: '40px', overflow: 'hidden' }}>
                    {p.name}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                    <span style={{ fontSize: '18px', fontWeight: '700', color: '#4ade80' }}>
                      ₹{p.price_new.toLocaleString()}
                    </span>
                    <span style={{ 
                      fontSize: '12px', 
                      background: 'rgba(34, 197, 94, 0.15)', 
                      color: '#4ade80', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontWeight: '600'
                    }}>
                      -{p.carbon_footprint_kg} kg CO₂
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            [1, 2, 3].map((i) => (
              <div key={i} className="glass shimmer" style={{ height: '300px', borderRadius: '16px' }} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
