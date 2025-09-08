import { Button } from "@/components/ui/button";
import BrainIllustration from "@/components/brain-illustration";

export default function HeroSection() {
  return (
    <section className="gradient-bg py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h1 
              className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight"
              data-testid="hero-title"
            >
              Bridging the Gap: Mental Wellness for College Students
            </h1>
            <p 
              className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl"
              data-testid="hero-subtitle"
            >
              Positive mental health is helping people live happier, healthier and longer lives.
            </p>
            <Button 
              className="px-8 py-4 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-all transform hover:scale-105 font-medium text-lg shadow-lg"
              data-testid="button-start-journey"
            >
              Start your Journey Today
            </Button>
          </div>

          {/* Right Illustration */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <img 
                src="@assets/hero_1757351853301.png" 
                alt="Mental wellness illustration with brain and nature elements" 
                className="w-64 h-64 lg:w-80 lg:h-80 object-contain"
                data-testid="hero-illustration"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
