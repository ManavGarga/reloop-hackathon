from mangum import Mangum
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from config import ALLOWED_ORIGINS
from database import connect_db, close_db
from seed_data import seed_if_empty

# ── Routers ──────────────────────────────────────────────────────
from routes import products, recommendations, analytics, ai_chat, users
from routes import returns, passport, credits, user_dashboard, prevention, demo


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    await seed_if_empty()          # idempotent — only seeds if collections are empty
    yield
    await close_db()


app = FastAPI(
    title="ReLoop API",
    description="Sustainable Returns & Recommerce Platform",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ─────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Mount Routers ─────────────────────────────────────────────────
app.include_router(users.router,           prefix="/api/users",           tags=["users"])
app.include_router(products.router,        prefix="/api/products",        tags=["products"])
app.include_router(returns.router,         prefix="/api/returns",         tags=["returns"])
app.include_router(passport.router,        prefix="/api/passport",        tags=["passport"])
app.include_router(credits.router,         prefix="/api/credits",         tags=["credits"])
app.include_router(user_dashboard.router,  prefix="/api/user",            tags=["user"])
app.include_router(prevention.router,      prefix="/api/prevention",      tags=["prevention"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["recommendations"])
app.include_router(analytics.router,       prefix="/api/analytics",       tags=["analytics"])
app.include_router(ai_chat.router,         prefix="/api/ai",              tags=["ai"])
app.include_router(demo.router,            prefix="/api/demo",            tags=["demo"])


# ── Health ───────────────────────────────────────────────────────
@app.get("/api/health", tags=["health"])
async def health_check():
    return {"status": "ok", "project": "ReLoop"}

# AWS Lambda Handler
handler = Mangum(app)
