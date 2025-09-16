import type { FC } from "react";
import { TouchableOpacity, View } from "react-native";
import { cva, type VariantProps } from "styled-cva";

import { Typography } from "../ui/Typography";

const buttonVariants = cva("p-4 rounded-lg border-2 mb-3", {
  variants: {
    variant: {
      default: "bg-background border-neutral-dark",
      selected: "bg-info-light border-primary",
      correct: "bg-success-light border-success",
      incorrect: "bg-danger-light border-danger",
      disabled: "bg-background-secondary border-neutral-dark",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type ButtonVariants = VariantProps<typeof buttonVariants>;

const textVariants = cva("flex-1 transition-colors", {
  variants: {
    variant: {
      default: "text-text-secondary",
      selected: "text-info-dark",
      correct: "text-success-dark",
      incorrect: "text-danger-dark",
      disabled: "text-text-muted",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const letterVariants = cva(
  "w-8 h-8 rounded-full items-center justify-center mr-3 transition-colors",
  {
    variants: {
      variant: {
        default: "bg-neutral text-text-secondary",
        selected: "bg-primary text-white",
        correct: "bg-success text-white",
        incorrect: "bg-danger text-white",
        disabled: "bg-neutral-darker text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type Variant = ButtonVariants["variant"];

interface OptionButtonProps {
  option: {
    letter: string;
    text: string;
    id: string;
  };
  variant: Variant;
  onPress: () => void;
  testID?: string;
  className?: string;
  disabled?: boolean;
}

export const OptionButton: FC<OptionButtonProps> = ({
  option,
  variant,
  onPress,
  disabled,
  testID,
  className,
}) => {
  const isDisabled = disabled || variant !== "default";

  return (
    <TouchableOpacity
      className={buttonVariants({ variant, className })}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={isDisabled ? 1 : 0.7}
      testID={testID}
    >
      <View className="flex-row items-center">
        <View className={letterVariants({ variant })}>
          <Typography variant="bodySmall" weight="bold">
            {option.letter}
          </Typography>
        </View>
        <Typography variant="body" className={textVariants({ variant })}>
          {option.text}
        </Typography>
      </View>
    </TouchableOpacity>
  );
};
