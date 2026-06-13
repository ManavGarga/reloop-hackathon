import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ShieldCheck, Leaf, ArrowLeft, Heart, ChevronRight, X } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function AmazonRenewedPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const activeProductId = productId || "prod_samsung_m34_001";
  
  // State variables
  const [activeTab, setActiveTab] = useState("condition"); // condition or passport
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Mock product specific details for renewed listing
  const renewedItem = {
    original_id: "prod_samsung_m34_001",
    passport_id: "RLP-2026-X128A",
    name: "Samsung Galaxy M34 5G (Refurbished) - 6GB RAM, 128GB Storage, Silver",
    brand: "Samsung",
    price_renewed: 14500.0,
    price_new: 18999.0,
    discount_percent: 24,
    rating: 4.2,
    reviews_count: 124,
    grade: "Good",
    confidence: 89,
    flaws_count: 2,
    carbon_saved: 59.5,
    flaws: [
      { location: "Outer Bezel", type: "Hairline Scratch", length: "0.8 mm", severity: "Minor" },
      { location: "Rear Cover", type: "Faint Scuff", length: "1.2 mm", severity: "Minor" },
    ],
    image_url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=600&auto=format&fit=crop",
  };

  return (
    <div style={{ background: '#eaeded', minHeight: '100vh', padding: '24px', color: '#111111', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Toast message banner */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          background: '#06b6d4',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '4px',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 2000
        }}>
          {toastMessage}
        </div>
      )}

      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#565959' }}>
          <button 
            onClick={() => navigate("/products")}
            style={{ background: 'none', border: 'none', color: '#007185', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
          >
            ← Back to Marketplace
          </button>
          <ChevronRight size={12} />
          <span>Amazon Renewed Alternatives</span>
        </div>

        {/* PDP Main Product Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '24px' }}>
          
          {/* LEFT: Product Image */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#f9f9f9', padding: '20px', borderRadius: '6px', border: '1px solid #eee' }}>
            <img
              src={renewedItem.image_url}
              alt={renewedItem.name}
              style={{ maxHeight: '350px', maxWidth: '100%', objectFit: 'contain' }}
            />
          </div>

          {/* RIGHT: Product Details */}
          <div style={{ display: 'flex', flexDirection: 'column', justifySelf: 'stretch', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '11px', background: '#ff9900', color: 'white', padding: '3px 8px', borderRadius: '3px', fontWeight: 'bold', width: 'fit-content' }}>
                Amazon Renewed
              </span>
              <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#111' }}>
                {renewedItem.name}
              </h1>

              {/* Rating */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#565959' }}>
                <span style={{ color: '#ff9900' }}>⭐ {renewedItem.rating}</span>
                <span>({renewedItem.reviews_count} reviews)</span>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #eee' }} />

              {/* Pricing */}
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                  <span style={{ fontSize: '28px', fontWeight: '800', color: '#B12704' }}>
                    ₹{renewedItem.price_renewed.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '14px', color: '#565959', lineThrough: 'true', textDecoration: 'line-through' }}>
                    ₹{renewedItem.price_new.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '11px', background: '#e6f4ea', color: '#137333', padding: '2px 6px', borderRadius: '3px', fontWeight: 'bold' }}>
                    40% less than new
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#565959', marginTop: '4px' }}>Eligible for FREE Shipping & 1-Year Amazon Guarantee</p>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #eee' }} />

              {/* ReLoop Certified Information Banner */}
              <div style={{ background: '#f4fbf7', border: '1px solid #a8dab5', borderRadius: '6px', padding: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#137333', display: 'block' }}>♻️ ReLoop Certified — Grade Good</span>
                <p style={{ fontSize: '11px', color: '#565959', marginTop: '6px', lineHeight: '1.4' }}>
                  Quality Confidence: <strong>89%</strong> • Flaws Scan: <strong>2 minor bezel scuffs</strong>. Buying refurbished saves <strong>59.5 kg CO₂</strong> overall compared to new device manufacturing loops.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button 
                onClick={() => {
                  addToCart(renewedItem);
                  showToast(`"${renewedItem.name}" added to cart!`);
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#ffd814',
                  border: '1px solid #fcd200',
                  borderRadius: '100px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Add to Cart
              </button>
              <button 
                onClick={() => {
                  addToCart(renewedItem);
                  showToast(`Proceeding to checkout with "${renewedItem.name}"!`);
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#ffa41c',
                  border: '1px solid #ff8f00',
                  borderRadius: '100px',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: 'white',
                  cursor: 'pointer'
                }}
              >
                Buy Now
              </button>
            </div>

          </div>
        </div>

        {/* Condition details tab below */}
        <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '750', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>🔍 Detailed Condition report</h3>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f0f2f2', color: '#565959' }}>
                <th style={{ padding: '10px 16px' }}>Location</th>
                <th style={{ padding: '10px 16px' }}>Type</th>
                <th style={{ padding: '10px 16px' }}>Length</th>
                <th style={{ padding: '10px 16px' }}>Severity</th>
              </tr>
            </thead>
            <tbody>
              {renewedItem.flaws.map((flaw, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 'bold' }}>{flaw.location}</td>
                  <td style={{ padding: '12px 16px', color: '#565959' }}>{flaw.type}</td>
                  <td style={{ padding: '12px 16px' }}>{flaw.length}</td>
                  <td style={{ padding: '12px 16px', color: '#ca8a04', fontWeight: 'bold' }}>{flaw.severity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
