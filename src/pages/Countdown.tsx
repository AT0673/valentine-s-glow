import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FloatingNav } from "@/components/FloatingNav";
import { FloatingHearts } from "@/components/FloatingHearts";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Calendar, Gift, Cake, Sparkles, PartyPopper } from "lucide-react";

interface SpecialDate {
  id: string;
  title: string;
  event_date: string;
  description: string | null;
  icon: string | null;
  is_recurring: boolean | null;
  display_order: number | null;
}

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  isToday: boolean;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  heart: Heart,
  calendar: Calendar,
  gift: Gift,
  cake: Cake,
  sparkles: Sparkles,
  party: PartyPopper,
};

const getNextOccurrence = (dateStr: string, isRecurring: boolean): Date => {
  const eventDate = new Date(dateStr);
  const now = new Date();
  
  if (!isRecurring) {
    return eventDate;
  }
  
  // For recurring events, find next occurrence
  const thisYearDate = new Date(now.getFullYear(), eventDate.getMonth(), eventDate.getDate());
  
  if (thisYearDate >= now) {
    return thisYearDate;
  }
  
  // Next year
  return new Date(now.getFullYear() + 1, eventDate.getMonth(), eventDate.getDate());
};

const calculateCountdown = (targetDate: Date): CountdownTime => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
  
  const isToday = today.getTime() === target.getTime();
  const isPast = target < today;
  
  const diff = targetDate.getTime() - now.getTime();
  
  if (diff <= 0 && !isToday) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, isToday: false };
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds, isPast, isToday };
};

const Countdown = () => {
  const [specialDates, setSpecialDates] = useState<SpecialDate[]>([]);
  const [countdowns, setCountdowns] = useState<Record<string, CountdownTime>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSpecialDates();
  }, []);

  useEffect(() => {
    const updateCountdowns = () => {
      const newCountdowns: Record<string, CountdownTime> = {};
      specialDates.forEach((date) => {
        const nextOccurrence = getNextOccurrence(date.event_date, date.is_recurring ?? false);
        newCountdowns[date.id] = calculateCountdown(nextOccurrence);
      });
      setCountdowns(newCountdowns);
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, [specialDates]);

  const fetchSpecialDates = async () => {
    const { data, error } = await supabase
      .from("special_dates")
      .select("*")
      .order("display_order");
    
    if (data) {
      setSpecialDates(data);
    }
    setIsLoading(false);
  };

  // Find the next upcoming event for the hero section
  const upcomingDates = specialDates
    .map((date) => ({
      ...date,
      nextOccurrence: getNextOccurrence(date.event_date, date.is_recurring ?? false),
    }))
    .sort((a, b) => a.nextOccurrence.getTime() - b.nextOccurrence.getTime());

  const nextEvent = upcomingDates.find((d) => !countdowns[d.id]?.isPast || countdowns[d.id]?.isToday);
  const heroCountdown = nextEvent ? countdowns[nextEvent.id] : null;

  return (
    <div className="min-h-screen bg-gradient-romantic relative overflow-hidden">
      <FloatingHearts />
      
      <div className="relative z-10 container mx-auto px-4 py-12 pb-24">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="font-romantic text-4xl md:text-5xl lg:text-6xl mb-4 text-foreground">
            Counting Every Moment
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Until our next special day together
          </p>
        </div>

        {/* Main Countdown */}
        {nextEvent && heroCountdown && (
          <Card className="max-w-2xl mx-auto mb-12 bg-card/80 backdrop-blur-sm border-border/50 shadow-romantic overflow-hidden">
            <CardContent className="p-8 text-center">
              {heroCountdown.isToday ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <PartyPopper className="w-16 h-16 text-primary animate-bounce" />
                  </div>
                  <h2 className="font-romantic text-3xl md:text-4xl text-primary">
                    Today is the Day!
                  </h2>
                  <p className="text-xl font-medium">{nextEvent.title}</p>
                  {nextEvent.description && (
                    <p className="text-muted-foreground">{nextEvent.description}</p>
                  )}
                </div>
              ) : (
                <>
                  <h2 className="font-romantic text-2xl md:text-3xl mb-2 text-foreground">
                    {nextEvent.title}
                  </h2>
                  {nextEvent.description && (
                    <p className="text-muted-foreground mb-6">{nextEvent.description}</p>
                  )}
                  
                  <div className="grid grid-cols-4 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <div className="text-4xl md:text-6xl font-bold text-primary font-mono">
                        {heroCountdown.days}
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider">
                        Days
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-4xl md:text-6xl font-bold text-primary font-mono">
                        {heroCountdown.hours.toString().padStart(2, "0")}
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider">
                        Hours
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-4xl md:text-6xl font-bold text-primary font-mono">
                        {heroCountdown.minutes.toString().padStart(2, "0")}
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider">
                        Minutes
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-4xl md:text-6xl font-bold text-primary font-mono">
                        {heroCountdown.seconds.toString().padStart(2, "0")}
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider">
                        Seconds
                      </div>
                    </div>
                  </div>
                  
                  <p className="mt-6 text-sm text-muted-foreground">
                    {nextEvent.nextOccurrence.toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* All Special Dates */}
        {specialDates.length > 0 && (
          <div className="space-y-6">
            <h2 className="font-romantic text-2xl text-center text-foreground">
              All Our Special Dates
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
              {upcomingDates.map((date) => {
                const countdown = countdowns[date.id];
                const Icon = iconMap[date.icon || "heart"] || Heart;
                
                return (
                  <Card
                    key={date.id}
                    className={`bg-card/60 backdrop-blur-sm border-border/50 transition-all duration-300 hover:shadow-romantic hover:scale-[1.02] ${
                      countdown?.isToday ? "ring-2 ring-primary ring-offset-2" : ""
                    }`}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full ${countdown?.isToday ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate">{date.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {date.nextOccurrence.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                            {date.is_recurring && " • Yearly"}
                          </p>
                          
                          {countdown?.isToday ? (
                            <p className="text-primary font-medium mt-2 flex items-center gap-1">
                              <Sparkles className="w-4 h-4" />
                              Today!
                            </p>
                          ) : countdown && !countdown.isPast ? (
                            <p className="text-sm mt-2 text-foreground">
                              <span className="font-mono font-medium">{countdown.days}</span> days,{" "}
                              <span className="font-mono">{countdown.hours}h {countdown.minutes}m</span>
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && specialDates.length === 0 && (
          <Card className="max-w-md mx-auto bg-card/60 backdrop-blur-sm border-border/50">
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="font-romantic text-xl mb-2">No Special Dates Yet</h2>
              <p className="text-muted-foreground text-sm">
                Add your first anniversary or special date from the admin panel!
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <FloatingNav />
    </div>
  );
};

export default Countdown;
