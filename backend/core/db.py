from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from core.config import settings

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI), echo=True) # echo -> prints SQL
Session = sessionmaker(bind=engine)
Base = declarative_base()

