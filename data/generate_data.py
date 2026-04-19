import pandas as pd
import numpy as np
import os

def generate_placement_data(n_samples=2000):
    np.random.seed(42)
    
    # Generate random features
    cgpa = np.random.uniform(6.0, 10.0, n_samples)
    internships = np.random.randint(0, 4, n_samples)
    projects = np.random.randint(0, 6, n_samples)
    workshops = np.random.randint(0, 8, n_samples)
    aptitude_score = np.random.uniform(50, 100, n_samples)
    comm_skills = np.random.uniform(50, 100, n_samples)
    prog_skills = np.random.uniform(50, 100, n_samples)
    extracurricular = np.random.choice([0, 1], n_samples, p=[0.6, 0.4])
    
    # Logic for placement (Adding some noise)
    # Simple linear combination with some thresholds
    placement_prob = (
        0.35 * (cgpa - 6) / 4 + 
        0.15 * (internships / 3) + 
        0.10 * (projects / 5) + 
        0.05 * (workshops / 7) + 
        0.10 * (aptitude_score - 50) / 50 + 
        0.10 * (comm_skills - 50) / 50 + 
        0.10 * (prog_skills - 50) / 50 + 
        0.05 * extracurricular
    )
    
    # Add noise
    placement_prob += np.random.normal(0, 0.05, n_samples)
    placement_prob = np.clip(placement_prob, 0, 1)
    
    # Determine placement (Threshold at 0.5)
    placed = (placement_prob > 0.5).astype(int)
    
    df = pd.DataFrame({
        'CGPA': np.round(cgpa, 2),
        'Internships': internships,
        'Projects': projects,
        'Workshops': workshops,
        'AptitudeScore': np.round(aptitude_score, 2),
        'CommunicationSkills': np.round(comm_skills, 2),
        'ProgrammingSkills': np.round(prog_skills, 2),
        'Extracurriculars': extracurricular,
        'PlacementStatus': placed
    })
    
    return df

if __name__ == "__main__":
    df = generate_placement_data()
    os.makedirs('data', exist_ok=True)
    df.to_csv('data/student_placement_data.csv', index=False)
    print(f"Dataset generated successfully with {len(df)} rows.")
    print(df.head())
