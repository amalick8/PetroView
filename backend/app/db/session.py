from sqlmodel import SQLModel, Session, create_engine

from app.core.config import settings

engine = create_engine(settings.database_url, echo=False)


def init_db() -> None:
    if settings.demo_mode:
        return
    SQLModel.metadata.create_all(engine)


def get_session() -> Session:
    return Session(engine)
