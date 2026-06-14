import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ReturnProvider, useReturn } from "../context/ReturnContext";
import { useUser } from "../context/UserContext";
import { useCart } from "../context/CartContext";
import ProgressBar from "../components/shared/ProgressBar";
import { CheckCircle2, ChevronRight, ArrowLeft, Package, Sparkles, Printer, Star, X, Check, Leaf } from "lucide-react";

// Import step components
import Step1ProductSelect from "../components/return/Step1ProductSelect";
import Step2ConditionCheck from "../components/return/Step2ConditionCheck";
import Step3ValueAssessment from "../components/return/Step3ValueAssessment";
import Step4DropoffSelect from "../components/return/Step4DropoffSelect";
import Step5ReLoopOptions from "../components/return/Step5ReLoopOptions";
import Step6Confirmation from "../components/return/Step6Confirmation";

function ReturnFlowContainer() {
  const { productId } = useParams();
  const { returnDetails, updateReturn, resetReturn } = useReturn();
  const currentStep = returnDetails.currentStep;
  const navigate = useNavigate();
  const [initialized, setInitialized] = useState(false);

  const targetId = productId === "B09X7KQMGN" ? "prod_samsung_m34_001" : productId;
  const isMismatched = returnDetails.productId !== targetId || returnDetails.currentStep === 6;

  useEffect(() => {
    if (productId) {
      if (isMismatched) {
        resetReturn();
        updateReturn({
          productId: targetId,
          currentStep: 1
        });
      }
      setInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNextStep = () => {
    updateReturn({ currentStep: currentStep + 1 });
  };

  const handleBackStep = () => {
    updateReturn({ currentStep: Math.max(1, currentStep - 1) });
  };

  const renderActiveStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1ProductSelect preselectedId={productId} onNext={handleNextStep} />;
      case 2:
        return <Step2ConditionCheck onNext={handleNextStep} onBack={handleBackStep} />;
      case 3:
        return <Step3ValueAssessment onNext={handleNextStep} />;
      case 4:
        return <Step4DropoffSelect onNext={handleNextStep} onBack={handleBackStep} />;
      case 5:
        return <Step5ReLoopOptions onNext={handleNextStep} onBack={handleBackStep} />;
      case 6:
        return <Step6Confirmation />;
      default:
        return <Step1ProductSelect preselectedId={productId} onNext={handleNextStep} />;
    }
  };

  if (isMismatched && !initialized) {
    return (
      <div style={{ background: '#090d16', minHeight: '100vh', padding: '32px 24px', color: '#f1f5f9', fontFamily: 'Inter, sans-serif', borderRadius: '12px' }}>
        <div className="min-h-screen flex flex-col items-center justify-center max-w-5xl mx-auto space-y-6">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-400">Initializing return wizard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F9FAFB] min-h-screen">
      <div className="w-full px-6 py-8">
        
        {/* Return to Orders */}
        <button 
          onClick={() => navigate('/returns')}
          className="text-sm text-[#16A34A] hover:text-[#14532D] flex items-center gap-1 mb-6 cursor-pointer font-semibold"
        >
          <ArrowLeft size={16} /> Back to Your Orders
        </button>

        {/* Wizard Header Title */}
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-2">
            <Sparkles size={24} className="text-[#16A34A]" />
            amazon<span className="text-[#16A34A]">reloop</span> <span className="font-light text-slate-500">AI Return Hub</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
            Reduce carbon waste, earn green credits, and circularize returns via automated computer vision grading.
          </p>
        </div>

        {/* CO2 Savings Pill */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-1.5 bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC] text-[13px] font-bold px-5 py-2.5 rounded-full shadow-sm">
            <Leaf size={16} className="text-[#16A34A]" />
            Circular returns save 59.5 kg CO₂ and earn 150 Green Credits
          </span>
        </div>

        {/* Progress Bar */}
        <ProgressBar currentStep={currentStep} />

        {/* Step Container Card with left border */}
        <div className="w-full bg-white rounded-xl shadow-sm border-l-4 border-l-[#16A34A] border-y border-r border-[#D1FAE5] p-6 md:p-8 animate-slide-up mt-6">
          {renderActiveStep()}
        </div>
      </div>
    </div>
  );
}

function OrdersList({ user }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState("orders"); // "orders" or "refund-status"
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Modal States
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [reviewingOrder, setReviewingOrder] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const initialOrders = [
    {
      id: "404-3596249-8456512",
      date: "15 March 2026",
      total: "₹18,999.00",
      shipTo: user?.name || "Priya Sharma",
      status: "Eligible for Return",
      statusDesc: "Delivered on March 18. Return window open until June 18, 2026.",
      productName: "Samsung Galaxy M34 5G (Silver, 128GB)",
      price: "₹18,999.00",
      productId: "prod_samsung_m34_001",
      img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=200&auto=format&fit=crop",
      carbon_footprint_kg: 70
    },
    {
      id: "404-1188199-4825114",
      date: "10 April 2026",
      total: "₹4,999.00",
      shipTo: user?.name || "Priya Sharma",
      status: "Eligible for Return",
      statusDesc: "Delivered on April 13. Return window open until July 13, 2026.",
      productName: "Levi's Trucker Denim Jacket (Classic Blue, Size M)",
      price: "₹4,999.00",
      productId: "prod_levis_jacket_001",
      img: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=200&auto=format&fit=crop",
      carbon_footprint_kg: 22
    }
  ];

  const [orders, setOrders] = useState(() => {
    try {
      const stored = sessionStorage.getItem("reloop_orders");
      return stored ? JSON.parse(stored) : initialOrders;
    } catch {
      return initialOrders;
    }
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  const handleBuyAgain = (order) => {
    // Map order item back to a cart item structure
    const cartProduct = {
      product_id: order.productId,
      name: order.productName,
      price_new: parseFloat(order.price.replace(/[₹,]/g, "")),
      image_url: order.img,
      carbon_footprint_kg: order.carbon_footprint_kg || 40
    };
    addToCart(cartProduct);
    showToast(`"${order.productName}" added back to shopping cart!`);
  };

  const handleViewStatus = (order) => {
    setSelectedOrder(order);
    setActiveTab("refund-status");
  };

  const suggestAIReview = () => {
    if (!reviewingOrder) return;
    const isClothing = reviewingOrder.productName.toLowerCase().includes("jacket") || reviewingOrder.productName.toLowerCase().includes("denim");
    if (isClothing) {
      setReviewComment("Excellent classic fit! The fabric weight is premium and choice of recycled cotton fibers shows Amazon's commitment to circular recommerce. Highly recommended!");
    } else {
      setReviewComment("Amazing screen clarity and processing speed! Choosing this certified Amazon Renewed device saved about 59.5 kg of manufacturing CO2. Professional grading works perfectly.");
    }
    setReviewRating(5);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    setReviewSubmitted(true);
    setTimeout(() => {
      setReviewingOrder(null);
      setReviewSubmitted(false);
      setReviewComment("");
      showToast("Thank you! Your verified customer review was submitted successfully.");
    }, 1500);
  };

  if (activeTab === "refund-status" && selectedOrder) {
    return (
      <div className="bg-[#F0FDF4] min-h-screen w-full" style={{ color: '#0F172A', fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }}>
        <div className="w-full bg-white min-h-screen px-6 py-8">
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '16px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: '500' }}>Return/Refund Status</h2>
            <button 
              onClick={() => setActiveTab("orders")}
              style={{ background: 'none', border: 'none', color: '#007185', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' }}
            >
              Back to Your Orders
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
            <div style={{ background: '#fcfcfc', border: '1px solid #e7e7e7', borderRadius: '8px', padding: '20px' }}>
              <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #eee', paddingBottom: '16px', marginBottom: '20px' }}>
                <div style={{ width: '80px', height: '80px', background: 'white', borderRadius: '4px', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center' }}>
                  <img src={selectedOrder.img} alt={selectedOrder.productName} style={{ maxHeight: '90%', maxWidth: '90%', objectFit: 'contain' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '700' }}>{selectedOrder.productName}</h4>
                  <span style={{ fontSize: '14px', fontWeight: '800', color: '#B12704', marginTop: '6px', display: 'block' }}>{selectedOrder.price}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '24px' }}>
                <span style={{ color: '#137333' }}><CheckCircle2 size={20} /></span>
                <div>
                  <h5 style={{ fontSize: '14px', fontWeight: '700', color: '#137333' }}>Refund status: Processed</h5>
                  <p style={{ fontSize: '12px', color: '#565959', marginTop: '2px' }}>Your circular return was processed and credits/cash refund has been issued.</p>
                </div>
              </div>

              <div style={{ position: 'relative', paddingLeft: '32px' }}>
                <div style={{ position: 'absolute', left: '11px', top: '12px', bottom: '12px', width: '4px', background: '#ff9900' }} />
                {[
                  { label: "Return initiated (ReLoop AI scan verified)", date: "Today" },
                  { label: "Package dropped off / collected", date: "Pending" },
                  { label: "Item received at sorting hub", date: "Pending" },
                  { label: "Refund credited & Green Credits awarded", date: "Processed ✓" }
                ].map((step, idx) => (
                  <div key={idx} style={{ position: 'relative', marginBottom: '24px', display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{
                      position: 'absolute',
                      left: '-26px',
                      top: '2px',
                      width: '14px',
                      height: '14px',
                      background: '#ff9900',
                      borderRadius: '50%',
                      border: '3px solid white',
                      boxShadow: '0 0 0 1px #ff9900'
                    }} />
                    <span style={{ fontWeight: '700', color: '#111' }}>{step.label}</span>
                    <span style={{ color: '#565959' }}>{step.date}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
                <h4 style={{ fontWeight: '750', fontSize: '16px', marginBottom: '14px' }}>Refund summary</h4>
                <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', fontSize: '13px', paddingBottom: '8px' }}>
                  <span>Refund subtotal</span>
                  <span>{selectedOrder.price}</span>
                </div>
                <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', fontSize: '15px', fontWeight: 'bold', borderTop: '1px dashed #eee', paddingTop: '8px' }}>
                  <span>Total expected refund</span>
                  <span>{selectedOrder.price}</span>
                </div>
              </div>

              <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ background: '#f0f2f2', padding: '10px 16px', fontSize: '13px', fontWeight: '700', borderBottom: '1px solid #ddd' }}>
                  Manage your return
                </div>
                <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#007185' }}>
                  <span style={{ cursor: 'pointer' }} onClick={() => setSelectedInvoice(selectedOrder)}>View invoice receipt</span>
                  <span style={{ cursor: 'pointer' }} onClick={() => setReviewingOrder(selectedOrder)}>Write a product review</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/')}
                style={{
                  padding: '12px',
                  background: '#ffd814',
                  border: '1px solid #fcd200',
                  borderRadius: '100px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Continue shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#eaeded', minHeight: '100vh', padding: '24px', color: '#111111', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Toast Alert */}
      {toastMessage && (
        <div style={{ position: "fixed", top: "80px", right: "24px", background: "#16a34a", color: "white", padding: "12px 24px", borderRadius: "4px", fontWeight: "bold", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", zIndex: 2000 }}>
          {toastMessage}
        </div>
      )}

      <div className="w-full px-6 py-8 space-y-6">
        
        <div style={{ fontSize: '12px', color: '#565959', marginBottom: '16px' }}>
          <span>Your Account</span> <ChevronRight size={10} style={{ display: 'inline' }} /> <span style={{ color: '#c7511f' }}>Your Orders</span>
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: '500', marginBottom: '20px' }}>Your Orders</h1>

        <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '20px', fontSize: '14px' }}>
          <span style={{ fontWeight: 'bold', borderBottom: '2px solid #e77600', paddingBottom: '10px', cursor: 'pointer' }}>Orders</span>
          <span style={{ color: '#565959', cursor: 'pointer' }}>Buy Again</span>
          <span style={{ color: '#565959', cursor: 'pointer' }}>Not Yet Shipped</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order) => (
            <div key={order.id} style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
              
              {/* Card Metadata Top belt */}
              <div style={{ background: '#f0f2f2', padding: '12px 20px', display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', fontSize: '12px', color: '#565959' }}>
                <div style={{ display: 'flex', gap: '32px' }}>
                  <div>
                    <span>ORDER PLACED</span>
                    <p style={{ color: '#111', fontWeight: '500', marginTop: '2px' }}>{order.date}</p>
                  </div>
                  <div>
                    <span>TOTAL</span>
                    <p style={{ color: '#111', fontWeight: '500', marginTop: '2px' }}>{order.total}</p>
                  </div>
                  <div>
                    <span>SHIP TO</span>
                    <p style={{ color: '#007185', fontWeight: '500', marginTop: '2px', cursor: 'pointer' }}>{order.shipTo} ▼</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span>ORDER # {order.id}</span>
                  <p style={{ color: '#007185', marginTop: '2px', cursor: 'pointer' }}>
                    <span onClick={() => setSelectedInvoice(order)}>Invoice</span>
                  </p>
                </div>
              </div>

              {/* Card Item body */}
              <div className="flex items-start gap-6 px-6 py-5">
                <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center bg-[#F0FDF4] border border-green-100 rounded-xl p-2">
                  <img src={order.img} alt={order.productName} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="mb-1.5 flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-1.5">{order.statusDesc}</p>
                  <span 
                    onClick={() => navigate(order.productId === 'JACKET_001' ? '/passport/JACKET_001' : '/product/B09X7KQMGN')} 
                    className="text-sm text-teal-600 hover:underline cursor-pointer font-semibold block leading-tight mb-2"
                  >
                    {order.productName}
                  </span>

                  {/* CO2 Impact Line */}
                  <div className="inline-flex items-center gap-1.5 bg-[#F0FDF4] border border-green-200 rounded-lg px-3 py-1.5 mb-3">
                    <span className="text-sm">♻️</span>
                    <span className="text-xs font-semibold text-[#1A6B3C]">
                      Returning this saves <strong>{order.carbon_footprint_kg ? (order.carbon_footprint_kg * 0.85).toFixed(1) : '59.5'} kg CO₂</strong> from manufacturing
                    </span>
                  </div>

                  {/* Journey Timeline */}
                  <div className="flex items-center gap-0 mt-1">
                    {[
                      { label: 'Return Initiated', icon: '📦' },
                      { label: 'AI Graded',        icon: '🔍' },
                      { label: 'Recommerced',      icon: '♻️' },
                      { label: 'Credits Earned',   icon: '🌿' },
                    ].map((step, idx) => (
                      <div key={idx} className="flex items-center">
                        <div className="flex flex-col items-center">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm border-2 ${
                            idx === 0 ? 'bg-[#1A6B3C] border-[#1A6B3C] text-white' : 'bg-white border-slate-200 text-slate-400'
                          }`}>
                            {step.icon}
                          </div>
                          <span className="text-[9px] text-slate-400 mt-0.5 text-center leading-tight w-14">{step.label}</span>
                        </div>
                        {idx < 3 && <div className="w-8 h-0.5 bg-slate-200 mb-3 flex-shrink-0" />}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-48 flex-shrink-0">
                  {/* Primary green CTA */}
                  <button 
                    onClick={() => navigate(`/return/${order.productId}`)}
                    className="w-full text-white text-sm font-bold py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg shadow-md"
                    style={{ background: 'linear-gradient(135deg, #1A6B3C, #0D9488)' }}
                  >
                    <span className="text-base">♻</span> Return via ReLoop
                  </button>
                  <button 
                    onClick={() => handleBuyAgain(order)}
                    className="bg-[#F59E0B] hover:bg-[#D97706] text-white text-sm font-semibold py-2.5 rounded-xl text-center cursor-pointer transition-all"
                  >
                    Buy it again
                  </button>
                  <button 
                    onClick={() => handleViewStatus(order)}
                    className="bg-white border border-slate-200 text-slate-700 text-sm py-2 rounded-xl text-center hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    View Refund Status
                  </button>
                  <button 
                    onClick={() => setReviewingOrder(order)}
                    className="bg-white border border-slate-200 text-slate-700 text-sm py-2 rounded-xl text-center hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    Write product review
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice Receipt Modal */}
      {selectedInvoice && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: '#111' }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '600px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', border: '1px solid #ccc' }}>
            
            <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', borderBottom: '2px solid #ddd', paddingBottom: '10px', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold' }}>amazon<span style={{ color: '#16a34a' }}>reloop</span></h2>
                <p style={{ fontSize: '11px', color: '#565959', marginTop: '2px' }}>Verified Circular Order Invoice</p>
              </div>
              <button onClick={() => setSelectedInvoice(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><X size={20} /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', fontSize: '12px', marginBottom: '20px' }}>
              <div>
                <strong>Sold By:</strong>
                <p style={{ color: '#565959', marginTop: '4px', lineHeight: '1.4' }}>Amazon Retail India Private Limited<br />Plot 14, ReLoop Hub Sector 5<br />Bengaluru, KA 560001</p>
              </div>
              <div>
                <strong>Shipping Address:</strong>
                <p style={{ color: '#565959', marginTop: '4px', lineHeight: '1.4' }}>{selectedInvoice.shipTo}<br />M.G. Road Residency<br />{user?.city || "Bengaluru"}, India</p>
              </div>
            </div>

            <div style={{ border: '1px solid #ddd', borderRadius: '6px', overflow: 'hidden', marginBottom: '20px', fontSize: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', background: '#f0f2f2', padding: '10px', fontWeight: 'bold', borderBottom: '1px solid #ddd' }}>
                <span>Item</span>
                <span>Qty</span>
                <span style={{ textAlign: 'right' }}>Price</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '10px', borderBottom: '1px solid #eee' }}>
                <span style={{ fontWeight: '500' }}>{selectedInvoice.productName}</span>
                <span>1</span>
                <span style={{ textAlign: 'right' }}>{selectedInvoice.price}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '10px', fontWeight: 'bold' }}>
                <span>Total Amount</span>
                <span></span>
                <span style={{ textAlign: 'right' }}>{selectedInvoice.price}</span>
              </div>
            </div>

            {/* ReLoop Eco Certification Section */}
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '16px', marginBottom: '24px', fontSize: '12px' }}>
              <span style={{ fontWeight: 'bold', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>🌱 CIRCULAR ECO-CERTIFICATE</span>
              <p style={{ color: '#166534', marginTop: '6px', lineHeight: '1.4' }}>
                This purchase was fulfilled utilizing verified circular logistics. E-waste/Garment manufacturing offset is estimated at approximately <strong>{selectedInvoice.carbon_footprint_kg || 40} kg of CO₂e emissions</strong> compared to virgin material processing loops.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => {
                  window.print();
                }} 
                style={{ flex: 1, padding: '10px', background: '#ffd814', border: '1px solid #fcd200', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Printer size={16} /> Print Receipt
              </button>
              <button 
                onClick={() => setSelectedInvoice(null)} 
                style={{ flex: 1, padding: '10px', background: '#eee', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
              >
                Close Invoice
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Review Dialog Modal */}
      {reviewingOrder && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: '#111' }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '8px', width: '450px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
            
            <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>Create verified review</h3>
              <button onClick={() => setReviewingOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}><X size={18} /></button>
            </div>

            {reviewSubmitted ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <span style={{ fontSize: '48px', color: '#16a34a' }}>✓</span>
                <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '12px', color: '#15803d' }}>Review Submitted!</h4>
                <p style={{ fontSize: '12px', color: '#565959', marginTop: '4px' }}>Earning +15 green credits for verified review activity.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <img src={reviewingOrder.img} alt="" style={{ width: '50px', height: '50px', objectFit: 'contain', border: '1px solid #eee', borderRadius: '4px' }} />
                  <span style={{ fontSize: '12px', fontWeight: 'bold', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{reviewingOrder.productName}</span>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '6px' }}>Overall rating</label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={22} 
                        onClick={() => setReviewRating(star)} 
                        fill={star <= reviewRating ? "#ff9900" : "none"} 
                        stroke={star <= reviewRating ? "#ff9900" : "#ccc"} 
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 'bold' }}>Add a written review</label>
                    <button 
                      type="button" 
                      onClick={suggestAIReview} 
                      style={{ background: 'none', border: 'none', color: '#16A34A', cursor: 'pointer', fontSize: '10px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '2px' }}
                    >
                      ✨ Auto-Draft Eco Review
                    </button>
                  </div>
                  <textarea 
                    value={reviewComment}
                    onChange={e => setReviewComment(e.target.value)}
                    placeholder="What did you like or dislike? How does ReLoop carbon saving verification feel?"
                    style={{ width: '100%', height: '100px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px', outline: 'none' }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <button 
                    type="button"
                    onClick={() => setReviewingOrder(null)} 
                    style={{ flex: 1, padding: '10px', background: '#eee', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    style={{ flex: 1, padding: '10px', background: '#16A34A', border: 'none', color: '#ffffff', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

export default function ReturnFlow() {
  const { productId } = useParams();
  const { user } = useUser();

  if (productId) {
    return (
      <ReturnProvider>
        <ReturnFlowContainer />
      </ReturnProvider>
    );
  }

  return <OrdersList user={user} />;
}
