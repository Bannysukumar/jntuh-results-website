# Performance Optimization Summary – JNTUH Results Website

## Root Causes of Slowness

1. **Blocking navigation on push setup**  
   The academic result form waited for `setupPush()` (service worker registration, VAPID fetch, push subscription, save-subscription API) to finish before navigating to the result page. Users could wait several seconds before the result page even loaded.

2. **No client-side caching**  
   Every result search called the API. Repeat searches for the same roll number (e.g. refresh or back) always triggered a new network request.

3. **Duplicate API requests**  
   There was no request deduplication. Rapid submissions or React double-mount could trigger multiple in-flight requests for the same roll number.

4. **No server-side proxy caching**  
   The proxy forwarded every request to the external API. Same roll number from different users or refreshes always hit the upstream API.

5. **Long timeouts**  
   A 20s timeout delayed failure feedback and could make the app feel stuck on slow networks.

6. **Sequential URL fallback in `fetchAcademicResult.tsx`**  
   The legacy academic result fetcher tried backup URLs one after another (up to 7s each). In the worst case this added tens of seconds before giving up or succeeding.

7. **Stale updates and no request cancellation**  
   The result page did not cancel in-flight requests on unmount or when `htno` changed, and did not ignore stale responses, which could cause wrong data or extra work.

---

## Optimizations Implemented

### 1. Non-blocking navigation (academic result flow)

- **File:** `app/academicresult/page.tsx`
- **Change:** Navigate to the result page immediately on submit; run `setupPush()` in the background without awaiting.
- **Effect:** User reaches the result page and sees loading right away instead of waiting for push setup. Cooldown reduced from 10s to 5s.

### 2. Client-side result cache and request deduplication

- **File:** `components/api/fetchResults.tsx`
- **Changes:**
  - In-memory cache (Map) and sessionStorage cache for successful academic results (5-minute TTL).
  - Cache key: normalized roll number; cache checked before any API call.
  - In-flight request map: same roll number reuses one promise, so duplicate calls share a single request.
- **Effect:** Repeat searches for the same roll number are instant from cache; duplicate triggers do not cause extra API calls.

### 3. Shorter timeout and optional AbortSignal

- **File:** `components/api/fetchResults.tsx`
- **Changes:**
  - Request timeout reduced from 20s to 15s.
  - `fetchAcademicResult(htno, { signal })` supports an optional `AbortSignal`; axios request is cancelled when the signal aborts.
  - On abort, no error toast; in-flight map is cleared in `finally`.
- **Effect:** Faster failure feedback and no unnecessary work or toasts when the user leaves the page.

### 4. Result page: loading state, cancellation, and safe updates

- **File:** `app/academicresult/result/page.tsx`
- **Changes:**
  - Explicit `loading` state; skeleton shown while loading.
  - `AbortController` in `useEffect`; cleanup calls `abort()` and sets a `cancelled` flag.
  - `fetchAcademicResult` called with `signal: abortController.signal`.
  - State updates and redirect only when not cancelled/aborted; no redirect on unmount or when request was aborted.
- **Effect:** No duplicate or stale result display; leaving the page cancels the request and avoids unnecessary redirects.

### 5. Proxy Redis caching

- **File:** `app/api/proxy/route.ts`
- **Changes:**
  - For cacheable endpoints (`getAcademicResult`, `getAllResult`, `getBacklogs`, `getCreditsChecker`, `getClassResults`), build cache key from endpoint + normalized `rollNumber`.
  - Before calling the external API, try Redis GET; on hit, return cached JSON with `X-Proxy-Cache: HIT`.
  - On successful 200 response with `details`, cache body in Redis with TTL 120 seconds.
  - Redis client created only when `REDIS_URL` is set; cache errors are ignored so the proxy still works without Redis.
- **Effect:** Repeated requests for the same roll number (same or different users) can be served from Redis within 2 minutes, reducing load and latency.

### 6. Parallel URL fetching in legacy academic fetcher

- **File:** `components/api/fetchAcademicResult.tsx`
- **Changes:**
  - Replaced sequential `for` loop with `Promise.allSettled(urlList.map(...))` so all URLs are requested in parallel.
  - First successful response (non-null, not 422) is used; per-request timeout kept at 8s.
  - For web, put `/api/academicresult` first in the list so our own API is preferred.
- **Effect:** Worst-case wait is roughly one timeout (~8s) instead of N × 7s for N URLs.

---

## Files Modified

| File | Changes |
|------|--------|
| `app/academicresult/page.tsx` | Non-blocking `setupPush`, immediate `router.push`, removed unused import, 5s cooldown |
| `components/api/fetchResults.tsx` | Client cache (memory + sessionStorage), in-flight dedup, 15s timeout, AbortSignal, cache/dedup helpers |
| `app/academicresult/result/page.tsx` | `loading` state, `AbortController`, pass `signal` to fetch, cancel/redirect logic |
| `app/api/proxy/route.ts` | Redis cache for cacheable endpoints (key by endpoint + rollNumber, 2 min TTL) |
| `components/api/fetchAcademicResult.tsx` | Parallel URL fetch with `Promise.allSettled`, 8s timeout, URL order tweak |

---

## Before vs After (Expected)

| Metric | Before | After |
|--------|--------|--------|
| Time to result page after submit | 2–10+ s (blocked by push setup) | &lt; 1 s (immediate navigation) |
| Repeat same roll number | Full API call every time | Instant from cache (or proxy cache) |
| Duplicate submissions / double mount | Multiple API calls | Single shared request |
| Request timeout | 20 s | 15 s |
| Legacy multi-URL fetcher (worst case) | ~28 s (4 × 7 s) | ~8 s (parallel) |
| Navigate away while loading | Request continues, possible stale UI | Request aborted, no error toast, no wrong state |
| Same roll number (multiple users / refresh) | Every request to upstream API | Up to 2 min served from Redis (when `REDIS_URL` set) |

---

## Requirements Checklist

- Existing behaviour preserved (no features removed).
- No mock data; all data from existing APIs/cache.
- Changes are production-oriented (error handling, optional Redis, abort handling).
- UI/UX unchanged (same forms, result layout, toasts).
- Performance improved for: first load, repeat searches, duplicate calls, and legacy academic result fetcher.

---

## Optional Next Steps

- Add `Cache-Control` or short-lived HTTP cache headers on proxy responses for cacheable endpoints (if you use a CDN).
- Consider prefetching or preconnecting to the proxy/API on the academic result form page to reduce first-request latency.
- If you add more result types, include them in `CACHEABLE_ENDPOINTS` and in the proxy cache key logic where applicable.
