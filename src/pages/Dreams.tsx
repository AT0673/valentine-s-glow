import { useEffect, useState } from "react";
import { FloatingHearts } from "@/components/FloatingHearts";
import { FloatingNav } from "@/components/FloatingNav";
import { supabase } from "@/integrations/supabase/client";
import { Check, Sparkles, Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BucketListItem {
  id: string;
  content: string;
  is_completed: boolean;
  display_order: number;
}

const Dreams = () => {
  const [items, setItems] = useState<BucketListItem[]>([]);
  const [newDream, setNewDream] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data } = await supabase
      .from("bucket_list_items")
      .select("*")
      .order("display_order", { ascending: true });
    
    if (data) setItems(data);
  };

  const toggleComplete = async (item: BucketListItem) => {
    const { error } = await supabase
      .from("bucket_list_items")
      .update({ is_completed: !item.is_completed })
      .eq("id", item.id);
    
    if (!error) {
      setItems(items.map(i => 
        i.id === item.id ? { ...i, is_completed: !i.is_completed } : i
      ));
      if (!item.is_completed) {
        toast.success("Dream achieved! 🎉");
      }
    }
  };

  const addDream = async () => {
    if (!newDream.trim()) return;
    
    const { error } = await supabase
      .from("bucket_list_items")
      .insert({ content: newDream, display_order: items.length });
    
    if (!error) {
      setNewDream("");
      setIsAdding(false);
      fetchItems();
      toast.success("Dream added! ✨");
    }
  };

  const completedCount = items.filter(i => i.is_completed).length;
  const progressPercent = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-soft relative">
      <FloatingHearts />
      
      <div className="container max-w-4xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex justify-center mb-4">
            <Sparkles className="w-12 h-12 text-gold animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-5xl font-romantic mb-4">
            Our Dreams Together
          </h1>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            All the adventures we want to share, places to explore, and memories to make
          </p>
        </div>

        {/* Progress bar */}
        <div className="mb-10">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>{completedCount} of {items.length} dreams achieved</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-heart rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Dreams grid */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "group relative p-6 rounded-2xl border transition-all duration-500 cursor-pointer",
                item.is_completed
                  ? "bg-rose-light/30 border-rose/30"
                  : "bg-card/80 border-border/50 hover:border-rose/50 hover:shadow-romantic"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => toggleComplete(item)}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                    item.is_completed
                      ? "bg-primary border-primary"
                      : "border-muted-foreground/30 group-hover:border-primary"
                  )}
                >
                  {item.is_completed && (
                    <Check className="w-4 h-4 text-primary-foreground animate-scale-in" />
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <p className={cn(
                    "text-lg font-medium transition-all duration-300",
                    item.is_completed && "line-through text-muted-foreground"
                  )}>
                    {item.content}
                  </p>
                </div>

                {/* Heart icon for completed */}
                {item.is_completed && (
                  <Heart className="w-5 h-5 text-rose fill-current animate-heart-beat" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add new dream */}
        {isAdding ? (
          <div className="flex gap-3 animate-fade-in">
            <Input
              value={newDream}
              onChange={(e) => setNewDream(e.target.value)}
              placeholder="What's your dream?"
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && addDream()}
              autoFocus
            />
            <Button onClick={addDream} className="bg-gradient-heart">
              Add
            </Button>
            <Button variant="outline" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full py-6 border-dashed border-2 hover:border-rose hover:bg-rose-light/10"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add a new dream together
          </Button>
        )}

        {items.length === 0 && !isAdding && (
          <div className="text-center py-12 text-muted-foreground">
            <Heart className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No dreams yet. Add your first one!</p>
          </div>
        )}
      </div>
      
      <FloatingNav />
    </div>
  );
};

export default Dreams;
