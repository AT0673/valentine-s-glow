import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Image,
  Heart,
  Music,
  Trash2,
  Plus,
  ArrowLeft,
  Lock,
  Save,
  GripVertical,
} from "lucide-react";

interface Photo {
  id: string;
  url: string;
  caption: string | null;
  display_order: number;
}

interface Reason {
  id: string;
  content: string;
  display_order: number;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Photos state
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [newPhotoCaption, setNewPhotoCaption] = useState("");

  // Reasons state
  const [reasons, setReasons] = useState<Reason[]>([]);
  const [newReason, setNewReason] = useState("");

  // Music state
  const [musicUrl, setMusicUrl] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "admin_password")
      .maybeSingle();

    if (!error && data?.value === password) {
      setIsAuthenticated(true);
      toast({ title: "Welcome!", description: "You're now logged in." });
    } else {
      toast({
        title: "Incorrect password",
        description: "Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const fetchData = async () => {
    // Fetch photos
    const { data: photosData } = await supabase
      .from("photos")
      .select("*")
      .order("display_order");
    if (photosData) setPhotos(photosData);

    // Fetch reasons
    const { data: reasonsData } = await supabase
      .from("reasons")
      .select("*")
      .order("display_order");
    if (reasonsData) setReasons(reasonsData);

    // Fetch music URL
    const { data: musicData } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "music_url")
      .maybeSingle();
    if (musicData?.value) setMusicUrl(musicData.value);
  };

  // Photo functions
  const addPhoto = async () => {
    if (!newPhotoUrl.trim()) return;

    const { error } = await supabase.from("photos").insert({
      url: newPhotoUrl.trim(),
      caption: newPhotoCaption.trim() || null,
      display_order: photos.length,
    });

    if (!error) {
      setNewPhotoUrl("");
      setNewPhotoCaption("");
      fetchData();
      toast({ title: "Photo added!" });
    }
  };

  const deletePhoto = async (id: string) => {
    await supabase.from("photos").delete().eq("id", id);
    fetchData();
    toast({ title: "Photo deleted" });
  };

  // Reason functions
  const addReason = async () => {
    if (!newReason.trim()) return;

    const { error } = await supabase.from("reasons").insert({
      content: newReason.trim(),
      display_order: reasons.length,
    });

    if (!error) {
      setNewReason("");
      fetchData();
      toast({ title: "Reason added!" });
    }
  };

  const deleteReason = async (id: string) => {
    await supabase.from("reasons").delete().eq("id", id);
    fetchData();
    toast({ title: "Reason deleted" });
  };

  // Music function
  const saveMusicUrl = async () => {
    const { error } = await supabase
      .from("site_settings")
      .update({ value: musicUrl.trim() })
      .eq("key", "music_url");

    if (!error) {
      toast({ title: "Music URL saved!" });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="w-12 h-12 mx-auto mb-4 text-primary" />
            <CardTitle className="font-romantic text-2xl">Admin Panel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <Button
              className="w-full"
              onClick={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? "Checking..." : "Login"}
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to site
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-soft p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-romantic">Admin Panel</h1>
          <Button variant="outline" onClick={() => navigate("/valentine")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            View Site
          </Button>
        </div>

        <Tabs defaultValue="photos" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="photos" className="flex items-center gap-2">
              <Image className="w-4 h-4" />
              Photos
            </TabsTrigger>
            <TabsTrigger value="reasons" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Reasons
            </TabsTrigger>
            <TabsTrigger value="music" className="flex items-center gap-2">
              <Music className="w-4 h-4" />
              Music
            </TabsTrigger>
          </TabsList>

          {/* Photos Tab */}
          <TabsContent value="photos">
            <Card>
              <CardHeader>
                <CardTitle>Manage Photos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add new photo */}
                <div className="space-y-3 p-4 bg-secondary/50 rounded-lg">
                  <h3 className="font-medium">Add New Photo</h3>
                  <Input
                    placeholder="Photo URL"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                  />
                  <Input
                    placeholder="Caption (optional)"
                    value={newPhotoCaption}
                    onChange={(e) => setNewPhotoCaption(e.target.value)}
                  />
                  <Button onClick={addPhoto} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Photo
                  </Button>
                </div>

                {/* Photo list */}
                <div className="space-y-3">
                  {photos.map((photo, index) => (
                    <div
                      key={photo.id}
                      className="flex items-center gap-3 p-3 bg-card border rounded-lg"
                    >
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                      <img
                        src={photo.url}
                        alt={photo.caption || "Photo"}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{photo.url}</p>
                        {photo.caption && (
                          <p className="text-xs text-muted-foreground truncate">
                            {photo.caption}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deletePhoto(photo.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  {photos.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No photos added yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reasons Tab */}
          <TabsContent value="reasons">
            <Card>
              <CardHeader>
                <CardTitle>Manage Reasons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add new reason */}
                <div className="space-y-3 p-4 bg-secondary/50 rounded-lg">
                  <h3 className="font-medium">Add New Reason</h3>
                  <Textarea
                    placeholder="I love you because..."
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value)}
                    rows={3}
                  />
                  <Button onClick={addReason} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Reason
                  </Button>
                </div>

                {/* Reason list */}
                <div className="space-y-3">
                  {reasons.map((reason, index) => (
                    <div
                      key={reason.id}
                      className="flex items-start gap-3 p-3 bg-card border rounded-lg"
                    >
                      <GripVertical className="w-4 h-4 text-muted-foreground mt-1" />
                      <span className="text-sm text-muted-foreground">
                        #{index + 1}
                      </span>
                      <p className="flex-1 text-sm">{reason.content}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteReason(reason.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  {reasons.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No reasons added yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Music Tab */}
          <TabsContent value="music">
            <Card>
              <CardHeader>
                <CardTitle>Manage Music</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Add a direct link to an MP3 file or audio URL. The music will
                  play in the background when visitors open the site.
                </p>
                <Input
                  placeholder="https://example.com/song.mp3"
                  value={musicUrl}
                  onChange={(e) => setMusicUrl(e.target.value)}
                />
                <Button onClick={saveMusicUrl} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save Music URL
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
