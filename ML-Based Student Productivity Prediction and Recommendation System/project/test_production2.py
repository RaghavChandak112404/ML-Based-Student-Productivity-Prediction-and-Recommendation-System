import requests
import json

url = "https://ml-based-student-productivity-prediction.onrender.com/predict"
data = {
    "study_hours": 4,
    "screen_time": 6,
    "sleep_hours": 5,
    "social_media_hours": 5,
    "multitasking": 1,
    "stress_level": 8,
    "attendance": 70
}

response = requests.post(url, json=data)
with open("render_resp2.json", "w") as f:
    json.dump(response.json(), f)
