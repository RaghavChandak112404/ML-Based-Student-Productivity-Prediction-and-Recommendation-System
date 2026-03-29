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

response = requests.post("http://localhost:5000/predict", json=data)
print(json.dumps(response.json(), indent=2))
