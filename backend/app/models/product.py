from datetime import datetime
from sqlalchemy import String, Float, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Product(Base):
    """
    Database table for storing scanned product data.
    This acts as a cache for OpenFoodFacts responses.
    """

    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    barcode: Mapped[str] = mapped_column(String, unique=True, index=True)

    name: Mapped[str] = mapped_column(String)
    brand: Mapped[str] = mapped_column(String)

    energy_kcal: Mapped[float] = mapped_column(Float, nullable=True)
    fat: Mapped[float] = mapped_column(Float, nullable=True)
    saturated_fat: Mapped[float] = mapped_column(Float, nullable=True)
    sugars: Mapped[float] = mapped_column(Float, nullable=True)
    salt: Mapped[float] = mapped_column(Float, nullable=True)
    protein: Mapped[float] = mapped_column(Float, nullable=True)
    fiber: Mapped[float] = mapped_column(Float, nullable=True)

    image_url: Mapped[str] = mapped_column(String, nullable=True)

    nutriscore: Mapped[str] = mapped_column(String, nullable=True)

    cached_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.now
    )