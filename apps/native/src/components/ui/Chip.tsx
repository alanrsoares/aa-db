import type { FC } from "react";
import {
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
} from "react-native";
import { cva } from "styled-cva";

interface ChipProps extends TouchableOpacityProps {
  label: string;
  selected: boolean;
  testID?: string;
}

const chipVariants = cva(`px-4 py-2 rounded-full border`, {
  variants: {
    selected: {
      true: "border-blue-500 bg-blue-500",
      false: "border-gray-300 bg-white",
    },
  },
});

const labelVariants = cva(`text-sm font-medium`, {
  variants: {
    selected: {
      true: "text-white",
      false: "text-gray-700",
    },
  },
});

export const Chip: FC<ChipProps> = ({
  label,
  selected,
  onPress,
  className,
  testID,
  ...props
}: ChipProps) => {
  return (
    <TouchableOpacity
      className={chipVariants({ selected, className })}
      onPress={onPress}
      testID={testID}
      {...props}
    >
      <Text className={labelVariants({ selected })}>{label}</Text>
    </TouchableOpacity>
  );
};
