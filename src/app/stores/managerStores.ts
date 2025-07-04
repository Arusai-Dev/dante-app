import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type managerStoreState = {
    active: string
    updatingCard: boolean
    sets: any[]
    currentSet: any
    currentSelectedImageUrl: any
    currentSetImages: any
    currentCardData: {
        setId: number | null
        cardId: number | null
        category: string
        front: string
        back: string
        originalFileName: string
        croppedFileName: string
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
    croppedImageUrl: string
    originalFile: any
    croppedFile: any
    previousFile: any
    loading: boolean
    setActive: (mode: string) => void
    setUpdatingCard: (mode: boolean) => void
    setSets: (data: any[]) => void
    setCurrentSet: (data: any) => void
    setCurrentSelectedImageUrl: (mode: any) => void
    setCurrentSetImages: (data: any) => void
    setCurrentCardData: (data: any) => void
    setImageCropUI: (mode: boolean) => void 
    setContainsImages: (mode: boolean) => void 
    setOriginalImageUrl: (mode: string) => void 
    setCroppedImageUrl: (mode: string) => void 
    setOriginalFile: (data: any) => void
    setCroppedFile: (data: any) => void
    setPreviousFile: (data: any) => void
    setLoading: (mode: boolean) => void
    updateCurrentCardData: (key: string, value: any) => void
    clearCurrentCardData: () => void
}

export const useManagerStore = create(
    persist<managerStoreState>(
        (set, get) => ({
            active: 'create',
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
            croppedImageUrl: "",
            originalFile: {},
            croppedFile: {},
            previousFile: {},
            loading: false,
            setActive: (mode) => set({ active: mode }),
            setUpdatingCard: (mode) => set({ updatingCard: mode }),
            setSets: (data) => set({ sets: data }),
            setCurrentSet: (data) => set({ currentSet: data }),
            setCurrentSelectedImageUrl: (mode) => set({ currentSelectedImageUrl: mode }),
            setCurrentSetImages: (data) => set({ currentSetImages: data }),
            setCurrentCardData: (data) => set({ currentCardData: data }),
            setImageCropUI: (mode) => set({ imageCropUi: mode}),
            setContainsImages: (mode) => set({ containsImages: mode}),
            setOriginalImageUrl: (mode) => set({ originalImageUrl: mode}),
            setCroppedImageUrl: (mode) => set({ croppedImageUrl: mode}),
            setOriginalFile: (data) => set({ originalFile: data }),
            setCroppedFile: (data) => set({ croppedFile: data }),
            setPreviousFile: (data) => set({ previousFile: data }),
            setLoading: (mode) => set({ loading: mode }),
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
                    croppedFile: null
                })
            }
        }),
        {
            name: 'manager-storage', 
            storage: createJSONStorage(() => localStorage), 
        },
    )
)