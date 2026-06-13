// ReLoop API client
// All functions return mock data for now — Person 2 will wire real calls

const BASE = "http://localhost:8000/api"

async function request(method, path, body = null) {
  try {
    const separator = path.includes("?") ? "&" : "?";
    const url = `${BASE}${path}${method === "GET" ? `${separator}t=${Date.now()}` : ""}`;
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn(`[ReLoop API] ${method} ${path} failed:`, e.message);
    return {};
  }
}

// ─── Health ───────────────────────────────────────────────
export const getHealth = () => request("GET", "/health")

// ─── Users ────────────────────────────────────────────────
export const registerUser = (data) => request("POST", "/users/register", data)
export const loginUser    = (data) => request("POST", "/users/login", data)
export const getMe        = ()     => request("GET",  "/users/me")
export const updateMe     = (data) => request("PUT",  "/users/me", data)

// ─── Products ─────────────────────────────────────────────
export const getProducts   = ()     => request("GET",  "/products")
export const getProduct    = (id)   => request("GET",  `/products/${id}`)
export const createProduct = (data) => request("POST", "/products", data)
export const updateProduct = (id, data) => request("PUT", `/products/${id}`, data)

// ─── Returns ──────────────────────────────────────────────
export const initiateReturn      = (data) => request("POST", "/returns/initiate", data)
export const gradeReturn         = (data) => request("POST", "/returns/grade", data)
export const disposeReturn       = (data) => request("POST", "/returns/dispose", data)
export const completeReturn      = (id, data) => request("POST", `/returns/${id}/complete`, data)
export const getReturn           = (id)   => request("GET",  `/returns/${id}`)

// ─── Recommendations ──────────────────────────────────────
export const getSimilar          = (productId) => request("GET", `/recommendations/similar/${productId}`)
export const getPersonalizedFeed = (userId)    => request("GET", `/recommendations/for/${userId}`)
export const gradeItem           = (data)      => request("POST", "/recommendations/grade", data)

// ─── Analytics ────────────────────────────────────────────
export const getAnalyticsOverview     = () => request("GET", "/analytics/overview")
export const getReturnsTrend          = () => request("GET", "/analytics/returns-trend")
export const getCategoryBreakdown     = () => request("GET", "/analytics/category-breakdown")
export const getSustainabilityMetrics = () => request("GET", "/analytics/sustainability")

// ─── AI Chat ──────────────────────────────────────────────
export const sendChat        = (data) => request("POST", "/ai/chat", data)
export const analyzeReturn   = (data) => request("POST", "/ai/analyze-return", data)
export const gradeItemAI     = (data) => request("POST", "/ai/grade-item", data)

// ─── Circular Passport & Dashboard ─────────────────────────
export const getPassport = (productId) => request("GET", `/passport/${productId}`)
export const getUserDashboard = (userId) => request("GET", `/user/${userId}/dashboard`)
export const getCredits = (userId) => request("GET", `/credits/${userId}`)
export const redeemCredits = (userId, rewardId) => request("POST", `/credits/${userId}/redeem`, { reward_id: rewardId })
export const getRewardCatalogue = () => request("GET", `/credits/catalogue/rewards`)

// ─── Recommendations & Buyer Targeting ──────────────────────
export const getBuyerDemand = (productId) => request("GET", `/recommendations/buyer-demand/${productId}`)
export const getSimilarRefurbished = (productId) => request("GET", `/recommendations/similar/${productId}`)
export const getPersonalisedFeed = (userId) => request("GET", `/recommendations/for/${userId}`)

