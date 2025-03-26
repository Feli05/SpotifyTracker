import { URLSearchParams } from 'url';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

// Scopes required for your app
const scopes = [
  'user-read-private',
  'user-read-email',
  'user-read-currently-playing',
  'user-top-read',
  'user-read-recently-played'
].join(' ');

// Generate authorization URL
export const getAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: client_id!,
    response_type: 'code',
    redirect_uri: redirect_uri!,
    scope: scopes,
    show_dialog: 'true'
  });
  
  return `https://accounts.spotify.com/authorize?${params.toString()}`;
};

// Exchange code for access token
export const getAccessToken = async (code: string) => {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirect_uri!,
  });

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token exchange error: ${error}`);
  }

  return response.json();
};

// Refresh access token
export const refreshAccessToken = async (refresh_token: string) => {
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token
  });

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params.toString()
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token refresh error: ${error}`);
  }

  return response.json();
};

// Get user profile
export const getUserProfile = async (access_token: string) => {
  const response = await fetch('https://api.spotify.com/v1/me', {
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Profile error: ${error}`);
  }
  
  return response.json();
};

// Get current playing track
export const getCurrentlyPlaying = async (access_token: string) => {
  const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  });
  
  // No content means nothing is playing
  if (response.status === 204) {
    return { is_playing: false };
  }
  
  // Check for errors
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Spotify API error: ${error}`);
  }
  
  return response.json();
};

// Get recently played tracks
export const getRecentlyPlayed = async (access_token: string) => {
  const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=3', {
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Spotify API error: ${error}`);
  }

  return response.json();
};
