import { afterEach, describe, expect, it, vi } from "vitest";
import { shuffleArray } from "./utils";

describe("shuffleArray", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("returns an array of the same length", () => {
        const input = [1, 2, 3, 4, 5];
        expect(shuffleArray(input)).toHaveLength(input.length);
    });

    it("contains exactly the same elements as the input (same multiset)", () => {
        const input = [1, 2, 3, 4, 5];
        const result = shuffleArray(input);

        expect(result.sort()).toEqual([...input].sort());
    });

    it("does not mutate the original array", () => {
        const input = [1, 2, 3, 4, 5];
        const original = [...input];

        shuffleArray(input);

        expect(input).toEqual(original);
    });

    it("returns a new array instance, not the same reference", () => {
        const input = [1, 2, 3];
        const result = shuffleArray(input);

        expect(result).not.toBe(input);
    });

    it("returns an empty array when given an empty array", () => {
        expect(shuffleArray([])).toEqual([]);
    });

    it("returns a single-element array unchanged", () => {
        expect(shuffleArray([42])).toEqual([42]);
    });

    it("produces a deterministic order when Math.random is mocked", () => {
        // Fisher-Yates with Math.random always returning 0 means
        // j is always 0 for every i, i.e. every element gets swapped
        // to the front position in sequence.
        vi.spyOn(Math, "random").mockReturnValue(0);

        const input = [1, 2, 3, 4, 5];
        const result = shuffleArray(input);

        // Walk through the algorithm by hand with random() === 0:
        // i=4, j=0 -> swap(4,0): [5,2,3,4,1]
        // i=3, j=0 -> swap(3,0): [4,2,3,5,1]
        // i=2, j=0 -> swap(2,0): [3,2,4,5,1]
        // i=1, j=0 -> swap(1,0): [2,3,4,5,1]
        expect(result).toEqual([2, 3, 4, 5, 1]);
    });

    it("can produce a different order than the input across many real shuffles", () => {
        // Not a strict guarantee (there's a theoretical chance every shuffle
        // matches the original), but with 10 elements and many attempts,
        // getting the identical order every time is effectively impossible.
        const input = Array.from({ length: 10 }, (_, i) => i);

        const results = Array.from({ length: 20 }, () => shuffleArray(input));
        const anyDifferent = results.some(
            (r) => JSON.stringify(r) !== JSON.stringify(input),
        );

        expect(anyDifferent).toBe(true);
    });
});
