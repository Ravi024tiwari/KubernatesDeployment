import { env } from "./env";
import { ApiError, ApiResponse } from "@/types/api.types";

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  timeoutMs?: number;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { params, timeoutMs = 10000, headers, ...restOptions } = options;

  let url = `${env.API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const json: ApiResponse<T> = await response.json().catch(() => ({
      success: false,
      message: `Failed to parse response (Status: ${response.status})`,
      data: null as unknown as T,
    }));

    if (!response.ok || !json.success) {
      throw new ApiError(
        json.message || `Request failed with status ${response.status}`,
        response.status,
        json.errors
      );
    }

    return json.data;
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError("Request timed out. Please try again.", 408);
    }

    // Friendly message when backend is offline or unreachable
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new ApiError(
        `Cannot connect to backend API (${env.API_URL}). Please verify your backend service is running and accessible.`,
        503
      );
    }

    const message =
      error instanceof Error
        ? error.message
        : "An unexpected network error occurred";
    throw new ApiError(message, 500);
  }
}
