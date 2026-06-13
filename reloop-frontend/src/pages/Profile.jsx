import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Key, MapPin, CreditCard, ChevronRight, Check } from 'lucide-react';
import { useUser } from '../context/UserContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser, loading } = useUser();
  const [profileView, setProfileView] = useState("menu"); // "menu" or "login-security"

  // Edit states
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingCity, setIsEditingCity] = useState(false);

  // Form inputs state
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editCity, setEditCity] = useState("");

  const startEdit = (field) => {
    if (field === "name") {
      setEditName(user.name);
      setIsEditingName(true);
    } else if (field === "phone") {
      setEditPhone(user.phone);
      setIsEditingPhone(true);
    } else if (field === "email") {
      setEditEmail(user.email);
      setIsEditingEmail(true);
    } else if (field === "city") {
      setEditCity(user.city || "Bengaluru");
      setIsEditingCity(true);
    }
  };

  const saveEdit = (field) => {
    if (field === "name") {
      updateUser({ name: editName });
      setIsEditingName(false);
    } else if (field === "phone") {
      updateUser({ phone: editPhone });
      setIsEditingPhone(false);
    } else if (field === "email") {
      updateUser({ email: editEmail });
      setIsEditingEmail(false);
    } else if (field === "city") {
      updateUser({ city: editCity });
      setIsEditingCity(false);
    }
  };

  const cancelEdit = (field) => {
    if (field === "name") setIsEditingName(false);
    else if (field === "phone") setIsEditingPhone(false);
    else if (field === "email") setIsEditingEmail(false);
    else if (field === "city") setIsEditingCity(false);
  };

  if (profileView === "login-security") {
    return (
      <div style={{ background: '#eaeded', minHeight: '100vh', padding: '24px', color: '#111111', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '24px' }}>
          
          {/* Breadcrumbs */}
          <div style={{ fontSize: '12px', color: '#565959', marginBottom: '16px' }}>
            <span style={{ cursor: 'pointer', color: '#007185' }} onClick={() => setProfileView("menu")}>Your Account</span> 
            <ChevronRight size={10} style={{ display: 'inline', margin: '0 4px' }} /> 
            <span style={{ color: '#c7511f' }}>Login & Security</span>
          </div>

          <h1 style={{ fontSize: '28px', fontWeight: '500', marginBottom: '20px' }}>Login & Security</h1>

          {/* Details Table Card */}
          <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
            
            {/* Field: Name */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #eee' }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Name:</span>
                {isEditingName ? (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <input 
                      type="text" 
                      value={editName} 
                      onChange={e => setEditName(e.target.value)} 
                      style={{ padding: '6px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px', width: '250px', outline: 'none' }}
                    />
                    <button onClick={() => saveEdit("name")} style={{ padding: '6px 14px', background: '#ffd814', border: '1px solid #fcd200', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>Save</button>
                    <button onClick={() => cancelEdit("name")} style={{ padding: '6px 14px', background: '#eee', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
                  </div>
                ) : (
                  <p style={{ fontSize: '13px', color: '#333', marginTop: '2px' }}>{user.name}</p>
                )}
              </div>
              {!isEditingName && (
                <button onClick={() => startEdit("name")} style={{ padding: '6px 16px', background: 'white', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
              )}
            </div>

            {/* Field: Phone */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #eee' }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Primary mobile number:</span>
                {isEditingPhone ? (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <input 
                      type="text" 
                      value={editPhone} 
                      onChange={e => setEditPhone(e.target.value)} 
                      style={{ padding: '6px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px', width: '250px', outline: 'none' }}
                    />
                    <button onClick={() => saveEdit("phone")} style={{ padding: '6px 14px', background: '#ffd814', border: '1px solid #fcd200', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>Save</button>
                    <button onClick={() => cancelEdit("phone")} style={{ padding: '6px 14px', background: '#eee', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize: '13px', color: '#333', marginTop: '2px' }}>{user.phone}</p>
                    <p style={{ fontSize: '11px', color: '#565959', marginTop: '2px' }}>Quickly sign in, easily recover passwords, and receive notifications.</p>
                  </>
                )}
              </div>
              {!isEditingPhone && (
                <button onClick={() => startEdit("phone")} style={{ padding: '6px 16px', background: 'white', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
              )}
            </div>

            {/* Field: Email */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #eee' }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold' }}>E-mail:</span>
                {isEditingEmail ? (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <input 
                      type="email" 
                      value={editEmail} 
                      onChange={e => setEditEmail(e.target.value)} 
                      style={{ padding: '6px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px', width: '250px', outline: 'none' }}
                    />
                    <button onClick={() => saveEdit("email")} style={{ padding: '6px 14px', background: '#ffd814', border: '1px solid #fcd200', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>Save</button>
                    <button onClick={() => cancelEdit("email")} style={{ padding: '6px 14px', background: '#eee', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize: '13px', color: '#333', marginTop: '2px' }}>{user.email}</p>
                    <p style={{ fontSize: '11px', color: '#c7511f', marginTop: '2px' }}>⚠️ Add email verification to increase account protection.</p>
                  </>
                )}
              </div>
              {!isEditingEmail && (
                <button onClick={() => startEdit("email")} style={{ padding: '6px 16px', background: 'white', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
              )}
            </div>

            {/* Field: City */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #eee' }}>
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Primary delivery city:</span>
                {isEditingCity ? (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <input 
                      type="text" 
                      value={editCity} 
                      onChange={e => setEditCity(e.target.value)} 
                      style={{ padding: '6px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px', width: '250px', outline: 'none' }}
                    />
                    <button onClick={() => saveEdit("city")} style={{ padding: '6px 14px', background: '#ffd814', border: '1px solid #fcd200', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: '600' }}>Save</button>
                    <button onClick={() => cancelEdit("city")} style={{ padding: '6px 14px', background: '#eee', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
                  </div>
                ) : (
                  <>
                    <p style={{ fontSize: '13px', color: '#333', marginTop: '2px' }}>{user.city || "Bengaluru"}</p>
                    <p style={{ fontSize: '11px', color: '#565959', marginTop: '2px' }}>Used for local NGO donations and peer-to-peer recommendation sorting.</p>
                  </>
                )}
              </div>
              {!isEditingCity && (
                <button onClick={() => startEdit("city")} style={{ padding: '6px 16px', background: 'white', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
              )}
            </div>

            {/* Field: Passkey */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #eee' }}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Passkey:</span>
                <p style={{ fontSize: '11px', color: '#565959', marginTop: '2px' }}>Sign in with face, fingerprint, or PIN.</p>
              </div>
              <button style={{ padding: '6px 16px', background: 'white', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>Set up</button>
            </div>

            {/* Field: Password */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px' }}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Password:</span>
                <p style={{ fontSize: '13px', color: '#333', marginTop: '2px' }}>••••••••</p>
              </div>
              <button style={{ padding: '6px 16px', background: 'white', border: '1px solid #ccc', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>Edit</button>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // Render "Your Account" Options list layout
  return (
    <div style={{ background: '#eaeded', minHeight: '100vh', padding: '24px', color: '#111111', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        <h1 style={{ fontSize: '28px', fontWeight: '500', marginBottom: '20px' }}>Your Account</h1>

        {/* 3x3 Cards Grid matching Amazon Account Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          
          {/* Orders */}
          <div 
            onClick={() => navigate('/returns')}
            style={{ display: 'flex', gap: '16px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '16px', cursor: 'pointer' }}
            onMouseOver={e => e.currentTarget.style.background = '#f5f5f5'}
            onMouseOut={e => e.currentTarget.style.background = 'white'}
          >
            <span style={{ fontSize: '32px' }}>📦</span>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: '700' }}>Your Orders</h4>
              <p style={{ fontSize: '12px', color: '#565959', marginTop: '4px' }}>Track, return, or buy things again</p>
            </div>
          </div>

          {/* Login & Security */}
          <div 
            onClick={() => setProfileView("login-security")}
            style={{ display: 'flex', gap: '16px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '16px', cursor: 'pointer' }}
            onMouseOver={e => e.currentTarget.style.background = '#f5f5f5'}
            onMouseOut={e => e.currentTarget.style.background = 'white'}
          >
            <span style={{ fontSize: '32px' }}>🔒</span>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: '700' }}>Login & security</h4>
              <p style={{ fontSize: '12px', color: '#565959', marginTop: '4px' }}>Edit login, name, city, and mobile number</p>
            </div>
          </div>

          {/* Prime */}
          <div 
            style={{ display: 'flex', gap: '16px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '16px', cursor: 'pointer' }}
            onMouseOver={e => e.currentTarget.style.background = '#f5f5f5'}
            onMouseOut={e => e.currentTarget.style.background = 'white'}
          >
            <span style={{ fontSize: '32px' }}>🔵</span>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: '700' }}>Prime</h4>
              <p style={{ fontSize: '12px', color: '#565959', marginTop: '4px' }}>View benefits and payment settings</p>
            </div>
          </div>

          {/* Addresses */}
          <div 
            style={{ display: 'flex', gap: '16px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '16px', cursor: 'pointer' }}
            onMouseOver={e => e.currentTarget.style.background = '#f5f5f5'}
            onMouseOut={e => e.currentTarget.style.background = 'white'}
          >
            <span style={{ fontSize: '32px' }}>📍</span>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: '700' }}>Your Addresses</h4>
              <p style={{ fontSize: '12px', color: '#565959', marginTop: '4px' }}>Edit addresses for orders and gifts</p>
            </div>
          </div>

          {/* Payment */}
          <div 
            style={{ display: 'flex', gap: '16px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '16px', cursor: 'pointer' }}
            onMouseOver={e => e.currentTarget.style.background = '#f5f5f5'}
            onMouseOut={e => e.currentTarget.style.background = 'white'}
          >
            <span style={{ fontSize: '32px' }}>💳</span>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: '700' }}>Payment options</h4>
              <p style={{ fontSize: '12px', color: '#565959', marginTop: '4px' }}>Edit or add payment methods</p>
            </div>
          </div>

          {/* Contact */}
          <div 
            style={{ display: 'flex', gap: '16px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', padding: '16px', cursor: 'pointer' }}
            onMouseOver={e => e.currentTarget.style.background = '#f5f5f5'}
            onMouseOut={e => e.currentTarget.style.background = 'white'}
          >
            <span style={{ fontSize: '32px' }}>🎧</span>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: '700' }}>Contact Us</h4>
              <p style={{ fontSize: '12px', color: '#565959', marginTop: '4px' }}>Contact customer service via phone or chat</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
