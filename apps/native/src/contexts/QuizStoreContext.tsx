import { createContext, ReactNode, useContext } from "react";

import { QuizStoreModel, type QuizStore } from "../models/QuizStore";

// Create the context
const QuizStoreContext = createContext<QuizStore | null>(null);

// Provider component
interface QuizStoreProviderProps {
  children: ReactNode;
}

export const QuizStoreProvider = ({ children }: QuizStoreProviderProps) => {
  const quizStore = QuizStoreModel.create();

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
