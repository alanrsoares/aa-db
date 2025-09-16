import type { FC } from "react";
import { View } from "react-native";

import { Typography } from "./Typography";

interface ProgressBarProps {
  current: number;
  total: number;
  percentage: number;
  showNumbers?: boolean;
  testID?: string;
}

export const ProgressBar: FC<ProgressBarProps> = ({
  current,
  total,
  percentage,
  showNumbers = true,
  testID,
}) => {
  return (
    <View className="w-full mb-6" testID={testID}>
      {showNumbers && (
        <View className="flex-row justify-between items-center mb-2">
          <Typography variant="bodySmall" weight="medium" color="tertiary">
            Question {current} of {total}
          </Typography>
          <Typography variant="bodySmall" weight="medium" color="tertiary">
            {Math.round(percentage)}%
          </Typography>
        </View>
      )}

      <View className="w-full bg-neutral rounded-full h-2">
        <View
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </View>
    </View>
  );
};
