from sqlalchemy.orm import Session

from app.models.product import Product


def get_product_by_barcode(db: Session, barcode: str) -> Product | None:
    """
    Check database cache for product.
    """

    return db.query(Product).filter(Product.barcode == barcode).first()


def create_product(db: Session, data: dict) -> Product:
    """
    Save new product to database.
    """

    product = Product(**data)

    db.add(product)
    db.commit()
    db.refresh(product)

    return product