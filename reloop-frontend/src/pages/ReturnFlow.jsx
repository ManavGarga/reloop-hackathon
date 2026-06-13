import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, ChevronRight } from "lucide-react";

export default function ReturnFlow() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("orders"); // "orders" or "refund-status"
  const [selectedOrder, setSelectedOrder] = useState(null);

  const mockOrders = [
    {
      id: "404-3596249-8456512",
      date: "5 November 2025",
      total: "₹279.06",
      shipTo: "Nikita Gupta",
      status: "Refunded",
      statusDesc: "Your return is in transit. Your refund has been issued.",
      productName: "VL53L0X V2 Laser Ranging Sensor for Accurate Distance Measurement",
      price: "₹275.00",
      img: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=200&auto=format&fit=crop"
    },
    {
      id: "404-1188199-4825114",
      date: "5 November 2025",
      total: "₹202.94",
      shipTo: "Nikita Gupta",
      status: "Refunded",
      statusDesc: "Your return is in transit. Your refund has been issued.",
      productName: "SRP Cable for Arduino Nano (USB 2.0 A to USB 2.0 Mini B) - Blue, 30cm",
      price: "₹199.00",
      img: "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?q=80&w=200&auto=format&fit=crop"
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
          
          {/* Header */}
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
            
            {/* Left: Product & Status Timeline */}
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

              {/* Refund confirmation block */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginBottom: '24px' }}>
                <span style={{ color: '#137333' }}><CheckCircle2 size={20} /></span>
                <div>
                  <h5 style={{ fontSize: '14px', fontWeight: '700', color: '#137333' }}>Refund issued</h5>
                  <p style={{ fontSize: '12px', color: '#565959', marginTop: '2px' }}>{selectedOrder.price} was refunded to your original payment method</p>
                </div>
              </div>

              {/* Vertical Progress Tracker */}
              <div style={{ position: 'relative', paddingLeft: '32px' }}>
                {/* Vertical Bar */}
                <div style={{ position: 'absolute', left: '11px', top: '12px', bottom: '12px', width: '4px', background: '#ff9900' }} />
                
                {[
                  { label: "Return pickup scheduled", date: "Nov 16" },
                  { label: "Picked up", date: "Nov 17" },
                  { label: "Item received", date: "Nov 17" },
                  { label: "Refund initiated", date: "Nov 17" },
                  { label: "Refund credited to your bank account", date: "Nov 20-22" }
                ].map((step, idx) => (
                  <div key={idx} style={{ position: 'relative', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    {/* Circle Bullet */}
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

            {/* Right: Summary Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Summary box */}
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

              {/* Manage return links */}
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

  // Active Tab is Orders list
  return (
    <div style={{ background: '#eaeded', minHeight: '100vh', padding: '24px', color: '#111111', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto', spaceY: '16px' }}>
        
        {/* Breadcrumb */}
        <div style={{ fontSize: '12px', color: '#565959', marginBottom: '16px' }}>
          <span>Your Account</span> <ChevronRight size={10} style={{ display: 'inline' }} /> <span style={{ color: '#c7511f' }}>Your Orders</span>
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: '500', marginBottom: '20px' }}>Your Orders</h1>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginBottom: '20px', fontSize: '14px' }}>
          <span style={{ fontWeight: 'bold', borderBottom: '2px solid #e77600', paddingBottom: '10px', cursor: 'pointer' }}>Orders</span>
          <span style={{ color: '#565959', cursor: 'pointer' }}>Buy Again</span>
          <span style={{ color: '#565959', cursor: 'pointer' }}>Not Yet Shipped</span>
        </div>

        {/* Orders List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {mockOrders.map((order) => (
            <div key={order.id} style={{ background: 'white', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
              {/* Order Metadata Belt */}
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

              {/* Order Item Details */}
              <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: '1fr 240px', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '20px' }}>
                  <div style={{ width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={order.img} alt={order.productName} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#111', marginBottom: '6px' }}>Refunded</h4>
                    <p style={{ fontSize: '13px', color: '#565959', marginBottom: '12px' }}>{order.statusDesc}</p>
                    <span style={{ fontSize: '13px', color: '#007185', cursor: 'pointer', lineHeight: '1.4' }}>{order.productName}</span>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                      <button style={{ padding: '6px 12px', background: 'white', border: '1px solid #ddd', borderRadius: '100px', fontSize: '12px', cursor: 'pointer' }}>Buy it again</button>
                      <button style={{ padding: '6px 12px', background: 'white', border: '1px solid #ddd', borderRadius: '100px', fontSize: '12px', cursor: 'pointer' }}>View your item</button>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button 
                    onClick={() => handleViewStatus(order)}
                    style={{
                      padding: '10px',
                      background: '#ffd814',
                      border: '1px solid #fcd200',
                      borderRadius: '100px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    View Return/Refund Status
                  </button>
                  <button style={{ padding: '10px', background: 'white', border: '1px solid #ddd', borderRadius: '100px', fontSize: '12px', cursor: 'pointer' }}>
                    Write a product review
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
