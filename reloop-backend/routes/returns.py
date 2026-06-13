from fastapi import APIRouter

router = APIRouter()

# TODO (Person 1): Implement return initiation, tracking, decision engine
# POST /api/returns               → initiate return
# GET  /api/returns/{id}          → get return status
# PUT  /api/returns/{id}/decision → approve/reject/refurbish
# GET  /api/returns/user/{uid}    → user's return history
