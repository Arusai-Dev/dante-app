'use client'

import { getSetById } from "@/lib/dbFunctions";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, RotateCcw, Eye, EyeOff, Play, Pause, Timer, Clock } from "lucide-react"

export default function QuizSet({ params }) {

    const [paramId, setParamId] = useState();
    const [flashcardSet, setFlashcardSet] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<string | boolean | null>(null)
    const [showFeedback, setShowFeedback] = useState(false)
    const [correctAnswers, setCorrectAnswers] = useState(0)
    const [wrongAnswers, setWrongAnswers] = useState(0)
    const [quizCompleted, setQuizCompleted] = useState(false)
    const [showCounters, setShowCounters] = useState(true)
    const [showHeader, setShowHeader] = useState(false)
    const [timerActive, setTimerActive] = useState(false)
    const [timerRunning, setTimerRunning] = useState(false)
    const [timerTime, setTimerTime] = useState(0)
    const [showTimerFull, setShowTimerFull] = useState(true)
    const [finalTime, setFinalTime] = useState(0)
    const [quizData, setQuizData] = useState([])

    useEffect(() => {
        async function getParamId() {
            const { id } = await params;
            setParamId(id);
        }

        getParamId()
    }, [params])


    useEffect(() => {
        async function getInfo() {
            const [set] = await getSetById(paramId)
            
            setFlashcardSet([set])

        }
        getInfo()
    }, [paramId])


  useEffect(() => {
      
      async function generateQuizDetails() {
          
          const allPromises = flashcardSet?.flatMap(set => {
              if (!set || !set.cards) {
                  return [];
              }
              
              return set.cards.map(async (card, index) => {
                  
                  const api = await fetch('http://localhost:3000/api/generate-quiz', {
                      method: "POST",
                      headers: {
                          'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                          prompt: 
                          `this is a multiple-choice question, The question is as follows:
                            <question> ${card.front} </question>

                            The correct answer is:
                            <answer>
                            ${card.back}
                            </answer>

                            your answer should be in the following format:
                            { options: ["option1", "option2", "option3", "option4"], explanation: "your short, explanation for the question's answer" }                        

                            guidelines for your response:
                            1. The options array will contain 3 incorrect options and the correct option. All the options should be shuffled in a random order.
                            2. The explanation string: provide a short, explanation for the question's answer
                            3. Your response must be valid JSON`
                      })
                  });

                  const response = await api.json();

                  return {
                      id: index + 1,
                      type: "multiple-choice",
                      question: card.front,
                      options: response.model_response.options,
                      correctAnswer: card.back,
                      explanation: response.model_response.explanation
                  };
              });
          }) || [];

          const results = await Promise.all(allPromises);
          
          setQuizData(results);
      }

      if (flashcardSet?.length > 0 && flashcardSet[0]?.cards) {
          generateQuizDetails();
      }
  }, [flashcardSet]);    


    const question = quizData?.[currentQuestion]
    const isCorrect = selectedAnswer === question?.correctAnswer
    const progress = ((currentQuestion + 1) / quizData?.length) * 100


    useEffect(() => {
        let interval: NodeJS.Timeout | null = null
        if (timerRunning && timerActive) {
        interval = setInterval(() => {
            setTimerTime((time) => time + 1)
        }, 1000)
        }
        return () => {
        if (interval) clearInterval(interval)
        }
    }, [timerRunning, timerActive])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    const handleAnswerSelect = (answer: string | boolean) => {
        setSelectedAnswer(answer)
    }

    const handleSubmit = () => {
        if (selectedAnswer === null) return

        setShowFeedback(true)
        if (isCorrect) {
        setCorrectAnswers(correctAnswers + 1)
        } else {
        setWrongAnswers(wrongAnswers + 1)
        }
    }


    const handleNext = () => {
        if (currentQuestion < quizData?.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowFeedback(false)
        } else {
        if (timerActive) {
            setFinalTime(timerTime)
            setTimerRunning(false)
        }
        setQuizCompleted(true)
        }
    }

    const handleRestart = () => {
        setCurrentQuestion(0)
        setSelectedAnswer(null)
        setShowFeedback(false)
        setCorrectAnswers(0)
        setWrongAnswers(0)
        setQuizCompleted(false)
        setTimerTime(0)
        setTimerRunning(false)
        setTimerActive(false)
        setFinalTime(0)
        setShowHeader(true) 
    }

    const toggleTimer = () => {
        if (!timerActive) {
        setTimerActive(true)
        setTimerRunning(true)
        } else {
        setTimerRunning(!timerRunning)
        }
    }

    if (quizCompleted) {
        return (
        <div className="max-w-4xl mx-auto p-8">
            <Card>
            <CardHeader className="text-center">
                <CardTitle className="text-3xl mb-2">Quiz Completed!</CardTitle>
                <p className="text-lg text-muted-foreground">Web Development Fundamentals Quiz</p>
            </CardHeader>
            <CardContent className="text-center space-y-6 p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <div className="text-3xl font-bold text-green-600">{correctAnswers}</div>
                    <p className="text-sm text-muted-foreground">Correct</p>
                </div>
                <div className="space-y-2">
                    <div className="text-3xl font-bold text-red-600">{wrongAnswers}</div>
                    <p className="text-sm text-muted-foreground">Wrong</p>
                </div>
                <div className="space-y-2">
                    <div className="text-3xl font-bold text-primary">
                    {Math.round((correctAnswers / quizData.length) * 100)}%
                    </div>
                    <p className="text-sm text-muted-foreground">Score</p>
                </div>
                </div>

                {finalTime > 0 && (
                <div className="border-t pt-6">
                    <div className="flex items-center justify-center gap-2 text-lg">
                    <Clock className="w-5 h-5" />
                    <span>Time taken: {formatTime(finalTime)}</span>
                    </div>
                </div>
                )}

                <Button onClick={handleRestart} className="gap-2 px-8 py-3 text-lg">
                <RotateCcw className="w-5 h-5" />
                Restart Quiz
                </Button>
            </CardContent>
            </Card>
        </div>
        )
    }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      {showHeader && (
        <Card className="bg-neutral-900">
          <CardHeader className="text-center relative text-white">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHeader(false)}
              className="absolute top-4 right-4 h-8 w-8 p-0"
            >
              <EyeOff className="w-4 h-4" />
            </Button>
            <CardTitle className="text-3xl">Web Development Fundamentals Quiz</CardTitle>
            <p className="text-lg text-gray-200 mt-2">
              Test your knowledge of web development basics including HTML, CSS, JavaScript, and React
            </p>
            <div className="text-sm text-muted-foreground mt-1">{quizData.length} questions • Mixed question types</div>
          </CardHeader>
        </Card>
      )}

      {!showHeader && (
        <div className="flex justify-center">
          <Button variant="outline" size="sm" onClick={() => setShowHeader(true)} className="gap-2 text-black hover:bg-gray-300">
            <Eye className="w-4 h-4" />
            Show Quiz Info
          </Button>
        </div>
      )}

      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowCounters(!showCounters)} className="gap-2 text-black">
            {showCounters ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showCounters ? "Hide" : "Show"} Counters
          </Button>

          <Button variant="outline" size="sm" onClick={toggleTimer} className="gap-2 bg-transparent">
            {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {!timerActive ? "Start Timer" : timerRunning ? "Pause" : "Resume"}
          </Button>

          {timerActive && (
            <Button variant="outline" size="sm" onClick={() => setShowTimerFull(!showTimerFull)} className="gap-2 text-black">
              {showTimerFull ? <Timer className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              {showTimerFull ? formatTime(timerTime) : ""}
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center text-base">
          <span className="text-gray-200">
            Question {currentQuestion + 1} of {quizData.length}
          </span>

          {showCounters && (
            <div className="flex gap-4 text-sm">
              <span className="text-green-400 font-medium">{correctAnswers}</span>
              <span className="text-red-400 font-medium">{wrongAnswers}</span>
            </div>
          )}
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      <Card className="bg-neutral-900">
        <CardHeader className="pb-6">
          <CardTitle className="text-2xl text-gray-200">{question?.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 p-8">


          {question?.type === "multiple-choice" && question.options && (
            <RadioGroup
              value={selectedAnswer as string}
              onValueChange={(value) => handleAnswerSelect(value)}
              disabled={showFeedback}
            >
              <div className="space-y-3 text-white">
                {question.options.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-4 p-4 rounded-lg border transition-colors text-lg ${
                      showFeedback
                        ? option === question.correctAnswer
                          ? "border-3 bg-green-400 border-green-200"
                          : selectedAnswer === option
                            ? "border-3 bg-red-400 border-red-200"
                            : "bg-neutral-900"
                        : "hover:bg-gray-50 hover:text-black"
                    }`}
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </label>
                    {showFeedback && option === question.correctAnswer && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    {showFeedback && selectedAnswer === option && option !== question.correctAnswer && (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}


          {question?.type === "true-false" && (
            <RadioGroup
              value={selectedAnswer?.toString()}
              onValueChange={(value) => handleAnswerSelect(value === "true")}
              disabled={showFeedback}
            >
              <div className="space-y-3 text-white">
                {[true, false].map((option) => (
                  <div
                    key={option.toString()}
                    className={`flex items-center space-x-4 p-4 rounded-lg border transition-colors text-lg ${
                      showFeedback
                        ? option === question.correctAnswer
                          ? "border-3 bg-green-400 border-green-200"
                          : selectedAnswer === option
                            ? "border-3 bg-red-300 border-red-200"
                            : "bg-neural-900"
                        : "hover:bg-gray-50 hover:text-black"
                    }`}
                  >
                    <RadioGroupItem value={option.toString()} id={`tf-${option}`} />
                    <label htmlFor={`tf-${option}`} className="flex-1 cursor-pointer">
                      {option ? "True" : "False"}
                    </label>
                    {showFeedback && option === question.correctAnswer && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    {showFeedback && selectedAnswer === option && option !== question.correctAnswer && (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}



          {showFeedback && (
            <div
              className={`p-6 rounded-lg border-l-4 ${
                isCorrect ? "bg-green-200 border-l-green-500 text-green-800" : "bg-red-200 border-l-red-500 text-red-800"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                {isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
                <span className="font-semibold text-lg">{isCorrect ? "Correct!" : "Incorrect"}</span>
              </div>
              <p className="text-base leading-relaxed">{question.explanation}</p>
            </div>
          )}

          <div className="flex justify-between">
            {!showFeedback ? (
              <Button onClick={handleSubmit} disabled={selectedAnswer === null} className="ml-auto px-8 py-3  border-1 hover:bg-neutral-800 ">
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNext} className="ml-auto px-8 py-3 border-1 hover:bg-neutral-800">
                {currentQuestion < quizData.length - 1 ? "Next Question" : "Finish Quiz"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>


    </div>
  )

}
