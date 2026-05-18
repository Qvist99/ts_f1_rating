import { createStore } from "zustand";


export type RatingState = {
    pendingCount: number;
    ratedDriverCount: number;
}

export type RatingActions = {
    decrementPendingCount: () => void;
    incrementPendingCount: () => void;
    incrementRatedDriverCount: () => void;
    setRatedDriverCount: (count: number) => void;
}

export type RatingStore = RatingState & RatingActions;

export const defaultInitState: RatingState = {
    pendingCount: 0,
    ratedDriverCount: 0,
}


export const createRatingStore = (
    initState: RatingState = defaultInitState
) => {
    return createStore<RatingStore>()((set) => ({
        ...initState,
        decrementPendingCount: () => set((state) => ({ pendingCount: state.pendingCount === 0 ? 0 : state.pendingCount - 1 })),
        incrementPendingCount: () => set((state) => ({ pendingCount: state.pendingCount + 1 })),
        incrementRatedDriverCount: () => set((state) => ({ ratedDriverCount: state.ratedDriverCount + 1 })),
        setRatedDriverCount: (count: number) => set({ ratedDriverCount: count })
    }))
}

