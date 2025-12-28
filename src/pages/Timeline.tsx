import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FloatingNav } from "@/components/FloatingNav";
import { FloatingHearts } from "@/components/FloatingHearts";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Clock, MapPin, Camera, Star, Sparkles, Music, Gift, Plane } from "lucide-react";

interface Memory {
  id: string;
  memory_date: string;
  title: string;
  description: string | null;
  photo_url: string | null;
  category: string | null;
  display_order: number | null;
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  milestone: Star,
  date: Heart,
  travel: Plane,
  photo: Camera,
  music: Music,
  gift: Gift,
  special: Sparkles,
  location: MapPin,
};

const categoryColors: Record<string, string> = {
  milestone: "bg-primary",
  date: "bg-pink-500",
  travel: "bg-blue-500",
  photo: "bg-purple-500",
  music: "bg-green-500",
  gift: "bg-amber-500",
  special: "bg-rose-500",
  location: "bg-teal-500",
};

const Timeline = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    const { data, error } = await supabase
      .from("memories")
      .select("*")
      .order("memory_date", { ascending: true });
    
    if (data) {
      setMemories(data);
    }
    setIsLoading(false);
  };

  // Group memories by year
  const memoriesByYear = memories.reduce((acc, memory) => {
    const year = new Date(memory.memory_date).getFullYear();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(memory);
    return acc;
  }, {} as Record<number, Memory[]>);

  const years = Object.keys(memoriesByYear)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="min-h-screen bg-gradient-romantic relative overflow-hidden">
      <FloatingHearts />
      
      <div className="relative z-10 container mx-auto px-4 py-12 pb-24">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="font-romantic text-4xl md:text-5xl lg:text-6xl mb-4 text-foreground">
            Our Journey Together
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Every moment we've shared, every memory we've made
          </p>
          
          {memories.length > 0 && (
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-primary" />
                <span>{memories.length} memories</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>{years.length} years</span>
              </div>
            </div>
          )}
        </div>

        {/* Timeline */}
        {years.length > 0 && (
          <div className="max-w-4xl mx-auto">
            {years.map((year) => (
              <div key={year} className="relative">
                {/* Year Marker */}
                <div className="sticky top-4 z-20 flex justify-center mb-8">
                  <div className="bg-primary text-primary-foreground px-6 py-2 rounded-full shadow-lg font-romantic text-xl">
                    {year}
                  </div>
                </div>

                {/* Memories for this year */}
                <div className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2 hidden md:block" />
                  
                  <div className="space-y-8 md:space-y-12">
                    {memoriesByYear[year].map((memory, index) => {
                      const isLeft = index % 2 === 0;
                      const category = memory.category || "milestone";
                      const Icon = categoryIcons[category] || Star;
                      const colorClass = categoryColors[category] || "bg-primary";
                      
                      return (
                        <div
                          key={memory.id}
                          className={`relative flex flex-col md:flex-row items-center gap-4 md:gap-8 ${
                            isLeft ? "md:flex-row" : "md:flex-row-reverse"
                          }`}
                        >
                          {/* Timeline dot (desktop) */}
                          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10">
                            <div className={`w-10 h-10 rounded-full ${colorClass} flex items-center justify-center shadow-lg`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          
                          {/* Card */}
                          <div className={`w-full md:w-[calc(50%-3rem)] ${isLeft ? "md:pr-0" : "md:pl-0"}`}>
                            <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-romantic overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                              {memory.photo_url && (
                                <div className="aspect-video overflow-hidden">
                                  <img
                                    src={memory.photo_url}
                                    alt={memory.title}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                  />
                                </div>
                              )}
                              <CardContent className="p-5">
                                {/* Mobile dot */}
                                <div className="md:hidden flex items-center gap-3 mb-3">
                                  <div className={`w-8 h-8 rounded-full ${colorClass} flex items-center justify-center`}>
                                    <Icon className="w-4 h-4 text-white" />
                                  </div>
                                  <span className="text-sm text-muted-foreground capitalize">
                                    {category}
                                  </span>
                                </div>
                                
                                <div className="text-sm text-muted-foreground mb-2">
                                  {new Date(memory.memory_date).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </div>
                                
                                <h3 className="font-romantic text-xl mb-2 text-foreground">
                                  {memory.title}
                                </h3>
                                
                                {memory.description && (
                                  <p className="text-muted-foreground text-sm leading-relaxed">
                                    {memory.description}
                                  </p>
                                )}
                              </CardContent>
                            </Card>
                          </div>
                          
                          {/* Spacer for alternating layout */}
                          <div className="hidden md:block w-[calc(50%-3rem)]" />
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Spacer between years */}
                <div className="h-12" />
              </div>
            ))}
            
            {/* End marker */}
            <div className="flex justify-center">
              <div className="bg-secondary text-secondary-foreground px-6 py-3 rounded-full shadow-md flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary fill-primary" />
                <span className="font-medium">More memories to come...</span>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && memories.length === 0 && (
          <Card className="max-w-md mx-auto bg-card/60 backdrop-blur-sm border-border/50">
            <CardContent className="p-8 text-center">
              <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="font-romantic text-xl mb-2">No Memories Yet</h2>
              <p className="text-muted-foreground text-sm">
                Start adding your special moments from the admin panel!
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <FloatingNav />
    </div>
  );
};

export default Timeline;
