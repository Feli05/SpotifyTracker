import { Chip, Image } from "@heroui/react";
import React from "react";
import { Track, SongCellProps } from "./data";

export const SongCell = ({ track, columnKey }: SongCellProps) => {
  switch (columnKey) {
    case "rank":
      return (
        <div className="flex justify-center items-center font-medium text-center">
          {track.rank}
        </div>
      );
      
    case "name":
      return (
        <div className="flex items-center gap-3">
          {track.albumCover ? (
            <Image 
              src={track.albumCover} 
              alt={`${track.name} album cover`}
              className="w-10 h-10 rounded object-cover"
              width={40}
              height={40}
            />
          ) : (
            <div className="w-10 h-10 rounded bg-gray-300 flex items-center justify-center">
              <span className="text-xs">No img</span>
            </div>
          )}
          <div className="flex flex-col">
            <p className="font-medium truncate max-w-[180px]">{track.name}</p>
          </div>
        </div>
      );
      
    case "artist":
      return (
        <div>
          <p className="truncate max-w-[200px]">{track.artist}</p>
        </div>
      );
      
    case "album":
      return (
        <div>
          <p className="truncate max-w-[200px]">{track.album}</p>
        </div>
      );
      
    case "releaseYear":
      return <div>{track.releaseYear}</div>;
      
    case "popularity":
      return (
        <Chip
          size="sm"
          variant="flat"
          color={
            track.popularity >= 70
              ? "success"
              : track.popularity >= 40
              ? "warning"
              : "danger"
          }
        >
          <span className="capitalize text-xs">{track.popularity}</span>
        </Chip>
      );
      
    default:
      return <div>{track[columnKey as keyof Track]}</div>;
  }
}; 