import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Star, ShieldCheck, AlertTriangle, Recycle, X, ChevronRight, Lightbulb } from "lucide-react";
import { getProducts, getPreventionNudge } from "../api/reloop";
import { useCart } from "../context/CartContext";

const USER_ID = "user_priya_001";

export default function ProductPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const query = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";

  // Products from backend API
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProducts().then((res) => {
      if (res && res.status === "ok" && res.products?.length) {
        setProducts(res.products);
      }
    }).finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesQuery = !query ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      (p.brand || "").toLowerCase().includes(query.toLowerCase()) ||
      (p.category || "").toLowerCase().includes(query.toLowerCase());
      
    const matchesCategory = !categoryParam ||
      (p.category || "").toLowerCase() === categoryParam.toLowerCase();
      
    return matchesQuery && matchesCategory;
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Prevention nudge modal state
  const [nudgeModal, setNudgeModal] = useState(null); // { nudge, pendingAction, product }
  const [nudgeLoading, setNudgeLoading] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const executeAction = (actionType, prod) => {
    if (actionType === "cart") {
      addToCart(prod);
      showToast(`"${prod.name}" added to cart!`);
    } else if (actionType === "buy") {
      addToCart(prod);
      showToast(`Proceeding to checkout with "${prod.name}"!`);
    } else if (actionType === "return") {
      navigate(`/return/${prod.product_id}`);
    }
    setNudgeModal(null);
    setSelectedProduct(null);
  };

  const handleActionClick = async (actionType, prod) => {
    if (actionType === "return") {
      // Fetch prevention nudge from backend before sending to return flow
      setNudgeLoading(true);
      const reason = prod.common_return_reasons?.[0] || "general issue";
      const res = await getPreventionNudge(USER_ID, prod.product_id, reason);
      setNudgeLoading(false);

      if (res && res.should_prevent) {
        setNudgeModal({ nudge: res, pendingAction: actionType, product: prod });
        return;
      }
      // No nudge needed — go straight to return
      navigate(`/return/${prod.product_id}`);
      return;
    }

    const showSizeNudge = prod.return_rate_percent > 28;
    if (showSizeNudge) {
      setNudgeModal({ nudge: null, pendingAction: actionType, product: prod });
      return;
    }
    executeAction(actionType, prod);
  };

  return (
    <div style={{ background: "#F7F8FA", minHeight: "100vh", padding: "16px 24px", color: "#111111", fontFamily: "Arial, sans-serif", position: "relative" }}>

      {/* Toast */}
      {toastMessage && (
        <div style={{ position: "fixed", top: "80px", right: "24px", background: "#FF9900", color: "#111111", padding: "12px 24px", borderRadius: "8px", fontWeight: "bold", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 2000 }}>
          {toastMessage}
        </div>
      )}

      {/* Search results info */}
      <div style={{ background: "white", padding: "10px 16px", border: "1px solid #E7E7E7", borderRadius: "8px", marginBottom: "16px", fontSize: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <span>
          {loading ? "Loading products..." : `1–${filteredProducts.length} of ${filteredProducts.length} results`}
          {query && <> for "<strong style={{ color: "#C7511F" }}>{query}</strong>"</>}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "20px", alignItems: "start" }}>

        {/* Left Filter Panel */}
        <div style={{ background: "white", border: "1px solid #E7E7E7", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", fontSize: "13px" }}>
          <h4 style={{ fontSize: "13px", fontWeight: "700", color: "#565959", textTransform: "uppercase", marginBottom: "8px" }}>Eligible for Free Shipping</h4>
          <label style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", color: "#565959" }}>
            <input type="checkbox" defaultChecked style={{ accentColor: "#FF9900" }} /> Free Shipping
          </label>

          <hr style={{ border: "none", borderTop: "1px solid #E7E7E7", margin: "14px 0" }} />
          <h4 style={{ fontSize: "13px", fontWeight: "700", color: "#565959", textTransform: "uppercase", marginBottom: "8px" }}>ReLoop Category</h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "6px" }}>
            {["All ReLoop Stores", "Electronics", "Clothing", "Books", "Appliances"].map((cat) => (
              <li key={cat} style={{ color: cat === "All ReLoop Stores" ? "#007185" : "#565959", paddingLeft: cat === "All ReLoop Stores" ? 0 : "8px", cursor: "pointer", fontWeight: cat === "All ReLoop Stores" ? "bold" : "normal" }}>{cat}</li>
            ))}
          </ul>

          <hr style={{ border: "none", borderTop: "1px solid #E7E7E7", margin: "14px 0" }} />
          <h4 style={{ fontSize: "13px", fontWeight: "700", color: "#565959", textTransform: "uppercase", marginBottom: "8px" }}>Customer Reviews</h4>
          <span style={{ color: "#FF9900", cursor: "pointer" }}>⭐⭐⭐⭐ & Up</span>
        </div>

        {/* Right Product List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} style={{ height: "200px", background: "white", border: "1px solid #ddd", borderRadius: "4px", opacity: 0.6, animation: "pulse 1.5s infinite" }} />
            ))
          ) : filteredProducts.length === 0 ? (
            <div style={{ background: "white", padding: "40px", textAlign: "center", border: "1px solid #ddd", borderRadius: "4px" }}>
              <h3 style={{ fontSize: "18px", fontWeight: "750" }}>No results matching your query.</h3>
              <p style={{ color: "#565959", marginTop: "6px", fontSize: "13px" }}>Try exploring categories on the Home page.</p>
            </div>
          ) : (
            filteredProducts.map((prod) => (
              <div key={prod.product_id} style={{ background: "white", borderBottom: "1px solid #E7E7E7", padding: "24px", display: "grid", gridTemplateColumns: "180px 1fr 200px", gap: "20px", position: "relative" }}>

                {/* Image */}
                <div onClick={() => setSelectedProduct(prod)} style={{ cursor: "pointer", width: "180px", height: "180px", background: "white", borderRadius: "8px", border: "1px solid #E7E7E7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src={prod.image_url} alt={prod.name} style={{ maxHeight: "95%", maxWidth: "95%", objectFit: "contain" }} />
                </div>

                {/* Details */}
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <h3 onClick={() => setSelectedProduct(prod)} style={{ fontSize: "16px", fontWeight: "600", color: "#111111", cursor: "pointer", lineHeight: "1.4" }}
                      onMouseOver={(e) => (e.currentTarget.style.color = "#C7511F")} onMouseOut={(e) => (e.currentTarget.style.color = "#111111")}>
                      {prod.name}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px", fontSize: "13px", color: "#565959" }}>
                      <span style={{ color: "#ff9900" }}>⭐ {prod.rating || "4.2"}</span>
                      <span>({(prod.reviews_count || 0).toLocaleString()} ratings)</span>
                    </div>
                    <div style={{ marginTop: "14px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      <span style={{ fontSize: "11px", background: "#f0fff4", color: "#067D62", border: "1px solid #067D62", padding: "4px 8px", borderRadius: "20px", fontWeight: "bold" }}>ReLoop Verified</span>
                      <span style={{ fontSize: "11px", background: "#f0fff4", color: "#067D62", border: "1px solid #067D62", padding: "4px 8px", borderRadius: "20px", fontWeight: "bold" }}>
                        Carbon: {prod.carbon_footprint_kg} kg CO₂
                      </span>
                      <span style={{ fontSize: "11px", background: "#f0fff4", color: "#067D62", border: "1px solid #067D62", padding: "4px 8px", borderRadius: "20px", fontWeight: "bold" }}>
                        Return Rate: {prod.return_rate_percent}%
                      </span>
                    </div>
                    <p style={{ fontSize: "12px", color: "#565959", marginTop: "12px", lineHeight: "1.5" }}>{prod.description}</p>
                  </div>

                  {/* Return This Item CTA */}
                  <button
                    onClick={() => handleActionClick("return", prod)}
                    disabled={nudgeLoading}
                    style={{
                      marginTop: "12px",
                      alignSelf: "flex-start",
                      padding: "0 16px",
                      background: "white",
                      border: "1.5px solid #067D62",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "600",
                      color: "#067D62",
                      height: "36px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.15s"
                    }}
                    onMouseOver={e => e.currentTarget.style.background = '#F0FFF4'}
                    onMouseOut={e => e.currentTarget.style.background = 'white'}
                  >
                    <Recycle size={14} />
                    Return This Item
                  </button>
                </div>

                {/* Pricing Column */}
                <div style={{ borderLeft: "1px solid #E7E7E7", paddingLeft: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "24px", fontWeight: "700", color: "#B12704" }}>
                      {Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(prod.price_new)}
                    </span>
                    <p style={{ fontSize: "12px", color: "#565959", marginTop: "4px" }}>FREE delivery <strong style={{ color: "#111111" }}>Mon, 16 Jun</strong></p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "160px" }}>
                    <button
                      onClick={() => handleActionClick("cart", prod)}
                      style={{
                        width: "160px",
                        height: "44px",
                        background: "#FF9900",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#111111",
                        cursor: "pointer",
                        transition: "all 0.15s"
                      }}
                      onMouseOver={e => e.currentTarget.style.filter = 'brightness(0.92)'}
                      onMouseOut={e => e.currentTarget.style.filter = 'none'}
                    >
                      Add to cart
                    </button>
                    <button
                      onClick={() => handleActionClick("buy", prod)}
                      style={{
                        width: "160px",
                        height: "44px",
                        background: "#FFA41C",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#111111",
                        cursor: "pointer",
                        transition: "all 0.15s"
                      }}
                      onMouseOver={e => e.currentTarget.style.filter = 'brightness(0.92)'}
                      onMouseOut={e => e.currentTarget.style.filter = 'none'}
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

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "white", width: "100%", maxWidth: "1000px", maxHeight: "90vh", overflowY: "auto", borderRadius: "8px", padding: "24px", position: "relative", boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}>
            <button onClick={() => setSelectedProduct(null)} style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "#565959" }}>✕</button>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginTop: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                <div style={{ height: "350px", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9f9f9", width: "100%", borderRadius: "6px", border: "1px solid #eee" }}>
                  <img src={selectedProduct.activeImage || selectedProduct.image_url} alt={selectedProduct.name} style={{ maxHeight: "90%", maxWidth: "90%", objectFit: "contain" }} />
                </div>
                {selectedProduct.images?.length > 0 && (
                  <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                    {selectedProduct.images.map((img, idx) => (
                      <div key={idx} onClick={() => setSelectedProduct({ ...selectedProduct, activeImage: img })}
                        style={{ width: "50px", height: "50px", border: (selectedProduct.activeImage || selectedProduct.image_url) === img ? "2px solid #e77600" : "1px solid #ddd", borderRadius: "4px", overflow: "hidden", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", background: "white" }}>
                        <img src={img} alt="" style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain" }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <span style={{ fontSize: "12px", color: "#007185", fontWeight: "bold" }}>Brand: {selectedProduct.brand}</span>
                  <h2 style={{ fontSize: "22px", fontWeight: "700", marginTop: "6px", color: "#0f1111" }}>{selectedProduct.name}</h2>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px", fontSize: "13px", color: "#565959" }}>
                    <span style={{ color: "#ff9900" }}>⭐ {selectedProduct.rating || "4.2"}</span>
                    <span>({(selectedProduct.reviews_count || 0).toLocaleString()} customer reviews)</span>
                  </div>
                  <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "16px 0" }} />
                  <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                    <span style={{ fontSize: "14px", color: "#565959" }}>Price:</span>
                    <span style={{ fontSize: "28px", fontWeight: "800", color: "#B12704" }}>
                      {Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(selectedProduct.price_new)}
                    </span>
                  </div>
                  <div style={{ marginTop: "16px", background: "#F7F8FA", padding: "12px", borderRadius: "8px", border: "1px solid #E7E7E7" }}>
                    <span style={{ fontSize: "12px", fontWeight: "bold", color: "#067D62", display: "block" }}>♻️ ReLoop Circular Economy</span>
                    <p style={{ fontSize: "11px", color: "#565959", marginTop: "4px" }}>
                      Carbon footprint: {selectedProduct.carbon_footprint_kg} kg CO₂. Return rate: {selectedProduct.return_rate_percent}%.
                      Choosing Renewed saves up to 85% of manufacturing emissions.
                    </p>
                  </div>
                  {selectedProduct.category === "electronics" && (
                    <div onClick={() => { setSelectedProduct(null); navigate(`/renewed/${selectedProduct.product_id}`); }}
                      style={{ marginTop: "16px", background: "#fff8f2", border: "1px solid #FF9900", borderRadius: "8px", padding: "12px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span style={{ fontSize: "11px", background: "#FF9900", color: "#111111", padding: "2px 6px", borderRadius: "4px", fontWeight: "bold" }}>Amazon Renewed</span>
                        <p style={{ fontSize: "12px", fontWeight: "bold", marginTop: "6px" }}>Certified pre-owned available — save up to 45%</p>
                        <p style={{ fontSize: "11px", color: "#565959", marginTop: "2px" }}>Saves {Math.round(selectedProduct.carbon_footprint_kg * 0.85)} kg CO₂ • 1-year brand warranty</p>
                      </div>
                      <ChevronRight size={20} style={{ color: "#FF9900" }} />
                    </div>
                  )}
                </div>
                <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                  <button
                    onClick={() => handleActionClick("cart", selectedProduct)}
                    style={{
                      flex: 1,
                      height: "44px",
                      background: "#FF9900",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#111111",
                      cursor: "pointer",
                      transition: "all 0.15s"
                    }}
                    onMouseOver={e => e.currentTarget.style.filter = 'brightness(0.92)'}
                    onMouseOut={e => e.currentTarget.style.filter = 'none'}
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleActionClick("return", selectedProduct)}
                    style={{
                      flex: 1,
                      height: "44px",
                      background: "white",
                      border: "1.5px solid #067D62",
                      borderRadius: "8px",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#067D62",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      transition: "all 0.15s"
                    }}
                    onMouseOver={e => e.currentTarget.style.background = '#F0FFF4'}
                    onMouseOut={e => e.currentTarget.style.background = 'white'}
                  >
                    <Recycle size={14} /> Return
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prevention Nudge Modal (real backend data) */}
      {nudgeModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "white", width: "100%", maxWidth: "520px", borderRadius: "12px", padding: "32px", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", borderBottom: "1px solid #E7E7E7", paddingBottom: "16px", marginBottom: "20px", position: "relative" }}>
              <AlertTriangle size={24} style={{ color: "#D13212" }} />
              <h3 style={{ fontSize: "20px", fontWeight: "bold", color: "#111111" }}>ReLoop Return Prevention</h3>
              <button
                onClick={() => setNudgeModal(null)}
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#565959",
                  borderRadius: "8px"
                }}
                onMouseOver={e => e.currentTarget.style.background = '#F7F8FA'}
                onMouseOut={e => e.currentTarget.style.background = 'none'}
              >
                <X size={18} />
              </button>
            </div>

            {nudgeModal.nudge ? (
              <>
                <p style={{ fontSize: "14px", color: "#111111", lineHeight: "1.6", marginBottom: "16px" }}>
                  {nudgeModal.nudge.nudge_message}
                </p>
                {nudgeModal.nudge.quick_fixes?.length > 0 && (
                  <div style={{ background: "#F0FFF4", border: "1px solid #067D62", borderRadius: "8px", padding: "16px", marginBottom: "16px" }}>
                    <p style={{ fontSize: "12px", fontWeight: "bold", color: "#067D62", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
                      <Lightbulb size={14} /> QUICK FIXES TO TRY FIRST
                    </p>
                    {nudgeModal.nudge.quick_fixes.map((fix, i) => (
                      <p key={i} style={{ fontSize: "12px", color: "#374151", marginBottom: "6px", paddingLeft: "6px", borderLeft: "2px solid #067D62" }}>✓ {fix}</p>
                    ))}
                  </div>
                )}
                <div style={{ display: "flex", gap: "8px", fontSize: "12px", color: "#565959", marginBottom: "20px", flexWrap: "wrap" }}>
                  <span style={{ background: "#F0FFF4", color: "#067D62", padding: "3px 8px", borderRadius: "12px", fontWeight: "bold" }}>
                    🌱 CO₂ saved if kept: {nudgeModal.nudge.co2_cost_of_return_kg} kg
                  </span>
                  <span style={{ background: "#FEF3C7", color: "#D97706", padding: "3px 8px", borderRadius: "12px", fontWeight: "bold" }}>
                    +{nudgeModal.nudge.green_credits_if_kept} credits if you keep it
                  </span>
                </div>
              </>
            ) : (
              <p style={{ fontSize: "14px", color: "#565959", lineHeight: "1.6", marginBottom: "20px" }}>
                This item has a high return rate ({nudgeModal.product?.return_rate_percent}%) in your region. Consider verifying sizing and specifications before returning to save carbon emissions.
              </p>
            )}

            <div style={{ display: "flex", gap: "12px", justifyContent: "space-between" }}>
              <button
                onClick={() => setNudgeModal(null)}
                style={{
                  width: "45%",
                  height: "44px",
                  background: "white",
                  border: "1.5px solid #D5D9D9",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#111111",
                  cursor: "pointer",
                  transition: "all 0.15s"
                }}
                onMouseOver={e => e.currentTarget.style.filter = 'brightness(0.92)'}
                onMouseOut={e => e.currentTarget.style.filter = 'none'}
              >
                Keep the Item
              </button>
              <button
                onClick={() => executeAction(nudgeModal.pendingAction, nudgeModal.product)}
                style={{
                  width: "45%",
                  height: "44px",
                  background: "#FF9900",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#111111",
                  cursor: "pointer",
                  transition: "all 0.15s"
                }}
                onMouseOver={e => e.currentTarget.style.filter = 'brightness(0.92)'}
                onMouseOut={e => e.currentTarget.style.filter = 'none'}
              >
                Proceed to Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
