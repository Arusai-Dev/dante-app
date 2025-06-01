"use client"

import { useState } from "react"
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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const flashcardSet = {

}

const sampleCards = [

]

const reviews = [

]

const relatedSets = [

]

export default function Explore() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isFavorited, setIsFavorited] = useState(flashcardSet.isFavorited)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "fill-yellow-400 text-yellow-400"
            : i < rating
              ? "fill-yellow-400/50 text-yellow-400"
              : "text-gray-300"
        }`}
      />
    ))
  }

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % sampleCards.length)
    setIsFlipped(false)
  }

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + sampleCards.length) % sampleCards.length)
    setIsFlipped(false)
  }

  const currentCard = sampleCards[currentCardIndex]

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Explore
            </Button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Explore</span>
              <span>/</span>
              <span className="text-foreground">{flashcardSet.title}</span>
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
                    <Badge variant="outline">{flashcardSet.difficulty}</Badge>
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight">{flashcardSet.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      {renderStars(flashcardSet.rating)}
                      <span className="font-medium ml-1">{flashcardSet.rating}</span>
                      <span>({flashcardSet.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{flashcardSet.studyCount.toLocaleString()} studied</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setIsFavorited(!isFavorited)} className="gap-2">
                    <Heart className={`w-4 h-4 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
                    {isFavorited ? "Favorited" : "Favorite"}
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Flag className="w-4 h-4" />
                    Report
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">{flashcardSet.cardCount}</div>
                  <div className="text-sm text-muted-foreground">Cards</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">{flashcardSet.estimatedTime}</div>
                  <div className="text-sm text-muted-foreground">Est. Time</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">{flashcardSet.language}</div>
                  <div className="text-sm text-muted-foreground">Languages</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold">{flashcardSet.lastUpdated}</div>
                  <div className="text-sm text-muted-foreground">Updated</div>
                </div>
              </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="preview">Preview Cards</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About This Set</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{flashcardSet.description}</p>
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {flashcardSet.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>About the Author</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage
                          src={flashcardSet.author.avatar || "/placeholder.svg"}
                          alt={flashcardSet.author.name}
                        />
                        <AvatarFallback>
                          {flashcardSet.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{flashcardSet.author.name}</h3>
                          {flashcardSet.author.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{flashcardSet.author.bio}</p>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="font-medium">{flashcardSet.author.setsCreated}</div>
                            <div className="text-muted-foreground">Sets Created</div>
                          </div>
                          <div>
                            <div className="font-medium">{flashcardSet.author.totalStudents.toLocaleString()}</div>
                            <div className="text-muted-foreground">Total Students</div>
                          </div>
                          <div>
                            <div className="font-medium">{flashcardSet.author.joinDate}</div>
                            <div className="text-muted-foreground">Joined</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sample Cards</CardTitle>
                    <CardDescription>
                      Preview some cards from this set ({currentCardIndex + 1} of {sampleCards.length})
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="relative">
                        <Card
                          className="min-h-[200px] cursor-pointer transition-all duration-300 hover:shadow-md"
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
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => setIsFlipped(!isFlipped)}>
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                          <span className="text-sm text-muted-foreground">
                            {currentCardIndex + 1} / {sampleCards.length}
                          </span>
                        </div>
                        <Button variant="outline" onClick={nextCard} disabled={sampleCards.length <= 1}>
                          Next
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>

                      <Progress value={((currentCardIndex + 1) / sampleCards.length) * 100} className="w-full" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Reviews</CardTitle>
                    <CardDescription>{flashcardSet.review_count} reviews</CardDescription>
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
                                  <span className="font-medium">{review.user}</span>
                                  <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
                                </div>
                                <span className="text-sm text-muted-foreground">{review.date}</span>
                              </div>
                              <p className="text-sm text-muted-foreground">{review.comment}</p>
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
            <Card>
              <CardContent className="p-6 space-y-4">
                <Button className="w-full" size="lg">
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

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">More from {flashcardSet.author.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {relatedSets.map((set) => (
                  <div
                    key={set.id}
                    className="space-y-2 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <h4 className="font-medium text-sm">{set.title}</h4>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        {renderStars(set.rating)}
                        <span>{set.rating}</span>
                      </div>
                      <span>{set.cardCount} cards</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{set.studyCount} studied</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Study Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completion Rate</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <Progress value={87} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Average Score</span>
                    <span className="font-medium">4.2/5</span>
                  </div>
                  <Progress value={84} />
                </div>
                <div className="text-xs text-muted-foreground">
                  Based on {flashcardSet.studyCount.toLocaleString()} study sessions
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
