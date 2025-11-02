from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import uvicorn

from .model.pipeline import pipeline

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

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/process-image/")
async def process_image(
    file: UploadFile = File(...),
    n_circles: int = Form(100),
    edge_threshold: int = Form(100)
):
    temp_path = f"temp_{file.filename}"
    try:
        with open(temp_path, "wb") as f:
            f.write(await file.read())
        result = pipeline(
            image_path=temp_path,
            n_circles=n_circles,
            edge_threshold=edge_threshold
        )
        os.remove(temp_path)
        return {
            "frequencies": result["frequencies"].tolist(),
            "amplitudes": result["magnitude"].tolist(),
            "phases": result["phases"].tolist(),
        }
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return JSONResponse(
            status_code=500,
            content={"error": f"Processing failed: {str(e)}"}
        )

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)