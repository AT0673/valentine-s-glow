import { Link, useLocation } from "react-router-dom";
import { Heart, Mail, Star, Sparkles, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/valentine", icon: Heart, label: "Home" },
  { path: "/love-letter", icon: Mail, label: "Letter" },
  { path: "/dreams", icon: Sparkles, label: "Dreams" },
  { path: "/quiz", icon: HelpCircle, label: "Quiz" },
  { path: "/wishes", icon: Star, label: "Wishes" },
];

export const FloatingNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 px-4 py-3 bg-card/90 backdrop-blur-md rounded-full shadow-romantic border border-border/50">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
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
  );
};
