// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useNow } from "./useNow";

const NOW = "2025-06-15T12:00:00.000Z";

describe("useNow", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(NOW));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("returns the current date/time on initial render", () => {
        const { result } = renderHook(() => useNow());

        expect(result.current).toEqual(new Date(NOW));
    });

    it("updates every second as time passes", () => {
        const { result } = renderHook(() => useNow());

        expect(result.current).toEqual(new Date(NOW));

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(result.current).toEqual(new Date("2025-06-15T12:00:01.000Z"));

        act(() => {
            vi.advanceTimersByTime(3000);
        });

        expect(result.current).toEqual(new Date("2025-06-15T12:00:04.000Z"));
    });

    it("does not update between ticks", () => {
        const { result } = renderHook(() => useNow());

        act(() => {
            vi.advanceTimersByTime(999);
        });

        expect(result.current).toEqual(new Date(NOW));
    });

    it("clears the interval on unmount", () => {
        const clearIntervalSpy = vi.spyOn(global, "clearInterval");

        const { unmount } = renderHook(() => useNow());
        unmount();

        expect(clearIntervalSpy).toHaveBeenCalledTimes(1);

        clearIntervalSpy.mockRestore();
    });

    it("stops updating after unmount", () => {
        const { result, unmount } = renderHook(() => useNow());

        unmount();

        act(() => {
            vi.advanceTimersByTime(5000);
        });

        // result.current is frozen at whatever it was on unmount;
        // this just confirms advancing timers post-unmount doesn't throw
        expect(result.current).toEqual(new Date(NOW));
    });
});
