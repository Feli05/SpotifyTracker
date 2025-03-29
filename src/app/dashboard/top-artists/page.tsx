"use client";
import { TopArtistCard } from "@/components/dashboard/Content/TopArtistCard";

export default function Home() {
    return (
        <main className="flex flex-col px-4 py-4">
            <div className="full">
                <div className="h-full">
                    <TopArtistCard/>
                </div>
            </div>
        </main>
    );
}

