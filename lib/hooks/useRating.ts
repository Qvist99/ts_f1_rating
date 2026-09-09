"use client";

import { useEffect, useRef, useState } from "react";
import { useRatingStore } from "@/components/providers/RatingsProvider";
type OutlineState = "idle" | "updating" | "saving" | "saved" | "error";

export function useRating({ initialRating, onSave, type }: {
    initialRating?: number;
    onSave: (val: number) => Promise<{ error: any }>;
    type: "driver" | "race";
}) {
    const incrementPendingCount = useRatingStore((s) =>
        s.incrementPendingCount
    );
    const decrementPendingCount = useRatingStore((s) =>
        s.decrementPendingCount
    );
    const incrementRatedDriverCount = useRatingStore((s) =>
        s.incrementRatedDriverCount
    );

    const [localRating, setLocalRating] = useState<number | undefined>(
        initialRating,
    );
    const [outlineState, setOutlineState] = useState<OutlineState>("idle");
    const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
        undefined,
    );
    const hasRatingRef = useRef(!!initialRating);
    const hasPendingRef = useRef(false);

    const handleRate = (val: number) => {
        setLocalRating(val);
        setOutlineState("updating");

        if (!hasPendingRef.current) {
            incrementPendingCount();
            hasPendingRef.current = true;
        }

        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            setOutlineState("saving");

            try {
                const { error } = await onSave(val);
                if (error) throw error;
                setOutlineState("saved");
                if (type === "driver" && !hasRatingRef.current) {
                    incrementRatedDriverCount();
                    hasRatingRef.current = true;
                }
                setTimeout(() => setOutlineState("idle"), 1800);
            } catch {
                setOutlineState("error");
                setLocalRating(initialRating);
            } finally {
                decrementPendingCount();
                hasPendingRef.current = false;
            }
        }, 1400);
    };

    useEffect(() => () => clearTimeout(debounceRef.current), []);

    return { localRating, outlineState, handleRate };
}
