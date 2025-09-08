import { Leaf, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2" data-testid="logo">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Leaf className="text-white text-lg" size={18} />
            </div>
            <span className="text-2xl font-bold text-foreground">Zenture</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#" 
              className="text-foreground hover:text-primary transition-colors font-medium"
              data-testid="nav-home"
            >
              Home
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors font-medium"
              data-testid="nav-resources"
            >
              Resources
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors font-medium"
              data-testid="nav-about"
            >
              About Us
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors font-medium"
              data-testid="nav-faq"
            >
              FAQ
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors font-medium"
              data-testid="nav-community"
            >
              Community
            </a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            <Button 
              className="px-6 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
              data-testid="button-login"
            >
              Log In
            </Button>
            <Button 
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
              data-testid="button-signup"
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              className="p-2 rounded-md text-foreground hover:bg-accent"
              data-testid="button-mobile-menu"
            >
              <Menu size={20} />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
