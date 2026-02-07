import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import brain from "../../../public/hero_1757353625355.png";

export default function HeroSection() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Function to check auth status
    const checkAuthStatus = () => {
      const token = localStorage.getItem("authToken");
      const storedUsername = localStorage.getItem("username");
      if (token && storedUsername) {
        setIsLoggedIn(true);
        setUsername(storedUsername);
      } else {
        setIsLoggedIn(false);
        setUsername(null);
      }
    };

    // Check status on component mount
    checkAuthStatus();

    // Listen for the 'storage' event you dispatch on login/logout
    // This ensures the component updates without a page refresh
    window.addEventListener('storage', checkAuthStatus);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  return (
    <section className="gradient-bg py-8 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {isLoggedIn ? (
              // ---- LOGGED-IN VIEW ----
              <>
                <h1 className="text-4xl lg:text-3xl xl:text-4xl font-bold text-foreground leading-tight">
                  Welcome back, {username}! 👋
                </h1>
                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl">
                  Ready to continue your wellness journey? Let's take a positive step forward today.
                </p>
                <div className="flex items-center gap-4">
                  <a href="/dashboard">
                    <Button className="px-8 bg-slate-700 text-white rounded-full hover:bg-slate-800 transition-all transform hover:scale-105 font-semibold text-md shadow-lg">
                      Go to Your Dashboard
                    </Button>
                  </a>
                </div>
              </>
            ) : (
              // ---- LOGGED-OUT VIEW ----
              <>
                <h1 className="text-4xl lg:text-3xl xl:text-4xl font-bold text-foreground leading-tight">
                  Bridging the Gap: Mental Wellness for College Students
                </h1>
                <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-xl">
                  Positive mental health is helping people live happier, healthier and longer lives.
                </p>
                <a href="/signup">
                  <Button className="px-8 my-7 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md hover:shadow-lg hover:scale-105 transition">
                    Start your Journey Today
                  </Button>
                </a>
              </>
            )}
          </div>

          <div className="flex justify-center lg:justify-end">
  <div className="relative group">
    <img
      src={brain}
      alt="Mental Wellness"
      width={400}
      height={600}
      className="
        w-[32vw] h-[38vh] rounded-lg
        transition-all duration-500 ease-in-out
        group-hover:scale-105
        group-hover:brightness-110
        group-hover:contrast-110
        group-hover:drop-shadow-[0_10px_30px_rgba(59,130,246,0.4)]
      "
    />
  </div>
</div>

        </div>
      </div>
    </section>
  );
}