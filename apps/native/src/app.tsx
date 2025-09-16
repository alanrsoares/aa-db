import { QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { useState, type FC, type PropsWithChildren } from "react";

import { QuizRouter } from "~/components/QuizRouter";
import { createQueryClient } from "~/lib/queryClient";
import { QuizStoreProvider } from "~/store/context";

const WithProviders: FC<PropsWithChildren> = ({ children }) => {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <QuizStoreProvider>{children}</QuizStoreProvider>
    </QueryClientProvider>
  );
};

export default function App() {
  return (
    <WithProviders>
      <QuizRouter />
      <StatusBar />
    </WithProviders>
  );
}
