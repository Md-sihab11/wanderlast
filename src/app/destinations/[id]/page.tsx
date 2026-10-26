
"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  MapPin,
  Pencil,
  Star,
  Trash2,
  Save,
} from "lucide-react";

import type { Destination } from "../../../../types/type";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { addBooking } from "@/lib/bookings";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const API_URL = `http://${process.env.NEXT_PUBLIC_API_URL}/destinations`;

const categories = [
  "Beach",
  "Mountain",
  "Adventure",
  "City",
  "Cultural",
  "Nature",
];

type DestinationForm = {
  name: string;
  country: string;
  category: string;
  price: string;
  duration: string;
  departureDate: string;
  imageUrl: string;
  description: string;
};

const emptyForm: DestinationForm = {
  name: "",
  country: "",
  category: "",
  price: "",
  duration: "",
  departureDate: "",
  imageUrl: "",
  description: "",
};

function unwrapDestination(payload: unknown): Destination | null {
  if (!payload || typeof payload !== "object") return null;

  const obj = payload as Record<string, unknown>;

  if (obj.res1) return unwrapDestination(obj.res1);
  if (obj.data) return unwrapDestination(obj.data);
  if (obj.destination) return unwrapDestination(obj.destination);

  if (typeof obj._id === "string" || typeof obj.name === "string") {
    return obj as unknown as Destination;
  }

  return null;
}

async function fetchDestinationById(id: string): Promise<Destination> {
  const response = await fetch(`${API_URL}/${id}`);

  const payload: unknown = await response.json();
  const result = unwrapDestination(payload);

  if (!result) {
    throw new Error("Destination data not found.");
  }

  return result;
}

function formatPrice(price: string | number) {
  return Number(price).toLocaleString("en-US");
}

function formatDeparture(value: string): string {
  if (!value) return "Not set";

  const [year, month, day] = value.slice(0, 10).split("-").map(Number);

  if (!year || !month || !day) return value;

  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function DestinationDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();

  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<DestinationForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const fetchDestination = useCallback(async () => {
    try {
      const result = await fetchDestinationById(id);

      setDestination(result);
      setError("");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDestinationById(id)
      .then((result) => {
        setDestination(result);
        setError("");
      })
      .catch((err: unknown) => {
        setError(
          err instanceof Error ? err.message : "Something went wrong."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const updateField = (
    field: keyof DestinationForm,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const openEditDialog = () => {
    if (!destination) return;

    setForm({
      name: destination.name || "",
      country: destination.country || "",
      category: destination.category || "",
      price: String(destination.price ?? ""),
      duration: destination.duration || "",
      departureDate: destination.departureDate
        ? String(destination.departureDate).slice(0, 10)
        : "",
      imageUrl: destination.imageUrl || "",
      description: destination.description || "",
    });

    setError("");
    setEditOpen(true);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim() || !form.country.trim()) {
      setError("Destination name and country are required.");
      return;
    }

    if (!form.price.trim() || Number(form.price) < 0) {
      setError("Please enter a valid price.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          country: form.country.trim(),
          category: form.category,
          price: form.price,
          duration: form.duration,
          departureDate: form.departureDate,
          imageUrl: form.imageUrl.trim(),
          description: form.description.trim(),
        }),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to update destination.");
      }

      setEditOpen(false);
      await fetchDestination();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Update failed."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to delete destination.");
      }

      router.push("/destinations");
      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Delete failed."
      );
      setDeleting(false);
    }
  };

  const handleBookNow = () => {
    if (!bookingDate) {
      setError("Please select a departure date.");
      return;
    }

    setError("");
    setConfirmOpen(true);
  };

  const handleConfirmBooking = () => {
    if (!destination || !bookingDate) return;

    addBooking({
      destinationId: destination._id || id,
      name: destination.name,
      country: destination.country,
      imageUrl: destination.imageUrl,
      departureDate: bookingDate,
      price: Number(destination.price) || 0,
    });

    setConfirmOpen(false);
    router.push("/my-bookings");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="mb-6 h-5 w-40 rounded bg-slate-100" />
          <div className="h-64 w-full rounded bg-slate-100 sm:h-80" />
          <div className="mt-8 h-8 w-64 rounded bg-slate-100" />
          <div className="mt-4 h-4 w-full max-w-xl rounded bg-slate-100" />
        </div>
      </main>
    );
  }

  if (!destination) {
    return (
      <main className="mx-auto max-w-6xl px-5 py-10">
        <Button
          variant="ghost"
          onClick={() => router.push("/destinations")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Destinations
        </Button>
        <p className="mt-5 text-sm text-red-600">
          {error || "Destination not found."}
        </p>
      </main>
    );
  }

  const highlights = [
    "Luxury beachfront accommodation",
    "Visit beautiful local attractions",
    "Traditional local cuisine experience",
    "Explore scenic natural landscapes",
    "Sunrise and sunset sightseeing",
  ];

  return (
    <main className="min-h-screen bg-white text-[#171717]">
      <div className="mx-auto max-w-6xl px-5 py-7 sm:px-8">
        {/* Top navigation and actions */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => router.push("/destinations")}
            className="flex items-center gap-2 text-[11px] text-[#737373] transition hover:text-black"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Destinations
          </button>

          <div className="flex items-center gap-2">
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <Button
                type="button"
                variant="outline"
                onClick={openEditDialog}
                className="h-8 rounded-none border-[#d4d4d4] px-3 text-[11px] font-normal"
              >
                <Pencil className="mr-2 h-3 w-3" />
                Edit
              </Button>

              <DialogContent className="max-h-[90vh] overflow-y-auto rounded-none sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Edit Travel Destination</DialogTitle>
                  <DialogDescription>
                    Update your destination details.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Destination name</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(event) =>
                        updateField("name", event.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={form.country}
                      onChange={(event) =>
                        updateField("country", event.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={form.category}
                      onValueChange={(value) =>
                        updateField("category", value ?? "")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        value={form.price}
                        onChange={(event) =>
                          updateField("price", event.target.value)
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={form.duration}
                        onChange={(event) =>
                          updateField("duration", event.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="departureDate">Departure date</Label>
                    <Input
                      id="departureDate"
                      type="date"
                      value={form.departureDate}
                      onChange={(event) =>
                        updateField("departureDate", event.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      type="url"
                      value={form.imageUrl}
                      onChange={(event) =>
                        updateField("imageUrl", event.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Overview</Label>
                    <Textarea
                      id="description"
                      rows={4}
                      value={form.description}
                      onChange={(event) =>
                        updateField("description", event.target.value)
                      }
                      required
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-600">{error}</p>
                  )}

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={saving}
                      onClick={() => setEditOpen(false)}
                    >
                      Cancel
                    </Button>

                    <Button type="submit" disabled={saving}>
                      <Save className="mr-2 h-4 w-4" />
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    disabled={deleting}
                    className="h-8 rounded-none border-red-300 px-3 text-[11px] font-normal text-red-500 hover:bg-red-50 hover:text-red-600"
                  />
                }
              >
                <Trash2 className="mr-2 h-3 w-3" />
                Cancel
              </AlertDialogTrigger>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Delete this destination?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. The destination will be
                    permanently removed.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Go Back</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={deleting}
                    className="bg-red-600 hover:bg-red-700"
                    onClick={(event) => {
                      event.preventDefault();
                      void handleDelete();
                    }}
                  >
                    {deleting ? "Deleting..." : "Delete Destination"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Large destination image */}
        <div className="h-[230px] w-full overflow-hidden bg-slate-100 sm:h-[300px] lg:h-[268px]">
          {destination.imageUrl ? (
            <img
              src={destination.imageUrl}
              alt={destination.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              No destination image available
            </div>
          )}
        </div>

        {/* Details section */}
        <div className="mt-5 border-t border-[#eeeeee] pt-5">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_215px]">
            {/* Left column */}
            <section className="min-w-0">
              <p className="flex items-center gap-1.5 text-[10px] text-[#737373]">
                <MapPin className="h-3 w-3" />
                {destination.country}
              </p>

              <h1 className="mt-2 font-serif text-[30px] leading-tight tracking-tight text-[#171717] sm:text-[32px]">
                {destination.name}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px]">
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-green-600 text-green-600" />
                  <strong>4.9</strong>
                  <span className="text-[#737373]">(234 reviews)</span>
                </span>

                <span className="flex items-center gap-1 text-[#404040]">
                  <CalendarDays className="h-3 w-3 text-[#737373]" />
                  <strong>{destination.duration}</strong>
                </span>
              </div>

              <section className="mt-5">
                <h2 className="text-[16px] font-medium tracking-tight">
                  Overview
                </h2>
                <p className="mt-2 max-w-2xl text-[10px] leading-[1.7] text-[#737373]">
                  {destination.description}
                </p>
              </section>

              <section className="mt-5">
                <h2 className="text-[16px] font-medium tracking-tight">
                  Highlights
                </h2>

                <p className="mt-2 max-w-2xl text-[10px] leading-[1.7] text-[#737373]">
                  Discover the beauty of {destination.name}, enjoy local
                  experiences, explore scenic landscapes, and make your
                  trip memorable.
                </p>

                <ul className="mt-3 grid grid-cols-1 gap-x-5 gap-y-2 sm:grid-cols-2">
                  {highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex items-start gap-1.5 text-[10px] leading-4 text-[#737373]"
                    >
                      <Check className="mt-0.5 h-3 w-3 shrink-0 text-green-600" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </section>
            </section>

            {/* Right booking card */}
            <aside className="h-fit border border-[#eeeeee] bg-white p-3 shadow-sm">
              <p className="text-[9px] text-[#737373]">Starting from</p>

              <p className="mt-0.5 text-[21px] font-medium leading-tight text-[#13a2bd]">
                ৳{formatPrice(destination.price)}
              </p>

              <p className="mt-1 text-[9px] text-[#737373]">
                per person
              </p>

              <div className="mt-5 border-b border-[#eeeeee] pb-2">
                <Label
                  htmlFor="bookingDate"
                  className="sr-only"
                >
                  Departure date
                </Label>
                <Input
                  id="bookingDate"
                  type="date"
                  value={bookingDate}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(event) =>
                    setBookingDate(event.target.value)
                  }
                  className="h-8 rounded-none border-[#eeeeee] bg-[#fafafa] px-2 text-[10px]"
                />

                {error && (
                  <p className="mt-2 text-[10px] text-red-600">{error}</p>
                )}
              </div>

              <Button
                className="mt-2 h-[38px] w-full rounded-none bg-[#17a2bd] text-[10px] text-white hover:bg-[#128ca5]"
                onClick={handleBookNow}
              >
                Book Now
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>

              {/* Booking confirmation dialog */}
              <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent className="rounded-none sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Confirm your booking</DialogTitle>
                    <DialogDescription>
                      Review your selected destination before confirming.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="flex gap-3 rounded-none border border-[#eeeeee] p-3">
                    <div className="h-20 w-28 shrink-0 overflow-hidden bg-slate-100">
                      {destination.imageUrl ? (
                        <img
                          src={destination.imageUrl}
                          alt={destination.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-slate-400">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold tracking-tight">
                        {destination.name}
                      </p>

                      <p className="mt-1 flex items-center gap-1 text-[11px] text-[#737373]">
                        <MapPin className="h-3 w-3" />
                        {destination.country}
                      </p>

                      <p className="mt-1 flex items-center gap-1 text-[11px] text-[#737373]">
                        <CalendarDays className="h-3 w-3" />
                        Departure: {formatDeparture(bookingDate)}
                      </p>

                      <p className="mt-1 text-lg font-medium text-[#13a2bd]">
                        ৳{formatPrice(destination.price)}
                      </p>
                    </div>
                  </div>

                  <DialogFooter className="gap-2 sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-none"
                      onClick={() => setConfirmOpen(false)}
                    >
                      Cancel
                    </Button>

                    <Button
                      type="button"
                      className="rounded-none bg-[#17a2bd] text-white hover:bg-[#128ca5]"
                      onClick={handleConfirmBooking}
                    >
                      Confirm Booking
                      <Check className="ml-1 h-4 w-4" />
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <ul className="mt-3 space-y-1.5">
                {[
                  "Free cancellation up to 7 days",
                  "Travel insurance included",
                  "24/7 customer support",
                ].map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-1 text-[9px] leading-4 text-[#737373]"
                  >
                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-green-600" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
