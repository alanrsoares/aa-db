import type { FC } from "react";
import { TouchableOpacity, View } from "react-native";

import { Typography } from "../ui/Typography";

interface OptionButtonProps {
  option: {
    letter: string;
    text: string;
    id: string;
  };
  isSelected: boolean;
  isCorrect?: boolean;
  isIncorrect?: boolean;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
}

export const OptionButton: FC<OptionButtonProps> = ({
  option,
  isSelected,
  isCorrect,
  isIncorrect,
  onPress,
  disabled = false,
  testID,
}) => {
  const getButtonStyle = () => {
    if (disabled) {
      if (isCorrect) return "bg-success-light border-success";
      if (isIncorrect) return "bg-danger-light border-danger";
      return "bg-background-secondary border-neutral-dark";
    }

    if (isSelected) {
      return "bg-info-light border-primary";
    }

    return "bg-background border-neutral-dark";
  };

  const getTextStyle = () => {
    if (disabled) {
      if (isCorrect) return "text-success-dark";
      if (isIncorrect) return "text-danger-dark";
      return "text-text-muted";
    }

    if (isSelected) {
      return "text-info-dark";
    }

    return "text-text-secondary";
  };

  const getLetterStyle = () => {
    if (disabled) {
      if (isCorrect) return "bg-success text-white";
      if (isIncorrect) return "bg-danger text-white";
      return "bg-neutral-darker text-white";
    }

    if (isSelected) {
      return "bg-primary text-white";
    }

    return "bg-neutral text-text-secondary";
  };

  return (
    <TouchableOpacity
      className={`p-4 rounded-lg border-2 mb-3 ${getButtonStyle()}`}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7}
      testID={testID}
    >
      <View className="flex-row items-center">
        <View
          className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${getLetterStyle()}`}
        >
          <Typography variant="bodySmall" weight="bold">
            {option.letter}
          </Typography>
        </View>
        <Typography variant="body" className={`flex-1 ${getTextStyle()}`}>
          {option.text}
        </Typography>
      </View>
    </TouchableOpacity>
  );
};
