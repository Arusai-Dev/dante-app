'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useUser } from '@clerk/nextjs';

type persistentState = {
    // Profile
    userName: string
    userEmail: string
    userBio: string
    userLocation: string
    userWebsite: string
    
    setUserName: (mode: string) => void 
    setUserEmail: (mode: string) => void 
    setUserBio: (mode: string) => void 
    setUserLocation: (mode: string) => void 
    setUserWebsite: (mode: string) => void 
    syncWithClerk: () => Promise<void>
    updateClerkMetadata: () => Promise<void>
}


export const useSettingsPersistentStore = create(
    persist<persistentState>(
        (set, get) => ({
            // Profile
            userName: '',
            userEmail: '',
            userBio: '',
            userLocation: '',
            userWebsite: '',
            
            setUserName: (name: string) => set({ userName: name }),
            setUserEmail: (email: string) => set({ userEmail: email }),
            setUserBio: (bio: string) => set({ userBio: bio }),
            setUserLocation: (location: string) => set({ userLocation: location }),
            setUserWebsite: (website: string) => set({ userWebsite: website }),

            syncWithClerk: async () => {
                const { user } = useUser();
                if (user) {
                    set({
                        userName: user.username || user.firstName || '',
                        userEmail: user.primaryEmailAddress?.emailAddress || '',
                        userBio: user.publicMetadata?.bio as string || '',
                        userLocation: user.publicMetadata?.location as string || '',
                        userWebsite: user.publicMetadata?.website as string || '',
                    });
                }
            },
        
            updateClerkMetadata: async () => {
                const { user } = useUser();
                const state = get();
                
                if (user) {
                    await user.update({
                        unsafeMetadata: {
                        bio: state.userBio,
                        location: state.userLocation,
                        website: state.userWebsite,
                        }
                    });
                }
            },

        }),
        {
            name: 'settings-storage',
            storage: createJSONStorage(() => localStorage),
        },
    )
)