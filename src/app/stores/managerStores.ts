import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type persistentState = {
    updatingCard: boolean
    sets: unknown[]
    currentSet: unknown
    currentSelectedImageUrl: unknown
    currentSetImages: unknown
    currentCardData: {
        setId: number | null
        cardId: number | null
        category: string
        front: string
        back: string
        originalFileName: string
        croppedFileName: string
    }
    containsImages: boolean
    originalImageUrl: string
    croppedImageUrl: string
    originalFile: unknown
    croppedFile: unknown
    previousFile: unknown
    setUpdatingCard: (mode: boolean) => void
    setSets: (data: unknown[]) => void
    setCurrentSet: (data: unknown) => void
    setCurrentSelectedImageUrl: (mode: unknown) => void
    setCurrentSetImages: (data: unknown) => void
    setCurrentCardData: (data: unknown) => void
    setContainsImages: (mode: boolean) => void 
    setOriginalImageUrl: (mode: string) => void 
    setCroppedImageUrl: (mode: string) => void 
    setOriginalFile: (data: unknown) => void
    setCroppedFile: (data: unknown) => void
    setPreviousFile: (data: unknown) => void
    updateCurrentCardData: (key: string, value: unknown) => void
    clearCurrentCardData: () => void
}

type nonPersistentState = {
    active: string
    setActive: (mode: string) => void
    newSetUI: boolean
    toggleNewSetUI: (mode: boolean) => void
    imageCropUI: boolean
    setImageCropUI: (mode: boolean) => void 
    loading: boolean
    setLoading: (mode: boolean) => void
}

export const useManagerPersistentStore = create(
    persist<persistentState>(
        (set, get) => ({
            updatingCard: false,
            sets: [],
            currentSet: [],
            currentSelectedImageUrl: "",
            currentSetImages: [],
            currentCardData: {
                setId: null, 
                cardId: null, 
                category: 'Category', 
                front: 'Front', 
                back: 'Back', 
                originalFileName: '',
                croppedFileName: '',
            },
            containsImages: false,
            originalImageUrl: "",
            croppedImageUrl: "",
            originalFile: {},
            croppedFile: {},
            previousFile: {},
            setUpdatingCard: (mode) => set({ updatingCard: mode }),
            setSets: (data) => set({ sets: data }),
            setCurrentSet: (data) => set({ currentSet: data }),
            setCurrentSelectedImageUrl: (mode) => set({ currentSelectedImageUrl: mode }),
            setCurrentSetImages: (data) => set({ currentSetImages: data }),
            setCurrentCardData: (data) => set({ currentCardData: data }),
            setContainsImages: (mode) => set({ containsImages: mode}),
            setOriginalImageUrl: (mode) => set({ originalImageUrl: mode}),
            setCroppedImageUrl: (mode) => set({ croppedImageUrl: mode}),
            setOriginalFile: (data) => set({ originalFile: data }),
            setCroppedFile: (data) => set({ croppedFile: data }),
            setPreviousFile: (data) => set({ previousFile: data }),
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
                        originalFileName: '',
                        croppedFileName: '',
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
                    originalFile: null,
                    croppedFile: null,
                    previousFile: null,
                    croppedImageUrl: "",
                    originalImageUrl: "",
                    currentSelectedImageUrl: "",
                })
            }
        }),
        {
            name: 'manager-storage', 
            storage: createJSONStorage(() => localStorage), 
        },
    )
)


export const useManagerNonPersistentStore = create<nonPersistentState>((set) => ({
    active: 'create',  
    setActive: (mode) => set({ active: mode }),
    newSetUI: false,
    toggleNewSetUI: (mode) => set({ newSetUI: mode}),
    imageCropUI: false,
    setImageCropUI: (mode) => set({ imageCropUI: mode}),
    loading: false,
    setLoading: (mode) => set({ loading: mode }),
}))