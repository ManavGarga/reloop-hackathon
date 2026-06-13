import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ReturnProvider, useReturn } from "../context/ReturnContext";
import { useUser } from "../context/UserContext";
import ProgressBar from "../components/shared/ProgressBar";
import { CheckCircle2, ChevronRight, ArrowLeft, Package, Sparkles } from "lucide-react";

// Import step components
import Step1ProductSelect from "../components/return/Step1ProductSelect";
import Step2ConditionCheck from "../components/return/Step2ConditionCheck";
import Step3ValueAssessment from "../components/return/Step3ValueAssessment";
import Step4DropoffSelect from "../components/return/Step4DropoffSelect";
import Step5ReLoopOptions from "../components/return/Step5ReLoopOptions";
import Step6Confirmation from "../components/return/Step6Confirmation";

function ReturnFlowContainer() {
  const { productId } = useParams();
  const { returnDetails, updateReturn } = useReturn();
  const currentStep = returnDetails.currentStep;
  const navigate = useNavigate();

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

  return (
    <div style={{ background: '#090d16', minHeight: '100vh', padding: '32px 24px', color: '#f1f5f9', fontFamily: 'Inter, sans-serif', borderRadius: '12px' }}>
      <div className="min-h-screen flex flex-col items-center max-w-5xl mx-auto space-y-6">
        
        {/* Return to Orders */}
        <button 
          onClick={() => navigate('/returns')}
          style={{
            alignSelf: 'flex-start',
            background: 'none',
            border: 'none',
            color: '#38bdf8',
            cursor: 'pointer',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: '600',
            marginBottom: '10px'
          }}
        >
          <ArrowLeft size={16} /> Back to Your Orders
        </button>

        {/* Wizard Header Title */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight leading-tight flex items-center justify-center gap-2">
            <Sparkles size={24} style={{ color: '#4ade80' }} />
            amazon<span style={{ color: '#4ade80' }}>reloop</span> AI Return Hub
          </h1>
          <p className="text-xs text-slate-400">Reduce carbon waste, earn green credits, and circularize returns via computer vision grading.</p>
        </div>

        {/* Progress Bar */}
        <ProgressBar currentStep={currentStep} />

        {/* Step Container Card */}
        <div className="w-full bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-sm">
          {renderActiveStep()}
        </div>
      </div>
    </div>
  );
}

function OrdersList({ user }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("orders"); // "orders" or "refund-status"
  const [selectedOrder, setSelectedOrder] = useState(null);

  const mockOrders = [
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
      img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=200&auto=format&fit=crop"
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
      img: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=200&auto=format&fit=crop"
    }
  ];

  const handleViewStatus = (order) => {
    setSelectedOrder(order);
    setActiveTab("refund-status");
  };

  if (activeTab === "refund-status" && selectedOrder) {
    return (
      <div style={{ background: '#eaeded', minHeight: '100vh', padding: '24px', color: '#111111', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', background: 'white', borderRadius: '8px', border: '1px solid #ddd', padding: '24px' }}>
          
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
                <div style={{ width: '80px', height: '80px', background: 'white', borderRadius: '4px', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                  <div key={idx} style={{ position: 'relative', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', paddingBottom: '8px' }}>
                  <span>Refund subtotal</span>
                  <span>{selectedOrder.price}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 'bold', borderTop: '1px dashed #eee', paddingTop: '8px' }}>
                  <span>Total expected refund</span>
                  <span>{selectedOrder.price}</span>
                </div>
              </div>

              <div style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{ background: '#f0f2f2', padding: '10px 16px', fontSize: '13px', fontWeight: '700', borderBottom: '1px solid #ddd' }}>
                  Manage your return
                </div>
                <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#007185' }}>
                  <span style={{ cursor: 'pointer' }}>View order details</span>
                  <span style={{ cursor: 'pointer' }}>Write a product review</span>
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
      <div style={{ maxWidth: '1000px', margin: '0 auto', spaceY: '16px' }}>
        
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
          {mockOrders.map((order) => (
            <div key={order.id} style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
              <div style={{ background: '#f0f2f2', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#565959' }}>
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
                  <p style={{ color: '#007185', marginTop: '2px', cursor: 'pointer' }}>View order details | Invoice</p>
                </div>
              </div>

              <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 240px', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={order.img} alt={order.productName} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#111', marginBottom: '6px' }}>{order.status}</h4>
                    <p style={{ fontSize: '13px', color: '#565959', marginBottom: '12px' }}>{order.statusDesc}</p>
                    <span style={{ fontSize: '13px', color: '#007185', cursor: 'pointer', lineHeight: '1.4', fontWeight: '600' }}>{order.productName}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button 
                    onClick={() => navigate(`/return/${order.productId}`)}
                    style={{
                      padding: '10px',
                      background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                      border: 'none',
                      borderRadius: '100px',
                      fontSize: '12px',
                      fontWeight: '800',
                      color: '#0f1111',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      boxShadow: '0 2px 6px rgba(34, 197, 94, 0.2)'
                    }}
                  >
                    ♻️ Return via ReLoop
                  </button>
                  <button 
                    onClick={() => handleViewStatus(order)}
                    style={{ padding: '10px', background: 'white', border: '1px solid #ddd', borderRadius: '100px', fontSize: '12px', cursor: 'pointer' }}
                  >
                    View Refund Status
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
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
