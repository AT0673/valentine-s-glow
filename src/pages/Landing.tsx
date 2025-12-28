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
    setTimeout(() => {
      navigate("/valentine");
    }, 800);
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
    </div>
  );
};

export default Landing;
