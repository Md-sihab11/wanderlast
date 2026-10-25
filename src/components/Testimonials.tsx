"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  useCarousel,
} from "@/components/ui/carousel";

const testimonials = [
  {
    quote:
      "The Bali trip was absolutely magical! Every detail was perfectly planned. The resorts were luxurious and the cultural experiences were unforgettable.",
    name: "Michael Chen",
    location: "Singapore",
    image: "/images/person2.png",
    imageAlt: "Portrait of Michael Chen",
  },
  {
    quote:
      "Swiss Alps adventure exceeded all expectations. The mountain views were breathtaking and our guide was incredibly knowledgeable. Highly recommend!",
    name: "Sarah Johnson",
    location: "New York, USA",
    image: "/images/person1.png",
    imageAlt: "Portrait of Sarah Johnson",
  },
  {
    quote:
      "Paris was beyond compare! The Seine cruise at sunset, the croissants, the museums — every moment felt like a scene from a movie. Seamless planning from start to finish.",
    name: "Emily Davis",
    location: "London, UK",
    image: "/images/person3.jpg",
    imageAlt: "Portrait of Emily Davis",
  },
  {
    quote:
      "The Kyoto cherry blossom tour was a dream come true. Every temple, every garden, every meal was thoughtfully arranged. I would book again without hesitation.",
    name: "David Kim",
    location: "Seoul, South Korea",
    image: "/images/person4.jpg",
    imageAlt: "Portrait of David Kim",
  },
  {
    quote:
      "Our family safari in Kenya was the adventure of a lifetime. The guides were professional and the lodges were stunning. Unforgettable from day one.",
    name: "Olivia Martinez",
    location: "Barcelona, Spain",
    image: "/images/person5.jpg",
    imageAlt: "Portrait of Olivia Martinez",
  },
  {
    quote:
      "New Zealand's fjords took my breath away. Hiking, kayaking, stargazing — a perfectly paced itinerary with zero stress. Worth every penny.",
    name: "James Wilson",
    location: "Sydney, Australia",
    image: "/images/person6.jpg",
    imageAlt: "Portrait of James Wilson",
  },
];

/* Rendered inside <Carousel> so it can read scroll state from context */
function CarouselArrows() {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } =
    useCarousel();

  return (
    <div className="hidden shrink-0 items-center gap-4 pt-4 md:flex">
      <button
        type="button"
        aria-label="Previous testimonial"
        disabled={!canScrollPrev}
        onClick={scrollPrev}
        className="flex size-12 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-40"
      >
        <ArrowLeft className="size-5" />
      </button>
      <button
        type="button"
        aria-label="Next testimonial"
        disabled={!canScrollNext}
        onClick={scrollNext}
        className="flex size-12 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition-colors hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-40"
      >
        <ArrowRight className="size-5" />
      </button>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-background px-4 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          {/* Header with carousel controls */}
          <div className="flex items-start justify-between gap-6">
            <div>
              <h2 className="text-4xl font-normal text-gray-900 md:text-6xl">
                What Travelers Say
              </h2>
              <p className="mt-4 text-gray-600">
                Real experiences from our happy travelers
              </p>
            </div>
            <CarouselArrows />
          </div>

          {/* Testimonial cards: 2 per view on desktop, 1 on mobile */}
          <CarouselContent className="mt-14">
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.name} className="md:basis-1/2">
                <figure className="flex h-full items-stretch gap-6 border border-gray-200 p-6">
                  <div className="flex flex-1 flex-col justify-between gap-8">
                    <blockquote className="text-lg leading-snug font-normal text-gray-900 md:text-xl">
                      &quot;{testimonial.quote}&quot;
                    </blockquote>
                    <figcaption>
                      <span className="block text-lg text-cyan-600">
                        &mdash; {testimonial.name}
                      </span>
                      <span className="mt-1 block text-sm text-gray-500">
                        {testimonial.location}
                      </span>
                    </figcaption>
                  </div>
                  <Image
                    src={testimonial.image}
                    alt={testimonial.imageAlt}
                    width={176}
                    height={220}
                    className="h-56 w-44 shrink-0 object-cover"
                  />
                </figure>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
