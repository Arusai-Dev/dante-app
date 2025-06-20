import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type createStoreState = {
    active: string
    updatingCard: boolean
    sets: any[]
    currentSet: any
    dropDownIsOpen: boolean
    currentSelectedImage: any
    currentSetImages: any
    currentCardData: {
        setId: number | null
        cardId: number | null
        category: string
        front: string
        back: string
        fileName: string
        // due: number
        // reps: number
        // state: number
        // lapses: number
        // stability: number
        // difficulty: number
        // elapsed_day: number
        // scheduled_days: number
        // last_review: number | null
    }
    imageCropUi: boolean
    containsImages: boolean
    originalImageUrl: string
    originalFile: any
    croppedFile: any
    previousFile: any
    setActive: (mode: string) => void
    setUpdatingCard: (mode: boolean) => void
    setSets: (data: any[]) => void
    setCurrentSet: (data: any) => void
    setDropDownIsOpen: (mode: boolean) => void
    setCurrentSelectedImage: (mode: any) => void
    setCurrentSetImages: (data: any) => void
    setCurrentCardData: (data: any) => void
    setImageCropUI: (mode: boolean) => void 
    setContainsImages: (mode: boolean) => void 
    setOriginalImageUrl: (mode: string) => void 
    setOriginalFile: (data: any) => void
    setCroppedFile: (data: any) => void
    setPreviousFile: (data: any) => void
    updateCurrentCardData: (key: string, value: any) => void
    clearCurrentCardData: () => void
}

export const useCreateStore = create(
    persist<createStoreState>(
        (set, get) => ({
            active: 'create',
            updatingCard: false,
            sets: [],
            currentSet: [],
            dropDownIsOpen: false,
            currentSelectedImage: "",
            currentSetImages: [],
            currentCardData: {
                setId: null, 
                cardId: null, 
                category: 'Category', 
                front: 'Front', 
                back: 'Back', 
                fileName: '',
                // due: 0,
                // reps: 0,
                // state: 0,
                // lapses: 0,
                // stability: 0,
                // difficulty: 0,
                // elapsed_day: 0,
                // scheduled_days: 0,
                // last_review: null,
            },
            imageCropUi: false,
            containsImages: false,
            originalImageUrl: "",
            originalFile: {},
            croppedFile: {},
            previousFile: {},
            setActive: (mode) => set({ active: mode }),
            setUpdatingCard: (mode) => set({ updatingCard: mode }),
            setSets: (data) => set({ sets: data }),
            setCurrentSet: (data) => set({ currentSet: data }),
            setDropDownIsOpen: (mode) => set({ dropDownIsOpen: mode }),
            setCurrentSelectedImage: (mode) => set({ currentSelectedImage: mode }),
            setCurrentSetImages: (data) => set({ currentSetImages: data }),
            setCurrentCardData: (data) => set({ currentCardData: data }),
            setImageCropUI: (mode) => set({ imageCropUi: mode}),
            setContainsImages: (mode) => set({ containsImages: mode}),
            setOriginalImageUrl: (mode) => set({ originalImageUrl: mode}),
            setOriginalFile: (data) => set({ originalFile: data }),
            setCroppedFile: (data) => set({ croppedFile: data }),
            setPreviousFile: (data) => set({ file: data }),
            updateCurrentCardData: (key, value) => set({
                currentCardData: {
                    ...get().currentCardData,
                    [key]: value
                }
            }),
            clearCurrentCardData: () => {
                set({
                    currentCardData: {
                        setId: null,
                        cardId: null,
                        category: 'Category',
                        front: 'Front',
                        back: 'Back',
                        fileName: '',
                        // due: 0,
                        // reps: 0,
                        // state: 0,
                        // lapses: 0,
                        // stability: 0,
                        // difficulty: 0,
                        // elapsed_day: 0,
                        // scheduled_days: 0,
                        // last_review: null,
                    }
                })
            }
        }),
        {
            name: 'create-storage', 
            storage: createJSONStorage(() => localStorage), 
        },
    )
)