import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import logo from "../../../public/logo1.jpeg";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedUsername = localStorage.getItem("username");

    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setUsername("");
    setLocation("/login");
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
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="Zenture" className="w-11 h-11 object-contain" />
            <span className="text-2xl font-bold tracking-tight">
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

          {/* Auth */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <span className="text-sm font-medium text-muted-foreground">
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
                  <Button
                    variant="outline"
                    className="rounded-full px-6"
                  >
                    Log in
                  </Button>
                </Link>

                <Link href="/signup">
                  <Button
                    className="rounded-full px-7 bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md hover:shadow-lg hover:scale-105 transition"
                  >
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu size={22} />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
