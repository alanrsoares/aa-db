import type { Category } from "@roadcodetests/core";
import { Text, View } from "react-native";

import { useRandomQuestions } from "../hooks/useQuizQueries";
import { EditScreenInfo } from "./EditScreenInfo";

type ScreenContentProps = {
  title: string;
  path: string;
  children?: React.ReactNode;
};

export const ScreenContent = ({
  title,
  path,
  children,
}: ScreenContentProps) => {
  const {
    data: questions,
    isLoading,
    error,
  } = useRandomQuestions("car", "core", 1, true);

  const question = questions && questions.length > 0 ? questions[0] : null;

  return (
    <View className={styles.container}>
      <Text className={styles.title}>{title}</Text>
      <View className={styles.separator} />

      {question && <Text className={styles.title}>{question.question}</Text>}
      <EditScreenInfo path={path} />
      {children}
    </View>
  );
};
const styles = {
  container: `items-center flex-1 justify-center`,
  separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
  title: `text-xl font-bold`,
};
