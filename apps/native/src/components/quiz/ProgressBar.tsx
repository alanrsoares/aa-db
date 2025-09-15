import { observer } from "mobx-react-lite";
import { Text, View } from "react-native";

interface ProgressBarProps {
  current: number;
  total: number;
  percentage: number;
  showNumbers?: boolean;
}

export const ProgressBar = observer(
  ({ current, total, percentage, showNumbers = true }: ProgressBarProps) => {
    return (
      <View className="w-full mb-6">
        {showNumbers && (
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm font-medium text-gray-600">
              Question {current} of {total}
            </Text>
            <Text className="text-sm font-medium text-gray-600">
              {Math.round(percentage)}%
            </Text>
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
  },
);
