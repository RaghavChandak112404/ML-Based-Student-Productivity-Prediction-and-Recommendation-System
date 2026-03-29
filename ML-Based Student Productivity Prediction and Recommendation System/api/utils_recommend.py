def generate_recommendations(features):
    """
    Generate personalized recommendations based on input features.
    Expected features dict format:
    {
        "study_hours": <float>,
        "screen_time": <float>,
        "sleep_hours": <float>,
        "social_media_usage": <str>,
        "multitasking": <str>,
        "stress_level": <float>,
        "attendance": <float>
    }
    """
    recommendations = []
    
    # 1. Screen Time
    if features.get("screen_time", 0) > 4:
        recommendations.append("Reduce screen time to under 4 hours daily to improve main focus.")
        
    # 2. Sleep Hours
    if features.get("sleep_hours", 8) < 7:
        recommendations.append("Increase sleep duration to 7-8 hours per night for better cognitive performance.")
        
    # 3. Study Hours
    if features.get("study_hours", 4) < 3:
        recommendations.append("Improve study consistency by aiming for 3+ hours per day.")
        
    # 4. Social Media
    if features.get("social_media_usage") == "High":
        recommendations.append("Limit social media usage to low or medium levels during study sessions.")
        
    # 5. Multitasking
    if features.get("multitasking") == "Yes":
        recommendations.append("Avoid multitasking while studying; focus on one task at a time for deeper learning.")
        
    # 6. Stress Level
    if features.get("stress_level", 0) > 6:
        recommendations.append("Practice stress management techniques such as meditation or regular short breaks.")
        
    # 7. Attendance
    if features.get("attendance", 100) < 80:
        recommendations.append("Aim to improve your attendance to above 80% to ensure you don't miss important material.")
        
    if not recommendations:
        recommendations.append("Great habits! Keep up the consistency.")
        
    return recommendations
