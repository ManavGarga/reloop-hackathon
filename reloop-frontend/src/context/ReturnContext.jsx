import React, { createContext, useContext, useState } from "react";

const ReturnContext = createContext();

export function ReturnProvider({ children }) {
  const [returnDetails, setReturnDetails] = useState({
    productId: "",
    productName: "",
    reason: "",
    comment: "",
    condition: "", // new, like_new, good, fair, poor
    conditionImages: [],
    estimatedValue: 0,
    creditOption: "store_credit", // store_credit, bank_transfer, ngo_donate, p2p
    dropoffMethod: "", // dropoff, pickup
    dropoffLocation: null,
    status: "initiated",
    currentStep: 1,
  });

  const updateReturn = (fields) => {
    setReturnDetails((prev) => ({ ...prev, ...fields }));
  };

  const resetReturn = () => {
    setReturnDetails({
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
    });
  };

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
