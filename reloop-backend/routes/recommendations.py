from fastapi import APIRouter

router = APIRouter()

# TODO (Person 1): Claude-powered recommendation engine
# GET /api/recommendations/similar/{product_id}   → similar refurbished items
# GET /api/recommendations/for/{user_id}          → personalised feed
# POST /api/recommendations/grade                 → AI grading from image/desc
