import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Enterprise Todo Platform | Production-Grade Next.js",
  description:
    "A production-grade Todo task management system built with Next.js App Router, Express, and MongoDB, container-ready for Kubernetes.",
  keywords: ["Next.js", "App Router", "Node.js", "Express", "MongoDB", "Kubernetes", "Docker"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-50">
        <Header />
        <main className="flex-1 mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
