// @ts-ignore
/// <reference types="nativewind/types" />

// import og Alert

declare module "react-native" {
  type StyleableComponent<T = Record<string, unknown>> = React.ComponentType<
    {
      className?: string;
      children?: any;
    } & T
  >;

  export const Alert: {
    alert: (
      title: string,
      message: string,
      buttons?: { text: string; onPress: () => void }[],
    ) => void;
  };

  export const ActivityIndicator: React.ComponentType<{
    size?: "small" | "large";
    color?: string;
  }>;

  export const View: StyleableComponent;
  export const Text: StyleableComponent;
  export const TouchableOpacity: StyleableComponent;
  export const ScrollView: StyleableComponent;
  export const Image: StyleableComponent<ImageProps>;
  export const SafeAreaView: StyleableComponent;
  export const StatusBar: StyleableComponent;
}
