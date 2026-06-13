from fastapi import APIRouter

router = APIRouter()

# TODO (Person 1): User auth — register, login, profile
# POST /api/users/register  → create account
# POST /api/users/login     → returns JWT
# GET  /api/users/me        → current user profile (auth required)
# PUT  /api/users/me        → update profile
