import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SearchBar from "@/components/SearchBar";

export default function HeroBanner() {
  return (
    <section className="relative flex min-h-[600px] flex-1 flex-col">
      {/* Background image + dark overlay */}
      {/* Background image (dark overlay is baked into the image) */}
      <Image
        src="/images/Banner.png"
        alt="Aerial view of a turquoise bay surrounded by green hills"
        fill
        priority
        className="object-cover"
      />

      {/* Centered hero content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 text-center">
        <h1 className="max-w-4xl text-5xl leading-tight font-normal text-white md:text-7xl">
          Discover Your Next Adventure
        </h1>
        <p className="mt-6 max-w-2xl text-base text-white/90 md:text-lg">
          Explore breathtaking destinations and create unforgettable memories
          with our curated travel experiences.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/destinations"
            className="flex items-center gap-3 bg-cyan-600 px-8 py-4 text-sm font-semibold tracking-widest text-white uppercase transition-colors hover:bg-cyan-700"
          >
            Explore Now
            <ArrowRight className="size-5" />
          </Link>
          <Link
            href="/destinations"
            className="bg-white/20 px-8 py-4 text-sm font-semibold tracking-widest text-white uppercase backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            View Destination
          </Link>
        </div>
      </div>

      {/* Bottom search bar */}
      <div className="relative z-10 mt-auto w-full">
        <SearchBar />
      </div>
    </section>
  );
}
