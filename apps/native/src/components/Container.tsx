import type { FC, PropsWithChildren } from "react";
import { SafeAreaView } from "react-native";

export const Container: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SafeAreaView className="flex flex-1 p-6 bg-background">
      {children}
    </SafeAreaView>
  );
};
