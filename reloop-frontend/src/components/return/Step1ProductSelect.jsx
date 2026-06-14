import React, { useEffect, useState } from "react";
import { useReturn } from "../../context/ReturnContext";
import { getProducts } from "../../api/reloop";
import { ArrowRight, Check } from "lucide-react";

export default function Step1ProductSelect({ preselectedId, onNext }) {
  const { returnDetails, updateReturn } = useReturn();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const res = await getProducts();
        if (res && res.status === "ok" && res.products) {
          setProducts(res.products);

          // If a product is preselected or set in context, ensure all metadata details are fully populated
          const targetId = preselectedId === "B09X7KQMGN" ? "prod_samsung_m34_001" : preselectedId;
          const currentId = returnDetails.productId || targetId;
          if (currentId) {
            const product = res.products.find((p) => p.product_id === currentId) || res.products[0];
            if (product && (!returnDetails.productId || !returnDetails.productName || !returnDetails.category)) {
              updateReturn({
                productId: product.product_id,
                productName: product.name,
                category: product.category,
              });
            }
          }
        }
      } catch (e) {
        console.error("Failed to load products in return wizard:", e);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [preselectedId, returnDetails.productId, returnDetails.productName, returnDetails.category, updateReturn]);

  const selectedProduct = products.find((p) => p.product_id === returnDetails.productId);

  const handleSelectProduct = (product) => {
    updateReturn({
      productId: product.product_id,
      productName: product.name,
      category: product.category,
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 space-y-3">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-400">Loading your eligible returns...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h2 className="text-xl font-bold text-slate-100">Which item would you like to return?</h2>
        <p className="text-xs text-slate-400">Select an item from your recent purchases below to initiate a circular return.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Product Cards */}
        <div className="md:col-span-7 space-y-3">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Recent Purchases</span>
          <div className="space-y-3">
            {products.map((p) => {
              const isSelected = returnDetails.productId === p.product_id;
              return (
                <div
                  key={p.product_id}
                  onClick={() => handleSelectProduct(p)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                    isSelected
                      ? "bg-indigo-950/20 border-indigo-500/80 shadow-md shadow-indigo-950/40"
                      : "bg-slate-900/40 border-slate-850 hover:bg-slate-900 hover:border-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-950 rounded-xl p-1.5 flex items-center justify-center border border-slate-850">
                      <img src={p.image_url} alt={p.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{p.name}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Purchased on Amazon • ₹{p.price_new.toLocaleString()}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <span className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white border border-indigo-400">
                      <Check size={12} strokeWidth={3} />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Preview Selected Specs */}
        <div className="md:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Item Overview</span>
          {selectedProduct ? (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 bg-slate-950 rounded-xl p-2 flex items-center justify-center border border-slate-850">
                  <img src={selectedProduct.image_url} alt={selectedProduct.name} className="max-h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">{selectedProduct.name}</h3>
                  <p className="text-xs text-indigo-400 font-semibold">{selectedProduct.brand}</p>
                </div>
              </div>
              <hr className="border-slate-800/80" />
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-850">
                  <span className="text-[9px] text-slate-500 uppercase font-bold block">Original Price</span>
                  <span className="font-bold text-slate-300 block mt-0.5">₹{selectedProduct.price_new.toLocaleString()}</span>
                </div>
                <div className="bg-slate-950/40 p-2.5 rounded-lg border border-slate-850">
                  <span className="text-[9px] text-slate-500 uppercase font-bold block">Carbon Footprint</span>
                  <span className="font-bold text-slate-300 block mt-0.5">{selectedProduct.carbon_footprint_kg} kg CO₂</span>
                </div>
              </div>
              <div className="space-y-1 bg-slate-950/30 p-3 rounded-xl border border-slate-850 text-xs">
                <span className="text-[9px] text-slate-500 uppercase font-bold">Standard Warranty</span>
                <p className="text-slate-300 leading-normal mt-0.5">1-Year Warranty active. Eligible for instant green credits upon circular circular routing.</p>
              </div>

              <button
                onClick={onNext}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer active:scale-98"
              >
                <span>Continue to Condition Check</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-slate-500">
              Select an item on the left to see details and continue.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
