import { useState, useEffect } from "react";
import { Heart, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

interface Reason {
  id: string;
  content: string;
  display_order: number;
}

export const ReasonsSection = () => {
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchReasons();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute("data-index") || "0");
            setVisibleCards((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.2 }
    );

    const cards = document.querySelectorAll("[data-reason-card]");
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [reasons]);

  const fetchReasons = async () => {
    const { data, error } = await supabase
      .from("reasons")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data) {
      setReasons(data);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-gradient-soft">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-romantic text-center mb-12">
            Reasons I Love You
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-muted animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (reasons.length === 0) {
    return (
      <section className="py-16 px-4 bg-gradient-soft">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-romantic text-center mb-12">
            Reasons I Love You
          </h2>
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Heart className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg">No reasons added yet</p>
            <p className="text-sm">Add reasons through the admin panel</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-gradient-soft">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-romantic text-center mb-4">
          Reasons I Love You
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Every single one of them, and so many more...
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {reasons.map((reason, index) => (
            <Card
              key={reason.id}
              data-reason-card
              data-index={index}
              className={`bg-card/80 backdrop-blur-sm border-primary/20 shadow-soft hover:shadow-romantic transition-all duration-700 hover:scale-[1.02] ${
                visibleCards.has(index)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${(index % 4) * 100}ms` }}
            >
              <CardContent className="p-6 relative">
                <Quote className="absolute top-4 left-4 w-6 h-6 text-primary/30" />
                <Heart className="absolute top-4 right-4 w-5 h-5 text-primary fill-primary/50" />
                <p className="text-lg font-romantic pt-4 pl-4 leading-relaxed">
                  {reason.content}
                </p>
                <div className="absolute bottom-2 right-4 text-xs text-muted-foreground">
                  #{index + 1}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
