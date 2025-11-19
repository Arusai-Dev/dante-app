import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type persistentState = {
    updatingCard: boolean
    sets: unknown[]
    currentSet: unknown
    currentCardData: {
        setId: number | null
        cardId: number | null
        category: string
        front: string
        back: string
        // fileName: string
    }
    setUpdatingCard: (mode: boolean) => void
    setSets: (data: unknown[]) => void
    setCurrentSet: (data: unknown) => void
    setCurrentCardData: (data: unknown) => void
    updateCurrentCardData: (key: string, value: unknown) => void
    clearCurrentCardData: () => void
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
            updatingCard: false,
            sets: [],
            currentSet: [],
            currentCardData: {
                setId: null, 
                cardId: null, 
                category: 'Category', 
                front: 'Front', 
                back: 'Back', 
                // fileName: '',
            },

            setUpdatingCard: (mode) => set({ updatingCard: mode }),
            setSets: (data) => set({ sets: data }),
            setCurrentSet: (data) => set({ currentSet: data }),
            setCurrentCardData: (data) => set({ currentCardData: data }),
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
                        // fileName: '',
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
    toggleNewSetUI: (mode) => set({ newSetUI: mode})
}))

