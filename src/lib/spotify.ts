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
  'user-read-recently-played',
  'user-library-read',       // For saved albums
  'user-follow-read',        // For followed artists
  'playlist-read-private'    // For private playlists
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

// Get total saved albums
export const getSavedAlbums = async (access_token: string) => {
  const response = await fetch('https://api.spotify.com/v1/me/albums?limit=1', {
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Spotify API error: ${error}`);
  }

  const data = await response.json();
  return { total: data.total || 0 };
};

// Get total followed artists
export const getFollowedArtists = async (access_token: string) => {
  const response = await fetch('https://api.spotify.com/v1/me/following?type=artist&limit=1', {
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Spotify API error: ${error}`);
  }

  const data = await response.json();
  // The response structure from Spotify is { artists: { items: [], total: number } }
  return { total: data.artists?.total || 0 };
};

// Get total user playlists
export const getUserPlaylists = async (access_token: string) => {
  const response = await fetch('https://api.spotify.com/v1/me/playlists?limit=1', {
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Spotify API error: ${error}`);
  }

  const data = await response.json();
  return { total: data.total || 0 };
};

// Get top genres
export const getTopGenres = async (access_token: string) => {
  // Get user's top artists
  const response = await fetch('https://api.spotify.com/v1/me/top/artists?limit=20&time_range=medium_term', {
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Spotify API error: ${error}`);
  }

  const data = await response.json();
  
  // Count genres
  const genreCounts: Record<string, number> = {};
  let totalGenres = 0;
  
  data.items.forEach((artist: any) => {
    artist.genres.forEach((genre: string) => {
      if (!genreCounts[genre]) {
        genreCounts[genre] = 0;
      }
      genreCounts[genre] += 1;
      totalGenres += 1;
    });
  });
  
  // Convert to array and sort
  const genres = Object.entries(genreCounts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / totalGenres) * 100)
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Just get top 5
  
  return { genres };
};

export async function getTopArtists(accessToken: string) {
  const response = await fetch(`https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=20`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  });

  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.status}`);
  }

  return response.json();
}