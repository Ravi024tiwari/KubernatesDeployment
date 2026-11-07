/**
 * Dynamic API URL resolver:
 * - Browser on localhost: points to http://localhost:5000/api for local development.
 * - Browser in production (e.g. AWS ALB domain): points to "/api" (relative to origin).
 * - Server-side (SSR): points to INTERNAL_API_URL (Kubernetes cluster DNS) or localhost:5000.
 */
export function getApiUrl(): string {
  if (typeof window !== "undefined") {
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    }

    const publicUrl = process.env.NEXT_PUBLIC_API_URL;
    if (publicUrl && !publicUrl.includes("localhost")) {
      return publicUrl;
    }
    return "/api";
  }

  return (
    process.env.INTERNAL_API_URL ||
    (process.env.NEXT_PUBLIC_API_URL && !process.env.NEXT_PUBLIC_API_URL.includes("localhost")
      ? process.env.NEXT_PUBLIC_API_URL
      : "http://localhost:5000/api")
  );
}

export const env = {
  get API_URL() {
    return getApiUrl();
  },
  NODE_ENV: process.env.NODE_ENV || "development",
  IS_PROD: process.env.NODE_ENV === "production",
} as const;
