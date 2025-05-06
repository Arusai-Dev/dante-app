import { create } from 'zustand'

type createStoreState = {
    active: string
    sets: any[]
    setActive: (mode: string) => void
    setSets: (data: any[]) => void
}

export const useCreateStore = create<createStoreState>((set) => ({
    active: 'create',
    sets: [],
    setActive: (mode) => set({ active: mode }),
    setSets: (data) => set({ sets: data }),
}))

type setSelectionStore = {
    dropDownIsOpen: boolean
    selectedSet: number // id of set
    setDropDownIsOpen: (mode: boolean) => void
    setSelectedSet: (mode: number) => void
}

export const useSelectionStore = create<setSelectionStore>((set) => ({
    dropDownIsOpen: false,
    selectedSet: null,
    setDropDownIsOpen: (mode) => set({ dropDownIsOpen: mode }),
    setSelectedSet: (mode) => set({ selectedSet: mode })
}))