import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getUserProfile, updateUserProfile } from "../api/reloop";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    user_id: "user_priya_001",
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+91-9876543210",
    city: "Bengaluru",
  });
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async (userId = "user_priya_001") => {
    try {
      setLoading(true);
      const data = await getUserProfile(userId);
      if (data && data.name) {
        setUser(data);
      }
    } catch (e) {
      console.warn("Failed to fetch user profile:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (updatedFields) => {
    const targetUserId = user.user_id || "user_priya_001";
    // Optimistic update
    setUser((prev) => ({ ...prev, ...updatedFields }));
    
    try {
      const payload = {
        name: updatedFields.name !== undefined ? updatedFields.name : user.name,
        email: updatedFields.email !== undefined ? updatedFields.email : user.email,
        phone: updatedFields.phone !== undefined ? updatedFields.phone : user.phone,
        city: updatedFields.city !== undefined ? updatedFields.city : user.city,
      };
      
      const res = await updateUserProfile(targetUserId, payload);
      if (res && res.status === "ok") {
        // Sync full profile back to be sure
        await fetchUser(targetUserId);
      }
    } catch (e) {
      console.error("Failed to update user profile on backend:", e);
    }
  }, [user, fetchUser]);

  useEffect(() => {
    fetchUser("user_priya_001");
  }, [fetchUser]);

  return (
    <UserContext.Provider value={{ user, loading, updateUser, reloadUser: () => fetchUser(user.user_id) }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
