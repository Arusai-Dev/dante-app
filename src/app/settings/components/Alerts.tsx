import DanteButton from "@/components/ui/DanteButton"
import DanteToggle from "@/components/ui/DanteToggle"
import { Bell } from "lucide-react"
import { useState } from "react"



export default function Alerts() {
    const [emailNotifications, setEmailNotifications] = useState<boolean>(false)
    const [pushNotifications, setPushNotifications] = useState<boolean>(false)
    const [studyReminders, setStudyReminders] = useState<boolean>(false)
    const [weeklyProgress, setWeeklyProgress] = useState<boolean>(false)
    const [newFeatures, setNewFeatures] = useState<boolean>(false)


    return (
        <section className="md:min-w-[600px] flex flex-col gap-8 bg-[#D9D9D9]/3 border rounded-[4px] border-[#404040] h-fit p-5 ">

            <div className="flex flex-col">
                <div className="flex items-center gap-3">
                    <Bell className="h-6 w-6"/>
                    <span className="text-[24px] font-bold">Notification Preferences</span>
                </div>
                <span className="text-[14px] text-gray-400">Receive notifications via email</span>
            </div>

            <div className=" border border-[#404040]"></div>

            <DanteToggle
                title="Email Notifications"
                description="Receive notifications via email"
                value={emailNotifications}
                onChange={setEmailNotifications}
            />

            <DanteToggle
                title="Push Notifications"
                description="Receive browser push notifications"
                value={emailNotifications}
                onChange={setEmailNotifications}
            />

            <DanteToggle
                title="Study Reminders"
                description="Get ready to study your flashcards"
                value={pushNotifications}
                onChange={setEmailNotifications}
            />

            <DanteToggle
                title="Weekly Progress"
                description="Weekly study of your study progress"
                value={emailNotifications}
                onChange={setEmailNotifications}
            />

            <DanteToggle
                title="New Features"
                description="Get notified about new features"
                value={emailNotifications}
                onChange={setEmailNotifications}
            />
        </section>
    )

}