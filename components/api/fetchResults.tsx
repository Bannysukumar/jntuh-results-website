import axios from "axios";
import { saveToLocalStorage } from "../customfunctions/localStorage";
import { isNative, nativeHttpGet } from "@/lib/native-features";
import { JNTUH_API_BASE_URL, getJntuhApiHeaders } from "@/lib/jntuh-api";
import {
  mapAllResult,
  mapBacklogReport,
  mapCreditsReport,
  mapGraceEligibility,
  mapGraceProof,
  mapRenderResult,
  mapResultContrast,
  renderResultUrl,
} from "@/lib/map-render-result";

import toast from "react-hot-toast";

const UPSTREAM_API_BASE = JNTUH_API_BASE_URL.replace(/\/$/, "");
const NATIVE_API_OPTS = { headers: getJntuhApiHeaders() };

const RESULT_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const RESULT_CACHE_KEY_PREFIX = "jntuh_result_";

const resultMemoryCache = new Map<
  string,
  { data: AcademicResulProps; expiry: number }
>();
const inFlightRequests = new Map<string, Promise<null | AcademicResulProps>>();

function getCachedResult(htno: string): AcademicResulProps | null {
  const key = htno.toUpperCase().trim();
  const cached = resultMemoryCache.get(key);
  if (cached && cached.expiry > Date.now()) return cached.data;
  if (typeof sessionStorage !== "undefined") {
    try {
      const raw = sessionStorage.getItem(RESULT_CACHE_KEY_PREFIX + key);
      if (raw) {
        const { data, expiry } = JSON.parse(raw);
        if (expiry > Date.now() && data && "details" in data) return data as AcademicResulProps;
      }
    } catch {
      // ignore
    }
  }
  return null;
}

function setCachedResult(htno: string, data: AcademicResulProps): void {
  const key = htno.toUpperCase().trim();
  const expiry = Date.now() + RESULT_CACHE_TTL_MS;
  resultMemoryCache.set(key, { data, expiry });
  if (typeof sessionStorage !== "undefined") {
    try {
      sessionStorage.setItem(
        RESULT_CACHE_KEY_PREFIX + key,
        JSON.stringify({ data, expiry })
      );
    } catch {
      // ignore
    }
  }
}

async function loadRenderPayload(htno: string, signal?: AbortSignal | null) {
  const url = renderResultUrl(htno);
  const response = isNative()
    ? await nativeHttpGet(url, { timeout: 60 * 1000 })
    : await axios.get(url, {
        timeout: 60 * 1000,
        validateStatus: () => true,
        signal: signal ?? undefined,
      });
  if ((response.status ?? 200) !== 200) return null;
  return response.data ?? response;
}

async function fetchAcademicResultFromApi(
  htno: string,
  signal?: AbortSignal | null
): Promise<{ status: number; data: any }> {
  const payload = await loadRenderPayload(htno, signal);
  const mapped = payload ? mapRenderResult(payload) : null;
  if (mapped) return { status: 200, data: mapped };
  return { status: payload ? 422 : 502, data: payload };
}

export const fetchAcademicResult = async (
  htno: string,
  options?: { signal?: AbortSignal | null }
): Promise<null | AcademicResulProps> => {
  const key = htno?.toUpperCase?.()?.trim?.() || "";
  if (!key || key.length < 10) return null;

  const cached = getCachedResult(key);
  if (cached) {
    toast.success("Result loaded from cache");
    return cached;
  }

  let promise = inFlightRequests.get(key);
  if (promise) return promise;

  const signal = options?.signal;
  promise = (async (): Promise<null | AcademicResulProps> => {
    try {
      toast.loading("Fetching result...");

      const response = await fetchAcademicResultFromApi(htno, signal);

      switch (response.status) {
        case 200: {
          if (response.data && "details" in response.data) {
            toast.dismiss();
            toast.success("Result fetched successfully");
            setCachedResult(key, response.data as AcademicResulProps);
            return response.data as AcademicResulProps;
          }
          break;
        }

        case 202: {
          toast.dismiss();
          toast(
            response.data?.message ||
              "Result is being prepared. Please check again shortly.",
          );
          return null;
        }

        case 409: {
          toast.dismiss();
          toast.error(
            response.data?.message || "This roll number is already in the queue.",
          );
          return null;
        }
        case 423: {
          toast.dismiss();
          toast.error(
            response.data?.message ||
              "Server is temporarily overloaded. Please try again later.",
          );
          return null;
        }
        case 424: {
          toast.dismiss();
          toast.error(
            response.data?.message ||
              "Upstream JNTUH servers are down. Try again later.",
          );
          return null;
        }

        case 502: {
          toast.dismiss();
          toast.error("Upstream JNTUH servers are down. Try again later.");
          return null;
        }

        case 503: {
          toast.dismiss();
          toast.error("Server overloaded. Please try again later.");
          return null;
        }

        case 500: {
          toast.dismiss();
          toast.error("Unexpected server error occurred.");
          return null;
        }

        default: {
          toast.dismiss();
          toast.error("Unhandled response from server.");
          return null;
        }
      }

      toast.dismiss();
      return null;
    } catch (e: any) {
      toast.dismiss();
      const isAbort = e?.name === "AbortError" || e?.code === "ERR_CANCELED";
      if (isAbort) throw e;

      const isAxiosError = axios.isAxiosError ? axios.isAxiosError(e) : false;
      const isTimeoutError =
        e.code === "ECONNABORTED" || e.message?.includes("timeout");

      if (isTimeoutError) {
        toast.error("Request timed out. Try again later.");
      } else if (isAxiosError && e.response) {
        toast.error(`Server error: ${e.response.status}`);
      } else if (e.status) {
        toast.error(`Server error: ${e.status}`);
      } else {
        toast.error("Network issue. Please check your connection.");
      }

      return null;
    } finally {
      inFlightRequests.delete(key);
    }
  })();

  inFlightRequests.set(key, promise);
  return promise;
};
function reportRenderError(error: any) {
  const isTimeoutError =
    error?.code === "ECONNABORTED" || error?.message?.includes("timeout");
  if (isTimeoutError) toast.error("Request timed out. Try again later.");
  else toast.error("Network issue. Please check your connection.");
}

export const fetchAllResult = async (
  htno: string,
  options?: { signal?: AbortSignal | null }
) => {
  try {
    toast.loading("Fetching result...");
    const payload = await loadRenderPayload(htno, options?.signal);
    const mapped = payload ? mapAllResult(payload) : null;
    if (mapped) {
      saveToLocalStorage(htno + "-AllResult", JSON.stringify(mapped));
      toast.dismiss();
      toast.success("Result fetched successfully");
      return true;
    }
    toast.dismiss();
    toast.error("Result not found.");
    return false;
  } catch (e: any) {
    toast.dismiss();
    if (e?.name === "AbortError" || e?.code === "ERR_CANCELED") throw e;
    reportRenderError(e);
    return false;
  }
};
export const fetchBacklogReport = async (
  htno: string,
  options?: { signal?: AbortSignal | null }
) => {
  try {
    const payload = await loadRenderPayload(htno, options?.signal);
    const mapped = payload ? mapBacklogReport(payload) : null;
    if (mapped) {
      saveToLocalStorage(htno + "-Backlogreport", JSON.stringify(mapped));
      return true;
    }
    return false;
  } catch (e: any) {
    toast.dismiss();
    if (e?.name === "AbortError" || e?.code === "ERR_CANCELED") throw e;
    toast.error("SERVER ISSUE!!");
    return false;
  }
};

export const fetchCreditsCheckerReport = async (
  htno: string,
  options?: { signal?: AbortSignal | null }
) => {
  try {
    toast.loading("Result are been fetched");
    const payload = await loadRenderPayload(htno, options?.signal);
    const mapped = payload ? mapCreditsReport(payload) : null;
    if (mapped && mapped.results.academicYears.length > 0) {
      saveToLocalStorage(htno + "-CreditsCheckerreport", JSON.stringify(mapped));
      toast.dismiss();
      return true;
    }
    toast.dismiss();
    toast.error("Result not found.");
    return false;
  } catch (e: any) {
    toast.dismiss();
    if (e?.name === "AbortError" || e?.code === "ERR_CANCELED") throw e;
    toast.error("SERVER ISSUE!!");
    return false;
  }
};

export const fetchCreditContrastReport = async (
  htno1: string,
  htno2: string,
  options?: { signal?: AbortSignal | null }
) => {
  try {
    if (htno1.trim().toUpperCase() === htno2.trim().toUpperCase()) {
      toast.error("Enter two different hall ticket numbers.");
      return false;
    }
    toast.loading("Result are been fetched");
    const [first, second] = await Promise.all([
      loadRenderPayload(htno1, options?.signal),
      loadRenderPayload(htno2, options?.signal),
    ]);
    const mapped = first && second ? mapResultContrast(first, second) : null;
    if (mapped) {
      saveToLocalStorage(
        htno1 + "-" + htno2 + "-CreditContrastreport",
        JSON.stringify(mapped),
      );
      toast.dismiss();
      return true;
    }
    toast.dismiss();
    toast.error("Result not found.");
    return false;
  } catch (error: any) {
    toast.dismiss();
    if (error?.name === "AbortError" || error?.code === "ERR_CANCELED") throw error;
    toast.error("SERVER ISSUE!!");
    return false;
  }
};

const NOTIFICATIONS_CACHE_TTL_MS = 2 * 60 * 1000; // 2 min
const notificationsCache = new Map<string, { data: Result[] | null; expiry: number }>();
let latestNotificationsCache: { data: Result[] | null; expiry: number } | null = null;

function getNotificationsCacheKey(params: Params): string {
  return `notif_${params.page}_${params.degree}_${params.regulation}_${params.title}_${params.year}`;
}

export const fetchNotifications = async (params: Params): Promise<Result[] | null> => {
  const key = getNotificationsCacheKey(params);
  const cached = notificationsCache.get(key);
  if (cached && cached.expiry > Date.now()) return cached.data;

  try {
    const baseUrl = isNative()
      ? UPSTREAM_API_BASE
      : "";
    const url: string = isNative()
      ? `${baseUrl}/notifications?page=${params.page}&degree=${params.degree}&regulation=${params.regulation}&title=${params.title}&year=${params.year}`
      : `/api/proxy?endpoint=notifications&page=${params.page}&degree=${params.degree}&regulation=${params.regulation}&title=${params.title}&year=${params.year}`;
    const response = isNative()
      ? await nativeHttpGet(url, NATIVE_API_OPTS)
      : await axios.get(url, { timeout: 12000 });

    if (response.status === 200) {
      if (response.data?.status === "success") return null;
      const data = response.data;
      notificationsCache.set(key, {
        data: Array.isArray(data) ? data : data?.results ?? null,
        expiry: Date.now() + NOTIFICATIONS_CACHE_TTL_MS,
      });
      return Array.isArray(data) ? data : data?.results ?? null;
    }
    return null;
  } catch (error) {
    console.error("An error occurred while fetching notifications:", error);
    return null;
  }
};

export const fetchClassResult = async (
  htno: string,
  type: string = "academicresult",
  options?: { signal?: AbortSignal | null }
) => {
  try {
    toast.loading("Result are been fetched");
    const payload = await loadRenderPayload(htno, options?.signal);
    const mapped = payload ? mapRenderResult(payload) : null;
    if (mapped) {
      saveToLocalStorage(
        htno + "-ClassResult-" + type,
        JSON.stringify([mapped]),
      );
      toast.dismiss();
      return true;
    }
    toast.dismiss();
    toast.error("Result not found.");
    return false;
  } catch (e: any) {
    toast.dismiss();
    if (e?.name === "AbortError" || e?.code === "ERR_CANCELED") throw e;
    toast.error("SERVER ISSUE!!");
    return false;
  }
};

export const fetchGraceMarksEligibility = async (
  htno: string,
  options?: { signal?: AbortSignal | null }
) => {
  try {
    toast.loading("Checking grace marks eligibility...");
    const payload = await loadRenderPayload(htno, options?.signal);
    const mapped = payload ? mapGraceEligibility(payload) : null;
    if (mapped) {
      saveToLocalStorage(htno + "-GraceMarksEligibility", JSON.stringify(mapped));
      toast.dismiss();
      toast.success("Eligibility checked successfully");
      return true;
    }
    toast.dismiss();
    toast.error("Result not found.");
    return false;
  } catch (error: any) {
    toast.dismiss();
    if (error?.name === "AbortError" || error?.code === "ERR_CANCELED") throw error;
    toast.error("SERVER ISSUE!!");
    return false;
  }
};

export const fetchGraceMarksProof = async (
  htno: string,
  options?: { signal?: AbortSignal | null }
) => {
  try {
    toast.loading("Fetching grace marks proof...");
    const payload = await loadRenderPayload(htno, options?.signal);
    const mapped = payload ? mapGraceProof(payload) : null;
    if (mapped) {
      saveToLocalStorage(htno + "-GraceMarksProof", JSON.stringify(mapped));
      toast.dismiss();
      toast.success("Proof fetched successfully");
      return true;
    }
    toast.dismiss();
    toast.error("Result not found.");
    return false;
  } catch (error: any) {
    toast.dismiss();
    if (error?.name === "AbortError" || error?.code === "ERR_CANCELED") throw error;
    toast.error("SERVER ISSUE!!");
    return false;
  }
};

export const fetchLatestNotifications = async (): Promise<Result[] | null> => {
  if (latestNotificationsCache && latestNotificationsCache.expiry > Date.now()) {
    return latestNotificationsCache.data;
  }
  try {
    const url = `/api/getlatestnotifications`;
    const response = await axios.get(url, {
      timeout: 12000,
      validateStatus: (status) => status < 500,
    });

    if (response.status === 200) {
      if (response.data?.status === "success" || response.data?.status === "failure") {
        return null;
      }
      let data: Result[] | null = null;
      if (Array.isArray(response.data)) {
        data = response.data;
      } else if (response.data?.notifications && Array.isArray(response.data.notifications)) {
        data = response.data.notifications;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        data = response.data.data;
      } else if (response.data?.results && Array.isArray(response.data.results)) {
        data = response.data.results;
      }
      latestNotificationsCache = {
        data,
        expiry: Date.now() + NOTIFICATIONS_CACHE_TTL_MS,
      };
      return data;
    }
    return null;
  } catch (error: any) {
    if (error.response?.status >= 500 || !error.response) {
      console.error("An error occurred while fetching latest notifications:", error);
    }
    return null;
  }
};
