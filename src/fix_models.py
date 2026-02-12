
import pandas as pd
import numpy as np
import joblib
import os
from sklearn.ensemble import GradientBoostingRegressor, RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler, LabelEncoder

def train_salary_model():
    print(" Training Salary Model...")
    # Features: Age, Gender(0/1), Education(1-3), Job(1-5), Experience
    # Synthetic Data
    n_samples = 1000
    X = np.random.rand(n_samples, 5)
    X[:, 0] = np.random.randint(20, 60, n_samples) # Age
    X[:, 1] = np.random.randint(0, 2, n_samples)   # Gender
    X[:, 2] = np.random.randint(1, 4, n_samples)   # Education
    X[:, 3] = np.random.randint(1, 6, n_samples)   # Job
    X[:, 4] = np.random.randint(0, 40, n_samples)  # Experience

    # Target: Salary = Base + Exp*2000 + Edu*5000 + Job*10000 + Noise
    y = 30000 + (X[:, 4] * 2000) + (X[:, 2] * 5000) + (X[:, 3] * 10000) + np.random.normal(0, 5000, n_samples)

    model = GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, max_depth=3, random_state=42)
    model.fit(X, y)

    # Save
    path = os.path.abspath('src/gradient_boosting_salary.pkl')
    joblib.dump(model, path)
    print(f"✅ Salary Model Saved to {path}")

def train_domain_fit_model():
    print(" Training Domain Fit Model...")
    # Features: Age, Acad, Certs, Intern, Skill1, Skill2, Skill3
    n_samples = 1000
    X = pd.DataFrame({
        'Age': np.random.randint(18, 30, n_samples),
        'Academic_Performance': np.random.uniform(6.0, 10.0, n_samples),
        'Certifications_Count': np.random.randint(0, 5, n_samples),
        'Internship_Experience': np.random.randint(0, 3, n_samples),
        'Skill_1': np.random.randint(0, 10, n_samples),
        'Skill_2': np.random.randint(0, 10, n_samples),
        'Skill_3': np.random.randint(0, 10, n_samples)
    })

    # Target Logic
    domains = ['Data Science', 'Web Development', 'Android Development', 'Machine Learning']
    y_idx = (X['Skill_1'] + X['Skill_2'] + X['Skill_3']) % len(domains)
    y = [domains[int(i)] for i in y_idx]

    # Encoder
    le = LabelEncoder()
    y_encoded = le.fit_transform(y)

    # Model
    model = RandomForestClassifier(n_estimators=50, random_state=42)
    model.fit(X, y_encoded)

    # Save
    path_model = os.path.abspath('src/domain_fit_model.pkl')
    path_enc = os.path.abspath('src/domain_fit_encoder.pkl')
    
    joblib.dump(model, path_model)
    joblib.dump(le, path_enc)
    print(f"✅ Domain Fit Model & Encoder Saved to {path_model}")

def train_job_role_model():
    print(" Training Job Role Model...")
    
    n_samples = 1000
    data = {
        'gender': np.random.choice(['M', 'F'], n_samples),
        'ssc_p': np.random.uniform(50, 95, n_samples),
        'ssc_b': np.random.choice(['Others', 'Central'], n_samples),
        'hsc_p': np.random.uniform(50, 95, n_samples),
        'hsc_b': np.random.choice(['Others', 'Central'], n_samples),
        'hsc_s': np.random.choice(['Commerce', 'Science', 'Arts'], n_samples),
        'degree_p': np.random.uniform(50, 95, n_samples),
        'degree_t': np.random.choice(['Sci&Tech', 'Comm&Mgmt', 'Others'], n_samples),
        'workex': np.random.choice(['Yes', 'No'], n_samples),
        'etest_p': np.random.uniform(50, 95, n_samples),
        'specialisation': np.random.choice(['Mkt&HR', 'Mkt&Fin'], n_samples),
        'mba_p': np.random.uniform(50, 95, n_samples)
    }
    df = pd.DataFrame(data)

    # Synthetic Target
    roles = ['Data Scientist', 'Business Analyst', 'Software Developer', 'Sales Executive', 'HR Manager']
    y = np.random.choice(roles, n_samples)

    # Preprocessing Pipeline
    categorical_features = ['gender', 'ssc_b', 'hsc_b', 'hsc_s', 'degree_t', 'workex', 'specialisation']
    numeric_features = ['ssc_p', 'hsc_p', 'degree_p', 'etest_p', 'mba_p']

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ])

    pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
    ])

    pipeline.fit(df, y)

    # Save
    path = os.path.abspath('src/job_role_model.pkl')
    joblib.dump(pipeline, path)
    print(f"✅ Job Role Model Saved to {path}")

if __name__ == "__main__":
    current_dir = os.getcwd()
    print(f"Working Directory: {current_dir}")
    
    if not os.path.exists('src'):
        os.makedirs('src')
        
    try:
        train_salary_model()
    except Exception as e:
        print(f"❌ Error training Salary Model: {e}")

    try:
        train_domain_fit_model()
    except Exception as e:
        print(f"❌ Error training Domain Fit Model: {e}")

    try:
        train_job_role_model()
    except Exception as e:
        print(f"❌ Error training Job Role Model: {e}")
        
    print("\n🎉 All models processed.")
