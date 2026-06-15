import { useState, useEffect, useCallback } from "react";
import { getProducts, getProduct } from "../api/reloop";

/**
 * Custom hook to manage products querying and state.
 * @param {string|null} initialProductId - If provided, fetches details for this product on mount.
 */
export function useProducts(initialProductId = null) {
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      const productList = Array.isArray(data) 
        ? data 
        : (data && Array.isArray(data.products) ? data.products : []);
      setProducts(productList);
    } catch (err) {
      setError(err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductDetail = useCallback(async (id) => {
    if (!id) return null;
    setLoading(true);
    setError(null);
    try {
      const data = await getProduct(id);
      setProduct(data || null);
      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch product details");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    if (initialProductId) {
      fetchProductDetail(initialProductId);
    }
  }, [fetchProducts, fetchProductDetail, initialProductId]);

  return {
    products,
    product,
    loading,
    error,
    refetchProducts: fetchProducts,
    refetchProduct: fetchProductDetail,
  };
}
