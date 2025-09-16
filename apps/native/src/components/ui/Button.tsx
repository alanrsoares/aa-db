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
        primary: "bg-blue-500 border-blue-500",
        secondary: "bg-gray-200 border-gray-200",
        outline: "bg-white border-gray-300",
        ghost: "bg-transparent border-transparent",
        success: "bg-green-500 border-green-500",
        danger: "bg-red-500 border-red-500",
        warning: "bg-yellow-500 border-yellow-500",
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
      secondary: "text-gray-700",
      outline: "text-gray-700",
      ghost: "text-gray-700",
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

type ButtonProps = TouchableOpacityProps & VariantProps<typeof buttonVariants>;

export const Button: FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  className,
  onPress,
  ...props
}) => {
  return (
    <TouchableOpacity
      className={buttonVariants({ variant, size, disabled, className })}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7}
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
