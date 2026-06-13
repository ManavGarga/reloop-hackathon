from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from config import ALLOWED_ORIGINS
from database import connect_db, close_db

# Route imports (placeholders — Person 1 will flesh these out)
from routes import products, returns, recommendations, analytics, ai_chat, users


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await close_db()


app = FastAPI(
    title="ReLoop API",
    description="Sustainable Returns & Recommerce Platform",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(returns.router, prefix="/api/returns", tags=["returns"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["recommendations"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])
app.include_router(ai_chat.router, prefix="/api/ai", tags=["ai"])


@app.get("/api/health")
async def health_check():
    return {"status": "ok", "project": "ReLoop"}
