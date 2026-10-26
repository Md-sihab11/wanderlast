export type BookingStatus = "Confirmed" | "Pending";

export type Booking = {
  id: string;
  destinationId: string;
  name: string;
  country: string;
  imageUrl: string;
  departureDate: string;
  price: number;
  status: BookingStatus;
  createdAt: string;
};

const STORAGE_KEY = "wanderlust-bookings";

const EMPTY_BOOKINGS: Booking[] = [];

const listeners = new Set<() => void>();

let cachedRaw: string | null = null;
let cachedBookings: Booking[] = EMPTY_BOOKINGS;

export function createBookingId(): string {
  return `b${Date.now().toString(36)}${Math.random()
    .toString(36)
    .slice(2, 5)}`;
}

function parseBookings(raw: string): Booking[] {
  if (!raw) return EMPTY_BOOKINGS;

  try {
    const parsed: unknown = JSON.parse(raw);

    return Array.isArray(parsed) ? (parsed as Booking[]) : EMPTY_BOOKINGS;
  } catch {
    return EMPTY_BOOKINGS;
  }
}

function readRaw(): string | null {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // Storage may be unavailable (private mode) — treat as empty.
    return null;
  }
}

/** Stable snapshot of the stored bookings (safe for useSyncExternalStore). */
export function getBookingsSnapshot(): Booking[] {
  const raw = readRaw();

  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedBookings = parseBookings(raw ?? "");
  }

  return cachedBookings;
}

/** Snapshot used while rendering on the server (no storage available). */
export function getServerBookingsSnapshot(): Booking[] {
  return EMPTY_BOOKINGS;
}

export function subscribeBookings(onStoreChange: () => void): () => void {
  listeners.add(onStoreChange);

  const onStorage = () => onStoreChange();
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
}

function getBookings(): Booking[] {
  return getBookingsSnapshot();
}

function saveBookings(bookings: Booking[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  } catch {
    // Ignore storage failures — the in-memory snapshot still updates.
  }

  // Invalidate the snapshot cache so the next read picks up the change.
  cachedRaw = null;
  cachedBookings = EMPTY_BOOKINGS;

  listeners.forEach((listener) => listener());
}

export function addBooking(
  booking: Omit<Booking, "id" | "createdAt" | "status">
): Booking[] {
  const bookings = getBookings();

  const newBooking: Booking = {
    ...booking,
    id: createBookingId(),
    status: "Pending",
    createdAt: new Date().toISOString(),
  };

  const next = [newBooking, ...bookings];
  saveBookings(next);

  return getBookings();
}

/** Mark a booking as confirmed (used once the trip is complete). */
export function confirmBooking(id: string): Booking[] {
  const next: Booking[] = getBookings().map((booking) =>
    booking.id === id ? { ...booking, status: "Confirmed" } : booking
  );

  saveBookings(next);

  return getBookings();
}

export function removeBooking(id: string): Booking[] {
  const next = getBookings().filter((booking) => booking.id !== id);
  saveBookings(next);

  return getBookings();
}

export type BookingStats = {
  total: number;
  confirmed: number;
  pending: number;
  totalSpent: number;
  countriesVisited: number;
  upcomingTrips: number;
};

/**
 * Summary of the stored bookings, used by the profile statistics.
 * Only Confirmed trips are counted — pending bookings are excluded.
 */
export function getBookingStats(bookings: Booking[]): BookingStats {
  let confirmed = 0;
  let pending = 0;
  let totalSpent = 0;
  let upcomingTrips = 0;

  const countries = new Set<string>();
  const today = new Date().toISOString().slice(0, 10);

  for (const booking of bookings) {
    if (booking.status !== "Confirmed") {
      pending += 1;
      continue;
    }

    confirmed += 1;
    totalSpent += Number(booking.price) || 0;

    const country = booking.country.trim().toLowerCase();
    if (country) countries.add(country);

    const departure = booking.departureDate.slice(0, 10);
    if (departure && departure >= today) upcomingTrips += 1;
  }

  return {
    total: bookings.length,
    confirmed,
    pending,
    totalSpent,
    countriesVisited: countries.size,
    upcomingTrips,
  };
}
