import type {
  ActivityIndicatorProps,
  ImageProps,
  SafeAreaViewProps,
  ScrollViewProps,
  TextProps,
  TouchableOpacityProps,
  ViewProps,
} from "react-native";

declare module "react-native" {
  type StyleableComponent<T = Record<string, unknown>> = React.ComponentType<
    {
      className?: string;
      children?: any;
    } & T
  >;

  export const ActivityIndicator: React.ComponentType<ActivityIndicatorProps>;

  export const View: StyleableComponent<ViewProps>;
  export const Text: StyleableComponent<TextProps>;
  export const TouchableOpacity: StyleableComponent<TouchableOpacityProps>;
  export const ScrollView: StyleableComponent<ScrollViewProps>;
  export const Image: StyleableComponent<ImageProps>;
  export const SafeAreaView: StyleableComponent<SafeAreaViewProps>;
  export const StatusBar: StyleableComponent<StatusBarProps>;
}
