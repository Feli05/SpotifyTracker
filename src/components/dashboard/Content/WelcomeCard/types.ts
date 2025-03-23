export interface SpotifyProfile {
  display_name: string;
  images: Array<{ url: string }>;
  country: string;
  followers: { total: number };
  product: string;
  external_urls: { spotify: string };
}

export interface TopItemsData {
  topArtist: {
    name: string;
    image: string;
    url: string;
    followers: number;
    popularity: number;
  } | null;
  topTrack: {
    name: string;
    artist: string;
    image: string;
    url: string;
    popularity: number;
  } | null;
}

export interface UserPlaylist {
  id: string;
  name: string;
  image: string | null;
  url: string;
  tracks: number;
} 