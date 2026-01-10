from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import numpy as np

# Load Model
with open("job_role_model.pkl", "rb") as f:
    model = pickle.load(f)

app = FastAPI(
    title="Career Skill Matching API",
    description="Predict job placement / role using trained ML model",
    version="1.0"
)

# Input schema
class JobInput(BaseModel):
    ssc_p: float
    hsc_p: float
    degree_p: float
    workex: int           # 0/1
    etest_p: float
    mba_p: float

@app.post("/predict")
async def predict_role(data: JobInput):
    # Convert input to numpy array
    X = np.array([[data.ssc_p, data.hsc_p, data.degree_p,
                   data.workex, data.etest_p, data.mba_p]])

    # Make prediction
    pred = model.predict(X)

    # Optional: probability
    try:
        proba = model.predict_proba(X).tolist()
    except:
        proba = None

    return {
        "prediction": pred[0],
        "probabilities": proba
    }
