ML-Based Student Productivity Prediction and Recommendation System
This repository contains a full-stack machine learning application designed to predict student productivity levels and provide personalized recommendations for improvement based on lifestyle and academic habits.

🚀 Features
Productivity Prediction: Classifies productivity into "High", "Medium", or "Low" using a trained ML model.

Confidence Scoring: Provides a percentage-based confidence score for every prediction.

Smart Recommendations: Generates actionable advice based on input features like sleep, screen time, and stress levels.

Interactive Dashboard: A modern React-based frontend for data visualization and user interaction.

REST API: A Flask backend to handle model inference and recommendation logic.

🛠️ Tech Stack
Frontend: React, TypeScript, Tailwind CSS, Vite.

Backend: Python, Flask, Flask-CORS.

Machine Learning: Scikit-learn, XGBoost, Pandas, Joblib.

📊 Machine Learning Pipeline
Models Used
The system evaluates multiple models during the training phase to select the best performer:

XGBoost Classifier (Primary)

Random Forest Classifier

Logistic Regression

Dataset & Features
The model is trained on a dataset of 20,000 student records, focusing on the following features:

Study Hours: Daily time spent studying.

Screen Time: Total hours across phone, YouTube, gaming, and social media.

Sleep Hours: Quality of rest.

Social Media Usage: Categorized as Low, Medium, or High.

Stress Level: Self-reported stress metric.

Attendance: Academic participation percentage.

📂 Project Structure
Plaintext
├── ML-Based Student Productivity.../
│   ├── project/
│   │   ├── app.py              # Flask API
│   │   ├── train_model.py      # Model training script
│   │   ├── predict.py          # Inference logic
│   │   ├── recommend.py        # Recommendation engine
│   │   └── requirements.txt    # Python dependencies
│   ├── src/                    # React frontend source
│   │   ├── pages/              # Dashboard, Insights, and Predict pages
│   │   └── components/         # UI components
│   └── package.json            # Frontend dependencies
⚙️ Installation & Setup
Backend Setup
Navigate to the project directory.

Install dependencies: pip install -r requirements.txt.

Train the model: python train_model.py (This generates model.pkl, scaler.pkl, and encoder.pkl).

Run the API: python app.py.

Frontend Setup
Navigate to the root frontend directory.

Install dependencies: npm install.

Start the development server: npm run dev.

🧪 Testing
Backend: Run test_api.py to verify the Flask endpoints.

Frontend: Vitest and Playwright are configured for unit and E2E testing.
