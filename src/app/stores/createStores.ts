import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type createStoreState = {
    active: string
    sets: any[]
    currentSet: any
    dropDownIsOpen: boolean
    setActive: (mode: string) => void
    setSets: (data: any[]) => void
    setCurrentSet: (data: any) => void
    setDropDownIsOpen: (mode: boolean) => void
}

export const useCreateStore = create(
    persist<createStoreState>(
        (set) => ({
        active: 'create',
        sets: [],
        currentSet: [],
        dropDownIsOpen: false,
        setActive: (mode) => set({ active: mode }),
        setSets: (data) => set({ sets: data }),
        setCurrentSet: (data) => set({ currentSet: data }),
        setDropDownIsOpen: (mode) => set({ dropDownIsOpen: mode }),
    }),
    {
        name: 'create-storage', 
        storage: createJSONStorage(() => localStorage), 
    },
))

// active or manage
// current user
// current set id
// current set data
// current title
// current description
// current cnt of cards
// all user sets

// const { 
//     active, 
//     sets, 
//     dropDownIsOpen, 
//     selectedSet, 
//     selectedSetTitle, 
//     selectedSetDescription, 
//     selectedSetCardCnt, 
//     setActive, 
//     setSets, 
//     setDropDownIsOpen, 
//     setSelectedSet, 
//     setSelectedSetTitle,
//     setSelectedSetDescription,
//     setSelectedSetCardCnt,
// } = useCreateStore()