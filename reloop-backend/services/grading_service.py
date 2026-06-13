"""
services/grading_service.py
Mock deterministic AI grading service.
Uses return_id + image_url as entropy for varied but reproducible results.
Takes exactly 2.5s to match frontend loading animation.
"""

import asyncio
import hashlib
import time
from typing import Optional

# Category-aware flaw library
FLAW_LIBRARY = {
    "electronics": [
        "Minor scratches on back panel",
        "Small screen scuff (non-functional)",
        "Slight discoloration near charging port",
        "Battery health at 87%",
        "Loose volume button",
        "Camera lens micro-scratch",
        "Speaker grille dust accumulation",
        "Bent SIM tray pin",
    ],
    "clothing": [
        "Slight colour fading on collar",
        "Minor pilling on fabric surface",
        "Small snag on inner lining",
        "Loose thread at hem",
        "Button slightly misaligned",
        "Faint crease marks (iron-removable)",
        "Wash label partially detached",
        "Slight stretch at waistband",
    ],
    "books": [
        "Dog-eared pages at chapter 3",
        "Faint pencil annotations",
        "Slight moisture warp on back cover",
        "Spine crease from heavy reading",
        "Yellow tinge on page edges",
        "Sticker residue on cover",
    ],
    "appliances": [
        "Light limescale deposits on heating element",
        "Minor cosmetic dent on side panel",
        "Rubber seal slightly worn",
        "Control knob stiff to turn",
        "Small scratch on glass bowl",
        "Filter partially clogged",
        "Cable minor fraying near plug",
    ],
    "general": [
        "General wear and tear",
        "Minor surface scratches",
        "Small cosmetic blemish",
        "Slight discoloration",
    ],
}

CONDITION_MAP = [
    (88, "like_new",  "Excellent"),
    (72, "good",      "Good"),
    (52, "fair",      "Fair"),
    (30, "poor",      "Poor"),
    (0,  "damaged",   "Damaged"),
]


def _get_entropy_score(return_id: str, image_url: Optional[str], description: Optional[str]) -> int:
    """Deterministic 0–100 score from inputs."""
    seed = f"{return_id}:{image_url or 'no_image'}:{description or 'no_desc'}"
    h = hashlib.sha256(seed.encode()).hexdigest()
    # Use first 8 hex chars → 0 to 4294967295, map to 28–96
    raw = int(h[:8], 16)
    return 28 + (raw % 69)          # 28 – 96 range avoids extreme edges


def _pick_flaws(category: str, grade_score: int, seed_int: int) -> list[dict]:
    """Pick 1–4 flaws appropriate to condition severity."""
    flaws = FLAW_LIBRARY.get(category, FLAW_LIBRARY["general"])
    num_flaws = max(1, min(4, (100 - grade_score) // 18))
    chosen = []
    for i in range(num_flaws):
        idx = (seed_int + i * 7) % len(flaws)
        severity = "minor" if grade_score >= 65 else ("moderate" if grade_score >= 45 else "significant")
        chosen.append({"flaw": flaws[idx], "severity": severity})
    return chosen


async def grade_item(
    return_id: str,
    category: str,
    image_url: Optional[str] = None,
    description: Optional[str] = None,
) -> dict:
    """
    Simulate AI image analysis grading.
    Sleeps 2.5s to match frontend loading animation.
    """
    t_start = time.monotonic()
    await asyncio.sleep(2.5)

    grade_score = _get_entropy_score(return_id, image_url, description)
    seed_int = int(hashlib.md5(return_id.encode()).hexdigest()[:8], 16)

    # Map score → condition
    condition = "damaged"
    condition_label = "Damaged"
    for threshold, cond, label in CONDITION_MAP:
        if grade_score >= threshold:
            condition = cond
            condition_label = label
            break

    flaws = _pick_flaws(category, grade_score, seed_int)
    confidence = round(0.72 + (seed_int % 23) / 100, 2)   # 0.72 – 0.94

    processing_time_ms = round((time.monotonic() - t_start) * 1000)

    return {
        "grade_score": grade_score,
        "condition": condition,
        "condition_label": condition_label,
        "confidence": confidence,
        "flaw_breakdown": flaws,
        "processing_time_ms": processing_time_ms,
        "graded_by": "ReLoop Vision AI v1.0 (mock)",
    }
