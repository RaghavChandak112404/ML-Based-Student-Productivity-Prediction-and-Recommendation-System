import test_api
import requests
res = requests.post('https://ml-based-student-productivity-prediction.onrender.com/predict', json={'study_hours': 10, 'screen_time': 2, 'sleep_hours': 8, 'social_media_usage': 'Medium', 'multitasking': 'No', 'stress_level': 4, 'attendance': 87})
print(res.text)
