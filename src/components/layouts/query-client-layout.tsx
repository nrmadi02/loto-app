"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/orpc";

export default function QueryClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
