"""
Utility functions for the ML service.
"""

import logging
from datetime import datetime

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

def log(message):
    """
    Log a message with timestamp for debugging and monitoring purposes.
    
    Args:
        message (str): The message to log
    """
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] {message}")

def extract_questionnaire_preferences(answers):
    """
    Extract mood, vibe, and discovery preferences from questionnaire answers.
    
    Args:
        answers (list): List of questionnaire answer objects
        
    Returns:
        tuple: (mood, vibe, discovery) preferences
    """
    # Extract mood, vibe, and discovery preferences from answers
    # Each answer has a questionId and a selectedOptionId
    mood = "balanced"
    vibe = "balanced"
    discovery = "balanced"
    
    for answer in answers:
        question_id = answer.get('questionId')
        selected_option = answer.get('selectedOption')
        
        if question_id == 'mood':
            mood = selected_option
        elif question_id == 'vibe':
            vibe = selected_option
        elif question_id == 'discovery':
            discovery = selected_option
    
    return mood, vibe, discovery

def extract_song_preferences(preferences):
    """
    Extract liked and disliked song IDs from user preferences.
    
    Args:
        preferences (list): List of user preference objects
        
    Returns:
        tuple: (liked_song_ids, disliked_song_ids)
    """
    liked_song_ids = [p.get('songId') for p in preferences if p.get('liked', False)]
    disliked_song_ids = [p.get('songId') for p in preferences if not p.get('liked', False)]
    
    return liked_song_ids, disliked_song_ids 