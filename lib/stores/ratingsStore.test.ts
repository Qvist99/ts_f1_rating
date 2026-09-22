import { describe, expect, it } from "vitest";
import { createRatingStore, defaultInitState } from "./ratingsStore";

describe("createRatingStore", () => {
    it("initializes with defaultInitState when no initial state is given", () => {
        const store = createRatingStore();

        expect(store.getState().pendingCount).toBe(0);
        expect(store.getState().ratedDriverCount).toBe(0);
    });

    it("initializes with a provided initial state", () => {
        const store = createRatingStore({
            pendingCount: 5,
            ratedDriverCount: 2,
        });

        expect(store.getState().pendingCount).toBe(5);
        expect(store.getState().ratedDriverCount).toBe(2);
    });

    it("does not mutate defaultInitState across multiple store instances", () => {
        const storeA = createRatingStore();
        storeA.getState().incrementPendingCount();

        const storeB = createRatingStore();

        expect(storeA.getState().pendingCount).toBe(1);
        expect(storeB.getState().pendingCount).toBe(0);
        expect(defaultInitState.pendingCount).toBe(0);
    });

    describe("incrementPendingCount", () => {
        it("increments pendingCount by 1", () => {
            const store = createRatingStore();

            store.getState().incrementPendingCount();
            expect(store.getState().pendingCount).toBe(1);

            store.getState().incrementPendingCount();
            expect(store.getState().pendingCount).toBe(2);
        });

        it("does not affect ratedDriverCount", () => {
            const store = createRatingStore();

            store.getState().incrementPendingCount();
            expect(store.getState().ratedDriverCount).toBe(0);
        });
    });

    describe("decrementPendingCount", () => {
        it("decrements pendingCount by 1", () => {
            const store = createRatingStore({
                pendingCount: 3,
                ratedDriverCount: 0,
            });

            store.getState().decrementPendingCount();
            expect(store.getState().pendingCount).toBe(2);
        });

        it("floors at 0 and does not go negative", () => {
            const store = createRatingStore();

            store.getState().decrementPendingCount();
            expect(store.getState().pendingCount).toBe(0);

            store.getState().decrementPendingCount();
            expect(store.getState().pendingCount).toBe(0);
        });
    });

    describe("incrementRatedDriverCount", () => {
        it("increments ratedDriverCount by 1", () => {
            const store = createRatingStore();

            store.getState().incrementRatedDriverCount();
            expect(store.getState().ratedDriverCount).toBe(1);

            store.getState().incrementRatedDriverCount();
            expect(store.getState().ratedDriverCount).toBe(2);
        });

        it("does not affect pendingCount", () => {
            const store = createRatingStore();

            store.getState().incrementRatedDriverCount();
            expect(store.getState().pendingCount).toBe(0);
        });
    });

    describe("setRatedDriverCount", () => {
        it("sets ratedDriverCount to the given value", () => {
            const store = createRatingStore();

            store.getState().setRatedDriverCount(7);
            expect(store.getState().ratedDriverCount).toBe(7);
        });

        it("overwrites any previous value, including via increment", () => {
            const store = createRatingStore();

            store.getState().incrementRatedDriverCount();
            store.getState().incrementRatedDriverCount();
            expect(store.getState().ratedDriverCount).toBe(2);

            store.getState().setRatedDriverCount(0);
            expect(store.getState().ratedDriverCount).toBe(0);
        });

        it("does not affect pendingCount", () => {
            const store = createRatingStore({
                pendingCount: 4,
                ratedDriverCount: 0,
            });

            store.getState().setRatedDriverCount(9);
            expect(store.getState().pendingCount).toBe(4);
        });
    });

    it("reacts to state changes via subscribe", () => {
        const store = createRatingStore();
        const seenValues: number[] = [];

        const unsubscribe = store.subscribe((state) => {
            seenValues.push(state.pendingCount);
        });

        store.getState().incrementPendingCount();
        store.getState().incrementPendingCount();
        store.getState().decrementPendingCount();

        unsubscribe();

        expect(seenValues).toEqual([1, 2, 1]);
    });
});
