"use client";
import { ConnectionCheck } from "@/components/dashboard/ConnectionCheck";
import { TopArtistCard } from "@/components/dashboard/Content/TopArtistCard";

export default function Home() {
    return (
        <main className="flex flex-col p-4 h-full">
            <ConnectionCheck>
                <div className="full">
                    <div className="h-full">
                        <TopArtistCard/>
                    </div>
                </div>
            </ConnectionCheck>
        </main>
    );
}

