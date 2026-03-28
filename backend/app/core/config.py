from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "PetroView API"
    api_v1_prefix: str = "/api/v1"
    environment: str = "development"

    # Database
    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/petroview"

    # Auth (Clerk)
    clerk_jwks_url: str = ""
    clerk_issuer: str = ""
    clerk_audience: str = ""
    dev_auth_bypass: bool = False

    # Supabase
    supabase_url: str = ""
    supabase_service_role_key: str = ""

    # Data and storage
    data_dir: str = "./data"

    # External data sources
    owid_energy_url: str = "https://raw.githubusercontent.com/owid/energy-data/master/owid-energy-data.csv"
    fred_wti_url: str = "https://fred.stlouisfed.org/graph/fredgraph.csv?id=DCOILWTICO"

    # AI
    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
