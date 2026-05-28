"use client"
import { useState } from "react"

interface Tab {
    id: string;
    label: string;
    content: React.ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    defaultTab?: string;
    paddingBottom?: boolean;
}




export default function Tabs({ tabs, defaultTab, paddingBottom = true }: TabsProps) {
    const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0].id)

    return (
        <div className="h-full ">
            <div className="flex justify-between border-b border-border w-full px-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-2 py-4 border-b-2 cursor-pointer ${activeTab === tab.id ? "border-[#E10600]" : "border-transparent hover:border-card-border"}`}

                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className={`h-full overflow-scroll px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${paddingBottom ? "pb-16" : ""}`}>
                {tabs.find((tab) => tab.id === activeTab)?.content}
            </div>


        </div>
    )
}



