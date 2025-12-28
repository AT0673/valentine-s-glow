import { useEffect, useState } from "react";
import { Calendar, Clock, Heart, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const RELATIONSHIP_START = new Date("2025-12-04T00:00:00");

interface TimeStats {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  weeks: number;
  months: number;
}

export const RelationshipStats = () => {
  const [stats, setStats] = useState<TimeStats>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    weeks: 0,
    months: 0,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const calculateStats = () => {
      const now = new Date();
      const diff = now.getTime() - RELATIONSHIP_START.getTime();
      
      const totalSeconds = Math.floor(diff / 1000);
      const totalMinutes = Math.floor(totalSeconds / 60);
      const totalHours = Math.floor(totalMinutes / 60);
      const totalDays = Math.floor(totalHours / 24);
      
      setStats({
        days: totalDays,
        hours: totalHours % 24,
        minutes: totalMinutes % 60,
        seconds: totalSeconds % 60,
        weeks: Math.floor(totalDays / 7),
        months: Math.floor(totalDays / 30.44),
      });
    };

    calculateStats();
    const interval = setInterval(calculateStats, 1000);

    // Trigger animation after mount
    setTimeout(() => setIsVisible(true), 100);

    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      icon: Calendar,
      value: stats.days,
      label: "Days Together",
      color: "text-primary",
    },
    {
      icon: Clock,
      value: `${stats.hours.toString().padStart(2, "0")}:${stats.minutes.toString().padStart(2, "0")}:${stats.seconds.toString().padStart(2, "0")}`,
      label: "Hours : Minutes : Seconds",
      color: "text-accent",
    },
    {
      icon: Heart,
      value: stats.weeks,
      label: "Weeks of Love",
      color: "text-rose",
    },
    {
      icon: Sparkles,
      value: stats.months,
      label: "Months Together",
      color: "text-gold",
    },
  ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-romantic text-center mb-4">
          Our Love Story in Numbers
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          Since December 4th, 2025
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {statCards.map((stat, index) => (
            <Card
              key={stat.label}
              className={`bg-card/80 backdrop-blur-sm border-primary/20 shadow-soft transition-all duration-700 hover:shadow-romantic hover:scale-105 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-6 text-center">
                <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                <div className="text-3xl md:text-4xl font-bold font-romantic mb-2">
                  {typeof stat.value === "number" ? (
                    <span className="tabular-nums">{stat.value}</span>
                  ) : (
                    <span className="tabular-nums text-2xl md:text-3xl">{stat.value}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
