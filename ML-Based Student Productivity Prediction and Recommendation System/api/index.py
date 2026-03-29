import sys
import os

# Force Vercel to recognize the api directory scope
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.append(current_dir)

from flask import Flask, request, jsonify
from flask_cors import CORS
from utils_predict import predict as run_prediction, load_artifacts
from utils_recommend import generate_recommendations

app = Flask(__name__)
# Enable CORS for frontend integration
CORS(app)

# Load the model at startup
try:
    load_artifacts()
    print("Model artifacts loaded successfully.")
except Exception as e:
    print(f"Error loading artifacts: {e}")

@app.route('/api/predict', methods=['POST', 'OPTIONS'])
def predict_endpoint():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Invalid JSON mapping."}), 400
            
        # Predict
        prediction_result = run_prediction(data)
        
        # Recommendations
        recommendations = generate_recommendations(data)
        
        # Assemble response
        # The user JSON requested confidence_score as e.g. 0.82
        # My predict returns that format as float.
        response = {
            "productivity_level": prediction_result["productivity_level"],
            "confidence_score": round(prediction_result["confidence_score"], 2),
            "recommendations": recommendations
        }
        return jsonify(response)
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
