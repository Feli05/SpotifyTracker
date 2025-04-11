from flask import Flask, jsonify, request
import os
from dotenv import load_dotenv
from datetime import datetime
import threading
from pymongo import MongoClient
from bson.objectid import ObjectId

# Import modules from model package
from model import utils
from model import recommendation

# Load environment variables
load_dotenv()

app = Flask(__name__)

# MongoDB Connection - Direct connection that will be visible if it fails
mongo_uri = os.getenv('MONGODB_URI')
if not mongo_uri:
    print("ERROR: MONGODB_URI not set in environment variables")
mongo_client = MongoClient(mongo_uri)
db = mongo_client["spotify_tracker"]

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    # Test MongoDB connection
    try:
        # List all collections to verify connection
        collections = db.list_collection_names()
        return jsonify({
            'status': 'healthy',
            'mongodb_connected': True,
            'collections': collections
        })
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'mongodb_error': str(e)
        }), 500

@app.route('/api/process-data', methods=['POST'])
def process_data():
    """
    Receive data from the web service and process it to generate recommendations.
    """    
    data = request.json
    
    # Extract information for processing
    user_id = data.get('userId', 'unknown')
    current_questionnaire = data.get('currentQuestionnaire', {})
    previous_questionnaires = data.get('previousQuestionnaires', [])
    preferences = data.get('preferences', [])
    
    # Calculate basic statistics for processing
    liked_songs = sum(1 for pref in preferences if pref.get('liked', False))
    disliked_songs = len(preferences) - liked_songs
    
    # Get questionnaire ID for processing
    questionnaire_id = None
    if current_questionnaire:
        questionnaire_id = str(current_questionnaire.get('_id', ''))
        
        # Start processing in background to avoid blocking the response
        def process_recommendations():
            # Generate recommendations if we have enough liked songs
            if liked_songs >= 5:
                success = recommendation.generate_recommendations(
                    db, user_id, questionnaire_id, preferences, current_questionnaire
                )
            
        # Start the processing thread
        threading.Thread(target=process_recommendations).start()
        
        # Return a simple success response
        return jsonify({
            "success": True
        })

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5050))
    app.run(host='0.0.0.0', port=port, debug=True) 