import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts } from '../api/reloop'

export default function Home() {
  const navigate = useNavigate()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const prodData = await getProducts()
        if (prodData && prodData.status === 'ok') {
          setFeaturedProducts(prodData.products)
        }
      } catch (e) {
        console.error('Error loading home products:', e)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const categories = [
    {
      title: "Appliances for your home | Up to 55% off",
      items: [
        { name: "Air conditioners", img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=300&auto=format&fit=crop" },
        { name: "Refrigerators", img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=300&auto=format&fit=crop" },
        { name: "Microwaves", img: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?q=80&w=300&auto=format&fit=crop" },
        { name: "Washing machines", img: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=300&auto=format&fit=crop" }
      ]
    },
    {
      title: "Revamp your home in style",
      items: [
        { name: "Cushions & sheets", img: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=300&auto=format&fit=crop" },
        { name: "Figurines, vases", img: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=300&auto=format&fit=crop" },
        { name: "Home storage", img: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=300&auto=format&fit=crop" },
        { name: "Lighting solutions", img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=300&auto=format&fit=crop" }
      ]
    },
    {
      title: "Starting ₹49 | Deals on home essentials",
      items: [
        { name: "Cleaning supplies", img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=300&auto=format&fit=crop" },
        { name: "Bathroom accessories", img: "https://images.unsplash.com/photo-1604014237800-1c9102c219da?q=80&w=300&auto=format&fit=crop" },
        { name: "Home tools", img: "/reloop-tools.png" },
        { name: "Wallpapers", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop" }
      ]
    },
    {
      title: "Up to 75% off | Deals on headphones",
      items: [
        { name: "Wireless Earbuds", img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=300&auto=format&fit=crop" },
        { name: "Over-Ear ANC", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop" },
        { name: "Neckbands", img: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?q=80&w=300&auto=format&fit=crop" },
        { name: "Gaming Headsets", img: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=300&auto=format&fit=crop" }
      ]
    }
  ]

  return (
    <div style={{ background: '#eaeded', minHeight: '100vh', paddingBottom: '40px', color: '#111111' }}>
      {/* Banner / Hero Slider Area */}
      <div style={{ width: '100%', position: 'relative', overflow: 'hidden', height: '350px' }}>
        <img 
          src="https://images.unsplash.com/photo-1511556532299-8f662fc26c06?q=80&w=1500&auto=format&fit=crop" 
          alt="Amazon Eco banner" 
          style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}
        />
        {/* Shadow Mask */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '150px',
          background: 'linear-gradient(to top, #eaeded 0%, rgba(234,237,237,0) 100%)'
        }} />
        
        {/* Banner text overlay */}
        <div style={{ position: 'absolute', bottom: '120px', left: '40px', zIndex: 10 }}>
          <h1 style={{ fontSize: '32px', fontWeight: '800', color: 'white', textShadow: '2px 2px 8px rgba(0,0,0,0.6)' }}>
            Remote control cars & more <br /> Under ₹999
          </h1>
          <p style={{ color: 'white', marginTop: '8px', fontWeight: '600', textShadow: '1px 1px 4px rgba(0,0,0,0.6)' }}>
            Fast Delivery • Wide Selection • 5% Unlimited Cashback
          </p>
        </div>
      </div>

      {/* Grid of Card Widgets */}
      <div style={{
        maxWidth: '1480px',
        margin: '-80px auto 0 auto',
        position: 'relative',
        zIndex: 20,
        padding: '0 20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {categories.map((cat, i) => (
          <div key={i} style={{ background: 'white', padding: '20px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', justifySelf: 'stretch' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '14px', color: '#0f1111' }}>{cat.title}</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', flex: 1 }}>
              {cat.items.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => navigate('/products')}
                  style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '4px' }}
                >
                  <div style={{ height: '100px', background: '#f8f8f8', borderRadius: '4px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center' }}>
                    <img src={item.img} alt={item.name} style={{ maxHeight: '90%', maxWidth: '90%', objectFit: 'contain' }} />
                  </div>
                  <span style={{ fontSize: '11px', color: '#0f1111', fontWeight: '500', height: '28px', overflow: 'hidden' }}>{item.name}</span>
                </div>
              ))}
            </div>

            <span 
              onClick={() => navigate('/products')}
              style={{ color: '#007185', fontSize: '12px', fontWeight: '600', marginTop: '16px', display: 'inline-block', cursor: 'pointer' }}
              onMouseOver={e => e.currentTarget.style.color = '#c7511f'}
              onMouseOut={e => e.currentTarget.style.color = '#007185'}
            >
              See more deals
            </span>
          </div>
        ))}
      </div>

      {/* Recommended Products Showcase Belt */}
      <div style={{ maxWidth: '1480px', margin: '30px auto 0 auto', padding: '0 20px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>Explore ReLoop Certified Deals</h3>
          <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '10px' }}>
            {loading ? (
              [1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{ minWidth: '180px', height: '220px', background: '#f8f8f8', borderRadius: '4px' }} />
              ))
            ) : (
              featuredProducts.map((prod) => (
                <div 
                  key={prod.product_id}
                  onClick={() => navigate(`/products`)}
                  style={{
                    minWidth: '180px',
                    width: '180px',
                    cursor: 'pointer',
                    background: '#fcfcfc',
                    padding: '12px',
                    borderRadius: '6px',
                    border: '1px solid #e7e7e7',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={prod.image_url} alt={prod.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#b12704' }}>₹{prod.price_new.toLocaleString()}</span>
                    <p style={{ fontSize: '11px', color: '#565959', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>{prod.name}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
