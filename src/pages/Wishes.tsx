import { useEffect, useState } from "react";
import { FloatingNav } from "@/components/FloatingNav";
import { supabase } from "@/integrations/supabase/client";
import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface StarWish {
  id: string;
  wish: string;
  x_position: number;
  y_position: number;
}

const Wishes = () => {
  const [wishes, setWishes] = useState<StarWish[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newWish, setNewWish] = useState("");
  const [clickPosition, setClickPosition] = useState({ x: 0.5, y: 0.5 });
  const [hoveredWish, setHoveredWish] = useState<string | null>(null);

  useEffect(() => {
    fetchWishes();
  }, []);

  const fetchWishes = async () => {
    const { data } = await supabase
      .from("star_wishes")
      .select("*")
      .order("created_at", { ascending: true });
    
    if (data) setWishes(data);
  };

  const handleSkyClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isAdding) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    // Avoid clicking too close to edges
    if (y > 0.85) return;
    
    setClickPosition({ x, y });
    setIsAdding(true);
  };

  const addWish = async () => {
    if (!newWish.trim()) return;
    
    const { error } = await supabase
      .from("star_wishes")
      .insert({
        wish: newWish,
        x_position: clickPosition.x,
        y_position: clickPosition.y,
      });
    
    if (!error) {
      setNewWish("");
      setIsAdding(false);
      fetchWishes();
      toast.success("Wish upon a star! ⭐");
    }
  };

  // Generate random twinkling stars
  const backgroundStars = [...Array(50)].map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 3,
  }));

  return (
    <div 
      className="min-h-screen relative overflow-hidden cursor-crosshair"
      style={{
        background: "linear-gradient(180deg, hsl(240, 40%, 8%) 0%, hsl(260, 50%, 15%) 50%, hsl(280, 40%, 20%) 100%)",
      }}
      onClick={handleSkyClick}
    >
      {/* Background twinkling stars */}
      {backgroundStars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}

      {/* Header */}
      <div className="relative z-10 text-center pt-16 pb-8 px-4">
        <Star className="w-12 h-12 mx-auto text-gold mb-4 animate-pulse" />
        <h1 className="text-4xl md:text-5xl font-romantic text-white mb-3">
          Wish Upon a Star
        </h1>
        <p className="text-white/60 text-lg">
          Click anywhere in the sky to make a wish together
        </p>
      </div>

      {/* Wish stars */}
      {wishes.map((wish) => (
        <div
          key={wish.id}
          className="absolute group"
          style={{
            left: `${wish.x_position * 100}%`,
            top: `${wish.y_position * 100}%`,
            transform: "translate(-50%, -50%)",
          }}
          onMouseEnter={() => setHoveredWish(wish.id)}
          onMouseLeave={() => setHoveredWish(null)}
          onClick={(e) => e.stopPropagation()}
        >
          <Star
            className={cn(
              "w-8 h-8 text-gold fill-gold transition-all duration-300 cursor-pointer",
              hoveredWish === wish.id ? "scale-150 drop-shadow-[0_0_15px_rgba(255,215,0,0.8)]" : "animate-twinkle"
            )}
          />
          
          {/* Wish tooltip */}
          {hoveredWish === wish.id && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 animate-fade-in z-20">
              <div className="bg-white/95 backdrop-blur-sm text-foreground px-4 py-3 rounded-xl shadow-lg max-w-xs whitespace-normal text-center">
                <p className="text-sm font-medium">{wish.wish}</p>
              </div>
              <div className="w-3 h-3 bg-white/95 rotate-45 mx-auto -mt-1.5" />
            </div>
          )}
        </div>
      ))}

      {/* Add wish modal */}
      {isAdding && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            e.stopPropagation();
            setIsAdding(false);
          }}
        >
          <div 
            className="bg-card rounded-2xl p-6 max-w-md w-full shadow-xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-romantic">Make a Wish</h3>
              <button
                onClick={() => setIsAdding(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-3 mb-4">
              <Star className="w-8 h-8 text-gold fill-gold" />
              <Input
                value={newWish}
                onChange={(e) => setNewWish(e.target.value)}
                placeholder="I wish..."
                className="flex-1"
                onKeyDown={(e) => e.key === "Enter" && addWish()}
                autoFocus
              />
            </div>
            
            <Button onClick={addWish} className="w-full bg-gradient-heart">
              <Star className="w-4 h-4 mr-2" />
              Make this wish
            </Button>
          </div>
        </div>
      )}

      {/* Shooting star animation (occasional) */}
      <div className="shooting-star" />
      
      <FloatingNav />
    </div>
  );
};

export default Wishes;
