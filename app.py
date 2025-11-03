from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from src.model.pipeline import pipeline

app = FastAPI(title="Fourier Epicycle API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Fourier Epicycle API"}

@app.post("/api/fourier-data")
async def get_fourier_data(
    file: UploadFile = File(...),
    n_circles: int = Form(100)
):
    temp_path = f"temp_{file.filename}"
    try:
        with open(temp_path, "wb") as f:
            f.write(await file.read())
        result = pipeline(image_path=temp_path, n_circles=n_circles)
        os.remove(temp_path)
        circles = [
            [
                float(result['magnitude'][i]),
                float(result['frequencies'][i]),
                float(result['phases'][i])
            ]
            for i in range(len(result['frequencies']))
        ]
        return {"circles": circles, "success": True}
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return JSONResponse(
            status_code=500,
            content={"error": str(e), "success": False}
        )