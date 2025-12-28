import { useEffect, useState, useMemo } from "react";
import { FloatingHearts } from "@/components/FloatingHearts";
import { FloatingNav } from "@/components/FloatingNav";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Trophy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuizQuestion {
  id: string;
  question: string;
  correct_answer: string;
  wrong_answers: string[];
}

const Quiz = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data } = await supabase
        .from("quiz_questions")
        .select("*")
        .order("display_order", { ascending: true });
      
      if (data && data.length > 0) {
        setQuestions(data);
      }
    };
    fetchQuestions();
  }, []);

  const currentQuestion = questions[currentIndex];
  
  // Shuffle answers for current question
  const shuffledAnswers = useMemo(() => {
    if (!currentQuestion) return [];
    const allAnswers = [currentQuestion.correct_answer, ...currentQuestion.wrong_answers];
    return allAnswers.sort(() => Math.random() - 0.5);
  }, [currentQuestion]);

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    if (answer === currentQuestion.correct_answer) {
      setScore(score + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsComplete(true);
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsComplete(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return "Perfect! You know me so well! 💕";
    if (percentage >= 80) return "Amazing! You really pay attention! 💖";
    if (percentage >= 60) return "Pretty good! We're learning together! 💗";
    return "Let's make more memories together! 💓";
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-soft relative flex items-center justify-center">
        <FloatingHearts />
        <div className="text-center animate-fade-in">
          <Heart className="w-16 h-16 mx-auto text-rose/30 mb-4" />
          <h2 className="text-2xl font-romantic mb-2">No quiz questions yet!</h2>
          <p className="text-muted-foreground">Add some questions in the admin panel.</p>
        </div>
        <FloatingNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-soft relative overflow-hidden">
      <FloatingHearts />
      
      {/* Confetti effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: "-20px",
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            >
              <Heart
                className="w-6 h-6 text-rose fill-current"
                style={{ transform: `rotate(${Math.random() * 360}deg)` }}
              />
            </div>
          ))}
        </div>
      )}
      
      <div className="container max-w-2xl mx-auto px-4 py-20">
        {!isComplete ? (
          <>
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Question {currentIndex + 1} of {questions.length}</span>
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-rose fill-current" />
                  {score}
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-heart rounded-full transition-all duration-500"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question card */}
            <div className="bg-card/90 backdrop-blur-sm rounded-3xl p-8 shadow-romantic border border-border/50 animate-fade-in">
              <h2 className="text-2xl md:text-3xl font-romantic text-center mb-8">
                {currentQuestion?.question}
              </h2>
              
              <div className="space-y-3">
                {shuffledAnswers.map((answer, index) => {
                  const isCorrect = answer === currentQuestion?.correct_answer;
                  const isSelected = answer === selectedAnswer;
                  
                  return (
                    <button
                      key={index}
                      className={cn(
                        "w-full p-4 rounded-xl text-left transition-all duration-300 border-2",
                        !isAnswered && "hover:border-rose hover:bg-rose-light/20 border-border/50 bg-background/50",
                        isAnswered && isCorrect && "border-green-500 bg-green-500/20",
                        isAnswered && isSelected && !isCorrect && "border-red-400 bg-red-400/20",
                        isAnswered && !isSelected && !isCorrect && "opacity-50 border-border/30"
                      )}
                      onClick={() => handleAnswer(answer)}
                      disabled={isAnswered}
                    >
                      <span className="font-medium">{answer}</span>
                    </button>
                  );
                })}
              </div>
              
              {isAnswered && (
                <div className="mt-6 text-center animate-fade-in">
                  <p className={cn(
                    "text-lg font-medium mb-4",
                    selectedAnswer === currentQuestion?.correct_answer
                      ? "text-green-600"
                      : "text-red-500"
                  )}>
                    {selectedAnswer === currentQuestion?.correct_answer
                      ? "Correct! 💕"
                      : `The answer was: ${currentQuestion?.correct_answer}`}
                  </p>
                  <Button onClick={nextQuestion} className="bg-gradient-heart">
                    {currentIndex < questions.length - 1 ? "Next Question" : "See Results"}
                  </Button>
                </div>
              )}
            </div>
          </>
        ) : (
          // Results screen
          <div className="text-center animate-fade-in">
            <div className="bg-card/90 backdrop-blur-sm rounded-3xl p-12 shadow-romantic border border-border/50">
              <Trophy className="w-20 h-20 mx-auto text-gold mb-6" />
              
              <h2 className="text-4xl font-romantic mb-4">Quiz Complete!</h2>
              
              <div className="flex justify-center items-center gap-2 mb-6">
                {[...Array(questions.length)].map((_, i) => (
                  <Heart
                    key={i}
                    className={cn(
                      "w-8 h-8 transition-all duration-300",
                      i < score
                        ? "text-rose fill-current animate-heart-beat"
                        : "text-muted-foreground/30"
                    )}
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
              
              <p className="text-3xl font-romantic text-primary mb-4">
                {score} / {questions.length}
              </p>
              
              <p className="text-xl text-muted-foreground mb-8">
                {getScoreMessage()}
              </p>
              
              <Button onClick={restartQuiz} variant="outline" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Play Again
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <FloatingNav />
    </div>
  );
};

export default Quiz;
