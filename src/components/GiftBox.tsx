import { useState } from "react";
import { Gift, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface GiftBoxProps {
  onUnwrap: () => void;
}

export const GiftBox = ({ onUnwrap }: GiftBoxProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleClick = () => {
    setIsOpening(true);
    setTimeout(() => {
      onUnwrap();
    }, 1500);
  };

  return (
    <div
      className="relative cursor-pointer select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Sparkles around the gift */}
      <div className="absolute -inset-8 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <Sparkles
            key={i}
            className={cn(
              "absolute text-gold animate-sparkle",
              isHovered && "animate-pulse"
            )}
            style={{
              top: `${20 + Math.sin(i * 60) * 30}%`,
              left: `${20 + Math.cos(i * 60) * 30}%`,
              animationDelay: `${i * 0.3}s`,
              width: 16 + Math.random() * 8,
              height: 16 + Math.random() * 8,
            }}
          />
        ))}
      </div>

      {/* Gift Box Container */}
      <div
        className={cn(
          "relative transition-all duration-500",
          isHovered && !isOpening && "scale-105",
          isOpening && "animate-pulse opacity-0"
        )}
      >
        {/* Box Lid */}
        <div
          className={cn(
            "relative z-10 w-48 h-12 bg-gradient-to-br from-primary to-rose-dark rounded-t-lg shadow-lg mx-auto transition-transform origin-bottom",
            isOpening && "animate-[box-open_1s_ease-out_forwards]"
          )}
        >
          {/* Ribbon on top */}
          <div className="absolute inset-x-0 top-0 flex justify-center">
            <div className="w-6 h-12 bg-gold rounded-sm shadow-md" />
          </div>
          {/* Bow */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-1">
            <div className="w-8 h-5 bg-gold rounded-full rotate-[-30deg] origin-right" />
            <div className="w-8 h-5 bg-gold rounded-full rotate-[30deg] origin-left" />
          </div>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-gold-light rounded-full" />
        </div>

        {/* Box Body */}
        <div className="relative w-52 h-40 bg-gradient-to-br from-primary via-rose to-rose-dark rounded-b-lg shadow-2xl mx-auto -mt-1">
          {/* Vertical ribbon */}
          <div className="absolute left-1/2 -translate-x-1/2 w-6 h-full bg-gold" />
          
          {/* Decorative pattern */}
          <div className="absolute inset-4 border-2 border-primary-foreground/20 rounded-lg" />
          
          {/* Gift icon inside */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <Gift className="w-20 h-20 text-primary-foreground" />
          </div>
        </div>

        {/* Shadow */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-40 h-4 bg-foreground/10 rounded-full blur-md" />
      </div>

      {/* Click instruction */}
      <p
        className={cn(
          "mt-8 text-center font-romantic text-xl text-muted-foreground transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-70"
        )}
      >
        Click to unwrap your gift
      </p>
    </div>
  );
};
