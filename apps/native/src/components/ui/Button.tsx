import type { FC } from "react";
import {
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
} from "react-native";
import { cva, type VariantProps } from "styled-cva";

const buttonVariants = cva(
  "rounded-lg border font-medium items-center justify-center",
  {
    variants: {
      variant: {
        primary: "bg-primary border-primary",
        secondary: "bg-neutral border-neutral",
        outline: "bg-background border-neutral-dark",
        ghost: "bg-transparent border-transparent",
        success: "bg-success border-success",
        danger: "bg-danger border-danger",
        warning: "bg-warning border-warning",
      },
      size: {
        sm: "px-3 py-2",
        md: "px-4 py-2",
        lg: "px-6 py-3",
        xl: "p-4",
      },
      disabled: {
        true: "opacity-50",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      disabled: false,
    },
  },
);

const textVariants = cva("font-medium text-center", {
  variants: {
    variant: {
      primary: "text-white",
      secondary: "text-text-secondary",
      outline: "text-text-secondary",
      ghost: "text-text-secondary",
      success: "text-white",
      danger: "text-white",
      warning: "text-white",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-base",
      xl: "text-lg",
    },
    disabled: {
      true: "opacity-50",
      false: "",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
    disabled: false,
  },
});

type ButtonProps = TouchableOpacityProps &
  VariantProps<typeof buttonVariants> & {
    testID?: string;
  };

export const Button: FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  className,
  testID,
  onPress,
  ...props
}) => {
  return (
    <TouchableOpacity
      className={buttonVariants({ variant, size, disabled, className })}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7}
      testID={testID}
      {...props}
    >
      {typeof children === "string" ? (
        <Text className={textVariants({ variant, size, disabled })}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};
