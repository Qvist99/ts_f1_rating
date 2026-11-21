export default function createRateLimiter(
  requestsPerMinute: number,
  minGapMs = 1000,
) {
  const minDelay = Math.max((60 / requestsPerMinute) * 1000, minGapMs);

  let nextSlot = 0;

  return async function throttle() {
    const now = Date.now();
    const start = Math.max(now, nextSlot);

    nextSlot = start + minDelay;

    const wait = start - now;
    if (wait > 0) {
      await new Promise((resolve) => setTimeout(resolve, wait));
    }
  };
}
