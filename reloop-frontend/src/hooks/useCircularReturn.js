import { useState, useCallback } from "react";
import { useReturn } from "../context/ReturnContext";
import { initiateReturn, gradeReturn, disposeReturn, completeReturn } from "../api/reloop";

/**
 * Custom hook to manage circular return flow events and context updates.
 */
export function useCircularReturn() {
  const { returnDetails, updateReturn, resetReturn } = useReturn();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startReturn = useCallback(async (productId, productName, reason, comment) => {
    setLoading(true);
    setError(null);
    try {
      const payload = { product_id: productId, reason, comment };
      const res = await initiateReturn(payload);
      if (res && res.returnId) {
        updateReturn({
          productId,
          productName,
          reason,
          comment,
          returnId: res.returnId,
          gradeResult: null,
          disposeResult: null,
          completeResult: null,
          currentStep: 2
        });
        return res;
      } else {
        throw new Error("Failed to retrieve a valid return ID");
      }
    } catch (err) {
      setError(err.message || "Failed to initiate return");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [updateReturn]);

  const submitGrading = useCallback(async (condition, conditionImages) => {
    setLoading(true);
    setError(null);
    try {
      const payload = { return_id: returnDetails.returnId, condition, condition_images: conditionImages };
      const res = await gradeReturn(payload);
      if (res && res.grade) {
        updateReturn({
          condition,
          conditionImages,
          gradeResult: res,
          estimatedValue: res.estimated_resale_value,
          currentStep: 3
        });
        return res;
      } else {
        throw new Error("Failed to receive AI grading response");
      }
    } catch (err) {
      setError(err.message || "Failed to submit item grading");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [returnDetails.returnId, updateReturn]);

  const confirmDisposition = useCallback(async (disposition, creditsOption = "store_credit") => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        return_id: returnDetails.returnId,
        disposition,
        credits_option: creditsOption,
        category: returnDetails.gradeResult?.category || "general"
      };
      const res = await disposeReturn(payload);
      if (res && res.status === "ok") {
        updateReturn({
          disposeResult: res,
          creditOption: creditsOption,
        });
        return res;
      } else {
        throw new Error("Failed to process circular disposition option");
      }
    } catch (err) {
      setError(err.message || "Failed to submit disposition choice");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [returnDetails.returnId, returnDetails.gradeResult, updateReturn]);

  const completeReturnFlow = useCallback(async (productId, refundAmount, creditsAwarded, co2Saved) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        productId,
        refund: refundAmount,
        credits: creditsAwarded,
        co2: co2Saved
      };
      const res = await completeReturn(returnDetails.returnId, payload);
      if (res && (res.status === "completed" || res.status === "ok")) {
        updateReturn({
          completeResult: res,
          currentStep: 6
        });
        return res;
      } else {
        throw new Error("Failed to complete return transactions");
      }
    } catch (err) {
      setError(err.message || "Failed to complete return operations");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [returnDetails.returnId, updateReturn]);

  return {
    returnDetails,
    loading,
    error,
    startReturn,
    submitGrading,
    confirmDisposition,
    completeReturnFlow,
    updateReturn,
    resetReturn
  };
}
