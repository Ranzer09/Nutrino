from datetime import datetime
from typing import Dict, Optional
from sqlalchemy import String, Float, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base_class import Base

class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    barcode: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)

    name: Mapped[str] = mapped_column(String, nullable=False)
    category: Mapped[str] = mapped_column(String, nullable=False)
    brand: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    energy_kcal: Mapped[Optional[float]] = mapped_column(Float, nullable=True, default=None)
    fat: Mapped[Optional[float]] = mapped_column(Float, nullable=True, default=None)
    saturated_fat: Mapped[Optional[float]] = mapped_column(Float, nullable=True, default=None)
    sugars: Mapped[Optional[float]] = mapped_column(Float, nullable=True, default=None)
    salt: Mapped[Optional[float]] = mapped_column(Float, nullable=True, default=None)
    protein: Mapped[Optional[float]] = mapped_column(Float, nullable=True, default=None)
    fiber: Mapped[Optional[float]] = mapped_column(Float, nullable=True, default=None)
    sodium: Mapped[Optional[float]] = mapped_column(Float, nullable=True, default=None)
    carbs: Mapped[Optional[float]] = mapped_column(Float, nullable=True, default=None)

    serving_size: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    serving_quantity: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    image_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    nutriscore: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    nutrition_analysis: Mapped[Optional[Dict]] = mapped_column(JSON, nullable=True)
    insights: Mapped[Optional[Dict]] = mapped_column(JSON, nullable=True)
    ingredients_text: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    ingredient_analysis: Mapped[Optional[Dict]] = mapped_column(JSON, nullable=True)
    
    analysis_version: Mapped[int] = mapped_column(default=1)
    cached_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.now
    )