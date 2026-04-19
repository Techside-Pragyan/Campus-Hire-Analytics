import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
import joblib
import os
import shap

def train_model():
    # Load data
    df = pd.read_csv('data/student_placement_data.csv')
    
    X = df.drop('PlacementStatus', axis=1)
    y = df['PlacementStatus']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train Random Forest
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test_scaled)
    acc = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {acc:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save model and scaler
    os.makedirs('models', exist_ok=True)
    joblib.dump(model, 'models/placement_model.pkl')
    joblib.dump(scaler, 'models/scaler.pkl')
    joblib.dump(X.columns.tolist(), 'models/feature_names.pkl')
    
    # SHAP explainer
    explainer = shap.TreeExplainer(model)
    joblib.dump(explainer, 'models/shap_explainer.pkl')
    
    print("Model and scaler saved successfully.")

if __name__ == "__main__":
    train_model()
