import os
import joblib
import pandas as pd
import numpy as np

# Load artifacts
model = None
encoder = None
scaler = None

def load_artifacts():
    global model, encoder, scaler
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_dir, "model.pkl")
    encoder_path = os.path.join(base_dir, "encoder.pkl")
    scaler_path = os.path.join(base_dir, "scaler.pkl")
    
    if os.path.exists(model_path):
        model = joblib.load(model_path)
    if os.path.exists(encoder_path):
        encoder = joblib.load(encoder_path)
    if os.path.exists(scaler_path):
        scaler = joblib.load(scaler_path)

def predict(input_data):
    """
    input_data: dictionary of raw features from frontend
    Returns: dict with predicted productivity_level and confidence_score
    """
    if model is None:
        load_artifacts()
        
    if model is None:
        return {"productivity_level": "Unknown", "confidence_score": 0.0}

    # Extract exact features trained on
    expected_features = ['study_hours', 'screen_time', 'sleep_hours', 'social_media_usage', 'stress_level', 'attendance']
    
    row = {}
    for f in expected_features:
        row[f] = [input_data.get(f, 0)]
        
    df_input = pd.DataFrame(row)
    
    # Apply encoders
    if encoder:
        for col, le in encoder.items():
            if col in df_input.columns:
                df_input[col] = df_input[col].apply(lambda x: x if x in le.classes_ else le.classes_[0])
                df_input[col] = le.transform(df_input[col])
                
    # Apply scaling
    if scaler:
        num_cols = ['study_hours', 'screen_time', 'sleep_hours', 'stress_level', 'attendance']
        if all(col in df_input.columns for col in num_cols):
            df_input[num_cols] = scaler.transform(df_input[num_cols])
        
    # Predict
    prediction = model.predict(df_input)
    
    confidence = 0.0
    if hasattr(model, "predict_proba"):
        probs = model.predict_proba(df_input)
        confidence = round(float(np.max(probs[0])) * 100, 2)
    
    pred_level = prediction[0]
    
    return {
        "productivity_level": str(pred_level),
        "confidence_score": confidence
    }
