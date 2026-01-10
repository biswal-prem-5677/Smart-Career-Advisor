from fastapi import FastAPI
from pydantic import BaseModel
import pickle
import numpy as np

# Load Model
with open("skill_recommender.pkl", "rb") as f:
    model = pickle.load(f)

app = FastAPI(
    title="Skill & Job Match API",
    description="Predicts job match for a student based on skills and job requirements",
    version="1.0"
)

class MatchInput(BaseModel):
    age: int
    academic_performance: float
    certifications_count: int
    internship_experience: int
    skill_1: int
    skill_2: int
    skill_3: int
    required_skill_1: int
    required_skill_2: int
    required_skill_3: int
    required_skill_4: int
    required_skill_5: int
    min_experience_months: int

@app.post("/predict_match")
def predict_match(data: MatchInput):
    X = np.array([[data.age, 
                   data.academic_performance,
                   data.certifications_count,
                   data.internship_experience,
                   data.skill_1,
                   data.skill_2,
                   data.skill_3,
                   data.required_skill_1,
                   data.required_skill_2,
                   data.required_skill_3,
                   data.required_skill_4,
                   data.required_skill_5,
                   data.min_experience_months]])

    pred = model.predict(X)[0]
    
    return {
        "match": int(pred),
        "match_label": "Matched" if pred == 1 else "Not Matched"
    }
