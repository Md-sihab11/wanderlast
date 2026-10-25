"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import {
    CalendarDays,
    BadgeCheck,
    CheckCircle2,
    ClipboardList,
    Clock3,
    Eye,
    MapPin,
    Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    confirmBooking,
    getBookingsSnapshot,
    getServerBookingsSnapshot,
    removeBooking,
    subscribeBookings,
} from "@/lib/bookings";

const formatDeparture = (value: string): string => {
    if (!value) return "Not set";

    const [year, month, day] = value.slice(0, 10).split("-").map(Number);

    if (!year || !month || !day) return value;

    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
};

const MyBookingPage = () => {
    const router = useRouter();
    const bookings = useSyncExternalStore(
        subscribeBookings,
        getBookingsSnapshot,
        getServerBookingsSnapshot
    );

    const handleCancel = (id: string) => {
        removeBooking(id);
    };

    const handleConfirm = (id: string) => {
        confirmBooking(id);
    };

    return (
        <main className="min-h-screen bg-white text-[#171717]">
            <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
                {/* Header */}
                <header>
                    <h1 className="font-serif text-[34px] leading-tight tracking-tight sm:text-[38px]">
                        My Bookings
                    </h1>

                    <p className="mt-1 text-sm text-[#737373]">
                        Manage and view your upcoming travel plans
                    </p>
                </header>

                {/* Empty state */}
                {bookings.length === 0 && (
                    <div className="mt-10 rounded-xl border border-dashed border-[#eeeeee] py-16 text-center">
                        <ClipboardList className="mx-auto mb-3 h-8 w-8 text-[#a3a3a3]" />

                        <h2 className="text-lg font-semibold">
                            No bookings yet
                        </h2>

                        <p className="mt-1 text-sm text-[#737373]">
                            Pick a destination and book your next trip — it will
                            show up here.
                        </p>

                        <Button
                            className="mt-5 h-9 rounded-none bg-[#17a2bd] px-5 text-white hover:bg-[#128ca5]"
                            onClick={() => router.push("/destinations")}
                        >
                            Explore Destinations
                        </Button>
                    </div>
                )}

                {/* Booking cards */}
                <div className="mt-7 space-y-5">
                    {bookings.map((booking) => {
                        const confirmed = booking.status === "Confirmed";

                        return (
                            <article
                                key={booking.id}
                                className="flex flex-col gap-4 rounded-xl border border-[#eeeeee] bg-white p-4 shadow-sm sm:flex-row sm:items-stretch"
                            >
                                {/* Thumbnail */}
                                <div className="h-44 w-full shrink-0 overflow-hidden rounded-lg bg-slate-100 sm:h-32 sm:w-60">
                                    {booking.imageUrl ? (
                                        <img
                                            src={booking.imageUrl}
                                            alt={booking.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-xs text-slate-400">
                                            No image available
                                        </div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex min-w-0 flex-1 flex-col">
                                    <span
                                        className={`inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                                            confirmed
                                                ? "bg-green-50 text-green-700"
                                                : "bg-amber-50 text-amber-700"
                                        }`}
                                    >
                                        {confirmed ? (
                                            <CheckCircle2 className="h-3 w-3" />
                                        ) : (
                                            <Clock3 className="h-3 w-3" />
                                        )}
                                        {booking.status}
                                    </span>

                                    <h2 className="mt-2 truncate text-[22px] font-semibold leading-tight tracking-tight">
                                        {booking.name}
                                    </h2>

                                    <ul className="mt-2 space-y-1.5 text-[13px] text-[#404040]">
                                        <li className="flex items-center gap-2">
                                            <CalendarDays className="h-3.5 w-3.5 text-[#737373]" />
                                            Departure:{" "}
                                            {formatDeparture(
                                                booking.departureDate
                                            )}
                                        </li>

                                        <li className="flex items-center gap-2">
                                            <MapPin className="h-3.5 w-3.5 text-[#737373]" />
                                            {booking.country}
                                        </li>

                                        <li className="flex items-center gap-2">
                                            <ClipboardList className="h-3.5 w-3.5 text-[#737373]" />
                                            Booking ID: {booking.id}
                                        </li>
                                    </ul>

                                    <p className="mt-3 text-[26px] font-medium leading-tight text-[#13a2bd]">
                                        ${booking.price.toLocaleString("en-US")}
                                    </p>

                                    {!confirmed && (
                                        <p className="mt-1 text-[11px] text-amber-600">
                                            Trip completed? Tap Confirm to mark
                                            this booking as confirmed.
                                        </p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex flex-row items-center gap-2 sm:flex-col sm:items-end sm:justify-center">
                                    {!confirmed && (
                                        <Button
                                            className="h-9 rounded-md bg-green-600 px-5 text-sm font-normal text-white hover:bg-green-700"
                                            onClick={() =>
                                                handleConfirm(booking.id)
                                            }
                                        >
                                            <BadgeCheck className="mr-2 h-4 w-4" />
                                            Confirm
                                        </Button>
                                    )}

                                    <Button
                                        variant="outline"
                                        className="h-9 rounded-md border-red-200 bg-white px-4 text-sm font-normal text-red-500 hover:bg-red-50 hover:text-red-600"
                                        onClick={() => handleCancel(booking.id)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Cancel
                                    </Button>

                                    <Button
                                        className="h-9 rounded-md bg-[#13a2bd] px-5 text-sm font-normal text-white hover:bg-[#128ca5]"
                                        onClick={() =>
                                            router.push(
                                                `/destinations/${booking.destinationId}`
                                            )
                                        }
                                    >
                                        <Eye className="mr-2 h-4 w-4" />
                                        View
                                    </Button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </main>
    );
};

export default MyBookingPage;
