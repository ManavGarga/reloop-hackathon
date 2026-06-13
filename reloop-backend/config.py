from dotenv import load_dotenv
import os

load_dotenv()

# MongoDB
MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017/reloop")
DB_NAME: str = os.getenv("DB_NAME", "reloop")

# Anthropic
ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")

# App
APP_ENV: str = os.getenv("APP_ENV", "development")
SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-dev-key-change-in-prod")
ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

# CORS
ALLOWED_ORIGINS: list[str] = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://*.vercel.app",
]
