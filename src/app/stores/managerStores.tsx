import { Card, Set } from '@/types'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type persistentState = {
    currentCard: Card | null
    originalImageUrl: string | null
    updatingCard: boolean

    setCurrentCard: (data: Card) => void
    setUpdatingCard: (mode: boolean) => void
    updateCurrentCard: (key: string, value: string) => void
    clearCurrentCard: () => void
    clearImageState: () => void
    setOriginalImageUrl: (url: string | null) => void

    sets: Set[]
    currentSet: Set | null
    setSets: (data: Set[]) => void
    setCurrentSet: (data: Set) => void
}

type nonPersistentState = {
    active: string
    setActive: (mode: string) => void
    newSetUI: boolean
    toggleNewSetUI: (mode: boolean) => void
}

export const useManagerPersistentStore = create(
    persist<persistentState>(
        (set, get) => ({
            currentCard: {
                setId: null,
                cardId: null,
                category: 'Category',
                front: 'Front',
                back: 'Back',
                imageUrl: '',
            },
            updatingCard: false,
            originalImageUrl: null,
            setUpdatingCard: (mode) => set({ updatingCard: mode }),
            setCurrentCard: (data) => set({ currentCard: data }),
            updateCurrentCard: (key, value) => set({
                currentCard: {
                    ...get().currentCard,
                    [key]: value
                }
            }),
            clearCurrentCard: () => {
                set({
                    currentCard: {
                        setId: null,
                        cardId: null,
                        category: 'Category',
                        front: 'Front',
                        back: 'Back',
                        imageUrl: '',
                    },
                })
            },
            clearImageState: () => set({ originalImageUrl: null }),
            setOriginalImageUrl: (url) => set({ originalImageUrl: url }),

            sets: [],
            currentSet: null,
            setSets: (data) => set({ sets: data }),
            setCurrentSet: (data) => set({ currentSet: data }),
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
    toggleNewSetUI: (mode) => set({ newSetUI: mode})
}))

