import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Music } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export const MusicPlayer = () => {
  const [musicUrl, setMusicUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchMusicUrl();
  }, []);

  const fetchMusicUrl = async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "music_url")
      .maybeSingle();

    if (!error && data?.value) {
      setMusicUrl(data.value);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current || !musicUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  if (!musicUrl) {
    return null;
  }

  return (
    <>
      <audio ref={audioRef} src={musicUrl} loop />
      
      <div
        className={cn(
          "fixed bottom-4 right-4 z-50 transition-all duration-300",
          isExpanded ? "w-64" : "w-auto"
        )}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <div className="bg-card/90 backdrop-blur-lg border border-primary/20 rounded-full shadow-romantic p-2 flex items-center gap-2">
          {/* Play/Pause Button */}
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full hover:bg-primary/20 transition-colors"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-primary" />
            ) : (
              <Play className="w-5 h-5 text-primary" />
            )}
          </Button>

          {/* Music icon when collapsed */}
          {!isExpanded && (
            <Music className="w-4 h-4 text-muted-foreground mr-2" />
          )}

          {/* Expanded controls */}
          {isExpanded && (
            <>
              {/* Volume Slider */}
              <div className="flex-1 px-2">
                <Slider
                  value={[isMuted ? 0 : volume]}
                  onValueChange={handleVolumeChange}
                  max={1}
                  step={0.01}
                  className="w-full"
                />
              </div>

              {/* Mute Button */}
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full hover:bg-primary/20 transition-colors"
                onClick={toggleMute}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Volume2 className="w-4 h-4 text-primary" />
                )}
              </Button>
            </>
          )}
        </div>

        {/* Playing indicator */}
        {isPlaying && (
          <div className="absolute -top-1 -right-1 w-3 h-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
          </div>
        )}
      </div>
    </>
  );
};
