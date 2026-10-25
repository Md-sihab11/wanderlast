
import Link from "next/link";
import { Compass, House, MapPin, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-12">
      {/* Background decorations */}
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-teal-200/40 blur-3xl" />

      <div className="relative w-full max-w-2xl rounded-3xl border border-white bg-white/80 p-8 text-center shadow-xl shadow-slate-200/60 backdrop-blur-xl sm:p-14">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
          <Compass className="h-9 w-9" />
        </div>

        <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-teal-700">
          Lost your way?
        </p>

        <h1 className="text-8xl font-black tracking-tighter text-slate-900 sm:text-9xl">
          404
        </h1>

        <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
          This destination is off the map!
        </h2>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-500 sm:text-base">
          Looks like this page took a little detour.
          The destination you are looking for doesn&apos;t exist
          or may have been moved.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-700/20 transition hover:-translate-y-0.5 hover:bg-teal-800"
          >
            <House className="h-4 w-4" />
            Back to Home
          </Link>

          <Link
            href="/destinations"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-teal-300 hover:bg-teal-50"
          >
            <MapPin className="h-4 w-4" />
            Explore Destinations
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 border-t border-slate-100 pt-5">
          <p className="text-xs font-medium tracking-wide text-slate-400">
            YOUR NEXT ADVENTURE IS STILL OUT THERE.
          </p>
        </div>
      </div>
    </main>
  );
}
