import { TouchableOpacity, Text, View } from "react-native";

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
}

export const OptionButton = ({
  option,
  isSelected,
  isCorrect,
  isIncorrect,
  onPress,
  disabled = false,
}: OptionButtonProps) => {
  const getButtonStyle = () => {
    if (disabled) {
      if (isCorrect) return "bg-green-100 border-green-500";
      if (isIncorrect) return "bg-red-100 border-red-500";
      return "bg-gray-100 border-gray-300";
    }
    
    if (isSelected) {
      return "bg-blue-100 border-blue-500";
    }
    
    return "bg-white border-gray-300";
  };

  const getTextStyle = () => {
    if (disabled) {
      if (isCorrect) return "text-green-700";
      if (isIncorrect) return "text-red-700";
      return "text-gray-500";
    }
    
    if (isSelected) {
      return "text-blue-700";
    }
    
    return "text-gray-700";
  };

  const getLetterStyle = () => {
    if (disabled) {
      if (isCorrect) return "bg-green-500 text-white";
      if (isIncorrect) return "bg-red-500 text-white";
      return "bg-gray-400 text-white";
    }
    
    if (isSelected) {
      return "bg-blue-500 text-white";
    }
    
    return "bg-gray-200 text-gray-700";
  };

  return (
    <TouchableOpacity
      className={`p-4 rounded-lg border-2 mb-3 ${getButtonStyle()}`}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7}
    >
      <View className="flex-row items-center">
        <View className={`w-8 h-8 rounded-full items-center justify-center mr-3 ${getLetterStyle()}`}>
          <Text className="font-bold text-sm">{option.letter}</Text>
        </View>
        <Text className={`flex-1 text-base ${getTextStyle()}`}>
          {option.text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
