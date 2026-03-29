import requests
import json

data = {
    "study_hours": 4,
    "screen_time": 6,
    "sleep_hours": 5,
    "social_media_usage": "High",
    "multitasking": "Yes",
    "stress_level": 8,
    "attendance": 70
}

url = "https://ml-based-student-productivity-prediction.onrender.com/predict"
response = requests.post(url, json=data)
print("Status Code:", response.status_code)
print(response.text)
