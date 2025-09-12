import { Button } from "@/components/ui/button";
// import { Image } from "lucide-react";
import brain from "../../../public/hero_1757353625355.png";
export default function HeroSection() {
  return (
    <section className="gradient-bg py-8 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1
              className="text-4xl lg:text-3xl xl:text-4xl font-bold text-foreground leading-tight"
              data-testid="hero-title"
            >
              Bridging the Gap: Mental Wellness for College Students
            </h1>
            <p
              className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl"
              data-testid="hero-subtitle"
            >
              Positive mental health is helping people live happier, healthier and longer lives.
            </p><a href="/signup" className="">
              <Button
                className="px-8 my-7 bg-slate-700 text-white rounded-full hover:bg-slate-800 transition-all transform hover:scale-105 font-semibold text-md shadow-lg"
                data-testid="button-start-journey"
              >
                Start your Journey Today
              </Button></a>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative top-0">
              <img
                src={brain}
                alt={"brain"}
                width={400}
                height={600}
                className="w-[32vw] h-[33vh] rounded-lg  "
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
