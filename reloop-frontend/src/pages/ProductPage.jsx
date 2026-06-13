import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Star, ShieldCheck, Heart, AlertTriangle } from "lucide-react";
import { mockProducts } from "../data/mockProducts";
import { useCart } from "../context/CartContext";

export default function ProductPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const query = searchParams.get("q") || "";
  
  // Filter products based on search query
  const filteredProducts = mockProducts.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.brand.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  // Default state for detail view popup (Item Page Simulation)
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // 'cart' or 'buy'

  // User return profile matching context
  const currentUser = {
    past_returns: [
      { product: "Nike Dri-FIT T-Shirt", category: "clothing", reason: "size mismatch" },
      { product: "Zara Formal Shirt", category: "clothing", reason: "color different from photo" }
    ]
  };

  const handleActionClick = (actionType, prod) => {
    const showSizeNudge = prod.return_rate_percent > 28;
    const categoryReturns = currentUser.past_returns.filter(r => r.category === prod.category);
    const showHistoryNudge = categoryReturns.length >= 2;

    if (showSizeNudge || showHistoryNudge) {
      setPendingAction({ type: actionType, product: prod });
      setWarningModalOpen(true);
    } else {
      executeAction(actionType, prod);
    }
  };

  const executeAction = (actionType, prod) => {
    if (actionType === "cart") {
      addToCart(prod);
      alert(`"${prod.name}" added to cart!`);
    } else if (actionType === "buy") {
      addToCart(prod);
      alert(`Proceeding to checkout with "${prod.name}"!`);
    }
    setWarningModalOpen(false);
    setPendingAction(null);
  };

  return (
    <div style={{ background: '#eaeded', minHeight: '100vh', padding: '16px 24px', color: '#111111', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Search results banner info */}
      <div style={{ background: 'white', padding: '10px 16px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '16px', fontSize: '14px' }}>
        <span>1-16 of {filteredProducts.length} results {query && <span>for "<strong style={{ color: '#c7511f' }}>{query}</strong>"</span>}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '20px', alignItems: 'start' }}>
        
        {/* Left Filters Panel */}
        <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '4px', padding: '16px', fontSize: '13px' }}>
          <h4 style={{ fontWeight: '700', marginBottom: '8px' }}>Eligible for Free Shipping</h4>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#565959' }}>
            <input type="checkbox" defaultChecked /> Free Shipping
          </label>
          
          <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '14px 0' }} />

          <h4 style={{ fontWeight: '700', marginBottom: '8px' }}>ReLoop Category</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <li style={{ color: '#007185', cursor: 'pointer', fontWeight: 'bold' }}>All ReLoop Stores</li>
            <li style={{ color: '#565959', paddingLeft: '8px', cursor: 'pointer' }}>Cleaning Supplies</li>
            <li style={{ color: '#565959', paddingLeft: '8px', cursor: 'pointer' }}>Home & Kitchen</li>
            <li style={{ color: '#565959', paddingLeft: '8px', cursor: 'pointer' }}>Electronics</li>
          </ul>

          <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '14px 0' }} />
          
          <h4 style={{ fontWeight: '700', marginBottom: '8px' }}>Customer Reviews</h4>
          <span style={{ color: '#ff9900', cursor: 'pointer' }}>⭐⭐⭐⭐ & Up</span>
        </div>

        {/* Right Product Listings (Results Page) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredProducts.length === 0 ? (
            <div style={{ background: 'white', padding: '40px', textAlign: 'center', border: '1px solid #ddd', borderRadius: '4px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '750' }}>No results matching your query.</h3>
              <p style={{ color: '#565959', marginTop: '6px', fontSize: '13px' }}>Try exploring categories on the Home page.</p>
            </div>
          ) : (
            filteredProducts.map((prod) => (
              <div 
                key={prod.product_id}
                style={{ 
                  background: 'white', 
                  border: '1px solid #ddd', 
                  borderRadius: '4px', 
                  padding: '16px', 
                  display: 'grid', 
                  gridTemplateColumns: '200px 1fr 240px', 
                  gap: '20px', 
                  position: 'relative'
                }}
              >
                {/* Product Image */}
                <div 
                  onClick={() => setSelectedProduct(prod)}
                  style={{ cursor: 'pointer', height: '180px', background: '#fcfcfc', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <img src={prod.image_url} alt={prod.name} style={{ maxHeight: '95%', maxWidth: '95%', objectFit: 'contain' }} />
                </div>

                {/* Details Column */}
                <div style={{ display: 'flex', flexDirection: 'column', justifySelf: 'stretch' }}>
                  <h3 
                    onClick={() => setSelectedProduct(prod)}
                    style={{ fontSize: '16px', fontWeight: '600', color: '#0f1111', cursor: 'pointer', lineHeight: '1.4' }}
                    onMouseOver={e => e.currentTarget.style.color = '#007185'}
                    onMouseOut={e => e.currentTarget.style.color = '#0f1111'}
                  >
                    {prod.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '13px', color: '#565959' }}>
                    <span style={{ color: '#ff9900' }}>⭐ {prod.rating}</span>
                    <span>({prod.reviews_count} ratings)</span>
                  </div>

                  {/* ReLoop sustainability stats */}
                  <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ fontSize: '11px', background: '#e6f4ea', color: '#137333', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                      ♻️ ReLoop Verified
                    </span>
                    <span style={{ fontSize: '11px', background: 'rgba(234, 179, 8, 0.1)', color: '#ca8a04', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>
                      Carbon Saved: {prod.carbon_footprint_kg} kg CO₂
                    </span>
                  </div>

                  <p style={{ fontSize: '12px', color: '#565959', marginTop: '12px', lineHeight: '1.5' }}>
                    {prod.description}
                  </p>
                </div>

                {/* Pricing & Buying Column */}
                <div style={{ borderLeft: '1px solid #eee', paddingLeft: '20px', display: 'flex', flexDirection: 'column', justifySelf: 'stretch', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                      <span style={{ fontSize: '24px', fontWeight: '800' }}>₹{prod.price_new.toLocaleString()}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#565959', marginTop: '4px' }}>FREE delivery <strong style={{ color: '#111' }}>Mon, 15 Jun</strong> on first order</p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button 
                      onClick={() => handleActionClick("cart", prod)}
                      style={{
                        padding: '10px',
                        background: '#ffd814',
                        border: '1px solid #fcd200',
                        borderRadius: '100px',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#0f1111',
                        cursor: 'pointer',
                        boxShadow: '0 2px 5px rgba(213,217,217,.5)'
                      }}
                    >
                      Add to cart
                    </button>
                    <button 
                      onClick={() => handleActionClick("buy", prod)}
                      style={{
                        padding: '10px',
                        background: '#ffa41c',
                        border: '1px solid #ff8f00',
                        borderRadius: '100px',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: 'white',
                        cursor: 'pointer',
                        boxShadow: '0 2px 5px rgba(213,217,217,.5)'
                      }}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Item Page Details View Popup Overlay */}
      {selectedProduct && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: 'white', width: '100%', maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '8px', padding: '24px', position: 'relative', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
            
            <button 
              onClick={() => setSelectedProduct(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#565959' }}
            >
              ✕
            </button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '12px' }}>
              {/* Left Column: Image */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9f9f9', width: '100%', borderRadius: '6px', border: '1px solid #eee' }}>
                  <img src={selectedProduct.image_url} alt={selectedProduct.name} style={{ maxHeight: '90%', maxWidth: '90%', objectFit: 'contain' }} />
                </div>
              </div>

              {/* Right Column: Spec details */}
              <div style={{ display: 'flex', flexDirection: 'column', justifySelf: 'stretch', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#007185', fontWeight: 'bold' }}>Brand: {selectedProduct.brand}</span>
                  <h2 style={{ fontSize: '22px', fontWeight: '700', marginTop: '6px', color: '#0f1111' }}>{selectedProduct.name}</h2>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px', fontSize: '13px', color: '#565959' }}>
                    <span style={{ color: '#ff9900' }}>⭐ {selectedProduct.rating}</span>
                    <span>({selectedProduct.reviews_count} customer reviews)</span>
                  </div>

                  <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '16px 0' }} />

                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontSize: '14px', color: '#565959' }}>Price:</span>
                    <span style={{ fontSize: '28px', fontWeight: '800', color: '#B12704' }}>₹{selectedProduct.price_new.toLocaleString()}</span>
                  </div>

                  <div style={{ marginTop: '16px', background: '#f7f7f7', padding: '12px', borderRadius: '6px', border: '1px solid #e7e7e7' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#137333', display: 'block' }}>♻️ ReLoop Lifecycle Assessment</span>
                    <p style={{ fontSize: '11px', color: '#565959', marginTop: '4px' }}>
                      Choosing this item avoids recycling loop delays and helps optimize parcel carbon routing offsets.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button 
                    onClick={() => handleActionClick("cart", selectedProduct)}
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
                    onClick={() => handleActionClick("buy", selectedProduct)}
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
          </div>
        </div>
      )}

      {/* Return Nudge Alert Warning Modal */}
      {warningModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', bg: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: 'white', width: '100%', maxWidth: '500px', borderRadius: '8px', padding: '24px', boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', items: 'center', gap: '12px', borderBottom: '1px solid #eee', paddingBottom: '12px', marginBottom: '16px' }}>
              <span style={{ color: '#d97706' }}><AlertTriangle size={28} /></span>
              <h3 style={{ fontSize: '16px', fontWeight: '800' }}>⚠️ ReLoop Purchase Alert</h3>
            </div>
            
            <p style={{ fontSize: '13px', color: '#565959', lineHeight: '1.6' }}>
              This item has a high return frequency in your region. Consider verifying exact category fit configurations before placing the order to save parcel routing carbon emissions.
            </p>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button 
                onClick={() => setWarningModalOpen(false)}
                style={{ flex: 1, padding: '10px', background: '#e7e7e7', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
              >
                Go Back
              </button>
              <button 
                onClick={() => executeAction(pendingAction.type, pendingAction.product)}
                style={{ flex: 1, padding: '10px', background: '#ffd814', border: '1px solid #fcd200', borderRadius: '4px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
              >
                Proceed Purchase
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
