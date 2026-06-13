import { useState, useEffect } from 'react'
import { Sparkles, Brain, Lightbulb, Send, CheckCircle2, Leaf } from 'lucide-react'
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
          setProducts(res.products.filter(p => p.return_rate_percent < 20.0))
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
    <div style={{ background: '#eaeded', minHeight: '100vh', padding: '24px', color: '#111111', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={24} style={{ color: '#ff9900' }} />
          <h1 style={{ fontSize: '24px', fontWeight: '500', color: '#111111' }}>Recommendations for You</h1>
        </div>

        {/* Grid: AI Chat & Tips */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '20px'
        }}>
          {/* EcoBot Advisor */}
          <div style={{
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            height: '480px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
              <Brain size={20} style={{ color: '#ff9900' }} />
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#111111' }}>ReLoop AI Advisor</h2>
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
                    background: m.role === 'user' ? '#ecf3fc' : '#f6f6f6',
                    border: m.role === 'user' ? '1px solid #c8e1fc' : '1px solid #e7e7e7',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    maxWidth: '85%',
                    fontSize: '13px',
                    lineHeight: '1.4',
                    color: '#111111'
                  }}
                >
                  {m.content}
                </div>
              ))}
              {sending && (
                <div style={{
                  alignSelf: 'flex-start',
                  background: '#f6f6f6',
                  border: '1px solid #e7e7e7',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: '#565959'
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
                  background: 'white',
                  border: '1px solid #bbb',
                  borderRadius: '4px',
                  padding: '10px 14px',
                  color: '#111111',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
              <button 
                type="submit"
                disabled={sending}
                style={{
                  background: 'linear-gradient(to bottom, #f7dfa5, #f0c14b)',
                  border: '1px solid #a88734',
                  color: '#111111',
                  padding: '10px 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Send size={14} />
              </button>
            </form>
          </div>

          {/* Sustainability Tips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '24px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                <Lightbulb size={20} style={{ color: '#ff9900' }} />
                AI Sustainability Tips
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {tips.map((t, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ color: '#137333', marginTop: '3px' }}>
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '13px', fontWeight: '750', color: '#111111' }}>{t.title}</h3>
                      <p style={{ color: '#565959', fontSize: '12px', marginTop: '4px', lineHeight: '1.4' }}>
                        {t.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Environmental Carbon Meter */}
            <div style={{
              padding: '24px',
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px'
            }}>
              <h2 style={{ fontSize: '15px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', color: '#111' }}>
                <Leaf size={16} style={{ color: '#137333' }} />
                Eco Rank: Green Advocate
              </h2>
              <p style={{ color: '#565959', fontSize: '12px', marginTop: '8px', lineHeight: '1.4' }}>
                You are in the top 15% of sustainable returners in Bengaluru. Continue utilizing recommerce channels to upgrade your rank to Eco Champion!
              </p>
            </div>
          </div>
        </div>

        {/* Sustainable Choices Recommendations */}
        <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Recommended Low-Return Products</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px'
          }}>
            {products.length > 0 ? (
              products.map((p) => (
                <div 
                  key={p.product_id}
                  style={{ 
                    background: '#fcfcfc',
                    border: '1px solid #eee',
                    borderRadius: '6px',
                    padding: '16px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '12px'
                  }}
                >
                  <div style={{ 
                    height: '160px', 
                    borderRadius: '4px', 
                    background: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    <img 
                      src={p.image_url} 
                      alt={p.name} 
                      style={{ maxHeight: '95%', maxWidth: '95%', objectFit: 'contain' }} 
                    />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', color: '#565959', textTransform: 'uppercase', fontWeight: 'bold' }}>
                        {p.brand}
                      </span>
                      <span style={{ 
                        fontSize: '10px', 
                        background: '#e6f4ea', 
                        color: '#137333', 
                        padding: '2px 6px', 
                        borderRadius: '4px',
                        fontWeight: 'bold'
                      }}>
                        Return Rate: {p.return_rate_percent}%
                      </span>
                    </div>
                    <h3 style={{ fontSize: '14px', fontWeight: '600', marginTop: '6px', height: '40px', overflow: 'hidden', color: '#111' }}>
                      {p.name}
                    </h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                      <span style={{ fontSize: '16px', fontWeight: '800', color: '#B12704' }}>
                        ₹{p.price_new.toLocaleString()}
                      </span>
                      <span style={{ fontSize: '11px', color: '#565959' }}>
                        -{p.carbon_footprint_kg} kg CO₂
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              [1, 2, 3].map((i) => (
                <div key={i} style={{ height: '220px', borderRadius: '8px', background: '#f6f6f6' }} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
