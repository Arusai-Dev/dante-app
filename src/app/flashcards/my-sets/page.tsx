/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import DeleteButton from "@/components/DeleteButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Layers2,
    Globe,
    LockKeyhole,
    BookOpenIcon,
    BookOpen,
    PlusCircle,
    PlusSquare,
    Search,
    Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MyFlashcards() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [cardsData, setCardsData] = useState([]);
    const [manageCards, setManageCards] = useState(false);

    useEffect(() => {
        async function getSets() {
            const res = await fetch("http://localhost:3000/api/my-sets", {
                method: "GET",
            });

            const data = await res.json();
            setCardsData(data.Sets);
        }

        getSets();
    }, []);

    let categories = ["All"];

    cardsData.forEach((set => {
        categories.push(set.category)
    }))

    categories = [...new Set(categories)]


    const filteredSets = cardsData.filter((set) => {
        const matchesSearch =
            set.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            set.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
            set.category.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
            selectedCategory === "All" || set.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <section className="flex flex-col items-center pt-[40px] font-(family-name:inter) h-screen w-screen">
            <div className="flex flex-col pt-[30px] pb-9 border-b border-gray-500 w-full">
                <h1 className=" text-4xl font-bold text-left ml-20">My Sets</h1>
                <p className=" text-[22px] pt-2 ml-20">
                    Add, remove, edit or organize your sets.
                </p>
            </div>

            <div className="flex flex-row ">
                <div className="flex-1 mr-3 relative">
                    <Input
                        className="my-10 w-200 p-5"
                        placeholder="Search flashcard sets..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    ></Input>
                </div>

                <span className="mt-10">
                    <select
                        id="category-select"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="flex-1 rounded-md bg-neutral-800 pt-3 pb-2 px-3 "
                    >
                        {categories.map((category) => (
                            <option
                                className="bg-neutral-800 text-white"
                                key={category}
                                value={category}
                            >
                                {category}
                            </option>
                        ))}
                    </select>
                </span>

                <Button className={`mt-10 p-5 ml-3 bg-neutral-800 hover:bg-neutral-700 ${manageCards ? "bg-neutral-600 animate-pulse" : ""}`}
                    onClick={(e) => setManageCards(!manageCards)}
                >
                    Manage
                </Button>
            </div>

            {filteredSets.length === 0 &&
                Object.keys(cardsData).length !== 0 && (
                    <div className="text-center py-12 ">
                        <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            No flashcard sets found
                        </h3>
                        <p className="text-white mb-4">
                            Try adjusting your search terms or filters to find
                            what you&apos;re looking for.
                        </p>
                        <Button
                            className="text-neutral-900 hover:bg-gray-200"
                            variant="outline"
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedCategory("All");
                            }}
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}

            {Object.keys(cardsData).length === 0 ? ( 

                Array.from({length: 6}).map((_, index) => (

                        <div className="flex flex-col space-y-3" key={index}>
                            <Skeleton className="h-[300px] w-[450px] mt-5 rounded-xl bg-neutral-800 animate-pulse" />
                        </div>
                 
                ))) 
                : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-4 gap-3 h-full 2xl:grid-cols-4">
                    {
                        //@ts-ignore
                        filteredSets.map((set, index: number) => (
                            <div key={index} className="w-[560px]">
                                <div className="h-80 w-[80%] bg-neutral-900 rounded-2xl ml-5 mt-5">
                                    <div className="">
                                        <h1 className="inline-block text-left px-5 pt-5 font-bold text-2xl">
                                            {set.title}
                                        </h1>
                                    </div>

                                    <h1 className="text-left m-auto px-5 pt-2 text-gray-400">
                                        {set.description}
                                    </h1>

                                    <div className="grid grid-cols-2 gap-50 mx-5 mt-2">
                                        <p className="inline-block m-1 text-gray-300">
                                            {set.card_cnt} Cards
                                        </p>
                                        <Badge
                                            variant="secondary"
                                            className="rounded-xl top-0 left-0"
                                            >
                                            {set.category}
                                        </Badge>
                                    </div>

                                    <div className="inline-block">
                                        <p className="inline-block mx-5 mt-3 text-left">
                                            New: 10
                                        </p>
                                        <p className="inline-block mx-5 mt-3 text-left">
                                            Due: 0
                                        </p>
                                    </div>
                                    { manageCards ? 
                                        <div className="flex mt-20  items-center justify-center">

                                                <DeleteButton id={set.id} title={set.title} />

                                            
                                                <Button className="bg-neutral-800 text-white hover:bg-neutral-700"
                                                variant="secondary"
                                                >
                                                    <Link href={`manager`}>
                                                    Edit and Delete cards
                                                    </Link>
                                                </Button>
                                            
                                        </div>
                                        
                                        
                                        :
                                        
                                        
                                        <div className="flex mt-20  items-center justify-center">
                                                <Button variant="secondary" className="mr-2 w-1/2">
                                                    <Link href={`practice/${set.id}`}
                                                    className="px-8 py-3"
                                                    >
                                                    Start Studying
                                                    </Link>
                                                </Button>

                                                <Button className="bg-neutral-500 mr-2 px-4 hover:bg-neutral-400">
                                                    <Link href={`quiz/${set.id}`}>
                                                        <Sparkles className="inline-block"/> Quiz
                                                    </Link>
                                                </Button>

                                                <Button className="bg-neutral-800 text-white hover:bg-neutral-700" variant="secondary">
                                                    <Link href={`play/${set.id}`}>
                                                    Review
                                                    </Link>
                                                </Button>
                                            
                                        </div>
                                         
                                         
                                         
                                        }
                                </div>
                            </div>
                        ))
                    }
                </div>

            )}
            
            
            <div className="flex bottom-10 right-10 bg-white rounded-full size-15 items-center justify-center hover:bg-gray-300 fixed">
                <Link href={`manager`} className="px-8 py-8">
                    <PlusSquare className="text-black float-center size-8" />
                </Link>
            </div>

        </section>
    );
}
