from app.services.nutrition_analysis import analyze_nutrition
from app.services.nutrition_insights import generate_nutrition_insights
from app.db.session import get_settings

settings = get_settings()
ANALYSIS_VERSION = settings.ANALYSIS_VERSION



def compute_analysis(data: dict):
    """Only returns what belongs in the Product model."""
    serving_quantity = data.get("serving_quantity")
    serving_size = data.get("serving_size")
    nutrition = analyze_nutrition(data, serving_size=serving_size, serving_quantity=serving_quantity)
    insights = generate_nutrition_insights(nutrition,data.get("energy_kcal"))

    return {
        "nutrition_analysis": nutrition,      
        "insights": insights,
        "analysis_version": ANALYSIS_VERSION,
    }