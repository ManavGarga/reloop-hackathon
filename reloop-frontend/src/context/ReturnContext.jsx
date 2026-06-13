import React, { createContext, useContext, useState, useCallback } from "react";

const STORAGE_KEY = "reloop_return_state";

const INITIAL_STATE = {
  productId: "",
  productName: "",
  reason: "",
  comment: "",
  condition: "",
  conditionImages: [],
  estimatedValue: 0,
  creditOption: "store_credit",
  dropoffMethod: "",
  dropoffLocation: null,
  status: "initiated",
  currentStep: 1,
  returnId: "",
  gradeResult: null,
  disposeResult: null,
  completeResult: null,
};

function loadFromSession() {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? { ...INITIAL_STATE, ...JSON.parse(saved) } : INITIAL_STATE;
  } catch {
    return INITIAL_STATE;
  }
}

const ReturnContext = createContext();

export function ReturnProvider({ children }) {
  const [returnDetails, setReturnDetails] = useState(loadFromSession);

  const updateReturn = useCallback((fields) => {
    setReturnDetails((prev) => {
      const next = { ...prev, ...fields };
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  const resetReturn = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {}
    setReturnDetails(INITIAL_STATE);
  }, []);

  return (
    <ReturnContext.Provider value={{ returnDetails, updateReturn, resetReturn }}>
      {children}
    </ReturnContext.Provider>
  );
}

export function useReturn() {
  const context = useContext(ReturnContext);
  if (!context) {
    throw new Error("useReturn must be used within a ReturnProvider");
  }
  return context;
}
