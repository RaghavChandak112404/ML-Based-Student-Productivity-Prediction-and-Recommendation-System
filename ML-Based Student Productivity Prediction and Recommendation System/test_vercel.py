import urllib.request
import urllib.error
import json

url = "https://ml-based-student-productivity-predi.vercel.app/api/predict"
data = {
    "study_hours": 4,
    "screen_time": 3,
    "sleep_hours": 7,
    "social_media_usage": "Medium",
    "multitasking": "No",
    "stress_level": 5,
    "attendance": 85
}

req = urllib.request.Request(
    url, 
    data=json.dumps(data).encode(), 
    headers={'Content-Type': 'application/json'}
)

try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode())
except urllib.error.HTTPError as e:
    print(f"HTTP Status: {e.code}")
    print(e.read().decode())
