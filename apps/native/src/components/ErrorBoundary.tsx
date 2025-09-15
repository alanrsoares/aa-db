import React from "react";
import { Text, View } from "react-native";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            resetError={this.resetError}
          />
        );
      }

      return (
        <View className="flex-1 justify-center items-center p-6 bg-white">
          <View className="items-center">
            <Text className="text-6xl mb-4">⚠️</Text>
            <Text className="text-xl font-bold text-red-600 mb-4">
              Something went wrong
            </Text>
            <Text className="text-gray-600 text-center mb-6">
              An unexpected error occurred. Please try refreshing the page.
            </Text>
            {__DEV__ && this.state.error && (
              <View className="bg-gray-100 p-4 rounded-lg mb-4">
                <Text className="text-sm text-gray-700 font-mono">
                  {this.state.error.message}
                </Text>
              </View>
            )}
            <View className="bg-blue-500 px-6 py-3 rounded-lg">
              <Text
                className="text-white font-semibold"
                onPress={this.resetError}
              >
                Try Again
              </Text>
            </View>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

// Default fallback component
export const DefaultErrorFallback = ({
  error,
  resetError,
}: {
  error?: Error;
  resetError: () => void;
}) => (
  <View className="flex-1 justify-center items-center p-6 bg-white">
    <View className="items-center">
      <Text className="text-6xl mb-4">⚠️</Text>
      <Text className="text-xl font-bold text-red-600 mb-4">
        Something went wrong
      </Text>
      <Text className="text-gray-600 text-center mb-6">
        An unexpected error occurred. Please try refreshing the page.
      </Text>
      {__DEV__ && error && (
        <View className="bg-gray-100 p-4 rounded-lg mb-4">
          <Text className="text-sm text-gray-700 font-mono">
            {error.message}
          </Text>
        </View>
      )}
      <View className="bg-blue-500 px-6 py-3 rounded-lg">
        <Text className="text-white font-semibold" onPress={resetError}>
          Try Again
        </Text>
      </View>
    </View>
  </View>
);
