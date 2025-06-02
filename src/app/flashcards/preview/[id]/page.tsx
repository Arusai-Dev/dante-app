"use client"

import { useEffect, useState } from "react"
import {
  ArrowLeft,
  Star,
  Users,
  BookOpen,
  Clock,
  Heart,
  Share2,
  Flag,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Circle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParams } from "next/navigation"
import { getSetById } from "@/lib/dbFunctions"

const sampleCards = [
  {
    id: 1,
    front: "What is the capital of France?",
    back: "Paris",
    type: "Geography"
  },
  {
    id: 2,
    front: "Define photosynthesis",
    back: "The process by which plants convert sunlight into energy",
    type: "Definition"
  },
  {
    id: 3,
    front: "What is 15 × 8?",
    back: "120",
    type: "Math"
  }
]

const reviews = [
  {
    id: 1,
    user: "Name 1",
    rating: 5,
    comment: "This is an example of a comment, ",
    date: "2 weeks ago",
    helpful: 12,
    avatar: null
  },
  {
    id: 2,
    user: "Name 2",
    rating: 4,
    comment: "This is an example of a comment, ",
    date: "1 month ago",
    helpful: 8,
    avatar: null
  }
]

const relatedSets = [
  {
    id: 1,
    title: "Advanced Biology Concepts",
    rating: 4.6,
    cardCount: 45,
    study_count: 2340
  },
  {
    id: 2,
    title: "Chemistry Fundamentals",
    rating: 4.3,
    cardCount: 38,
    study_count: 1890
  }
]

export default function Preview() {
  
  const [flashcardSet, setFlashcardSet] = useState({})
  const [isFavorited, setIsFavorited] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const params = useParams();
  const { id } = params;
  
  useEffect(() => {
    async function getSetInfo() {
      try {
        const cards = await getSetById(parseInt(id.toString()));
        setFlashcardSet(cards[0] || {});
      } catch (error) {
        console.error("Error fetching flashcard set:", error);
      }
    }

    if (id) {
      getSetInfo();
    }
  }, [id]);


    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Circle
                key={i}
                className={`w-4 h-4 ${
                    i < Math.floor(rating)
                        ? "fill-white text-gray-50"
                        : i < rating
                        ? "fill-white/10 text-gray-50"
                        : "text-gray-300"
                }`}
            />
        ));
    };

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % sampleCards.length)
    setIsFlipped(false)
  }

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + sampleCards.length) % sampleCards.length)
    setIsFlipped(false)
  }

  const currentCard = sampleCards[currentCardIndex]

  if (Object.keys(flashcardSet).length === 0) {
    return (
      <div className="min-h-screen bg-neutral-800 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">Loading flashcard set...</div>
          <div className="text-sm text-muted-foreground mt-2">ID: {id}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="border-b bg-neutral-900/95 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Explore
            </Button>
            <div className="flex items-center gap-2 text-sm text-gray-200">
              <span>Explore</span>
              <span>/</span>
              <span className="text-gray-50">{flashcardSet.title || "Flashcard Set"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{flashcardSet.category}</Badge>
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight">{flashcardSet.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-50">
                    <div className="flex items-center gap-1">
                      {renderStars(flashcardSet.rating || 0)}
                      <span className="font-medium ml-1">{flashcardSet.rating || "0"}</span>
                      <span>({flashcardSet.review_count || flashcardSet.review_count || 0} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{(flashcardSet.study_count || 0).toLocaleString()} studied</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={() => setIsFavorited(!isFavorited)} className="gap-2">
                    <Heart className={`w-4 h-4 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
                    {isFavorited ? "Favorited" : "Favorite"}
                  </Button>
                  <Button size="sm" className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                  <Button variant="default" size="sm" className="gap-2">
                    <Flag className="w-4 h-4" />
                    Report
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-neutral-900">
                <div className="text-center p-4 bg-neutral-700/50 rounded-lg">
                  <div className="text-2xl font-bold">{flashcardSet.cardCount || flashcardSet.card_cnt || 0}</div>
                  <div className="text-sm text-muted-foreground">Cards</div>
                </div>
                <div className="text-center p-4 bg-neutral-700/50 rounded-lg">
                  <div className="text-2xl font-bold">{flashcardSet.est_time || flashcardSet.estimated_time || "N/A"}</div>
                  <div className="text-sm text-muted-foreground">Est. Time</div>
                </div>
                <div className="text-center p-4 bg-neutral-700/50 rounded-lg">
                  <div className="text-2xl font-bold">{flashcardSet.language || "EN"}</div>
                  <div className="text-sm text-muted-foreground">Languages</div>
                </div>
                <div className="text-center p-4 bg-neutral-700/50 rounded-lg">
                  <div className="text-2xl font-bold">{flashcardSet.lastUpdated || flashcardSet.last_updated || "N/A"}</div>
                  <div className="text-sm text-muted-foreground">Updated</div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 bg-neutral-800">
                <TabsTrigger value="overview" className="bg-neutral-800 text-white data-[state=active]:text-neutral-900">Overview</TabsTrigger>
                <TabsTrigger value="preview" className="bg-neutral-800 text-white data-[state=active]:text-neutral-900" >Preview Cards</TabsTrigger>
                <TabsTrigger value="reviews" className="bg-neutral-800 text-white data-[state=active]:text-neutral-900" >Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card className="bg-neutral-800">
                  <CardHeader>
                    <CardTitle className="text-gray-50">About This Set</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-200 leading-relaxed">
                      {flashcardSet.description || "No description available."}
                    </p>
                    <div className="mt-4">
                      <h4 className="font-medium mb-2 text-white">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {(flashcardSet.tags || []).map((tag, index) => (
                          <Badge key={index} variant="default" className="bg-white text-neutral-900">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-neutral-800">
                  <CardHeader>
                    <CardTitle className="text-gray-50">About the Author</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage
                          src={flashcardSet.author?.avatar}
                          alt={flashcardSet.author?.name || "Author"}
                        />
                        <AvatarFallback>
                          {(flashcardSet.author?.name || "A")
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white">{flashcardSet.author?.name || "Unknown Author"}</h3>
                          {flashcardSet.author?.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {flashcardSet.author?.bio || "No bio available."}
                        </p>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="font-medium text-gray-50">{flashcardSet.author?.setsCreated || 0}</div>
                            <div className="text-gray-50">Sets Created</div>
                          </div>
                          <div>
                            <div className="font-medium text-gray-50">{flashcardSet.author?.joinDate || "N/A"}</div>
                            <div className="text-gray-50">Joined</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preview" className="space-y-6">
                <Card className="bg-neutral-800">
                  <CardHeader>
                    <CardTitle className="text-white">Sample Cards</CardTitle>
                    <CardDescription>
                      Preview some cards from this set ({currentCardIndex + 1} of {sampleCards.length})
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="relative">
                        <Card
                          className="min-h-[200px] cursor-pointer transition-all duration-300 hover:shadow-md bg-white text-neutral-900"
                          onClick={() => setIsFlipped(!isFlipped)}
                        >
                          <CardContent className="flex items-center justify-center h-[200px] text-center">
                            <div className="space-y-2">
                              <div className="text-2xl font-semibold">
                                {isFlipped ? currentCard.back : currentCard.front}
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {currentCard.type}
                              </Badge>
                              <div className="text-sm text-muted-foreground mt-4">
                                Click to {isFlipped ? "see question" : "reveal answer"}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="flex items-center justify-between">
                        <Button variant="outline" onClick={prevCard} disabled={sampleCards.length <= 1}>
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Previous
                        </Button>

                        <Button variant="outline" onClick={nextCard} disabled={sampleCards.length <= 1}>
                          Next
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>

                      <Progress value={((currentCardIndex + 1) / sampleCards.length) * 100} className="w-full bg-white" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <Card className="bg-neutral-800">
                  <CardHeader>
                    <CardTitle className="text-white">Student Reviews</CardTitle>
                    <CardDescription className="text-gray-50">{flashcardSet.review_count || 0} reviews</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {reviews.map((review, index) => (
                        <div key={review.id}>
                          <div className="flex items-start gap-4">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={review.avatar || "/placeholder.svg"} alt={review.user} />
                              <AvatarFallback>
                                {review.user
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-white">{review.user}</span>
                                  <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
                                </div>
                                <span className="text-sm text-muted-foreground">{review.date}</span>
                              </div>
                              <p className="text-sm text-gray-50">{review.comment}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <button className="hover:text-foreground transition-colors">
                                  Helpful ({review.helpful})
                                </button>
                                <button className="hover:text-foreground transition-colors">Reply</button>
                              </div>
                            </div>
                          </div>
                          {index < reviews.length - 1 && <Separator className="mt-6" />}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="">
              <CardContent className="p-6 space-y-4">
                <Button variant="" className="w-full" size="lg">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Start Studying
                </Button>
                <Button variant="outline" className="w-full">
                  <Clock className="w-4 h-4 mr-2" />
                  Practice Test
                </Button>
                <Button variant="outline" className="w-full">
                  Add to Study Plan
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-neutral-800">
              <CardHeader>
                <CardTitle className="text-lg text-white">More from {flashcardSet.author?.name || "This Author"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {relatedSets.map((set) => (
                  <div
                    key={set.id}
                    className="space-y-2 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors bg-white"
                  >
                    <h4 className="font-medium text-sm text-black">{set.title}</h4>
                    <div className="flex items-center justify-between text-xs text-gray-50">
                      <div className="flex items-center gap-1">
                        {renderStars(set.rating)}
                        <span>{set.rating}</span>
                      </div>
                      <span>{set.cardCount} cards</span>
                    </div>
                    <div className="text-xs text-gray-200">{set.study_count} studied</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="">
              <CardHeader>
                <CardTitle className="text-lg text-white">Study Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Completion Rate</span>
                    <span className="font-medium text-white">87%</span>
                  </div>
                  <Progress value={87}  className="bg-white "/>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Score</span>
                    <span className="font-medium">4.2/5</span>
                  </div>
                  <Progress value={84} />
                </div>
                <div className="text-xs text-muted-foreground">
                  Based on {(flashcardSet.study_count || 0).toLocaleString()} study sessions
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}