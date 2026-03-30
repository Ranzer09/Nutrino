from sqlalchemy.orm import Session
from app.models.product import Product
from typing import Dict, Any

def get_product_by_barcode(db: Session, barcode: str) -> Product | None:
    """Check database cache for product."""
    return db.query(Product).filter(Product.barcode == barcode).first()


def _sanitize_product_data(data: Dict[str, Any]) -> Dict[str, Any]:
    """Replace missing critical fields with safe defaults."""
    sanitized = data.copy()
    
    sanitized["name"] = sanitized.get("name") or "Unknown Product"
    sanitized["category"] = sanitized.get("category") or "Uncategorized"
    
    numeric_fields = [
        "energy_kcal", "fat", "saturated_fat", "sugars", "salt",
        "protein", "fiber", "sodium", "carbs", "serving_quantity"
    ]
    for field in numeric_fields:
        if field not in sanitized or sanitized[field] is None:
            sanitized[field] = None 
    
    optional_strings = ["brand","image_url", "nutriscore", "serving_size", "ingredients_text"]
    for field in optional_strings:
        if field not in sanitized:
            sanitized[field] = None
    
    return sanitized


def create_product(db: Session, data: Dict[str, Any]) -> Product:
    """Create new product with safe sanitization."""
    safe_data = _sanitize_product_data(data)
    
    product = Product(**safe_data)  

    db.add(product)
    db.commit()
    db.refresh(product)

    return product


def update_product(db: Session, product: Product, data: Dict[str, Any]) -> Product:
    """Update existing product safely."""
    safe_data = _sanitize_product_data(data)
    
    for key, value in safe_data.items():
        if hasattr(product, key):
            setattr(product, key, value)

    db.commit()
    db.refresh(product)

    return product