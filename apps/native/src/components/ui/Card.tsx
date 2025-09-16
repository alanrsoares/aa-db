import type { FC } from "react";
import { Text, View, type TouchableOpacityProps } from "react-native";
import { cva } from "styled-cva";

interface CardProps extends TouchableOpacityProps {
  label: string;
  description: string;
  selected: boolean;
}

export const cardVariants = cva(`p-4 rounded-lg border-2`, {
  variants: {
    selected: {
      true: "border-primary bg-primary/10",
      false: "border-neutral bg-background",
    },
  },
});

export const labelVariants = cva(`text-lg font-medium`, {
  variants: {
    selected: {
      true: "text-info-dark",
      false: "text-text-secondary",
    },
  },
});

export const descriptionVariants = cva(`text-sm mt-1`, {
  variants: {
    selected: {
      true: "text-info",
      false: "text-text-muted",
    },
  },
});

export const Card: FC<CardProps> = ({
  label,
  description,
  selected,
  className,
  ...props
}) => {
  return (
    <View className={cardVariants({ selected, className })} {...props}>
      <Text className={labelVariants({ selected })}>{label}</Text>
      <Text className={descriptionVariants({ selected })}>{description}</Text>
    </View>
  );
};
