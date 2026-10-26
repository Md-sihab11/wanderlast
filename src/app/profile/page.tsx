"use client";

import Image from "next/image";
import { useEffect, useState, useSyncExternalStore, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Camera,
  Check,
  Clock3,
  DollarSign,
  Globe,
  Luggage,
  Mail,
  Pencil,
  Plane,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import {
  getBookingsSnapshot,
  getBookingStats,
  getServerBookingsSnapshot,
  subscribeBookings,
  type BookingStats,
} from "@/lib/bookings";

type StatsData = {
  totalDestinations: number;
  countriesCovered: number;
  upcomingDepartures: number;
  averagePrice: number;
};

const STATS_API_URL = `http://${process.env.NEXT_PUBLIC_API_URL}/stats`;

const statDefinitions = [
  {
    label: "Total Destinations",
    icon: Plane,
    tone: "text-cyan-600 bg-cyan-100",
    format: (stats: StatsData) => stats.totalDestinations.toLocaleString("en-US"),
  },
  {
    label: "Countries Covered",
    icon: Globe,
    tone: "text-emerald-600 bg-emerald-100",
    format: (stats: StatsData) => stats.countriesCovered.toLocaleString("en-US"),
  },
  {
    label: "Upcoming Departures",
    icon: TrendingUp,
    tone: "text-orange-500 bg-orange-100",
    format: (stats: StatsData) => stats.upcomingDepartures.toLocaleString("en-US"),
  },
  {
    label: "Average Price",
    icon: DollarSign,
    tone: "text-pink-600 bg-pink-100",
    format: (stats: StatsData) => `$${stats.averagePrice.toLocaleString("en-US")}`,
  },
] as const;

const bookingStatDefinitions = [
  {
    label: "Confirmed Trips",
    icon: BadgeCheck,
    tone: "text-green-600 bg-green-100",
    format: (stats: BookingStats) => stats.confirmed.toLocaleString("en-US"),
  },
  {
    label: "Pending Trips",
    icon: Clock3,
    tone: "text-amber-500 bg-amber-100",
    format: (stats: BookingStats) => stats.pending.toLocaleString("en-US"),
  },
  {
    label: "Trips Booked",
    icon: Luggage,
    tone: "text-sky-600 bg-sky-100",
    format: (stats: BookingStats) => stats.total.toLocaleString("en-US"),
  },
  {
    label: "Total Spent",
    icon: Wallet,
    tone: "text-violet-600 bg-violet-100",
    format: (stats: BookingStats) =>
      `$${stats.totalSpent.toLocaleString("en-US")}`,
  },
] as const;

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function formatMemberSince(value: string | number | Date) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function ProfileSkeleton() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
      <Skeleton className="h-10 w-56" />
      <Skeleton className="mt-3 h-5 w-80" />

      <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="h-fit py-8 shadow-none ring-border/70!">
          <CardContent className="flex flex-col items-center text-center">
            <Skeleton className="size-28 rounded-full" />
            <Skeleton className="mt-5 h-6 w-40" />
            <Skeleton className="mt-2 h-4 w-32" />
            <Skeleton className="mt-6 h-11 w-full" />
          </CardContent>
        </Card>

        <section>
          <Skeleton className="h-6 w-44" />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {statDefinitions.map((stat) => (
              <Card key={stat.label} className="py-5 shadow-none ring-border/70!">
                <CardContent>
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [failedAvatarSrc, setFailedAvatarSrc] = useState<string | null>(null);

  const signedOut = !isPending && !user;

  const [stats, setStats] = useState<StatsData | null>(null);
  const [statsFailed, setStatsFailed] = useState(false);
  const [statsRequest, setStatsRequest] = useState(0);

  const bookings = useSyncExternalStore(
    subscribeBookings,
    getBookingsSnapshot,
    getServerBookingsSnapshot
  );
  const bookingStats = getBookingStats(bookings);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      try {
        const response = await fetch(STATS_API_URL);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = (await response.json()) as Partial<StatsData>;
        if (cancelled) return;

        setStats({
          totalDestinations: Number(data.totalDestinations) || 0,
          countriesCovered: Number(data.countriesCovered) || 0,
          upcomingDepartures: Number(data.upcomingDepartures) || 0,
          averagePrice: Number(data.averagePrice) || 0,
        });
        setStatsFailed(false);
      } catch {
        if (!cancelled) {
          setStatsFailed(true);
        }
      }
    }

    void loadStats();

    return () => {
      cancelled = true;
    };
  }, [statsRequest]);

  const retryStats = () => {
    setStats(null);
    setStatsFailed(false);
    setStatsRequest((request) => request + 1);
  };

  useEffect(() => {
    if (signedOut) {
      router.replace("/sign-in");
    }
  }, [signedOut, router]);

  const avatarSrc = editing
    ? image.trim() || user?.image || ""
    : user?.image || "";

  /** Fall back to the initials avatar when a photo URL fails to load. */
  const showAvatar = avatarSrc !== "" && failedAvatarSrc !== avatarSrc;

  const startEditing = () => {
    setName(user?.name ?? "");
    setImage(user?.image ?? "");
    setErrorMessage("");
    setFailedAvatarSrc(null);
    setEditing(true);
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setErrorMessage("Please enter your name.");
      return;
    }

    setSaving(true);
    setErrorMessage("");

    try {
      const { error } = await authClient.updateUser({
        name: trimmedName,
        image: image.trim() || undefined,
      });

      if (error) {
        setErrorMessage(error.message || "Could not save your changes.");
        return;
      }

      setEditing(false);
      router.refresh();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (isPending || !user) {
    return <ProfileSkeleton />;
  }

  const details = [
    { label: "Email", value: user.email },
    { label: "Member since", value: formatMemberSince(user.createdAt) },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 md:py-16">
      <h1 className="text-4xl font-normal tracking-tight md:text-5xl">
        My Profile
      </h1>
      <p className="mt-2 text-muted-foreground">
        Manage your account settings and travel preferences
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Profile summary */}
        <Card className="h-fit py-8 shadow-none ring-border/70!">
          <CardContent className="flex flex-col items-center text-center">
            <div className="relative">
              {showAvatar ? (
                <Image
                  src={avatarSrc}
                  alt={user.name}
                  width={112}
                  height={112}
                  unoptimized
                  onError={() => setFailedAvatarSrc(avatarSrc)}
                  className="size-28 rounded-full object-cover"
                />
              ) : (
                <div className="grid size-28 place-items-center rounded-full bg-cyan-100 text-3xl font-semibold text-cyan-700">
                  {getInitials(user.name || user.email)}
                </div>
              )}
              {!editing && (
                <button
                  type="button"
                  aria-label="Change profile photo"
                  onClick={startEditing}
                  className="absolute right-0 bottom-0 grid size-9 place-items-center rounded-full bg-cyan-600 text-white shadow-md transition-colors hover:bg-cyan-700"
                >
                  <Camera className="size-4" />
                </button>
              )}
            </div>

            {editing ? (
              <form onSubmit={handleSave} className="mt-5 w-full space-y-4 text-left">
                <div className="space-y-1.5">
                  <Label htmlFor="profile-name">Full Name</Label>
                  <Input
                    id="profile-name"
                    name="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    autoComplete="name"
                    maxLength={80}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="profile-image">Photo URL</Label>
                  <Input
                    id="profile-image"
                    name="image"
                    type="url"
                    value={image}
                    onChange={(event) => setImage(event.target.value)}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>

                {errorMessage && (
                  <p role="alert" className="text-sm text-red-600">
                    {errorMessage}
                  </p>
                )}

                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={saving}
                    className="h-11 flex-1 bg-cyan-600! text-white hover:bg-cyan-700!"
                  >
                    <Check className="size-4" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={saving}
                    onClick={() => {
                      setEditing(false);
                      setErrorMessage("");
                    }}
                    className="h-11"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <h2 className="mt-5 text-xl font-semibold">{user.name}</h2>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Mail className="size-4" />
                  {user.email}
                </p>

                <dl className="mt-6 w-full space-y-2 text-sm">
                  {details.map((detail) => (
                    <div key={detail.label} className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">{detail.label}</dt>
                      <dd className="font-semibold">{detail.value}</dd>
                    </div>
                  ))}
                </dl>

                <Button
                  onClick={startEditing}
                  className="mt-6 h-11 w-full bg-cyan-600! text-white hover:bg-cyan-700!"
                >
                  <Pencil className="size-4" />
                  Edit Profile
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Travel statistics */}
        <section>
          <h2 className="text-lg font-semibold">Travel Statistics</h2>

          {statsFailed && (
            <Card className="mt-4 shadow-none ring-border/70!">
              <CardContent className="flex flex-col items-start gap-3">
                <p className="text-sm text-muted-foreground">
                  Could not load travel statistics. Make sure the API server is
                  running on port 8000.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={retryStats}
                >
                  Try again
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {!statsFailed &&
              statDefinitions.map((stat) => (
                <Card
                  key={stat.label}
                  className="py-5 shadow-none ring-border/70!"
                >
                  <CardContent className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                      {stats ? (
                        <p className="mt-2 text-2xl font-semibold">
                          {stat.format(stats)}
                        </p>
                      ) : (
                        <Skeleton className="mt-2 h-7 w-16" />
                      )}
                    </div>
                    <span
                      className={`grid size-10 shrink-0 place-items-center rounded-full ${stat.tone}`}
                    >
                      <stat.icon className="size-5" />
                    </span>
                  </CardContent>
                </Card>
              ))}

            {bookingStatDefinitions.map((stat) => (
              <Card
                key={stat.label}
                className="py-5 shadow-none ring-border/70!"
              >
                <CardContent className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="mt-2 text-2xl font-semibold">
                      {stat.format(bookingStats)}
                    </p>
                  </div>
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-full ${stat.tone}`}
                  >
                    <stat.icon className="size-5" />
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
