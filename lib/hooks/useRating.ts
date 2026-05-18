'use client'

import { useEffect, useState, useRef } from "react"
import { useRatingStore } from "@/components/providers/RatingsProvider"
type BorderState = 'idle' | 'updating' | 'saving' | 'saved' | 'error'

export function useRating({ initialRating, onSave }: {
    initialRating?: number
    onSave: (val: number) => Promise<{ error: any }>
}) {
    const incrementPendingCount = useRatingStore(s => s.incrementPendingCount)
    const decrementPendingCount = useRatingStore(s => s.decrementPendingCount)

    const [localRating, setLocalRating] = useState<number | undefined>(initialRating)
    const [borderState, setBorderState] = useState<BorderState>('idle')
    const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

    const handleRate = (val: number) => {
        setLocalRating(val)
        incrementPendingCount()
        setBorderState('updating')

        clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(async () => {
            setBorderState('saving')

            try {
                const { error } = await onSave(val)
                if (error) throw error
                setBorderState('saved')
                setTimeout(() => setBorderState('idle'), 1800)
            } catch {
                setBorderState('error')
                setLocalRating(initialRating)
            } finally {
                decrementPendingCount()
            }
        }, 1400)
    }

    useEffect(() => () => clearTimeout(debounceRef.current), [])

    return { localRating, borderState, handleRate }
}
