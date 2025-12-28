import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Photo {
  id: string;
  url: string;
  caption: string | null;
  display_order: number;
}

export const PhotoGallery = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    const { data, error } = await supabase
      .from("photos")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data) {
      setPhotos(data);
    }
    setIsLoading(false);
  };

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
  };

  const closeLightbox = () => {
    setSelectedIndex(null);
  };

  const goToPrevious = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null && selectedIndex < photos.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-romantic text-center mb-12">
            Our Memories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-muted animate-pulse rounded-lg"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (photos.length === 0) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-romantic text-center mb-12">
            Our Memories
          </h2>
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <ImageOff className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg">No photos added yet</p>
            <p className="text-sm">Add photos through the admin panel</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-romantic text-center mb-12">
          Our Memories
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer shadow-soft hover:shadow-romantic transition-all duration-300 hover:scale-[1.02]"
              onClick={() => openLightbox(index)}
            >
              <img
                src={photo.url}
                alt={photo.caption || "Memory"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {photo.caption && (
                <p className="absolute bottom-0 left-0 right-0 p-3 text-primary-foreground text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">
                  {photo.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <Dialog open={selectedIndex !== null} onOpenChange={closeLightbox}>
        <DialogContent className="max-w-4xl w-full p-0 bg-background/95 backdrop-blur-lg border-primary/20">
          {selectedIndex !== null && photos[selectedIndex] && (
            <div className="relative">
              <img
                src={photos[selectedIndex].url}
                alt={photos[selectedIndex].caption || "Memory"}
                className="w-full max-h-[80vh] object-contain"
              />
              
              {photos[selectedIndex].caption && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background to-transparent">
                  <p className="text-center font-romantic text-lg">
                    {photos[selectedIndex].caption}
                  </p>
                </div>
              )}

              {/* Navigation */}
              {selectedIndex > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
              )}
              
              {selectedIndex < photos.length - 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/50 hover:bg-background/80"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              )}

              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-background/50 hover:bg-background/80"
                onClick={closeLightbox}
              >
                <X className="w-5 h-5" />
              </Button>

              {/* Counter */}
              <div className="absolute top-2 left-2 bg-background/50 px-3 py-1 rounded-full text-sm">
                {selectedIndex + 1} / {photos.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
