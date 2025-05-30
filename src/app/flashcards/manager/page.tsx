'use client'

import SetSelectionSection from "@/components/createPageComponents/SetSelectionSection"
import { useEffect, useState } from "react"
import { useCreateStore } from "@/app/stores/createStores"
import { addOneCardToSet, deleteCardById, getSetById, updateCardCount, updateCardData } from "@/lib/dbFunctions"
import { Trash2, Edit, PlusCircle, Save, ArrowUp, Trash2Icon } from "lucide-react"
import { toast as sonnerToast } from 'sonner';
import Image from "next/image"

function toast(toast: Omit<ToastProps, 'id'>) {
    return sonnerToast.custom((id) => (
        <Toast
            title={toast.title}
        />
    ));
}

function Toast(props: ToastProps) {
    const { title } = props;
   
    return (
        <div className="flex rounded-lg bg-white shadow-lg ring-1 ring-black/5 w-full md:max-w-[364px] items-center p-4">
            <div className="flex flex-1 items-center">
                <div className="w-full">
                    <p className="text-sm font-medium text-gray-900">{title}</p>
                </div>
            </div>
        </div>
    );
}

export default function Create() {
    const { 
        active, 
        updatingCard,
        setUpdatingCard,
        currentSet,
        setCurrentSet,
        setActive, 
        setSets, 
        setDropDownIsOpen, 
    } = useCreateStore()

    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("http://localhost:3000/api/my-sets", {
                method: "GET",
                headers: { "Content-Type": "application/json", "Access-Control-Allow-Methods": "*", "Access-Control-Allow-Origin": "*" }
            });
            const data = await res.json();
            setSets(data.Sets);
        }

        fetchData();
    }, []);
    
    // Current Card Data
    const [currentCardData, setCurrentCardData] = useState([1, 0, 'Category', 'Front', 'Back', '']);
    const updateCard = (index: number, value: string) => {
        const updatedCard = [...currentCardData]
        updatedCard[index] = value;
        setCurrentCardData(updatedCard);
    };

    const clearCurrentCardData = () => {
        const updatedCard = [...currentCardData]
        updatedCard[2] = 'Category';
        updatedCard[3] = 'Front';
        updatedCard[4] = 'Back';
        setCurrentCardData(updatedCard);
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

    const handleAddCard = async (data: [number, number, string, string, string, string]) => {
        const [
            ,
            ,
            category, 
            front, 
            back, 
            ,
        ] = data;

        updateCurrentSet(currentSet.id)
        const fileName = file.name
        const currentSetId = currentSet.id
        const cardId = currentSet.cards.length
        
        currentCardData[0] = currentSetId
        currentCardData[1] = cardId
        currentCardData[2] = "Category"
        currentCardData[3] = "Front"
        currentCardData[4] = "Back"
        currentCardData[4] = ""
        
        if (!currentSetId) {
            console.warn("No set selected.");
            return;
        }
        
        await addOneCardToSet(
            currentSetId,
            cardId,
            category, 
            front, 
            back, 
            fileName,
        );
        
        const updatedSet = await getSetById(currentSetId);
        setCurrentSet(updatedSet[0])

        await updateCardCount(currentSetId, updatedSet[0].cards.length)
        await updateCurrentSet(currentSetId)

        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch(`/api/image-upload?setID=${currentSetId}&cardID=${cardId}`, {
                method: "POST",
                body: formData,
            })

            const data = await response.json()
            console.log(data)
        } catch(error) {
            console.log(error)
        }

        clearCurrentImage()
    };   

    const updateCurrentSet = async (id: number) => {
        const updatedSet = await getSetById(id)
        setCurrentSet(updatedSet[0])
    }

    const handleCardDelete = async (setId: number, cardId: number) => {
        await deleteCardById(setId, cardId)
        updateCurrentSet(setId)
    }

    const handleEditCardBtnPress = async (setId: number, cardId: number, category: string, front: string, back: string, fileName: string) => {  
        setCurrentCardData([setId, cardId, category, front, back, fileName])
        console.log(fileName)
        setActive("create")
        setUpdatingCard(true)
        if (fileName) {
            const imageUrl = await fetchSignedImageUrl(setId, cardId, fileName)
            setImagePreview(imageUrl)
        } else {
            setImagePreview(null)
        }
    }

    const fetchSignedImageUrl = async (setId: number, cardId: number, fileName: string) => {
        const res = await fetch(`/api/get-image?setId=${setId}&cardId=${cardId}&fileName=${fileName}`);
        const data = await res.json();
        return data.url;
    };

    const handleUpdateCard = async (data: [number, number, string, string, string, string]) => {
        const [setId, cardId, category, front, back, fileName] = data 

        await updateCardData(setId, cardId, category, front, back, fileName)
        setUpdatingCard(false)
        setActive("manage")
        clearCurrentCardData()
        updateCurrentSet(setId)
    }


    const handleFileChange = (e) => {
        const selectedImage = e.target.files[0]
        if (selectedImage) {
            setFile(selectedImage)
            const imageURL = URL.createObjectURL(selectedImage);
            setImagePreview(imageURL)
            console.log("monkey:", imagePreview)
        }
    };

    const clearCurrentImage = () => {
        setImagePreview(null);
        setFile(null)
    }
    
    return (
        <section className="flex flex-col items-center pt-[35px] pb-[65px] font-(family-name:inter) force-scrollbar">

            {/* Title */}
            <div className="flex flex-col items-center pt-[40px] pb-15 md:px-[60px] md:pt-[80px]">
                <h1 className="text-[20px] sm:text-[22px] md:text-3xl lg:text-4xl font-bold ">Set Manager</h1>
                <p className="text-[12px] sm:text-md md:text-2xl lg:text-3xl pt-1 text-center">Create, organize, and manage your sets!</p>   
            </div>      


            <SetSelectionSection/>


            {/* Nav -> Create Card / Manage Cards */}
            <div className="
                flex items-center gap-2  p-2 
                mt-3 md:mt-4 
                w-[calc(100vw-20px)] max-w-[400px] md:max-w-[1150px] h-[40px] md:h-[65px] bg-[#D9D9D9]/3 rounded md:rounded-[5px]">
                <button 
                    className={`flex justify-center cursor-pointer items-center w-full h-[30px] md:h-[50px] py-1 px-3 font-bold text-[14px] md:text-xl rounded-[5px] hover-animation ${active == "create" ? "bg-[#D9D9D9]/3" : ""}`}
                    onClick={() => setActive("create")}
                    >
                    Create Card
                </button>
                
                <button 
                    className={`flex justify-center cursor-pointer items-center w-full h-[30px] md:h-[50px] py-1 px-3 font-bold text-[14px] md:text-xl rounded-[5px] hover-animation ${active == "manage" ? "bg-[#D9D9D9]/3" : ""}`}
                    onClick={() => setActive("manage")}
                    >

                    Manage Cards
                </button>
            </div>            



            {/* Create Flashcard / Preview Section */}
            {active == "create" && (
                <div className="flex md:flex-row flex-col mt-3 md:mt-4 w-[calc(100vw-20px)] max-w-[400px] md:max-w-[1150px] ">
                    <div className="md:w-[565px] bg-[#D9D9D9]/3 rounded md:rounded-[5px] py-3 px-4
                    ">
                        <h1 className="font-bold text-[16px] md:text-2xl pb-3 md:pb-4">Create New Card</h1>


                        <h2 className="text-[12px] md:text-[16px] pb-1 md:pb-2 font-semibold">Category (optional)</h2>
                        <input className="text-[12px] md:text-[16px] px-2 py-1 mb-3 w-full border-[1px] border-[#8c8c8c] rounded-[5px] hover-animation"
                            value={currentCardData[2] == "Category" ? '' : currentCardData[2]}
                            onChange={(e) => updateCard(2, e.target.value)}
                            placeholder="e.g., Vocab, Grammar, Math, Science, etc..."
                        ></input>

                        
                        <h2 className="text-[12px] md:text-[16px] pb-1 md:pb-2 font-semibold">Front Side</h2>
                        <textarea className="text-[12px] md:text-[16px] mb-3 px-2 py-1 w-full resize-y h-[100px] md:h-[150px] border-[1px] border-[#8c8c8c] rounded-[5px] transition-colors duration-200 hover:bg-[#323232]"
                            value={currentCardData[3] == "Front" ? '' : currentCardData[3]}
                            onChange={(e) => updateCard(3, e.target.value)}
                            placeholder="Enter a question or term"
                        ></textarea>

                        
                        <h2 className="text-[12px] md:text-[16px] pb-1 md:pb-2 font-semibold">Back Side</h2>
                        <textarea className="text-[12px] md:text-[16px] mb-3 px-2 py-1 w-full resize-y h-[100px] md:h-[150px] border-[1px] border-[#8c8c8c] rounded-[5px] transition-colors duration-200 hover:bg-[#323232]"
                            value={currentCardData[4] == "Back" ? '' : currentCardData[4]}
                            onChange={(e) => updateCard(4, e.target.value)}
                            placeholder="Enter a question or term"
                        ></textarea>

                        
                        <h2 className="text-[12px] md:text-[16px] pb-1 font-semibold">Back Side Image (Optional)</h2>
                        <h2 className="text-[12px] md:text-[16px] pb-1 ">Image URL:</h2>
                        <input className="text-[12px] md:text-[16px] px-2 py-1 mb-3 w-full border-[1px] border-[#8c8c8c] rounded-[5px] hover-animation"
                            placeholder="https://example.com/image.jpg"
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

                        {imagePreview && (
                            <div className="flex justify-between mt-4">  
                                <Image
                                    src={imagePreview}
                                    alt="Preview"
                                    width={200}
                                    height={200}
                                    className="w-full max-w-xs h-40 object-cover rounded border-1 border-[#8c8c8c]"
                                />

                                <Trash2Icon 
                                    className="bg-red-900 p-[8px] rounded-sm cursor-pointer" 
                                    width={35} height={35}
                                    onClick={clearCurrentImage}    
                                />
                            </div>
                        )}

                        <div className="flex gap-2 w-full max-w-[600px] mb-1 mt-4">
                            <button 
                                className="flex gap-2 justify-center cursor-pointer bg-[#D9D9D9] text-[#0F0F0F] items-center grow-[356] h-[33px] md:h-[45px] py-1 px-3 font-bold text-[14px] md:text-xl rounded-[5px] hover-animation-secondary"
                                onClick={() => {
                                    if (updatingCard) {
                                        handleUpdateCard(currentCardData)
                                    } else {
                                        if (currentCardData[3] == "Front") {
                                            toast({title: "Enter a value for the front of the card."})
                                        } else if (currentCardData[4] == "Back") {
                                            toast({title:  "Enter a value for the back of the card."})
                                        } else {handleAddCard(currentCardData)} 
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
                                <h2 className="pl-3 py-2">{currentCardData[2] == "" ? "Category" : currentCardData[2]}</h2>
                                <div className="flex justify-center items-center h-[calc(100%-80px)]">{currentCardData[3]}</div>
                            </div>

                            {/* back */}
                            <div className="flip-face back absolute top-0 left-0 w-full h-full bg-[#D9D9D9]/6 rounded md:rounded-[5px] hover-animation">
                                <h2 className="pl-3 py-2">{currentCardData[2] == "" ? "Category" : currentCardData[2]}</h2>
                                <div className="flex justify-center items-center h-[calc(100%-80px)] gap-[16px] text-sm lg:text-lg">
                                    <div className="w-[50%] flex justify-center">{currentCardData[4]}</div>
                                    {imagePreview && (
                                        <div className="flex justify-center items-center">  
                                            <Image
                                                src={imagePreview}
                                                alt="Preview"
                                                width={200}
                                                height={200}
                                                className="w-full md:max-w-[100px] md:h-[100px] lg:max-w-[160px] lg:h-[160px] object-cover rounded border-1 border-[#8c8c8c]"
                                            />
                                        </div>
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
                <div className="w-[calc(100vw-20px)] max-w-[1150px] min-h-[350px] mt-3 rounded md:rounded-[5px] border border-[#8c8c8c] mx-auto px-1">

                    {currentSet.cards && currentSet.cards.length == 0 ? (
                        <div className="flex flex-col items-center justify-center">
                            <h1 className="pb-2 text-2xl font-bold">No cards in this set yet</h1>
                            <h1 className="pb-5 text-xl">Create your first card to begin</h1>
                            <button 
                                className="flex cursor-pointer justify-center items-center w-[150px] gap-2 h-[40px] py-1 px-3 bg-[#D9D9D9]/3 rounded-[5px] border-1 border-[#828282] hover:bg-[#474747] transition-colors duration-200"
                                onClick={() => setActive("create")}
                            ><PlusCircle height={18}/> Create Card</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-[15px] p-1 py-2 w-full">
                            {currentSet.cards && currentSet.cards.map((card, id: number) => (
                                <div
                                    key={id}
                                    className="w-full h-fit md:h-[140px] bg-[#D9D9D9]/3 rounded md:rounded-[5px] flex flex-col"
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
                                                            handleCardDelete(currentSet.id, card.cardId)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="h-full flex pt-[20px] md:pt-[40px] pl-2">
                                            <h1 className="text-[12px] md:text-lg font-semibold">{card.front}</h1>
                                        </div>
                                    </div>


                                    <div className="w-full h-auto py-1 flex text-left bg-[#dddddd] rounded-b-[5px]">
                                        <h1 className="text-[12px] md:text-lg font-semibold whitespace-nowrap w-full truncate text-[#474747] pl-2">{card.back}</h1>
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