"use client"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function Slider({ pages, autoRotateMs, action }: {
    pages: React.ReactNode[]
    autoRotateMs?: number
    action?: { label: string, onClick: () => void } | { label: string, href: string } | { node: React.ReactNode }
}) {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        setCurrent(0)

        if (!autoRotateMs) return;
        const interval = setInterval(() => {
            setCurrent(i => (i + 1) % pages.length)
        }, autoRotateMs)
        return () => clearInterval(interval)
    }, [autoRotateMs, pages.length])

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1">
                {pages[current]}
            </div>
            <div className="flex justify-center items-center relative pt-2">
                <div className="flex gap-2">
                    {pages.map((_, i) => (
                        <div key={i} className="p-2 -m-2 cursor-pointer" onClick={() => setCurrent(i)}>
                            <div className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-white" : "bg-gray-600"}`} />
                        </div>
                    ))}
                </div>

                {action && (
                    <div className="absolute right-0 bottom-[-6px]">
                        {"node" in action
                            ? action.node
                            : "href" in action
                                ? <Link href={action.href} className="text-xs text-gray-400 hover:text-text-primary transition-colors">{action.label}</Link>
                                : <button onClick={action.onClick} className="text-xs text-gray-400 hover:text-text-primary transition-colors">{action.label}</button>
                        }
                    </div>
                )}
            </div>
        </div>
    )
}