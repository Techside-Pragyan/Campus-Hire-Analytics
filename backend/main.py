from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd
import io
import PyPDF2
import re
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Placement Prediction API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load artifacts
try:
    model = joblib.load('models/placement_model.pkl')
    scaler = joblib.load('models/scaler.pkl')
    feature_names = joblib.load('models/feature_names.pkl')
    explainer = joblib.load('models/shap_explainer.pkl')
except Exception as e:
    print(f"Error loading models: {e}")

class StudentData(BaseModel):
    CGPA: float
    Internships: int
    Projects: int
    Workshops: int
    AptitudeScore: float
    CommunicationSkills: float
    ProgrammingSkills: float
    Extracurriculars: int

@app.get("/health")
def health():
    return {"status": "healthy"}

@app.post("/predict")
def predict(data: StudentData):
    try:
        # Convert data to array
        features = np.array([[
            data.CGPA, data.Internships, data.Projects, data.Workshops,
            data.AptitudeScore, data.CommunicationSkills, data.ProgrammingSkills,
            data.Extracurriculars
        ]])
        
        # Scale features
        features_scaled = scaler.transform(features)
        
        # Prediction
        prediction = model.predict(features_scaled)[0]
        probability = model.predict_proba(features_scaled)[0][1]
        
        # SHAP explanation
        shap_values = explainer.shap_values(features_scaled)
        
        # Depending on SHAP version, shap_values might be a list (for classification)
        if isinstance(shap_values, list):
            # For RF in SHAP, values for class 1
            node_shap = shap_values[1][0]
        else:
            # New SHAP versions might return a single array for probability
            node_shap = shap_values[0]

        # Combine feature names with SHAP values
        insights = []
        for name, val in zip(feature_names, node_shap):
            insights.append({"feature": name, "contribution": float(val)})
            
        # Sort insights by absolute contribution
        insights = sorted(insights, key=lambda x: abs(x['contribution']), reverse=True)
        
        return {
            "prediction": "Placed" if prediction == 1 else "Not Placed",
            "probability": round(float(probability) * 100, 2),
            "key_factors": insights[:3],
            "all_factors": insights
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-resume")
async def analyze_resume(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        content = await file.read()
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        
        # Simple extraction logic (can be improved with NLP)
        cgpa_match = re.search(r'(?:CGPA|GPA)[:\s]+(\d\.\d+)', text, re.IGNORECASE)
        cgpa = float(cgpa_match.group(1)) if cgpa_match else 8.0
        
        # Count keywords for skills
        skills_keywords = ['python', 'java', 'c++', 'javascript', 'react', 'sql', 'machine learning', 'aws']
        prog_skills_count = sum(1 for kw in skills_keywords if kw in text.lower())
        prog_score = min(50 + (prog_skills_count * 10), 100)
        
        # Mocking some values for demo
        extracted_data = {
            "CGPA": cgpa,
            "Internships": len(re.findall(r'internship', text, re.IGNORECASE)),
            "Projects": len(re.findall(r'project', text, re.IGNORECASE)),
            "Workshops": len(re.findall(r'workshop|certification', text, re.IGNORECASE)),
            "AptitudeScore": 85.0, # Default or extracted
            "CommunicationSkills": 80.0,
            "ProgrammingSkills": float(prog_score),
            "Extracurriculars": 1 if re.search(r'volunteer|club|sports', text, re.IGNORECASE) else 0
        }
        
        # Run prediction on extracted data
        prediction_result = predict(StudentData(**extracted_data))
        
        return {
            "extracted_data": extracted_data,
            "prediction": prediction_result
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
