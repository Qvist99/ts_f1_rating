"use client"
import { Star } from "lucide-react";
import { useLoginModal } from "@/lib/stores/useLoginModal";
export default function GuestRateDriversButton() {
    const { open } = useLoginModal()

    return (
        <button
            onClick={() => open("/dashboard")}
            className="flex gap-2 items-center px-4 py-2 border border-gray-600 hover:border-gray-400 rounded-md text-sm transition-colors font-condensed font-bold cursor-pointer"
        >
            <Star size={16} />
            Rate Drivers
        </button>
    )
}
