// File: /components/common/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from "react";
import Card from "./Card";
import Button from "./Button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <Card className="p-6 max-w-2xl mx-auto mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">
              Something went wrong
            </h2>
            <p className="text-slate-400 mb-4">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <Button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
            >
              Try again
            </Button>
          </Card>
        )
      );
    }

    return this.props.children;
  }
}
