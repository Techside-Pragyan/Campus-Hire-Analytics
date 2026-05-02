# Campus-Hire-Analytics 🎓📊

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.9%2B-blue)
![React](https://img.shields.io/badge/react-19.0-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100%2B-00a393)

**Campus-Hire-Analytics** is a full-stack machine learning application designed to predict student placement outcomes based on academic and extracurricular metrics. It leverages a Random Forest classifier with SHAP-based feature explainability to provide deep insights into which factors contribute most to a student's placement probability. The platform also includes an automated resume analyzer that parses PDF resumes to extract relevant data points for prediction.

## 🌟 Key Features

- **Placement Prediction**: Predicts the likelihood of a student being placed based on features like CGPA, internships, projects, workshops, aptitude, and communication skills.
- **Explainable AI (XAI)**: Uses **SHAP (SHapley Additive exPlanations)** to break down the model's predictions and explain the exact contribution of each factor.
- **Automated Resume Parsing**: Upload a PDF resume, and the system automatically extracts skills, CGPA, project counts, and internship experiences to populate the prediction form.
- **Modern Dashboard**: A beautiful, interactive frontend built with React, Recharts, and Framer Motion for visualizing placement probabilities and SHAP insights.

## 🛠️ Technology Stack

### Frontend
- **React (Vite)**: Fast and modern frontend framework.
- **Recharts**: For rendering SHAP insight charts and probability visualizers.
- **Framer Motion**: For smooth micro-animations and page transitions.
- **Lucide React**: For beautiful iconography.

### Backend & Machine Learning
- **FastAPI**: High-performance Python web framework for serving the model.
- **Scikit-Learn**: For training the `RandomForestClassifier` and data scaling.
- **SHAP**: For model explainability and feature contribution analysis.
- **PyPDF2**: For parsing and extracting text from uploaded PDF resumes.
- **Joblib**: For saving and loading pre-trained ML artifacts.
- **Pandas & NumPy**: For data manipulation.

## 📂 Project Structure

```text
Campus-Hire-Analytics/
├── backend/                  # FastAPI server and API endpoints
│   └── main.py               # Main application and routing
├── frontend/                 # React (Vite) frontend application
│   ├── src/                  # React components, styles, and logic
│   └── package.json          # Frontend dependencies
├── models/                   # Pre-trained ML models and artifacts
│   ├── train_model.py        # Script to train the Random Forest model
│   └── *.pkl                 # Saved model, scaler, explainer, etc.
├── data/                     # Datasets and synthetic data generators
│   └── generate_data.py      # Script to generate student data
├── notebooks/                # Jupyter notebooks for EDA and prototyping
└── README.md                 # Project documentation
```

## 🚀 Getting Started

Follow these steps to run the application locally.

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Campus-Hire-Analytics.git
cd Campus-Hire-Analytics
```

### 2. Setup the Backend

Ensure you have Python 3.9+ installed.

```bash
# Navigate to the project root or backend directory depending on your setup
# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

# Install backend dependencies (assuming a requirements.txt exists, or install manually)
pip install fastapi uvicorn scikit-learn shap pypdf2 pandas numpy joblib python-multipart

# Start the FastAPI server
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
*The backend API will be running at `http://localhost:8000`*

### 3. Setup the Frontend

Ensure you have Node.js installed.

```bash
# Open a new terminal and navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
*The frontend dashboard will be available at `http://localhost:5173`*

## 🔌 API Endpoints

The FastAPI backend exposes the following key endpoints:

- `GET /health` : Checks the health status of the API.
- `POST /predict` : Accepts student metrics and returns the placement prediction, probability, and SHAP-based feature contributions.
- `POST /analyze-resume` : Accepts a `.pdf` file upload, parses the text, extracts relevant fields, and returns a placement prediction based on the extracted data.

## 🧠 Machine Learning Model

The core predictive model is a **Random Forest Classifier** trained on student placement data.
- **Features Used**: `CGPA`, `Internships`, `Projects`, `Workshops`, `AptitudeScore`, `CommunicationSkills`, `ProgrammingSkills`, `Extracurriculars`.
- **Explainability**: A `TreeExplainer` from the SHAP library calculates the marginal contribution of each feature to the final prediction, allowing users to understand exactly *why* a specific probability was given.

To retrain the model, you can run the provided script:
```bash
python models/train_model.py
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.