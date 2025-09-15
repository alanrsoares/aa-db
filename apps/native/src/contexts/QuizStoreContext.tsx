import { createContext, ReactNode, useContext, useMemo } from "react";

import { QuizStoreModel, type QuizStore } from "../models/QuizStore";

// Create the context
const QuizStoreContext = createContext<QuizStore | null>(null);

// Provider component
interface QuizStoreProviderProps {
  children: ReactNode;
}

export const QuizStoreProvider = ({ children }: QuizStoreProviderProps) => {
  const quizStore = useMemo(() => QuizStoreModel.create(), []);

  return (
    <QuizStoreContext.Provider value={quizStore}>
      {children}
    </QuizStoreContext.Provider>
  );
};

// Hook to use the QuizStore
export const useQuizStore = () => {
  const context = useContext(QuizStoreContext);
  if (!context) {
    throw new Error("useQuizStore must be used within a QuizStoreProvider");
  }
  return context;
};
