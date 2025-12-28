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
  Mail,
  Sparkles,
  HelpCircle,
  Star,
  Calendar,
  Clock,
  Gift,
  Cake,
  PartyPopper,
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

interface BucketListItem {
  id: string;
  content: string;
  is_completed: boolean;
  display_order: number;
}

interface QuizQuestion {
  id: string;
  question: string;
  correct_answer: string;
  wrong_answers: string[];
  display_order: number;
}

interface StarWish {
  id: string;
  wish: string;
}

interface SpecialDate {
  id: string;
  title: string;
  event_date: string;
  description: string | null;
  icon: string | null;
  is_recurring: boolean | null;
  display_order: number | null;
}

interface Memory {
  id: string;
  memory_date: string;
  title: string;
  description: string | null;
  photo_url: string | null;
  category: string | null;
  display_order: number | null;
}

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

  // Love letter state
  const [letterTitle, setLetterTitle] = useState("");
  const [letterContent, setLetterContent] = useState("");

  // Bucket list state
  const [bucketItems, setBucketItems] = useState<BucketListItem[]>([]);
  const [newBucketItem, setNewBucketItem] = useState("");

  // Quiz state
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newCorrectAnswer, setNewCorrectAnswer] = useState("");
  const [newWrongAnswers, setNewWrongAnswers] = useState(["", "", ""]);

  // Wishes state
  const [wishes, setWishes] = useState<StarWish[]>([]);

  // Special dates state
  const [specialDates, setSpecialDates] = useState<SpecialDate[]>([]);
  const [newDateTitle, setNewDateTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newDateDescription, setNewDateDescription] = useState("");
  const [newDateIcon, setNewDateIcon] = useState("heart");
  const [newDateRecurring, setNewDateRecurring] = useState(true);

  // Memories state
  const [memories, setMemories] = useState<Memory[]>([]);
  const [newMemoryDate, setNewMemoryDate] = useState("");
  const [newMemoryTitle, setNewMemoryTitle] = useState("");
  const [newMemoryDescription, setNewMemoryDescription] = useState("");
  const [newMemoryPhotoUrl, setNewMemoryPhotoUrl] = useState("");
  const [newMemoryCategory, setNewMemoryCategory] = useState("milestone");

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

    // Fetch love letter
    const { data: letterData } = await supabase
      .from("love_letters")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (letterData) {
      setLetterTitle(letterData.title || "");
      setLetterContent(letterData.content || "");
    }

    // Fetch bucket list items
    const { data: bucketData } = await supabase
      .from("bucket_list_items")
      .select("*")
      .order("display_order");
    if (bucketData) setBucketItems(bucketData);

    // Fetch quiz questions
    const { data: quizData } = await supabase
      .from("quiz_questions")
      .select("*")
      .order("display_order");
    if (quizData) setQuizQuestions(quizData);

    // Fetch wishes
    const { data: wishesData } = await supabase
      .from("star_wishes")
      .select("*")
      .order("created_at", { ascending: false });
    if (wishesData) setWishes(wishesData);

    // Fetch special dates
    const { data: specialDatesData } = await supabase
      .from("special_dates")
      .select("*")
      .order("display_order");
    if (specialDatesData) setSpecialDates(specialDatesData);

    // Fetch memories
    const { data: memoriesData } = await supabase
      .from("memories")
      .select("*")
      .order("memory_date", { ascending: false });
    if (memoriesData) setMemories(memoriesData);
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

  // Love letter functions
  const saveLetter = async () => {
    if (!letterContent.trim()) return;

    // Check if letter exists
    const { data: existing } = await supabase
      .from("love_letters")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("love_letters")
        .update({ title: letterTitle, content: letterContent })
        .eq("id", existing.id);
    } else {
      await supabase
        .from("love_letters")
        .insert({ title: letterTitle, content: letterContent });
    }
    toast({ title: "Love letter saved!" });
  };

  // Bucket list functions
  const addBucketItem = async () => {
    if (!newBucketItem.trim()) return;

    await supabase.from("bucket_list_items").insert({
      content: newBucketItem.trim(),
      display_order: bucketItems.length,
    });

    setNewBucketItem("");
    fetchData();
    toast({ title: "Dream added!" });
  };

  const deleteBucketItem = async (id: string) => {
    await supabase.from("bucket_list_items").delete().eq("id", id);
    fetchData();
    toast({ title: "Dream deleted" });
  };

  // Quiz functions
  const addQuizQuestion = async () => {
    if (!newQuestion.trim() || !newCorrectAnswer.trim()) return;

    const filteredWrongAnswers = newWrongAnswers.filter(a => a.trim());
    if (filteredWrongAnswers.length === 0) {
      toast({ title: "Add at least one wrong answer", variant: "destructive" });
      return;
    }

    await supabase.from("quiz_questions").insert({
      question: newQuestion.trim(),
      correct_answer: newCorrectAnswer.trim(),
      wrong_answers: filteredWrongAnswers,
      display_order: quizQuestions.length,
    });

    setNewQuestion("");
    setNewCorrectAnswer("");
    setNewWrongAnswers(["", "", ""]);
    fetchData();
    toast({ title: "Question added!" });
  };

  const deleteQuizQuestion = async (id: string) => {
    await supabase.from("quiz_questions").delete().eq("id", id);
    fetchData();
    toast({ title: "Question deleted" });
  };

  // Wishes function
  const deleteWish = async (id: string) => {
    await supabase.from("star_wishes").delete().eq("id", id);
    fetchData();
    toast({ title: "Wish deleted" });
  };

  // Special dates functions
  const addSpecialDate = async () => {
    if (!newDateTitle.trim() || !newEventDate) return;

    await supabase.from("special_dates").insert({
      title: newDateTitle.trim(),
      event_date: newEventDate,
      description: newDateDescription.trim() || null,
      icon: newDateIcon,
      is_recurring: newDateRecurring,
      display_order: specialDates.length,
    });

    setNewDateTitle("");
    setNewEventDate("");
    setNewDateDescription("");
    setNewDateIcon("heart");
    setNewDateRecurring(true);
    fetchData();
    toast({ title: "Special date added!" });
  };

  const deleteSpecialDate = async (id: string) => {
    await supabase.from("special_dates").delete().eq("id", id);
    fetchData();
    toast({ title: "Special date deleted" });
  };

  // Memories functions
  const addMemory = async () => {
    if (!newMemoryTitle.trim() || !newMemoryDate) return;

    await supabase.from("memories").insert({
      title: newMemoryTitle.trim(),
      memory_date: newMemoryDate,
      description: newMemoryDescription.trim() || null,
      photo_url: newMemoryPhotoUrl.trim() || null,
      category: newMemoryCategory,
      display_order: memories.length,
    });

    setNewMemoryTitle("");
    setNewMemoryDate("");
    setNewMemoryDescription("");
    setNewMemoryPhotoUrl("");
    setNewMemoryCategory("milestone");
    fetchData();
    toast({ title: "Memory added!" });
  };

  const deleteMemory = async (id: string) => {
    await supabase.from("memories").delete().eq("id", id);
    fetchData();
    toast({ title: "Memory deleted" });
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
          <TabsList className="grid w-full grid-cols-9 h-auto">
            <TabsTrigger value="photos" className="flex flex-col items-center gap-1 py-2">
              <Image className="w-4 h-4" />
              <span className="text-xs">Photos</span>
            </TabsTrigger>
            <TabsTrigger value="reasons" className="flex flex-col items-center gap-1 py-2">
              <Heart className="w-4 h-4" />
              <span className="text-xs">Reasons</span>
            </TabsTrigger>
            <TabsTrigger value="dates" className="flex flex-col items-center gap-1 py-2">
              <Calendar className="w-4 h-4" />
              <span className="text-xs">Dates</span>
            </TabsTrigger>
            <TabsTrigger value="memories" className="flex flex-col items-center gap-1 py-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs">Memories</span>
            </TabsTrigger>
            <TabsTrigger value="music" className="flex flex-col items-center gap-1 py-2">
              <Music className="w-4 h-4" />
              <span className="text-xs">Music</span>
            </TabsTrigger>
            <TabsTrigger value="letter" className="flex flex-col items-center gap-1 py-2">
              <Mail className="w-4 h-4" />
              <span className="text-xs">Letter</span>
            </TabsTrigger>
            <TabsTrigger value="dreams" className="flex flex-col items-center gap-1 py-2">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs">Dreams</span>
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex flex-col items-center gap-1 py-2">
              <HelpCircle className="w-4 h-4" />
              <span className="text-xs">Quiz</span>
            </TabsTrigger>
            <TabsTrigger value="wishes" className="flex flex-col items-center gap-1 py-2">
              <Star className="w-4 h-4" />
              <span className="text-xs">Wishes</span>
            </TabsTrigger>
          </TabsList>

          {/* Photos Tab */}
          <TabsContent value="photos">
            <Card>
              <CardHeader>
                <CardTitle>Manage Photos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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

          {/* Special Dates Tab */}
          <TabsContent value="dates">
            <Card>
              <CardHeader>
                <CardTitle>Special Dates & Anniversaries</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3 p-4 bg-secondary/50 rounded-lg">
                  <h3 className="font-medium">Add New Special Date</h3>
                  <Input
                    placeholder="Title (e.g., Our Anniversary)"
                    value={newDateTitle}
                    onChange={(e) => setNewDateTitle(e.target.value)}
                  />
                  <Input
                    type="date"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                  />
                  <Textarea
                    placeholder="Description (optional)"
                    value={newDateDescription}
                    onChange={(e) => setNewDateDescription(e.target.value)}
                    rows={2}
                  />
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm text-muted-foreground mb-1 block">Icon</label>
                      <select
                        value={newDateIcon}
                        onChange={(e) => setNewDateIcon(e.target.value)}
                        className="w-full px-3 py-2 rounded-md border bg-background"
                      >
                        <option value="heart">❤️ Heart</option>
                        <option value="calendar">📅 Calendar</option>
                        <option value="gift">🎁 Gift</option>
                        <option value="cake">🎂 Cake</option>
                        <option value="sparkles">✨ Sparkles</option>
                        <option value="party">🎉 Party</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="recurring"
                        checked={newDateRecurring}
                        onChange={(e) => setNewDateRecurring(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <label htmlFor="recurring" className="text-sm">Yearly recurring</label>
                    </div>
                  </div>
                  <Button onClick={addSpecialDate} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Special Date
                  </Button>
                </div>

                <div className="space-y-3">
                  {specialDates.map((date) => (
                    <div
                      key={date.id}
                      className="flex items-center gap-3 p-3 bg-card border rounded-lg"
                    >
                      <Calendar className="w-5 h-5 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{date.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(date.event_date).toLocaleDateString()}
                          {date.is_recurring && " • Yearly"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteSpecialDate(date.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  {specialDates.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No special dates added yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Memories Tab */}
          <TabsContent value="memories">
            <Card>
              <CardHeader>
                <CardTitle>Memory Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3 p-4 bg-secondary/50 rounded-lg">
                  <h3 className="font-medium">Add New Memory</h3>
                  <Input
                    placeholder="Title (e.g., Our First Date)"
                    value={newMemoryTitle}
                    onChange={(e) => setNewMemoryTitle(e.target.value)}
                  />
                  <Input
                    type="date"
                    value={newMemoryDate}
                    onChange={(e) => setNewMemoryDate(e.target.value)}
                  />
                  <Textarea
                    placeholder="Description (optional)"
                    value={newMemoryDescription}
                    onChange={(e) => setNewMemoryDescription(e.target.value)}
                    rows={3}
                  />
                  <Input
                    placeholder="Photo URL (optional)"
                    value={newMemoryPhotoUrl}
                    onChange={(e) => setNewMemoryPhotoUrl(e.target.value)}
                  />
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Category</label>
                    <select
                      value={newMemoryCategory}
                      onChange={(e) => setNewMemoryCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-md border bg-background"
                    >
                      <option value="milestone">⭐ Milestone</option>
                      <option value="date">❤️ Date</option>
                      <option value="travel">✈️ Travel</option>
                      <option value="photo">📷 Photo Moment</option>
                      <option value="music">🎵 Music</option>
                      <option value="gift">🎁 Gift</option>
                      <option value="special">✨ Special</option>
                      <option value="location">📍 Location</option>
                    </select>
                  </div>
                  <Button onClick={addMemory} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Memory
                  </Button>
                </div>

                <div className="space-y-3">
                  {memories.map((memory) => (
                    <div
                      key={memory.id}
                      className="flex items-start gap-3 p-3 bg-card border rounded-lg"
                    >
                      {memory.photo_url && (
                        <img
                          src={memory.photo_url}
                          alt={memory.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      {!memory.photo_url && (
                        <Clock className="w-5 h-5 text-primary mt-1" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{memory.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(memory.memory_date).toLocaleDateString()} • {memory.category}
                        </p>
                        {memory.description && (
                          <p className="text-sm text-muted-foreground truncate mt-1">
                            {memory.description}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMemory(memory.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  {memories.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No memories added yet
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
              <CardContent className="space-y-6">
                <div className="space-y-3 p-4 bg-secondary/50 rounded-lg">
                  <h3 className="font-medium">Add Spotify Track or Playlist</h3>
                  <p className="text-sm text-muted-foreground">
                    Paste a Spotify URL (track, album, or playlist) to embed it on the site.
                  </p>
                  <Input
                    placeholder="https://open.spotify.com/track/..."
                    value={musicUrl}
                    onChange={(e) => setMusicUrl(e.target.value)}
                  />
                  <Button onClick={saveMusicUrl} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Save Music
                  </Button>
                </div>

                {musicUrl && musicUrl.includes("spotify.com") && (
                  <div className="space-y-3">
                    <h3 className="font-medium">Preview</h3>
                    <div className="rounded-xl overflow-hidden shadow-lg">
                      <iframe
                        src={getSpotifyEmbedUrl(musicUrl)}
                        width="100%"
                        height="352"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        className="rounded-xl"
                      />
                    </div>
                  </div>
                )}

                {musicUrl && !musicUrl.includes("spotify.com") && musicUrl.trim() && (
                  <div className="p-4 bg-card border rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Direct audio URL saved. The music will play in the background.
                    </p>
                  </div>
                )}

                {!musicUrl && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Music className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No music configured yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Love Letter Tab */}
          <TabsContent value="letter">
            <Card>
              <CardHeader>
                <CardTitle>Love Letter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3 p-4 bg-secondary/50 rounded-lg">
                  <h3 className="font-medium">Write Your Love Letter</h3>
                  <Input
                    placeholder="Title (e.g., My Dearest Love)"
                    value={letterTitle}
                    onChange={(e) => setLetterTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="Pour your heart out here..."
                    value={letterContent}
                    onChange={(e) => setLetterContent(e.target.value)}
                    rows={12}
                    className="font-body"
                  />
                  <Button onClick={saveLetter} className="w-full">
                    <Save className="w-4 h-4 mr-2" />
                    Save Letter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dreams/Bucket List Tab */}
          <TabsContent value="dreams">
            <Card>
              <CardHeader>
                <CardTitle>Dreams & Bucket List</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3 p-4 bg-secondary/50 rounded-lg">
                  <h3 className="font-medium">Add a Dream</h3>
                  <Input
                    placeholder="Travel to Paris together..."
                    value={newBucketItem}
                    onChange={(e) => setNewBucketItem(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addBucketItem()}
                  />
                  <Button onClick={addBucketItem} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Dream
                  </Button>
                </div>

                <div className="space-y-3">
                  {bucketItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-card border rounded-lg"
                    >
                      <GripVertical className="w-4 h-4 text-muted-foreground" />
                      <span className={`flex-1 ${item.is_completed ? "line-through text-muted-foreground" : ""}`}>
                        {item.content}
                      </span>
                      {item.is_completed && (
                        <span className="text-xs text-green-600 font-medium">Done!</span>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteBucketItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  {bucketItems.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No dreams added yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quiz Tab */}
          <TabsContent value="quiz">
            <Card>
              <CardHeader>
                <CardTitle>Quiz Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3 p-4 bg-secondary/50 rounded-lg">
                  <h3 className="font-medium">Add a Question</h3>
                  <Input
                    placeholder="What's my favorite color?"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                  />
                  <Input
                    placeholder="Correct answer"
                    value={newCorrectAnswer}
                    onChange={(e) => setNewCorrectAnswer(e.target.value)}
                    className="border-green-300 focus:border-green-500"
                  />
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Wrong answers (at least 1):</p>
                    {newWrongAnswers.map((answer, index) => (
                      <Input
                        key={index}
                        placeholder={`Wrong answer ${index + 1}`}
                        value={answer}
                        onChange={(e) => {
                          const updated = [...newWrongAnswers];
                          updated[index] = e.target.value;
                          setNewWrongAnswers(updated);
                        }}
                        className="border-red-200 focus:border-red-400"
                      />
                    ))}
                  </div>
                  <Button onClick={addQuizQuestion} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Question
                  </Button>
                </div>

                <div className="space-y-3">
                  {quizQuestions.map((q, index) => (
                    <div
                      key={q.id}
                      className="p-4 bg-card border rounded-lg space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium">Q{index + 1}: {q.question}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteQuizQuestion(q.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                      <p className="text-sm text-green-600">✓ {q.correct_answer}</p>
                      <p className="text-sm text-muted-foreground">
                        ✗ {q.wrong_answers.join(" | ")}
                      </p>
                    </div>
                  ))}
                  {quizQuestions.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No quiz questions added yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishes Tab */}
          <TabsContent value="wishes">
            <Card>
              <CardHeader>
                <CardTitle>Star Wishes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  These are wishes made on the Wishes page. You can view and manage them here.
                </p>

                <div className="space-y-3">
                  {wishes.map((wish) => (
                    <div
                      key={wish.id}
                      className="flex items-center gap-3 p-3 bg-card border rounded-lg"
                    >
                      <Star className="w-5 h-5 text-gold fill-gold" />
                      <p className="flex-1">{wish.wish}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteWish(wish.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  {wishes.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No wishes yet. Go make some on the Wishes page! ⭐
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
