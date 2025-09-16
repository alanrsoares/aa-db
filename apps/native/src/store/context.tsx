import { createContext, useContext, type ReactNode } from "react";

import { QuizStoreModel, type QuizStore } from "~/store";

const QuizStoreContext = createContext<QuizStore | null>(null);

interface QuizStoreProviderProps {
  children: ReactNode;
}

let quizStore: QuizStore | null = null;

export function QuizStoreProvider({ children }: QuizStoreProviderProps) {
  if (!quizStore) {
    quizStore = QuizStoreModel.create();
  }

  return (
    <QuizStoreContext.Provider value={quizStore}>
      {children}
    </QuizStoreContext.Provider>
  );
}

export function useQuizStore() {
  const context = useContext(QuizStoreContext);
  if (!context) {
    throw new Error("useQuizStore must be used within a QuizStoreProvider");
  }
  return context;
}
