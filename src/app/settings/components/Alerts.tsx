import DanteButton from "@/components/ui/DanteButton"
import { Bell } from "lucide-react"
import { useState } from "react"



export default function Alerts() {
    const [emailNotifications, setEmailNotifications] = useState<boolean>(false)
    const [pushNotifications, setPushNotifications] = useState<boolean>(false)
    const [studyReminders, setStudyReminders] = useState<boolean>(false)
    const [weeklyProgress, setWeeklyProgress] = useState<boolean>(false)
    const [newFeatures, setNewFeatures] = useState<boolean>(false)


    return (
        <section className="md:min-w-[600px] ">

            <div className="flex flex-col gap-8 bg-[#D9D9D9]/3 border rounded-[4px] border-[#404040] h-fit p-5 ">
                <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                        <Bell className="h-6 w-6"/>
                        <span className="text-[24px] font-bold">Notification Preferences</span>
                    </div>
                    <span className="text-[14px] text-gray-400">Receive notifications via email</span>
                </div>

                <div className=" border border-[#404040]"></div>
    
                <div className="flex justify-between">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email Notifications</label>
                        <label className="block text-[12px] text-[#838383]">Receive notifications via email</label>
                    </div>
    
                    <DanteButton 
                        label={`${emailNotifications ? 'On' : 'Off'}`}
                        variant={`${emailNotifications ? 'light' : 'dark'}`}
                        onClick={() => setEmailNotifications(!emailNotifications)}
                    />
                </div>
        
                <div className="flex justify-between">
                    <div>
                        <label className="block text-sm font-medium mb-1">Push Notifications</label>
                        <label className="block text-[12px] text-[#838383]">Receive browser push notifications</label>
                    </div>
    
                    <DanteButton 
                        label={`${pushNotifications ? 'On' : 'Off'}`}
                        variant={`${pushNotifications ? 'light' : 'dark'}`}
                        onClick={() => setPushNotifications(!pushNotifications)}
                    />
                </div>
    
                <div className="flex justify-between">
                    <div>
                        <label className="block text-sm font-medium mb-1">Study Reminders</label>
                        <label className="block text-[12px] text-[#838383]">Get ready to study your flashcards</label>
                    </div>
    
                    <DanteButton 
                        label={`${studyReminders ? 'On' : 'Off'}`}
                        variant={`${studyReminders ? 'light' : 'dark'}`}
                        onClick={() => setStudyReminders(!studyReminders)}
                    />
                </div>
    
                <div className="flex justify-between">
                    <div>
                        <label className="block text-sm font-medium mb-1">Weekly Progress</label>
                        <label className="block text-[12px] text-[#838383]">Weekly study of your study progress</label>
                    </div>
    
                    <DanteButton 
                        label={`${weeklyProgress ? 'On' : 'Off'}`}
                        variant={`${weeklyProgress ? 'light' : 'dark'}`}
                        onClick={() => setWeeklyProgress(!weeklyProgress)}
                    />
                </div>
    
                <div className="flex justify-between">
                    <div>
                        <label className="block text-sm font-medium mb-1">New Features</label>
                        <label className="block text-[12px] text-[#838383]">Get notified about new features</label>
                    </div>
    
                    <DanteButton 
                        label={`${newFeatures ? 'On' : 'Off'}`}
                        variant={`${newFeatures ? 'light' : 'dark'}`}
                        onClick={() => setNewFeatures(!newFeatures)}
                    />
                </div>
            </div>


        </section>
    )

}