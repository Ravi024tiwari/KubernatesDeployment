/**
 * Environment configuration with fallbacks for local and production deployment.
 */
export const env = {
  API_URL:
    process.env.NEXT_PUBLIC_API_URL ||
    (typeof window !== "undefined"
      ? "http://localhost:5000/api"
      : process.env.INTERNAL_API_URL || "http://localhost:5000/api"),
  NODE_ENV: process.env.NODE_ENV || "development",
  IS_PROD: process.env.NODE_ENV === "production",
} as const;
