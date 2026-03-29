import json
import pandas as pd
import numpy as np
import os
import shutil
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score

print("Local dataset copying...")
dataset_csv = os.path.join("C:/Users/rchan/.cache/kagglehub/datasets/sehaj1104/student-productivity-and-digital-distraction-dataset/versions/1", "student_productivity_distraction_dataset_20000.csv")

if not os.path.exists("dataset.csv"):
    shutil.copy(dataset_csv, "dataset.csv")

df = pd.read_csv("dataset.csv")

# Ensure valid data
df = df.dropna()

# 1. Map features to frontend naming conventions
# Study Hours
df['study_hours'] = df['study_hours_per_day']
# Screen Time (sum of digital distractions)
df['screen_time'] = df['phone_usage_hours'] + df['youtube_hours'] + df['gaming_hours'] + df['social_media_hours']
# Sleep
df['sleep_hours'] = df['sleep_hours']
# Stress
df['stress_level'] = df['stress_level']
# Attendance
df['attendance'] = df['attendance_percentage']

# 2. Derive categorical frontend features
def get_sm_usage(hours):
    if hours >= 5: return "High"
    elif hours >= 2: return "Medium"
    else: return "Low"
df['social_media_usage'] = df['social_media_hours'].apply(get_sm_usage)

# target creation
def get_prod_level(score):
    if score >= 65: return "High"
    elif score >= 40: return "Medium"
    else: return "Low"
df['productivity_level'] = df['productivity_score'].apply(get_prod_level)

# Features we will actually use for the ML model
features = ['study_hours', 'screen_time', 'sleep_hours', 'social_media_usage', 'stress_level', 'attendance']

X = df[features].copy()
y = df['productivity_level']

# Encoding
encoders = {}
categorical_cols = X.select_dtypes(include=['object', 'string']).columns.tolist()

for col in categorical_cols:
    le = LabelEncoder()
    # Ensure "High", "Medium", "Low" are well encoded
    X[col] = le.fit_transform(X[col])
    encoders[col] = le

# Scaling
scaler = StandardScaler()
num_cols = X.select_dtypes(include=['int64', 'float64']).columns.tolist()
X[num_cols] = scaler.fit_transform(X[num_cols])

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

models = {
    "Logistic Regression": LogisticRegression(max_iter=1000),
    "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
}

# XGBoost requires numeric labels for targets
y_le = LabelEncoder()
y_train_num = y_le.fit_transform(y_train)
y_test_num = y_le.transform(y_test)

models["XGBoost"] = XGBClassifier(use_label_encoder=False, eval_metric='mlogloss', random_state=42)

best_model = None
best_accuracy = 0
best_model_name = ""

print("\nTraining models...")
for name, model in models.items():
    if name == "XGBoost":
        model.fit(X_train, y_train_num)
        y_pred_num = model.predict(X_test)
        y_pred = y_le.inverse_transform(y_pred_num)
    else:
        model.fit(X_train, y_train)
        y_pred = model.predict(X_test)
        
    acc = accuracy_score(y_test, y_pred)
    print(f"{name} Accuracy: {acc:.4f}")
    
    if acc > best_accuracy:
        best_accuracy = acc
        best_model_name = name
        best_model = model

print(f"\nBest Model: {best_model_name} with {best_accuracy:.4f} accuracy.")

class XGBWrapper:
    def __init__(self, model, le, feature_names):
        self.model = model
        self.le = le
        self.feature_names_in_ = feature_names
    def predict(self, x_in):
        return self.le.inverse_transform(self.model.predict(x_in))
    def predict_proba(self, x_in):
        return self.model.predict_proba(x_in)

if best_model_name == "XGBoost":
    best_model = XGBWrapper(best_model, y_le, np.array(features))
else:
    best_model.feature_names_in_ = np.array(features)

import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

joblib.dump(best_model, os.path.join(BASE_DIR, "model.pkl"))
joblib.dump(encoders, os.path.join(BASE_DIR, "encoder.pkl"))
joblib.dump(scaler, os.path.join(BASE_DIR, "scaler.pkl"))

print("Saved model.pkl, encoder.pkl, scaler.pkl successfully to", BASE_DIR)
