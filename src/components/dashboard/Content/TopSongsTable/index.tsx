// TopSongsTable/index.tsx
import { Card, CardBody, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Spinner } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { Track, columns } from "./data";
import { SongCell } from "./SongCell";

export const TopSongsTable = () => {
    const [topTracks, setTopTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTopTracks = async () => {
            try {
                const response = await fetch('/api/spotify/top-tracks');
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch: ${response.status}`);
                }
                
                const data = await response.json();
                setTopTracks(data.topTracks || []);
            } catch (err) {
                console.error('Error fetching top tracks:', err);
                setError('Failed to load your top tracks. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchTopTracks();
    }, []);

    return (
        <Card className="w-full h-full rounded-xl shadow-lg shadow-primary-subtle/15 hover:shadow-xl transition-shadow duration-300 bg-primary text-text-primary border border-gray-800/40">
            <CardBody className="p-5">
                <h2 className="text-xl font-bold mb-4">Top Songs</h2>
                
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Spinner size="lg" color="primary" />
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-64 text-center">
                        <p className="text-danger">{error}</p>
                    </div>
                ) : (
                    <div className="overflow-auto">
                        <Table aria-label="Your top Spotify tracks">
                            <TableHeader columns={columns}>
                                {(column) => (
                                    <TableColumn 
                                        key={column.uid}
                                        align={column.uid === "rank" ? "center" : "start"}
                                        className="bg-primary-subtle text-text-secondary transition-all duration-200 shadow-sm"
                                    >
                                        {column.name}
                                    </TableColumn>
                                )}
                            </TableHeader>
                            <TableBody items={topTracks} emptyContent={"No tracks found"}>
                                {(track) => (
                                    <TableRow key={track.id} className="hover:bg-secondary/30 transition-colors">
                                        {(columnKey) => (
                                            <TableCell className="bg-secondary text-text-primary">
                                                <SongCell track={track} columnKey={columnKey.toString()} />
                                            </TableCell>
                                        )}
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardBody>
        </Card>
    );
};