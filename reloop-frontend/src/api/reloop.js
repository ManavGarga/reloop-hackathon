// ReLoop API Client & Service Layer
import { mockProducts } from "../data/mockProducts";

const BASE = "http://localhost:8000/api";

// ─── Api Client Design ──────────────────────────────────────────
export const apiClient = {
  baseURL: BASE,
  interceptors: {
    request: [],
    response: [],
  },

  useRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor);
  },

  useResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor);
  },

  async request(method, path, body = null) {
    let url = `${this.baseURL}${path}`;
    let options = {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    };

    // Apply Request Interceptors
    for (const interceptor of this.interceptors.request) {
      const result = interceptor(url, options);
      if (result) {
        url = result.url || url;
        options = result.options || options;
      }
    }

    const res = await fetch(url, options);

    // Apply Response Interceptors
    let finalResponse = res;
    for (const interceptor of this.interceptors.response) {
      const result = await interceptor(finalResponse);
      if (result) finalResponse = result;
    }

    if (!finalResponse.ok) {
      throw new Error(`HTTP ${finalResponse.status}`);
    }

    return await finalResponse.json();
  },

  get(path) {
    return this.request("GET", path);
  },

  post(path, body) {
    return this.request("POST", path, body);
  },

  put(path, body) {
    return this.request("PUT", path, body);
  },

  delete(path) {
    return this.request("DELETE", path);
  },
};

// ─── Default Interceptor (Time caching query param for GET) ──────
apiClient.useRequestInterceptor((url, options) => {
  if (options.method === "GET") {
    const separator = url.includes("?") ? "&" : "?";
    return {
      url: `${url}${separator}t=${Date.now()}`,
      options,
    };
  }
  return { url, options };
});

// Helper for logging and falling back to mocks
async function handleRequest(requestPromise, mockFallback) {
  try {
    return await requestPromise;
  } catch (error) {
    console.warn("[ReLoop API Client] Network request failed. Falling back to mockup service.", error.message);
    return typeof mockFallback === "function" ? mockFallback() : mockFallback;
  }
}

// ─── API Endpoints with Mock Fallbacks ───────────────────────────

// 1. Health
export const getHealth = () =>
  handleRequest(apiClient.get("/health"), { status: "ok" });

// 2. Users
export const registerUser = (data) =>
  handleRequest(apiClient.post("/users/register", data), { status: "ok", user_id: "user_priya_001" });

export const loginUser = (data) =>
  handleRequest(apiClient.post("/users/login", data), { status: "ok", token: "mock-token" });

export const getMe = () =>
  handleRequest(apiClient.get("/users/me"), {
    user_id: "user_priya_001",
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+91-9876543210",
    city: "Bengaluru",
  });

export const updateMe = (data) =>
  handleRequest(apiClient.put("/users/me", data), { status: "ok" });

export const getUserProfile = (userId) =>
  handleRequest(apiClient.get(`/users/${userId}`), {
    user_id: userId || "user_priya_001",
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+91-9876543210",
    city: "Bengaluru",
    green_credits: 320,
    tier: "Gold Leaf",
  });

export const updateUserProfile = (userId, data) =>
  handleRequest(apiClient.put(`/users/${userId}`, data), { status: "ok" });

// 3. Products
export const getProducts = () =>
  handleRequest(apiClient.get("/products"), mockProducts);

export const getProduct = (id) =>
  handleRequest(
    apiClient.get(`/products/${id}`),
    () => mockProducts.find((p) => p.product_id === id) || mockProducts[0]
  );

export const createProduct = (data) =>
  handleRequest(apiClient.post("/products", data), (payload) => ({ ...payload, product_id: `prod_${Date.now()}` }));

export const updateProduct = (id, data) =>
  handleRequest(apiClient.put(`/products/${id}`, data), { status: "ok" });

// 4. Returns
export const initiateReturn = (data) =>
  handleRequest(apiClient.post("/returns/initiate", data), {
    status: "ok",
    returnId: `RET-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    grade_by: "AI Vision Ingester",
  });

export const gradeReturn = (data) =>
  handleRequest(apiClient.post("/returns/grade", data), {
    status: "ok",
    grade: "Good",
    confidence: 0.94,
    grade_reason: "Minor cosmetic scratches on the back casing, but screen and battery health are excellent.",
    estimated_resale_value: 14500,
    green_credits_estimated: 120,
    co2_saved_kg: 45.2,
  });

export const disposeReturn = (data) =>
  handleRequest(apiClient.post("/returns/dispose", data), {
    status: "ok",
    disposition: data.disposition || "recycle",
    green_credits_awarded: 120,
    co2_saved_kg: 45.2,
    refund_amount: 14500,
    category: data.category || "electronics",
  });

export const completeReturn = (id, data) =>
  handleRequest(apiClient.post(`/returns/${id}/complete`, data), {
    status: "completed",
    refund: "₹14,500",
    refund_label: "Refunded to Amazon Pay Balance",
    credits: "+120",
    credits_label: "Green Credits Awarded",
    co2: "45.2 kg",
    co2_label: "CO2 Saved",
    productId: data.productId || "prod_samsung_m34_001",
  });

export const getReturn = (id) =>
  handleRequest(apiClient.get(`/returns/${id}`), {
    return_id: id,
    status: "Completed",
    product_name: "Samsung Galaxy M34 5G",
    refund_amount: 14500,
    green_credits: 120,
    co2_saved: 45.2,
  });

// 5. Recommendations
export const getSimilar = (productId) =>
  handleRequest(
    apiClient.get(`/recommendations/similar/${productId}`),
    () => mockProducts.filter((p) => p.product_id !== productId).slice(0, 3)
  );

export const getPersonalizedFeed = (userId) =>
  handleRequest(apiClient.get(`/recommendations/for/${userId}`), mockProducts.slice(0, 4));

export const gradeItem = (data) =>
  handleRequest(apiClient.post("/recommendations/grade", data), { status: "ok", score: 85 });

// 6. Prevention Nudges
export const getPreventionNudge = (userId, productId, reason = "") =>
  handleRequest(
    apiClient.get(`/prevention/${userId}/${productId}?return_reason=${encodeURIComponent(reason)}`),
    {
      suggest_fix: true,
      nudge_text: "Common return reason for this item is battery drain. Try updating the firmware first! 82% of users kept the item after this fix.",
      action_label: "Update Firmware Now",
    }
  );

// 7. Analytics
export const getAnalyticsOverview = () =>
  handleRequest(apiClient.get("/analytics/overview"), {
    total_returns: 231,
    saved_co2: 840.5,
    awarded_credits: 4200,
    reuse_rate: 74,
  });

export const getReturnsTrend = () =>
  handleRequest(apiClient.get("/analytics/returns-trend"), [
    { name: "Jan", returns: 20 },
    { name: "Feb", returns: 40 },
    { name: "Mar", returns: 35 },
    { name: "Apr", returns: 50 },
    { name: "May", returns: 42 },
    { name: "Jun", returns: 60 },
  ]);

export const getCategoryBreakdown = () =>
  handleRequest(apiClient.get("/analytics/category-breakdown"), [
    { name: "Electronics", value: 45 },
    { name: "Books", value: 15 },
    { name: "Appliances", value: 20 },
    { name: "Clothing", value: 20 },
  ]);

export const getSustainabilityMetrics = () =>
  handleRequest(apiClient.get("/analytics/sustainability"), {
    landfill_diverted_kg: 830,
    carbon_offsets_credits: 124,
    trees_equivalent: 42,
  });

// 8. AI Chat
export const sendChat = (data) =>
  handleRequest(apiClient.post("/ai/chat", data), {
    reply: "Hello! According to your verified product passport, you have saved 45.2 kg of CO2 by returning your items. Let me know if you want tips on shopping from Amazon Renewed!",
  });

export const analyzeReturn = (data) =>
  handleRequest(apiClient.post("/ai/analyze-return", data), {
    verdict: "Eligible for premium store credit return.",
    confidence: 0.98,
  });

export const gradeItemAI = (data) =>
  handleRequest(apiClient.post("/ai/grade-item", data), { grade: "Good", score: 92 });

// 9. Circular Passport & Dashboard
export const getPassport = (productId) =>
  handleRequest(apiClient.get(`/passport/${productId}`), {
    product_id: productId,
    name: mockProducts.find((p) => p.product_id === productId)?.name || "Samsung Galaxy M34 5G",
    brand: mockProducts.find((p) => p.product_id === productId)?.brand || "Samsung",
    grade: "Good",
    lifecycle: [
      { event: "Manufactured", date: "12 Oct 2025", location: "Noida, India", icon: "factory", details: "Carbon footprint: 70kg CO2" },
      { event: "Purchased", date: "24 Nov 2025", location: "Bengaluru, India", icon: "shopping", details: "Bought new on Amazon.in" },
      { event: "Graded by ReLoop", date: "15 March 2026", location: "Bengaluru, India", icon: "shield", details: "AI assessment: 94% score, Good condition" },
      { event: "Listed on Renewed", date: "16 March 2026", location: "Bengaluru, India", icon: "refresh", details: "Listed for resale at ₹14,500" },
    ],
    carbon_footprint: 70,
    carbon_saved: 45.2,
    owners_count: 2,
  });

export const getUserDashboard = (userId) =>
  handleRequest(apiClient.get(`/user/${userId}/dashboard`), {
    stats: {
      green_credits: 320,
      items_returned: 14,
      co2_saved_kg: 184.5,
      eco_rank: 84,
    },
    recent_activity: [
      { id: "act_1", type: "return", title: "Samsung M34 Returned", credits: 120, date: "12 June 2026", status: "Completed" },
      { id: "act_2", type: "purchase", title: "Bought Renewed XPS 15", credits: 200, date: "01 May 2026", status: "Verified" },
    ],
    rewards_unlocked: 4,
    active_tier: "Gold Leaf",
    tier_progress: 75,
  });

export const getCredits = (userId) =>
  handleRequest(apiClient.get(`/credits/${userId}`), { green_credits: 320 });

export const redeemCredits = (userId, rewardId) =>
  handleRequest(apiClient.post(`/credits/${userId}/redeem`, { reward_id: rewardId }), {
    status: "ok",
    code: `RELOOP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
  });

export const convertCredits = (userId, amount) =>
  handleRequest(apiClient.post(`/credits/${userId}/convert`, { amount }), {
    status: "ok",
    converted_amount: Math.floor(amount / 10),
  });

export const getRewardCatalogue = () =>
  handleRequest(apiClient.get("/credits/catalogue/rewards"), [
    { id: "rew_1", title: "₹100 Amazon Pay Gift Card", cost: 1000, description: "Instant cash conversion" },
    { id: "rew_2", title: "Free E-Waste Collection", cost: 200, description: "Doorstep recycling pickup" },
  ]);

// 10. Recommendations & Buyer Targeting (Double-checked mappings)
export const getBuyerDemand = (productId) =>
  handleRequest(apiClient.get(`/recommendations/buyer-demand/${productId}`), { demand_level: "High", active_buyers: 27 });

export const getSimilarRefurbished = (productId) =>
  handleRequest(
    apiClient.get(`/recommendations/similar/${productId}`),
    () => mockProducts.filter((p) => p.product_id !== productId).slice(0, 3)
  );

export const getPersonalisedFeed = (userId) =>
  handleRequest(apiClient.get(`/recommendations/for/${userId}`), mockProducts.slice(0, 4));
