// @vitest-environment jsdom
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    it,
    type Mock,
    vi,
} from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useRating } from "./useRating";
import { useRatingStore } from "@/components/providers/RatingsProvider";

vi.mock("@/components/providers/RatingsProvider", () => ({
    useRatingStore: vi.fn(),
}));

describe("useRating", () => {
    const incrementPendingCount = vi.fn();
    const decrementPendingCount = vi.fn();
    const incrementRatedDriverCount = vi.fn();

    const storeState = {
        incrementPendingCount,
        decrementPendingCount,
        incrementRatedDriverCount,
    };

    beforeEach(() => {
        vi.useFakeTimers();
        vi.clearAllMocks();
        (useRatingStore as unknown as Mock).mockImplementation((
            selector: any,
        ) => selector(storeState));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("initializes localRating from initialRating and outlineState as idle", () => {
        const onSave = vi.fn();
        const { result } = renderHook(() =>
            useRating({ initialRating: 3, onSave, type: "driver" })
        );

        expect(result.current.localRating).toBe(3);
        expect(result.current.outlineState).toBe("idle");
    });

    it("updates localRating immediately and sets outlineState to updating", () => {
        const onSave = vi.fn();
        const { result } = renderHook(() =>
            useRating({ initialRating: undefined, onSave, type: "driver" })
        );

        act(() => {
            result.current.handleRate(4);
        });

        expect(result.current.localRating).toBe(4);
        expect(result.current.outlineState).toBe("updating");
    });

    it("increments pending count once even if called multiple times before the debounce fires", () => {
        const onSave = vi.fn().mockResolvedValue({ error: null });
        const { result } = renderHook(() =>
            useRating({ initialRating: undefined, onSave, type: "driver" })
        );

        act(() => {
            result.current.handleRate(2);
        });
        act(() => {
            result.current.handleRate(3);
        });
        act(() => {
            result.current.handleRate(4);
        });

        expect(incrementPendingCount).toHaveBeenCalledTimes(1);
        expect(onSave).not.toHaveBeenCalled(); // debounce hasn't fired yet
    });

    it("debounces rapid calls into a single onSave with the latest value", async () => {
        const onSave = vi.fn().mockResolvedValue({ error: null });
        const { result } = renderHook(() =>
            useRating({ initialRating: undefined, onSave, type: "driver" })
        );

        act(() => {
            result.current.handleRate(2);
        });
        act(() => {
            result.current.handleRate(5); // supersedes the previous debounce
        });

        await act(async () => {
            await vi.advanceTimersByTimeAsync(1400);
        });

        expect(onSave).toHaveBeenCalledTimes(1);
        expect(onSave).toHaveBeenCalledWith(5);
    });

    it("moves through saving -> saved, decrements pending, and returns to idle after 1800ms", async () => {
        const onSave = vi.fn().mockResolvedValue({ error: null });
        const { result } = renderHook(() =>
            useRating({ initialRating: undefined, onSave, type: "race" })
        );

        act(() => {
            result.current.handleRate(5);
        });

        await act(async () => {
            await vi.advanceTimersByTimeAsync(1400);
        });

        expect(result.current.outlineState).toBe("saved");
        expect(decrementPendingCount).toHaveBeenCalledTimes(1);

        await act(async () => {
            await vi.advanceTimersByTimeAsync(1800);
        });

        expect(result.current.outlineState).toBe("idle");
    });

    it("calls incrementRatedDriverCount only on the first successful driver rating", async () => {
        const onSave = vi.fn().mockResolvedValue({ error: null });
        const { result } = renderHook(() =>
            useRating({ initialRating: undefined, onSave, type: "driver" })
        );

        act(() => {
            result.current.handleRate(4);
        });
        await act(async () => {
            await vi.advanceTimersByTimeAsync(1400);
        });

        expect(incrementRatedDriverCount).toHaveBeenCalledTimes(1);

        // rate again — already counted as rated, shouldn't increment again
        act(() => {
            result.current.handleRate(5);
        });
        await act(async () => {
            await vi.advanceTimersByTimeAsync(1400);
        });

        expect(incrementRatedDriverCount).toHaveBeenCalledTimes(1);
    });

    it("does not call incrementRatedDriverCount for type 'race'", async () => {
        const onSave = vi.fn().mockResolvedValue({ error: null });
        const { result } = renderHook(() =>
            useRating({ initialRating: undefined, onSave, type: "race" })
        );

        act(() => {
            result.current.handleRate(4);
        });
        await act(async () => {
            await vi.advanceTimersByTimeAsync(1400);
        });

        expect(incrementRatedDriverCount).not.toHaveBeenCalled();
    });

    it("sets outlineState to error and reverts localRating when onSave resolves with an error", async () => {
        const onSave = vi.fn().mockResolvedValue({
            error: new Error("failed"),
        });
        const { result } = renderHook(() =>
            useRating({ initialRating: 3, onSave, type: "driver" })
        );

        act(() => {
            result.current.handleRate(5);
        });

        await act(async () => {
            await vi.advanceTimersByTimeAsync(1400);
        });

        expect(result.current.outlineState).toBe("error");
        expect(result.current.localRating).toBe(3); // reverted to initialRating
        expect(decrementPendingCount).toHaveBeenCalledTimes(1);
        expect(incrementRatedDriverCount).not.toHaveBeenCalled();
    });

    it("sets outlineState to error when onSave itself rejects", async () => {
        const onSave = vi.fn().mockRejectedValue(new Error("network error"));
        const { result } = renderHook(() =>
            useRating({ initialRating: undefined, onSave, type: "driver" })
        );

        act(() => {
            result.current.handleRate(5);
        });

        await act(async () => {
            await vi.advanceTimersByTimeAsync(1400);
        });

        expect(result.current.outlineState).toBe("error");
        expect(result.current.localRating).toBeUndefined();
        expect(decrementPendingCount).toHaveBeenCalledTimes(1);
    });

    it("allows a new pending cycle after a previous save resolves", async () => {
        const onSave = vi.fn().mockResolvedValue({ error: null });
        const { result } = renderHook(() =>
            useRating({ initialRating: undefined, onSave, type: "driver" })
        );

        act(() => {
            result.current.handleRate(3);
        });
        await act(async () => {
            await vi.advanceTimersByTimeAsync(1400);
        });

        act(() => {
            result.current.handleRate(4);
        });

        // pending count incremented again for this new cycle
        expect(incrementPendingCount).toHaveBeenCalledTimes(2);
    });

    it("clears the pending debounce timeout on unmount", () => {
        const onSave = vi.fn().mockResolvedValue({ error: null });
        const clearTimeoutSpy = vi.spyOn(global, "clearTimeout");

        const { result, unmount } = renderHook(() =>
            useRating({ initialRating: undefined, onSave, type: "driver" })
        );

        act(() => {
            result.current.handleRate(4);
        });

        unmount();

        expect(clearTimeoutSpy).toHaveBeenCalled();
        clearTimeoutSpy.mockRestore();
    });
});
