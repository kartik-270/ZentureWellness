import { Facebook, Twitter, Linkedin } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Footer() {
  return (
    <footer id="main-footer" className="bg-slate-100 py-6 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex flex-wrap justify-center md:justify-start items-center space-x-6 text-sm">
            <Link
              href="/about"
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="footer-about"
            >
              About Us
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="footer-mission"
            >
              Our Mission
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="footer-privacy"
            >
              Privacy Policy
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link
              href="#"
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="footer-terms"
            >
              Terms of Service
            </Link>
          </div>

          <div className="flex items-center space-x-4 text-sm" data-testid="language-options">
            <span className="text-muted-foreground">Available In :</span>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">English</a>
            <span className="text-muted-foreground">|</span>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">German</a>
            <span className="text-muted-foreground">|</span>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Hindi</a>
            <span className="text-muted-foreground">|</span>
          </div>

          <div className="flex items-center space-x-4" data-testid="social-icons">
            <Link
              href="#"
              className="w-10 h-10 bg-slate-700 text-white rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors"
              data-testid="social-facebook"
            >
              <Facebook size={16} />
            </Link>
            <Link
              href="#"
              className="w-10 h-10 bg-slate-700 text-white rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors"
              data-testid="social-twitter"
            >
              <Twitter size={16} />
            </Link>
            <Link
              href="#"
              className="w-10 h-10 bg-slate-700 text-white rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors"
              data-testid="social-linkedin"
            >
              <Linkedin size={16} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
