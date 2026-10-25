import Image from "next/image";

const features = [
  {
    icon: "/images/ShieldCheck.png",
    title: "Safe & Secure",
    description:
      "Your safety is our priority with comprehensive travel insurance and 24/7 support.",
  },
  {
    icon: "/images/MapTrifold.png",
    title: "Expert Guides",
    description:
      "Local experts who bring destinations to life with authentic cultural insights.",
  },
  {
    icon: "/images/Headset.png",
    title: "24/7 Support",
    description:
      "Round-the-clock customer service to assist you wherever your journey takes you.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-cyan-50 px-4 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="text-center">
          <h2 className="text-4xl font-normal text-gray-900 md:text-6xl">
            Why Choose Wanderlust
          </h2>
          <p className="mt-4 text-gray-600">
            Your trusted partner for exceptional travel experiences
          </p>
        </div>

        {/* Feature cards */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="bg-white p-8">
              <Image
                src={feature.icon}
                alt=""
                width={48}
                height={48}
                className="size-10"
              />
              <h3 className="mt-6 text-2xl font-normal text-gray-900">
                {feature.title}
              </h3>
              <p className="mt-3 leading-relaxed text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
