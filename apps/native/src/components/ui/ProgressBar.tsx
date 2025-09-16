import type { FC } from "react";
import { View } from "react-native";

import { Typography } from "./Typography";

interface ProgressBarProps {
  current: number;
  total: number;
  percentage: number;
  showNumbers?: boolean;
}

export const ProgressBar: FC<ProgressBarProps> = ({
  current,
  total,
  percentage,
  showNumbers = true,
}) => {
  return (
    <View className="w-full mb-6">
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

      <View className="w-full bg-gray-200 rounded-full h-2">
        <View
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </View>
    </View>
  );
};
