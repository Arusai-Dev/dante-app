import { useManagerPersistentStore, useManagerNonPersistentStore } from "@/app/stores/managerStores";
import { createNewSet, getSetByTitle } from "@/lib/dbFunctions";
import { useUser } from "@clerk/nextjs";
import { ArrowDown, Eye, EyeClosed, Filter, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";


export default function NewSetModal() {

    const { user } = useUser()
        
    const {setCurrentSet} = useManagerPersistentStore()
    const {newSetUI, toggleNewSetUI} = useManagerNonPersistentStore()
        
    const [isSubmitting, setIsSubmitting] = useState(false)
    
    const [newSetTitle, setNewSetTitle] = useState("");
    const [newSetDescription, setNewSetDescription] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    // const newSetUserId = user?.id; // TODO: Uncomment for prod
    const newSetUserId = "userId";
    const cards = [];
    const date_created = new Date();
    const number_cards = 0;
    const study_count = 0
    const rating = 0
    const review_count = 0
    
    const clearNewSetForm = () => {
        setNewSetTitle("");
        setNewSetDescription("");
        setCategory("");
        setTags([]);
        setIsPrivate(false);
    }

    const onNewSetSubmit = async () => {
        setIsSubmitting(true)
        try {
            await createNewSet(
                newSetTitle, 
                newSetDescription, 
                isPrivate, 
                date_created, 
                number_cards, 
                newSetUserId, 
                cards,
                tags,
                category,
                study_count,
                rating,
                review_count
            );
            console.log(date_created)
            const result = await getSetByTitle(newSetUserId, newSetTitle)
            setCurrentSet(result?.[0])
            toggleNewSetUI(false);
            clearNewSetForm();
        } finally {
            setIsSubmitting(false)
        }
    }
    
    return (
        <>
        {newSetUI && (
            <>
            {/* Backdrop overlay */}
            <div className="fixed inset-0 bg-black/3 backdrop-blur-sm z-30" onClick={() => toggleNewSetUI(false)}></div>
            
            <div 
                className="
                    absolute z-40 overflow-y-auto
                    h-[calc(100vh)-60px]
                    md:inset-auto md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 md:overflow-visible
                "
            >
                <div className="new-set-btn-pop-up z-50 flex flex-col justify-between gap-6 px-4 py-3 md:p-7 w-screen md:w-[555px] h-fit md:h-fit bg-[#1e1e1e] transition-all duration-[0.2s] mt-1 md:border-1">
                    
                    {/* Form content */}
                    <div className="flex flex-col gap-3">
                        <div>
                            <h1 className="font-bold text-[18px] md:text-[22px]">Create New Set</h1>
                            <p className="text-[#8c8c8c] text-[14px] md:text-[16px]">Create a new set to organize your flashcards.</p>
                        </div>
                        
                        <div className="flex flex-col gap-1">
                            <h2 className="text-[16px] md:text-[20px]">Set Title</h2>
                            <input 
                                className="px-2 py-1 border-[1px] border-[#8c8c8c] rounded-[5px] hover-animation focus:outline-1"
                                onChange={(e) => setNewSetTitle(e.target.value)}
                            ></input>
                        </div>

                        <div className="flex flex-col gap-1">
                            <h2 className="text-[16px] md:text-[20px]">Set Description (optional)</h2>
                            <textarea 
                                className="set-desc-text-area px-2 py-1 w-full resize-y h-[100px] md:h-[150px] border-[1px] focus:outline-1 border-[#8c8c8c] rounded-[5px] hover-animation"
                                value={newSetDescription}
                                onChange={(e) => {
                                    setNewSetDescription(e.target.value)
                                }}
                            ></textarea>
                        </div>
                    </div>

                    {/* Set settings */}
                    <div className="flex flex-col gap-5 w-full items-start">
                        <form className="flex flex-col gap-1">
                            <label>Select a Category:</label>
                            <div className="relative ">
                                <select 
                                    className="text-white cursor-pointer rounded px-3 py-2 appearance-none focus:outline-1 border-[#8c8c8c] border w-full"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}    
                                >
                                    <option value={"no-category-selected"}>All Categories</option>
                                    <option value={"Languages & Literature"}>Languages & Literature</option>
                                    <option value={"Mathematics & Statistics"}>Mathematics & Statistics</option>
                                    <option value={"Natural Sciences"}>Natural Sciences</option>
                                    <option value={"Social Sciences"}>Social Sciences</option>
                                    <option value={"History & Geography"}>History & Geography</option>
                                    <option value={"Medicine & Health"}>Medicine & Health</option>
                                    <option value={"Technology & Engineering"}>Technology & Engineering</option>
                                    <option value={"Arts & Design"}>Arts & Design</option>
                                    <option value={"Business & Economics"}>Business & Economics</option>
                                    <option value={"Philosophy & Religion"}>Philosophy & Religion</option>
                                    <option value={"Psychology & Mental Health"}>Psychology & Mental Health</option>
                                    <option value={"Law & Government"}>Law & Government</option>
                                    <option value={"Sports & Fitness"}>Sports & Fitness</option>
                                    <option value={"General Knowledge"}>General Knowledge</option>
                                </select>
                                <ArrowDown className="absolute right-[15px] top-1/2 transform -translate-y-1/2 h-4 w-4 text-white"/>
                            </div>
                        </form>

                        <div className="rounded flex flex-col w-fit">
                            <label className="mb-1 text-gray-500 text-sm">Add specific tags to describe your set contents</label>
                            <span className="mb-2 text-gray-400 text-xs italic">e.g., Chinese, Calculus, Asian Countries</span>
                            <div className="flex flex-col gap-3 md:flex-row">
                                <input 
                                    className="set-desc-text-area px-2 py-1 w-full resize-y h-[35px] focus:outline-1 border-[1px] border-[#8c8c8c] rounded-[5px] hover-animation"
                                    value={currentTag}
                                    placeholder="Enter a tag..."
                                    onChange={(e) => setCurrentTag(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key == 'Enter' && currentTag.trim()) {
                                            console.log("Enter pressed")
                                            setTags([...tags, currentTag])
                                            setCurrentTag('')
                                        }
                                    }}
                                ></input>
                                <button
                                    className="flex justify-center cursor-pointer items-center w-[95px] md:w-[125px] h-[35px] py-1 bg-[#D9D9D9]/3 font-semibold text-[14px] rounded-[5px] border-1 border-[#828282] hover-animation"
                                    onClick={() => setTags([])}
                                >
                                    Clear Tags
                                </button>
                            </div>
                            {tags.length > 0 && (
                                <div className="w-fit flex flex-wrap gap-2 border mt-3 md:mt-4 border-[#8c8c8c] p-2 rounded-sm">
                                    {tags.map((tag, key) => (
                                        <div
                                            key={key}
                                            className="inline-flex items-center gap-2 cursor-pointer bg-[#D9D9D9]/3 text-white px-3 py-1 rounded-[4px] text-sm"
                                            onClick={() => setTags(tags.filter((_, index) => index !== key))}
                                        >   
                                            <X 
                                                className="h-3 w-3 cursor-pointer hover:text-gray-300 flex-shrink-0"
                                            />
                                            <span className="">{tag}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center">
                            <label className="pr-2">Visibility:</label>
                            {/* Visibility: public shows open eye, private shows crossed eye */}
                            <button 
                                className="flex justify-center cursor-pointer items-center w-[50] h-[35px] md:w-[45px] md:h-[35px] py-1 bg-[#D9D9D9] text-[#141414] font-bold rounded-[5px] border-1 border-[#828282] hover-animation-secondary"
                                onClick={() => {setIsPrivate(!isPrivate); toast(`Set is now ${isPrivate ? "private" : "public"}`)}}
                            >
                                {isPrivate ? 
                                    <div className="flex items-center justify-center">
                                        <Eye className="h-6"/>
                                    </div> 
                                    : 
                                    <div className="flex items-center justify-center">
                                        <EyeClosed className="h-6"/>
                                    </div>
                                }
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <button 
                                className="flex justify-center cursor-pointer items-center w-[95px] md:w-[125px] h-[35px] md:h-[40px] py-1 bg-[#D9D9D9]/3 font-bold rounded-[5px] border-1 border-[#828282] hover-animation"
                                onClick={() => {
                                    toggleNewSetUI(false);
                                    clearNewSetForm();
                                }}
                            >Cancel</button>

                            <button 
                                className="flex justify-center cursor-pointer items-center w-[95px] md:w-[125px] h-[35px] md:h-[40px] py-1 bg-[#D9D9D9] text-[#141414] font-bold rounded-[5px] border-1 border-[#828282] hover-animation-secondary"
                                disabled={isSubmitting}
                                onClick={() => {

                                    if (newSetTitle == "") {
                                        toast('Please enter a title')
                                    } else if (category == "All Categories") {
                                        toast('Please select a category')
                                    } else if (tags.length < 1) {
                                        toast('Please enter at least 1 tags')
                                    }
                                    else { 
                                        onNewSetSubmit()
                                    }
                                }}
                            >{isSubmitting ? "Saving..." : "Save"}</button>
                        </div>
                    </div>
                </div>
            </div>
            </>
        )}

        </>
    )
}