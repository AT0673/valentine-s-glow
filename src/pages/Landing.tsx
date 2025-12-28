import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FloatingHearts } from "@/components/FloatingHearts";
import { GiftBox } from "@/components/GiftBox";
import { cn } from "@/lib/utils";

const Landing = () => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleUnwrap = () => {
    setIsTransitioning(true);
    // allow the heart-expand animation to run, then navigate
    setTimeout(() => {
      navigate("/valentine");
    }, 900);
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-romantic flex flex-col items-center justify-center relative overflow-hidden transition-opacity duration-700",
        isTransitioning && "opacity-0"
      )}
    >
      <FloatingHearts />

      {/* Main Content */}
      <div className="relative z-10 text-center px-4">
        <h1 
          className="text-4xl md:text-6xl font-romantic mb-4 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          Happy Valentine's Day
        </h1>
        <p 
          className="text-xl md:text-2xl text-muted-foreground font-light mb-12 animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          I have something special for you...
        </p>

        <div 
          className="animate-fade-in-up"
          style={{ animationDelay: "0.6s" }}
        >
          <GiftBox onUnwrap={handleUnwrap} />
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />

      {/* Heart expand overlay to spice up the transition */}
      {isTransitioning && (
        <>
          <div className="overlay-fade" />
          <div className="overlay-heart" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M12 21s-7-4.97-9.33-7.3C-0.1 11.37 2.15 6 6.5 6c2.36 0 3.88 1.5 4.5 2.2C11.62 7.5 13.14 6 15.5 6 19.85 6 22.1 11.37 21.33 13.7 19 16.03 12 21 12 21z" fill="#ff6b6b" />
            </svg>
          </div>
        </>
      )}
    </div>
  );
};

export default Landing;
