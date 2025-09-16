import {
  Component,
  type ComponentType,
  type ErrorInfo,
  type ReactNode,
} from "react";
import { View } from "react-native";

import { Typography } from "./ui/Typography";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ComponentType<{ error?: Error; resetError: () => void }>;
}

export class ErrorBoundary extends Component<
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

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
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
            <Typography variant="h1" className="mb-4">
              ⚠️
            </Typography>
            <Typography variant="h5" color="red" className="mb-4">
              Something went wrong
            </Typography>
            <Typography color="tertiary" align="center" className="mb-6">
              An unexpected error occurred. Please try refreshing the page.
            </Typography>
            {__DEV__ && this.state.error && (
              <View className="bg-gray-100 p-4 rounded-lg mb-4">
                <Typography variant="code" color="secondary">
                  {this.state.error.message}
                </Typography>
              </View>
            )}
            <View className="bg-blue-500 px-6 py-3 rounded-lg">
              <Typography
                color="white"
                weight="semibold"
                onPress={this.resetError}
              >
                Try Again
              </Typography>
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
      <Typography variant="h1" className="mb-4">
        ⚠️
      </Typography>
      <Typography variant="h5" color="red" className="mb-4">
        Something went wrong
      </Typography>
      <Typography color="tertiary" align="center" className="mb-6">
        An unexpected error occurred. Please try refreshing the page.
      </Typography>
      {__DEV__ && error && (
        <View className="bg-gray-100 p-4 rounded-lg mb-4">
          <Typography variant="code" color="secondary">
            {error.message}
          </Typography>
        </View>
      )}
      <View className="bg-blue-500 px-6 py-3 rounded-lg">
        <Typography color="white" weight="semibold" onPress={resetError}>
          Try Again
        </Typography>
      </View>
    </View>
  </View>
);
