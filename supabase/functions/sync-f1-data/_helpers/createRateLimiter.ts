export default function createRateLimiter(requestsPerMinute: number) {
  const minDelay = (60 / requestsPerMinute) * 1000;

  let lastRequest = 0;

  return async function throttle() {
    const now = Date.now();
    const elapsed = now - lastRequest;

    if (elapsed < minDelay) {
      await new Promise((resolve) => setTimeout(resolve, minDelay - elapsed));
    }
    lastRequest = Date.now();
  };
}
