
"use client";

import { useEffect, useState } from "react";
import {
    MapPin,
    Calendar,
    Search,
    ArrowUpRight,
    Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiResponse, Destination } from "../../../types/type";
import Link from "next/link";



const API_URL = `http://${process.env.NEXT_PUBLIC_API_URL}/destinations`;

const AllDestinationPage = () => {
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch destinations
    useEffect(() => {
        const controller = new AbortController();

        const fetchDestinations = async () => {
            try {
                const res = await fetch(API_URL, {
                    signal: controller.signal,
                });

                if (!res.ok) {
                    throw new Error("Failed to load destinations.");
                }

                const data: ApiResponse = await res.json();

                const items = Array.isArray(data) ? data : data.data;

                if (!Array.isArray(items)) {
                    throw new Error("Invalid destination data.");
                }

                setDestinations(items);
            } catch (err: unknown) {
                if (err instanceof Error && err.name === "AbortError") {
                    return;
                }

                setError(
                    err instanceof Error
                        ? err.message
                        : "Something went wrong."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchDestinations();

        return () => controller.abort();
    }, []);

    // Support both destination JSON formats
    const getTitle = (item: Destination): string => item.name || "Untitled Destination";

    const getLocation = (item: Destination): string => item.country || "Unknown Location";

    const getImage = (item: Destination): string => item.imageUrl || "";

    const getPrice = (item: Destination): number => {
        const price = Number(item.price);
        return Number.isFinite(price) && price >= 0 ? price : 0;
    };

    // Search destinations
    const filteredDestinations = destinations.filter((item) => {
        const search = searchTerm.trim().toLowerCase();

        return [
            getTitle(item),
            getLocation(item),
            item.category || "",
        ].some((value) => value.toLowerCase().includes(search));
    });


    return (
        <main className="min-h-screen bg-background">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                {/* Header */}
                <header className="mb-8 space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        Explore All Destinations
                    </h1>

                    <p className="text-muted-foreground">
                        Find your perfect travel experience.
                    </p>
                </header>

                {/* Search */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-muted-foreground">
                        Showing {filteredDestinations.length} destinations
                    </p>

                    <div className="relative w-full sm:max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                            placeholder="Search destination..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="py-16 text-center">
                        <p className="mb-4 text-destructive">{error}</p>

                        <Button
                            variant="outline"
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </Button>
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && filteredDestinations.length === 0 && (
                    <div className="rounded-xl border border-dashed py-20 text-center">
                        <Search className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />

                        <h2 className="font-semibold">No destinations found</h2>

                        <p className="mt-1 text-sm text-muted-foreground">
                            Try another search keyword.
                        </p>
                    </div>
                )}

                {/* Destination cards */}
                {!loading && !error && filteredDestinations.length > 0 && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredDestinations.map((item, index) => (
                            <article
                                key={item.id ?? item._id ?? `${getTitle(item)}-${index}`}
                                className="group overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg"
                            >
                                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                                    {getImage(item) ? (
                                        <img
                                            src={getImage(item)}
                                            alt={getTitle(item)}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-muted-foreground">
                                            No image available
                                        </div>
                                    )}

                                </div>

                                <div className="space-y-3 p-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4 shrink-0" />
                                        <span>{getLocation(item)}</span>
                                    </div>

                                    <div className="flex items-start justify-between gap-3">
                                        <h2 className="text-lg font-semibold">
                                            {getTitle(item)}
                                        </h2>

                                        <div className="shrink-0 text-right">
                                            <p className="font-bold">
                                                ৳{getPrice(item).toLocaleString()}
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                                / person
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4 shrink-0" />
                                        <span>
                                            {item.duration || "Duration not specified"}
                                        </span>
                                    </div>

                                    <Link
                                        href={`/destinations/${item.id ?? item._id}`}
                                        className="block"
                                    >
                                        <Button variant="outline" className="w-full">
                                            Book Now
                                            <ArrowUpRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default AllDestinationPage;
