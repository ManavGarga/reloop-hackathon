"""
services/carbon_service.py
Carbon footprint calculations, savings by disposition route,
and human-readable equivalence comparisons.

Sources: Product Environmental Impact Studies (EPA 2023),
         Ellen MacArthur Foundation Circular Economy Report 2022.
"""

# ── Default manufacturing carbon footprints (kg CO₂e) by category ─────────────
CATEGORY_FOOTPRINTS: dict[str, float] = {
    "electronics": 55.0,    # avg phone/tablet; laptops ~350, earbuds ~5
    "clothing":    22.0,    # denim ~33, t-shirt ~7, jacket ~22
    "books":        1.2,
    "appliances":  18.5,    # small kitchen appliances avg
    "furniture":   80.0,
    "general":     10.0,
}

# ── Fraction of manufacturing CO₂ saved per disposition ──────────────────────
SAVINGS_MULTIPLIERS: dict[str, float] = {
    "refurbish":  0.70,     # replaces need for new item for next owner
    "p2p":        0.60,     # extends life, defers new purchase
    "ngo_donate": 0.50,     # extends life but transport adds back ~10%
    "recycle":    0.25,     # material recovery saves mining/processing
    "landfill":   0.03,     # negligible
}

SOURCE_CITATION = (
    "Source: EPA Product Carbon Footprint Guidelines 2023 & "
    "Ellen MacArthur Foundation Circular Economy Report 2022"
)

# ── Equivalence baselines ─────────────────────────────────────────────────────
# Each entry: (label, kg_co2_per_unit, unit_singular, unit_plural)
EQUIVALENCES = [
    ("tree-years of absorption",  21.0,   "year",     "years"),
    ("km driven in a petrol car",  0.12,  "km",       "km"),
    ("plastic bags produced",      0.008, "bag",      "bags"),
    ("hours of TV streaming",      0.07,  "hour",     "hours"),
    ("smartphone fully charged",   0.005, "charge",   "charges"),
    ("cups of coffee produced",    0.21,  "cup",      "cups"),
]


def calculate_savings(
    category: str,
    disposition: str,
    carbon_footprint_override: float = 0.0,
) -> dict:
    """
    Calculate CO₂ saved for a given disposal route.

    Args:
        category: product category key
        disposition: disposal route key
        carbon_footprint_override: if > 0, use this instead of category default
    """
    base_kg = carbon_footprint_override if carbon_footprint_override > 0 else \
              CATEGORY_FOOTPRINTS.get(category, CATEGORY_FOOTPRINTS["general"])

    multiplier = SAVINGS_MULTIPLIERS.get(disposition, 0.0)
    co2_saved_kg = round(base_kg * multiplier, 2)
    co2_wasted_kg = round(base_kg - co2_saved_kg, 2)

    equivalence = get_equivalence(co2_saved_kg)

    return {
        "co2_saved_kg":          co2_saved_kg,
        "co2_wasted_kg":         co2_wasted_kg,
        "base_footprint_kg":     base_kg,
        "savings_percent":       round(multiplier * 100),
        "equivalence":           equivalence,
        "source_citation":       SOURCE_CITATION,
    }


def get_equivalence(co2_kg: float) -> dict:
    """
    Pick the most human-readable equivalence for a given CO₂ amount.
    Prefers values between 0.5 and 50 units for legibility.
    """
    best = None
    best_units = None
    best_label = None
    best_score = float("inf")

    for label, per_unit, singular, plural in EQUIVALENCES:
        units = co2_kg / per_unit
        # Prefer values in the sweet-spot range 0.5–50
        if 0.5 <= units <= 50:
            score = abs(units - 5)       # closest to 5 units wins
            if score < best_score:
                best_score = score
                best_units = round(units, 1)
                best_label = label
                best = (label, per_unit, singular, plural)

    # Fallback: just use trees
    if best is None:
        units = round(co2_kg / 21.0, 2)
        best_units = units
        best_label = "tree-years of absorption"
        best = ("tree-years of absorption", 21.0, "year", "years")

    _, _, singular, plural = best
    unit_word = plural if best_units != 1.0 else singular

    return {
        "value":       best_units,
        "unit":        unit_word,
        "label":       best_label,
        "description": f"Equivalent to {best_units} {unit_word} of {best_label}",
    }
