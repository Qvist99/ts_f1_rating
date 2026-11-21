// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useCountdown } from "./useCountdown";

const NOW = "2025-06-15T12:00:00.000Z";

describe("useCountdown", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(NOW));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("returns isFinished true and all zeros when targetDate is undefined", () => {
        const { result } = renderHook(() => useCountdown(undefined));

        expect(result.current).toEqual({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isFinished: true,
        });
    });

    it("returns isFinished true and all zeros when targetDate is in the past", () => {
        const { result } = renderHook(() =>
            useCountdown("2025-06-15T11:00:00.000Z")
        );

        expect(result.current).toEqual({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isFinished: true,
        });
    });

    it("returns isFinished true when targetDate is exactly now", () => {
        const { result } = renderHook(() => useCountdown(NOW));

        expect(result.current.isFinished).toBe(true);
    });

    it("calculates days/hours/minutes/seconds correctly for a future date", () => {
        // 2 days, 3 hours, 4 minutes, 5 seconds from NOW
        const target = new Date(
            new Date(NOW).getTime() +
                (2 * 24 * 60 * 60 + 3 * 60 * 60 + 4 * 60 + 5) * 1000,
        ).toISOString();

        const { result } = renderHook(() => useCountdown(target));

        expect(result.current).toEqual({
            days: 2,
            hours: 3,
            minutes: 4,
            seconds: 5,
            isFinished: false,
        });
    });

    it("counts down as time passes", () => {
        const target = new Date(
            new Date(NOW).getTime() + 10 * 1000, // 10 seconds out
        ).toISOString();

        const { result } = renderHook(() => useCountdown(target));

        expect(result.current.seconds).toBe(10);

        act(() => {
            vi.advanceTimersByTime(3000);
        });

        expect(result.current.seconds).toBe(7);
        expect(result.current.isFinished).toBe(false);
    });

    it("flips to isFinished once the countdown reaches the target", () => {
        const target = new Date(
            new Date(NOW).getTime() + 2000, // 2 seconds out
        ).toISOString();

        const { result } = renderHook(() => useCountdown(target));

        expect(result.current.isFinished).toBe(false);

        act(() => {
            vi.advanceTimersByTime(3000); // past the target
        });

        expect(result.current).toEqual({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isFinished: true,
        });
    });

    it("resets and recalculates when targetDate changes", () => {
        const targetA = new Date(
            new Date(NOW).getTime() + 5 * 1000,
        ).toISOString();
        const targetB = new Date(
            new Date(NOW).getTime() + 50 * 1000,
        ).toISOString();

        const { result, rerender } = renderHook(
            ({ targetDate }) => useCountdown(targetDate),
            { initialProps: { targetDate: targetA } },
        );

        expect(result.current.seconds).toBe(5);

        rerender({ targetDate: targetB });

        expect(result.current.seconds).toBe(50);
    });

    it("clears the interval on unmount", () => {
        const target = new Date(
            new Date(NOW).getTime() + 10 * 1000,
        ).toISOString();

        const clearIntervalSpy = vi.spyOn(global, "clearInterval");

        const { unmount } = renderHook(() => useCountdown(target));
        unmount();

        expect(clearIntervalSpy).toHaveBeenCalledTimes(1);

        clearIntervalSpy.mockRestore();
    });
});
