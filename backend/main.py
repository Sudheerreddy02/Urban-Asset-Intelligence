from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from api.routes import router as api_router

# Initialize FastAPI App
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="High-performance CV backend for Urban Asset Intelligence",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS middleware for the Next.js frontend
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Connect routing
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {"status": "ok", "message": f"{settings.PROJECT_NAME} API is Operational."}

if __name__ == "__main__":
    import uvicorn
    # Make sure this runs from the backend root directory
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
