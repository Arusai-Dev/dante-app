import { useManagerPersistentStore, useManagerNonPersistentStore } from "@/app/stores/managerStores";
import { createNewSet, getSetByTitle } from "@/lib/dbFunctions";
import { Eye, EyeClosed, Filter, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";


export default function NewSetModal() {
        
    const {setCurrentSet} = useManagerPersistentStore()
    const {newSetUI, toggleNewSetUI} = useManagerNonPersistentStore()
        
    const clearNewSetForm = () => {
        setNewSetTitle("");
        setNewSetDescription("");
        setIsPrivate(false);
    }

    const [newSetTitle, setNewSetTitle] = useState("");
    const [newSetDescription, setNewSetDescription] = useState("");
    const [category, setCategory] = useState("");
    const [tags, setTags] = useState([]);
    const [currentTag, setCurrentTag] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const newSetUserId = "userid";
    const cards = [];
    const date_created = new Date();
    const number_cards = 0;
    const study_count = 0
    const rating = 0
    const review_count = 0

    const onNewSetSubmit = async () => {
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
    }

    // TODO: Things needed to be added to new-set-v2
    // 1. Category selection - Complete
    // 2. Tags section - 
    // 3. Change styling
    
    return (
        <>
        {newSetUI && (
            <>
            {/* Backdrop overlay */}
            <div className="fixed inset-0 bg-black/3 backdrop-blur-sm z-30" onClick={() => toggleNewSetUI(false)}></div>
            
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
                <div className="new-set-btn-pop-up z-50 flex flex-col justify-between gap-6 px-4 py-3 md:p-7 w-screen md:w-[555px] h-fit md:h-fit bg-[#1e1e1e] transition-all duration-[0.2s] border-1">
                    
                    {/* Form content */}
                    <div className="flex flex-col gap-3">
                        <div>
                            <h1 className="font-bold text-[18px] md:text-[22px]">Create New Set</h1>
                            <p className="text-[#8c8c8c] text-[14px] md:text-[16px]">Create a new set to organize your flashcards.</p>
                        </div>
                        
                        <div className="flex flex-col gap-1">
                            <h2 className="text-[16px] md:text-[20px]">Set Title</h2>
                            <input 
                                className="px-2 py-1 border-[1px] border-[#8c8c8c] rounded-[5px] hover-animation"
                                onChange={(e) => setNewSetTitle(e.target.value)}
                            ></input>
                        </div>

                        <div className="flex flex-col gap-1">
                            <h2 className="text-[16px] md:text-[20px]">Set Description (optional)</h2>
                            <textarea 
                                className="set-desc-text-area px-2 py-1 w-full resize-y h-[150px] border-[1px] border-[#8c8c8c] rounded-[5px] hover-animation"
                                value={newSetDescription}
                                onChange={(e) => {
                                    setNewSetDescription(e.target.value)
                                }}
                            ></textarea>
                        </div>
                    </div>

                    {/* Set settings */}
                    <div className="flex flex-col gap-5 w-full items-start">
                        <div className="relative border border-[#8c8c8c] rounded pr-4">
                            <Filter className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2  h-4"/>
                            <select 
                                className="text-white  rounded px-3 py-2 focus:outline-none focus:border-gray-400 pl-11"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}    
                            >
                                <option>All Categories</option>
                                <option>Languages & Literature</option>
                                <option>Mathematics & Statistics</option>
                                <option>Natural Sciences</option>
                                <option>Social Sciences</option>
                                <option>History & Geography</option>
                                <option>Medicine & Health</option>
                                <option>Technology & Engineering</option>
                                <option>Arts & Design</option>
                                <option>Business & Economics</option>
                                <option>Philosophy & Religion</option>
                                <option>Psychology & Mental Health</option>
                                <option>Law & Government</option>
                                <option>Sports & Fitness</option>
                                <option>General Knowledge</option>
                            </select>
                        </div>

                        <div className="rounded flex flex-col gap-3">
                            <input 
                                className="set-desc-text-area px-2 py-1 w-[300px] resize-y h-[35px] focus:outline-none border-[1px] border-[#8c8c8c] rounded-[5px] hover-animation"
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
                            {tags.length > 0 && (
                                <div className="w-fit flex flex-wrap gap-2 border border-[#8c8c8c] p-2 rounded-sm">
                                    {tags.map((tag, key) => (
                                        <div
                                            key={key}
                                            className="inline-flex items-center gap-2 bg-[#D9D9D9]/3 text-white px-3 py-1 rounded-[4px] text-sm"
                                        >
                                            <X 
                                                className="h-3 w-3 cursor-pointer hover:text-gray-300 flex-shrink-0"
                                                onClick={() => setTags(tags.filter((_, index) => index !== key))}
                                            />
                                            <span className="">{tag}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center">
                            <h1 className="font-semibold pr-2 text-sm lg:text-xl">Visibility:</h1>
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
                                onClick={() => {

                                    if (newSetTitle == "") {
                                        toast('Please enter a Title')
                                    } 
                                    else { 
                                        onNewSetSubmit()
                                    }
                                }}
                            >Save</button>
                        </div>
                    </div>
                </div>
            </div>
            </>
        )}

        </>
    )
}