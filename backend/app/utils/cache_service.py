from datetime import datetime, timedelta
from app.db.session import get_settings
from app.models.product import Product

settings = get_settings()

Analysis_verison= settings.ANALYSIS_VERSION
Cache_days = settings.CACHE_DAYS


def needs_refresh(product: Product) -> bool:
    """ This prevents stale insights while respecting your performance goals.
    """
    if not product:
        return True  

    is_expired = datetime.now() - product.cached_at > timedelta(days=settings.CACHE_DAYS)

    version_mismatch = product.analysis_version != settings.ANALYSIS_VERSION

    missing_analysis = (
        not product.nutrition_analysis 
        or not isinstance(product.nutrition_analysis, dict)
        or not product.insights
        or not isinstance(product.insights, dict)
    )

    if product.nutrition_analysis and isinstance(product.nutrition_analysis, dict):
        serving_qty = product.nutrition_analysis.get("serving_quantity")
        if serving_qty is None and product.serving_size: 
            missing_analysis = True

    should_refresh = is_expired or version_mismatch or missing_analysis

    return should_refresh