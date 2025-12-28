import { useEffect, useState } from "react";
import { FloatingHearts } from "@/components/FloatingHearts";
import { FloatingNav } from "@/components/FloatingNav";
import { supabase } from "@/integrations/supabase/client";
import { Heart } from "lucide-react";

interface LoveLetter {
  id: string;
  title: string;
  content: string;
}

const LoveLetter = () => {
  const [letter, setLetter] = useState<LoveLetter | null>(null);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    const fetchLetter = async () => {
      const { data } = await supabase
        .from("love_letters")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (data) {
        setLetter(data);
      }
    };
    fetchLetter();
  }, []);

  const handleOpenEnvelope = () => {
    setIsEnvelopeOpen(true);
    setTimeout(() => {
      setShowLetter(true);
      if (letter) {
        // Typewriter effect
        let i = 0;
        const content = letter.content;
        const typeInterval = setInterval(() => {
          if (i <= content.length) {
            setDisplayedText(content.slice(0, i));
            i++;
          } else {
            clearInterval(typeInterval);
          }
        }, 30);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-soft relative overflow-hidden">
      <FloatingHearts />
      
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
        {!showLetter ? (
          // Envelope
          <div
            className={`relative cursor-pointer transition-all duration-700 ${
              isEnvelopeOpen ? "scale-110 opacity-0" : "hover:scale-105"
            }`}
            onClick={handleOpenEnvelope}
          >
            {/* Envelope body */}
            <div className="relative w-80 h-52 bg-gradient-to-br from-rose-light to-petal rounded-lg shadow-romantic">
              {/* Envelope flap */}
              <div
                className={`absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-rose to-rose-light origin-top transition-transform duration-700 ${
                  isEnvelopeOpen ? "rotate-x-180" : ""
                }`}
                style={{
                  clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                  transformStyle: "preserve-3d",
                }}
              />
              
              {/* Heart seal */}
              <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10">
                <div className="w-12 h-12 bg-rose-dark rounded-full flex items-center justify-center shadow-lg animate-pulse-glow">
                  <Heart className="w-6 h-6 text-primary-foreground fill-current" />
                </div>
              </div>
              
              {/* Letter peek */}
              <div className="absolute bottom-4 left-4 right-4 h-8 bg-cream rounded-t-sm opacity-80" />
            </div>
            
            <p className="text-center mt-6 text-muted-foreground animate-pulse">
              Click to open...
            </p>
          </div>
        ) : (
          // Letter content
          <div className="max-w-2xl w-full animate-fade-in-up">
            <div className="bg-cream/90 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-romantic border border-rose-light/30">
              {/* Decorative header */}
              <div className="flex justify-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent to-rose" />
                  <Heart className="w-6 h-6 text-rose fill-current animate-heart-beat" />
                  <div className="w-12 h-px bg-gradient-to-l from-transparent to-rose" />
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-romantic text-center text-foreground mb-8">
                {letter?.title || "My Love Letter to You"}
              </h1>
              
              <div className="font-body text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
                {displayedText}
                <span className="animate-pulse">|</span>
              </div>
              
              {/* Signature */}
              <div className="mt-12 text-right">
                <p className="font-romantic text-2xl text-primary">
                  Forever yours
                </p>
                <p className="text-muted-foreground mt-1">❤️</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <FloatingNav />
    </div>
  );
};

export default LoveLetter;
