import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AlertTriangle, Recycle, Lightbulb, ShieldCheck, ChevronRight } from "lucide-react";
import { getPreventionNudge } from "../api/reloop";
import { useCart } from "../context/CartContext";
import { useProducts } from "../hooks/useProducts";
import { Button, Card, Badge, Modal, StarRating } from "../components/ui";

const USER_ID = "user_priya_001";

export default function ProductPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { products, loading } = useProducts();

  const query = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";

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
      setNudgeLoading(true);
      const reason = prod.common_return_reasons?.[0] || "general issue";
      const res = await getPreventionNudge(USER_ID, prod.product_id, reason);
      setNudgeLoading(false);

      if (res && res.should_prevent) {
        setNudgeModal({ nudge: res, pendingAction: actionType, product: prod });
        return;
      }
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
    <div className="bg-[#F7F8FA] min-h-screen p-4 md:p-6 text-[#111111] font-sans relative">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 bg-[#FF9900] text-[#111111] px-6 py-3 rounded-lg font-bold shadow-lg z-[2000] animate-slide-up">
          {toastMessage}
        </div>
      )}

      {/* Search results info */}
      <Card className="py-2.5 px-4 mb-4 text-sm shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <span>
          {loading ? "Loading products..." : `1–${filteredProducts.length} of ${filteredProducts.length} results`}
          {query && <> for "<strong className="text-[#C7511F]">{query}</strong>"</>}
        </span>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-5 items-start">
        {/* Left Filter Panel */}
        <Card className="p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] text-xs space-y-4">
          <div>
            <h4 className="font-bold text-[#565959] uppercase tracking-wide mb-2">Eligible for Free Shipping</h4>
            <label className="flex items-center gap-1.5 cursor-pointer text-[#565959]">
              <input type="checkbox" defaultChecked className="accent-[#FF9900]" /> Free Shipping
            </label>
          </div>

          <hr className="border-[#E7E7E7]" />

          <div>
            <h4 className="font-bold text-[#565959] uppercase tracking-wide mb-2">ReLoop Category</h4>
            <ul className="space-y-1.5">
              {["All ReLoop Stores", "Electronics", "Clothing", "Books", "Appliances"].map((cat) => (
                <li
                  key={cat}
                  className={`cursor-pointer ${cat === "All ReLoop Stores" ? "font-bold text-[#007185]" : "text-[#565959] pl-2 hover:text-[#C7511F]"}`}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>

          <hr className="border-[#E7E7E7]" />

          <div>
            <h4 className="font-bold text-[#565959] uppercase tracking-wide mb-2">Customer Reviews</h4>
            <span className="text-[#FF9900] cursor-pointer font-medium hover:text-[#C7511F]">⭐⭐⭐⭐ & Up</span>
          </div>
        </Card>

        {/* Right Product List */}
        <div className="flex flex-col gap-4">
          {loading ? (
            [1, 2, 3].map((i) => (
              <Card key={i} className="h-[200px] opacity-60 animate-pulse bg-white border border-[#E7E7E7]" />
            ))
          ) : filteredProducts.length === 0 ? (
            <Card className="p-10 text-center">
              <h3 className="text-lg font-bold">No results matching your query.</h3>
              <p className="text-[#565959] mt-1.5 text-xs">Try exploring categories on the Home page.</p>
            </Card>
          ) : (
            filteredProducts.map((prod) => (
              <Card
                key={prod.product_id}
                padding="none"
                className="bg-white border-b border-[#E7E7E7] p-6 grid grid-cols-1 md:grid-cols-[180px_1fr_200px] gap-5 relative overflow-hidden"
              >
                {/* Image */}
                <div
                  onClick={() => setSelectedProduct(prod)}
                  className="cursor-pointer w-full md:w-[180px] h-[180px] bg-white rounded-lg border border-[#E7E7E7] flex items-center justify-center p-2 mx-auto"
                >
                  <img src={prod.image_url} alt={prod.name} className="max-h-[95%] max-w-[95%] object-contain rounded-md" />
                </div>

                {/* Details */}
                <div className="flex flex-col justify-between text-left">
                  <div>
                    <h3
                      onClick={() => setSelectedProduct(prod)}
                      className="text-base font-semibold text-[#111111] cursor-pointer leading-snug hover:text-[#C7511F] transition-colors"
                    >
                      {prod.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-[#565959]">
                      <StarRating rating={prod.rating || 4.2} count={prod.reviews_count} />
                    </div>
                    <div className="mt-3.5 flex flex-wrap gap-2">
                      <Badge variant="success">ReLoop Verified</Badge>
                      <Badge variant="success">Carbon: {prod.carbon_footprint_kg} kg CO₂</Badge>
                      <Badge variant="success">Return Rate: {prod.return_rate_percent}%</Badge>
                    </div>
                    <p className="text-xs text-[#565959] mt-3 leading-relaxed">{prod.description}</p>
                  </div>

                  {/* Return This Item CTA */}
                  <Button
                    onClick={() => handleActionClick("return", prod)}
                    disabled={nudgeLoading}
                    variant="secondary"
                    icon={<Recycle size={14} />}
                    className="mt-3 self-start !h-[36px] !px-4 !border-[#067D62] !text-[#067D62] hover:!bg-[#F0FFF4] font-bold"
                  >
                    Return This Item
                  </Button>
                </div>

                {/* Pricing Column */}
                <div className="md:border-l border-[#E7E7E7] md:pl-5 flex flex-col justify-between items-end gap-4">
                  <div className="text-right">
                    <span className="text-2xl font-bold text-[#B12704]">
                      {Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(prod.price_new)}
                    </span>
                    <p className="text-xs text-[#565959] mt-1">
                      FREE delivery <strong className="text-[#111111]">Mon, 16 Jun</strong>
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 w-full md:w-[160px]">
                    <Button
                      onClick={() => handleActionClick("cart", prod)}
                      variant="primary"
                      className="w-full"
                    >
                      Add to cart
                    </Button>
                    <Button
                      onClick={() => handleActionClick("buy", prod)}
                      variant="primary"
                      className="w-full !bg-[#FFA41C] !border-[#FFA41C]"
                    >
                      Buy Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <Modal
          open={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          title="Product Details"
          maxWidth="900px"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mt-3">
            <div className="flex flex-col items-center gap-3">
              <div className="h-[350px] w-full display-flex items-center justify-center bg-[#f9f9f9] rounded-lg border border-slate-100 flex p-4">
                <img
                  src={selectedProduct.activeImage || selectedProduct.image_url}
                  alt={selectedProduct.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              {selectedProduct.images?.length > 0 && (
                <div className="flex gap-2 justify-center flex-wrap">
                  {selectedProduct.images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedProduct({ ...selectedProduct, activeImage: img })}
                      className={`w-12 h-12 border rounded cursor-pointer flex items-center justify-center p-1 bg-white
                        ${(selectedProduct.activeImage || selectedProduct.image_url) === img ? "border-[#e77600] border-2" : "border-[#ddd]"}`}
                    >
                      <img src={img} alt="" className="max-w-full max-h-full object-contain" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs text-[#007185] font-bold">Brand: {selectedProduct.brand}</span>
                <h2 className="text-xl font-bold mt-1 text-[#0f1111]">{selectedProduct.name}</h2>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-[#565959]">
                  <StarRating rating={selectedProduct.rating || 4.2} count={selectedProduct.reviews_count} />
                </div>
                <hr className="border-[#eee] my-4" />
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm text-[#565959]">Price:</span>
                  <span className="text-3xl font-extrabold text-[#B12704]">
                    {Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(selectedProduct.price_new)}
                  </span>
                </div>
                <Card className="mt-4 bg-[#F7F8FA] p-3 border border-[#E7E7E7] rounded-lg text-xs leading-relaxed space-y-1 shadow-none">
                  <span className="font-bold text-[#067D62] block">♻️ ReLoop Circular Economy</span>
                  <p className="text-[#565959]">
                    Carbon footprint: {selectedProduct.carbon_footprint_kg} kg CO₂. Return rate: {selectedProduct.return_rate_percent}%.
                    Choosing Renewed saves up to 85% of manufacturing emissions.
                  </p>
                </Card>
                {selectedProduct.category === "electronics" && (
                  <div
                    onClick={() => {
                      setSelectedProduct(null);
                      navigate(`/renewed/${selectedProduct.product_id}`);
                    }}
                    className="mt-4 bg-[#fff8f2] border border-[#FF9900] rounded-lg p-3 cursor-pointer flex justify-between items-center transition-all hover:bg-[#fffcf7]"
                  >
                    <div className="space-y-1">
                      <span className="text-[10px] bg-[#FF9900] text-[#111111] px-2 py-0.5 rounded font-bold uppercase">
                        Amazon Renewed
                      </span>
                      <p className="text-xs font-bold mt-1">Certified pre-owned available — save up to 45%</p>
                      <p className="text-[10px] text-[#565959]">
                        Saves {Math.round(selectedProduct.carbon_footprint_kg * 0.85)} kg CO₂ • 1-year brand warranty
                      </p>
                    </div>
                    <ChevronRight size={20} className="text-[#FF9900]" />
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <Button
                  onClick={() => handleActionClick("cart", selectedProduct)}
                  variant="primary"
                  className="flex-1"
                >
                  Add to Cart
                </Button>
                <Button
                  onClick={() => handleActionClick("return", selectedProduct)}
                  variant="secondary"
                  icon={<Recycle size={14} />}
                  className="flex-1 !border-[#067D62] !text-[#067D62] hover:!bg-[#F0FFF4] font-bold"
                >
                  Return
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Prevention Nudge Modal */}
      {nudgeModal && (
        <Modal
          open={!!nudgeModal}
          onClose={() => setNudgeModal(null)}
          title="ReLoop Return Prevention"
          maxWidth="520px"
        >
          <div className="space-y-5 text-left mt-2">
            <div className="flex items-center gap-2">
              <AlertTriangle size={20} className="text-[#D13212] shrink-0" />
              <p className="text-sm font-semibold text-[#111111]">Help us reduce carbon emissions from logistics.</p>
            </div>

            {nudgeModal.nudge ? (
              <>
                <p className="text-sm text-[#111111] leading-relaxed">
                  {nudgeModal.nudge.nudge_message}
                </p>
                {nudgeModal.nudge.quick_fixes?.length > 0 && (
                  <div className="bg-[#F0FFF4] border border-[#067D62] rounded-lg p-4 space-y-2.5">
                    <p className="text-xs font-bold text-[#067D62] flex items-center gap-1.5">
                      <Lightbulb size={14} /> QUICK FIXES TO TRY FIRST
                    </p>
                    <div className="space-y-1">
                      {nudgeModal.nudge.quick_fixes.map((fix, i) => (
                        <p key={i} className="text-xs text-gray-700 pl-2 border-l-2 border-[#067D62]">
                          ✓ {fix}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex gap-2 text-[10px] font-bold flex-wrap">
                  <Badge variant="success">🌱 CO₂ saved if kept: {nudgeModal.nudge.co2_cost_of_return_kg} kg</Badge>
                  <Badge variant="orange">+{nudgeModal.nudge.green_credits_if_kept} credits if you keep it</Badge>
                </div>
              </>
            ) : (
              <p className="text-sm text-[#565959] leading-relaxed">
                This item has a high return rate ({nudgeModal.product?.return_rate_percent}%) in your region. Consider verifying sizing and specifications before returning to save carbon emissions.
              </p>
            )}

            <div className="flex gap-3 pt-4 border-t border-[#E7E7E7]">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setNudgeModal(null)}
              >
                Keep the Item
              </Button>
              <Button
                variant="primary"
                fullWidth
                onClick={() => executeAction(nudgeModal.pendingAction, nudgeModal.product)}
              >
                Proceed to Return
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
