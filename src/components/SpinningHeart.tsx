import { Heart } from "lucide-react";

export const SpinningHeart = () => {
  return (
    <div className="relative flex items-center justify-center py-12 mt-8 mx-auto">
      {/* Outer glow */}
      <div className="absolute w-40 h-40 rounded-full bg-primary/20 blur-3xl animate-pulse" />
      
      {/* Middle glow */}
      <div className="absolute w-28 h-28 rounded-full bg-primary/30 blur-xl animate-pulse-glow" />
      
      {/* 3D Spinning Heart Container */}
      <div 
        className="relative animate-spin-slow"
        style={{ 
          transformStyle: "preserve-3d",
          perspective: "1000px"
        }}
      >
        {/* Main Heart */}
        <div className="relative">
          <Heart 
            className="w-24 h-24 text-primary fill-primary drop-shadow-2xl animate-heart-beat"
            style={{
              filter: "drop-shadow(0 0 20px hsl(var(--primary) / 0.5))"
            }}
          />
          
          {/* Shine effect */}
          <div 
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent rounded-full"
            style={{
              clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 50% 100%, 0% 70%, 0% 30%)"
            }}
          />
        </div>
      </div>
      
      {/* Small floating hearts around */}
      {[...Array(4)].map((_, i) => (
        <Heart
          key={i}
          className="absolute text-petal fill-petal animate-float"
          style={{
            width: 16 + i * 4,
            height: 16 + i * 4,
            top: `${20 + Math.sin(i * 90 * Math.PI / 180) * 40}%`,
            left: `${50 + Math.cos(i * 90 * Math.PI / 180) * 40}%`,
            animationDelay: `${i * 0.5}s`,
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  );
};
