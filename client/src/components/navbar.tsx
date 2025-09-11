import React, { useState, useEffect } from "react";
import { Leaf, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import logo from "../../../public/logo1.jpeg";

export default function Navbar() {
  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2 ml-[-30px]" data-testid="logo">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <Leaf className="text-white text-lg" size={20} />
            </div>
            <span className="text-3xl font-bold text-foreground tracking-tight">Zenture</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-10">
            <a 
              href="/" 
              className="text-foreground hover:text-primary transition-colors font-semibold text-lg"
              data-testid="nav-home"
            >
              Home
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors font-semibold text-lg"
              data-testid="nav-resources"
            >
              Resources
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors font-semibold text-lg"
              data-testid="nav-about"
            >
              About Us
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors font-semibold text-lg"
              data-testid="nav-faq"
            >
              FAQ
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors font-semibold text-lg"
              data-testid="nav-community"
            >
              Community
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              // Display when user is logged in
              <>
                <span className="text-lg font-semibold text-gray-700">Hi, {username}</span>
                <Button 
                  onClick={handleLogout}
                  className="px-8 py-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all transform hover:scale-105 font-semibold text-lg shadow-md"
                  data-testid="button-logout"
                >
                  Log Out
                </Button>
              </>
            ) : (
              // Display when user is NOT logged in
              <>
                <Link href="/login">
                  <Button 
                    className="px-8 py-3 bg-slate-700 text-white rounded-full hover:bg-slate-800 transition-all transform hover:scale-105 font-semibold text-lg shadow-md"
                    data-testid="button-login"
                  >
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button 
                    className="px-8 py-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all transform hover:scale-105 font-semibold text-lg shadow-md"
                    data-testid="button-signup"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              className="p-2 rounded-md text-foreground hover:bg-accent"
              data-testid="button-mobile-menu"
            >
              <Menu size={22} />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}