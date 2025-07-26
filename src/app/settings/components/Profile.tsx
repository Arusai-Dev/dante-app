import { useSettingsPersistentStore } from "@/app/stores/useSettingsPersistentStore";
import { dismissTextModal } from "@/components/modals/dismissTextModal";
import { useUser } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs/server";
import { LockIcon, Save, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";


export default function Profile() {

    const {
        userName, 
        userEmail, 
        userBio, 
        userLocation, 
        userWebsite,

        setUserName,
        setUserEmail,
        setUserBio,
        setUserLocation,
        setUserWebsite,
    } = useSettingsPersistentStore()

    const [showToast, setShowToast] = useState(false);


    const { user, isLoaded } = useUser()

    useEffect(() => {
        if (isLoaded && user) {
            setUserName(user.fullName || "");
            setUserEmail(user.emailAddresses[0]?.emailAddress || "");
        }
    }, [isLoaded, setUserEmail, setUserName, user]);


    const saveProfile = async () => {
        const userId = user?.id
        
        if (!userId) {
            console.error("User ID not available")
            return;
        }

        try {
            const response = await fetch('/api/clerk/update-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: userName.split(' ')[0],
                    lastName: userName.split(' ')[1] || '',
                    userName: userName,
                    bio: userBio,
                    location: userLocation,
                    website: userWebsite,
                })
            })

            if (user && userEmail !== user?.primaryEmailAddress?.emailAddress) {
                await user.createEmailAddress({ emailAddress: userEmail })
            }


            if (response.ok) {
                console.log('Profile updated successfully')
            } else {
                console.log('Failed to upload profile')
            }
            toast("Profile updated successfully")       
        } catch (err) {
            console.log("Error updating profile:", err)
        }
    }

    return (

        <div className=" md:min-w-[800px] flex flex-col gap-6 mb-20">
            <Toaster/>
            <div className="flex flex-col gap-8 bg-[#D9D9D9]/3 border rounded-[4px] border-[#404040] h-fit p-5 ">
                <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                        <User className="h-6 w-6"/>
                        <span className="text-[24px] font-bold">Profile Information</span>
                    </div>
                    <span className="text-[14px] text-gray-400">Update your personal information and profile details</span>
                </div>
    
                <div className="flex md:gap-5">
                    <div className="flex flex-col w-full">
                        <label className="mb-1 font-semibold text-[15px]">Profile Name</label>
                        <input 
                            className="px-2 py-1 border-[1px] border-[#8c8c8c] rounded-[5px] hover-animation focus:outline-1"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        ></input>
                    </div>
    
                    <div className="flex flex-col w-full">
                        <label className="mb-1 font-semibold text-[15px]">Email Address</label>
                        <input 
                            className="px-2 py-1 border-[1px] border-[#8c8c8c] rounded-[5px] hover-animation focus:outline-1"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                        ></input>
                    </div>
                </div>
    
                <div className="flex flex-col w-full">
                    <label className="mb-1 font-semibold text-[15px]">Bio</label>
                    <textarea 
                        className="set-desc-text-area px-2 py-1 w-full resize-y h-[100px] md:h-[150px] border-[1px] focus:outline-1 border-[#8c8c8c] rounded-[5px] hover-animation"
                        value={userBio}
                        placeholder="Tell us about yourself..."
                        onChange={(e) => setUserBio(e.target.value)}
                    ></textarea>
                </div>
    
                <div className="flex md:gap-5">
                    <div className="flex flex-col w-full">
                        <label className="mb-1 font-semibold text-[15px]">Location</label>
                        <input 
                            className="px-2 py-1 border-[1px] border-[#8c8c8c] rounded-[5px] hover-animation focus:outline-1"
                            placeholder="(Optional)"
                            value={userLocation}
                            onChange={(e) => setUserLocation(e.target.value)}
                        ></input>
                    </div>
    
                    <div className="flex flex-col w-full">
                        <label className="mb-1 font-semibold text-[15px]">Website</label>
                        <input 
                            className="px-2 py-1 border-[1px] border-[#8c8c8c] rounded-[5px] hover-animation focus:outline-1"
                            placeholder="https://example.com"
                            value={userWebsite}
                            onChange={(e) => setUserWebsite(e.target.value)}
                        ></input>
                    </div>
                </div>
    
    
                <button 
                    className="flex gap-2 justify-center cursor-pointer bg-[#D9D9D9] text-[#0F0F0F] items-center w-1/3 h-[33px] md:h-[40px] py-1 px-3 rounded-[5px] hover-animation-secondary"
                    onClick={() => {
                        // saveProfile()
                        dismissTextModal({ title: "Feature still in development"})
                    }}
                >
                    <div className="flex items-center justify-center">
                        <Save className="h-[16px] md:h-[20px] md:w-[20px]"/>
                    </div>
                    <span className="text-sm md:text-lg font-semibold">Save Profile</span>
                </button>
            </div>

            <div className="flex flex-col bg-[#D9D9D9]/3 rounded-[4px] border border-[#404040] h-fit p-5 ">
                
                <div className="flex flex-col mb-8">
                    <div className="flex items-center gap-3">
                        <LockIcon className="h-6 w-6"/>
                        <span className="text-[24px] font-bold">Security</span>
                    </div>
                    <span className="text-[14px] text-gray-400">Manage your account security and password</span>
                </div>

                <div className="flex gap-4 mb-4">
                    <button 
                        className="cursor-pointer bg-[#151515] border border-[#404040] text-[#e3e3e3] w-1/3 h-[33px] md:h-[40px] py-1 px-3 rounded-[5px] hover-animation-secondary"
                        onClick={() => {
                            dismissTextModal({ title: "Feature still in development"})
                        }}
                    >
                        <span className="text-sm md:text-[15px] font-semibold">Change Password</span>
                    </button>

                    <button 
                        className="cursor-pointer bg-[#151515] border border-[#404040] text-[#e3e3e3] w-fit h-[33px] md:h-[40px] py-1 px-6 rounded-[5px] hover-animation-secondary"
                        onClick={() => {
                            dismissTextModal({ title: "Feature still in development"})
                            
                        }}
                    >
                        <span className="text-sm md:text-[15px] font-semibold">Enable Two-Factor Authentication</span>
                    </button>
                </div>

                <div className=" border border-[#404040] mb-8"></div>
                
                <div className="flex flex-col gap-1">
                    <button 
                        className="cursor-pointer bg-[#960000] border border-[#404040] text-[#e3e3e3] w-fit h-[33px] md:h-[40px] py-1 px-6 rounded-[5px] hover-animation"
                        onClick={() => {
                            dismissTextModal({ title: "Feature still in development"})
                            
                        }}
                    >
                        <span className="text-sm md:text-[15px] font-semibold">Delete Account</span>
                    </button>
                    <div className="flex items-center  gap-1 text-[#8a8a8a] text-[13px]">This action cannot be undone and all data will be deleted</div>
                </div>
            </div>
        </div>
    )
}