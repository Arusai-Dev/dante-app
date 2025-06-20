'use client'

import { useEffect, useState } from "react"
import { Trash2, Edit, PlusCircle, Save, ArrowUp, Trash2Icon } from "lucide-react"
import { useCreateStore } from "@/app/stores/createStores"
import SetSelectionSection from "@/components/SetSelectionSection"
import ImageCropper from "@/components/ImageCropper"
import { fieldMissingModal } from "@/components/modals/fieldMissingModal"
import { handleImageUrlInput, handleFileChange, clearCurrentImage } from "@/app/hooks/cardHooks/useImageHandlers"
import { updateSetImagesMap } from "@/app/hooks/cardHooks/useSetHandlers"
import { handleAddCard, handleCardDelete, handleUpdateCard } from "@/app/hooks/cardHooks/useCardHandlers"


export default function Create() {
    // Todo:
    // 1. when crop is pressed check if originalImgUrl exists /
    // 2. If not: store current url /
    // 3. then: create new blob url of cropped img /
    // 4. when card is added or updated, pass originalImgUrl and croppedImgUrl to card json /
    // 5. upload originalImg and croppedImg to s3 for storing /
    // 6. whenever a card is being edited and edit img btn is pressed, show originalImgUrl instead of croppedImgUrl

    const { 
        updatingCard,
        setUpdatingCard,
        currentSet,
        currentSelectedImage,
        setCurrentSelectedImage,
        currentSetImages,
        currentCardData,
        setCurrentCardData,
        setImageCropUI,
        setSets, 
        setDropDownIsOpen, 
    } = useCreateStore()

    const [active, setActive] = useState<string>("create");
    const [loading, setLoading] = useState<boolean>(true);
    const [previousFileName, setPreviousFileName] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("http://localhost:3000/api/my-sets", {
                method: "GET",
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Methods": "*", "Access-Control-Allow-Origin": "*" }
            });
            const data = await res.json();
            setSets(data.Sets);

            await updateSetImagesMap(currentSet.id)
        }

        fetchData();
    }, []);

    const updateCard = useCreateStore(state => state.updateCurrentCardData)
    const clearCard = useCreateStore(state => state.clearCurrentCardData)
    const clearCurrentCardData = () => {
        clearCard()
        setCurrentSelectedImage("")
    }

    // Preview Card
    const [showFront, setShowFront] = useState(true);
    const flipCard = () => {
        setShowFront(!showFront);
    }

    // Closes any open UI
    const closeAnyUi = (e: MouseEvent) => {
        const target = e.target as HTMLElement; 
        if (!target.closest(".select-set-dd")) {setDropDownIsOpen(false)}
    }

    useEffect(() => {
        document.addEventListener('click', closeAnyUi);

        return () => {
            document.removeEventListener('click', closeAnyUi);
        };
    }, []);

    const handleEditCardBtnPress = async (
        setId: number,
        cardId: number,
        category: string,
        front: string,
        back: string,
        fileName: string,
    ) => {  
        setCurrentCardData({
            setId: setId,
            cardId: cardId,
            category: category,
            front: front,
            back: back,
            fileName: fileName,
        })

        setPreviousFileName(fileName);
        setActive("create")
        setCurrentSelectedImage(currentSetImages[cardId])
        setUpdatingCard(true)
    }  

    return (
        <section className="flex flex-col items-center pt-[45px] pb-[65px] font-(family-name:inter) force-scrollbar">
            
            {/* Title */}
            <div className="flex flex-col w-[calc(100vw-20px)] max-w-[400px] md:max-w-[1150px] items-left pt-[40px]">
                <h1 className="text-[20px] sm:text-lg md:text-2xl lg:text-3xl font-bold">Set Manager</h1>
                <p className="text-[12px] sm:text-md md:text-xl lg:text-2xl pt-1">Create, organize, and manage your sets!</p>   
            </div>      


            <SetSelectionSection/>


            {/* Nav -> Create Card / Manage Cards */}
            <div className="
                flex items-center py-2 bg-[#D9D9D9]/3 
                gap-1 md:gap-2
                px-1 md:px-2
                mt-3 md:mt-4 
                w-[calc(100vw-20px)] max-w-[400px] md:max-w-[1150px] h-[40px] md:h-[65px] rounded md:rounded-[5px]">
                <button 
                    className={`flex justify-center cursor-pointer items-center w-full h-[30px] md:h-[50px] py-1 px-3 font-bold text-[14px] md:text-xl rounded-[5px] hover-animation ${active == "create" ? "bg-[#D9D9D9]/3" : ""}`}
                    onClick={() => {
                        setActive("create")
                        setLoading(true)
                    }}
                    >
                    Create Card
                </button>
                
                <button 
                    className={`flex justify-center cursor-pointer items-center w-full h-[30px] md:h-[50px] py-1 px-3 font-bold text-[14px] md:text-xl rounded-[5px] hover-animation ${active == "manage" ? "bg-[#D9D9D9]/3" : ""}`}
                    onClick={async () =>  {
                        setActive("manage")
                        setLoading(false)
                        updateSetImagesMap(currentSet.id)
                    }}
                    >

                    Manage Cards
                </button>
            </div>            
            
            
            {/* Create Flashcard / Preview Section */}
            {active == "create" && (
                <div className="flex md:flex-row flex-col mt-3 md:mt-4 w-[calc(100vw-20px)] max-w-[400px] md:max-w-[1150px] ">
                    <div className="md:w-[565px] bg-[#D9D9D9]/3 rounded md:rounded-[5px] py-3 px-4">
                        <h1 className="font-bold text-[16px] md:text-2xl pb-3 md:pb-4">Create New Card</h1>


                        <h2 className="text-[12px] md:text-[16px] pb-1 md:pb-2 font-semibold">Category (optional)</h2>
                        <input className="text-[12px] md:text-[16px] px-2 py-1 mb-3 w-full border-[1px] border-[#8c8c8c] rounded-[5px] hover-animation"
                            value={currentCardData["category"] == "Category" ? '' : currentCardData["category"]}
                            onChange={(e) => updateCard("category", e.target.value)}
                            placeholder="e.g., Vocab, Grammar, Math, Science, etc..."
                        ></input>

                        
                        <h2 className="text-[12px] md:text-[16px] pb-1 md:pb-2 font-semibold">Front Side</h2>
                        <textarea className="text-[12px] md:text-[16px] mb-3 px-2 py-1 w-full resize-y h-[100px] md:h-[150px] border-[1px] border-[#8c8c8c] rounded-[5px] transition-colors duration-200 hover:bg-[#323232]"
                            value={currentCardData["front"] == "Front" ? '' : currentCardData["front"]}
                            onChange={(e) => updateCard("front", e.target.value)}
                            placeholder="Enter a question or term"
                        ></textarea>

                        
                        <h2 className="text-[12px] md:text-[16px] pb-1 md:pb-2 font-semibold">Back Side</h2>
                        <textarea className="text-[12px] md:text-[16px] mb-3 px-2 py-1 w-full resize-y h-[100px] md:h-[150px] border-[1px] border-[#8c8c8c] rounded-[5px] transition-colors duration-200 hover:bg-[#323232]"
                            value={currentCardData["back"] == "Back" ? '' : currentCardData["back"]}
                            onChange={(e) => updateCard("back", e.target.value)}
                            placeholder="Enter a question or term"
                        ></textarea>

                        
                        <h2 className="text-[12px] md:text-[16px] pb-1 font-semibold">Back Side Image (Optional)</h2>
                        <h2 className="text-[12px] md:text-[16px] pb-1 ">Image URL:</h2>
                        <input className="text-[12px] md:text-[16px] px-2 py-1 mb-3 w-full border-[1px] border-[#8c8c8c] rounded-[5px] hover-animation"
                            placeholder="https://example.com/image.jpg"
                            onChange={handleImageUrlInput}
                        ></input>


                        <div className="flex items-center h-fit  gap-2">
                            <h2 className="text-[12px] md:text-[16px]">or</h2>
                            <label htmlFor="imageFile" className="inline-block px-3 py-1 bg-[#D9D9D9] text-sm font-semibold text-[#0F0F0F] rounded-[5px] cursor-pointer hover:bg-[#cbb88a] transition-colors duration-200">
                                <input
                                    id="imageFile"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                /> Upload Image
                            </label>
                        </div>

                        <ImageCropper/>
                        
                        {(currentSelectedImage || (updatingCard && currentSetImages[currentCardData["fileName"]])) && (
                            <div className="flex justify-between mt-4">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={currentSelectedImage || currentSetImages[currentCardData["fileName"]]}
                                    alt="Card preview"
                                    width={200}
                                    height={200}
                                    className="w-fit max-w-xs h-40 object-contain rounded border-1 border-[#8c8c8c]"
                                />
                                <div className="flex gap-2">
                                    <Edit 
                                        className="bg-white text-black p-[8px] rounded-sm cursor-pointer" 
                                        width={35} height={35}
                                        onClick={() => setImageCropUI(true)}   
                                    />
                                    <Trash2Icon 
                                        className="bg-red-900 p-[8px] rounded-sm cursor-pointer" 
                                        width={35} height={35}
                                        onClick={clearCurrentImage}    
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex gap-2 w-full max-w-[600px] mb-1 mt-4">
                            <button 
                                className="flex gap-2 justify-center cursor-pointer bg-[#D9D9D9] text-[#0F0F0F] items-center grow-[356] h-[33px] md:h-[45px] py-1 px-3 font-bold text-[14px] md:text-xl rounded-[5px] hover-animation-secondary"
                                onClick={() => {
                                    if (updatingCard) {
                                        handleUpdateCard(currentCardData)
                                    } else {
                                        if (currentCardData["front"] == "Front") {
                                            fieldMissingModal({title: "Enter a value for the front of the card."})
                                        } else if (currentCardData["back"] == "Back") {
                                            fieldMissingModal({title:  "Enter a value for the back of the card."})
                                        } else {handleAddCard()} 
                                    }
                                }}
                                >
                                <div className="flex items-center justify-center">
                                    <Save className="h-[16px] md:h-[20px] md:w-[20px]"/>
                                </div>
                                {updatingCard ? "Update Card" : "Add Card"}
                            </button>

                            <button 
                                className="flex justify-center cursor-pointer items-center grow-[165] h-[33px] md:h-[45px] py-1 px-3 font-bold text-[14px] md:text-xl rounded-[5px] hover-animation border-1 border-[#8c8c8c]"
                                onClick={() => {
                                    if (updatingCard) {
                                        setUpdatingCard(false);
                                        clearCurrentCardData();
                                      } else {
                                        clearCurrentCardData();
                                      }
                                }}
                                >
            
                                {updatingCard ? "Cancel" : "Clear"}

                            </button>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="
                        hidden md:block 
                        w-[580px] 
                        md:h-[565px] sm:h-[300px]
                        pl-4">
                        <h1 className="font-bold text-2xl pb-3">Preview</h1>

                        <div className={`relative w-full h-[255px] transition-transform duration-500 flip-inner cursor-pointer ${!showFront ? 'flipped' : ''}`} onClick={flipCard}>
                            
                            {/* front */}
                            <div className="flip-face front absolute top-0 left-0 w-full h-full bg-[#D9D9D9]/3 rounded md:rounded-[5px] hover-animation">
                                <h2 className="pl-3 py-2">{currentCardData["category"] == "" ? "Category" : currentCardData["category"]}</h2>
                                <div className="flex justify-center items-center h-[calc(100%-80px)]">{currentCardData["front"]}</div>
                            </div>

                            {/* back */}
                            <div className="flip-face back absolute top-0 left-0 w-full h-full bg-[#D9D9D9]/6 rounded md:rounded-[5px] hover-animation">
                                <h2 className="pl-3 py-2">{currentCardData["category"] == "" ? "Category" : currentCardData["category"]}</h2>
                                <div className="flex justify-center items-center h-[calc(100%-80px)] gap-[16px] text-sm lg:text-lg">
                                    <div className="w-[50%] flex justify-center">{currentCardData["back"]}</div>
                                    {(currentSelectedImage || (updatingCard && currentSetImages[currentCardData["fileName"]])) && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={currentSelectedImage || currentSetImages[currentCardData["fileName"]]}
                                            alt="Card preview"
                                            width={200}
                                            height={200}
                                            className="w-fit max-w-xs h-40 object-contain rounded border-1 border-[#8c8c8c]"
                                        />
                                    )}
                                </div>                                

                            </div>
                            
                        </div>

                        <div className="flex mt-1">
                            <h2>Click to rotate</h2>
                            <ArrowUp/>
                        </div>
                    </div>
                </div>
            )}
            
            
            {/* Manage Cards Section */}
            {active == "manage" && (
                <div className="w-[calc(100vw-20px)] max-w-[1150px] min-h-[fit] mt-3 rounded md:rounded-[5px] border border-[#8c8c8c] mx-auto px-1">

                    {currentSet.cards && currentSet.cards.length == 0 ? (
                        <div className="flex flex-col items-center justify-center p-4">
                            <h1 className="pb-2 text-2xl font-bold">No cards in this set yet</h1>
                            <h1 className="pb-5 text-xl">Create your first card to begin</h1>
                            <button 
                                className="flex cursor-pointer justify-center items-center w-[150px] gap-2 h-[40px] py-1 px-3 bg-[#D9D9D9]/3 rounded-[5px] border-1 border-[#828282] hover:bg-[#474747] transition-colors duration-200"
                                onClick={() => setActive("create")}
                            ><PlusCircle height={18}/> Create Card</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-5 p-1 py-2 h-fit">
                            {currentSet.cards && currentSet.cards.map((card, id: number) => (
                                <div
                                    key={id}
                                    className="w-full h-fit bg-[#D9D9D9]/3 rounded md:rounded-[5px] flex flex-col"
                                >

                                    <div className="h-full flex flex-col">
                                        <div className="flex justify-between pt-2 px-2">
                                            <h1 className="text-[8px] md:text-[12px] bg-amber-50 text-[#141414] px-3 py-[2px] font-semibold rounded-2xl ">
                                                {card.category == "Category" ? "N/A": card.category }
                                            </h1>
                                            <div className="flex gap-1 items-center">
                                                <div className="flex items-center justify-center ">
                                                    <Edit 
                                                        className="h-[16px] md:h-[20px] md:w-[20px] hover:text-purple-400 transition-colors duration-200"
                                                        onClick={() => {
                                                            handleEditCardBtnPress(currentSet.id, card.cardId, card.category, card.front, card.back, card.fileName)
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex items-center justify-center ">
                                                    <Trash2 
                                                        className="h-[16px] md:h-[20px] md:w-[20px] hover:text-purple-400 transition-colors duration-200"
                                                        onClick={() => {
                                                            handleCardDelete(currentSet.id, card.cardId, card.fileName)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="h-full flex pt-[20px] md:pt-[30px] pl-2">
                                            <h1 className="text-[12px] md:text-lg font-semibold">{card.front}</h1>
                                        </div>
                                    </div>


                                    <div className="w-full py-1 flex text-left bg-[#dddddd] rounded-b-[5px]">
                                        <h1 className={`text-[12px] md:text-lg font-semibold truncate w-full text-[#474747] px-2`}>{card.back}</h1>
                                        <div className="pr-1">
                                            {
                                                currentSetImages[card.cardId] ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                    src={currentSetImages[card.cardId]}
                                                    alt={card.fileName}
                                                    className={`w-[100px] md:w-[245px] aspect-square object-cover border border-[#b1b1b1] rounded-[5px] ${loading ? "hidden" : ""}`}
                                                    />
                                                ) : (
                                                    <div/>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>
                    )}
                </div>
            )}
        </section>
    )  
}