import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="gradient-bg py-20 lg:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Main Heading */}
          <div className="space-y-6">
            <h1 
              className="text-4xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight max-w-4xl mx-auto"
              data-testid="hero-title"
            >
              Bridging the Gap: Mental Wellness for College Students
            </h1>
            <p 
              className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto"
              data-testid="hero-subtitle"
            >
              Positive mental health is helping people live happier, healthier and longer lives.
            </p>
          </div>

          {/* Hero Image */}
          <div className="flex justify-center pt-8">
            <div className="relative">
              <img 
                src="@assets/hero_1757351853301.png" 
                alt="Mental wellness illustration with brain and nature elements" 
                className="w-80 h-80 lg:w-96 lg:h-96 object-contain drop-shadow-2xl"
                data-testid="hero-illustration"
              />
            </div>
          </div>

          {/* Call to Action */}
          <div className="pt-8">
            <Button 
              className="px-10 py-4 bg-slate-700 text-white rounded-full hover:bg-slate-800 transition-all transform hover:scale-105 font-semibold text-xl shadow-xl"
              data-testid="button-start-journey"
            >
              Start your Journey Today
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
