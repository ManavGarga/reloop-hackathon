import { useState, useEffect } from 'react'
import { User, Award, Shield, MapPin, Phone, Mail, CheckCircle, ArrowRightLeft, Heart, RefreshCw } from 'lucide-react'
import { getUserDashboard } from '../api/reloop'

export default function Profile() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getUserDashboard('user_priya_001')
        if (data && data.status === 'ok') {
          setDashboard(data)
        }
      } catch (e) {
        console.error('Error loading profile:', e)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div className="glass shimmer" style={{ height: '200px', borderRadius: '16px' }} />
        <div className="glass shimmer" style={{ height: '400px', borderRadius: '16px' }} />
      </div>
    )
  }

  const user = dashboard?.user || {
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91-9876543210',
    city: 'Bengaluru',
    member_since: '2026-04-14'
  }

  const credits = dashboard?.green_credits || {
    balance: 240,
    total_earned: 340,
    total_spent: 100
  }

  const pastReturns = dashboard?.past_returns || [
    {
      product: 'Nike Dri-FIT T-Shirt',
      category: 'clothing',
      reason: 'size mismatch',
      route: 'p2p',
      date: '2026-04-20'
    },
    {
      product: 'Boat Airdopes 141',
      category: 'electronics',
      reason: 'sound quality poor',
      route: 'refurbish',
      date: '2026-05-15'
    },
    {
      product: 'Zara Formal Shirt',
      category: 'clothing',
      reason: 'color different from photo',
      route: 'ngo_donate',
      date: '2026-06-03'
    }
  ]

  const getRouteIcon = (route) => {
    switch (route) {
      case 'p2p':
        return <ArrowRightLeft size={16} style={{ color: '#06b6d4' }} />
      case 'refurbish':
        return <RefreshCw size={16} style={{ color: '#22c55e' }} />
      case 'ngo_donate':
        return <Heart size={16} style={{ color: '#ef4444' }} />
      default:
        return <CheckCircle size={16} />
    }
  }

  const getRouteLabel = (route) => {
    switch (route) {
      case 'p2p': return 'Peer-to-Peer Recommerce'
      case 'refurbish': return 'Amazon Renewed Refurbish'
      case 'ngo_donate': return 'NGO Donation'
      default: return 'Standard Return'
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Header Profile Info Card */}
      <div className="glass" style={{
        padding: '32px',
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '24px'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '32px',
          fontWeight: '700'
        }}>
          {user.name.charAt(0)}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          <h1 style={{ fontSize: '26px', fontWeight: '800' }}>{user.name}</h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', color: 'var(--text-muted)', fontSize: '14px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={16} /> {user.email}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={16} /> {user.phone}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={16} /> {user.city}
            </span>
          </div>
        </div>

        <div style={{
          background: 'rgba(34, 197, 94, 0.15)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          padding: '8px 16px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Shield size={18} style={{ color: '#22c55e' }} />
          <span style={{ color: '#22c55e', fontWeight: '700', fontSize: '13px' }}>
            Eco-Certified Account
          </span>
        </div>
      </div>

      {/* Grid: Credits & Achievements */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px'
      }}>
        {/* Ledger Summary */}
        <div className="glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={20} style={{ color: '#fbbf24' }} />
            Green Credits Ledger
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '12px',
            textAlign: 'center',
            background: 'rgba(0,0,0,0.2)',
            padding: '16px',
            borderRadius: '12px'
          }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Balance</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#fbbf24', marginTop: '4px' }}>
                {credits.balance}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Total Earned</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#22c55e', marginTop: '4px' }}>
                {credits.total_earned}
              </div>
            </div>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Total Spent</div>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#ef4444', marginTop: '4px' }}>
                {credits.total_spent}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Latest Transaction:</span>
              <span style={{ color: '#22c55e', fontWeight: '600' }}>+80 Credits (P2P Sale)</span>
            </div>
            <button className="btn-primary" style={{ width: '100%', padding: '10px' }}>
              Redeem Credits on Amazon
            </button>
          </div>
        </div>

        {/* Badges & Achievements */}
        <div className="glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700' }}>Carbon Badge Showcase</h2>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '80px', textAlign: 'center'
            }}>
              <div style={{
                width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.15)',
                display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: '#22c55e', fontSize: '20px'
              }}>
                🌱
              </div>
              <span style={{ fontSize: '11px', fontWeight: '600' }}>Eco Starter</span>
            </div>

            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '80px', textAlign: 'center'
            }}>
              <div style={{
                width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)',
                display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: '#6366f1', fontSize: '20px'
              }}>
                🔄
              </div>
              <span style={{ fontSize: '11px', fontWeight: '600' }}>P2P Champion</span>
            </div>

            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', width: '80px', textAlign: 'center'
            }}>
              <div style={{
                width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)',
                display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: '#ef4444', fontSize: '20px'
              }}>
                ❤️
              </div>
              <span style={{ fontSize: '11px', fontWeight: '600' }}>Kind Giver</span>
            </div>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.5', marginTop: 'auto' }}>
            Keep returning sustainably to unlock more badges and boost your sustainability rank.
          </p>
        </div>
      </div>

      {/* Past Returns History List */}
      <div className="glass" style={{ padding: '28px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Past Return History</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {pastReturns.map((item, index) => (
            <div 
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '600' }}>{item.product}</h3>
                <div style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
                  Reason: {item.reason} • Category: {item.category}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(255,255,255,0.04)',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '500'
                }}>
                  {getRouteIcon(item.route)}
                  {getRouteLabel(item.route)}
                </div>

                <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                  {new Date(item.date).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
