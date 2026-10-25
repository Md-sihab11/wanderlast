import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="relative flex min-h-[420px] items-center justify-center px-4">
      {/* Background image + dark overlay */}
      <Image
        src="/images/CTA.png"
        alt="Airplane flying over a tropical island"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* Centered content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <h2 className="text-4xl font-normal text-white md:text-6xl">
          Ready To Start Your Journey?
        </h2>
        <p className="mt-4 text-white/90">
          Join thousands of travelers who have discovered the world with us
        </p>
        <Link
          href="/destinations"
          className="mt-8 flex items-center gap-3 bg-white px-8 py-4 text-sm font-semibold tracking-widest text-gray-900 uppercase transition-colors hover:bg-gray-100"
        >
          Book Your Trip Today
          <ArrowRight className="size-5" />
        </Link>
      </div>
    </section>
  );
}
