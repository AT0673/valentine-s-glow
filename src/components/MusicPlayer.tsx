import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Music, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

// Helper function to convert Spotify URL to embed URL
const getSpotifyEmbedUrl = (url: string): string => {
  const patterns = [
    /spotify\.com\/track\/([a-zA-Z0-9]+)/,
    /spotify\.com\/album\/([a-zA-Z0-9]+)/,
    /spotify\.com\/playlist\/([a-zA-Z0-9]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      const type = url.includes('/track/') ? 'track' : url.includes('/album/') ? 'album' : 'playlist';
      return `https://open.spotify.com/embed/${type}/${match[1]}?utm_source=generator&theme=0`;
    }
  }
  
  return url;
};

const isSpotifyUrl = (url: string): boolean => {
  return url.includes('spotify.com');
};

export const MusicPlayer = () => {
  const [musicUrl, setMusicUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSpotifyPlayer, setShowSpotifyPlayer] = useState(false);
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
    if (isSpotifyUrl(musicUrl)) {
      setShowSpotifyPlayer(!showSpotifyPlayer);
      return;
    }

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

  // Spotify player - shows a floating widget
  if (isSpotifyUrl(musicUrl)) {
    return (
      <>
        {/* Spotify Embed Modal */}
        {showSpotifyPlayer && (
          <div className="fixed bottom-20 right-4 z-50 w-80 md:w-96 animate-in slide-in-from-bottom-4 duration-300">
            <div className="relative bg-card/95 backdrop-blur-xl border border-primary/20 rounded-2xl shadow-2xl overflow-hidden">
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 z-10 rounded-full bg-black/50 hover:bg-black/70 text-white"
                onClick={() => setShowSpotifyPlayer(false)}
              >
                <X className="w-4 h-4" />
              </Button>
              <iframe
                src={getSpotifyEmbedUrl(musicUrl)}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-xl"
              />
            </div>
          </div>
        )}

        {/* Floating Music Button */}
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            size="icon"
            className={cn(
              "rounded-full w-12 h-12 shadow-romantic transition-all duration-300",
              showSpotifyPlayer 
                ? "bg-primary hover:bg-primary/90" 
                : "bg-card/90 backdrop-blur-lg border border-primary/20 hover:bg-card"
            )}
            onClick={togglePlay}
          >
            <Music className={cn(
              "w-5 h-5",
              showSpotifyPlayer ? "text-primary-foreground" : "text-primary"
            )} />
          </Button>
          
          {/* Pulsing indicator */}
          {showSpotifyPlayer && (
            <div className="absolute -top-1 -right-1 w-3 h-3">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
            </div>
          )}
        </div>
      </>
    );
  }

  // Regular audio player for MP3 URLs
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
