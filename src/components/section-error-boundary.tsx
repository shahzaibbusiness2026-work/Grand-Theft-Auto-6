"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
}

/**
 * Error boundary for card grids and content sections.
 * Prevents a single crashing component from blanking the entire page.
 */
export class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("SectionErrorBoundary caught:", error.message);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="card-surface flex flex-col items-center justify-center gap-3 rounded-2xl border border-border p-8 text-center">
          <AlertTriangle className="h-8 w-8 text-gold" aria-hidden="true" />
          <p className="font-semibold text-foreground">
            {this.props.fallbackTitle || "Something went wrong loading this section."}
          </p>
          <p className="text-sm text-muted-foreground">
            Try refreshing the page. If the problem persists, please report it.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => this.setState({ hasError: false })}
            className="mt-2"
          >
            <RefreshCw className="h-4 w-4 mr-1.5" aria-hidden="true" /> Try again
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
