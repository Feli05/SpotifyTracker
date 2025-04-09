from flask import Flask, jsonify, request
import os
from dotenv import load_dotenv
import json
from datetime import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Store the last received data for debugging
last_received_data = None

@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return jsonify({'status': 'healthy'})

@app.route('/api/data', methods=['GET'])
def view_data():
    """
    View the actual data received by the ML service.
    Returns information only if data has been sent.
    """
    global last_received_data
    
    if not last_received_data:
        return jsonify({
            "status": "no_data",
            "message": "No data has been received yet"
        })
    
    # Basic statistics summary
    stats = {
        "userId": last_received_data.get('userId', 'unknown'),
        "timestamp": str(last_received_data.get('currentQuestionnaire', {}).get('timestamp', 'unknown')),
        "questionnairesCount": len(last_received_data.get('previousQuestionnaires', [])) + 1,  # +1 for current
        "preferencesCount": len(last_received_data.get('preferences', [])),
        "likedSongs": sum(1 for pref in last_received_data.get('preferences', []) if pref.get('liked', False)),
        "dislikedSongs": sum(1 for pref in last_received_data.get('preferences', []) if not pref.get('liked', True)),
        "interactedSongsCount": len(last_received_data.get('interactedSongs', [])),
        "totalSongsInDb": last_received_data.get('totalSongsInDb', 0),
    }
    
    # Get view type from query param (summary or detailed)
    view_type = request.args.get('view', 'summary')
    
    # Return just the summary if requested
    if view_type == 'summary':
        return jsonify({
            "status": "success",
            "message": "Data received summary",
            "summary": stats
        })
    
    # Prepare detailed data
    detailed_data = {}
    
    # Current questionnaire details
    current_questionnaire = last_received_data.get('currentQuestionnaire', {})
    detailed_data["currentQuestionnaire"] = {
        "id": str(current_questionnaire.get('_id', '')),
        "timestamp": str(current_questionnaire.get('timestamp', '')),
        "answers": current_questionnaire.get('answers', [])
    }
    
    # Previous questionnaires sample
    prev_questionnaires = last_received_data.get('previousQuestionnaires', [])
    detailed_data["previousQuestionnaires"] = {
        "count": len(prev_questionnaires),
        "sample": [{
            "id": str(q.get('_id', '')),
            "timestamp": str(q.get('timestamp', '')),
            "answerCount": len(q.get('answers', []))
        } for q in prev_questionnaires[:3]]  # Show just 3 previous questionnaires
    }
    
    # Preferences samples
    preferences = last_received_data.get('preferences', [])
    liked_sample = [p for p in preferences if p.get('liked', False)][:5]  # 5 liked songs
    disliked_sample = [p for p in preferences if not p.get('liked', False)][:5]  # 5 disliked songs
    
    detailed_data["preferences"] = {
        "total": len(preferences),
        "liked": stats["likedSongs"],
        "disliked": stats["dislikedSongs"],
        "likedSample": [{
            "songId": p.get('songId', ''),
            "timestamp": str(p.get('timestamp', ''))
        } for p in liked_sample],
        "dislikedSample": [{
            "songId": p.get('songId', ''),
            "timestamp": str(p.get('timestamp', ''))
        } for p in disliked_sample]
    }
    
    # Songs sample
    songs = last_received_data.get('interactedSongs', [])
    song_sample = songs[:5]  # First 5 songs
    
    detailed_data["songs"] = {
        "total": len(songs),
        "sample": [{
            "id": song.get('spotifyId', ''),
            "name": song.get('name', ''),
            "artists": [a.get('name', '') for a in song.get('artists', [])],
            "genre": song.get('genre', ''),
            "popularity": song.get('popularity', 0)
        } for song in song_sample]
    }
    
    # Audio features example
    audio_features = {}
    if len(song_sample) > 0 and 'audioFeatures' in song_sample[0]:
        audio_features = song_sample[0].get('audioFeatures', {})
        
    detailed_data["audioFeatureExample"] = audio_features
    
    return jsonify({
        "status": "success",
        "message": "Data received details",
        "summary": stats,
        "details": detailed_data
    })

@app.route('/api/process-data', methods=['POST'])
def process_data():
    """
    Receive data from the web service and process it.
    For now, just log what we received and return statistics.
    """
    global last_received_data
    
    try:
        data = request.json
        last_received_data = data  # Store for debugging
        
        # Extract information for summary
        user_id = data.get('userId', 'unknown')
        current_questionnaire = data.get('currentQuestionnaire', {})
        previous_questionnaires = data.get('previousQuestionnaires', [])
        preferences = data.get('preferences', [])
        interacted_songs = data.get('interactedSongs', [])
        total_songs = data.get('totalSongsInDb', 0)
        
        # Calculate summary statistics
        liked_songs = sum(1 for pref in preferences if pref.get('liked', False))
        disliked_songs = len(preferences) - liked_songs
        
        # Log some basic information
        print(f"[INFO] Received data for user: {user_id}")
        print(f"[INFO] Current questionnaire: {current_questionnaire.get('_id', 'unknown')}")
        print(f"[INFO] Previous questionnaires: {len(previous_questionnaires)}")
        print(f"[INFO] Total preferences: {len(preferences)} ({liked_songs} liked, {disliked_songs} disliked)")
        print(f"[INFO] Interacted songs: {len(interacted_songs)}")
        print(f"[INFO] Total songs in database: {total_songs}")
        
        # Record the time the data was received
        receipt_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[INFO] Data received at: {receipt_time}")
        
        # Build summary for response
        summary = {
            'userId': user_id,
            'questionnairesCount': len(previous_questionnaires) + 1,  # +1 for current
            'preferencesCount': len(preferences),
            'likedSongs': liked_songs,
            'dislikedSongs': disliked_songs,
            'interactedSongsCount': len(interacted_songs),
            'totalSongsInDb': total_songs,
            'receivedAt': receipt_time
        }
        
        # In a real implementation, we would:
        # 1. Store the data for later processing
        # 2. Start an async task to process the data
        # 3. Send the results back when ready
        
        return jsonify({
            'success': True,
            'message': 'Data received successfully',
            'summary': summary
        })
    except Exception as e:
        print(f"[ERROR] Error processing data: {str(e)}")
        return jsonify({
            'error': f'Error processing data: {str(e)}'
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5050))
    app.run(host='0.0.0.0', port=port, debug=True) 