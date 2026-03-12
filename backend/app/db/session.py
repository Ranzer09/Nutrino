from urllib.parse import quote_plus
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import Settings, settings
from dotmap import DotMap

db = {}
for key, value in vars(settings).items():
    if key.startswith("db_"):   
       _key = key.replace("db_", "")
       db[_key] = value
db = DotMap(db)

dialect = 'postgresql'
password = quote_plus(db.password)
SQLALCHEMY_DATABASE_URL = f'{dialect}://{db.user}:{password}@{db.host}:{db.port}/{db.name}'

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    echo=True,  
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_settings():
    return Settings()