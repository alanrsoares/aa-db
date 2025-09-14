import {
  Category,
  DrivingTestQuestionWithKey,
  questionsClient,
} from "@roadcodetests/core";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { EditScreenInfo } from "./EditScreenInfo";

type ScreenContentProps = {
  title: string;
  path: string;
  children?: React.ReactNode;
};

function useQuestionsClient() {
  return questionsClient;
}

export const ScreenContent = ({
  title,
  path,
  children,
}: ScreenContentProps) => {
  const questionsClient = useQuestionsClient();

  const [question, setQuestion] =
    useState<DrivingTestQuestionWithKey<Category> | null>(null);

  useEffect(() => {
    questionsClient.getRandomQuestion().caseOf({
      Left: (error) => {
        console.error(error);
      },
      Right: (question) => {
        setQuestion(question);
      },
    });
  }, []);

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
