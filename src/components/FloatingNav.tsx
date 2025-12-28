import { useState, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart, Mail, Star, Sparkles, HelpCircle, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/valentine", icon: Heart, label: "Home" },
  { path: "/countdown", icon: Calendar, label: "Countdown" },
  { path: "/timeline", icon: Clock, label: "Timeline" },
  { path: "/love-letter", icon: Mail, label: "Letter" },
  { path: "/dreams", icon: Sparkles, label: "Dreams" },
  { path: "/quiz", icon: HelpCircle, label: "Quiz" },
  { path: "/wishes", icon: Star, label: "Wishes" },
];

export const FloatingNav = () => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showNav = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsVisible(true);
  }, []);

  const hideNav = useCallback(() => {
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 300);
  }, []);

  return (
    <>
      {/* Invisible trigger zone at bottom */}
      <div 
        className="fixed bottom-0 left-0 right-0 h-20 z-40"
        onMouseEnter={showNav}
        onMouseLeave={hideNav}
      />

      {/* Small always-visible indicator */}
      <button
        onClick={showNav}
        onMouseEnter={showNav}
        className={cn(
          "fixed bottom-3 left-1/2 -translate-x-1/2 z-50 transition-all duration-300",
          isVisible ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
        aria-label="Show navigation"
      >
        <Heart className="w-5 h-5 text-primary/60 animate-pulse" />
      </button>

      {/* Main navigation - slides up on hover */}
      <nav 
        className={cn(
          "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out",
          isVisible 
            ? "translate-y-0 opacity-100" 
            : "translate-y-full opacity-0 pointer-events-none"
        )}
        onMouseEnter={showNav}
        onMouseLeave={hideNav}
        aria-hidden={!isVisible}
      >
        <div className="flex items-center gap-1 px-4 py-3 bg-card/90 backdrop-blur-md rounded-full shadow-romantic border border-border/50">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onFocus={showNav}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full transition-all duration-300",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-glow scale-110"
                    : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};
