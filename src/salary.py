from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import pickle

# Load trained model (.pkl)
with open("gradient_boosting_salary.pkl", "rb") as f:
    model = pickle.load(f)

# FastAPI app
app = FastAPI()

# Request body structure
class SalaryInput(BaseModel):
    age: float
    gender: str
    education: str
    job_title: str
    experience: float

# Dummy encoders for categorical features (match training encoding)
gender_map = {"Male": 1, "Female": 0}
education_map = {"Bachelor's": 1, "Master's": 2, "PhD": 3}
job_map = {
    "Software Engineer": 1,
    "Data Analyst": 2,
    "Senior Manager": 3,
    "Sales Associate": 4,
    "Director": 5
}

@app.post("/predict_salary")
def predict_salary(data: SalaryInput):
    # Convert categorical to numeric (same scheme as training)
    g = gender_map.get(data.gender, 0)
    e = education_map.get(data.education, 0)
    j = job_map.get(data.job_title, 0)

    # Create input vector
    features = np.array([[data.age, g, e, j, data.experience]])

    # Predict salary
    prediction = model.predict(features)[0]

    return {"predicted_salary": float(prediction)}
