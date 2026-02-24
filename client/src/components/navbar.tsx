import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import logo from "../../../public/logo1.jpeg";
import { apiConfig } from "@/lib/config";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [streak, setStreak] = useState<number | null>(null);
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUsername = localStorage.getItem("username");

    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);

      const getStreak = () => {
        fetch(`${apiConfig.baseUrl}/user/streak`, {
          headers: { "Authorization": `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => setStreak(data.streak))
          .catch(err => console.error("Streak fetch error:", err));
      };

      getStreak();

      // Listen for streak updates from other components
      window.addEventListener('streak-updated', getStreak);
      return () => window.removeEventListener('streak-updated', getStreak);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUsername("");
    setLocation("/login");
    setMobileOpen(false);
  };

  const navLink = (href: string, label: string) => {
    const isActive = location === href;
    return (
      <Link
        href={href}
        className={`relative text-lg font-medium transition-colors
        ${isActive ? "text-primary" : "text-muted-foreground hover:text-primary"}
        `}
      >
        {label}
        {isActive && (
          <span className="absolute -bottom-2 left-0 h-[2px] w-full bg-primary rounded-full" />
        )}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex h-16 md:h-20 items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="Zenture" className="w-10 h-10 object-contain" />
            <span className="text-xl md:text-2xl font-bold tracking-tight">
              Zenture
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            {navLink("/", "Home")}
            {navLink("/psychoeducational-hub", "Resources")}
            {navLink("/about", "About")}
            {navLink("/faq", "FAQ")}
            {navLink("/community", "Community")}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <div className="flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                  <span className="text-orange-600">🔥</span>
                  <span className="text-sm font-bold text-orange-700">{streak ?? 0}</span>
                </div>
                <span className="text-sm font-medium text-muted-foreground ml-2">
                  Hi, {username}
                </span>
                <Button
                  onClick={handleLogout}
                  className="rounded-full px-6 bg-red-500 hover:bg-red-600"
                >
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" className="rounded-full px-6">
                    Log in
                  </Button>
                </Link>

                <Link href="/signup">
                  <Button className="rounded-full px-7 bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md hover:shadow-lg hover:scale-105 transition">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-border shadow-lg animate-in slide-in-from-top duration-200">
          <div className="flex flex-col px-6 py-5 space-y-4">

            <Link href="/" onClick={() => setMobileOpen(false)} className="text-lg">
              Home
            </Link>

            <Link href="/psychoeducational-hub" onClick={() => setMobileOpen(false)} className="text-lg">
              Resources
            </Link>

            <Link href="/about" onClick={() => setMobileOpen(false)} className="text-lg">
              About
            </Link>

            <Link href="/faq" onClick={() => setMobileOpen(false)} className="text-lg">
              FAQ
            </Link>

            <Link href="/community" onClick={() => setMobileOpen(false)} className="text-lg">
              Community
            </Link>

            <div className="pt-4 border-t space-y-3">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-2 bg-orange-50 w-fit px-3 py-1 rounded-full border border-orange-100 mb-2">
                    <span className="text-orange-600">🔥</span>
                    <span className="text-sm font-bold text-orange-700">{streak ?? 0} days streak</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Hi, {username}
                  </p>
                  <Button
                    onClick={handleLogout}
                    className="w-full bg-red-500 hover:bg-red-600"
                  >
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Log in
                    </Button>
                  </Link>

                  <Link href="/signup" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}
