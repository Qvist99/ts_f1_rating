"use client";
import { type ReactNode, createContext, useState, useContext } from "react";
import { useStore } from "zustand";

import { type RatingStore, createRatingStore } from "@/lib/stores/ratingsStore";

export type RatingStoreApi = ReturnType<typeof createRatingStore>;

export const RatingStoreContext = createContext<RatingStoreApi | undefined>(undefined);

export interface RatingStoreProviderProps {
    children: ReactNode
}


export const RatingStoreProvider = (
    { children }: RatingStoreProviderProps
) => {
    const [store] = useState(() => createRatingStore());

    return (
        <RatingStoreContext.Provider value={store}>
            {children}
        </RatingStoreContext.Provider>
    );
}


export const useRatingStore = <T,>(
    selector: (store: RatingStore) => T,
): T => {
    const ratingStoreContext = useContext(RatingStoreContext)
    if (!ratingStoreContext) {
        throw new Error(`useRatingStore must be used within RatingStoreProvider`)
    }

    return useStore(ratingStoreContext, selector)
}


