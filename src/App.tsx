import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import Index from "./pages/Index";
import Valentine from "./pages/Valentine";
import Admin from "./pages/Admin";
import LoveLetter from "./pages/LoveLetter";
import Dreams from "./pages/Dreams";
import Quiz from "./pages/Quiz";
import Wishes from "./pages/Wishes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/valentine" element={<Valentine />} />
          <Route path="/love-letter" element={<LoveLetter />} />
          <Route path="/dreams" element={<Dreams />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/wishes" element={<Wishes />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Analytics />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
