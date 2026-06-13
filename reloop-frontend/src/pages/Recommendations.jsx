import { useState, useEffect } from 'react'
import { Sparkles, Brain, Lightbulb, MessageSquare, Send, CheckCircle2, Leaf } from 'lucide-react'
import { getProducts, sendChat } from '../api/reloop'

export default function Recommendations() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  
  // AI Chat State
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello Priya! I'm your ReLoop AI assistant. I can help you find eco-friendly products, give tips to reduce your return rate, or explain how to earn more Green Credits. What's on your mind today?" }
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await getProducts()
        if (res && res.status === 'ok') {
          // Filter to items with low return rates as recommendations
          setProducts(res.products.filter(p => p.return_rate_percent < 10.0))
        }
      } catch (e) {
        console.error('Error loading recommendations:', e)
      } finally {
        setLoading(false)
      }
    }
    loadProducts()
  }, [])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || sending) return

    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setSending(true)

    try {
      const res = await sendChat({ message: userMessage.content, history: messages.slice(-5) })
      if (res && res.status === 'ok') {
        setMessages(prev => [...prev, { role: 'assistant', content: res.reply }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to the network right now. Try returning/recycling products to save carbon!" }])
      }
    } catch (err) {
      console.error('AI chat failed:', err)
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. How else can I help you today?" }])
    } finally {
      setSending(false)
    }
  }

  const tips = [
    {
      title: "Check Sizing Charts Carefully",
      description: "Clothing size mismatches represent 25% of all returns. Checking brand-specific sizing measurements before purchasing saves carbon shipping waste."
    },
    {
      title: "Opt for Certified Renewed Electronics",
      description: "Renewed products use up to 85% less mineral resources and save substantial carbon footprints compared to manufacturing brand-new products."
    },
    {
      title: "Earn 1.5x Credits on Local Drop-off",
      description: "Selecting a local drop-off center instead of home pick-up cuts down parcel collection routing, earning you extra Green Credits."
    }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Sparkles size={28} style={{ color: '#22d3ee' }} />
        <h1 style={{ fontSize: '28px', fontWeight: '800' }}>For You</h1>
      </div>

      {/* Grid: AI Chat & Tips */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '24px'
      }}>
        {/* EcoBot Advisor */}
        <div className="glass" style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          height: '480px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Brain size={20} style={{ color: '#6366f1' }} />
            <h2 style={{ fontSize: '18px', fontWeight: '700' }}>ReLoop AI Advisor</h2>
          </div>

          {/* Messages list */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            paddingRight: '6px',
            marginBottom: '16px'
          }}>
            {messages.map((m, i) => (
              <div 
                key={i} 
                style={{
                  alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                  background: m.role === 'user' ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.03)',
                  border: m.role === 'user' ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border)',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  maxWidth: '85%',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  color: m.role === 'user' ? '#ffffff' : 'var(--text)'
                }}
              >
                {m.content}
              </div>
            ))}
            {sending && (
              <div style={{
                alignSelf: 'flex-start',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border)',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '14px',
                color: 'var(--text-muted)'
              }}>
                Typing advice...
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask ReLoop AI advisor..."
              style={{
                flex: 1,
                background: 'rgba(0, 0, 0, 0.2)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: 'white',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button 
              type="submit"
              disabled={sending}
              style={{
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                color: 'white',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </div>

        {/* Sustainability Tips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lightbulb size={20} style={{ color: '#fbbf24' }} />
              AI Sustainability Tips
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {tips.map((t, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ color: '#22c55e', marginTop: '3px' }}>
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: '600' }}>{t.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px', lineHeight: '1.4' }}>
                      {t.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Environmental Carbon Meter */}
          <div className="glass" style={{
            padding: '24px',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid rgba(6, 182, 212, 0.2)'
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Leaf size={18} style={{ color: '#22d3ee' }} />
              Eco Rank: Green Advocate
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '8px', lineHeight: '1.4' }}>
              You are in the top 15% of sustainable returners in Bengaluru. Continue utilizing recommerce channels to upgrade your rank to Eco Champion!
            </p>
          </div>
        </div>
      </div>

      {/* Sustainable Choices Recommendations */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>Recommended Low-Return Products</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {products.length > 0 ? (
            products.map((p) => (
              <div 
                key={p.product_id}
                className="glass" 
                style={{ 
                  padding: '20px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '12px'
                }}
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '600' }}>
                      {p.brand}
                    </span>
                    <span style={{ 
                      fontSize: '11px', 
                      background: 'rgba(34, 197, 94, 0.15)', 
                      color: '#4ade80', 
                      padding: '2px 6px', 
                      borderRadius: '4px',
                      fontWeight: '600'
                    }}>
                      Return Rate: {p.return_rate_percent}%
                    </span>
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: '600', marginTop: '6px', height: '40px', overflow: 'hidden' }}>
                    {p.name}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                    <span style={{ fontSize: '18px', fontWeight: '700', color: '#4ade80' }}>
                      ₹{p.price_new.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
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
