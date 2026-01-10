from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import pickle

# Load model & encoder
with open("domain_fit_model.pkl", "rb") as f:
    model = pickle.load(f)

with open("domain_fit_encoder.pkl", "rb") as f:
    encoder = pickle.load(f)

app = FastAPI()

class DomainFitInput(BaseModel):
    Age: float
    Gender: str
    Vocational_Program: str
    Academic_Performance: float
    Certifications_Count: int
    Internship_Experience: int
    Skill_1: int
    Skill_2: int
    Skill_3: int

@app.post("/predict_domain_fit")
def predict_domain(data: DomainFitInput):

    # Convert to model input format
    features = np.array([[
        data.Age,
        data.Academic_Performance,
        data.Certifications_Count,
        data.Internship_Experience,
        data.Skill_1, data.Skill_2, data.Skill_3
    ]])

    # Predict encoded label
    pred = model.predict(features)[0]

    # Decode to actual class label
    domain = encoder.inverse_transform([pred])[0]

    # Confidence score
    prob = model.predict_proba(features)[0][pred]

    return {
        "domain_fit": domain,
        "confidence": float(prob)
    }
