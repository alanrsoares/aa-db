import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";

import { QuizRouter } from "./src/components/QuizRouter";
import { QuizStoreProvider } from "./src/contexts/QuizStoreContext";

import "./global.css";

export default function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
            retry: 2,
            refetchOnWindowFocus: false,
            refetchOnMount: true,
            refetchOnReconnect: true,
          },
          mutations: {
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <QuizStoreProvider>
        <QuizRouter />
        <StatusBar style="auto" />
      </QuizStoreProvider>
    </QueryClientProvider>
  );
}
