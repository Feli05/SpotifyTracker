// import { URLSearchParams } from 'url';
import spotifyPreviewFinder from 'spotify-preview-finder';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

// Required scopes for the app
const scopes = [
  'user-read-private',
  'user-read-email',
  'user-read-currently-playing',
  'user-top-read',
  'user-read-recently-played',
  'user-library-read',       
  'user-follow-read',        
  'playlist-read-private'   
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

// Get top artists 
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

// Get top tracks 
export async function getTopTracks(accessToken: string) {
  const response = await fetch(
    'https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=20',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.status} - ${await response.text()}`);
  }

  const data = await response.json();
  
  // Transform track data
  return {
    items: data.items.map((track: any, index: number) => ({
      rank: index + 1,
      id: track.id,
      name: track.name,
      artist: track.artists.map((artist: any) => artist.name).join(', '),
      album: track.album.name,
      albumCover: track.album.images?.[0]?.url || null,
      releaseDate: track.album.release_date || 'Unknown',
      releaseYear: track.album.release_date ? new Date(track.album.release_date).getFullYear() : 'Unknown',
      popularity: track.popularity || 0,
      url: track.external_urls?.spotify || null,
      previewUrl: track.preview_url || null
    }))
  };
}

// Get user playlists
export async function getUserPlaylistsDetailed(accessToken: string) {
  const response = await fetch(
    'https://api.spotify.com/v1/me/playlists?limit=3',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.status} - ${await response.text()}`);
  }

  const data = await response.json();
  
  return {
    playlists: data.items.map((playlist: any) => ({
      id: playlist.id,
      name: playlist.name,
      image: playlist.images?.[0]?.url || null,
      url: playlist.external_urls?.spotify || null,
      tracks: playlist.tracks?.total || 0
    }))
  };
}

// Get top items 
export async function getTopItems(accessToken: string) {
  // Fetch top artist
  const artistResponse = await fetch(
    'https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=1',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
  
  // Fetch top track
  const trackResponse = await fetch(
    'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=1',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
  
  if (!artistResponse.ok || !trackResponse.ok) {
    throw new Error(`Spotify API error: Artist status ${artistResponse.status}, Track status ${trackResponse.status}`);
  }
  
  const artistData = await artistResponse.json();
  const trackData = await trackResponse.json();
  
  const topArtist = artistData.items && artistData.items.length > 0 
    ? {
        name: artistData.items[0].name,
        image: artistData.items[0].images?.[0]?.url || null,
        url: artistData.items[0].external_urls?.spotify || null,
        followers: artistData.items[0].followers?.total || 0,
        popularity: artistData.items[0].popularity || 0
      }
    : null;
  
  const topTrack = trackData.items && trackData.items.length > 0
    ? {
        name: trackData.items[0].name,
        artist: trackData.items[0].artists?.[0]?.name || 'Unknown Artist',
        image: trackData.items[0].album?.images?.[0]?.url || null,
        url: trackData.items[0].external_urls?.spotify || null,
        popularity: trackData.items[0].popularity || 0
      }
    : null;
  
  return {
    topArtist,
    topTrack
  };
}

// function to fetch preview URLs directly
export const fetchSpotifyPreview = async (
  searchQuery: string,
  limit: number = 3
) => {
  try {
    // Directly use the package on the server side
    const result = await spotifyPreviewFinder(searchQuery, limit);
    
    if (result.success && result.results && result.results.length > 0) {
      return {
        success: true,
        previews: result.results.map((song: any) => ({
          name: song.name,
          spotifyUrl: song.spotifyUrl,
          previewUrl: song.previewUrls[0] || null
        }))
      };
    }
    
    return {
      success: false,
      error: 'No preview found',
      previews: []
    };
  } catch (error) {
    console.error('Error fetching Spotify preview:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      previews: []
    };
  }
};