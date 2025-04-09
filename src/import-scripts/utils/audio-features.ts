/**
 * Audio features utilities for generating genre-specific audio characteristics
 */

import { AudioFeatures } from '../models/types';

/**
 * Get genre-specific audio features
 * @param genre The music genre
 * @returns Audio features tailored to the genre
 */
export function getGenreAudioFeatures(genre: string): AudioFeatures {
  // Default audio features - reasonable baseline values
  const defaultFeatures: AudioFeatures = {
    danceability: 0.5,    // middle value
    energy: 0.5,          // middle value
    key: 0,               // C key
    loudness: -8.0,       // typical average loudness
    mode: 1,              // major mode
    speechiness: 0.1,     // low speechiness (mostly instrumental)
    acousticness: 0.5,    // middle value
    instrumentalness: 0,  // not instrumental
    liveness: 0.1,        // studio recording
    valence: 0.5,         // neutral mood
    tempo: 120,           // moderate tempo
    duration_ms: 210000,  // 3.5 minutes
    time_signature: 4     // 4/4 time
  };
  
  // Genre-specific adjustments
  const features = { ...defaultFeatures };
  
  // Apply genre-specific adjustments based on music characteristics
  switch(genre) {
    // Electronic music genres - high energy, danceability, faster tempo
    case 'dance':
    case 'edm':
    case 'electro':
    case 'electronic':
    case 'house':
    case 'techno':
    case 'trance':
    case 'drum-and-bass':
    case 'dubstep':
      features.danceability = 0.8;
      features.energy = 0.9;
      features.tempo = 128;
      features.instrumentalness = 0.4;
      features.acousticness = 0.2;
      break;
    
    // Ambient/classical - acoustic, low energy, more instrumental
    case 'classical':
    case 'ambient':
      features.acousticness = 0.9;
      features.energy = 0.3;
      features.instrumentalness = 0.8;
      features.valence = 0.4;
      features.loudness = -14.0;
      break;
      
    // Rock/metal - high energy, loud, fast
    case 'rock':
    case 'metal':
    case 'alt-rock':
    case 'punk':
      features.energy = 0.9;
      features.loudness = -5.0;
      features.tempo = 140;
      features.acousticness = 0.3;
      features.valence = 0.6;
      break;
      
    // Jazz/blues - acoustic, moderate tempo, instrumental
    case 'jazz':
    case 'blues':
    case 'soul':
      features.acousticness = 0.7;
      features.instrumentalness = 0.4;
      features.energy = 0.5;
      features.tempo = 100;
      features.valence = 0.4;
      break;
      
    // Hip-hop/R&B - speech, bass, danceability
    case 'hip-hop':
    case 'r-n-b':
      features.speechiness = 0.4;
      features.danceability = 0.7;
      features.energy = 0.7;
      features.acousticness = 0.3;
      features.tempo = 95;
      break;
      
    // Pop - catchy, energetic, positive
    case 'pop':
    case 'k-pop':
      features.danceability = 0.7;
      features.energy = 0.8;
      features.valence = 0.7;
      features.loudness = -6.0;
      features.speechiness = 0.2;
      break;
      
    // Folk/acoustic - acoustic, authentic, less electronic
    case 'folk':
    case 'acoustic':
    case 'country':
      features.acousticness = 0.8;
      features.instrumentalness = 0.2;
      features.energy = 0.4;
      features.danceability = 0.4;
      features.tempo = 110;
      break;
      
    // Latin/reggae - rhythmic, danceable
    case 'latin':
    case 'reggae':
    case 'afrobeat':
      features.danceability = 0.8;
      features.energy = 0.6;
      features.valence = 0.7;
      features.tempo = 105;
      features.speechiness = 0.2;
      break;
      
    // Indie/alternative - varied, modern
    case 'indie':
    case 'indie-pop':
    case 'alternative':
      features.energy = 0.6;
      features.danceability = 0.5;
      features.valence = 0.5;
      features.acousticness = 0.4;
      break;
      
    // Disco/funk - groovy, danceable
    case 'disco':
    case 'funk':
      features.danceability = 0.9;
      features.energy = 0.7;
      features.valence = 0.8;
      features.tempo = 115;
      features.speechiness = 0.1;
      features.acousticness = 0.3;
      break;
  }
  
  return features;
} 