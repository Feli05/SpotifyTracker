export interface Track {
  rank: number;
  id: string;
  name: string;
  artist: string;
  album: string;
  albumCover: string | null;
  releaseYear: string | number;
  popularity: number;
  url: string | null;
}

export interface SongCellProps {
  track: Track;
  columnKey: string;
}

export const columns = [
  {
    name: "RANK",
    uid: "rank",
  },
  {
    name: "SONG",
    uid: "name",
  },
  {
    name: "ARTIST",
    uid: "artist",
  },
  {
    name: "ALBUM",
    uid: "album",
  },
  {
    name: "YEAR",
    uid: "releaseYear",
  },
  {
    name: "POPULARITY",
    uid: "popularity",
  },
]; 