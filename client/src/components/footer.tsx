import { Facebook, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-100 py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          {/* Footer Links */}
          <div className="flex flex-wrap justify-center md:justify-start items-center space-x-6 text-sm">
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="footer-about"
            >
              About Us
            </a>
            <span className="text-muted-foreground">|</span>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="footer-mission"
            >
              Our Mission
            </a>
            <span className="text-muted-foreground">|</span>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="footer-privacy"
            >
              Privacy Policy
            </a>
            <span className="text-muted-foreground">|</span>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="footer-terms"
            >
              Terms of Service
            </a>
          </div>

          {/* Language Options */}
          <div className="flex items-center space-x-4 text-sm" data-testid="language-options">
            <span className="text-muted-foreground">Available In :</span>
            <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">English</a>
            <span className="text-muted-foreground">|</span>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Hindi</a>
            <span className="text-muted-foreground">|</span>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Tamil</a>
            <span className="text-muted-foreground">|</span>
          </div>

          {/* Social Icons */}
          <div className="flex items-center space-x-4" data-testid="social-icons">
            <a 
              href="#" 
              className="w-10 h-10 bg-slate-700 text-white rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors"
              data-testid="social-facebook"
            >
              <Facebook size={16} />
            </a>
            <a 
              href="#" 
              className="w-10 h-10 bg-slate-700 text-white rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors"
              data-testid="social-twitter"
            >
              <Twitter size={16} />
            </a>
            <a 
              href="#" 
              className="w-10 h-10 bg-slate-700 text-white rounded-full flex items-center justify-center hover:bg-slate-800 transition-colors"
              data-testid="social-linkedin"
            >
              <Linkedin size={16} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
