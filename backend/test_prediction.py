import pandas as pd

class MockPipeline:
    def predict_proba(self, data):
        # Simple logic: If CGPA > 7 and 12th Marks > 70, likely placed
        try:
            cgpa = float(data.iloc[0]['Cgpa'])
            marks_12 = float(data.iloc[0]['12th marks'])
            
            if cgpa >= 7.0 and marks_12 >= 70:
                return [[0.1, 0.85]] # High prob of placement
            else:
                return [[0.8, 0.2]] # Low prob
        except Exception as e:
            print(f"Error in mock: {e}")
            return [[1.0, 0.0]]

pipeline = MockPipeline()

def test_prediction(cgpa, marks_12):
    data = pd.DataFrame([{
        "Cgpa": cgpa,
        "12th marks": marks_12
    }])
    
    pred_prob = pipeline.predict_proba(data)[0][1]
    is_placed = pred_prob > 0.5
    prediction = "Placed" if is_placed else "Not Placed"
    print(f"CGPA: {cgpa}, 12th Marks: {marks_12} -> Prediction: {prediction} (Prob: {pred_prob})")

if __name__ == "__main__":
    test_prediction(0.0, 90.0)
    test_prediction(8.5, 90.0)
    test_prediction(6.5, 95.0)
    test_prediction(7.5, 60.0)
