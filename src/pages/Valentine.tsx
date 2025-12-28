import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { FloatingHearts } from "@/components/FloatingHearts";
import { FloatingNav } from "@/components/FloatingNav";
import { SpinningHeart } from "@/components/SpinningHeart";
import { RelationshipStats } from "@/components/RelationshipStats";
import { PhotoGallery } from "@/components/PhotoGallery";
import { ReasonsSection } from "@/components/ReasonsSection";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Button } from "@/components/ui/button";
const Valentine = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
  }, []);
  return <div className="min-h-screen bg-gradient-soft relative">
      <FloatingHearts />
      <MusicPlayer />

      {/* Admin Link - subtle */}
      <Link to="/admin" className="fixed top-4 right-4 z-50">
        <Button variant="ghost" size="icon" className="opacity-20 hover:opacity-100 transition-opacity">
          <Settings className="w-5 h-5" />
        </Button>
      </Link>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 relative">
        <div className={`text-center transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-romantic mb-6 leading-tight">To Judy</h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto mb-8">I put a lot of effort into this in case you couldn't tell, this is my showing of love. ❤️</p>
        </div>

        <SpinningHeart />

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-[65%] animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex items-start justify-center pt-1.5">
            <div className="w-1.5 h-3 bg-primary/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <RelationshipStats />

      {/* Photo Gallery */}
      <PhotoGallery />

      {/* Reasons Section */}
      <ReasonsSection />

      {/* Footer */}
      <footer className="py-12 pb-24 text-center bg-gradient-to-t from-secondary/50 to-transparent">
        <p className="font-romantic text-2xl text-primary mb-2">
          Forever & Always
        </p>
        <p className="text-muted-foreground">With all my love ❤️</p>
      </footer>

      <FloatingNav />
    </div>;
};
export default Valentine;