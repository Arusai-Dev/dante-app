'use client'

import { useState, useMemo, useEffect } from "react"
import { Search, Users, BookOpen, Filter, Circle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getPublicCards } from "@/lib/dbFunctions"
import Link from "next/link"
import { redirect } from "next/navigation"


const categories = ["All", "Languages", "Science", "Technology", "History", "Medicine", "Arts"]

export default function Explore() {
  
  
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [flashcardSets, setFlashcardSets] = useState([])
  
  const fetchPublicSets = async () => {
    const cards = await getPublicCards();
    return cards;
  }

  useEffect(() => {
    async function getCards() {
      const result = await fetchPublicSets();
      setFlashcardSets(result)
    }
    getCards();
  }, []);
  

  const filteredSets = useMemo(() => {
    return flashcardSets.filter((set) => {
      
      const matchesSearch =
        set.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        set.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        set.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        set.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategory === "All" || set.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [flashcardSets, searchQuery, selectedCategory])

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
    ))
  }

  return (
    <div className="min-h-screen bg-neutral-900">
      <div className="border-b-2  border-neutral-800 bg-neutral-900/95 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Explore Flashcard Sets</h1>
                <p className="text-gray-200">
                  Discover and study community created sets
                </p>
              </div>
            </div>

            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search flashcard sets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-2 border-neutral-800"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-white">Filter by category:</span>
          </div>
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 h-auto bg-neutral-800">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="bg-neutral-800 text-white data-[state=active]:text-neutral-900 text-xs sm:text-sm">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredSets.length} of {flashcardSets.length} flashcard sets
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSets.map((set) => (
            <Link key={set.id} href={`/flashcards/preview/${set.id}`}>
            
            <Card key={set.id} className="border-2 border-neutral-800 group hover:shadow-lg transition-all duration-200 cursor-pointer bg-[#D9D9D9]/3">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {set.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-white">
                    {renderStars(set.rating)}
                    <span className="text-sm font-medium ml-1">{set.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-white text-lg line-clamp-2 group-hover:text-white transition-colors">
                  {set.title}
                </CardTitle>
                <CardDescription className="line-clamp-3 text-sm text-gray-400">{set.description}</CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={set.authorAvatar || "/placeholder.svg"} alt={set.user} />
                      <AvatarFallback className="text-xs">
                        {set.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-50 truncate">{set.user}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-50">
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      <span>{set.card_cnt} cards</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{set.study_count.toLocaleString()} studied</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-50">{set.review_count} reviews</div>
                  <div className="flex flex-wrap gap-1">
                    {set.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} className="text-neutral-900 bg-white text-xs px-2 py-0">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                    <Button onClick={() => redirect(`/flashcards/practice/${set.id}`)} className="w-full bg-white text-neutral-800 hover:bg-gray-200 cursor-pointer" size="sm">
                      Start Studying
                    </Button>
                </div>
              </CardContent>
            </Card>
            </Link>
          ))}
        </div>

        {filteredSets.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No flashcard sets found</h3>
            <p className="text-white mb-4">
              Try adjusting your search terms or filters to find what you&apos;re looking for.
            </p>
            <Button
              className="text-neutral-900 hover:bg-gray-200"
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("All")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
