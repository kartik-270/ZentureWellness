export default function BrainIllustration() {
  return (
    <div className="relative">
      <div className="relative w-64 h-64 lg:w-80 lg:h-80">
        {/* Brain SVG */}
        <svg 
          className="w-full h-full text-primary/70" 
          viewBox="0 0 200 200" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          data-testid="brain-svg"
        >
          <path 
            d="M100 20C120 20 140 30 150 50C160 40 170 45 175 60C180 75 175 90 170 100C175 110 180 125 175 140C170 155 160 160 150 150C140 170 120 180 100 180C80 180 60 170 50 150C40 160 30 155 25 140C20 125 25 110 30 100C25 90 20 75 25 60C30 45 40 40 50 50C60 30 80 20 100 20Z" 
            stroke="currentColor" 
            strokeWidth="3" 
            fill="currentColor" 
            opacity="0.3"
          />
          {/* Brain details */}
          <path 
            d="M70 60C80 55 90 60 100 55C110 60 120 55 130 60" 
            stroke="currentColor" 
            strokeWidth="2" 
            opacity="0.6"
          />
          <path 
            d="M65 80C75 85 85 80 95 85C105 80 115 85 125 80" 
            stroke="currentColor" 
            strokeWidth="2" 
            opacity="0.6"
          />
          <path 
            d="M70 100C80 95 90 100 100 95C110 100 120 95 130 100" 
            stroke="currentColor" 
            strokeWidth="2" 
            opacity="0.6"
          />
          <path 
            d="M75 120C85 115 95 120 105 115C115 120 125 115 135 120" 
            stroke="currentColor" 
            strokeWidth="2" 
            opacity="0.6"
          />
        </svg>
        
        {/* Graduation Cap (animated) */}
        <div 
          className="absolute top-4 left-1/2 transform -translate-x-1/2 animate-spin-slow"
          data-testid="graduation-cap"
        >
          <svg 
            className="w-20 h-16 text-slate-700" 
            viewBox="0 0 80 64" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Cap base */}
            <ellipse cx="40" cy="45" rx="35" ry="8" fill="currentColor"/>
            {/* Cap top */}
            <path d="M5 40L40 25L75 40L40 35Z" fill="currentColor"/>
            {/* Tassel */}
            <line x1="70" y1="35" x2="75" y2="50" stroke="currentColor" strokeWidth="2"/>
            <circle cx="75" cy="52" r="3" fill="currentColor"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
