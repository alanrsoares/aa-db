import type { FC, ReactNode } from "react";
import { Text, type TextProps } from "react-native";
import { cva, type VariantProps } from "styled-cva";

const typographyVariants = cva("", {
  variants: {
    variant: {
      // Headings
      h1: "text-6xl font-bold",
      h2: "text-5xl font-bold",
      h3: "text-3xl font-bold",
      h4: "text-2xl font-bold",
      h5: "text-xl font-semibold",
      h6: "text-lg font-semibold",

      // Body text
      body: "text-base",
      bodyLarge: "text-lg",
      bodySmall: "text-sm",
      caption: "text-xs",

      // Specialized
      button: "font-medium text-center",
      label: "text-sm font-medium",
      error: "text-sm",
      code: "text-sm font-mono",
    },
    color: {
      primary: "text-gray-800",
      secondary: "text-gray-700",
      tertiary: "text-gray-600",
      muted: "text-gray-500",
      white: "text-white",
      blue: "text-blue-600",
      blueDark: "text-blue-700",
      blueDarker: "text-blue-800",
      green: "text-green-600",
      red: "text-red-600",
      yellow: "text-yellow-700",
      yellowDark: "text-yellow-800",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    transform: {
      none: "",
      capitalize: "capitalize",
      uppercase: "uppercase",
      lowercase: "lowercase",
    },
    leading: {
      tight: "leading-4",
      normal: "leading-5",
      relaxed: "leading-6",
      loose: "leading-7",
    },
  },
  defaultVariants: {
    variant: "body",
    color: "primary",
    weight: "normal",
    align: "left",
    transform: "none",
    leading: "normal",
  },
});

type TypographyProps = TextProps &
  VariantProps<typeof typographyVariants> & {
    children: ReactNode;
    className?: string;
  };

export const Typography: FC<TypographyProps> = ({
  children,
  variant = "body",
  color = "primary",
  weight = "normal",
  align = "left",
  transform = "none",
  leading = "normal",
  className,
  ...props
}) => {
  return (
    <Text
      className={typographyVariants({
        variant,
        color,
        weight,
        align,
        transform,
        leading,
        className,
      })}
      {...props}
    >
      {children}
    </Text>
  );
};

// Convenience components for common use cases
export const Heading1: FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="h1" {...props} />
);

export const Heading2: FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="h2" {...props} />
);

export const Heading3: FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="h3" {...props} />
);

export const Heading4: FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="h4" {...props} />
);

export const Heading5: FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="h5" {...props} />
);

export const Heading6: FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="h6" {...props} />
);

export const Body: FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="body" {...props} />
);

export const BodyLarge: FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="bodyLarge" {...props} />
);

export const BodySmall: FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="bodySmall" {...props} />
);

export const Caption: FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="caption" {...props} />
);

export const Label: FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="label" {...props} />
);

export const ErrorText: FC<Omit<TypographyProps, "variant" | "color">> = (
  props,
) => <Typography variant="error" color="red" {...props} />;

export const Code: FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="code" {...props} />
);
