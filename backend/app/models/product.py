from datetime import datetime
from typing import Optional
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

    barcode: Mapped[str] = mapped_column(String,unique=True,index=True,nullable=False)

    name: Mapped[str] = mapped_column(String, nullable=False)     
    brand: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    energy_kcal: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    fat: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    saturated_fat: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    sugars: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    salt: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    protein: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    fiber: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    image_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    nutriscore: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    cached_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.now
    )