import Navbar from "@/components/navbar";
import HeroSection from "@/components/hero-section";
import QuickLinks from "@/components/quick-links";
import PlatformFeatures from "@/components/platform-features";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <QuickLinks />
      <PlatformFeatures />
      <Footer />
    </div>
  );
}
