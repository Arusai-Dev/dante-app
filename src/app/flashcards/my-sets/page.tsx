"use client"

import DeleteButton from "@/components/delete-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen, PlusSquare, Sparkles, Search, Filter, X, MoreVertical, Settings } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function MyFlashcards() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [cardsData, setCardsData] = useState([])
  const [manageCards, setManageCards] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    async function getSets() {
      try {
        setIsLoading(true)
        const res = await fetch("/api/my-sets")
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setCardsData(data.Sets ?? [])
      } catch (err) {
        console.error("Failed to load sets:", err)
        setError("Could not load your flashcard sets. Please try again later.")
        setCardsData([])
      } finally {
        setIsLoading(false)
      }
    }
    getSets()
  }, [])

  let categories = ["All"]
  cardsData.forEach((set) => {
    categories.push(set.category)
  })
  categories = [...new Set(categories)]

  const filteredSets = cardsData.filter((set) => {
    const matchesSearch =
      set.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      set.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      set.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || set.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const MobileCardActions = ({ set }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {!manageCards ? (
          <DropdownMenuItem asChild>
            <Link href={`play/${set.id}`} className="w-full">
              Review Cards
            </Link>
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link href="manager" className="w-full">
                Edit Cards
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-400">
              <DeleteButton id={set.id} title={set.title} />
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <div className="min-h-screen text-white pt-16">
      <div className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="space-y-1 md:space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-3xl lg:text-4xl font-bold leading-tight">My Sets</h1>
            <p className="text-base sm:text-xl md:text-lg text-neutral-400 leading-relaxed">
              Add, remove, edit or organize your sets.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <div className={`space-y-4 md:space-y-3 mb-6 md:mb-8 ${showFilters ? "block" : "hidden md:block"}`}>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 md:w-5 h-4 md:h-5" />
              <Input
                className="pl-10 md:pl-12 h-11 md:h-12 bg-neutral-900/80 border-neutral-700 focus:border-neutral-600 focus:ring-neutral-600 text-sm md:text-base rounded-xl"
                placeholder="Search flashcard sets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 h-7 md:h-8 w-7 md:w-8 p-0"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-3 md:h-4 w-3 md:w-4" />
                </Button>
              )}
            </div>

            <div className="flex gap-3 md:gap-4">
              <div className="relative">
                <Filter className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 md:w-5 h-4 md:h-5" />
                <select
                  id="category-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="pl-10 md:pl-12 pr-8 md:pr-10 h-11 md:h-12 rounded-xl bg-neutral-900/80 border border-neutral-700 focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 min-w-[140px] md:min-w-[160px] appearance-none cursor-pointer text-sm md:text-base"
                >
                  {categories.map((category) => (
                    <option className="bg-neutral-900 text-white" key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                className={`h-11 md:h-12 px-4 md:px-6 text-sm md:text-base font-medium transition-all duration-200 flex items-center gap-2 ${
                  manageCards
                    ? "bg-red-500 hover:bg-red-400 text-white shadow-lg"
                    : "bg-neutral-800 hover:bg-neutral-700 text-neutral-200"
                }`}
                onClick={() => setManageCards(!manageCards)}
              >
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">{manageCards ? "Exit Manage" : "Manage"}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="md:hidden h-11 w-11"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {(searchTerm || selectedCategory !== "All") && (
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <Badge
                  variant="secondary"
                  className="bg-neutral-800 text-neutral-300 text-xs md:text-sm px-2 md:px-3 py-1 md:py-2"
                >
                  Search: {searchTerm}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 md:h-5 w-4 md:w-5 p-0 ml-1 md:ml-2"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-2 md:h-3 w-2 md:w-3" />
                  </Button>
                </Badge>
              )}
              {selectedCategory !== "All" && (
                <Badge
                  variant="secondary"
                  className="bg-neutral-800 text-neutral-300 text-xs md:text-sm px-2 md:px-3 py-1 md:py-2"
                >
                  Category: {selectedCategory}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 md:h-5 w-4 md:w-5 p-0 ml-1 md:ml-2"
                    onClick={() => setSelectedCategory("All")}
                  >
                    <X className="h-2 md:h-3 w-2 md:w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          )}


        </div>

        {error && (
          <div className="mb-4 md:mb-6 rounded-lg border border-red-600 bg-red-500/20 p-3 md:p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {filteredSets.length === 0 && !isLoading && cardsData.length > 0 && (
          <div className="text-center py-8 md:py-12">
            <div className="bg-neutral-900/50 rounded-2xl p-6 md:p-8 max-w-md mx-auto">
              <BookOpen className="w-10 md:w-12 h-10 md:h-12 text-neutral-500 mx-auto mb-3 md:mb-4" />
              <h3 className="text-lg font-semibold mb-2">No flashcard sets found</h3>
              <p className="text-neutral-400 mb-4 text-sm">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button
                className="bg-neutral-800 hover:bg-neutral-700"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("All")
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-48 md:h-52 w-full rounded-2xl bg-neutral-800/50" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {filteredSets.map((set, index) => (
              <div
                key={index}
                className="group bg-neutral-900/80 backdrop-blur-sm rounded-2xl border border-neutral-800 hover:border-neutral-700 transition-all duration-200 hover:shadow-xl hover:shadow-neutral-900/20 min-h-[220px] md:min-h-[240px] flex flex-col"
              >
                <div className="p-4 md:p-5 flex flex-col h-full">
                  <div className="flex-1 space-y-2 md:space-y-3">
                    <div className="flex items-start justify-between gap-2 md:gap-3">
                      <h3 className="text-base md:text-lg font-bold leading-tight group-hover:text-neutral-100 transition-colors flex-1 line-clamp-2">
                        {set.title}
                      </h3>
                      <div className="md:hidden flex-shrink-0">
                        <MobileCardActions set={set} />
                      </div>
                    </div>
                    <p className="text-neutral-400 text-xs md:text-sm leading-relaxed line-clamp-2">
                      {set.description}
                    </p>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-neutral-200 text-sm md:text-base font-semibold">{set.card_cnt} Cards</span>
                      <Badge
                        variant="secondary"
                        className="bg-neutral-800 text-neutral-300 hover:bg-neutral-700 text-xs px-2 py-1 font-medium"
                      >
                        {set.category}
                      </Badge>
                    </div>
                    <div className="flex gap-3 md:gap-4 text-xs md:text-sm text-neutral-400">
                      <span className="flex items-center gap-1 md:gap-2">
                        <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-green-500 rounded-full"></div>
                        New: 10
                      </span>
                      <span className="flex items-center gap-1 md:gap-2">
                        <div className="w-1.5 md:w-2 h-1.5 md:h-2 bg-orange-500 rounded-full"></div>
                        Due: 0
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 md:mt-4 hidden md:block">
                    {manageCards ? (
                      <div className="space-y-2">
                        <Button
                          className="w-full h-8 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium"
                          variant="secondary"
                        >
                          <Link href="manager" className="w-full">
                            Edit Cards
                          </Link>
                        </Button>
                        <DeleteButton id={set.id} title={set.title} />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Button
                          variant="secondary"
                          className="w-full h-8 bg-white text-neutral-900 hover:bg-neutral-100 font-semibold text-xs"
                        >
                          <Link href={`practice/${set.id}`} className="w-full">
                            Start Studying
                          </Link>
                        </Button>
                        <div className="grid grid-cols-2 gap-2">
                          <Button className="h-7 bg-neutral-700 hover:bg-neutral-600 text-white font-medium text-xs">
                            <Link href={`quiz/${set.id}`} className="flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              Quiz
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            className="h-7 border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white bg-transparent font-medium text-xs"
                          >
                            <Link href={`play/${set.id}`}>Review</Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 md:hidden">
                    {manageCards ? (
                      <div className="space-y-3">
                        <Button
                          className="w-full h-12 bg-neutral-800 hover:bg-neutral-700 text-white font-medium"
                          variant="secondary"
                          asChild
                        >
                          <Link href="manager">Edit Cards</Link>
                        </Button>
                        <DeleteButton id={set.id} title={set.title} />
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Button
                          variant="secondary"
                          className="w-full h-12 bg-white text-neutral-900 hover:bg-neutral-100 font-semibold text-base"
                          asChild
                        >
                          <Link href={`practice/${set.id}`}>Start Studying</Link>
                        </Button>
                        <Button
                          className="w-full h-11 bg-neutral-700 hover:bg-neutral-600 text-white font-medium"
                          asChild
                        >
                          <Link href={`quiz/${set.id}`} className="flex items-center justify-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Quiz Mode
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-50">
        <Link href="manager">
          <Button
            size="lg"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white hover:bg-neutral-100 text-neutral-900 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            <PlusSquare className="w-5 h-5 sm:w-6 sm:h-6" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
