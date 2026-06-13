import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, ShieldCheck, AlertTriangle, X, ShoppingCart, ArrowRight, ArrowLeftRight, Leaf } from "lucide-react";
import { mockProducts } from "../data/mockProducts";
import RenewedPassportDrawer from "../components/passport/RenewedPassportDrawer";
import GradeTag from "../components/shared/GradeTag";
import { useCart } from "../context/CartContext";

export default function ProductPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  // Default to Samsung Galaxy M34 5G if no ID or if ID matches
  const [selectedProductId, setSelectedProductId] = useState("prod_samsung_m34_001");
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  
  // Modal for checkout/cart warning verification
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // 'cart' or 'buy'

  // Mock Active User with Return History
  const currentUser = {
    user_id: "user_priya_001",
    name: "Priya Sharma",
    past_returns: [
      { product: "Nike Dri-FIT T-Shirt", category: "clothing", reason: "size mismatch" },
      { product: "Zara Formal Shirt", category: "clothing", reason: "color different from photo" },
      { product: "Boat Airdopes 141", category: "electronics", reason: "sound quality poor" },
    ],
  };

  const product = mockProducts.find((p) => p.product_id === selectedProductId) || mockProducts[0];

  // Nudge logic
  // 1. Size nudge: product.return_rate_percent > 28
  const showSizeNudge = product.return_rate_percent > 28;
  
  // 2. History nudge: user has 2+ returns in category
  const categoryReturns = currentUser.past_returns.filter((r) => r.category === product.category);
  const showHistoryNudge = categoryReturns.length >= 2;

  const handleActionClick = (actionType) => {
    if (showSizeNudge || showHistoryNudge) {
      setPendingAction(actionType);
      setWarningModalOpen(true);
    } else {
      executeAction(actionType);
    }
  };

  const executeAction = (actionType) => {
    if (actionType === "cart") {
      addToCart(product);
      alert(`"${product.name}" added to your cart!`);
    } else if (actionType === "buy") {
      addToCart(product);
      // Automatically trigger buying/checkout behavior
      alert("Redirecting to Checkout with this product!");
    }
    setWarningModalOpen(false);
    setPendingAction(null);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen p-4 md:p-6 space-y-6">
      {/* Product Selector for Testing Nudges */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Demo Sandbox</span>
          <h3 className="text-sm font-semibold text-slate-300 mt-0.5">Switch products to preview different rule-based return nudges:</h3>
        </div>
        <div className="flex gap-2">
          {mockProducts.map((p) => (
            <button
              key={p.product_id}
              onClick={() => {
                setSelectedProductId(p.product_id);
                setWarningModalOpen(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                selectedProductId === p.product_id
                  ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-950"
                  : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200"
              }`}
            >
              {p.brand} ({p.category})
            </button>
          ))}
        </div>
      </div>

      {/* Main Amazon PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Product Images */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 flex items-center justify-center min-h-[400px] overflow-hidden group relative">
            <img
              src={product.image_url}
              alt={product.name}
              className="max-h-[350px] object-contain rounded-lg transition-transform duration-500 group-hover:scale-105"
            />
            
            {/* Overlay Sustainability Highlight */}
            <div className="absolute top-4 left-4 bg-emerald-950/80 backdrop-blur border border-emerald-800/40 text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow">
              <Leaf size={14} />
              <span>Carbon footprint: {product.carbon_footprint_kg} kg CO₂e</span>
            </div>
          </div>
          
          {/* Thumbnails placeholder */}
          <div className="flex gap-2 justify-center">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className="w-20 h-20 bg-slate-900 border border-slate-850 rounded-lg p-2 flex items-center justify-center cursor-pointer hover:border-slate-600 transition-colors"
              >
                <img
                  src={product.image_url}
                  alt={`Thumbnail ${num}`}
                  className="max-h-full max-w-full object-contain opacity-75 hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Middle Column: Details */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">{product.brand}</span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400 font-medium capitalize">{product.category}</span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* ReLoop Verified Badge inline */}
            <div className="flex flex-wrap gap-2 mt-2 items-center">
              <button
                onClick={() => setIsPassportOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-950/40 text-teal-400 border border-teal-800/80 hover:bg-teal-900/30 hover:border-teal-700 transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <ShieldCheck size={14} className="text-teal-400 animate-pulse" />
                <span>ReLoop Verified</span>
              </button>

              {/* Star Rating */}
              <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-800/80 text-xs">
                <span className="flex text-amber-500">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      size={12}
                      fill={idx < Math.floor(product.rating) ? "currentColor" : "none"}
                      className="text-amber-500"
                    />
                  ))}
                </span>
                <span className="font-semibold text-slate-200">{product.rating}</span>
                <span className="text-slate-500">({product.reviews_count} reviews)</span>
              </div>
            </div>
          </div>

          <hr className="border-slate-800/80" />

          {/* Pricing */}
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Amazon Price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-100">
                ₹{product.price_new.toLocaleString()}
              </span>
              <span className="text-xs text-green-400 font-semibold bg-green-950/30 border border-green-900/50 px-2 py-0.5 rounded">
                Free Delivery
              </span>
            </div>
            <p className="text-xs text-slate-500">Inclusive of all taxes</p>
          </div>

          <hr className="border-slate-800/80" />

          {/* Bullet specifications */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-300">About this item</h3>
            <ul className="list-disc list-outside pl-4 space-y-2 text-xs text-slate-300">
              <li>{product.description}</li>
              <li>Engineered with top tier components and sustainable packaging to reduce waste.</li>
              <li>Includes standard manufacturer warranty of 1 year.</li>
              <li>Circular economy ready: Eligible for P2P trade, recycling, and donation through ReLoop circular routes.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Buying Box */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="space-y-1">
              <span className="text-slate-200 font-bold text-lg">₹{product.price_new.toLocaleString()}</span>
              <p className="text-xs text-slate-400">Delivery Wednesday, June 17. Order within 12 hrs 3 mins.</p>
            </div>

            <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
              <span>In Stock</span>
            </div>

            <div className="space-y-2 pt-2">
              <button 
                onClick={() => handleActionClick("cart")}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow cursor-pointer active:scale-98"
              >
                Add to Cart
              </button>
              <button 
                onClick={() => handleActionClick("buy")}
                className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-sm transition-all shadow cursor-pointer active:scale-98"
              >
                Buy Now
              </button>
            </div>

            <div className="border-t border-slate-800/80 my-3 pt-3 text-xs text-slate-400">
              <div className="flex justify-between py-1">
                <span>Ships from</span>
                <span className="text-slate-200">Amazon.in</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Sold by</span>
                <span className="text-slate-200">{product.brand} Direct</span>
              </div>
            </div>

            <hr className="border-slate-800/80" />

            {/* Return This Item Button */}
            <div className="space-y-2">
              <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p className="font-semibold text-slate-300">Need to return this item?</p>
                <p>ReLoop handles your returns sustainably. Earn green credits and reduce CO₂.</p>
              </div>
              <button
                onClick={() => navigate(`/return/${product.product_id}`)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-all border border-slate-700/80 flex items-center justify-center gap-1.5 cursor-pointer hover:text-white"
              >
                <ArrowLeftRight size={14} />
                <span>Return This Item</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Return Nudge Alert Warning Modal */}
      {warningModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-850 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5 relative animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
              <span className="p-2 bg-amber-500/20 text-amber-400 rounded-lg">
                <AlertTriangle size={24} />
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-100">⚠️ ReLoop Insight & Warnings</h3>
                <p className="text-xs text-slate-400">Please review sustainability recommendations before buying.</p>
              </div>
            </div>

            {/* Warnings Container */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {showSizeNudge && (
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-200 p-4 rounded-xl space-y-2">
                  <div className="font-bold text-amber-400 text-xs uppercase tracking-wide">High Category Return Alert</div>
                  <p className="text-xs leading-relaxed text-slate-300">
                    This item has a high return rate of <strong>{product.return_rate_percent}%</strong> (exceeding our 28% quality threshold), primarily due to size mismatches. We highly recommend consulting the detailed brand sizing chart and customer reviews before adding it.
                  </p>
                </div>
              )}

              {showHistoryNudge && (
                <div className="bg-amber-500/10 border border-amber-500/20 text-amber-200 p-4 rounded-xl space-y-2">
                  <div className="font-bold text-amber-400 text-xs uppercase tracking-wide">Category History Alert</div>
                  <p className="text-xs leading-relaxed text-slate-300">
                    You have returned <strong>{categoryReturns.length}</strong> items in the <strong>{product.category}</strong> category recently (e.g. <em>{categoryReturns.map(r => r.product).join(", ")}</em>). To support our zero-waste initiative, please double check fit guidelines and descriptions.
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setWarningModalOpen(false);
                  setPendingAction(null);
                }}
                className="flex-1 py-3 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Go Back / Review Details
              </button>
              <button
                onClick={() => executeAction(pendingAction)}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
              >
                Proceed & Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RenewedPassportDrawer */}
      <RenewedPassportDrawer
        productId={product.product_id}
        isOpen={isPassportOpen}
        onClose={() => setIsPassportOpen(false)}
      />
    </div>
  );
}
