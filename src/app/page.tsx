import HeroBanner from "@/components/HeroBanner";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import CtaBanner from "@/components/CtaBanner";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      
      <HeroBanner />
      <WhyChooseUs />
      <Testimonials />
      <CtaBanner />
     
    </div>
  );
}
